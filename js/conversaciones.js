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
    cuerpo,
    conversacionId = ""
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

                if (conversacionId) {
                    window.location.href =
                        `mensajes.html?id=${encodeURIComponent(
                            conversacionId
                        )}`;
                }
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

let intervaloPresenciasConversaciones =
    null;

let buscadorConversaciones =
    null;

let mensajeSinResultados =
    null;

let filtrosConversaciones =
    null;

let filtroConversacionesActivo =
    "todas";

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

function actualizarTituloNoLeidos(
    totalPendientes = 0
) {
    const total =
        Number(totalPendientes) ||
        0;

    document.title =
        total > 0
            ? `(${total > 99 ? "99+" : total}) Mensajes | Suralia`
            : "Mensajes | Suralia";
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

function normalizarTextoConversacion(
    texto = ""
) {
    return String(texto)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();
}


function filtrarConversaciones() {
    if (!lista) {
        return;
    }

    const busqueda =
        normalizarTextoConversacion(
            buscadorConversaciones?.value ||
            ""
        );

    const tarjetas =
        [
            ...lista.querySelectorAll(
                ".conversacion-tarjeta"
            )
        ];

    let visibles =
        0;

    tarjetas.forEach(
        (
            tarjetaConversacion
        ) => {
            const nombre =
                normalizarTextoConversacion(
                    tarjetaConversacion.dataset
                        .nombreConversacion ||
                    ""
                );

            const archivada =
                tarjetaConversacion.dataset
                    .archivada ===
                "true";

            const pendientes =
                Number(
                    tarjetaConversacion.dataset
                        .pendientes ||
                    0
                );

            const coincideNombre =
                !busqueda ||
                nombre.includes(
                    busqueda
                );

            let coincideFiltro =
                true;

            if (
                filtroConversacionesActivo ===
                "todas"
            ) {
                coincideFiltro =
                    !archivada;
            }

            if (
                filtroConversacionesActivo ===
                "no-leidas"
            ) {
                coincideFiltro =
                    !archivada &&
                    pendientes > 0;
            }

            if (
                filtroConversacionesActivo ===
                "fijadas"
            ) {
                coincideFiltro =
                    !archivada &&
                    tarjetaConversacion.dataset
                        .fijada ===
                    "true";
            }

            if (
                filtroConversacionesActivo ===
                "archivadas"
            ) {
                coincideFiltro =
                    archivada;
            }

            const mostrar =
                coincideNombre &&
                coincideFiltro;

            tarjetaConversacion.classList.toggle(
                "oculto",
                !mostrar
            );

            if (mostrar) {
                visibles +=
                    1;
            }
        }
    );

    if (mensajeSinResultados) {
        let texto =
            "No hay conversaciones que coincidan con la búsqueda.";

        if (
            !busqueda &&
            filtroConversacionesActivo ===
                "no-leidas"
        ) {
            texto =
                "No tienes conversaciones con mensajes pendientes.";
        }

        if (
            !busqueda &&
            filtroConversacionesActivo ===
                "fijadas"
        ) {
            texto =
                "No tienes conversaciones fijadas.";
        }

        if (
            !busqueda &&
            filtroConversacionesActivo ===
                "archivadas"
        ) {
            texto =
                "No tienes conversaciones archivadas.";
        }

        const parrafo =
            mensajeSinResultados.querySelector(
                "p"
            );

        if (parrafo) {
            parrafo.textContent =
                texto;
        }

        mensajeSinResultados.classList.toggle(
            "oculto",
            visibles > 0
        );
    }
}


function crearFiltrosConversaciones() {
    if (
        filtrosConversaciones ||
        !lista
    ) {
        return;
    }

    filtrosConversaciones =
        document.createElement(
            "div"
        );

    filtrosConversaciones.className =
        "conversaciones-filtros";

    filtrosConversaciones.setAttribute(
        "role",
        "tablist"
    );

    filtrosConversaciones.setAttribute(
        "aria-label",
        "Filtrar conversaciones"
    );

    filtrosConversaciones.innerHTML = `
        <button
            type="button"
            class="conversaciones-filtros__boton activo"
            data-filtro-conversaciones="todas"
            role="tab"
            aria-selected="true"
        >
            Todas
        </button>

        <button
            type="button"
            class="conversaciones-filtros__boton"
            data-filtro-conversaciones="no-leidas"
            role="tab"
            aria-selected="false"
        >
            No leídas
        </button>

        <button
            type="button"
            class="conversaciones-filtros__boton"
            data-filtro-conversaciones="fijadas"
            role="tab"
            aria-selected="false"
        >
            Fijadas
        </button>

        <button
            type="button"
            class="conversaciones-filtros__boton"
            data-filtro-conversaciones="archivadas"
            role="tab"
            aria-selected="false"
        >
            Archivadas
        </button>
    `;

    const buscador =
        lista.parentElement?.querySelector(
            ".conversaciones-buscador"
        );

    if (buscador) {
        buscador.insertAdjacentElement(
            "afterend",
            filtrosConversaciones
        );
    } else {
        lista.parentElement?.insertBefore(
            filtrosConversaciones,
            lista
        );
    }

    filtrosConversaciones.addEventListener(
        "click",
        (
            evento
        ) => {
            const boton =
                evento.target.closest(
                    "[data-filtro-conversaciones]"
                );

            if (!boton) {
                return;
            }

            filtroConversacionesActivo =
                boton.dataset
                    .filtroConversaciones ||
                "todas";

            filtrosConversaciones
                .querySelectorAll(
                    "[data-filtro-conversaciones]"
                )
                .forEach(
                    (
                        opcion
                    ) => {
                        const activa =
                            opcion ===
                            boton;

                        opcion.classList.toggle(
                            "activo",
                            activa
                        );

                        opcion.setAttribute(
                            "aria-selected",
                            String(
                                activa
                            )
                        );
                    }
                );

            filtrarConversaciones();
        }
    );
}


function crearBuscadorConversaciones() {
    if (
        buscadorConversaciones ||
        !lista
    ) {
        return;
    }

    const contenedor =
        document.createElement(
            "div"
        );

    contenedor.className =
        "conversaciones-buscador";

    contenedor.innerHTML = `
        <label
            class="conversaciones-buscador__campo"
            for="buscar-conversaciones"
        >
            <i
                class="fa-solid fa-magnifying-glass"
                aria-hidden="true"
            ></i>

            <input
                type="search"
                id="buscar-conversaciones"
                placeholder="Buscar conversación..."
                autocomplete="off"
                aria-label="Buscar conversación por nombre"
            >

            <button
                type="button"
                class="conversaciones-buscador__limpiar oculto"
                aria-label="Borrar búsqueda"
            >
                <i
                    class="fa-solid fa-xmark"
                    aria-hidden="true"
                ></i>
            </button>
        </label>
    `;

    lista.parentElement?.insertBefore(
        contenedor,
        lista
    );

    buscadorConversaciones =
        contenedor.querySelector(
            "#buscar-conversaciones"
        );

    const botonLimpiar =
        contenedor.querySelector(
            ".conversaciones-buscador__limpiar"
        );

    mensajeSinResultados =
        document.createElement(
            "div"
        );

    mensajeSinResultados.className =
        "conversaciones-sin-resultados oculto";

    mensajeSinResultados.innerHTML = `
        <i
            class="fa-regular fa-comments"
            aria-hidden="true"
        ></i>

        <p>
            No hay conversaciones que coincidan con la búsqueda.
        </p>
    `;

    lista.insertAdjacentElement(
        "afterend",
        mensajeSinResultados
    );

    buscadorConversaciones?.addEventListener(
        "input",
        () => {
            botonLimpiar?.classList.toggle(
                "oculto",
                !buscadorConversaciones.value
            );

            filtrarConversaciones();
        }
    );

    botonLimpiar?.addEventListener(
        "click",
        () => {
            buscadorConversaciones.value =
                "";

            botonLimpiar.classList.add(
                "oculto"
            );

            filtrarConversaciones();
            buscadorConversaciones.focus();
        }
    );
}


function tarjeta(conversacion) {
    const perfil = conversacion.perfil || {};
    const nombre = perfil.nombre_visible || "Usuario de Suralia";
    const ultimo = conversacion.ultimo;
    const pendientes = conversacion.pendientes || 0;

    let textoUltimoMensaje =
        "Conversación iniciada";

    if (ultimo) {
        const textoBase =
            ultimo.tipo ===
                "imagen"
                ? "📷 Foto"
                : ultimo.contenido;

        if (ultimo.eliminado === true) {
            textoUltimoMensaje =
                "Mensaje eliminado";
        } else if (
            ultimo.remitente_id ===
            usuarioActual?.id
        ) {
            textoUltimoMensaje =
                `Tú: ${textoBase}`;
        } else {
            textoUltimoMensaje =
                textoBase;
        }
    }

    return `
        <article
            class="conversacion-tarjeta"
            data-usuario-presencia="${escaparHTML(
                conversacion.otroUsuarioId ||
                ""
            )}"
            data-nombre-conversacion="${escaparHTML(
                nombre
            )}"
            data-archivada="${conversacion.archivada === true}"
            data-fijada="${conversacion.fijada === true}"
            data-pendientes="${pendientes}"
        >

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
                        <span class="conversacion-tarjeta__nombre-estado">
                            <strong>${escaparHTML(nombre)}</strong>

                            <span
                                class="conversacion-tarjeta__en-linea oculto"
                                data-indicador-presencia
                            >
                                <span aria-hidden="true"></span>
                                En línea
                            </span>
                        </span>

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
                                textoUltimoMensaje
                            )}
                        </span>
                    </span>
                </span>
            </a>

            ${pendientes > 0 ? `
                <span
                    class="conversacion-tarjeta__contador"
                    aria-label="${pendientes} mensajes pendientes"
                >
                    ${pendientes > 99 ? "99+" : pendientes}
                </span>
            ` : `
                <span
                    class="conversacion-tarjeta__contador-espacio"
                    aria-hidden="true"
                ></span>
            `}

            <div class="conversacion-tarjeta__acciones">
                <button
                    type="button"
                    class="conversacion-tarjeta__fijar"
                    data-fijar-conversacion="${escaparHTML(
                        conversacion.id
                    )}"
                    data-fijada="${conversacion.fijada === true}"
                    aria-label="${
                        conversacion.fijada === true
                            ? `Desfijar conversación con ${escaparHTML(nombre)}`
                            : `Fijar conversación con ${escaparHTML(nombre)}`
                    }"
                    title="${
                        conversacion.fijada === true
                            ? "Desfijar conversación"
                            : "Fijar conversación"
                    }"
                >
                    <i
                        class="fa-solid fa-thumbtack"
                        aria-hidden="true"
                    ></i>
                </button>

                <button
                    type="button"
                    class="conversacion-tarjeta__archivar"
                    data-archivar-conversacion="${escaparHTML(
                        conversacion.id
                    )}"
                    data-archivada="${conversacion.archivada === true}"
                    aria-label="${
                        conversacion.archivada === true
                            ? `Restaurar conversación con ${escaparHTML(nombre)}`
                            : `Archivar conversación con ${escaparHTML(nombre)}`
                    }"
                    title="${
                        conversacion.archivada === true
                            ? "Restaurar conversación"
                            : "Archivar conversación"
                    }"
                >
                    <i
                        class="fa-solid ${
                            conversacion.archivada === true
                                ? "fa-folder-open"
                                : "fa-folder-plus"
                        }"
                        aria-hidden="true"
                    ></i>
                </button>

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
            </div>

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
            ocultasResultado,
            archivadasResultado,
            fijadasResultado
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
                ),

            cliente
                .from("conversaciones_archivadas")
                .select("conversacion_id")
                .eq(
                    "usuario_id",
                    usuarioActual.id
                ),

            cliente
                .from("conversaciones_fijadas")
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

        if (archivadasResultado.error) {
            throw archivadasResultado.error;
        }

        if (fijadasResultado.error) {
            throw fijadasResultado.error;
        }

        const idsFijadas =
            new Set(
                (
                    fijadasResultado.data ||
                    []
                ).map(
                    (
                        fila
                    ) =>
                        fila.conversacion_id
                )
            );

        const idsArchivadas =
            new Set(
                (
                    archivadasResultado.data ||
                    []
                ).map(
                    (
                        fila
                    ) =>
                        fila.conversacion_id
                )
            );

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
            actualizarTituloNoLeidos(
                0
            );

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
                .select("id,conversacion_id,remitente_id,contenido,eliminado,eliminado_en,leido,creado_en")
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

        const preparadas = conversaciones
            .map(
                (
                    conversacion
                ) => {
                    const otroId =
                        conversacion.usuario_uno_id ===
                        usuarioActual.id
                            ? conversacion.usuario_dos_id
                            : conversacion.usuario_uno_id;

                    const listaMensajes =
                        mensajes.get(
                            conversacion.id
                        ) ||
                        [];

                    return {
                        ...conversacion,

                        perfil:
                            perfiles.get(
                                otroId
                            ) ||
                            null,

                        otroUsuarioId:
                            otroId,

                        ultimo:
                            listaMensajes[0] ||
                            null,

                        archivada:
                            idsArchivadas.has(
                                conversacion.id
                            ),

                        fijada:
                            idsFijadas.has(
                                conversacion.id
                            ),

                        pendientes:
                            listaMensajes.filter(
                                (
                                    mensaje
                                ) =>
                                    mensaje.leido !==
                                        true &&
                                    mensaje.remitente_id !==
                                        usuarioActual.id &&
                                    mensaje.eliminado !==
                                        true
                            ).length
                    };
                }
            )
            .sort(
                (
                    primera,
                    segunda
                ) => {
                    if (
                        primera.fijada !==
                        segunda.fijada
                    ) {
                        return primera.fijada
                            ? -1
                            : 1;
                    }

                    const fechaPrimera =
                        primera.ultimo?.creado_en ||
                        primera.actualizado_en ||
                        "";

                    const fechaSegunda =
                        segunda.ultimo?.creado_en ||
                        segunda.actualizado_en ||
                        "";

                    return (
                        new Date(
                            fechaSegunda
                        ).getTime() -
                        new Date(
                            fechaPrimera
                        ).getTime()
                    );
                }
            );

        const totalPendientes =
            preparadas.reduce(
                (
                    total,
                    conversacion
                ) =>
                    total +
                    (
                        conversacion.pendientes ||
                        0
                    ),
                0
            );

        actualizarTituloNoLeidos(
            totalPendientes
        );

        lista.innerHTML =
            preparadas
                .map(
                    tarjeta
                )
                .join("");

        crearBuscadorConversaciones();
        crearFiltrosConversaciones();
        filtrarConversaciones();
        activarBotonesFijarConversacion();
        activarBotonesArchivarConversacion();
        activarBotonesEliminarConversacion();
        iniciarPresenciasConversaciones();

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


async function cambiarFijadoConversacion(
    conversacionId,
    estaFijada,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionId ||
        !boton
    ) {
        return;
    }

    const contenidoAnterior =
        boton.innerHTML;

    boton.disabled =
        true;

    boton.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>
    `;

    try {
        const funcion =
            estaFijada
                ? "desfijar_conversacion"
                : "fijar_conversacion";

        const {
            error
        } = await cliente.rpc(
            funcion,
            {
                conversacion_buscada:
                    conversacionId
            }
        );

        if (error) {
            throw error;
        }

        await cargarConversaciones();
    } catch (error) {
        console.error(
            "No se pudo cambiar el fijado de la conversación:",
            error
        );

        boton.disabled =
            false;

        boton.innerHTML =
            contenidoAnterior;

        window.alert(
            estaFijada
                ? "No se ha podido desfijar la conversación."
                : "No se ha podido fijar la conversación."
        );
    }
}


function activarBotonesFijarConversacion() {
    document
        .querySelectorAll(
            "[data-fijar-conversacion]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        cambiarFijadoConversacion(
                            boton.dataset
                                .fijarConversacion,
                            boton.dataset
                                .fijada ===
                                "true",
                            boton
                        );
                    }
                );
            }
        );
}


async function cambiarArchivadoConversacion(
    conversacionId,
    estaArchivada,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionId ||
        !boton
    ) {
        return;
    }

    const contenidoAnterior =
        boton.innerHTML;

    boton.disabled =
        true;

    boton.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>
    `;

    try {
        const funcion =
            estaArchivada
                ? "desarchivar_conversacion"
                : "archivar_conversacion";

        const {
            error
        } = await cliente.rpc(
            funcion,
            {
                conversacion_buscada:
                    conversacionId
            }
        );

        if (error) {
            throw error;
        }

        await cargarConversaciones();
    } catch (error) {
        console.error(
            "No se pudo cambiar el archivado de la conversación:",
            error
        );

        boton.disabled =
            false;

        boton.innerHTML =
            contenidoAnterior;

        window.alert(
            estaArchivada
                ? "No se ha podido restaurar la conversación."
                : "No se ha podido archivar la conversación."
        );
    }
}


function activarBotonesArchivarConversacion() {
    document
        .querySelectorAll(
            "[data-archivar-conversacion]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        cambiarArchivadoConversacion(
                            boton.dataset
                                .archivarConversacion,
                            boton.dataset
                                .archivada ===
                                "true",
                            boton
                        );
                    }
                );
            }
        );
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


async function consultarPresenciaConversacion(
    tarjeta
) {
    const cliente =
        window.clienteSupabase;

    const usuarioId =
        tarjeta?.dataset
            ?.usuarioPresencia ||
        "";

    const indicador =
        tarjeta?.querySelector(
            "[data-indicador-presencia]"
        );

    if (
        !cliente ||
        !usuarioId ||
        !indicador
    ) {
        return;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_presencia_usuario",
            {
                usuario_buscado:
                    usuarioId
            }
        );

        if (error) {
            throw error;
        }

        const presencia =
            Array.isArray(
                data
            )
                ? data[0]
                : data;

        indicador.classList.toggle(
            "oculto",
            presencia?.en_linea !==
                true
        );
    } catch (error) {
        console.error(
            "No se pudo consultar la presencia en conversaciones:",
            error
        );

        indicador.classList.add(
            "oculto"
        );
    }
}


async function actualizarPresenciasConversaciones() {
    const tarjetas =
        [
            ...document.querySelectorAll(
                "[data-usuario-presencia]"
            )
        ];

    await Promise.all(
        tarjetas.map(
            consultarPresenciaConversacion
        )
    );
}


function iniciarPresenciasConversaciones() {
    window.clearInterval(
        intervaloPresenciasConversaciones
    );

    actualizarPresenciasConversaciones();

    intervaloPresenciasConversaciones =
        window.setInterval(
            actualizarPresenciasConversaciones,
            4000
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
                        "Pulsa para abrir la conversación.",
                        cambio.new.conversacion_id
                    );
                }

                cargarConversaciones();
            }
        )
        .on(
            "postgres_changes",
            {
                event:
                    "*",

                schema:
                    "public",

                table:
                    "conversaciones_archivadas"
            },
            cargarConversaciones
        )
        .on(
            "postgres_changes",
            {
                event:
                    "*",

                schema:
                    "public",

                table:
                    "conversaciones_fijadas"
            },
            cargarConversaciones
        )
        .subscribe();
}

window.addEventListener("beforeunload", () => {
    window.clearInterval(
        intervaloPresenciasConversaciones
    );

    intervaloPresenciasConversaciones =
        null;

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