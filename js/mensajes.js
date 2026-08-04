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


let usuarioSesionActual =
    null;

let conversacionActualId =
    "";

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


function crearElementoMensaje(
    mensaje
) {
    const esPropio =
        mensaje.remitente_id ===
        usuarioSesionActual?.id;

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

    articulo.innerHTML = `
        <div class="chat-mensaje__burbuja">
            <p>${escaparHTML(
                mensaje.contenido
            )}</p>

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
                    esPropio
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
                            </span>
                        `
                        : ""
                }
            </div>
        </div>
    `;

    return articulo;
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
    `;
}


function renderizarMensaje(
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

    const vacio =
        listaMensajes.querySelector(
            ".chat-suralia__vacio"
        );

    vacio?.remove();

    listaMensajes.appendChild(
        crearElementoMensaje(
            mensaje
        )
    );

    mensajesRenderizados.add(
        mensaje.id
    );

    if (desplazar) {
        desplazarAlFinal(
            true
        );
    }
}


function mostrarConversacionVacia() {
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

    data.forEach(
        (mensaje) => {
            renderizarMensaje(
                mensaje,
                false
            );
        }
    );

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


function activarFormularioChat() {
    if (
        !campoMensaje ||
        !botonEnviarMensaje
    ) {
        return;
    }

    campoMensaje.disabled =
        false;

    botonEnviarMensaje.disabled =
        false;

    campoMensaje.focus();
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


async function enviarMensaje(
    evento
) {
    evento.preventDefault();

    const cliente =
        window.clienteSupabase;

    const contenido =
        campoMensaje?.value
            ?.trim() ||
        "";

    if (
        !cliente ||
        !usuarioSesionActual ||
        !conversacionActualId ||
        !campoMensaje ||
        !botonEnviarMensaje ||
        !contenido
    ) {
        return;
    }

    if (contenido.length > 2000) {
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
            data,
            error
        } = await cliente
            .from("mensajes")
            .insert({
                conversacion_id:
                    conversacionActualId,

                remitente_id:
                    usuarioSesionActual.id,

                contenido:
                    contenido
            })
            .select(
                `
                    id,
                    conversacion_id,
                    remitente_id,
                    contenido,
                    leido,
                    creado_en
                `
            )
            .single();

        if (error) {
            throw error;
        }

        renderizarMensaje(
            data
        );

        campoMensaje.value =
            "";

        detenerEstadoEscrituraLocal();

        ajustarAlturaMensaje();
    } catch (error) {
        console.error(
            "No se pudo enviar el mensaje:",
            error
        );

        window.alert(
            "No se ha podido enviar el mensaje. Comprueba que la conexión sigue activa."
        );
    } finally {
        campoMensaje.disabled =
            false;

        botonEnviarMensaje.disabled =
            false;

        botonEnviarMensaje.innerHTML = `
            <i
                class="fa-solid fa-paper-plane"
                aria-hidden="true"
            ></i>
        `;

        campoMensaje.focus();
    }
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
    if (!campoMensaje) {
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
        !cliente ||
        !conversacionActualId
    ) {
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

    canalMensajes =
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

                    renderizarMensaje(
                        mensaje
                    );

                    if (
                        mensaje.remitente_id !==
                        usuarioSesionActual?.id
                    ) {
                        await reproducirSonidoChat();

                        await marcarMensajesComoLeidos();
                    }
                }
            )
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
                (
                    cambio
                ) => {
                    actualizarEstadoMensaje(
                        cambio.new
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

        await cargarMensajesGuardados();

        await marcarMensajesComoLeidos();

        suscribirseAMensajes();
        iniciarConsultaEstadoEscritura();

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
        activarFormularioChat();
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


formularioChat?.addEventListener(
    "submit",
    enviarMensaje
);


campoMensaje?.addEventListener(
    "input",
    () => {
        ajustarAlturaMensaje();
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


window.addEventListener(
    "beforeunload",
    () => {
        detenerEstadoEscrituraLocal();

        establecerEstadoEscritura(
            false
        );

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