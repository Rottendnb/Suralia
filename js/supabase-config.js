const SUPABASE_URL =
    "https://brvujbqdvwvbllgfuklo.supabase.co";

const SUPABASE_PUBLIC_KEY =
    "sb_publishable_ohrA6m0SeDlAluDvWB5obQ_o67pWmMn";

const clienteSupabase =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLIC_KEY
    );

window.clienteSupabase =
    clienteSupabase;

console.log(
    "Supabase conectado",
    clienteSupabase
);