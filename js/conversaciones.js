(() => {
    "use strict";


/* =========================================
   NOTIFICACIONES DEL NAVEGADOR
========================================= */

function notificacionesNavegadorDisponibles() {
    return (
        "Notification" in window
    );
}


function notificacionesNavegadorActivas() {
    return (
        notificacionesNavegadorDisponibles() &&
        Notification.permission ===
            "granted"
    );
}


function mostrarNotificacionNavegador(
    titulo,
    cuerpo
) {
    if (
        !notificacionesNavegadorActivas() ||
        document.visibilityState ===
            "visible"
    ) {
        return;
    }

    try {
        const notificacion =
            new Notification(
                titulo,
                {
                    body:
                        cuerpo,

                    icon:
                        "img/suralia-favicon.png?v=10",

                    badge:
                        "img/suralia-favicon.png?v=10",

                    tag:
                        "nuevo-mensaje-suralia"
                }
            );

        notificacion.onclick =
            () => {
                window.focus();

                notificacion.close();
            };
    } catch (error) {
        console.error(
            "No se pudo mostrar la notificación del navegador:",
            error
        );
    }
}



/* =========================================
   SONIDO DE NOTIFICACIÓN DE MENSAJES
========================================= */

let contextoAudioNotificaciones =
    null;

let sonidoNotificacionesPreparado =
    false;


function prepararSonidoNotificaciones() {
    if (sonidoNotificacionesPreparado) {
        return;
    }

    const AudioContexto =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContexto) {
        return;
    }

    try {
        contextoAudioNotificaciones =
            contextoAudioNotificaciones ||
            new AudioContexto();

        if (
            contextoAudioNotificaciones.state ===
            "suspended"
        ) {
            contextoAudioNotificaciones.resume();
        }

        sonidoNotificacionesPreparado =
            true;
    } catch (error) {
        console.error(
            "No se pudo preparar el sonido de notificación:",
            error
        );
    }
}


function reproducirSonidoNotificacion() {
    if (
        !contextoAudioNotificaciones ||
        contextoAudioNotificaciones.state !==
            "running"
    ) {
        return;
    }

    try {
        const ahora =
            contextoAudioNotificaciones.currentTime;

        const ganancia =
            contextoAudioNotificaciones.createGain();

        const osciladorUno =
            contextoAudioNotificaciones.createOscillator();

        const osciladorDos =
            contextoAudioNotificaciones.createOscillator();

        ganancia.gain.setValueAtTime(
            0.0001,
            ahora
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.12,
            ahora + 0.015
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.32
        );

        osciladorUno.type =
            "sine";

        osciladorUno.frequency.setValueAtTime(
            740,
            ahora
        );

        osciladorDos.type =
            "sine";

        osciladorDos.frequency.setValueAtTime(
            980,
            ahora + 0.08
        );

        osciladorUno.connect(
            ganancia
        );

        osciladorDos.connect(
            ganancia
        );

        ganancia.connect(
            contextoAudioNotificaciones.destination
        );

        osciladorUno.start(
            ahora
        );

        osciladorUno.stop(
            ahora + 0.18
        );

        osciladorDos.start(
            ahora + 0.08
        );

        osciladorDos.stop(
            ahora + 0.3
        );
    } catch (error) {
        console.error(
            "No se pudo reproducir el sonido de notificación:",
            error
        );
    }
}


[
    "click",
    "keydown",
    "touchstart"
].forEach(
    (
        tipoEvento
    ) => {
        document.addEventListener(
            tipoEvento,
            prepararSonidoNotificaciones,
            {
                once:
                    true,
                passive:
                    true
            }
        );
    }
);


function leerDatoLocal(clave, alternativa = null) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : alternativa;
    } catch (error) {
        console.error(`No se pudo leer ${clave}:`, error);
        return alternativa;
    }
}

const carga = document.querySelector("#conversaciones-carga");
const errorBloque = document.querySelector("#conversaciones-error");
const errorTexto = document.querySelector("#conversaciones-error-texto");
const vacio = document.querySelector("#conversaciones-vacio");
const lista = document.querySelector("#conversaciones-lista");

const botonNotificacionesNavegador =
    document.querySelector(
        "#boton-notificaciones-navegador"
    );

const modalEliminarConversacion =
    document.querySelector(
        "#modal-eliminar-conversacion"
    );

const cerrarModalEliminarConversacion =
    document.querySelector(
        "#cerrar-modal-eliminar-conversacion"
    );

const cancelarEliminarConversacion =
    document.querySelector(
        "#cancelar-eliminar-conversacion"
    );

const confirmarEliminarConversacion =
    document.querySelector(
        "#confirmar-eliminar-conversacion"
    );

const textoModalEliminarConversacion =
    document.querySelector(
        "#texto-modal-eliminar-conversacion"
    );

let usuarioActual = null;

let conversacionPendienteEliminar =
    null;

let botonPendienteEliminar =
    null;

let focoAnteriorModal =
    null;
let canalConversaciones = null;

function escaparHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatearFecha(fecha) {
    if (!fecha) return "";

    const valor = new Date(fecha);
    const hoy = new Date();

    if (valor.toDateString() === hoy.toDateString()) {
        return new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(valor);
    }

    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: valor.getFullYear() !== hoy.getFullYear() ? "2-digit" : undefined
    }).format(valor);
}

async function cargarHeader() {
    const avatar = document.querySelector("#avatar-header");
    const nombre = document.querySelector("#nombre-header");
    if (!avatar || !nombre) return;

    const local = leerDatoLocal("usuarioSuralia", {}) || {};
    nombre.textContent = local.nombre || "Mi perfil";

    function mostrarIniciales() {
        const iniciales = `${(local.nombre || "S").charAt(0)}${(local.apellidos || "").charAt(0)}`
            .toUpperCase()
            .trim() || "SU";

        avatar.textContent = iniciales;
        avatar.style.backgroundImage = "";
        avatar.classList.remove("avatar--imagen", "usuario-header__avatar--imagen");
    }

    function mostrarImagen(url) {
        if (!url) {
            mostrarIniciales();
            return;
        }

        avatar.textContent = "";
        avatar.style.backgroundImage = `url("${url}")`;
        avatar.style.backgroundPosition = "center";
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundRepeat = "no-repeat";
        avatar.classList.add("avatar--imagen", "usuario-header__avatar--imagen");
    }

    if (local.avatarTipo === "imagen" && local.avatarValor) {
        mostrarImagen(local.avatarValor);
    } else {
        mostrarIniciales();
    }

    try {
        const cliente = window.clienteSupabase;
        const { data: sesion } = await cliente.auth.getSession();
        const usuario = sesion.session?.user;
        if (!usuario) return;

        const { data: perfil, error } = await cliente
            .from("perfiles_sociales")
            .select("nombre_visible,foto_principal_url")
            .eq("usuario_id", usuario.id)
            .maybeSingle();

        if (error) throw error;
        if (perfil?.nombre_visible) nombre.textContent = perfil.nombre_visible;
        if (perfil?.foto_principal_url) mostrarImagen(perfil.foto_principal_url);
    } catch (error) {
        console.error("No se pudo cargar el header:", error);
    }
}

function mostrarError(mensaje) {
    carga?.classList.add("oculto");
    vacio?.classList.add("oculto");
    lista?.classList.add("oculto");
    errorBloque?.classList.remove("oculto");
    if (errorTexto) errorTexto.textContent = mensaje;
}

function avatarPerfil(perfil) {
    if (perfil?.foto_principal_url) {
        return `<img src="${escaparHTML(perfil.foto_principal_url)}" alt="">`;
    }

    return escaparHTML((perfil?.nombre_visible || "S").charAt(0).toUpperCase());
}

function tarjeta(conversacion) {
    const perfil = conversacion.perfil || {};
    const nombre = perfil.nombre_visible || "Usuario de Suralia";
    const ultimo = conversacion.ultimo;
    const pendientes = conversacion.pendientes || 0;

    return `
        <article class="conversacion-tarjeta">

            <a
                class="conversacion-tarjeta__enlace"
                href="mensajes.html?id=${encodeURIComponent(
                    conversacion.id
                )}"
            >
                <span class="conversacion-tarjeta__avatar">
                    ${avatarPerfil(perfil)}
                </span>

                <span class="conversacion-tarjeta__contenido">
                    <span class="conversacion-tarjeta__superior">
                        <strong>${escaparHTML(nombre)}</strong>

                        <time>
                            ${escaparHTML(
                                formatearFecha(
                                    ultimo?.creado_en ||
                                    conversacion.actualizado_en
                                )
                            )}
                        </time>
                    </span>

                    <span class="conversacion-tarjeta__inferior">
                        <span class="conversacion-tarjeta__mensaje">
                            ${escaparHTML(
                                ultimo?.contenido ||
                                "Conversación iniciada"
                            )}
                        </span>

                        ${pendientes > 0 ? `
                            <span
                                class="conversacion-tarjeta__contador"
                                aria-label="${pendientes} mensajes pendientes"
                            >
                                ${pendientes > 99 ? "99+" : pendientes}
                            </span>
                        ` : ""}
                    </span>
                </span>
            </a>

            <button
                type="button"
                class="conversacion-tarjeta__eliminar"
                data-eliminar-conversacion="${escaparHTML(
                    conversacion.id
                )}"
                data-nombre-conversacion="${escaparHTML(
                    nombre
                )}"
                aria-label="Eliminar conversación con ${escaparHTML(
                    nombre
                )}"
                title="Eliminar conversación"
            >
                <i
                    class="fa-regular fa-trash-can"
                    aria-hidden="true"
                ></i>
            </button>

        </article>
    `;
}


function actualizarBotonNotificaciones() {
    if (!botonNotificacionesNavegador) {
        return;
    }

    if (!notificacionesNavegadorDisponibles()) {
        botonNotificacionesNavegador.disabled =
            true;

        botonNotificacionesNavegador.innerHTML = `
            <i class="fa-solid fa-bell-slash"></i>
            Avisos no disponibles
        `;

        return;
    }

    if (
        Notification.permission ===
        "granted"
    ) {
        botonNotificacionesNavegador.disabled =
            true;

        botonNotificacionesNavegador.classList.add(
            "conversaciones-cabecera__enlace--activo"
        );

        botonNotificacionesNavegador.innerHTML = `
            <i class="fa-solid fa-bell"></i>
            Avisos activados
        `;

        return;
    }

    if (
        Notification.permission ===
        "denied"
    ) {
        botonNotificacionesNavegador.disabled =
            true;

        botonNotificacionesNavegador.innerHTML = `
            <i class="fa-solid fa-bell-slash"></i>
            Avisos bloqueados
        `;

        return;
    }

    botonNotificacionesNavegador.disabled =
        false;

    botonNotificacionesNavegador.innerHTML = `
        <i class="fa-regular fa-bell"></i>
        Activar avisos
    `;
}


async function solicitarNotificacionesNavegador() {
    if (!notificacionesNavegadorDisponibles()) {
        return;
    }

    try {
        const permiso =
            await Notification.requestPermission();

        actualizarBotonNotificaciones();

        if (permiso === "granted") {
            new Notification(
                "Avisos activados",
                {
                    body:
                        "Suralia podrá avisarte cuando recibas mensajes.",

                    icon:
                        "img/suralia-favicon.png?v=10"
                }
            );
        }
    } catch (error) {
        console.error(
            "No se pudo solicitar permiso para las notificaciones:",
            error
        );
    }
}


async function cargarConversaciones() {
    const cliente = window.clienteSupabase;

    if (!cliente?.auth) {
        mostrarError("No se ha podido conectar con Suralia.");
        return;
    }

    try {
        const { data: sesion, error: errorSesion } = await cliente.auth.getSession();
        if (errorSesion) throw errorSesion;

        usuarioActual = sesion.session?.user;

        if (!usuarioActual) {
            sessionStorage.setItem("destinoDespuesLoginSuralia", window.location.href);
            window.location.replace("login.html");
            return;
        }

        const [
            conversacionesResultado,
            ocultasResultado
        ] = await Promise.all([
            cliente
                .from("conversaciones")
                .select(
                    "id,usuario_uno_id,usuario_dos_id,actualizado_en"
                )
                .order(
                    "actualizado_en",
                    {
                        ascending:
                            false
                    }
                ),

            cliente
                .from("conversaciones_ocultas")
                .select("conversacion_id")
                .eq(
                    "usuario_id",
                    usuarioActual.id
                )
        ]);

        if (conversacionesResultado.error) {
            throw conversacionesResultado.error;
        }

        if (ocultasResultado.error) {
            throw ocultasResultado.error;
        }

        const idsOcultas =
            new Set(
                (
                    ocultasResultado.data ||
                    []
                ).map(
                    (
                        fila
                    ) =>
                        fila.conversacion_id
                )
            );

        const conversaciones =
            (
                conversacionesResultado.data ||
                []
            ).filter(
                (
                    conversacion
                ) =>
                    !idsOcultas.has(
                        conversacion.id
                    )
            );

        if (!conversaciones.length) {
            carga?.classList.add("oculto");
            errorBloque?.classList.add("oculto");
            lista?.classList.add("oculto");
            vacio?.classList.remove("oculto");
            return;
        }

        const otrosIds = conversaciones.map(c =>
            c.usuario_uno_id === usuarioActual.id
                ? c.usuario_dos_id
                : c.usuario_uno_id
        );

        const conversacionIds = conversaciones.map(c => c.id);

        const [perfilesRes, mensajesRes] = await Promise.all([
            cliente
                .from("perfiles_sociales")
                .select("usuario_id,nombre_visible,foto_principal_url")
                .in("usuario_id", otrosIds),

            cliente
                .from("mensajes")
                .select("id,conversacion_id,remitente_id,contenido,leido,creado_en")
                .in("conversacion_id", conversacionIds)
                .order("creado_en", { ascending: false })
        ]);

        if (perfilesRes.error) throw perfilesRes.error;
        if (mensajesRes.error) throw mensajesRes.error;

        const perfiles = new Map(
            (perfilesRes.data || []).map(p => [p.usuario_id, p])
        );

        const mensajes = new Map();

        (mensajesRes.data || []).forEach(m => {
            if (!mensajes.has(m.conversacion_id)) {
                mensajes.set(m.conversacion_id, []);
            }
            mensajes.get(m.conversacion_id).push(m);
        });

        const preparadas = conversaciones.map(c => {
            const otroId = c.usuario_uno_id === usuarioActual.id
                ? c.usuario_dos_id
                : c.usuario_uno_id;

            const listaMensajes = mensajes.get(c.id) || [];

            return {
                ...c,
                perfil: perfiles.get(otroId) || null,
                ultimo: listaMensajes[0] || null,
                pendientes: listaMensajes.filter(m =>
                    !m.leido && m.remitente_id !== usuarioActual.id
                ).length
            };
        });

        lista.innerHTML =
            preparadas
                .map(
                    tarjeta
                )
                .join("");

        activarBotonesEliminarConversacion();

        carga?.classList.add("oculto");
        errorBloque?.classList.add("oculto");
        vacio?.classList.add("oculto");
        lista?.classList.remove("oculto");
    } catch (error) {
        console.error("No se pudieron cargar las conversaciones:", error);
        mostrarError("No se han podido cargar tus conversaciones.");
    }
}


function abrirModalEliminarConversacion(
    conversacionId,
    nombre,
    boton
) {
    if (
        !modalEliminarConversacion ||
        !conversacionId
    ) {
        return;
    }

    conversacionPendienteEliminar =
        conversacionId;

    botonPendienteEliminar =
        boton ||
        null;

    focoAnteriorModal =
        document.activeElement;

    if (textoModalEliminarConversacion) {
        textoModalEliminarConversacion.textContent =
            `La conversación con ${nombre || "este usuario"} desaparecerá de tu bandeja, pero no se borrará para la otra persona. Si recibes un mensaje nuevo, volverá a aparecer.`;
    }

    modalEliminarConversacion.classList.add(
        "visible"
    );

    modalEliminarConversacion.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    cerrarModalEliminarConversacion?.focus();
}


function cerrarModalConversacion() {
    if (!modalEliminarConversacion) {
        return;
    }

    modalEliminarConversacion.classList.remove(
        "visible"
    );

    modalEliminarConversacion.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    focoAnteriorModal?.focus?.();

    focoAnteriorModal =
        null;

    conversacionPendienteEliminar =
        null;

    botonPendienteEliminar =
        null;
}


async function eliminarConversacionDeMiBandeja() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionPendienteEliminar ||
        !confirmarEliminarConversacion
    ) {
        return;
    }

    const conversacionId =
        conversacionPendienteEliminar;

    confirmarEliminarConversacion.disabled =
        true;

    confirmarEliminarConversacion.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Eliminando...
    `;

    try {
        const {
            error
        } = await cliente.rpc(
            "ocultar_conversacion",
            {
                conversacion_buscada:
                    conversacionId
            }
        );

        if (error) {
            throw error;
        }

        cerrarModalConversacion();

        await cargarConversaciones();
    } catch (error) {
        console.error(
            "No se pudo ocultar la conversación:",
            error
        );

        window.alert(
            "No se ha podido eliminar la conversación de tu bandeja."
        );
    } finally {
        confirmarEliminarConversacion.disabled =
            false;

        confirmarEliminarConversacion.innerHTML = `
            <i class="fa-regular fa-trash-can"></i>
            Eliminar de mi bandeja
        `;
    }
}


function activarBotonesEliminarConversacion() {
    document
        .querySelectorAll(
            "[data-eliminar-conversacion]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        abrirModalEliminarConversacion(
                            boton.dataset
                                .eliminarConversacion,
                            boton.dataset
                                .nombreConversacion,
                            boton
                        );
                    }
                );
            }
        );
}


function activarTiempoReal() {
    const cliente = window.clienteSupabase;
    if (!cliente) return;

    if (canalConversaciones) {
        cliente.removeChannel(canalConversaciones);
    }

    canalConversaciones = cliente
        .channel("bandeja-mensajes-suralia")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "mensajes"
            },
            (
                cambio
            ) => {
                if (
                    cambio.eventType ===
                        "INSERT" &&
                    cambio.new?.remitente_id &&
                    cambio.new.remitente_id !==
                        usuarioActual?.id
                ) {
                    reproducirSonidoNotificacion();

                    mostrarNotificacionNavegador(
                        "Nuevo mensaje en Suralia",
                        "Abre la bandeja para leerlo."
                    );
                }

                cargarConversaciones();
            }
        )
        .subscribe();
}

window.addEventListener("beforeunload", () => {
    if (canalConversaciones && window.clienteSupabase) {
        window.clienteSupabase.removeChannel(canalConversaciones);
    }
});

botonNotificacionesNavegador?.addEventListener(
    "click",
    solicitarNotificacionesNavegador
);


cerrarModalEliminarConversacion?.addEventListener(
    "click",
    cerrarModalConversacion
);


cancelarEliminarConversacion?.addEventListener(
    "click",
    cerrarModalConversacion
);


confirmarEliminarConversacion?.addEventListener(
    "click",
    eliminarConversacionDeMiBandeja
);


modalEliminarConversacion?.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            evento.target ===
            modalEliminarConversacion
        ) {
            cerrarModalConversacion();
        }
    }
);


document.addEventListener(
    "keydown",
    (
        evento
    ) => {
        if (
            evento.key ===
                "Escape" &&
            modalEliminarConversacion
                ?.classList
                .contains(
                    "visible"
                )
        ) {
            cerrarModalConversacion();
        }
    }
);


async function iniciar() {
    actualizarBotonNotificaciones();

    try {
        await Promise.all([
            cargarHeader(),
            cargarConversaciones()
        ]);

        activarTiempoReal();
    } catch (error) {
        console.error(
            "No se pudo iniciar la bandeja de mensajes:",
            error
        );

        mostrarError(
            "No se han podido cargar tus conversaciones."
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
} else {
    iniciar();
}


})();