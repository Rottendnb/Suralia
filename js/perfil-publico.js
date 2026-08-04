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


const sesionGuardada =
    leerDatoLocal(
        "sesionSuralia",
        null
    );

if (
    !sesionGuardada ||
    !sesionGuardada.conectado
) {
    sessionStorage.setItem(
        "destinoDespuesLoginSuralia",
        window.location.href
    );

    window.location.replace(
        "login.html"
    );
}


const perfilCarga =
    document.querySelector(
        "#perfil-publico-carga"
    );

const perfilError =
    document.querySelector(
        "#perfil-publico-error"
    );

const perfilErrorTexto =
    document.querySelector(
        "#perfil-publico-error-texto"
    );

const perfilPublico =
    document.querySelector(
        "#perfil-publico"
    );

const botonVolver =
    document.querySelector(
        "#boton-volver-perfil-publico"
    );

const modalFoto =
    document.querySelector(
        "#modal-foto-publica"
    );

const imagenModalFoto =
    document.querySelector(
        "#imagen-modal-foto-publica"
    );

const cerrarModalFoto =
    document.querySelector(
        "#cerrar-modal-foto-publica"
    );


const bloqueConexionPerfil =
    document.querySelector(
        "#bloque-conexion-perfil"
    );

const tituloConexionPerfil =
    document.querySelector(
        "#titulo-conexion-perfil"
    );

const textoConexionPerfil =
    document.querySelector(
        "#texto-conexion-perfil"
    );

const botonSolicitarConexion =
    document.querySelector(
        "#boton-solicitar-conexion"
    );

const mensajeConexionPerfil =
    document.querySelector(
        "#mensaje-conexion-perfil"
    );

const bloqueSeguridadPerfil =
    document.querySelector(
        "#bloque-seguridad-perfil"
    );

const botonBloquearUsuario =
    document.querySelector(
        "#boton-bloquear-usuario"
    );

const botonDenunciarUsuario =
    document.querySelector(
        "#boton-denunciar-usuario"
    );

const mensajeSeguridadPerfil =
    document.querySelector(
        "#mensaje-seguridad-perfil"
    );

const modalBloquearUsuario =
    document.querySelector(
        "#modal-bloquear-usuario"
    );

const cerrarModalBloquear =
    document.querySelector(
        "#cerrar-modal-bloquear"
    );

const cancelarBloqueoUsuario =
    document.querySelector(
        "#cancelar-bloqueo-usuario"
    );

const confirmarBloqueoUsuario =
    document.querySelector(
        "#confirmar-bloqueo-usuario"
    );

const modalDenunciarUsuario =
    document.querySelector(
        "#modal-denunciar-usuario"
    );

const cerrarModalDenunciar =
    document.querySelector(
        "#cerrar-modal-denunciar"
    );

const cancelarDenunciaUsuario =
    document.querySelector(
        "#cancelar-denuncia-usuario"
    );

const formularioDenunciarUsuario =
    document.querySelector(
        "#formulario-denunciar-usuario"
    );

const motivoDenunciaUsuario =
    document.querySelector(
        "#motivo-denuncia-usuario"
    );

const descripcionDenunciaUsuario =
    document.querySelector(
        "#descripcion-denuncia-usuario"
    );

const contadorDenunciaUsuario =
    document.querySelector(
        "#contador-denuncia-usuario"
    );

const confirmarEfectoDenuncia =
    document.querySelector(
        "#confirmar-efecto-denuncia"
    );

const errorDenunciaUsuario =
    document.querySelector(
        "#error-denuncia-usuario"
    );

const confirmarDenunciaUsuario =
    document.querySelector(
        "#confirmar-denuncia-usuario"
    );

let usuarioSesionActual =
    null;

let receptorConexionId =
    "";

let nombrePerfilPublico =
    "este usuario";

let usuarioEstaBloqueado =
    false;

let elementoFocoAnterior =
    null;



/* =========================================
   AVATAR DEL USUARIO CONECTADO EN EL HEADER
========================================= */

async function cargarUsuarioHeaderPerfilPublico() {
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
        sesionGuardada?.nombre ||
        "Mi perfil";

    const apellidosLocal =
        usuarioLocal.apellidos ||
        sesionGuardada?.apellidos ||
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

    /*
       Primero muestra inmediatamente la imagen guardada
       para evitar que aparezcan las iniciales mientras carga.
    */
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
                    foto_principal_url
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

            const usuarioActualizado = {
                ...usuarioLocal,
                avatarTipo:
                    "imagen",
                avatarValor:
                    perfilConectado.foto_principal_url
            };

            localStorage.setItem(
                "usuarioSuralia",
                JSON.stringify(
                    usuarioActualizado
                )
            );
        }
    } catch (error) {
        console.error(
            "No se pudo cargar el avatar del usuario conectado:",
            error
        );
    }
}


const textosBusca = {
    amistades:
        "Hacer nuevas amistades",

    "companeros-actividades":
        "Compañeros para actividades",

    "salir-en-grupo":
        "Salir en grupo",

    "compartir-transporte":
        "Compartir transporte",

    "conocer-alguien-especial":
        "Conocer a alguien especial"
};


const textosIntereses = {
    senderismo:
        "🥾 Senderismo",

    musica:
        "🎵 Música",

    gastronomia:
        "🍽️ Gastronomía",

    deporte:
        "⚽ Deporte",

    viajes:
        "✈️ Viajes",

    cultura:
        "🏛️ Cultura",

    cine:
        "🎬 Cine",

    fotografia:
        "📷 Fotografía",

    naturaleza:
        "🌿 Naturaleza",

    fiestas:
        "🎉 Fiestas"
};


const textosDisponibilidad = {
    "entre-semana":
        "Entre semana",

    "fines-de-semana":
        "Fines de semana",

    manana:
        "Mañanas",

    tarde:
        "Tardes",

    noche:
        "Noches"
};


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


function obtenerPerfilIdURL() {
    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return parametros
        .get("id")
        ?.trim() ||
        "";
}


function mostrarError(
    mensaje
) {
    perfilCarga?.classList.add(
        "oculto"
    );

    perfilPublico?.classList.add(
        "oculto"
    );

    perfilError?.classList.remove(
        "oculto"
    );

    if (perfilErrorTexto) {
        perfilErrorTexto.textContent =
            mensaje;
    }
}


function mostrarDatoMeta(
    selector,
    valor,
    texto
) {
    const elemento =
        document.querySelector(
            selector
        );

    if (!elemento) {
        return;
    }

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        elemento.classList.add(
            "oculto"
        );

        return;
    }

    const span =
        elemento.querySelector(
            "span"
        );

    if (span) {
        span.textContent =
            texto;
    }

    elemento.classList.remove(
        "oculto"
    );
}


function crearEtiquetas(
    contenedorId,
    valores,
    diccionario,
    bloqueId
) {
    const contenedor =
        document.querySelector(
            contenedorId
        );

    const bloque =
        document.querySelector(
            bloqueId
        );

    const lista =
        Array.isArray(valores)
            ? valores
            : [];

    if (
        !contenedor ||
        !bloque
    ) {
        return;
    }

    if (lista.length === 0) {
        bloque.classList.add(
            "oculto"
        );

        return;
    }

    bloque.classList.remove(
        "oculto"
    );

    contenedor.innerHTML =
        lista
            .map(
                (valor) => `
                    <span>
                        ${
                            escaparHTML(
                                diccionario[valor] ||
                                valor
                            )
                        }
                    </span>
                `
            )
            .join("");
}


function abrirFotoPublica(
    url
) {
    if (
        !modalFoto ||
        !imagenModalFoto
    ) {
        return;
    }

    imagenModalFoto.src =
        url;

    modalFoto.classList.add(
        "visible"
    );

    modalFoto.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    cerrarModalFoto?.focus();
}


function cerrarFotoPublica() {
    if (
        !modalFoto ||
        !imagenModalFoto
    ) {
        return;
    }

    modalFoto.classList.remove(
        "visible"
    );

    modalFoto.setAttribute(
        "aria-hidden",
        "true"
    );

    imagenModalFoto.src =
        "";

    document.body.style.overflow =
        "";
}


function mostrarGaleria(
    fotos
) {
    const galeria =
        document.querySelector(
            "#perfil-publico-galeria"
        );

    const totalFotos =
        document.querySelector(
            "#perfil-publico-total-fotos"
        );

    const bloque =
        document.querySelector(
            "#bloque-galeria-publica"
        );

    const lista =
        Array.isArray(fotos)
            ? [...fotos].sort(
                (fotoA, fotoB) =>
                    Number(
                        fotoA.posicion
                    ) -
                    Number(
                        fotoB.posicion
                    )
            )
            : [];

    if (
        !galeria ||
        !totalFotos ||
        !bloque
    ) {
        return;
    }

    if (lista.length === 0) {
        bloque.classList.add(
            "oculto"
        );

        return;
    }

    bloque.classList.remove(
        "oculto"
    );

    totalFotos.textContent =
        `${lista.length} ${
            lista.length === 1
                ? "foto"
                : "fotos"
        }`;

    galeria.innerHTML =
        lista
            .map(
                (foto, indice) => `
                    <button
                        type="button"
                        class="perfil-publico-galeria__foto ${
                            foto.principal
                                ? "perfil-publico-galeria__foto--principal"
                                : ""
                        }"
                        data-foto-publica="${escaparHTML(
                            foto.url
                        )}"
                        aria-label="Ampliar fotografía ${indice + 1}"
                    >
                        <img
                            src="${escaparHTML(
                                foto.url
                            )}"
                            alt="Fotografía ${indice + 1} del perfil"
                            loading="lazy"
                        >

                        ${
                            foto.principal
                                ? `
                                    <span>
                                        <i class="fa-solid fa-star"></i>
                                        Principal
                                    </span>
                                `
                                : ""
                        }
                    </button>
                `
            )
            .join("");

    document
        .querySelectorAll(
            "[data-foto-publica]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        abrirFotoPublica(
                            boton.dataset
                                .fotoPublica
                        );
                    }
                );
            }
        );
}


/* =========================================
   SOLICITUDES DE CONEXIÓN
========================================= */

function actualizarTarjetaConexion(
    estado,
    mensaje = ""
) {
    if (
        !bloqueConexionPerfil ||
        !botonSolicitarConexion
    ) {
        return;
    }

    bloqueConexionPerfil.classList.remove(
        "perfil-publico-conexion--pendiente",
        "perfil-publico-conexion--conectados",
        "perfil-publico-conexion--recibida"
    );

    botonSolicitarConexion.disabled =
        false;

    if (mensajeConexionPerfil) {
        mensajeConexionPerfil.textContent =
            mensaje;
    }

    if (estado === "propio") {
        bloqueConexionPerfil.classList.add(
            "oculto"
        );

        bloqueSeguridadPerfil?.classList.add(
            "oculto"
        );

        return;
    }

    bloqueSeguridadPerfil?.classList.remove(
        "oculto"
    );

    bloqueConexionPerfil.classList.remove(
        "oculto"
    );

    if (estado === "pendiente-enviada") {
        bloqueConexionPerfil.classList.add(
            "perfil-publico-conexion--pendiente"
        );

        tituloConexionPerfil.textContent =
            "Solicitud enviada";

        textoConexionPerfil.textContent =
            "Esta persona recibirá tu solicitud y podrá aceptarla o rechazarla.";

        botonSolicitarConexion.innerHTML = `
            <i class="fa-regular fa-clock"></i>
            Solicitud enviada
        `;

        botonSolicitarConexion.disabled =
            true;

        return;
    }

    if (estado === "pendiente-recibida") {
        bloqueConexionPerfil.classList.add(
            "perfil-publico-conexion--recibida"
        );

        tituloConexionPerfil.textContent =
            "Tienes una solicitud pendiente";

        textoConexionPerfil.textContent =
            "Esta persona ya te ha enviado una solicitud de conexión.";

        botonSolicitarConexion.innerHTML = `
            <i class="fa-solid fa-inbox"></i>
            Ver solicitudes
        `;

        botonSolicitarConexion.onclick =
            () => {
                window.location.href =
                    "perfil.html#conexiones";
            };

        return;
    }

    if (estado === "aceptada") {
        bloqueConexionPerfil.classList.add(
            "perfil-publico-conexion--conectados"
        );

        tituloConexionPerfil.textContent =
            "Ya estáis conectados";

        textoConexionPerfil.textContent =
            "Esta persona forma parte de tus conexiones en Suralia.";

        botonSolicitarConexion.innerHTML = `
            <i class="fa-solid fa-user-check"></i>
            Conexión activa
        `;

        botonSolicitarConexion.disabled =
            true;

        return;
    }

    tituloConexionPerfil.textContent =
        "¿Tenéis intereses parecidos?";

    textoConexionPerfil.textContent =
        "Envía una solicitud para conectar y organizar planes con esta persona.";

    botonSolicitarConexion.innerHTML = `
        <i class="fa-solid fa-user-plus"></i>
        Solicitar conexión
    `;

    botonSolicitarConexion.onclick =
        enviarSolicitudConexion;
}


async function consultarEstadoConexion() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId
    ) {
        return;
    }

    if (
        usuarioSesionActual.id ===
        receptorConexionId
    ) {
        actualizarTarjetaConexion(
            "propio"
        );

        return;
    }

    const {
        data,
        error
    } = await cliente
        .from("solicitudes_conexion")
        .select(
            `
                id,
                solicitante_id,
                receptor_id,
                estado
            `
        )
        .or(
            `and(solicitante_id.eq.${usuarioSesionActual.id},receptor_id.eq.${receptorConexionId}),and(solicitante_id.eq.${receptorConexionId},receptor_id.eq.${usuarioSesionActual.id})`
        )
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        actualizarTarjetaConexion(
            "disponible"
        );

        return;
    }

    if (data.estado === "aceptada") {
        actualizarTarjetaConexion(
            "aceptada"
        );

        return;
    }

    if (
        data.estado === "pendiente" &&
        data.solicitante_id ===
            usuarioSesionActual.id
    ) {
        actualizarTarjetaConexion(
            "pendiente-enviada"
        );

        return;
    }

    if (
        data.estado === "pendiente" &&
        data.receptor_id ===
            usuarioSesionActual.id
    ) {
        actualizarTarjetaConexion(
            "pendiente-recibida"
        );

        return;
    }

    /*
       Una solicitud rechazada permite volver a intentarlo.
       Se elimina antes de crear una solicitud nueva.
    */
    actualizarTarjetaConexion(
        "disponible"
    );
}


async function enviarSolicitudConexion() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId ||
        !botonSolicitarConexion
    ) {
        return;
    }

    if (
        usuarioSesionActual.id ===
        receptorConexionId
    ) {
        actualizarTarjetaConexion(
            "propio"
        );

        return;
    }

    botonSolicitarConexion.disabled =
        true;

    botonSolicitarConexion.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Enviando solicitud...
    `;

    if (mensajeConexionPerfil) {
        mensajeConexionPerfil.textContent =
            "";
    }

    try {
        /*
           Si hubo una solicitud rechazada anteriormente,
           la eliminamos para permitir una nueva solicitud.
        */
        const {
            data: solicitudAnterior,
            error: errorConsulta
        } = await cliente
            .from("solicitudes_conexion")
            .select(
                `
                    id,
                    estado,
                    solicitante_id,
                    receptor_id
                `
            )
            .or(
                `and(solicitante_id.eq.${usuarioSesionActual.id},receptor_id.eq.${receptorConexionId}),and(solicitante_id.eq.${receptorConexionId},receptor_id.eq.${usuarioSesionActual.id})`
            )
            .maybeSingle();

        if (errorConsulta) {
            throw errorConsulta;
        }

        if (
            solicitudAnterior &&
            solicitudAnterior.estado !==
                "rechazada"
        ) {
            await consultarEstadoConexion();
            return;
        }

        if (
            solicitudAnterior?.estado ===
            "rechazada"
        ) {
            const {
                error: errorEliminar
            } = await cliente
                .from("solicitudes_conexion")
                .delete()
                .eq(
                    "id",
                    solicitudAnterior.id
                );

            if (errorEliminar) {
                throw errorEliminar;
            }
        }

        const {
            error
        } = await cliente
            .from("solicitudes_conexion")
            .insert({
                solicitante_id:
                    usuarioSesionActual.id,

                receptor_id:
                    receptorConexionId,

                estado:
                    "pendiente"
            });

        if (error) {
            /*
               El índice único también evita duplicados
               aunque se pulse dos veces muy rápido.
            */
            if (
                error.code === "23505"
            ) {
                await consultarEstadoConexion();
                return;
            }

            throw error;
        }

        actualizarTarjetaConexion(
            "pendiente-enviada",
            "La solicitud se ha enviado correctamente."
        );
    } catch (error) {
        console.error(
            "No se pudo enviar la solicitud de conexión:",
            error
        );

        actualizarTarjetaConexion(
            "disponible",
            "No se ha podido enviar la solicitud. Inténtalo de nuevo."
        );
    }
}



/* =========================================
   BLOQUEAR Y DENUNCIAR USUARIO
========================================= */

function abrirModalSeguridad(
    modal
) {
    if (!modal) {
        return;
    }

    elementoFocoAnterior =
        document.activeElement;

    modal.classList.add(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    const primerControl =
        modal.querySelector(
            "button, select, textarea, input"
        );

    window.setTimeout(
        () => {
            primerControl?.focus();
        },
        50
    );
}


function cerrarModalSeguridad(
    modal
) {
    if (!modal) {
        return;
    }

    modal.classList.remove(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    elementoFocoAnterior?.focus?.();
    elementoFocoAnterior =
        null;
}


function actualizarPerfilBloqueado(
    mensaje
) {
    usuarioEstaBloqueado =
        true;

    bloqueConexionPerfil?.classList.add(
        "oculto"
    );

    if (botonBloquearUsuario) {
        botonBloquearUsuario.disabled =
            false;

        botonBloquearUsuario.classList.add(
            "perfil-publico-seguridad__boton--desbloquear"
        );

        botonBloquearUsuario.innerHTML = `
            <i class="fa-solid fa-user-check"></i>
            Desbloquear usuario
        `;
    }

    if (botonDenunciarUsuario) {
        botonDenunciarUsuario.disabled =
            true;
    }

    if (mensajeSeguridadPerfil) {
        mensajeSeguridadPerfil.textContent =
            mensaje;
    }

    bloqueSeguridadPerfil?.classList.add(
        "perfil-publico-seguridad--bloqueado"
    );
}


function actualizarPerfilDesbloqueado(
    mensaje
) {
    usuarioEstaBloqueado =
        false;

    bloqueSeguridadPerfil?.classList.remove(
        "perfil-publico-seguridad--bloqueado"
    );

    if (botonBloquearUsuario) {
        botonBloquearUsuario.disabled =
            false;

        botonBloquearUsuario.classList.remove(
            "perfil-publico-seguridad__boton--desbloquear"
        );

        botonBloquearUsuario.innerHTML = `
            <i class="fa-solid fa-user-slash"></i>
            Bloquear usuario
        `;
    }

    if (botonDenunciarUsuario) {
        botonDenunciarUsuario.disabled =
            false;
    }

    if (mensajeSeguridadPerfil) {
        mensajeSeguridadPerfil.textContent =
            mensaje;
    }

    actualizarTarjetaConexion(
        "disponible"
    );
}


async function consultarBloqueoActual() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId ||
        usuarioSesionActual.id ===
            receptorConexionId
    ) {
        return false;
    }

    const {
        data,
        error
    } = await cliente
        .from("bloqueos_usuarios")
        .select("bloqueado_id")
        .eq(
            "bloqueador_id",
            usuarioSesionActual.id
        )
        .eq(
            "bloqueado_id",
            receptorConexionId
        )
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (data) {
        actualizarPerfilBloqueado(
            "Has bloqueado a este usuario."
        );

        return true;
    }

    return false;
}


async function bloquearUsuarioActual() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId ||
        !confirmarBloqueoUsuario
    ) {
        return;
    }

    confirmarBloqueoUsuario.disabled =
        true;

    confirmarBloqueoUsuario.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Bloqueando...
    `;

    try {
        const {
            error
        } = await cliente.rpc(
            "bloquear_usuario",
            {
                usuario_bloqueado:
                    receptorConexionId
            }
        );

        if (error) {
            throw error;
        }

        cerrarModalSeguridad(
            modalBloquearUsuario
        );

        actualizarPerfilBloqueado(
            `${nombrePerfilPublico} ha sido bloqueado. La conexión o solicitud existente se ha eliminado.`
        );
    } catch (error) {
        console.error(
            "No se pudo bloquear al usuario:",
            error
        );

        if (mensajeSeguridadPerfil) {
            mensajeSeguridadPerfil.textContent =
                "No se ha podido bloquear al usuario. Inténtalo de nuevo.";
        }
    } finally {
        confirmarBloqueoUsuario.disabled =
            false;

        confirmarBloqueoUsuario.innerHTML = `
            <i class="fa-solid fa-user-slash"></i>
            Bloquear usuario
        `;
    }
}


async function desbloquearUsuarioActual() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId ||
        !confirmarBloqueoUsuario
    ) {
        return;
    }

    confirmarBloqueoUsuario.disabled =
        true;

    confirmarBloqueoUsuario.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Desbloqueando...
    `;

    try {
        const {
            error
        } = await cliente.rpc(
            "desbloquear_usuario",
            {
                usuario_desbloqueado:
                    receptorConexionId
            }
        );

        if (error) {
            throw error;
        }

        cerrarModalSeguridad(
            modalBloquearUsuario
        );

        actualizarPerfilDesbloqueado(
            `${nombrePerfilPublico} ha sido desbloqueado. Ya puedes volver a enviarle una solicitud de conexión.`
        );
    } catch (error) {
        console.error(
            "No se pudo desbloquear al usuario:",
            error
        );

        if (mensajeSeguridadPerfil) {
            mensajeSeguridadPerfil.textContent =
                "No se ha podido desbloquear al usuario. Inténtalo de nuevo.";
        }
    } finally {
        confirmarBloqueoUsuario.disabled =
            false;

        confirmarBloqueoUsuario.innerHTML = `
            <i class="fa-solid fa-user-check"></i>
            Desbloquear usuario
        `;
    }
}


function reiniciarFormularioDenuncia() {
    formularioDenunciarUsuario?.reset();

    if (contadorDenunciaUsuario) {
        contadorDenunciaUsuario.textContent =
            "0";
    }

    if (errorDenunciaUsuario) {
        errorDenunciaUsuario.textContent =
            "";
    }
}


async function enviarDenunciaUsuario(
    evento
) {
    evento.preventDefault();

    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioSesionActual ||
        !receptorConexionId ||
        !motivoDenunciaUsuario ||
        !confirmarEfectoDenuncia ||
        !confirmarDenunciaUsuario
    ) {
        return;
    }

    if (!motivoDenunciaUsuario.value) {
        errorDenunciaUsuario.textContent =
            "Selecciona el motivo de la denuncia.";

        motivoDenunciaUsuario.focus();
        return;
    }

    if (!confirmarEfectoDenuncia.checked) {
        errorDenunciaUsuario.textContent =
            "Debes confirmar que entiendes que también se bloqueará al usuario.";

        confirmarEfectoDenuncia.focus();
        return;
    }

    errorDenunciaUsuario.textContent =
        "";

    confirmarDenunciaUsuario.disabled =
        true;

    confirmarDenunciaUsuario.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Enviando...
    `;

    try {
        const {
            error
        } = await cliente.rpc(
            "denunciar_y_bloquear_usuario",
            {
                usuario_denunciado:
                    receptorConexionId,

                motivo_denuncia:
                    motivoDenunciaUsuario.value,

                descripcion_denuncia:
                    descripcionDenunciaUsuario?.value
                        ?.trim() ||
                    null
            }
        );

        if (error) {
            throw error;
        }

        cerrarModalSeguridad(
            modalDenunciarUsuario
        );

        reiniciarFormularioDenuncia();

        actualizarPerfilBloqueado(
            "La denuncia se ha enviado correctamente y el usuario ha sido bloqueado."
        );
    } catch (error) {
        console.error(
            "No se pudo enviar la denuncia:",
            error
        );

        errorDenunciaUsuario.textContent =
            "No se ha podido enviar la denuncia. Inténtalo de nuevo.";
    } finally {
        confirmarDenunciaUsuario.disabled =
            false;

        confirmarDenunciaUsuario.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            Denunciar y bloquear
        `;
    }
}


function limitarFocoModal(
    evento,
    modal
) {
    if (
        evento.key !== "Tab" ||
        !modal?.classList.contains(
            "visible"
        )
    ) {
        return;
    }

    const controles =
        Array.from(
            modal.querySelectorAll(
                `
                    button:not([disabled]),
                    select:not([disabled]),
                    textarea:not([disabled]),
                    input:not([disabled]),
                    [tabindex]:not([tabindex="-1"])
                `
            )
        ).filter(
            (elemento) =>
                elemento.offsetParent !==
                null
        );

    if (controles.length === 0) {
        return;
    }

    const primero =
        controles[0];

    const ultimo =
        controles[
            controles.length - 1
        ];

    if (
        evento.shiftKey &&
        document.activeElement ===
            primero
    ) {
        evento.preventDefault();
        ultimo.focus();
    } else if (
        !evento.shiftKey &&
        document.activeElement ===
            ultimo
    ) {
        evento.preventDefault();
        primero.focus();
    }
}


function mostrarPerfil(
    datos
) {
    const nombre =
        datos?.nombre ||
        "Usuario de Suralia";

    nombrePerfilPublico =
        nombre;

    document.title =
        `${nombre} | Suralia`;

    const nombreElemento =
        document.querySelector(
            "#perfil-publico-nombre"
        );

    const descripcion =
        document.querySelector(
            "#perfil-publico-descripcion"
        );

    const fotoPrincipal =
        document.querySelector(
            "#perfil-publico-foto-principal"
        );

    const verificado =
        document.querySelector(
            "#perfil-publico-verificado"
        );

    if (nombreElemento) {
        nombreElemento.textContent =
            nombre;
    }

    if (descripcion) {
        descripcion.textContent =
            datos?.descripcion ||
            "Este usuario todavía no ha añadido una descripción.";
    }

    if (
        fotoPrincipal &&
        datos?.foto_principal
    ) {
        fotoPrincipal.innerHTML = `
            <img
                src="${escaparHTML(
                    datos.foto_principal
                )}"
                alt="Fotografía principal de ${escaparHTML(
                    nombre
                )}"
            >
        `;
    }

    verificado?.classList.toggle(
        "oculto",
        !datos?.verificado
    );

    mostrarDatoMeta(
        "#perfil-publico-edad",
        datos?.edad,
        `${datos.edad} años`
    );

    mostrarDatoMeta(
        "#perfil-publico-localidad",
        datos?.localidad,
        datos.localidad
    );

    mostrarDatoMeta(
        "#perfil-publico-ocupacion",
        datos?.ocupacion,
        datos.ocupacion
    );

    crearEtiquetas(
        "#perfil-publico-busca",
        datos?.busca,
        textosBusca,
        "#bloque-busca-publico"
    );

    crearEtiquetas(
        "#perfil-publico-intereses",
        datos?.intereses,
        textosIntereses,
        "#bloque-intereses-publico"
    );

    crearEtiquetas(
        "#perfil-publico-disponibilidad",
        datos?.disponibilidad,
        textosDisponibilidad,
        "#bloque-disponibilidad-publica"
    );

    mostrarGaleria(
        datos?.fotos
    );

    perfilCarga?.classList.add(
        "oculto"
    );

    perfilError?.classList.add(
        "oculto"
    );

    perfilPublico?.classList.remove(
        "oculto"
    );
}


async function cargarPerfilPublico() {
    const perfilId =
        obtenerPerfilIdURL();

    if (!perfilId) {
        mostrarError(
            "El enlace no contiene un identificador de perfil válido."
        );

        return;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        mostrarError(
            "No se ha podido conectar con Suralia."
        );

        return;
    }

    try {
        const {
            data: datosSesion,
            error: errorSesion
        } = await cliente
            .auth
            .getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        if (!datosSesion.session) {
            sessionStorage.setItem(
                "destinoDespuesLoginSuralia",
                window.location.href
            );

            window.location.replace(
                "login.html"
            );

            return;
        }

        usuarioSesionActual =
            datosSesion.session.user;

        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_perfil_publico",
            {
                perfil_buscado:
                    perfilId
            }
        );

        if (error) {
            throw error;
        }

        if (!data) {
            mostrarError(
                "Este perfil no existe o su propietario ha decidido mantenerlo oculto."
            );

            return;
        }

        /*
           La URL contiene el id de perfiles_sociales,
           pero solicitudes_conexion necesita el UUID
           real del usuario de Supabase Auth.
        */
        /*
           La URL usa perfiles_sociales.perfil_publico_id.
           La tabla solicitudes_conexion necesita
           perfiles_sociales.usuario_id.
        */
        receptorConexionId =
            data?.usuario_id ||
            "";

        if (!receptorConexionId) {
            const {
                data: perfilSocial,
                error: errorPerfilSocial
            } = await cliente
                .from("perfiles_sociales")
                .select("usuario_id")
                .eq(
                    "perfil_publico_id",
                    perfilId
                )
                .maybeSingle();

            if (errorPerfilSocial) {
                throw errorPerfilSocial;
            }

            receptorConexionId =
                perfilSocial?.usuario_id ||
                "";
        }

        if (!receptorConexionId) {
            throw new Error(
                "No se ha podido identificar al usuario propietario del perfil."
            );
        }

        mostrarPerfil(
            data
        );

        try {
            const usuarioBloqueado =
                await consultarBloqueoActual();

            if (!usuarioBloqueado) {
                await consultarEstadoConexion();
            }
        } catch (errorConexion) {
            console.error(
                "No se pudo consultar el estado de seguridad o conexión:",
                errorConexion
            );

            actualizarTarjetaConexion(
                "disponible",
                "No se ha podido consultar el estado de la conexión."
            );
        }
    } catch (error) {
        console.error(
            "No se pudo cargar el perfil público:",
            error
        );

        mostrarError(
            "No se ha podido cargar este perfil. Inténtalo de nuevo más tarde."
        );
    }
}


botonVolver?.addEventListener(
    "click",
    () => {
        if (
            window.history.length >
            1
        ) {
            window.history.back();
        } else {
            window.location.href =
                "perfil.html#afinidades";
        }
    }
);


botonBloquearUsuario?.addEventListener(
    "click",
    () => {
        const tituloModal =
            document.querySelector(
                "#titulo-modal-bloquear"
            );

        const textoModal =
            document.querySelector(
                "#texto-modal-bloquear"
            );

        const iconoModal =
            modalBloquearUsuario
                ?.querySelector(
                    ".modal-seguridad-perfil__icono i"
                );

        if (usuarioEstaBloqueado) {
            if (tituloModal) {
                tituloModal.textContent =
                    "¿Desbloquear a este usuario?";
            }

            if (textoModal) {
                textoModal.textContent =
                    `Al desbloquear a ${nombrePerfilPublico}, podréis volver a enviaros solicitudes de conexión. La conexión anterior no se recuperará automáticamente.`;
            }

            if (iconoModal) {
                iconoModal.className =
                    "fa-solid fa-user-check";
            }

            if (confirmarBloqueoUsuario) {
                confirmarBloqueoUsuario.innerHTML = `
                    <i class="fa-solid fa-user-check"></i>
                    Desbloquear usuario
                `;
            }
        } else {
            if (tituloModal) {
                tituloModal.textContent =
                    "¿Bloquear a este usuario?";
            }

            if (textoModal) {
                textoModal.textContent =
                    `Al bloquear a ${nombrePerfilPublico}, se eliminará cualquier solicitud o conexión existente y no podréis volver a conectar mientras siga bloqueado.`;
            }

            if (iconoModal) {
                iconoModal.className =
                    "fa-solid fa-user-slash";
            }

            if (confirmarBloqueoUsuario) {
                confirmarBloqueoUsuario.innerHTML = `
                    <i class="fa-solid fa-user-slash"></i>
                    Bloquear usuario
                `;
            }
        }

        abrirModalSeguridad(
            modalBloquearUsuario
        );
    }
);


cerrarModalBloquear?.addEventListener(
    "click",
    () => {
        cerrarModalSeguridad(
            modalBloquearUsuario
        );
    }
);


cancelarBloqueoUsuario?.addEventListener(
    "click",
    () => {
        cerrarModalSeguridad(
            modalBloquearUsuario
        );
    }
);


confirmarBloqueoUsuario?.addEventListener(
    "click",
    () => {
        if (usuarioEstaBloqueado) {
            desbloquearUsuarioActual();
            return;
        }

        bloquearUsuarioActual();
    }
);


botonDenunciarUsuario?.addEventListener(
    "click",
    () => {
        reiniciarFormularioDenuncia();

        abrirModalSeguridad(
            modalDenunciarUsuario
        );
    }
);


cerrarModalDenunciar?.addEventListener(
    "click",
    () => {
        cerrarModalSeguridad(
            modalDenunciarUsuario
        );

        reiniciarFormularioDenuncia();
    }
);


cancelarDenunciaUsuario?.addEventListener(
    "click",
    () => {
        cerrarModalSeguridad(
            modalDenunciarUsuario
        );

        reiniciarFormularioDenuncia();
    }
);


formularioDenunciarUsuario?.addEventListener(
    "submit",
    enviarDenunciaUsuario
);


descripcionDenunciaUsuario?.addEventListener(
    "input",
    () => {
        if (contadorDenunciaUsuario) {
            contadorDenunciaUsuario.textContent =
                String(
                    descripcionDenunciaUsuario
                        .value
                        .length
                );
        }
    }
);


modalBloquearUsuario?.addEventListener(
    "click",
    (evento) => {
        if (
            evento.target ===
            modalBloquearUsuario
        ) {
            cerrarModalSeguridad(
                modalBloquearUsuario
            );
        }
    }
);


modalDenunciarUsuario?.addEventListener(
    "click",
    (evento) => {
        if (
            evento.target ===
            modalDenunciarUsuario
        ) {
            cerrarModalSeguridad(
                modalDenunciarUsuario
            );

            reiniciarFormularioDenuncia();
        }
    }
);


cerrarModalFoto?.addEventListener(
    "click",
    cerrarFotoPublica
);


modalFoto?.addEventListener(
    "click",
    (evento) => {
        if (
            evento.target ===
            modalFoto
        ) {
            cerrarFotoPublica();
        }
    }
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key ===
                "Escape" &&
            modalBloquearUsuario?.classList.contains(
                "visible"
            )
        ) {
            cerrarModalSeguridad(
                modalBloquearUsuario
            );

            return;
        }

        if (
            evento.key ===
                "Escape" &&
            modalDenunciarUsuario?.classList.contains(
                "visible"
            )
        ) {
            cerrarModalSeguridad(
                modalDenunciarUsuario
            );

            reiniciarFormularioDenuncia();

            return;
        }

        if (
            evento.key ===
                "Escape" &&
            modalFoto?.classList.contains(
                "visible"
            )
        ) {
            cerrarFotoPublica();
            return;
        }

        limitarFocoModal(
            evento,
            modalBloquearUsuario
        );

        limitarFocoModal(
            evento,
            modalDenunciarUsuario
        );
    }
);


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        () => {
            cargarUsuarioHeaderPerfilPublico();
            cargarPerfilPublico();
        }
    );
} else {
    cargarUsuarioHeaderPerfilPublico();
    cargarPerfilPublico();
}