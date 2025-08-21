import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as RBCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, format, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { createClient } from "@supabase/supabase-js";

type RBCEvent = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    meeting_url?: string | null;
    location?: string | null;
    status?: string | null;
  };
};

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Supabase client (usa as envs que você já tem)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Link do widget Cal.com
const BOOKING_LINK = import.meta.env.VITE_CAL_BOOKING_LINK || ""; // ex.: https://cal.com/org/tipo

export default function ReunioesPage() {
  const [events, setEvents] = useState<RBCEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBooking, setOpenBooking] = useState(false);

  const [range, setRange] = useState<{ start: Date; end: Date }>(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = new Date(start); end.setDate(end.getDate() + 7);
    return { start, end };
  });

  const fetchBookings = useCallback(async (from: Date, to: Date) => {
    try {
      setLoading(true);
      setError(null);

      // Lê da VIEW criada no SQL: cal_data.bookings
      const { data, error } = await supabase
        .from("cal_data.bookings")
        .select("*")
        .gte("start_time", from.toISOString())
        .lte("end_time", to.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;

      const mapped: RBCEvent[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title || "Reunião",
        start: new Date(row.start_time),
        end: new Date(row.end_time),
        resource: {
          meeting_url: row.meeting_url,
          location: row.location,
          status: row.status,
        },
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

  // Clique em um evento: mostra resumo e oferece abrir o link/Meet.
  // (Se quiser cancelar pelo dashboard, reativamos depois via API quando o CALCOM_API_KEY estiver ok.)
  const onSelectEvent = useCallback(async (evt: RBCEvent) => {
    const r = evt.resource;
    const msg = [
      `Título: ${evt.title}`,
      `Início: ${evt.start.toLocaleString()}`,
      `Fim: ${evt.end.toLocaleString()}`,
      r.location ? `Local: ${r.location}` : "",
      r.meeting_url ? `Link: ${r.meeting_url}` : "",
      r.status ? `Status: ${r.status}` : "",
    ].filter(Boolean).join("\n");
    alert(msg);
    if (r.meeting_url) window.open(r.meeting_url, "_blank");
  }, []);

  const webcalHref = useMemo(() => "webcal://SEU_DOMINIO/api/reunioes/feed.ics", []);

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
                // refetch após fechar (o webhook já terá gravado no Supabase)
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
