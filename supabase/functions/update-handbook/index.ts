import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase environment variables" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();

    const payload = {
      section_title: String(body.section_title || "").trim(),
      content: String(body.content || "").trim(),
      display_order: Number(body.display_order || 1),
      is_active: body.is_active === false ? false : true,
      updated_at: new Date().toISOString()
    };

    if (!payload.section_title || !payload.content) {
      return new Response(JSON.stringify({ error: "section_title and content are required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    let result;
    if (body.id) {
      result = await supabase
        .from("TblP38Handbook")
        .update(payload)
        .eq("id", body.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("TblP38Handbook")
        .insert([payload])
        .select()
        .single();
    }

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ data: result.data }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
