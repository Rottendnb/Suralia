/* =========================================================
   SURALIA · FOTOS DE PERFIL
   Helper común para preparar la migración del bucket
   "fotos-perfil" a privado.

   IMPORTANTE:
   - NO guarda URLs firmadas en la base de datos.
   - NO guarda URLs firmadas en localStorage.
   - Las fotos externas (por ejemplo Google) se conservan.
   - Mientras dure la migración, si no puede firmar una foto,
     puede usar la URL antigua como compatibilidad temporal.
========================================================= */

(function iniciarHelperFotosPerfilSuralia() {
    "use strict";

    if (window.SuraliaFotosPerfil) {
        return;
    }

    const BUCKET_FOTOS_PERFIL =
        "fotos-perfil";

    const DURACION_URL_FIRMADA =
        60 * 60;

    const MARGEN_CACHE_MS =
        5 * 60 * 1000;

    const cacheUrlsFirmadas =
        new Map();


    function obtenerClienteSupabaseFotosPerfil() {
        if (window.clienteSupabase) {
            return window.clienteSupabase;
        }

        if (window.supabaseCliente) {
            return window.supabaseCliente;
        }

        if (window.supabaseClient) {
            return window.supabaseClient;
        }

        if (
            typeof clienteSupabase !==
            "undefined"
        ) {
            return clienteSupabase;
        }

        if (
            typeof supabaseCliente !==
            "undefined"
        ) {
            return supabaseCliente;
        }

        if (
            typeof supabaseClient !==
            "undefined"
        ) {
            return supabaseClient;
        }

        return null;
    }


    function normalizarRutaStorage(
        ruta = ""
    ) {
        return String(
            ruta ||
            ""
        )
            .trim()
            .replace(
                /^\/+/,
                ""
            );
    }


    function esUrlInternaFotosPerfil(
        valor = ""
    ) {
        const texto =
            String(
                valor ||
                ""
            ).trim();

        if (!texto) {
            return false;
        }

        try {
            const url =
                new URL(
                    texto,
                    window.location.href
                );

            return (
                url.pathname.includes(
                    `/storage/v1/object/public/${BUCKET_FOTOS_PERFIL}/`
                ) ||
                url.pathname.includes(
                    `/storage/v1/object/sign/${BUCKET_FOTOS_PERFIL}/`
                ) ||
                url.pathname.includes(
                    `/storage/v1/object/authenticated/${BUCKET_FOTOS_PERFIL}/`
                )
            );
        } catch (error) {
            return false;
        }
    }


    function esUrlExternaFotoPerfil(
        valor = ""
    ) {
        const texto =
            String(
                valor ||
                ""
            ).trim();

        if (!texto) {
            return false;
        }

        try {
            const url =
                new URL(
                    texto,
                    window.location.href
                );

            return (
                (
                    url.protocol ===
                        "https:" ||
                    url.protocol ===
                        "http:"
                ) &&
                !esUrlInternaFotosPerfil(
                    texto
                )
            );
        } catch (error) {
            return false;
        }
    }


    function extraerRutaStorageDeUrl(
        valor = ""
    ) {
        const texto =
            String(
                valor ||
                ""
            ).trim();

        if (!texto) {
            return "";
        }

        try {
            const url =
                new URL(
                    texto,
                    window.location.href
                );

            const prefijos = [
                `/storage/v1/object/public/${BUCKET_FOTOS_PERFIL}/`,
                `/storage/v1/object/sign/${BUCKET_FOTOS_PERFIL}/`,
                `/storage/v1/object/authenticated/${BUCKET_FOTOS_PERFIL}/`
            ];

            const prefijo =
                prefijos.find(
                    (item) =>
                        url.pathname.includes(
                            item
                        )
                );

            if (!prefijo) {
                return "";
            }

            const posicion =
                url.pathname.indexOf(
                    prefijo
                );

            const rutaCodificada =
                url.pathname.slice(
                    posicion +
                    prefijo.length
                );

            try {
                return normalizarRutaStorage(
                    decodeURIComponent(
                        rutaCodificada
                    )
                );
            } catch (error) {
                return normalizarRutaStorage(
                    rutaCodificada
                );
            }
        } catch (error) {
            return "";
        }
    }


    async function crearUrlFirmadaFotoPerfil(
        rutaStorage,
        opciones = {}
    ) {
        const ruta =
            normalizarRutaStorage(
                rutaStorage
            );

        if (!ruta) {
            return "";
        }

        const duracion =
            Math.max(
                60,
                Number(
                    opciones.duracion ||
                    DURACION_URL_FIRMADA
                )
            );

        const forzar =
            opciones.forzar ===
            true;

        const ahora =
            Date.now();

        const cache =
            cacheUrlsFirmadas.get(
                ruta
            );

        if (
            !forzar &&
            cache?.url &&
            cache.caducaEn >
                ahora +
                MARGEN_CACHE_MS
        ) {
            return cache.url;
        }

        const cliente =
            obtenerClienteSupabaseFotosPerfil();

        if (!cliente?.storage) {
            throw new Error(
                "No se ha encontrado el cliente de Supabase para cargar la fotografía."
            );
        }

        const {
            data,
            error
        } = await cliente
            .storage
            .from(
                BUCKET_FOTOS_PERFIL
            )
            .createSignedUrl(
                ruta,
                duracion
            );

        if (error) {
            throw error;
        }

        const urlFirmada =
            data?.signedUrl ||
            "";

        if (!urlFirmada) {
            throw new Error(
                "No se pudo generar la URL temporal de la fotografía."
            );
        }

        cacheUrlsFirmadas.set(
            ruta,
            {
                url:
                    urlFirmada,

                caducaEn:
                    ahora +
                    duracion *
                    1000
            }
        );

        return urlFirmada;
    }


    async function obtenerUrlFotoPerfil(
        datos = {}
    ) {
        const rutaDirecta =
            normalizarRutaStorage(
                datos.rutaStorage ||
                datos.ruta_storage ||
                ""
            );

        const fotoUrl =
            String(
                datos.fotoUrl ||
                datos.foto_url ||
                ""
            ).trim();

        const permitirCompatibilidad =
            datos.permitirCompatibilidad !==
            false;

        const rutaDesdeUrl =
            !rutaDirecta
                ? extraerRutaStorageDeUrl(
                    fotoUrl
                )
                : "";

        const ruta =
            rutaDirecta ||
            rutaDesdeUrl;

        if (ruta) {
            try {
                return await crearUrlFirmadaFotoPerfil(
                    ruta,
                    {
                        duracion:
                            datos.duracion
                    }
                );
            } catch (error) {
                console.warn(
                    "No se pudo crear la URL firmada de una foto de perfil:",
                    error
                );

                /*
                   Compatibilidad temporal durante la migración:
                   mientras el bucket siga público, la URL antigua
                   permite que la interfaz no se rompa.
                */
                if (
                    permitirCompatibilidad &&
                    fotoUrl
                ) {
                    return fotoUrl;
                }

                return "";
            }
        }

        /*
           Una foto externa (Google, etc.) no pertenece
           a Supabase Storage y se utiliza directamente.
        */
        if (
            esUrlExternaFotoPerfil(
                fotoUrl
            )
        ) {
            return fotoUrl;
        }

        /*
           Permitimos valores no HTTP ya existentes como
           compatibilidad visual (por ejemplo una imagen local).
        */
        return fotoUrl;
    }


    function limpiarCacheFotoPerfil(
        rutaStorage = ""
    ) {
        const ruta =
            normalizarRutaStorage(
                rutaStorage
            );

        if (!ruta) {
            cacheUrlsFirmadas.clear();
            return;
        }

        cacheUrlsFirmadas.delete(
            ruta
        );
    }


    window.SuraliaFotosPerfil = {
        BUCKET:
            BUCKET_FOTOS_PERFIL,

        DURACION_URL_FIRMADA,

        obtenerCliente:
            obtenerClienteSupabaseFotosPerfil,

        esUrlInterna:
            esUrlInternaFotosPerfil,

        esUrlExterna:
            esUrlExternaFotoPerfil,

        extraerRutaStorage:
            extraerRutaStorageDeUrl,

        crearUrlFirmada:
            crearUrlFirmadaFotoPerfil,

        obtenerUrl:
            obtenerUrlFotoPerfil,

        limpiarCache:
            limpiarCacheFotoPerfil
    };
})();
