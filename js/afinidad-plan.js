/* =====================================================
   AFINIDAD SOCIAL PARA PLANES
===================================================== */

(function () {
    "use strict";

    const botonAfinidad = document.querySelector("#boton-afinidad-plan");
    const estadoAfinidad = document.querySelector("#estado-afinidad-plan");

    if (!botonAfinidad) {
        return;
    }

    const cliente = window.clienteSupabase;

    const datosPlan = {
        planId: document.body.dataset.planId || "sierra-norte",
        titulo: document.body.dataset.planTitulo || "Ruta de senderismo por la Sierra Norte",
        imagen: document.body.dataset.planImagen || "img/sierra-norte-principal.jpg",
        fechaIso: document.body.dataset.planFechaIso || "2026-08-08",
        ubicacion: document.body.dataset.planUbicacion || "Constantina, Sevilla"
    };

    let usuarioActual = null;
    let afinidadActiva = false;
    let procesando = false;

    function mostrarEstado(mensaje, tipo = "") {
        if (!estadoAfinidad) {
            return;
        }

        estadoAfinidad.textContent = mensaje;
        estadoAfinidad.classList.remove("es-activa", "es-error");

        if (tipo === "activa") {
            estadoAfinidad.classList.add("es-activa");
        }

        if (tipo === "error") {
            estadoAfinidad.classList.add("es-error");
        }
    }

    function actualizarBoton() {
        const icono = botonAfinidad.querySelector("i");
        const texto = botonAfinidad.querySelector("span");

        botonAfinidad.classList.toggle("activo", afinidadActiva);
        botonAfinidad.setAttribute("aria-pressed", String(afinidadActiva));

        if (icono) {
            icono.className = afinidadActiva
                ? "fa-solid fa-user-check"
                : "fa-solid fa-user-plus";
        }

        if (texto) {
            texto.textContent = afinidadActiva
                ? "Afinidad activada para este plan"
                : "Quiero conocer gente para este plan";
        }

        mostrarEstado(
            afinidadActiva
                ? "Afinidad activada. Más adelante podrás ver coincidencias y solicitudes de conexión."
                : "Esta opción está desactivada.",
            afinidadActiva ? "activa" : ""
        );
    }

    function redirigirAlLogin() {
        sessionStorage.setItem(
            "destinoDespuesLoginSuralia",
            window.location.href
        );

        mostrarEstado(
            "Debes iniciar sesión para activar la afinidad.",
            "error"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    }

    async function obtenerUsuarioSupabase() {
        if (!cliente?.auth) {
            throw new Error("Supabase no está disponible.");
        }

        const { data, error } = await cliente.auth.getUser();

        if (error) {
            throw error;
        }

        return data?.user || null;
    }

    async function consultarAfinidad() {
        const { data, error } = await cliente
            .from("afinidades_planes")
            .select("activo")
            .eq("usuario_id", usuarioActual.id)
            .eq("plan_id", datosPlan.planId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        afinidadActiva = Boolean(data?.activo);
        actualizarBoton();
    }

    async function activarAfinidad() {
        const { error } = await cliente
            .from("afinidades_planes")
            .upsert(
                {
                    usuario_id: usuarioActual.id,
                    plan_id: datosPlan.planId,
                    plan_titulo: datosPlan.titulo,
                    plan_imagen: datosPlan.imagen,
                    plan_fecha: datosPlan.fechaIso || null,
                    plan_ubicacion: datosPlan.ubicacion,
                    activo: true,
                    actualizado_en: new Date().toISOString()
                },
                {
                    onConflict: "usuario_id,plan_id"
                }
            );

        if (error) {
            throw error;
        }

        afinidadActiva = true;
    }

    async function desactivarAfinidad() {
        const { error } = await cliente
            .from("afinidades_planes")
            .update({
                activo: false,
                actualizado_en: new Date().toISOString()
            })
            .eq("usuario_id", usuarioActual.id)
            .eq("plan_id", datosPlan.planId);

        if (error) {
            throw error;
        }

        afinidadActiva = false;
    }

    async function alternarAfinidad() {
        if (procesando) {
            return;
        }

        procesando = true;
        botonAfinidad.disabled = true;

        try {
            usuarioActual = await obtenerUsuarioSupabase();

            if (!usuarioActual) {
                redirigirAlLogin();
                return;
            }

            if (afinidadActiva) {
                await desactivarAfinidad();
            } else {
                await activarAfinidad();
            }

            actualizarBoton();
        } catch (error) {
            console.error("No se pudo actualizar la afinidad:", error);
            mostrarEstado(
                "No se ha podido actualizar la afinidad. Inténtalo de nuevo.",
                "error"
            );
        } finally {
            procesando = false;
            botonAfinidad.disabled = false;
        }
    }

    async function iniciarAfinidad() {
        if (!cliente?.auth) {
            botonAfinidad.disabled = true;
            mostrarEstado(
                "No se ha podido conectar con Supabase.",
                "error"
            );
            return;
        }

        try {
            usuarioActual = await obtenerUsuarioSupabase();

            if (!usuarioActual) {
                afinidadActiva = false;
                actualizarBoton();
                return;
            }

            await consultarAfinidad();
        } catch (error) {
            console.error("No se pudo cargar la afinidad:", error);
            mostrarEstado(
                "No se ha podido cargar el estado de afinidad.",
                "error"
            );
        }
    }

    botonAfinidad.addEventListener("click", alternarAfinidad);

    cliente?.auth?.onAuthStateChange(async (evento, sesion) => {
        usuarioActual = sesion?.user || null;

        if (!usuarioActual) {
            afinidadActiva = false;
            actualizarBoton();
            return;
        }

        try {
            await consultarAfinidad();
        } catch (error) {
            console.error("No se pudo sincronizar la afinidad:", error);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarAfinidad);
    } else {
        iniciarAfinidad();
    }
})();