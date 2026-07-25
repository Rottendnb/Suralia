const SUPABASE_URL =
    "AQUI_IRA_LA_URL";

const SUPABASE_PUBLIC_KEY =
    "AQUI_IRA_LA_CLAVE_PUBLICA";

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