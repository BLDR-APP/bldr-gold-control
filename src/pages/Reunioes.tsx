import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, format, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

// ⚠️ Preencha via .env (Vite/CRA). Não comite o ID diretamente.
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "SEU_CLIENT_ID_DO_GOOGLE_AQUI";

// Escopos mínimos: leitura + criação/edição de eventos
const SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";

// Descoberta da API Calendar
const CALENDAR_DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

type GEvent = {
  id: string;
  summary: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  hangoutLink?: string;
  location?: string;
  description?: string;
};

type RBCEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: GEvent;
};

// Localizer do calendário em pt-BR
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Modal simples (mantém padrão de UX: título, fechar, cancelar/salvar)
function Modal({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Salvar",
  loading,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-gray-500">
            Fechar
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-2">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-bldr-gold px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Salvando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReunioesPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // janela visível do calendário
  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(new Date(), { weekStartsOn: 0 }),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  // eventos carregados do Google (RBC)
  const [rbcEvents, setRbcEvents] = useState<RBCEvent[]>([]);

  // modal criar
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formCreate, setFormCreate] = useState({
    summary: "",
    start: "",
    end: "",
    location: "",
    description: "",
    meetLink: false,
  });

  // modal editar (rápido)
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formEdit, setFormEdit] = useState({
    id: "",
    summary: "",
    start: "",
    end: "",
    location: "",
    description: "",
  });

  const tokenClientRef = useRef<any>(null);

  // Carrega scripts GIS + gapi e inicializa cliente
  useEffect(() => {
    async function initGoogle() {
      setLoading(true);
      try {
        // GSI
        await new Promise<void>((resolve, reject) => {
          if (window.google?.accounts?.oauth2) return resolve();
          const s = document.createElement("script");
          s.src = "https://accounts.google.com/gsi/client";
          s.async = true;
          s.defer = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Falha ao carregar Google Identity Services"));
          document.head.appendChild(s);
        });

        // gapi
        await new Promise<void>((resolve, reject) => {
          if (window.gapi?.client) return resolve();
          const s = document.createElement("script");
          s.src = "https://apis.google.com/js/api.js";
          s.async = true;
          s.defer = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Falha ao carregar gapi"));
          document.head.appendChild(s);
        });

        // init gapi client
        await new Promise<void>((resolve, reject) => {
          window.gapi.load("client", async () => {
            try {
              await window.gapi.client.init({ discoveryDocs: [CALENDAR_DISCOVERY_DOC] });
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        });

        // init token client
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: (resp: any) => {
            if (resp.error) {
              setError(resp.error);
              setAuthed(false);
              return;
            }
            setAuthed(true);
            // carrega eventos para a janela atual
            fetchEvents(currentRange.start, currentRange.end);
          },
        });

        // tentar token silencioso
        try {
          tokenClientRef.current.requestAccessToken({ prompt: "" });
        } catch {
          // usuário clicará em Conectar
        }
      } catch (e: any) {
        setError(e?.message || "Erro ao inicializar Google");
      } finally {
        setLoading(false);
      }
    }
    initGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectGoogle = useCallback(() => {
    setError(null);
    tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
  }, []);

  const disconnectGoogle = useCallback(() => {
    try {
      const token = window.gapi?.client?.getToken?.();
      if (token) {
        window.google?.accounts?.oauth2?.revoke?.(token.access_token, () => {
          window.gapi.client.setToken("");
          setAuthed(false);
          setRbcEvents([]);
        });
      }
    } catch {
      // noop
    }
  }, []);

  // Helper: converte eventos Google → RBC
  const toRbc = useCallback((items: GEvent[]): RBCEvent[] => {
    return items
      .map((e) => {
        const startIso = e.start?.dateTime || e.start?.date;
        const endIso = e.end?.dateTime || e.end?.date;
        if (!startIso || !endIso) return null;
        const start = new Date(startIso);
        const end = new Date(endIso);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        return {
          id: e.id,
          title: e.summary || "(Sem título)",
          start,
          end,
          resource: e,
        } as RBCEvent;
      })
      .filter(Boolean) as RBCEvent[];
  }, []);

  // Busca eventos para a janela atual (visível)
  const fetchEvents = useCallback(
    async (from: Date, to: Date) => {
      if (!authed) return;
      try {
        setLoading(true);
        setError(null);

        const timeMin = new Date(from).toISOString();
        const timeMax = new Date(to).toISOString();

        const res = await window.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 2500,
        });

        const items: GEvent[] = res.result.items || [];
        setRbcEvents(toRbc(items));
      } catch (e: any) {
        setError(e?.result?.error?.message || e?.message || "Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    },
    [authed, toRbc]
  );

  // Navegação/alteração de view: atualiza janela e refaz query
  const handleRangeChange = useCallback(
    (range: any, view: string) => {
      // RBC passa formatos diferentes por view; normalizamos para {start, end}
      let start: Date;
      let end: Date;

      if (Array.isArray(range)) {
        // mês retorna um array de datas da grade
        start = range[0];
        end = range[range.length - 1];
      } else {
        start = range.start;
        end = range.end;
      }
      setCurrentRange({ start, end });
      fetchEvents(start, end);
    },
    [fetchEvents]
  );

  // Abertura do modal Criar com seleção de slot
  const handleSelectSlot = useCallback((slot: any) => {
    setFormCreate((f) => ({
      ...f,
      start: slot.start ? toLocalInputValue(slot.start) : "",
      end: slot.end ? toLocalInputValue(slot.end) : "",
    }));
    setOpenCreate(true);
  }, []);

  // Abertura do modal Editar ao clicar evento
  const handleSelectEvent = useCallback((evt: RBCEvent) => {
    const g = evt.resource;
    setFormEdit({
      id: g.id,
      summary: g.summary || "",
      start: toLocalInputValue(g.start?.dateTime || g.start?.date || ""),
      end: toLocalInputValue(g.end?.dateTime || g.end?.date || ""),
      location: g.location || "",
      description: g.description || "",
    });
    setOpenEdit(true);
  }, []);

  // Util: Date -> value para <input type="datetime-local">
  function toLocalInputValue(d: string | Date) {
    const dt = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dt.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const mm = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const mi = pad(dt.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  // Criar evento
  const onCreateSave = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const tz =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";

      const resource: any = {
        summary: formCreate.summary,
        description: formCreate.description || undefined,
        location: formCreate.location || undefined,
        start: { dateTime: new Date(formCreate.start).toISOString(), timeZone: tz },
        end: { dateTime: new Date(formCreate.end).toISOString(), timeZone: tz },
        attendees: [], // opcional: adicione emails aqui
        conferenceData: formCreate.meetLink
          ? { createRequest: { requestId: crypto.randomUUID() } }
          : undefined,
      };

      await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource,
        sendUpdates: "all",
        conferenceDataVersion: formCreate.meetLink ? 1 : 0,
      });

      setOpenCreate(false);
      setFormCreate({
        summary: "",
        start: "",
        end: "",
        location: "",
        description: "",
        meetLink: false,
      });

      // refetch janela atual
      await fetchEvents(currentRange.start, currentRange.end);
    } catch (e: any) {
      setError(e?.result?.error?.message || e?.message || "Erro ao criar evento");
    } finally {
      setCreating(false);
    }
  }, [formCreate, currentRange, fetchEvents]);

  // Editar evento (título/datas/local/descrição)
  const onEditSave = useCallback(async () => {
    setEditing(true);
    setError(null);
    try {
      const tz =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
      const resource: any = {
        summary: formEdit.summary,
        description: formEdit.description || undefined,
        location: formEdit.location || undefined,
        start: { dateTime: new Date(formEdit.start).toISOString(), timeZone: tz },
        end: { dateTime: new Date(formEdit.end).toISOString(), timeZone: tz },
      };

      await window.gapi.client.calendar.events.patch({
        calendarId: "primary",
        eventId: formEdit.id,
        resource,
        sendUpdates: "all",
      });

      setOpenEdit(false);
      await fetchEvents(currentRange.start, currentRange.end);
    } catch (e: any) {
      setError(e?.result?.error?.message || e?.message || "Erro ao salvar alterações");
    } finally {
      setEditing(false);
    }
  }, [formEdit, currentRange, fetchEvents]);

  // (Opcional) Excluir evento rapidamente
  const onEditDelete = useCallback(async () => {
    if (!confirm("Excluir esta reunião?")) return;
    setEditing(true);
    setError(null);
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: formEdit.id,
        sendUpdates: "all",
      });
      setOpenEdit(false);
      await fetchEvents(currentRange.start, currentRange.end);
    } catch (e: any) {
      setError(e?.result?.error?.message || e?.message || "Erro ao excluir");
    } finally {
      setEditing(false);
    }
  }, [formEdit.id, currentRange, fetchEvents]);

  // Link webcal (troque pelo seu feed ICS quando tiver backend)
  const webcalHref = useMemo(() => {
    return "webcal://SEU_DOMINIO/api/reunioes/feed.ics";
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reuniões</h1>
        <div className="flex gap-2">
          {!authed ? (
            <button
              onClick={connectGoogle}
              className="rounded-md bg-bldr-gold px-4 py-2 font-medium text-white"
            >
              Conectar Google Calendar
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpenCreate(true)}
                className="rounded-md border border-bldr-gold px-4 py-2 font-medium text-bldr-gold"
              >
                Criar reunião
              </button>
              <button
                onClick={disconnectGoogle}
                className="rounded-md border px-4 py-2 font-medium"
                title="Desconectar Google"
              >
                Desconectar
              </button>
            </>
          )}
          <a
            href={webcalHref}
            className="rounded-md border border-bldr-gold px-4 py-2 font-medium text-bldr-gold"
          >
            Adicionar ao iPhone Calendar
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-card p-4 shadow min-h-[600px]">
        {loading && !authed ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : (
          <Calendar
            localizer={localizer}
            events={rbcEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.WEEK}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            step={30}
            timeslots={2}
            style={{ height: 600 }}
            popup
            selectable
            messages={{
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Lista",
              today: "Hoje",
              previous: "Anterior",
              next: "Próximo",
              showMore: (total) => `+${total} mais`,
            }}
            onRangeChange={handleRangeChange}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </div>

      {/* Modal Criar */}
      <Modal
        open={openCreate}
        title="Criar reunião"
        onClose={() => setOpenCreate(false)}
        onConfirm={onCreateSave}
        confirmLabel="Criar"
        loading={creating}
      >
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            Título
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formCreate.summary}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, summary: e.target.value }))
              }
              placeholder="Reunião de alinhamento"
            />
          </label>

          <label className="text-sm">
            Início
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formCreate.start}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, start: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Fim
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formCreate.end}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, end: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Local
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formCreate.location}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="Sala 2 ou link externo"
            />
          </label>

          <label className="text-sm">
            Descrição
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
              value={formCreate.description}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Pauta da reunião…"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formCreate.meetLink}
              onChange={(e) =>
                setFormCreate((f) => ({ ...f, meetLink: e.target.checked }))
              }
            />
            Gerar link do Google Meet
          </label>
        </div>
      </Modal>

      {/* Modal Editar/Excluir (rápido) */}
      <Modal
        open={openEdit}
        title="Editar reunião"
        onClose={() => setOpenEdit(false)}
        onConfirm={onEditSave}
        confirmLabel="Salvar"
        loading={editing}
      >
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            Título
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formEdit.summary}
              onChange={(e) =>
                setFormEdit((f) => ({ ...f, summary: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Início
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formEdit.start}
              onChange={(e) =>
                setFormEdit((f) => ({ ...f, start: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Fim
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formEdit.end}
              onChange={(e) =>
                setFormEdit((f) => ({ ...f, end: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Local
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={formEdit.location}
              onChange={(e) =>
                setFormEdit((f) => ({ ...f, location: e.target.value }))
              }
            />
          </label>

          <label className="text-sm">
            Descrição
            <textarea
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={3}
              value={formEdit.description}
              onChange={(e) =>
                setFormEdit((f) => ({ ...f, description: e.target.value }))
              }
            />
          </label>

          <div className="flex justify-end">
            <button
              onClick={onEditDelete}
              className="rounded-md border px-4 py-2 text-red-600"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ReunioesPage()
