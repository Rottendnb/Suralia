function obtenerConversacionId() {
    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return parametros
        .get("id")
        ?.trim() ||
        "";
}


const cargaMensajes =
    document.querySelector(
        "#mensajes-carga"
    );

const errorMensajes =
    document.querySelector(
        "#mensajes-error"
    );

const errorMensajesTexto =
    document.querySelector(
        "#mensajes-error-texto"
    );

const chatSuralia =
    document.querySelector(
        "#chat-suralia"
    );

const chatNombre =
    document.querySelector(
        "#chat-nombre"
    );

const chatAvatar =
    document.querySelector(
        "#chat-avatar"
    );

const chatEnLinea =
    document.querySelector(
        "#chat-en-linea"
    );

const chatVerPerfil =
    document.querySelector(
        "#chat-ver-perfil"
    );

let chatEscribiendo =
    document.querySelector(
        "#chat-escribiendo"
    );

const listaMensajes =
    document.querySelector(
        "#chat-lista-mensajes"
    );

const formularioChat =
    document.querySelector(
        "#chat-formulario"
    );

const campoMensaje =
    document.querySelector(
        "#chat-mensaje"
    );

const botonEnviarMensaje =
    formularioChat?.querySelector(
        'button[type="submit"]'
    );

const botonAdjuntarImagen =
    document.querySelector(
        "#chat-adjuntar-imagen"
    );

const campoArchivoImagen =
    document.querySelector(
        "#chat-archivo-imagen"
    );

const campoCamaraImagen =
    document.querySelector(
        "#chat-camara-imagen"
    );

const menuImagenChat =
    document.querySelector(
        "#chat-menu-imagen"
    );

const botonHacerFoto =
    document.querySelector(
        "#chat-hacer-foto"
    );

const botonElegirGaleria =
    document.querySelector(
        "#chat-elegir-galeria"
    );

const botonCancelarMenuImagen =
    document.querySelector(
        "#chat-cancelar-menu-imagen"
    );

const estadoSubidaImagen =
    document.querySelector(
        "#chat-estado-subida"
    );

const textoSubidaImagen =
    document.querySelector(
        "#chat-texto-subida"
    );

const porcentajeSubidaImagen =
    document.querySelector(
        "#chat-porcentaje-subida"
    );

const barraSubidaImagen =
    document.querySelector(
        "#chat-barra-subida"
    );

const vistaPreviaImagen =
    document.querySelector(
        "#chat-vista-previa-imagen"
    );

const imagenPrevia =
    document.querySelector(
        "#chat-imagen-previa"
    );

const botonCancelarImagen =
    document.querySelector(
        "#chat-cancelar-imagen"
    );

const modalImagenChat =
    document.querySelector(
        "#modal-imagen-chat"
    );

const modalImagenChatImg =
    document.querySelector(
        "#modal-imagen-chat-img"
    );

const cerrarModalImagenChat =
    document.querySelector(
        "#cerrar-modal-imagen-chat"
    );

const cerrarModalImagenFondo =
    document.querySelector(
        "#cerrar-modal-imagen-fondo"
    );


let usuarioSesionActual =
    null;

let conversacionActualId =
    "";

let otroUsuarioActualId =
    "";

let chatPuedeEnviar =
    false;

let avisoChatNoDisponible =
    null;

let intervaloDisponibilidadChat =
    null;

let intervaloPresenciaPropia =
    null;

let intervaloPresenciaRemota =
    null;

let canalMensajes =
    null;

let canalMensajesListo =
    false;

let canalEscrituraTabla =
    null;

let intervaloEscrituraLocal =
    null;

let temporizadorEscrituraLocal =
    null;

let temporizadorEscrituraRemota =
    null;

let usuarioEstaEscribiendo =
    false;

const mensajesRenderizados =
    new Set();

let ultimaFechaRenderizada =
    "";

let mensajePendienteEliminarId =
    "";

let mensajeRespuestaActual =
    null;

let mensajeEdicionActual =
    null;

let barraEdicionChat =
    null;

let botonCancelarEdicion =
    null;

const EMOJIS_REACCION_CHAT = [
    "👍",
    "❤️",
    "😂",
    "😮"
];

const reaccionesPorMensaje =
    new Map();

let reaccionesChatDisponibles =
    true;

let barraRespuestaChat =
    null;

let botonCancelarRespuesta =
    null;

let botonBajarUltimoMensaje =
    null;

let contadorNuevosMensajes =
    null;

let nuevosMensajesPendientes =
    0;

let archivoImagenSeleccionado =
    null;

let urlVistaPreviaImagen =
    "";

let temporizadorProgresoImagen =
    null;

const modalEliminarMensaje =
    document.querySelector(
        "#modal-eliminar-mensaje"
    );

const cancelarEliminarMensaje =
    document.querySelector(
        "#cancelar-eliminar-mensaje"
    );

const confirmarEliminarMensaje =
    document.querySelector(
        "#confirmar-eliminar-mensaje"
    );


function leerDatoLocal(
    clave,
    valorAlternativo = null
) {
    try {
        const contenido =
            localStorage.getItem(
                clave
            );

        return contenido
            ? JSON.parse(
                contenido
            )
            : valorAlternativo;
    } catch (error) {
        console.error(
            `No se pudo leer ${clave}:`,
            error
        );

        return valorAlternativo;
    }
}


async function cargarUsuarioHeaderMensajes() {
    const avatarHeader =
        document.querySelector(
            "#avatar-header"
        );

    const nombreHeader =
        document.querySelector(
            "#nombre-header"
        );

    if (
        !avatarHeader ||
        !nombreHeader
    ) {
        return;
    }

    const usuarioLocal =
        leerDatoLocal(
            "usuarioSuralia",
            {}
        ) || {};

    const nombreLocal =
        usuarioLocal.nombre ||
        "Mi perfil";

    const apellidosLocal =
        usuarioLocal.apellidos ||
        "";

    nombreHeader.textContent =
        nombreLocal;

    const iniciales =
        `${nombreLocal.charAt(0)}${apellidosLocal.charAt(0)}`
            .trim()
            .toUpperCase() ||
        "SU";

    function mostrarIniciales() {
        avatarHeader.textContent =
            iniciales;

        avatarHeader.style.backgroundImage =
            "";

        avatarHeader.style.backgroundPosition =
            "";

        avatarHeader.style.backgroundSize =
            "";

        avatarHeader.style.backgroundRepeat =
            "";

        avatarHeader.classList.remove(
            "avatar--imagen",
            "usuario-header__avatar--imagen"
        );
    }

    function mostrarImagen(
        url
    ) {
        if (!url) {
            mostrarIniciales();
            return;
        }

        avatarHeader.textContent =
            "";

        avatarHeader.style.backgroundImage =
            `url("${url}")`;

        avatarHeader.style.backgroundPosition =
            "center";

        avatarHeader.style.backgroundSize =
            "cover";

        avatarHeader.style.backgroundRepeat =
            "no-repeat";

        avatarHeader.classList.add(
            "avatar--imagen",
            "usuario-header__avatar--imagen"
        );
    }

    if (
        usuarioLocal.avatarTipo ===
            "imagen" &&
        usuarioLocal.avatarValor
    ) {
        mostrarImagen(
            usuarioLocal.avatarValor
        );
    } else {
        mostrarIniciales();
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente?.auth) {
        return;
    }

    try {
        const {
            data: datosSesion,
            error: errorSesion
        } = await cliente.auth.getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        const usuarioAutenticado =
            datosSesion.session?.user;

        if (!usuarioAutenticado) {
            return;
        }

        const {
            data: perfilConectado,
            error: errorPerfil
        } = await cliente
            .from("perfiles_sociales")
            .select(
                `
                    nombre_visible,
                    foto_principal_url,
                    perfil_publico_id
                `
            )
            .eq(
                "usuario_id",
                usuarioAutenticado.id
            )
            .maybeSingle();

        if (errorPerfil) {
            throw errorPerfil;
        }

        if (
            perfilConectado?.nombre_visible
        ) {
            nombreHeader.textContent =
                perfilConectado.nombre_visible;
        }

        if (
            perfilConectado?.foto_principal_url
        ) {
            mostrarImagen(
                perfilConectado.foto_principal_url
            );

            localStorage.setItem(
                "usuarioSuralia",
                JSON.stringify({
                    ...usuarioLocal,
                    avatarTipo:
                        "imagen",
                    avatarValor:
                        perfilConectado.foto_principal_url
                })
            );
        } else {
            mostrarIniciales();
        }
    } catch (error) {
        console.error(
            "No se pudo cargar el avatar del header en mensajes:",
            error
        );
    }
}


let contextoAudioChat =
    null;

let sonidoChatPreparado =
    false;


function prepararSonidoChat() {
    if (sonidoChatPreparado) {
        return;
    }

    const AudioContexto =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContexto) {
        return;
    }

    try {
        contextoAudioChat =
            contextoAudioChat ||
            new AudioContexto();

        if (
            contextoAudioChat.state ===
            "suspended"
        ) {
            contextoAudioChat.resume();
        }

        sonidoChatPreparado =
            true;
    } catch (error) {
        console.error(
            "No se pudo preparar el sonido del chat:",
            error
        );
    }
}


async function reproducirSonidoChat() {
    prepararSonidoChat();

    if (!contextoAudioChat) {
        return;
    }

    try {
        if (
            contextoAudioChat.state ===
            "suspended"
        ) {
            await contextoAudioChat.resume();
        }

        if (
            contextoAudioChat.state !==
            "running"
        ) {
            return;
        }

        const ahora =
            contextoAudioChat.currentTime;

        const ganancia =
            contextoAudioChat.createGain();

        const tonoUno =
            contextoAudioChat.createOscillator();

        const tonoDos =
            contextoAudioChat.createOscillator();

        ganancia.gain.setValueAtTime(
            0.0001,
            ahora
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.13,
            ahora + 0.015
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.34
        );

        tonoUno.type =
            "sine";

        tonoUno.frequency.setValueAtTime(
            720,
            ahora
        );

        tonoDos.type =
            "sine";

        tonoDos.frequency.setValueAtTime(
            980,
            ahora + 0.09
        );

        tonoUno.connect(
            ganancia
        );

        tonoDos.connect(
            ganancia
        );

        ganancia.connect(
            contextoAudioChat.destination
        );

        tonoUno.start(
            ahora
        );

        tonoUno.stop(
            ahora + 0.18
        );

        tonoDos.start(
            ahora + 0.09
        );

        tonoDos.stop(
            ahora + 0.32
        );
    } catch (error) {
        console.error(
            "No se pudo reproducir el sonido del chat:",
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
            prepararSonidoChat,
            {
                passive:
                    true
            }
        );
    }
);


function escaparHTML(
    valor = ""
) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function mostrarErrorMensajes(
    mensaje
) {
    cargaMensajes?.classList.add(
        "oculto"
    );

    chatSuralia?.classList.add(
        "oculto"
    );

    errorMensajes?.classList.remove(
        "oculto"
    );

    if (errorMensajesTexto) {
        errorMensajesTexto.textContent =
            mensaje;
    }
}


function mostrarAvatarChat(
    perfil
) {
    if (!chatAvatar) {
        return;
    }

    if (perfil?.foto_principal_url) {
        chatAvatar.innerHTML = `
            <img
                src="${escaparHTML(
                    perfil.foto_principal_url
                )}"
                alt=""
            >
        `;

        return;
    }

    const inicial =
        (
            perfil?.nombre_visible ||
            "S"
        )
            .charAt(0)
            .toUpperCase();

    chatAvatar.textContent =
        inicial;
}


function formatearHoraMensaje(
    fecha
) {
    if (!fecha) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        new Date(fecha)
    );
}


function obtenerClaveFechaMensaje(
    fecha
) {
    if (!fecha) {
        return "";
    }

    const fechaMensaje =
        new Date(fecha);

    if (
        Number.isNaN(
            fechaMensaje.getTime()
        )
    ) {
        return "";
    }

    const anio =
        fechaMensaje.getFullYear();

    const mes =
        String(
            fechaMensaje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            fechaMensaje.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${anio}-${mes}-${dia}`;
}


function formatearSeparadorFecha(
    fecha
) {
    const fechaMensaje =
        new Date(fecha);

    const hoy =
        new Date();

    const ayer =
        new Date();

    ayer.setDate(
        hoy.getDate() - 1
    );

    const mismaFecha = (
        primera,
        segunda
    ) =>
        primera.getFullYear() ===
            segunda.getFullYear() &&
        primera.getMonth() ===
            segunda.getMonth() &&
        primera.getDate() ===
            segunda.getDate();

    if (
        mismaFecha(
            fechaMensaje,
            hoy
        )
    ) {
        return "Hoy";
    }

    if (
        mismaFecha(
            fechaMensaje,
            ayer
        )
    ) {
        return "Ayer";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day:
                "numeric",

            month:
                "long",

            year:
                fechaMensaje.getFullYear() ===
                hoy.getFullYear()
                    ? undefined
                    : "numeric"
        }
    ).format(
        fechaMensaje
    );
}


function crearSeparadorFecha(
    fecha
) {
    const separador =
        document.createElement(
            "div"
        );

    separador.className =
        "chat-suralia__separador-fecha";

    separador.setAttribute(
        "role",
        "separator"
    );

    separador.innerHTML = `
        <span>
            ${escaparHTML(
                formatearSeparadorFecha(
                    fecha
                )
            )}
        </span>
    `;

    return separador;
}



function esMensajeImagen(
    mensaje
) {
    return (
        mensaje?.tipo ===
            "imagen" &&
        Boolean(
            mensaje?.imagen_ruta
        )
    );
}


async function obtenerUrlImagenMensaje(
    mensaje
) {
    if (
        !esMensajeImagen(
            mensaje
        )
    ) {
        return "";
    }

    if (
        mensaje.imagen_url_temporal
    ) {
        return mensaje.imagen_url_temporal;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return "";
    }

    try {
        const {
            data,
            error
        } = await cliente
            .storage
            .from(
                "imagenes-chat"
            )
            .createSignedUrl(
                mensaje.imagen_ruta,
                3600
            );

        if (error) {
            throw error;
        }

        return (
            data?.signedUrl ||
            ""
        );
    } catch (error) {
        console.error(
            "No se pudo abrir la imagen del mensaje:",
            error
        );

        return "";
    }
}


async function obtenerMensajeRespondido(
    mensajeRespuestaId
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !mensajeRespuestaId
    ) {
        return null;
    }

    try {
        const {
            data,
            error
        } = await cliente
            .from("mensajes")
            .select(
                `
                    id,
                    remitente_id,
                    contenido,
                    tipo,
                    eliminado
                `
            )
            .eq(
                "id",
                mensajeRespuestaId
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || null;
    } catch (error) {
        console.error(
            "No se pudo cargar el mensaje respondido:",
            error
        );

        return null;
    }
}


function obtenerResumenRespuesta(
    mensaje
) {
    if (!mensaje) {
        return "Mensaje no disponible";
    }

    if (mensaje.eliminado) {
        return "Mensaje eliminado";
    }

    if (mensaje.tipo === "imagen") {
        return mensaje.contenido &&
            mensaje.contenido !== "Foto"
                ? `Foto: ${mensaje.contenido}`
                : "Foto";
    }

    const contenido =
        String(
            mensaje.contenido || ""
        ).trim();

    if (!contenido) {
        return "Mensaje";
    }

    return contenido.length > 90
        ? `${contenido.slice(0, 90)}…`
        : contenido;
}


async function prepararMensajeParaRender(
    mensaje
) {
    const mensajePreparado = {
        ...mensaje
    };

    if (
        esMensajeImagen(
            mensajePreparado
        )
    ) {
        mensajePreparado.imagen_url_temporal =
            await obtenerUrlImagenMensaje(
                mensajePreparado
            );
    }

    if (
        mensajePreparado.mensaje_respuesta_id
    ) {
        mensajePreparado.respuesta_previa =
            await obtenerMensajeRespondido(
                mensajePreparado
                    .mensaje_respuesta_id
            );
    }

    return mensajePreparado;
}


function esDispositivoMovil() {
    return (
        window.matchMedia(
            "(max-width: 760px)"
        ).matches ||
        /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        )
    );
}


function mostrarMenuImagenChat() {
    menuImagenChat?.classList.remove(
        "oculto"
    );
}


function ocultarMenuImagenChat() {
    menuImagenChat?.classList.add(
        "oculto"
    );
}


function actualizarProgresoImagen(
    porcentaje,
    texto
) {
    const valor =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    porcentaje
                ) || 0
            )
        );

    if (barraSubidaImagen) {
        barraSubidaImagen.style.width =
            `${valor}%`;
    }

    if (porcentajeSubidaImagen) {
        porcentajeSubidaImagen.textContent =
            `${Math.round(
                valor
            )}%`;
    }

    if (
        texto &&
        textoSubidaImagen
    ) {
        textoSubidaImagen.textContent =
            texto;
    }
}


function iniciarProgresoImagen() {
    window.clearInterval(
        temporizadorProgresoImagen
    );

    estadoSubidaImagen?.classList.remove(
        "oculto"
    );

    let progreso =
        12;

    actualizarProgresoImagen(
        progreso,
        "Subiendo imagen..."
    );

    temporizadorProgresoImagen =
        window.setInterval(
            () => {
                if (
                    progreso >= 88
                ) {
                    return;
                }

                progreso +=
                    progreso < 55
                        ? 8
                        : 3;

                actualizarProgresoImagen(
                    progreso,
                    "Subiendo imagen..."
                );
            },
            280
        );
}


function completarProgresoImagen() {
    window.clearInterval(
        temporizadorProgresoImagen
    );

    temporizadorProgresoImagen =
        null;

    actualizarProgresoImagen(
        100,
        "Imagen enviada"
    );

    window.setTimeout(
        () => {
            estadoSubidaImagen?.classList.add(
                "oculto"
            );

            actualizarProgresoImagen(
                0,
                "Preparando imagen..."
            );
        },
        650
    );
}


function cancelarProgresoImagen() {
    window.clearInterval(
        temporizadorProgresoImagen
    );

    temporizadorProgresoImagen =
        null;

    estadoSubidaImagen?.classList.add(
        "oculto"
    );

    actualizarProgresoImagen(
        0,
        "Preparando imagen..."
    );
}


function liberarVistaPreviaImagen() {
    if (urlVistaPreviaImagen) {
        URL.revokeObjectURL(
            urlVistaPreviaImagen
        );
    }

    urlVistaPreviaImagen =
        "";

    archivoImagenSeleccionado =
        null;

    if (campoArchivoImagen) {
        campoArchivoImagen.value =
            "";
    }

    if (campoCamaraImagen) {
        campoCamaraImagen.value =
            "";
    }

    ocultarMenuImagenChat();

    if (imagenPrevia) {
        imagenPrevia.src =
            "";
    }

    vistaPreviaImagen?.classList.add(
        "oculto"
    );
}


function seleccionarImagenChat(
    archivo
) {
    const tiposPermitidos =
        [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

    const limiteBytes =
        5 * 1024 * 1024;

    if (!archivo) {
        liberarVistaPreviaImagen();
        return;
    }

    if (
        !tiposPermitidos.includes(
            archivo.type
        )
    ) {
        window.alert(
            "Selecciona una imagen JPG, PNG, WEBP o GIF."
        );

        liberarVistaPreviaImagen();
        return;
    }

    if (
        archivo.size >
        limiteBytes
    ) {
        window.alert(
            "La imagen no puede superar los 5 MB."
        );

        liberarVistaPreviaImagen();
        return;
    }

    liberarVistaPreviaImagen();

    archivoImagenSeleccionado =
        archivo;

    urlVistaPreviaImagen =
        URL.createObjectURL(
            archivo
        );

    if (imagenPrevia) {
        imagenPrevia.src =
            urlVistaPreviaImagen;
    }

    vistaPreviaImagen?.classList.remove(
        "oculto"
    );
}


function obtenerExtensionImagen(
    archivo
) {
    const extensiones = {
        "image/jpeg":
            "jpg",

        "image/png":
            "png",

        "image/webp":
            "webp",

        "image/gif":
            "gif"
    };

    return (
        extensiones[
            archivo?.type
        ] ||
        "jpg"
    );
}


function generarNombreImagenChat(
    archivo
) {
    const extension =
        obtenerExtensionImagen(
            archivo
        );

    const identificador =
        typeof crypto?.randomUUID ===
            "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                .toString(16)
                .slice(2)}`;

    return `${identificador}.${extension}`;
}


function cargarImagenDesdeArchivo(
    archivo
) {
    return new Promise(
        (
            resolver,
            rechazar
        ) => {
            const urlTemporal =
                URL.createObjectURL(
                    archivo
                );

            const imagen =
                new Image();

            imagen.onload =
                () => {
                    URL.revokeObjectURL(
                        urlTemporal
                    );

                    resolver(
                        imagen
                    );
                };

            imagen.onerror =
                () => {
                    URL.revokeObjectURL(
                        urlTemporal
                    );

                    rechazar(
                        new Error(
                            "No se pudo preparar la imagen."
                        )
                    );
                };

            imagen.src =
                urlTemporal;
        }
    );
}


function convertirCanvasABlob(
    canvas,
    tipo,
    calidad
) {
    return new Promise(
        (
            resolver,
            rechazar
        ) => {
            canvas.toBlob(
                (
                    blob
                ) => {
                    if (!blob) {
                        rechazar(
                            new Error(
                                "No se pudo comprimir la imagen."
                            )
                        );

                        return;
                    }

                    resolver(
                        blob
                    );
                },
                tipo,
                calidad
            );
        }
    );
}


async function optimizarImagenChat(
    archivo
) {
    if (!archivo) {
        return archivo;
    }

    /*
     * Los GIF no se procesan con canvas porque perderían
     * su animación. También evitamos recomprimir archivos
     * pequeños que ya están suficientemente optimizados.
     */
    if (
        archivo.type ===
            "image/gif" ||
        archivo.size <=
            700 * 1024
    ) {
        return archivo;
    }

    try {
        actualizarProgresoImagen(
            4,
            "Optimizando imagen..."
        );

        const imagen =
            await cargarImagenDesdeArchivo(
                archivo
            );

        const anchoMaximo =
            1600;

        const altoMaximo =
            1600;

        const escala =
            Math.min(
                1,
                anchoMaximo /
                    imagen.naturalWidth,
                altoMaximo /
                    imagen.naturalHeight
            );

        const anchoFinal =
            Math.max(
                1,
                Math.round(
                    imagen.naturalWidth *
                    escala
                )
            );

        const altoFinal =
            Math.max(
                1,
                Math.round(
                    imagen.naturalHeight *
                    escala
                )
            );

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            anchoFinal;

        canvas.height =
            altoFinal;

        const contexto =
            canvas.getContext(
                "2d",
                {
                    alpha:
                        true
                }
            );

        if (!contexto) {
            return archivo;
        }

        contexto.imageSmoothingEnabled =
            true;

        contexto.imageSmoothingQuality =
            "high";

        contexto.drawImage(
            imagen,
            0,
            0,
            anchoFinal,
            altoFinal
        );

        const tipoSalida =
            "image/webp";

        const blobOptimizado =
            await convertirCanvasABlob(
                canvas,
                tipoSalida,
                0.82
            );

        /*
         * Solo usamos el resultado si realmente ocupa menos.
         */
        if (
            blobOptimizado.size >=
            archivo.size
        ) {
            return archivo;
        }

        const nombreBase =
            archivo.name
                .replace(
                    /\.[^.]+$/,
                    ""
                )
                .trim() ||
            "imagen";

        return new File(
            [
                blobOptimizado
            ],
            `${nombreBase}.webp`,
            {
                type:
                    tipoSalida,

                lastModified:
                    Date.now()
            }
        );
    } catch (error) {
        console.error(
            "No se pudo optimizar la imagen. Se enviará la original:",
            error
        );

        return archivo;
    }
}


async function subirImagenChat(
    archivo
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !archivo ||
        !usuarioSesionActual ||
        !conversacionActualId
    ) {
        throw new Error(
            "No se puede subir la imagen."
        );
    }

    const ruta =
        `${conversacionActualId}/${usuarioSesionActual.id}/${generarNombreImagenChat(
            archivo
        )}`;

    const {
        error
    } = await cliente
        .storage
        .from(
            "imagenes-chat"
        )
        .upload(
            ruta,
            archivo,
            {
                cacheControl:
                    "3600",

                upsert:
                    false,

                contentType:
                    archivo.type
            }
        );

    if (error) {
        throw error;
    }

    return ruta;
}


function agruparReaccionesMensaje(
    mensajeId
) {
    const reacciones =
        reaccionesPorMensaje.get(
            mensajeId
        ) || [];

    return EMOJIS_REACCION_CHAT
        .map(
            (
                emoji
            ) => {
                const usuarios =
                    reacciones.filter(
                        (
                            reaccion
                        ) =>
                            reaccion.emoji ===
                            emoji
                    );

                return {
                    emoji,
                    cantidad:
                        usuarios.length,
                    reaccionPropia:
                        usuarios.some(
                            (
                                reaccion
                            ) =>
                                reaccion.usuario_id ===
                                usuarioSesionActual?.id
                        )
                };
            }
        )
        .filter(
            (
                grupo
            ) =>
                grupo.cantidad > 0
        );
}


function crearHTMLReaccionesMensaje(
    mensajeId
) {
    const grupos =
        agruparReaccionesMensaje(
            mensajeId
        );

    if (!grupos.length) {
        return "";
    }

    return grupos
        .map(
            (
                grupo
            ) => `
                <button
                    type="button"
                    class="chat-reaccion-resumen ${
                        grupo.reaccionPropia
                            ? "chat-reaccion-resumen--propia"
                            : ""
                    }"
                    data-reaccion-rapida="${escaparHTML(
                        grupo.emoji
                    )}"
                    data-mensaje-reaccion="${escaparHTML(
                        mensajeId
                    )}"
                    aria-label="Reaccionar con ${escaparHTML(
                        grupo.emoji
                    )}"
                    title="Reaccionar con ${escaparHTML(
                        grupo.emoji
                    )}"
                >
                    <span aria-hidden="true">
                        ${escaparHTML(
                            grupo.emoji
                        )}
                    </span>

                    <strong>
                        ${grupo.cantidad}
                    </strong>
                </button>
            `
        )
        .join("");
}


function crearHTMLSelectorReacciones(
    mensajeId
) {
    return EMOJIS_REACCION_CHAT
        .map(
            (
                emoji
            ) => `
                <button
                    type="button"
                    class="chat-reaccion-selector__opcion"
                    data-reaccion-rapida="${escaparHTML(
                        emoji
                    )}"
                    data-mensaje-reaccion="${escaparHTML(
                        mensajeId
                    )}"
                    aria-label="Reaccionar con ${escaparHTML(
                        emoji
                    )}"
                    title="Reaccionar con ${escaparHTML(
                        emoji
                    )}"
                >
                    ${escaparHTML(
                        emoji
                    )}
                </button>
            `
        )
        .join("");
}


async function cargarReaccionesConversacion() {
    const cliente =
        window.clienteSupabase;

    reaccionesPorMensaje.clear();

    if (
        !cliente ||
        !conversacionActualId
    ) {
        return;
    }

    const {
        data,
        error
    } = await cliente
        .from(
            "mensaje_reacciones"
        )
        .select(
            `
                id,
                mensaje_id,
                conversacion_id,
                usuario_id,
                emoji,
                creado_en
            `
        )
        .eq(
            "conversacion_id",
            conversacionActualId
        );

    if (error) {
        reaccionesChatDisponibles =
            false;

        console.error(
            "No se pudieron cargar las reacciones. El chat continuará sin ellas:",
            error
        );

        return;
    }

    reaccionesChatDisponibles =
        true;

    for (
        const reaccion
        of data || []
    ) {
        const actuales =
            reaccionesPorMensaje.get(
                reaccion.mensaje_id
            ) || [];

        actuales.push(
            reaccion
        );

        reaccionesPorMensaje.set(
            reaccion.mensaje_id,
            actuales
        );
    }
}


function actualizarMapaReacciones(
    cambio
) {
    const reaccionNueva =
        cambio.new &&
        Object.keys(
            cambio.new
        ).length
            ? cambio.new
            : null;

    const reaccionAnterior =
        cambio.old &&
        Object.keys(
            cambio.old
        ).length
            ? cambio.old
            : null;

    const mensajeId =
        reaccionNueva?.mensaje_id ||
        reaccionAnterior?.mensaje_id;

    if (!mensajeId) {
        return "";
    }

    let actuales = [
        ...(
            reaccionesPorMensaje.get(
                mensajeId
            ) || []
        )
    ];

    if (cambio.eventType === "DELETE") {
        actuales =
            actuales.filter(
                (
                    reaccion
                ) =>
                    reaccion.id !==
                    reaccionAnterior?.id
            );
    } else {
        actuales =
            actuales.filter(
                (
                    reaccion
                ) =>
                    reaccion.id !==
                    reaccionNueva?.id &&
                    reaccion.usuario_id !==
                    reaccionNueva?.usuario_id
            );

        actuales.push(
            reaccionNueva
        );
    }

    if (actuales.length) {
        reaccionesPorMensaje.set(
            mensajeId,
            actuales
        );
    } else {
        reaccionesPorMensaje.delete(
            mensajeId
        );
    }

    return mensajeId;
}


function actualizarReaccionesMensajeEnPantalla(
    mensajeId
) {
    if (
        !mensajeId ||
        !listaMensajes
    ) {
        return;
    }

    const selectorSeguro =
        window.CSS?.escape
            ? CSS.escape(
                String(
                    mensajeId
                )
            )
            : String(
                mensajeId
            ).replace(
                /["\\]/g,
                "\\$&"
            );

    const articulo =
        listaMensajes.querySelector(
            `[data-mensaje-id="${selectorSeguro}"]`
        );

    const contenedor =
        articulo?.querySelector(
            "[data-lista-reacciones]"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        crearHTMLReaccionesMensaje(
            mensajeId
        );

    contenedor.classList.toggle(
        "chat-mensaje__reacciones--vacias",
        !contenedor.innerHTML.trim()
    );
}


function cerrarSelectoresReacciones(
    excepto = null
) {
    document
        .querySelectorAll(
            ".chat-reaccion-selector:not(.oculto)"
        )
        .forEach(
            (
                selector
            ) => {
                if (
                    selector !==
                    excepto
                ) {
                    selector.classList.add(
                        "oculto"
                    );
                }
            }
        );
}


function alternarSelectorReacciones(
    boton
) {
    const articulo =
        boton?.closest(
            "[data-mensaje-id]"
        );

    const selector =
        articulo?.querySelector(
            ".chat-reaccion-selector"
        );

    if (!selector) {
        return;
    }

    const estabaOculto =
        selector.classList.contains(
            "oculto"
        );

    cerrarSelectoresReacciones(
        selector
    );

    selector.classList.toggle(
        "oculto",
        !estabaOculto
    );
}


async function recargarReaccionesDeMensaje(
    mensajeId
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !mensajeId
    ) {
        return;
    }

    const {
        data,
        error
    } = await cliente
        .from(
            "mensaje_reacciones"
        )
        .select(
            `
                id,
                mensaje_id,
                conversacion_id,
                usuario_id,
                emoji,
                creado_en
            `
        )
        .eq(
            "mensaje_id",
            mensajeId
        );

    if (error) {
        throw error;
    }

    if (data?.length) {
        reaccionesPorMensaje.set(
            mensajeId,
            data
        );
    } else {
        reaccionesPorMensaje.delete(
            mensajeId
        );
    }

    actualizarReaccionesMensajeEnPantalla(
        mensajeId
    );
}


async function alternarReaccionMensaje(
    mensajeId,
    emoji
) {
    if (!chatPuedeEnviar) {
        return;
    }

    const conexionSigueActiva =
        await actualizarDisponibilidadChat();

    if (!conexionSigueActiva) {
        return;
    }

    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !mensajeId ||
        !EMOJIS_REACCION_CHAT.includes(
            emoji
        )
    ) {
        return;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "alternar_reaccion_mensaje",
            {
                mensaje_buscado:
                    mensajeId,
                emoji_buscado:
                    emoji
            }
        );

        if (error) {
            throw error;
        }

        if (data !== true) {
            throw new Error(
                "Supabase no confirmó la reacción."
            );
        }

        /*
         * Actualizamos el mensaje directamente.
         * Así funciona incluso cuando Realtime tarda o no está activo.
         */
        await recargarReaccionesDeMensaje(
            mensajeId
        );

        reaccionesChatDisponibles =
            true;

        cerrarSelectoresReacciones();
    } catch (error) {
        console.error(
            "No se pudo guardar la reacción:",
            error
        );

        window.alert(
            `No se ha podido guardar la reacción: ${
                error?.message ||
                "error desconocido"
            }`
        );
    }
}


function crearElementoMensaje(
    mensaje
) {
    const esPropio =
        mensaje.remitente_id ===
        usuarioSesionActual?.id;

    const estaEliminado =
        mensaje.eliminado ===
        true;

    const articulo =
        document.createElement(
            "article"
        );

    articulo.className =
        esPropio
            ? "chat-mensaje chat-mensaje--propio"
            : "chat-mensaje chat-mensaje--recibido";

    articulo.dataset.mensajeId =
        mensaje.id;

    articulo.dataset.mensajeContenido =
        mensaje.contenido || "";

    articulo.dataset.mensajeTipo =
        mensaje.tipo || "texto";

    articulo.dataset.mensajeRemitenteId =
        mensaje.remitente_id || "";

    articulo.dataset.mensajeEditado =
        mensaje.editado
            ? "true"
            : "false";

    articulo.innerHTML = `
        <div class="chat-mensaje__burbuja">
            ${
                !estaEliminado
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__reaccionar"
                            data-abrir-reacciones="${escaparHTML(
                                mensaje.id
                            )}"
                            aria-label="Reaccionar al mensaje"
                            title="Reaccionar"
                        >
                            <i
                                class="fa-regular fa-face-smile"
                                aria-hidden="true"
                            ></i>
                        </button>

                        <div
                            class="chat-reaccion-selector oculto"
                            data-selector-reacciones
                        >
                            ${crearHTMLSelectorReacciones(
                                mensaje.id
                            )}
                        </div>
                    `
                    : ""
            }

            ${
                !estaEliminado &&
                mensaje.tipo === "texto"
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__copiar"
                            data-copiar-mensaje="${escaparHTML(
                                mensaje.id
                            )}"
                            aria-label="Copiar mensaje"
                            title="Copiar mensaje"
                        >
                            <i
                                class="fa-regular fa-copy"
                                aria-hidden="true"
                            ></i>
                        </button>
                    `
                    : ""
            }

            ${
                !estaEliminado
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__responder"
                            data-responder-mensaje="${escaparHTML(
                                mensaje.id
                            )}"
                            aria-label="Responder mensaje"
                            title="Responder"
                        >
                            <i
                                class="fa-solid fa-reply"
                                aria-hidden="true"
                            ></i>
                        </button>
                    `
                    : ""
            }

            ${
                esPropio &&
                !estaEliminado &&
                mensaje.tipo === "texto"
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__editar"
                            data-editar-mensaje="${escaparHTML(
                                mensaje.id
                            )}"
                            aria-label="Editar mensaje"
                            title="Editar mensaje"
                        >
                            <i
                                class="fa-regular fa-pen-to-square"
                                aria-hidden="true"
                            ></i>
                        </button>
                    `
                    : ""
            }

            ${
                esPropio &&
                !estaEliminado
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__eliminar"
                            data-eliminar-mensaje="${escaparHTML(
                                mensaje.id
                            )}"
                            aria-label="Eliminar mensaje"
                            title="Eliminar mensaje"
                        >
                            <i
                                class="fa-regular fa-trash-can"
                                aria-hidden="true"
                            ></i>
                        </button>
                    `
                    : ""
            }

            ${
                !estaEliminado &&
                mensaje.respuesta_previa
                    ? `
                        <button
                            type="button"
                            class="chat-mensaje__respuesta-citada"
                            data-ir-mensaje="${escaparHTML(
                                mensaje.respuesta_previa.id
                            )}"
                            title="Ir al mensaje respondido"
                        >
                            <strong>
                                ${escaparHTML(
                                    mensaje.respuesta_previa.remitente_id ===
                                        usuarioSesionActual?.id
                                        ? "Tú"
                                        : (
                                            chatNombre?.textContent?.trim() ||
                                            "Usuario"
                                        )
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    obtenerResumenRespuesta(
                                        mensaje.respuesta_previa
                                    )
                                )}
                            </span>
                        </button>
                    `
                    : ""
            }

            ${
                estaEliminado
                    ? `
                        <p class="chat-mensaje__texto-eliminado-normal">
                            <i
                                class="fa-regular fa-circle-xmark"
                                aria-hidden="true"
                            ></i>

                            Mensaje eliminado
                        </p>
                    `
                    : esMensajeImagen(
                        mensaje
                    )
                        ? `
                            <a
                                class="chat-mensaje__imagen-enlace"
                                href="${escaparHTML(
                                    mensaje.imagen_url_temporal ||
                                    "#"
                                )}"
                                data-abrir-imagen-chat="${escaparHTML(
                                    mensaje.imagen_url_temporal ||
                                    ""
                                )}"
                                aria-label="Abrir imagen"
                            >
                                ${
                                    mensaje.imagen_url_temporal
                                        ? `
                                            <img
                                                class="chat-mensaje__imagen"
                                                src="${escaparHTML(
                                                    mensaje.imagen_url_temporal
                                                )}"
                                                alt="${escaparHTML(
                                                    mensaje.imagen_nombre ||
                                                    "Imagen enviada en el chat"
                                                )}"
                                                loading="lazy"
                                            >
                                        `
                                        : `
                                            <span class="chat-mensaje__imagen-error">
                                                <i
                                                    class="fa-regular fa-image"
                                                    aria-hidden="true"
                                                ></i>
                                                Imagen no disponible
                                            </span>
                                        `
                                }
                            </a>

                            ${
                                mensaje.contenido &&
                                mensaje.contenido !==
                                    "Foto"
                                    ? `
                                        <p>${escaparHTML(
                                            mensaje.contenido
                                        )}</p>
                                    `
                                    : ""
                            }
                        `
                        : `
                            <p>${escaparHTML(
                                mensaje.contenido
                            )}</p>
                        `
            }

            ${
                !estaEliminado
                    ? `
                        <div
                            class="chat-mensaje__reacciones ${
                                crearHTMLReaccionesMensaje(
                                    mensaje.id
                                )
                                    ? ""
                                    : "chat-mensaje__reacciones--vacias"
                            }"
                            data-lista-reacciones
                        >
                            ${crearHTMLReaccionesMensaje(
                                mensaje.id
                            )}
                        </div>
                    `
                    : ""
            }

            <div class="chat-mensaje__meta">
                <time datetime="${escaparHTML(
                    mensaje.creado_en
                )}">
                    ${escaparHTML(
                        formatearHoraMensaje(
                            mensaje.creado_en
                        )
                    )}
                </time>

                ${
                    mensaje.editado &&
                    !estaEliminado
                        ? `
                            <span
                                class="chat-mensaje__editado"
                                title="${
                                    mensaje.editado_en
                                        ? escaparHTML(
                                            new Date(
                                                mensaje.editado_en
                                            ).toLocaleString(
                                                "es-ES"
                                            )
                                        )
                                        : "Mensaje editado"
                                }"
                            >
                                editado
                            </span>
                        `
                        : ""
                }

                ${
                    esPropio &&
                    !estaEliminado
                        ? `
                            <span
                                class="chat-mensaje__estado ${
                                    mensaje.leido
                                        ? "chat-mensaje__estado--leido"
                                        : ""
                                }"
                                data-estado-mensaje="${escaparHTML(
                                    mensaje.id
                                )}"
                                aria-label="${
                                    mensaje.leido
                                        ? "Mensaje leído"
                                        : "Mensaje enviado"
                                }"
                                title="${
                                    mensaje.leido
                                        ? "Leído"
                                        : "Enviado"
                                }"
                            >
                                <i
                                    class="fa-solid ${
                                        mensaje.leido
                                            ? "fa-check-double"
                                            : "fa-check"
                                    }"
                                    aria-hidden="true"
                                ></i>

                                <span class="chat-mensaje__estado-texto">
                                    ${
                                        mensaje.leido
                                            ? "Leído"
                                            : "Enviado"
                                    }
                                </span>
                            </span>
                        `
                        : ""
                }
            </div>
        </div>
    `;

    if (estaEliminado) {
        const burbujaEliminada =
            articulo.querySelector(
                ".chat-mensaje__burbuja"
            );

        burbujaEliminada?.style.setProperty(
            "display",
            "inline-flex",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "flex",
            "0 0 auto",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "align-self",
            "flex-start",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "width",
            "auto",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "min-width",
            "0",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "max-width",
            "76%",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "height",
            "auto",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "min-height",
            "0",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "padding",
            "0.72rem 0.9rem 0.48rem",
            "important"
        );

        burbujaEliminada?.style.setProperty(
            "justify-content",
            "flex-start",
            "important"
        );
    }

    return articulo;
}


function abrirModalImagenChat(
    url,
    textoAlternativo = "Imagen ampliada del chat"
) {
    if (
        !url ||
        !modalImagenChat ||
        !modalImagenChatImg
    ) {
        return;
    }

    modalImagenChatImg.src =
        url;

    modalImagenChatImg.alt =
        textoAlternativo;

    modalImagenChat.classList.remove(
        "oculto"
    );

    document.body.classList.add(
        "modal-abierto"
    );

    cerrarModalImagenChat?.focus();
}


function cerrarImagenChat() {
    if (
        !modalImagenChat ||
        !modalImagenChatImg
    ) {
        return;
    }

    modalImagenChat.classList.add(
        "oculto"
    );

    modalImagenChatImg.src =
        "";

    document.body.classList.remove(
        "modal-abierto"
    );
}


function abrirModalEliminarMensaje(
    mensajeId
) {
    if (
        !mensajeId ||
        !modalEliminarMensaje
    ) {
        return;
    }

    mensajePendienteEliminarId =
        mensajeId;

    modalEliminarMensaje.classList.remove(
        "oculto"
    );

    document.body.classList.add(
        "modal-abierto"
    );

    confirmarEliminarMensaje?.focus();
}


function cerrarModalEliminarMensaje() {
    mensajePendienteEliminarId =
        "";

    modalEliminarMensaje?.classList.add(
        "oculto"
    );

    document.body.classList.remove(
        "modal-abierto"
    );
}



function actualizarMensajeEliminadoEnPantalla(
    mensaje
) {
    if (
        !mensaje?.id ||
        !listaMensajes
    ) {
        return;
    }

    const selectorSeguro =
        window.CSS?.escape
            ? CSS.escape(
                String(
                    mensaje.id
                )
            )
            : String(
                mensaje.id
            ).replace(
                /["\\]/g,
                "\\$&"
            );

    const mensajeActual =
        listaMensajes.querySelector(
            `[data-mensaje-id="${selectorSeguro}"]`
        );

    if (!mensajeActual) {
        return;
    }

    const mensajeEliminado = {
        ...mensaje,
        eliminado:
            true,
        contenido:
            "Mensaje eliminado",
        imagen_ruta:
            null,
        imagen_nombre:
            null,
        imagen_url_temporal:
            ""
    };

    const nuevoElemento =
        crearElementoMensaje(
            mensajeEliminado
        );

    mensajeActual.replaceWith(
        nuevoElemento
    );

    /*
     * No vaciamos la conversación ni modificamos el scroll.
     * Solo cambia la burbuja que se acaba de eliminar.
     */
    actualizarBotonBajarUltimoMensaje();
}


async function recargarMensajesTrasCambio() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionActualId ||
        !listaMensajes
    ) {
        return;
    }

    try {
        const {
            data,
            error
        } = await cliente
            .from("mensajes")
            .select(
                `
                    id,
                    conversacion_id,
                    remitente_id,
                    contenido,
                    tipo,
                    imagen_ruta,
                    imagen_nombre,
                    mensaje_respuesta_id,
                    eliminado,
                    eliminado_en,
                    editado,
                    editado_en,
                    leido,
                    leido_en,
                    creado_en
                `
            )
            .eq(
                "conversacion_id",
                conversacionActualId
            )
            .order(
                "creado_en",
                {
                    ascending:
                        true
                }
            );

        if (error) {
            throw error;
        }

        listaMensajes.innerHTML =
            "";

        mensajesRenderizados.clear();

        ultimaFechaRenderizada =
            "";

        if (!data?.length) {
            mostrarConversacionVacia();
            return;
        }

        for (
            const mensaje
            of data
        ) {
            await renderizarMensaje(
                mensaje,
                false
            );
        }

        /*
         * Tras eliminar un mensaje reconstruimos el chat
         * y bajamos siempre al último mensaje.
         */
        window.requestAnimationFrame(
            () => {
                window.requestAnimationFrame(
                    () => {
                        desplazarAlFinal(
                            false
                        );

                        reiniciarNuevosMensajesPendientes();
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "No se pudieron actualizar los mensajes tras eliminar:",
            error
        );
    }
}


async function eliminarMensajePropio(
    mensajeId
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !mensajeId
    ) {
        return;
    }

    if (confirmarEliminarMensaje) {
        confirmarEliminarMensaje.disabled =
            true;

        confirmarEliminarMensaje.classList.add(
            "cargando"
        );
    }

    let rutaImagenMensaje =
        "";

    try {
        /*
         * Primero consultamos el mensaje para saber si tiene
         * una imagen guardada en Supabase Storage.
         */
        const {
            data: mensajeAntesDeEliminar,
            error: errorConsulta
        } = await cliente
            .from("mensajes")
            .select(
                `
                    id,
                    conversacion_id,
                    remitente_id,
                    contenido,
                    tipo,
                    imagen_ruta,
                    imagen_nombre,
                    mensaje_respuesta_id,
                    eliminado,
                    eliminado_en,
                    editado,
                    editado_en,
                    leido,
                    leido_en,
                    creado_en
                `
            )
            .eq(
                "id",
                mensajeId
            )
            .eq(
                "remitente_id",
                usuarioSesionActual.id
            )
            .maybeSingle();

        if (errorConsulta) {
            throw errorConsulta;
        }

        if (!mensajeAntesDeEliminar) {
            throw new Error(
                "El mensaje no existe o no pertenece al usuario actual."
            );
        }

        if (
            mensajeAntesDeEliminar.tipo ===
                "imagen" &&
            mensajeAntesDeEliminar.imagen_ruta
        ) {
            rutaImagenMensaje =
                mensajeAntesDeEliminar.imagen_ruta;
        }

        /*
         * La función SQL mantiene el borrado lógico del mensaje:
         * eliminado = true y contenido = "Mensaje eliminado".
         */
        const {
            data,
            error
        } = await cliente.rpc(
            "eliminar_mensaje_propio",
            {
                mensaje_buscado:
                    mensajeId
            }
        );

        if (error) {
            throw error;
        }

        if (data !== true) {
            throw new Error(
                "Supabase no confirmó la eliminación."
            );
        }

        /*
         * Después del borrado lógico eliminamos el archivo físico.
         * Si falla esta parte, el mensaje seguirá eliminado y solo
         * quedará pendiente limpiar el archivo del almacenamiento.
         */
        if (rutaImagenMensaje) {
            const {
                error: errorStorage
            } = await cliente
                .storage
                .from(
                    "imagenes-chat"
                )
                .remove(
                    [
                        rutaImagenMensaje
                    ]
                );

            if (errorStorage) {
                console.error(
                    "El mensaje se eliminó, pero no se pudo borrar su imagen de Storage:",
                    errorStorage
                );
            }
        }

        actualizarMensajeEliminadoEnPantalla(
            {
                ...mensajeAntesDeEliminar,
                eliminado:
                    true,
                eliminado_en:
                    new Date().toISOString(),
                contenido:
                    "Mensaje eliminado"
            }
        );

        cerrarModalEliminarMensaje();
    } catch (error) {
        console.error(
            "No se pudo eliminar el mensaje:",
            error
        );

        alert(
            "No se ha podido eliminar el mensaje. Inténtalo de nuevo."
        );
    } finally {
        if (confirmarEliminarMensaje) {
            confirmarEliminarMensaje.disabled =
                false;

            confirmarEliminarMensaje.classList.remove(
                "cargando"
            );
        }
    }
}


function estaCercaDelFinal() {
    if (!listaMensajes) {
        return true;
    }

    const distanciaAlFinal =
        listaMensajes.scrollHeight -
        listaMensajes.scrollTop -
        listaMensajes.clientHeight;

    return distanciaAlFinal <= 90;
}


function actualizarBotonBajarUltimoMensaje() {
    if (
        !botonBajarUltimoMensaje ||
        !listaMensajes
    ) {
        return;
    }

    const mostrar =
        !estaCercaDelFinal();

    botonBajarUltimoMensaje.classList.toggle(
        "visible",
        mostrar
    );

    botonBajarUltimoMensaje.setAttribute(
        "aria-hidden",
        mostrar
            ? "false"
            : "true"
    );

    if (
        contadorNuevosMensajes
    ) {
        contadorNuevosMensajes.textContent =
            nuevosMensajesPendientes > 99
                ? "99+"
                : String(
                    nuevosMensajesPendientes
                );

        contadorNuevosMensajes.classList.toggle(
            "visible",
            nuevosMensajesPendientes > 0
        );
    }
}


function reiniciarNuevosMensajesPendientes() {
    nuevosMensajesPendientes =
        0;

    actualizarBotonBajarUltimoMensaje();
}


function crearBotonBajarUltimoMensaje() {
    if (
        botonBajarUltimoMensaje ||
        !chatSuralia ||
        !listaMensajes
    ) {
        return;
    }

    botonBajarUltimoMensaje =
        document.createElement(
            "button"
        );

    botonBajarUltimoMensaje.type =
        "button";

    botonBajarUltimoMensaje.className =
        "chat-suralia__bajar-ultimo";

    botonBajarUltimoMensaje.setAttribute(
        "aria-label",
        "Bajar al último mensaje"
    );

    botonBajarUltimoMensaje.setAttribute(
        "aria-hidden",
        "true"
    );

    botonBajarUltimoMensaje.innerHTML = `
        <i
            class="fa-solid fa-arrow-down"
            aria-hidden="true"
        ></i>

        <span
            class="chat-suralia__contador-nuevos"
            aria-live="polite"
        ></span>
    `;

    contadorNuevosMensajes =
        botonBajarUltimoMensaje.querySelector(
            ".chat-suralia__contador-nuevos"
        );

    botonBajarUltimoMensaje.addEventListener(
        "click",
        () => {
            desplazarAlFinal(
                true
            );

            reiniciarNuevosMensajesPendientes();
        }
    );

    chatSuralia.appendChild(
        botonBajarUltimoMensaje
    );

    listaMensajes.addEventListener(
        "scroll",
        () => {
            if (
                estaCercaDelFinal()
            ) {
                reiniciarNuevosMensajesPendientes();
            } else {
                actualizarBotonBajarUltimoMensaje();
            }
        },
        {
            passive:
                true
        }
    );
}


function desplazarAlFinal(
    suave = false
) {
    if (!listaMensajes) {
        return;
    }

    listaMensajes.scrollTo({
        top:
            listaMensajes.scrollHeight,

        behavior:
            suave
                ? "smooth"
                : "auto"
    });

    window.setTimeout(
        () => {
            if (
                estaCercaDelFinal()
            ) {
                reiniciarNuevosMensajesPendientes();
            } else {
                actualizarBotonBajarUltimoMensaje();
            }
        },
        suave
            ? 350
            : 0
    );
}


function actualizarEstadoMensaje(
    mensaje
) {
    if (
        !mensaje?.id ||
        mensaje.remitente_id !==
            usuarioSesionActual?.id
    ) {
        return;
    }

    const estado =
        document.querySelector(
            `[data-estado-mensaje="${CSS.escape(
                mensaje.id
            )}"]`
        );

    if (!estado) {
        return;
    }

    const estaLeido =
        Boolean(
            mensaje.leido
        );

    estado.classList.toggle(
        "chat-mensaje__estado--leido",
        estaLeido
    );

    estado.setAttribute(
        "aria-label",
        estaLeido
            ? "Mensaje leído"
            : "Mensaje enviado"
    );

    estado.setAttribute(
        "title",
        estaLeido
            ? "Leído"
            : "Enviado"
    );

    estado.innerHTML = `
        <i
            class="fa-solid ${
                estaLeido
                    ? "fa-check-double"
                    : "fa-check"
            }"
            aria-hidden="true"
        ></i>

        <span class="chat-mensaje__estado-texto">
            ${
                estaLeido
                    ? "Leído"
                    : "Enviado"
            }
        </span>
    `;
}


async function renderizarMensaje(
    mensaje,
    desplazar = true
) {
    if (
        !mensaje?.id ||
        mensajesRenderizados.has(
            mensaje.id
        ) ||
        !listaMensajes
    ) {
        return;
    }

    /*
     * Reservamos el ID antes de cualquier operación asíncrona.
     * El mismo mensaje puede llegar casi simultáneamente desde
     * el INSERT y desde Supabase Realtime. De esta forma solo
     * uno de los dos procesos podrá dibujarlo.
     */
    mensajesRenderizados.add(
        mensaje.id
    );

    try {
        mensaje =
            await prepararMensajeParaRender(
                mensaje
            );
    } catch (error) {
        mensajesRenderizados.delete(
            mensaje.id
        );

        throw error;
    }

    const vacio =
        listaMensajes.querySelector(
            ".chat-suralia__vacio"
        );

    vacio?.remove();

    const claveFecha =
        obtenerClaveFechaMensaje(
            mensaje.creado_en
        );

    if (
        claveFecha &&
        claveFecha !==
            ultimaFechaRenderizada
    ) {
        listaMensajes.appendChild(
            crearSeparadorFecha(
                mensaje.creado_en
            )
        );

        ultimaFechaRenderizada =
            claveFecha;
    }

    const estabaCercaDelFinal =
        estaCercaDelFinal();

    listaMensajes.appendChild(
        crearElementoMensaje(
            mensaje
        )
    );

    actualizarAccionesMensajesSegunDisponibilidad();

    const esMensajePropio =
        mensaje.remitente_id ===
        usuarioSesionActual?.id;

    if (
        desplazar &&
        (
            estabaCercaDelFinal ||
            esMensajePropio
        )
    ) {
        desplazarAlFinal(
            true
        );

        return;
    }

    if (
        desplazar &&
        !esMensajePropio
    ) {
        nuevosMensajesPendientes +=
            1;

        actualizarBotonBajarUltimoMensaje();
    }
}


function mostrarConversacionVacia() {
    ultimaFechaRenderizada =
        "";

    if (!listaMensajes) {
        return;
    }

    listaMensajes.innerHTML = `
        <div class="chat-suralia__vacio">
            <i
                class="fa-regular fa-comments"
                aria-hidden="true"
            ></i>

            <h2>
                Empieza la conversación
            </h2>

            <p>
                Envía el primer mensaje para organizar un plan
                con esta persona.
            </p>
        </div>
    `;
}


async function cargarMensajesGuardados() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionActualId
    ) {
        return;
    }

    const {
        data,
        error
    } = await cliente
        .from("mensajes")
        .select(
            `
                id,
                conversacion_id,
                remitente_id,
                contenido,
                tipo,
                imagen_ruta,
                imagen_nombre,
                mensaje_respuesta_id,
                eliminado,
                eliminado_en,
                editado,
                editado_en,
                leido,
                creado_en
            `
        )
        .eq(
            "conversacion_id",
            conversacionActualId
        )
        .order(
            "creado_en",
            {
                ascending:
                    true
            }
        );

    if (error) {
        throw error;
    }

    mensajesRenderizados.clear();

    ultimaFechaRenderizada =
        "";

    if (listaMensajes) {
        listaMensajes.innerHTML =
            "";
    }

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {
        mostrarConversacionVacia();
        return;
    }

    for (
        const mensaje
        of data
    ) {
        await renderizarMensaje(
            mensaje,
            false
        );
    }

    desplazarAlFinal();
}


async function marcarMensajesComoLeidos() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionActualId
    ) {
        return;
    }

    const {
        error
    } = await cliente.rpc(
        "marcar_mensajes_leidos",
        {
            conversacion_buscada:
                conversacionActualId
        }
    );

    if (error) {
        console.error(
            "No se pudieron marcar los mensajes como leídos:",
            error
        );
    }
}


async function limpiarNotificacionesConversacionActual() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual?.id ||
        !conversacionActualId
    ) {
        return;
    }

    try {
        /*
         * Al entrar en una conversación eliminamos todas las
         * notificaciones de mensajes pertenecientes a ese chat.
         *
         * La política RLS de notificaciones garantiza además
         * que cada usuario solo pueda borrar sus propios avisos.
         */
        const {
            error
        } = await cliente
            .from(
                "notificaciones"
            )
            .delete()
            .eq(
                "usuario_id",
                usuarioSesionActual.id
            )
            .eq(
                "tipo",
                "mensaje"
            )
            .contains(
                "datos",
                {
                    conversacion_id:
                        conversacionActualId
                }
            );

        if (error) {
            throw error;
        }

        /*
         * Realtime ya actualizará la campana mediante el DELETE,
         * pero este evento fuerza una recarga inmediata como
         * respaldo si el canal todavía se está conectando.
         */
        window.dispatchEvent(
            new CustomEvent(
                "suralia:notificaciones-actualizadas"
            )
        );
    } catch (error) {
        /*
         * Un fallo al limpiar una notificación nunca debe
         * impedir abrir o utilizar el chat.
         */
        console.error(
            "No se pudieron limpiar las notificaciones de esta conversación:",
            error
        );
    }
}


function asegurarAvisoChatNoDisponible() {
    if (
        avisoChatNoDisponible ||
        !formularioChat
    ) {
        return avisoChatNoDisponible;
    }

    avisoChatNoDisponible =
        document.createElement(
            "div"
        );

    avisoChatNoDisponible.id =
        "chat-no-disponible";

    avisoChatNoDisponible.className =
        "chat-suralia__aviso-bloqueo oculto";

    avisoChatNoDisponible.setAttribute(
        "role",
        "status"
    );

    avisoChatNoDisponible.setAttribute(
        "aria-live",
        "polite"
    );

    avisoChatNoDisponible.innerHTML = `
        <i
            class="fa-solid fa-lock"
            aria-hidden="true"
        ></i>

        <div>
            <strong>
                No puedes enviar mensajes a esta persona.
            </strong>

            <span>
                La conversación solo está disponible mientras la conexión siga activa.
            </span>
        </div>
    `;

    formularioChat.before(
        avisoChatNoDisponible
    );

    if (
        !document.querySelector(
            "#chat-aviso-bloqueo-estilos"
        )
    ) {
        const estilos =
            document.createElement(
                "style"
            );

        estilos.id =
            "chat-aviso-bloqueo-estilos";

        estilos.textContent = `
            .chat-suralia__aviso-bloqueo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin: 0.75rem 0;
                padding: 0.9rem 1rem;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 14px;
                background: rgba(0, 0, 0, 0.18);
                line-height: 1.35;
            }

            .chat-suralia__aviso-bloqueo.oculto {
                display: none;
            }

            .chat-suralia__aviso-bloqueo > i {
                flex: 0 0 auto;
                font-size: 1rem;
                opacity: 0.8;
            }

            .chat-suralia__aviso-bloqueo > div {
                display: grid;
                gap: 0.15rem;
            }

            .chat-suralia__aviso-bloqueo strong {
                font-size: 0.95rem;
            }

            .chat-suralia__aviso-bloqueo span {
                font-size: 0.82rem;
                opacity: 0.72;
            }
        `;

        document.head.appendChild(
            estilos
        );
    }

    return avisoChatNoDisponible;
}


function actualizarAccionesMensajesSegunDisponibilidad() {
    if (!listaMensajes) {
        return;
    }

    listaMensajes
        .querySelectorAll(
            `
                [data-abrir-reacciones],
                [data-reaccion-rapida],
                [data-responder-mensaje],
                [data-editar-mensaje]
            `
        )
        .forEach(
            (
                boton
            ) => {
                boton.disabled =
                    !chatPuedeEnviar;

                boton.setAttribute(
                    "aria-disabled",
                    chatPuedeEnviar
                        ? "false"
                        : "true"
                );
            }
        );
}


function aplicarEstadoFormularioChat() {
    if (
        !campoMensaje ||
        !botonEnviarMensaje
    ) {
        return;
    }

    campoMensaje.disabled =
        !chatPuedeEnviar;

    botonEnviarMensaje.disabled =
        !chatPuedeEnviar;

    if (botonAdjuntarImagen) {
        botonAdjuntarImagen.disabled =
            !chatPuedeEnviar ||
            Boolean(
                mensajeEdicionActual
            );
    }

    if (!chatPuedeEnviar) {
        ocultarMenuImagenChat();

        campoMensaje.setAttribute(
            "aria-disabled",
            "true"
        );
    } else {
        campoMensaje.removeAttribute(
            "aria-disabled"
        );
    }
}


function establecerDisponibilidadChat(
    disponible
) {
    const estadoAnterior =
        chatPuedeEnviar;

    chatPuedeEnviar =
        Boolean(
            disponible
        );

    const aviso =
        asegurarAvisoChatNoDisponible();

    aviso?.classList.toggle(
        "oculto",
        chatPuedeEnviar
    );

    if (!chatPuedeEnviar) {
        mostrarEstadoEnLinea(
            false
        );

        mostrarEstadoEscribiendo(
            false
        );

        cerrarSelectoresReacciones();

        cancelarRespuestaActual();

        if (mensajeEdicionActual) {
            cancelarEdicionMensaje();
        }

        detenerEstadoEscrituraLocal();
    }

    aplicarEstadoFormularioChat();

    actualizarAccionesMensajesSegunDisponibilidad();

    if (
        chatPuedeEnviar &&
        !estadoAnterior
    ) {
        campoMensaje?.focus();
    }
}


async function comprobarConexionAceptadaChat() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual?.id ||
        !otroUsuarioActualId
    ) {
        return false;
    }

    const usuarioActualId =
        usuarioSesionActual.id;

    const filtroParticipantes =
        `and(solicitante_id.eq.${usuarioActualId},receptor_id.eq.${otroUsuarioActualId}),and(solicitante_id.eq.${otroUsuarioActualId},receptor_id.eq.${usuarioActualId})`;

    const {
        data,
        error
    } = await cliente
        .from(
            "solicitudes_conexion"
        )
        .select(
            "id"
        )
        .eq(
            "estado",
            "aceptada"
        )
        .or(
            filtroParticipantes
        )
        .limit(
            1
        );

    if (error) {
        throw error;
    }

    return Boolean(
        data?.length
    );
}


async function actualizarDisponibilidadChat() {
    try {
        const disponible =
            await comprobarConexionAceptadaChat();

        establecerDisponibilidadChat(
            disponible
        );

        return disponible;
    } catch (error) {
        console.error(
            "No se pudo comprobar si la conversación sigue activa:",
            error
        );

        /*
         * Un error puntual de red no debe cerrar una conversación
         * que ya estaba habilitada. El servidor seguirá aplicando
         * sus propias reglas al intentar enviar.
         */
        return chatPuedeEnviar;
    }
}


function iniciarControlDisponibilidadChat() {
    window.clearInterval(
        intervaloDisponibilidadChat
    );

    intervaloDisponibilidadChat =
        window.setInterval(
            actualizarDisponibilidadChat,
            4000
        );
}


function activarFormularioChat() {
    aplicarEstadoFormularioChat();

    if (chatPuedeEnviar) {
        campoMensaje?.focus();
    }
}


function ajustarAlturaMensaje() {
    if (!campoMensaje) {
        return;
    }

    campoMensaje.style.height =
        "auto";

    campoMensaje.style.height =
        `${Math.min(
            campoMensaje.scrollHeight,
            140
        )}px`;
}



async function copiarTextoMensaje(
    articuloMensaje,
    botonCopiar = null
) {
    if (!articuloMensaje) {
        return;
    }

    const texto =
        String(
            articuloMensaje.dataset
                .mensajeContenido ||
            ""
        ).trim();

    if (!texto) {
        return;
    }

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                texto
            );
        } else {
            const campoTemporal =
                document.createElement(
                    "textarea"
                );

            campoTemporal.value =
                texto;

            campoTemporal.setAttribute(
                "readonly",
                ""
            );

            campoTemporal.style.position =
                "fixed";

            campoTemporal.style.opacity =
                "0";

            document.body.appendChild(
                campoTemporal
            );

            campoTemporal.select();

            const copiado =
                document.execCommand(
                    "copy"
                );

            campoTemporal.remove();

            if (!copiado) {
                throw new Error(
                    "El navegador no permitió copiar el mensaje."
                );
            }
        }

        mostrarConfirmacionCopiado(
            botonCopiar
        );
    } catch (error) {
        console.error(
            "No se pudo copiar el mensaje:",
            error
        );

        window.alert(
            "No se ha podido copiar el mensaje."
        );
    }
}


function mostrarConfirmacionCopiado(
    boton
) {
    if (!boton) {
        return;
    }

    const contenidoOriginal =
        boton.innerHTML;

    const tituloOriginal =
        boton.getAttribute(
            "title"
        ) ||
        "Copiar mensaje";

    boton.classList.add(
        "chat-mensaje__copiar--confirmado"
    );

    boton.setAttribute(
        "title",
        "Copiado"
    );

    boton.setAttribute(
        "aria-label",
        "Mensaje copiado"
    );

    boton.innerHTML = `
        <i
            class="fa-solid fa-check"
            aria-hidden="true"
        ></i>
    `;

    window.setTimeout(
        () => {
            boton.classList.remove(
                "chat-mensaje__copiar--confirmado"
            );

            boton.setAttribute(
                "title",
                tituloOriginal
            );

            boton.setAttribute(
                "aria-label",
                "Copiar mensaje"
            );

            boton.innerHTML =
                contenidoOriginal;
        },
        1200
    );
}


function crearBarraEdicionChat() {
    if (
        !formularioChat ||
        barraEdicionChat
    ) {
        return;
    }

    barraEdicionChat =
        document.createElement(
            "div"
        );

    barraEdicionChat.className =
        "chat-edicion-previa oculto";

    barraEdicionChat.id =
        "chat-edicion-previa";

    barraEdicionChat.innerHTML = `
        <div class="chat-edicion-previa__contenido">
            <i
                class="fa-regular fa-pen-to-square"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    Editando mensaje
                </strong>

                <span data-edicion-texto>
                    Modifica el texto y pulsa enviar
                </span>
            </div>
        </div>

        <button
            type="button"
            class="chat-edicion-previa__cancelar"
            aria-label="Cancelar edición"
            title="Cancelar edición"
        >
            <i
                class="fa-solid fa-xmark"
                aria-hidden="true"
            ></i>
        </button>
    `;

    formularioChat.before(
        barraEdicionChat
    );

    botonCancelarEdicion =
        barraEdicionChat.querySelector(
            ".chat-edicion-previa__cancelar"
        );

    botonCancelarEdicion?.addEventListener(
        "click",
        cancelarEdicionMensaje
    );
}


function iniciarEdicionMensaje(
    articuloMensaje
) {
    if (
        !chatPuedeEnviar ||
        !articuloMensaje ||
        !campoMensaje
    ) {
        return;
    }

    const mensajeId =
        articuloMensaje.dataset
            .mensajeId;

    const contenido =
        articuloMensaje.dataset
            .mensajeContenido ||
        "";

    const tipo =
        articuloMensaje.dataset
            .mensajeTipo ||
        "texto";

    const remitenteId =
        articuloMensaje.dataset
            .mensajeRemitenteId ||
        "";

    if (
        !mensajeId ||
        tipo !== "texto" ||
        remitenteId !==
            usuarioSesionActual?.id
    ) {
        return;
    }

    cancelarRespuestaActual();

    mensajeEdicionActual = {
        id:
            mensajeId,
        contenido
    };

    crearBarraEdicionChat();

    const textoPrevio =
        barraEdicionChat?.querySelector(
            "[data-edicion-texto]"
        );

    if (textoPrevio) {
        textoPrevio.textContent =
            contenido.length > 90
                ? `${contenido.slice(
                    0,
                    90
                )}…`
                : contenido;
    }

    barraEdicionChat?.classList.remove(
        "oculto"
    );

    campoMensaje.value =
        contenido;

    ajustarAlturaMensaje();

    if (botonAdjuntarImagen) {
        botonAdjuntarImagen.disabled =
            true;
    }

    campoMensaje.focus();

    campoMensaje.setSelectionRange(
        campoMensaje.value.length,
        campoMensaje.value.length
    );
}


function cancelarEdicionMensaje() {
    mensajeEdicionActual =
        null;

    barraEdicionChat?.classList.add(
        "oculto"
    );

    if (campoMensaje) {
        campoMensaje.value =
            "";

        ajustarAlturaMensaje();
    }

    if (botonAdjuntarImagen) {
        botonAdjuntarImagen.disabled =
            false;
    }

    botonEnviarMensaje.innerHTML = `
        <i
            class="fa-solid fa-paper-plane"
            aria-hidden="true"
        ></i>
    `;
}


async function actualizarMensajeEditadoEnPantalla(
    mensaje
) {
    if (
        !mensaje?.id ||
        !listaMensajes
    ) {
        return;
    }

    const selectorSeguro =
        window.CSS?.escape
            ? CSS.escape(
                String(
                    mensaje.id
                )
            )
            : String(
                mensaje.id
            ).replace(
                /["\\]/g,
                "\\$&"
            );

    const mensajeActual =
        listaMensajes.querySelector(
            `[data-mensaje-id="${selectorSeguro}"]`
        );

    if (!mensajeActual) {
        return;
    }

    const mensajePreparado =
        await prepararMensajeParaRender(
            mensaje
        );

    const nuevoElemento =
        crearElementoMensaje(
            mensajePreparado
        );

    mensajeActual.replaceWith(
        nuevoElemento
    );

    actualizarBotonBajarUltimoMensaje();
}


async function guardarEdicionMensaje() {
    if (!chatPuedeEnviar) {
        return;
    }

    const cliente =
        window.clienteSupabase;

    const contenido =
        campoMensaje?.value
            ?.trim() ||
        "";

    if (
        !cliente ||
        !mensajeEdicionActual?.id ||
        !contenido ||
        contenido.length > 2000
    ) {
        return;
    }

    const conexionSigueActiva =
        await actualizarDisponibilidadChat();

    if (!conexionSigueActiva) {
        return;
    }

    campoMensaje.disabled =
        true;

    botonEnviarMensaje.disabled =
        true;

    botonEnviarMensaje.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>
    `;

    try {
        const {
            data: resultado,
            error: errorEdicion
        } = await cliente.rpc(
            "editar_mensaje_propio",
            {
                mensaje_buscado:
                    mensajeEdicionActual.id,

                contenido_nuevo:
                    contenido
            }
        );

        if (errorEdicion) {
            throw errorEdicion;
        }

        if (resultado !== true) {
            throw new Error(
                "Supabase no confirmó la edición."
            );
        }

        const {
            data: mensajeActualizado,
            error: errorConsulta
        } = await cliente
            .from("mensajes")
            .select(
                `
                    id,
                    conversacion_id,
                    remitente_id,
                    contenido,
                    tipo,
                    imagen_ruta,
                    imagen_nombre,
                    mensaje_respuesta_id,
                    eliminado,
                    eliminado_en,
                    editado,
                    editado_en,
                    leido,
                    leido_en,
                    creado_en
                `
            )
            .eq(
                "id",
                mensajeEdicionActual.id
            )
            .single();

        if (errorConsulta) {
            throw errorConsulta;
        }

        await actualizarMensajeEditadoEnPantalla(
            mensajeActualizado
        );

        mensajeEdicionActual =
            null;

        barraEdicionChat?.classList.add(
            "oculto"
        );

        campoMensaje.value =
            "";

        ajustarAlturaMensaje();

        detenerEstadoEscrituraLocal();
    } catch (error) {
        console.error(
            "No se pudo editar el mensaje:",
            error
        );

        window.alert(
            "No se ha podido editar el mensaje. Inténtalo de nuevo."
        );
    } finally {
        botonEnviarMensaje.innerHTML = `
            <i
                class="fa-solid fa-paper-plane"
                aria-hidden="true"
            ></i>
        `;

        aplicarEstadoFormularioChat();

        if (chatPuedeEnviar) {
            campoMensaje.focus();
        }
    }
}


function crearBarraRespuestaChat() {
    if (
        !formularioChat ||
        barraRespuestaChat
    ) {
        return;
    }

    barraRespuestaChat =
        document.createElement(
            "div"
        );

    barraRespuestaChat.className =
        "chat-respuesta-previa oculto";

    barraRespuestaChat.id =
        "chat-respuesta-previa";

    barraRespuestaChat.innerHTML = `
        <div class="chat-respuesta-previa__contenido">
            <i
                class="fa-solid fa-reply"
                aria-hidden="true"
            ></i>

            <div>
                <strong data-respuesta-autor>
                    Respondiendo
                </strong>

                <span data-respuesta-texto>
                    Mensaje
                </span>
            </div>
        </div>

        <button
            type="button"
            class="chat-respuesta-previa__cancelar"
            aria-label="Cancelar respuesta"
            title="Cancelar respuesta"
        >
            <i
                class="fa-solid fa-xmark"
                aria-hidden="true"
            ></i>
        </button>
    `;

    formularioChat.before(
        barraRespuestaChat
    );

    botonCancelarRespuesta =
        barraRespuestaChat.querySelector(
            ".chat-respuesta-previa__cancelar"
        );

    botonCancelarRespuesta?.addEventListener(
        "click",
        cancelarRespuestaActual
    );
}


function iniciarRespuestaMensaje(
    articuloMensaje
) {
    if (
        !chatPuedeEnviar ||
        !articuloMensaje
    ) {
        return;
    }

    if (mensajeEdicionActual) {
        cancelarEdicionMensaje();
    }

    crearBarraRespuestaChat();

    const mensajeId =
        articuloMensaje.dataset
            .mensajeId;

    const contenido =
        articuloMensaje.dataset
            .mensajeContenido ||
        "";

    const tipo =
        articuloMensaje.dataset
            .mensajeTipo ||
        "texto";

    const remitenteId =
        articuloMensaje.dataset
            .mensajeRemitenteId ||
        "";

    mensajeRespuestaActual = {
        id:
            mensajeId,
        contenido,
        tipo,
        remitente_id:
            remitenteId,
        eliminado:
            false
    };

    const autor =
        barraRespuestaChat?.querySelector(
            "[data-respuesta-autor]"
        );

    const texto =
        barraRespuestaChat?.querySelector(
            "[data-respuesta-texto]"
        );

    if (autor) {
        autor.textContent =
            remitenteId ===
                usuarioSesionActual?.id
                ? "Tú"
                : (
                    chatNombre?.textContent?.trim() ||
                    "Usuario"
                );
    }

    if (texto) {
        texto.textContent =
            obtenerResumenRespuesta(
                mensajeRespuestaActual
            );
    }

    barraRespuestaChat?.classList.remove(
        "oculto"
    );

    campoMensaje?.focus();
}


function cancelarRespuestaActual() {
    mensajeRespuestaActual =
        null;

    barraRespuestaChat?.classList.add(
        "oculto"
    );
}


function irAlMensajeRespondido(
    mensajeId
) {
    if (
        !mensajeId ||
        !listaMensajes
    ) {
        return;
    }

    const selectorSeguro =
        window.CSS?.escape
            ? CSS.escape(
                String(
                    mensajeId
                )
            )
            : String(
                mensajeId
            ).replace(
                /["\\]/g,
                "\\$&"
            );

    const mensaje =
        listaMensajes.querySelector(
            `[data-mensaje-id="${selectorSeguro}"]`
        );

    if (!mensaje) {
        return;
    }

    mensaje.scrollIntoView(
        {
            behavior:
                "smooth",
            block:
                "center"
        }
    );

    mensaje.classList.add(
        "chat-mensaje--destacado"
    );

    window.setTimeout(
        () => {
            mensaje.classList.remove(
                "chat-mensaje--destacado"
            );
        },
        1400
    );
}


function crearMensajeTemporalEnvio(
    contenido,
    archivoImagen = null
) {
    if (!listaMensajes) {
        return null;
    }

    const idTemporal =
        `temporal-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`;

    const articulo =
        document.createElement(
            "article"
        );

    articulo.className =
        "chat-mensaje chat-mensaje--propio chat-mensaje--temporal";

    articulo.dataset.mensajeTemporalId =
        idTemporal;

    let urlTemporalImagen =
        "";

    if (archivoImagen) {
        urlTemporalImagen =
            URL.createObjectURL(
                archivoImagen
            );
    }

    articulo.innerHTML = `
        <div class="chat-mensaje__burbuja">
            ${
                mensajeRespuestaActual
                    ? `
                        <div class="chat-mensaje__respuesta-citada chat-mensaje__respuesta-citada--temporal">
                            <strong>
                                ${escaparHTML(
                                    mensajeRespuestaActual.remitente_id ===
                                        usuarioSesionActual?.id
                                        ? "Tú"
                                        : (
                                            chatNombre?.textContent?.trim() ||
                                            "Usuario"
                                        )
                                )}
                            </strong>

                            <span>
                                ${escaparHTML(
                                    obtenerResumenRespuesta(
                                        mensajeRespuestaActual
                                    )
                                )}
                            </span>
                        </div>
                    `
                    : ""
            }

            ${
                urlTemporalImagen
                    ? `
                        <div class="chat-mensaje__imagen-enlace">
                            <img
                                class="chat-mensaje__imagen"
                                src="${escaparHTML(
                                    urlTemporalImagen
                                )}"
                                alt="Imagen pendiente de enviar"
                            >
                        </div>
                    `
                    : ""
            }

            ${
                contenido
                    ? `
                        <p>${escaparHTML(
                            contenido
                        )}</p>
                    `
                    : ""
            }

            <div class="chat-mensaje__meta">
                <time>
                    ${escaparHTML(
                        new Date().toLocaleTimeString(
                            "es-ES",
                            {
                                hour:
                                    "2-digit",
                                minute:
                                    "2-digit"
                            }
                        )
                    )}
                </time>

                <span
                    class="chat-mensaje__estado chat-mensaje__estado--enviando"
                    data-estado-temporal
                    aria-label="Mensaje enviándose"
                    title="Enviando"
                >
                    <i
                        class="fa-solid fa-clock"
                        aria-hidden="true"
                    ></i>

                    <span class="chat-mensaje__estado-texto">
                        Enviando…
                    </span>
                </span>
            </div>
        </div>
    `;

    articulo.dataset.urlTemporalImagen =
        urlTemporalImagen;

    listaMensajes.appendChild(
        articulo
    );

    desplazarAlFinal(
        false
    );

    return articulo;
}


function marcarMensajeTemporalConError(
    articuloTemporal
) {
    if (!articuloTemporal) {
        return;
    }

    articuloTemporal.classList.remove(
        "chat-mensaje--temporal"
    );

    articuloTemporal.classList.add(
        "chat-mensaje--error"
    );

    const estado =
        articuloTemporal.querySelector(
            "[data-estado-temporal]"
        );

    if (!estado) {
        return;
    }

    estado.classList.remove(
        "chat-mensaje__estado--enviando"
    );

    estado.classList.add(
        "chat-mensaje__estado--error"
    );

    estado.setAttribute(
        "aria-label",
        "Error al enviar el mensaje"
    );

    estado.setAttribute(
        "title",
        "Error al enviar"
    );

    estado.innerHTML = `
        <i
            class="fa-solid fa-circle-exclamation"
            aria-hidden="true"
        ></i>

        <span class="chat-mensaje__estado-texto">
            Error al enviar
        </span>
    `;
}


function eliminarMensajeTemporal(
    articuloTemporal
) {
    if (!articuloTemporal) {
        return;
    }

    const urlTemporalImagen =
        articuloTemporal.dataset
            .urlTemporalImagen;

    if (urlTemporalImagen) {
        URL.revokeObjectURL(
            urlTemporalImagen
        );
    }

    articuloTemporal.remove();
}


async function enviarMensaje(
    evento
) {
    evento.preventDefault();

    if (mensajeEdicionActual) {
        await guardarEdicionMensaje();
        return;
    }

    const cliente =
        window.clienteSupabase;

    const contenido =
        campoMensaje?.value
            ?.trim() ||
        "";

    const hayImagen =
        Boolean(
            archivoImagenSeleccionado
        );

    if (
        !cliente ||
        !usuarioSesionActual ||
        !conversacionActualId ||
        !campoMensaje ||
        !botonEnviarMensaje ||
        (
            !contenido &&
            !hayImagen
        )
    ) {
        return;
    }

    if (contenido.length > 2000) {
        return;
    }

    const conexionSigueActiva =
        await actualizarDisponibilidadChat();

    if (!conexionSigueActiva) {
        return;
    }

    campoMensaje.disabled =
        true;

    botonEnviarMensaje.disabled =
        true;

    if (botonAdjuntarImagen) {
        botonAdjuntarImagen.disabled =
            true;
    }

    botonEnviarMensaje.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>
    `;

    let rutaImagenSubida =
        "";

    const mensajeTemporal =
        crearMensajeTemporalEnvio(
            contenido,
            hayImagen
                ? archivoImagenSeleccionado
                : null
        );

    try {
        let archivoImagenParaEnviar =
            archivoImagenSeleccionado;

        if (hayImagen) {
            iniciarProgresoImagen();

            archivoImagenParaEnviar =
                await optimizarImagenChat(
                    archivoImagenSeleccionado
                );

            actualizarProgresoImagen(
                14,
                "Subiendo imagen..."
            );

            rutaImagenSubida =
                await subirImagenChat(
                    archivoImagenParaEnviar
                );

            actualizarProgresoImagen(
                92,
                "Guardando mensaje..."
            );
        }

        const datosMensaje = {
            conversacion_id:
                conversacionActualId,

            remitente_id:
                usuarioSesionActual.id,

            contenido:
                contenido ||
                (
                    hayImagen
                        ? "Foto"
                        : ""
                ),

            tipo:
                hayImagen
                    ? "imagen"
                    : "texto",

            imagen_ruta:
                hayImagen
                    ? rutaImagenSubida
                    : null,

            imagen_nombre:
                hayImagen
                    ? archivoImagenParaEnviar.name
                    : null,

            mensaje_respuesta_id:
                mensajeRespuestaActual?.id ||
                null
        };

        const {
            data,
            error
        } = await cliente
            .from("mensajes")
            .insert(
                datosMensaje
            )
            .select(
                `
                    id,
                    conversacion_id,
                    remitente_id,
                    contenido,
                    tipo,
                    imagen_ruta,
                    imagen_nombre,
                    mensaje_respuesta_id,
                    eliminado,
                    eliminado_en,
                    editado,
                    editado_en,
                    leido,
                    creado_en
                `
            )
            .single();

        if (error) {
            throw error;
        }

        eliminarMensajeTemporal(
            mensajeTemporal
        );

        await renderizarMensaje(
            data
        );

        campoMensaje.value =
            "";

        cancelarRespuestaActual();

        liberarVistaPreviaImagen();

        if (hayImagen) {
            completarProgresoImagen();
        }

        detenerEstadoEscrituraLocal();

        ajustarAlturaMensaje();
    } catch (error) {
        cancelarProgresoImagen();

        console.error(
            "No se pudo enviar el mensaje:",
            error
        );

        if (
            rutaImagenSubida
        ) {
            await cliente
                .storage
                .from(
                    "imagenes-chat"
                )
                .remove(
                    [
                        rutaImagenSubida
                    ]
                );
        }

        const conexionSigueActiva =
            await actualizarDisponibilidadChat();

        if (!conexionSigueActiva) {
            eliminarMensajeTemporal(
                mensajeTemporal
            );
        } else {
            marcarMensajeTemporalConError(
                mensajeTemporal
            );

            window.alert(
                "No se ha podido enviar el mensaje o la imagen. Inténtalo de nuevo."
            );
        }
    } finally {
        botonEnviarMensaje.innerHTML = `
            <i
                class="fa-solid fa-paper-plane"
                aria-hidden="true"
            ></i>
        `;

        aplicarEstadoFormularioChat();

        if (chatPuedeEnviar) {
            campoMensaje.focus();
        }
    }
}


function mostrarEstadoEnLinea(
    visible
) {
    chatEnLinea?.classList.toggle(
        "oculto",
        !visible
    );
}


async function actualizarPresenciaPropia(
    enLinea
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual
    ) {
        return;
    }

    try {
        const {
            error
        } = await cliente.rpc(
            "actualizar_presencia_usuario",
            {
                estado_en_linea:
                    Boolean(
                        enLinea
                    )
            }
        );

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error(
            "No se pudo actualizar la presencia:",
            error
        );
    }
}


async function consultarPresenciaRemota() {
    const cliente =
        window.clienteSupabase;

    if (
        !chatPuedeEnviar ||
        !cliente ||
        !otroUsuarioActualId
    ) {
        mostrarEstadoEnLinea(
            false
        );

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
                    otroUsuarioActualId
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

        mostrarEstadoEnLinea(
            presencia?.en_linea ===
                true
        );
    } catch (error) {
        console.error(
            "No se pudo consultar la presencia:",
            error
        );

        mostrarEstadoEnLinea(
            false
        );
    }
}


function iniciarControlPresencia() {
    window.clearInterval(
        intervaloPresenciaPropia
    );

    window.clearInterval(
        intervaloPresenciaRemota
    );

    actualizarPresenciaPropia(
        true
    );

    consultarPresenciaRemota();

    intervaloPresenciaPropia =
        window.setInterval(
            () => {
                actualizarPresenciaPropia(
                    true
                );
            },
            20000
        );

    intervaloPresenciaRemota =
        window.setInterval(
            consultarPresenciaRemota,
            3000
        );
}


function asegurarIndicadorEscribiendo() {
    if (chatEscribiendo) {
        return chatEscribiendo;
    }

    const formulario =
        document.querySelector(
            "#chat-formulario"
        );

    if (!formulario) {
        return null;
    }

    chatEscribiendo =
        document.createElement(
            "div"
        );

    chatEscribiendo.id =
        "chat-escribiendo";

    chatEscribiendo.className =
        "chat-suralia__estado-escritura oculto";

    chatEscribiendo.setAttribute(
        "aria-live",
        "polite"
    );

    chatEscribiendo.innerHTML = `
        <span></span>
        <span></span>
        <span></span>

        <strong>
            Escribiendo...
        </strong>
    `;

    formulario.before(
        chatEscribiendo
    );

    return chatEscribiendo;
}


function mostrarEstadoEscribiendo(
    visible
) {
    const indicador =
        asegurarIndicadorEscribiendo();

    indicador?.classList.toggle(
        "oculto",
        !visible
    );
}


async function establecerEstadoEscritura(
    escribiendo
) {
    const cliente =
        window.clienteSupabase;

    if (
        !chatPuedeEnviar ||
        !cliente ||
        !conversacionActualId
    ) {
        return;
    }

    try {
        const {
            error
        } = await cliente.rpc(
            "establecer_estado_escritura",
            {
                conversacion_buscada:
                    conversacionActualId,

                estado_escribiendo:
                    Boolean(
                        escribiendo
                    )
            }
        );

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error(
            "No se pudo actualizar el estado Escribiendo:",
            error
        );
    }
}


function gestionarEscrituraLocal() {
    if (
        !chatPuedeEnviar ||
        !campoMensaje
    ) {
        mostrarEstadoEscribiendo(
            false
        );

        return;
    }

    const tieneTexto =
        campoMensaje.value
            .trim()
            .length > 0;

    window.clearTimeout(
        temporizadorEscrituraLocal
    );

    window.clearInterval(
        intervaloEscrituraLocal
    );

    intervaloEscrituraLocal =
        null;

    if (!tieneTexto) {
        usuarioEstaEscribiendo =
            false;

        establecerEstadoEscritura(
            false
        );

        return;
    }

    usuarioEstaEscribiendo =
        true;

    establecerEstadoEscritura(
        true
    );

    intervaloEscrituraLocal =
        window.setInterval(
            () => {
                establecerEstadoEscritura(
                    true
                );
            },
            1000
        );

    temporizadorEscrituraLocal =
        window.setTimeout(
            detenerEstadoEscrituraLocal,
            2200
        );
}


function detenerEstadoEscrituraLocal() {
    window.clearTimeout(
        temporizadorEscrituraLocal
    );

    window.clearInterval(
        intervaloEscrituraLocal
    );

    temporizadorEscrituraLocal =
        null;

    intervaloEscrituraLocal =
        null;

    if (usuarioEstaEscribiendo) {
        usuarioEstaEscribiendo =
            false;

        establecerEstadoEscritura(
            false
        );
    }
}


async function consultarEstadoEscrituraRemota() {
    const cliente =
        window.clienteSupabase;

    if (
        !chatPuedeEnviar ||
        !cliente ||
        !conversacionActualId
    ) {
        mostrarEstadoEscribiendo(
            false
        );

        return;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_estado_escritura_otro",
            {
                conversacion_buscada:
                    conversacionActualId
            }
        );

        if (error) {
            throw error;
        }

        mostrarEstadoEscribiendo(
            data === true
        );
    } catch (error) {
        console.error(
            "No se pudo consultar el estado Escribiendo:",
            error
        );

        mostrarEstadoEscribiendo(
            false
        );
    }
}


function iniciarConsultaEstadoEscritura() {
    consultarEstadoEscrituraRemota();

    window.clearInterval(
        canalEscrituraTabla
    );

    canalEscrituraTabla =
        window.setInterval(
            consultarEstadoEscrituraRemota,
            1000
        );
}


function suscribirseAMensajes() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !conversacionActualId
    ) {
        return;
    }

    if (canalMensajes) {
        cliente.removeChannel(
            canalMensajes
        );
    }

    canalMensajesListo =
        false;

    let canal =
        cliente
            .channel(
                `chat-${conversacionActualId}`,
                {
                    config: {
                        broadcast: {
                            self:
                                false
                        }
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "mensajes",

                    filter:
                        `conversacion_id=eq.${conversacionActualId}`
                },
                async (
                    cambio
                ) => {
                    const mensaje =
                        cambio.new;

                    await renderizarMensaje(
                        mensaje
                    );

                    if (
                        mensaje.remitente_id !==
                        usuarioSesionActual?.id
                    ) {
                        await reproducirSonidoChat();

                        await marcarMensajesComoLeidos();

                        await limpiarNotificacionesConversacionActual();
                    }
                }
            );

    /*
     * Solo añadimos Realtime de reacciones cuando la tabla
     * ha podido cargarse correctamente. Así un fallo en esta
     * función secundaria nunca bloquea el chat completo.
     */
    if (
        reaccionesChatDisponibles
    ) {
        canal =
            canal.on(
                "postgres_changes",
                {
                    event:
                        "*",

                    schema:
                        "public",

                    table:
                        "mensaje_reacciones",

                    filter:
                        `conversacion_id=eq.${conversacionActualId}`
                },
                (
                    cambio
                ) => {
                    const mensajeId =
                        actualizarMapaReacciones(
                            cambio
                        );

                    actualizarReaccionesMensajeEnPantalla(
                        mensajeId
                    );
                }
            );
    }

    canalMensajes =
        canal
            .on(
                "postgres_changes",
                {
                    event:
                        "UPDATE",

                    schema:
                        "public",

                    table:
                        "mensajes",

                    filter:
                        `conversacion_id=eq.${conversacionActualId}`
                },
                async (
                    cambio
                ) => {
                    const mensajeActualizado =
                        cambio.new;

                    if (
                        mensajeActualizado.eliminado ===
                        true
                    ) {
                        actualizarMensajeEliminadoEnPantalla(
                            mensajeActualizado
                        );

                        return;
                    }

                    if (
                        mensajeActualizado.editado ===
                        true
                    ) {
                        await actualizarMensajeEditadoEnPantalla(
                            mensajeActualizado
                        );

                        return;
                    }

                    actualizarEstadoMensaje(
                        mensajeActualizado
                    );
                }
            )
            .subscribe(
                (
                    estado
                ) => {
                    canalMensajesListo =
                        estado ===
                        "SUBSCRIBED";

                    if (
                        canalMensajesListo &&
                        campoMensaje?.value
                            ?.trim()
                    ) {
                        gestionarEscrituraLocal();
                    }

                    if (
                        estado ===
                        "CHANNEL_ERROR" ||
                        estado ===
                        "TIMED_OUT"
                    ) {
                        console.error(
                            "No se pudo activar el chat en tiempo real:",
                            estado
                        );

                        mostrarEstadoEscribiendo(
                            false
                        );
                    }
                }
            );
}


async function cargarConversacion() {
    conversacionActualId =
        obtenerConversacionId();

    const cliente =
        window.clienteSupabase;

    if (!conversacionActualId) {
        mostrarErrorMensajes(
            "El enlace no contiene una conversación válida."
        );

        return;
    }

    if (!cliente?.auth) {
        mostrarErrorMensajes(
            "No se ha podido conectar con Suralia."
        );

        return;
    }

    try {
        const {
            data: datosSesion,
            error: errorSesion
        } = await cliente.auth.getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        usuarioSesionActual =
            datosSesion.session?.user;

        if (!usuarioSesionActual) {
            sessionStorage.setItem(
                "destinoDespuesLoginSuralia",
                window.location.href
            );

            window.location.replace(
                "login.html"
            );

            return;
        }

        const {
            data: conversacion,
            error: errorConversacion
        } = await cliente
            .from("conversaciones")
            .select(
                `
                    id,
                    usuario_uno_id,
                    usuario_dos_id
                `
            )
            .eq(
                "id",
                conversacionActualId
            )
            .maybeSingle();

        if (errorConversacion) {
            throw errorConversacion;
        }

        if (!conversacion) {
            mostrarErrorMensajes(
                "La conversación no existe o no tienes acceso."
            );

            return;
        }

        const otroUsuarioId =
            conversacion.usuario_uno_id ===
                usuarioSesionActual.id
                ? conversacion.usuario_dos_id
                : conversacion.usuario_uno_id;

        otroUsuarioActualId =
            otroUsuarioId;

        const {
            data: perfil,
            error: errorPerfil
        } = await cliente
            .from("perfiles_sociales")
            .select(
                `
                    nombre_visible,
                    foto_principal_url,
                    perfil_publico_id
                `
            )
            .eq(
                "usuario_id",
                otroUsuarioId
            )
            .maybeSingle();

        if (errorPerfil) {
            throw errorPerfil;
        }

        const nombreGuardado =
            sessionStorage.getItem(
                "nombreConversacionSuralia"
            );

        const nombre =
            perfil?.nombre_visible ||
            nombreGuardado ||
            "Usuario de Suralia";

        if (chatNombre) {
            chatNombre.textContent =
                nombre;
        }

        document.title =
            `${nombre} | Mensajes | Suralia`;

        mostrarAvatarChat(
            perfil
        );

        if (
            chatVerPerfil &&
            perfil?.perfil_publico_id
        ) {
            chatVerPerfil.href =
                `perfil-publico.html?id=${encodeURIComponent(
                    perfil.perfil_publico_id
                )}`;

            chatVerPerfil.classList.remove(
                "oculto"
            );
        } else {
            chatVerPerfil?.classList.add(
                "oculto"
            );
        }

        await actualizarDisponibilidadChat();

        await cargarReaccionesConversacion();

        await cargarMensajesGuardados();

        await marcarMensajesComoLeidos();

        await limpiarNotificacionesConversacionActual();

        suscribirseAMensajes();
        iniciarConsultaEstadoEscritura();
        iniciarControlPresencia();

        cargaMensajes?.classList.add(
            "oculto"
        );

        errorMensajes?.classList.add(
            "oculto"
        );

        chatSuralia?.classList.remove(
            "oculto"
        );

        asegurarIndicadorEscribiendo();
        crearBotonBajarUltimoMensaje();
        actualizarAccionesMensajesSegunDisponibilidad();
        activarFormularioChat();
        iniciarControlDisponibilidadChat();

        /*
         * Esperamos a que el chat sea visible y el navegador
         * calcule su altura antes de bajar al último mensaje.
         */
        window.requestAnimationFrame(
            () => {
                window.requestAnimationFrame(
                    () => {
                        desplazarAlFinal(
                            false
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "No se pudo cargar la conversación:",
            error
        );

        mostrarErrorMensajes(
            "No se ha podido abrir esta conversación."
        );
    }
}


botonAdjuntarImagen?.addEventListener(
    "click",
    () => {
        if (!chatPuedeEnviar) {
            return;
        }

        if (
            esDispositivoMovil()
        ) {
            mostrarMenuImagenChat();
            return;
        }

        campoArchivoImagen?.click();
    }
);


botonHacerFoto?.addEventListener(
    "click",
    () => {
        ocultarMenuImagenChat();
        campoCamaraImagen?.click();
    }
);


botonElegirGaleria?.addEventListener(
    "click",
    () => {
        ocultarMenuImagenChat();
        campoArchivoImagen?.click();
    }
);


botonCancelarMenuImagen?.addEventListener(
    "click",
    ocultarMenuImagenChat
);


campoArchivoImagen?.addEventListener(
    "change",
    () => {
        seleccionarImagenChat(
            campoArchivoImagen.files?.[0] ||
            null
        );
    }
);


campoCamaraImagen?.addEventListener(
    "change",
    () => {
        seleccionarImagenChat(
            campoCamaraImagen.files?.[0] ||
            null
        );
    }
);


document.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            menuImagenChat?.classList.contains(
                "oculto"
            )
        ) {
            return;
        }

        if (
            evento.target.closest(
                "#chat-menu-imagen"
            ) ||
            evento.target.closest(
                "#chat-adjuntar-imagen"
            )
        ) {
            return;
        }

        ocultarMenuImagenChat();
    }
);


botonCancelarImagen?.addEventListener(
    "click",
    liberarVistaPreviaImagen
);


crearBarraEdicionChat();
crearBarraRespuestaChat();


formularioChat?.addEventListener(
    "submit",
    enviarMensaje
);


campoMensaje?.addEventListener(
    "input",
    () => {
        ajustarAlturaMensaje();

        if (!chatPuedeEnviar) {
            return;
        }

        gestionarEscrituraLocal();
    }
);


campoMensaje?.addEventListener(
    "keydown",
    (
        evento
    ) => {
        if (
            evento.key === "Enter" &&
            !evento.shiftKey
        ) {
            evento.preventDefault();

            formularioChat?.requestSubmit();
        }
    }
);




document.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            evento.target.closest(
                "[data-abrir-reacciones], [data-selector-reacciones]"
            )
        ) {
            return;
        }

        cerrarSelectoresReacciones();
    }
);


document.addEventListener(
    "visibilitychange",
    () => {
        if (
            !usuarioSesionActual ||
            document.visibilityState !==
                "visible"
        ) {
            return;
        }

        actualizarPresenciaPropia(
            true
        );

        consultarPresenciaRemota();

        limpiarNotificacionesConversacionActual();
    }
);


listaMensajes?.addEventListener(
    "click",
    async (
        evento
    ) => {
        const botonAbrirReacciones =
            evento.target.closest(
                "[data-abrir-reacciones]"
            );

        if (botonAbrirReacciones) {
            evento.stopPropagation();

            alternarSelectorReacciones(
                botonAbrirReacciones
            );

            return;
        }

        const botonReaccion =
            evento.target.closest(
                "[data-reaccion-rapida]"
            );

        if (botonReaccion) {
            evento.stopPropagation();

            await alternarReaccionMensaje(
                botonReaccion.dataset
                    .mensajeReaccion,
                botonReaccion.dataset
                    .reaccionRapida
            );

            return;
        }

        const enlaceImagen =
            evento.target.closest(
                "[data-abrir-imagen-chat]"
            );

        if (enlaceImagen) {
            evento.preventDefault();

            const imagen =
                enlaceImagen.querySelector(
                    "img"
                );

            abrirModalImagenChat(
                enlaceImagen.dataset
                    .abrirImagenChat,
                imagen?.alt ||
                    "Imagen ampliada del chat"
            );

            return;
        }

        const botonCopiar =
            evento.target.closest(
                "[data-copiar-mensaje]"
            );

        if (botonCopiar) {
            await copiarTextoMensaje(
                botonCopiar.closest(
                    "[data-mensaje-id]"
                ),
                botonCopiar
            );

            return;
        }

        const botonIrMensaje =
            evento.target.closest(
                "[data-ir-mensaje]"
            );

        if (botonIrMensaje) {
            irAlMensajeRespondido(
                botonIrMensaje.dataset
                    .irMensaje
            );

            return;
        }

        const botonResponder =
            evento.target.closest(
                "[data-responder-mensaje]"
            );

        if (botonResponder) {
            iniciarRespuestaMensaje(
                botonResponder.closest(
                    "[data-mensaje-id]"
                )
            );

            return;
        }

        const botonEditar =
            evento.target.closest(
                "[data-editar-mensaje]"
            );

        if (botonEditar) {
            iniciarEdicionMensaje(
                botonEditar.closest(
                    "[data-mensaje-id]"
                )
            );

            return;
        }

        const botonEliminar =
            evento.target.closest(
                "[data-eliminar-mensaje]"
            );

        if (!botonEliminar) {
            return;
        }

        abrirModalEliminarMensaje(
            botonEliminar.dataset
                .eliminarMensaje
        );
    }
);


cerrarModalImagenChat?.addEventListener(
    "click",
    cerrarImagenChat
);


cerrarModalImagenFondo?.addEventListener(
    "click",
    cerrarImagenChat
);


cancelarEliminarMensaje?.addEventListener(
    "click",
    cerrarModalEliminarMensaje
);


confirmarEliminarMensaje?.addEventListener(
    "click",
    () => {
        if (!mensajePendienteEliminarId) {
            return;
        }

        eliminarMensajePropio(
            mensajePendienteEliminarId
        );
    }
);


modalEliminarMensaje?.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            evento.target.matches(
                "[data-cerrar-modal-eliminar]"
            )
        ) {
            cerrarModalEliminarMensaje();
        }
    }
);


document.addEventListener(
    "keydown",
    (
        evento
    ) => {
        if (
            evento.key !==
                "Escape"
        ) {
            return;
        }

        if (
            mensajeEdicionActual
        ) {
            cancelarEdicionMensaje();
            return;
        }

        if (
            !modalImagenChat?.classList.contains(
                "oculto"
            )
        ) {
            cerrarImagenChat();
            return;
        }

        if (
            !modalEliminarMensaje?.classList.contains(
                "oculto"
            )
        ) {
            cerrarModalEliminarMensaje();
        }
    }
);


window.addEventListener(
    "beforeunload",
    () => {
        liberarVistaPreviaImagen();
        cancelarProgresoImagen();
        detenerEstadoEscrituraLocal();

        establecerEstadoEscritura(
            false
        );

        actualizarPresenciaPropia(
            false
        );

        window.clearInterval(
            intervaloPresenciaPropia
        );

        window.clearInterval(
            intervaloPresenciaRemota
        );

        intervaloPresenciaPropia =
            null;

        intervaloPresenciaRemota =
            null;

        canalMensajesListo =
            false;

        mostrarEstadoEscribiendo(
            false
        );

        if (
            canalMensajes &&
            window.clienteSupabase
        ) {
            window.clienteSupabase
                .removeChannel(
                    canalMensajes
                );
        }

        window.clearInterval(
            canalEscrituraTabla
        );

        canalEscrituraTabla =
            null;

        window.clearInterval(
            intervaloDisponibilidadChat
        );

        intervaloDisponibilidadChat =
            null;
    }
);


campoMensaje?.addEventListener(
    "blur",
    detenerEstadoEscrituraLocal
);


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        () => {
            cargarUsuarioHeaderMensajes();
            cargarConversacion();
        }
    );
} else {
    cargarUsuarioHeaderMensajes();
    cargarConversacion();
}