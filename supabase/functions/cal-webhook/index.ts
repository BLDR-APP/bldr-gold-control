// deno run --allow-net --allow-env
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Vars do projeto (o Supabase injeta automaticamente nas edge functions)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
// Para escrever nas tabelas com segurança, use SERVICE_ROLE (recomendado)
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || SUPABASE_ANON_KEY;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const event = await req.json(); // Cal.com envia JSON
    // Estrutura típica: { triggerEvent: 'booking.created', payload: { ... } }
    const eventType = event.triggerEvent || event.event || "unknown";
    const payload = event.payload || event;

    // Extração segura
    const bookingId  = String(payload?.id ?? payload?.booking?.id ?? "");
    const title      = payload?.title ?? payload?.eventType?.title ?? "Reunião";
    const startISO   = payload?.startTime ?? payload?.start ?? payload?.start_time;
    const endISO     = payload?.endTime   ?? payload?.end   ?? payload?.end_time;
    const meetingUrl = payload?.meetingUrl ?? payload?.meeting_url ?? payload?.location?.meeting_url ?? null;
    const location   = payload?.location ?? null;
    // status pode variar conforme o evento
    const status     = eventType.includes("canceled") ? "canceled" : "confirmed";

    // 1) Log do webhook
    await sb.from("cal_data.webhooks").insert({
      event_type: eventType,
      booking_id: bookingId || null,
      payload: payload
    });

    // 2) Upsert na tabela de cache (quando houver dados suficientes)
    if (bookingId && startISO && endISO) {
      await sb.from("cal_data.bookings_cache").upsert({
        id: bookingId,
        title,
        start_time: new Date(startISO).toISOString(),
        end_time: new Date(endISO).toISOString(),
        meeting_url: meetingUrl,
        location,
        status,
        raw_payload: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

      // Se for cancelamento, opcionalmente você pode remover:
      // if (status === "canceled") await sb.from("cal_data.bookings_cache").delete().eq("id", bookingId);
    }

    return new Response("ok", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (e) {
    return new Response(`error: ${String(e)}`, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }
});
