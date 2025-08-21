import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as RBCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, format, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

type Booking = {
  id: string | number;
  title?: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  location?: string;
  meetingUrl?: string;
  attendees?: { email: string; name?: string }[];
  status?: string; // accepted/canceled/...
};

type RBCEvent = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
};

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// ⚠️ Usa EDGE_BASE se existir; senão, cai para VITE_SUPABASE_URL + '/functions/v1'
const EDGE_BASE =
  (import.meta.env.VITE_SUPABASE_EDGE_BASE as string) ||
  (import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : "");

const BOOKING_LINK = import.meta.env.VITE_CAL_BOOKING_LINK || ""; // ex.: https://cal.com/org/tipo

export default function ReunioesPage() {
  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBooking, setOpenBooking] = useState(false);

  // range visível (RBC chama onRangeChange)
  const [range, setRange] = useState<{ start: Date; end: Date }>(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = new Date(start); end.setDate(end.getDate() + 7);
    return { start, end };
  });

  const fetchBookings = useCallback(async (from: Date, to: Date) => {
    if (!EDGE_BASE) { setError("Defina VITE_SUPABASE_EDGE_BASE ou VITE_SUPABASE_URL"); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const qs = new URLSearchParams({
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
      }).toString();
      const res = await fetch(`${EDGE_BASE}/cal-bookings?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Falha ao listar bookings (${res.status})`);
      const data = await res.json();
      // API do Cal.com v2: { data: Booking[] } — nossa função pode repassar como { data }
      const list: Booking[] = data.data ?? data.bookings ?? [];
      const mapped: RBCEvent[] = list.map((b) => ({
        id: b.id,
        title: b.title || "Reunião",
        start: new Date(b.startTime),
        end: new Date(b.endTime),
        resource: b,
      }));
      setEvents(mapped);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar reuniões");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(range.start, range.end); }, [fetchBookings, range.start, range.end]);

  const onRangeChange = useCallback((r: any) => {
    let start: Date, end: Date;
    if (Array.isArray(r)) { start = r[0]; end = r[r.length - 1]; }
    else { start = r.start; end = r.end; }
    setRange({ start, end });
  }, []);

  const onSelectEvent = useCallback(async (evt: RBCEvent) => {
    const b = evt.resource;
    const msg = [
      `Título: ${evt.title}`,
      `Início: ${new Date(b.startTime).toLocaleString()}`,
      `Fim: ${new Date(b.endTime).toLocaleString()}`,
      b.meetingUrl ? `Meet/Link: ${b.meetingUrl}` : "",
      b.location ? `Local: ${b.location}` : "",
      "",
      "Ações: OK = fechar, Cancelar = excluir",
    ].filter(Boolean).join("\n");
    const confirmDelete = !window.confirm(msg);
    if (!confirmDelete) return; // usuário clicou OK (fechar)
    // usuário clicou em "Cancelar" no confirm → vamos excluir
    if (!EDGE_BASE) return;
    try {
      setLoading(true);
      const res = await fetch(`${EDGE_BASE}/cal-bookings/${b.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao cancelar reunião");
      await fetchBookings(range.start, range.end);
    } catch (e: any) {
      setError(e?.message || "Erro ao cancelar");
    } finally {
      setLoading(false);
    }
  }, [fetchBookings, range.start, range.end]);

  const webcalHref = useMemo(() => {
    // Se você tiver feed ICS próprio, troque aqui:
    return "webcal://SEU_DOMINIO/api/reunioes/feed.ics";
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reuniões</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenBooking(true)}
            className="rounded-md border border-bldr-gold px-4 py-2 font-medium text-bldr-gold"
            disabled={!BOOKING_LINK}
            title={!BOOKING_LINK ? "Defina VITE_CAL_BOOKING_LINK" : ""}
          >
            Nova reunião
          </button>
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
        {loading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">Sem reuniões no período.</p>
        ) : (
          <RBCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.WEEK}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            step={30}
            timeslots={2}
            popup
            selectable={false}
            style={{ height: 600 }}
            messages={{
              month: "Mês", week: "Semana", day: "Dia", agenda: "Lista",
              today: "Hoje", previous: "Anterior", next: "Próximo",
              showMore: (t) => `+${t} mais`,
            }}
            onRangeChange={onRangeChange}
            onSelectEvent={onSelectEvent}
          />
        )}
      </div>

      {/* Modal com o widget Cal.com (agenda pronta) */}
      {openBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Agendar reunião</h3>
              <button onClick={async () => {
                setOpenBooking(false);
                // refetch após fechar (usuário pode ter concluído/cancelado no widget)
                await fetchBookings(range.start, range.end);
              }}>Fechar</button>
            </div>
            {BOOKING_LINK ? (
              <iframe
                title="Cal.com widget"
                src={BOOKING_LINK}
                height={700}
                className="w-full"
                style={{ border: 0 }}
              />
            ) : (
              <div className="p-6 text-sm text-red-600">
                Defina VITE_CAL_BOOKING_LINK no .env
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
