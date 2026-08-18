/* =====================================================
   FUNCIONES SEGURAS DE LOCALSTORAGE
===================================================== */

function leerLocalStorage(
    clave,
    valorAlternativo = null
) {
    try {
        const contenido =
            localStorage.getItem(clave);

        if (!contenido) {
            return valorAlternativo;
        }

        return JSON.parse(contenido);
    } catch (error) {
        console.error(
            `No se pudo leer ${clave}:`,
            error
        );

        return valorAlternativo;
    }
}


function guardarLocalStorage(
    clave,
    valor
) {
    try {
        localStorage.setItem(
            clave,
            JSON.stringify(valor)
        );

        return true;
    } catch (error) {
        console.error(
            `No se pudo guardar ${clave}:`,
            error
        );

        return false;
    }
}


/* =====================================================
   CONTADOR GLOBAL DE MENSAJES NO LEÍDOS
===================================================== */

let canalMensajesHeader =
    null;

let enlaceMensajesHeader =
    null;

let contadorMensajesHeader =
    null;

let enlaceMensajesMenuUsuario =
    null;

let contadorMensajesMenuUsuario =
    null;

let enlaceMensajesMovil =
    null;

let contadorMensajesMovil =
    null;

let enlaceAdministracionMenuUsuario =
    null;

let enlaceAdministracionMovil =
    null;


function crearEnlaceMensajesHeader() {
    /*
     * La campana de notificaciones sustituye el acceso
     * "Mis mensajes" del header principal.
     *
     * Conservamos el acceso desde el menú del usuario.
     */
    if (!navegacion) {
        return null;
    }

    const enlaceExistente =
        navegacion.querySelector(
            'a.enlace-mensajes-header[href="conversaciones.html"]'
        );

    enlaceExistente?.remove();

    enlaceMensajesHeader =
        null;

    contadorMensajesHeader =
        null;

    return null;
}


function crearEnlaceMensajesMovil() {
    if (!navegacion) {
        return null;
    }

    enlaceMensajesMovil =
        navegacion.querySelector(
            ".opcion-mensajes-movil"
        );

    if (!enlaceMensajesMovil) {
        enlaceMensajesMovil =
            document.createElement(
                "a"
            );

        enlaceMensajesMovil.href =
            "conversaciones.html";

        enlaceMensajesMovil.className =
            "opcion-usuario-movil opcion-mensajes-movil";

        enlaceMensajesMovil.innerHTML = `
            <span class="opcion-mensajes-movil__contenido">
                <i
                    class="fa-regular fa-comments"
                    aria-hidden="true"
                ></i>

                <span>
                    Mis mensajes
                </span>
            </span>

            <span
                class="opcion-mensajes-movil__contador oculto"
                aria-live="polite"
            ></span>
        `;

        const botonCerrarMovil =
            navegacion.querySelector(
                "#cerrar-sesion-movil"
            );

        if (botonCerrarMovil) {
            navegacion.insertBefore(
                enlaceMensajesMovil,
                botonCerrarMovil
            );
        } else {
            navegacion.appendChild(
                enlaceMensajesMovil
            );
        }
    }

    contadorMensajesMovil =
        enlaceMensajesMovil.querySelector(
            ".opcion-mensajes-movil__contador"
        );

    return enlaceMensajesMovil;
}


function crearEnlaceMensajesMenuUsuario() {
    const desplegable =
        document.querySelector(
            "#menu-usuario-desplegable"
        );

    if (!desplegable) {
        return null;
    }

    enlaceMensajesMenuUsuario =
        desplegable.querySelector(
            ".menu-usuario__mensajes"
        );

    if (!enlaceMensajesMenuUsuario) {
        enlaceMensajesMenuUsuario =
            document.createElement(
                "a"
            );

        enlaceMensajesMenuUsuario.href =
            "conversaciones.html";

        enlaceMensajesMenuUsuario.className =
            "menu-usuario__mensajes";

        enlaceMensajesMenuUsuario.innerHTML = `
            <span class="menu-usuario__mensajes-contenido">
                <i
                    class="fa-regular fa-comments"
                    aria-hidden="true"
                ></i>

                <span>
                    Mis mensajes
                </span>
            </span>

            <span
                class="menu-usuario__mensajes-contador oculto"
                aria-live="polite"
            ></span>
        `;

        const separador =
            desplegable.querySelector(
                ".menu-usuario__separador"
            );

        if (separador) {
            desplegable.insertBefore(
                enlaceMensajesMenuUsuario,
                separador
            );
        } else {
            desplegable.appendChild(
                enlaceMensajesMenuUsuario
            );
        }
    }

    contadorMensajesMenuUsuario =
        enlaceMensajesMenuUsuario.querySelector(
            ".menu-usuario__mensajes-contador"
        );

    return enlaceMensajesMenuUsuario;
}



/* =====================================================
   ACCESO DE ADMINISTRACIÓN
===================================================== */

function eliminarEnlacesAdministracion() {
    enlaceAdministracionMenuUsuario?.remove();
    enlaceAdministracionMovil?.remove();

    enlaceAdministracionMenuUsuario =
        null;

    enlaceAdministracionMovil =
        null;
}


function crearEnlaceAdministracionMenuUsuario() {
    const desplegable =
        document.querySelector(
            "#menu-usuario-desplegable"
        );

    if (!desplegable) {
        return null;
    }

    enlaceAdministracionMenuUsuario =
        desplegable.querySelector(
            ".menu-usuario__administracion"
        );

    if (
        enlaceAdministracionMenuUsuario
    ) {
        return enlaceAdministracionMenuUsuario;
    }

    enlaceAdministracionMenuUsuario =
        document.createElement(
            "a"
        );

    enlaceAdministracionMenuUsuario.href =
        "admin.html";

    enlaceAdministracionMenuUsuario.className =
        "menu-usuario__administracion";

    enlaceAdministracionMenuUsuario.innerHTML = `
        <i
            class="fa-solid fa-shield-halved"
            aria-hidden="true"
        ></i>

        <span>
            Administración
        </span>
    `;

    const separador =
        desplegable.querySelector(
            ".menu-usuario__separador"
        );

    if (separador) {
        desplegable.insertBefore(
            enlaceAdministracionMenuUsuario,
            separador
        );
    } else {
        desplegable.appendChild(
            enlaceAdministracionMenuUsuario
        );
    }

    enlaceAdministracionMenuUsuario.addEventListener(
        "click",
        () => {
            cerrarMenuUsuario();
        }
    );

    return enlaceAdministracionMenuUsuario;
}


function crearEnlaceAdministracionMovil() {
    if (!navegacion) {
        return null;
    }

    enlaceAdministracionMovil =
        navegacion.querySelector(
            ".opcion-administracion-movil"
        );

    if (
        enlaceAdministracionMovil
    ) {
        return enlaceAdministracionMovil;
    }

    enlaceAdministracionMovil =
        document.createElement(
            "a"
        );

    enlaceAdministracionMovil.href =
        "admin.html";

    enlaceAdministracionMovil.className =
        "opcion-usuario-movil opcion-administracion-movil";

    enlaceAdministracionMovil.innerHTML = `
        <i
            class="fa-solid fa-shield-halved"
            aria-hidden="true"
        ></i>

        <span>
            Administración
        </span>
    `;

    const botonCerrarMovil =
        navegacion.querySelector(
            "#cerrar-sesion-movil"
        );

    if (botonCerrarMovil) {
        navegacion.insertBefore(
            enlaceAdministracionMovil,
            botonCerrarMovil
        );
    } else {
        navegacion.appendChild(
            enlaceAdministracionMovil
        );
    }

    enlaceAdministracionMovil.addEventListener(
        "click",
        () => {
            cerrarMenuMovil();
        }
    );

    return enlaceAdministracionMovil;
}


async function comprobarAccesoAdministracion() {
    eliminarEnlacesAdministracion();

    if (!sesionActual?.conectado) {
        return false;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente?.auth) {
        return false;
    }

    try {
        const {
            data: datosSesion,
            error: errorSesion
        } = await cliente.auth.getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        if (!datosSesion.session?.user) {
            return false;
        }

        const {
            data: esAdministrador,
            error: errorRol
        } = await cliente.rpc(
            "es_administrador"
        );

        if (errorRol) {
            throw errorRol;
        }

        if (esAdministrador !== true) {
            return false;
        }

        crearEnlaceAdministracionMenuUsuario();
        crearEnlaceAdministracionMovil();

        return true;
    } catch (error) {
        console.error(
            "No se pudo comprobar el acceso de administración:",
            error
        );

        eliminarEnlacesAdministracion();

        return false;
    }
}


function actualizarContadorMensajesHeader(
    total = 0
) {
    const cantidad =
        Number(total) ||
        0;

    const textoContador =
        cantidad > 99
            ? "99+"
            : String(cantidad);

    /*
     * Ya no mostramos "Mis mensajes" en el header principal.
     * Dejamos este bloque preparado por compatibilidad, pero
     * normalmente estas referencias estarán a null.
     */
    if (contadorMensajesHeader) {
        contadorMensajesHeader.textContent =
            textoContador;

        contadorMensajesHeader.classList.toggle(
            "oculto",
            cantidad === 0
        );
    }

    enlaceMensajesHeader?.classList.toggle(
        "enlace-mensajes-header--pendientes",
        cantidad > 0
    );

    enlaceMensajesHeader?.setAttribute(
        "aria-label",
        cantidad > 0
            ? `Mis mensajes: ${cantidad} sin leer`
            : "Mis mensajes"
    );

    /*
     * El acceso a conversaciones sigue disponible
     * dentro del menú del usuario.
     */
    if (contadorMensajesMenuUsuario) {
        contadorMensajesMenuUsuario.textContent =
            textoContador;

        contadorMensajesMenuUsuario.classList.toggle(
            "oculto",
            cantidad === 0
        );
    }

    enlaceMensajesMenuUsuario?.classList.toggle(
        "menu-usuario__mensajes--pendientes",
        cantidad > 0
    );

    enlaceMensajesMenuUsuario?.setAttribute(
        "aria-label",
        cantidad > 0
            ? `Mis mensajes: ${cantidad} sin leer`
            : "Mis mensajes"
    );

    if (contadorMensajesMovil) {
        contadorMensajesMovil.textContent =
            textoContador;

        contadorMensajesMovil.classList.toggle(
            "oculto",
            cantidad === 0
        );
    }

    enlaceMensajesMovil?.classList.toggle(
        "opcion-mensajes-movil--pendientes",
        cantidad > 0
    );

    enlaceMensajesMovil?.setAttribute(
        "aria-label",
        cantidad > 0
            ? `Mis mensajes: ${cantidad} sin leer`
            : "Mis mensajes"
    );
}


async function consultarMensajesNoLeidosHeader() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente?.auth
    ) {
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

        const usuarioSupabase =
            datosSesion.session?.user;

        if (!usuarioSupabase) {
            actualizarContadorMensajesHeader(
                0
            );

            return;
        }

        const {
            count,
            error
        } = await cliente
            .from("mensajes")
            .select(
                "id",
                {
                    count:
                        "exact",

                    head:
                        true
                }
            )
            .neq(
                "remitente_id",
                usuarioSupabase.id
            )
            .eq(
                "leido",
                false
            )
            .eq(
                "eliminado",
                false
            );

        if (error) {
            throw error;
        }

        actualizarContadorMensajesHeader(
            count ||
            0
        );
    } catch (error) {
        console.error(
            "No se pudo actualizar el contador global de mensajes:",
            error
        );
    }
}


async function iniciarContadorMensajesHeader() {
    if (
        !sesionActual?.conectado ||
        !navegacion
    ) {
        return;
    }

    crearEnlaceMensajesHeader();
    crearEnlaceMensajesMenuUsuario();

    enlaceMensajesMovil =
        navegacion.querySelector(
            ".opcion-mensajes-movil"
        );

    if (enlaceMensajesMovil) {
        enlaceMensajesMovil.remove();
        enlaceMensajesMovil =
            null;
        contadorMensajesMovil =
            null;
    }

    await consultarMensajesNoLeidosHeader();

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return;
    }

    if (canalMensajesHeader) {
        cliente.removeChannel(
            canalMensajesHeader
        );
    }

    canalMensajesHeader =
        cliente
            .channel(
                "contador-global-mensajes-suralia"
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "*",

                    schema:
                        "public",

                    table:
                        "mensajes"
                },
                consultarMensajesNoLeidosHeader
            )
            .subscribe();
}


window.addEventListener(
    "beforeunload",
    () => {
        if (
            canalMensajesHeader &&
            window.clienteSupabase
        ) {
            window.clienteSupabase.removeChannel(
                canalMensajesHeader
            );
        }
    }
);


document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            consultarMensajesNoLeidosHeader();
        }
    }
);


/* =====================================================
   MENÚ MÓVIL
===================================================== */

const botonMenu =
    document.querySelector(
        "#boton-menu"
    );

const navegacion =
    document.querySelector(
        "#navegacion"
    );


function actualizarBotonMenuMovil(
    menuAbierto
) {
    if (!botonMenu) {
        return;
    }

    botonMenu.setAttribute(
        "aria-expanded",
        String(menuAbierto)
    );

    botonMenu.setAttribute(
        "aria-label",
        menuAbierto
            ? "Cerrar menú"
            : "Abrir menú"
    );

    botonMenu.innerHTML =
        menuAbierto
            ? `
                <i
                    class="fa-solid fa-xmark"
                    aria-hidden="true"
                ></i>
            `
            : `
                <i
                    class="fa-solid fa-bars"
                    aria-hidden="true"
                ></i>
            `;
}


function cerrarMenuMovil(
    devolverFoco = false
) {
    if (
        !botonMenu ||
        !navegacion
    ) {
        return;
    }

    const estabaAbierto =
        navegacion.classList.contains(
            "activa"
        );

    navegacion.classList.remove(
        "activa"
    );

    actualizarBotonMenuMovil(
        false
    );

    if (
        devolverFoco &&
        estabaAbierto
    ) {
        botonMenu.focus();
    }
}


function abrirMenuMovil() {
    if (
        !botonMenu ||
        !navegacion
    ) {
        return;
    }

    navegacion.classList.add(
        "activa"
    );

    actualizarBotonMenuMovil(
        true
    );
}


if (
    botonMenu &&
    navegacion
) {
    actualizarBotonMenuMovil(
        navegacion.classList.contains(
            "activa"
        )
    );

    botonMenu.addEventListener(
        "click",
        (evento) => {
            evento.stopPropagation();

            const menuAbierto =
                navegacion.classList.contains(
                    "activa"
                );

            if (menuAbierto) {
                cerrarMenuMovil();
            } else {
                abrirMenuMovil();
            }
        }
    );

    navegacion.addEventListener(
        "click",
        (evento) => {
            evento.stopPropagation();
        }
    );

    navegacion
        .querySelectorAll(
            "a, button"
        )
        .forEach((elemento) => {
            elemento.addEventListener(
                "click",
                () => {
                    cerrarMenuMovil();
                }
            );
        });

    document.addEventListener(
        "click",
        () => {
            cerrarMenuMovil();
        }
    );

    window.addEventListener(
        "resize",
        () => {
            if (
                window.innerWidth >
                1050
            ) {
                cerrarMenuMovil();
            }
        }
    );
}


/* =====================================================
   SESIÓN DEL USUARIO
===================================================== */

const sesionActual =
    leerLocalStorage(
        "sesionSuralia",
        null
    );

let usuarioActual =
    leerLocalStorage(
        "usuarioSuralia",
        null
    );

const botonLogin =
    document.querySelector(
        ".boton-login"
    );

const loginMovil =
    document.querySelector(
        ".login-movil"
    );

const enlacesPublicar =
    document.querySelectorAll(
        ".enlace-publicar"
    );


/* =====================================================
   OBTENER DATOS DEL USUARIO
===================================================== */

function obtenerNombreUsuarioCabecera() {
    return (
        usuarioActual?.nombre ||
        sesionActual?.nombre ||
        "Mi perfil"
    );
}


function obtenerInicialesCabecera() {
    const nombre =
        usuarioActual?.nombre ||
        sesionActual?.nombre ||
        "";

    const apellidos =
        usuarioActual?.apellidos ||
        "";

    const inicialNombre =
        nombre.trim().charAt(0);

    const inicialApellido =
        apellidos.trim().charAt(0);

    return (
        inicialNombre +
        inicialApellido
    ).toUpperCase() || "SU";
}


function escaparAtributoHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


function escaparTextoHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



async function sincronizarAvatarCabeceraDesdeSupabase() {
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

        const usuarioSupabase =
            datosSesion.session?.user;

        if (!usuarioSupabase) {
            return;
        }

        const {
            data: perfilSocial,
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
                usuarioSupabase.id
            )
            .maybeSingle();

        if (errorPerfil) {
            throw errorPerfil;
        }

        const fotoPrincipal =
            perfilSocial?.foto_principal_url ||
            "";

        const nombreVisible =
            perfilSocial?.nombre_visible ||
            usuarioActual?.nombre ||
            sesionActual?.nombre ||
            "";

        usuarioActual = {
            ...(usuarioActual || {}),
            id:
                usuarioActual?.id ||
                usuarioSupabase.id,
            nombre:
                nombreVisible,
            email:
                usuarioActual?.email ||
                usuarioSupabase.email ||
                "",
            avatarTipo:
                fotoPrincipal
                    ? "imagen"
                    : usuarioActual?.avatarTipo || "",
            avatarValor:
                fotoPrincipal ||
                usuarioActual?.avatarValor || ""
        };

        guardarLocalStorage(
            "usuarioSuralia",
            usuarioActual
        );
    } catch (error) {
        console.error(
            "No se pudo sincronizar el avatar de la cabecera:",
            error
        );
    }
}


function obtenerAvatarCabeceraHTML() {
    const avatarTipo =
        usuarioActual?.avatarTipo;

    const avatarValor =
        usuarioActual?.avatarValor;

    if (
        avatarTipo === "imagen" &&
        avatarValor
    ) {
        return `
            <span
                class="
                    usuario-cabecera__avatar
                    usuario-cabecera__avatar--imagen
                "
                style="
                    background-image:
                    url('${escaparAtributoHTML(
                        avatarValor
                    )}')
                "
                aria-hidden="true"
            ></span>
        `;
    }

    if (
        avatarTipo === "emoji" &&
        avatarValor
    ) {
        return `
            <span
                class="usuario-cabecera__avatar"
                aria-hidden="true"
            >
                ${escaparTextoHTML(
                    avatarValor
                )}
            </span>
        `;
    }

    return `
        <span
            class="usuario-cabecera__avatar"
            aria-hidden="true"
        >
            ${escaparTextoHTML(
                obtenerInicialesCabecera()
            )}
        </span>
    `;
}


/* =====================================================
   ACTUALIZAR HEADER SEGÚN LA SESIÓN
===================================================== */

function actualizarCabeceraSesion() {
    const usuarioConectado =
        Boolean(
            sesionActual?.conectado
        );

    if (usuarioConectado) {
        const nombreUsuario =
            obtenerNombreUsuarioCabecera();

        const avatarHTML =
            obtenerAvatarCabeceraHTML();

        /* ESCRITORIO */

        if (botonLogin) {
            botonLogin.href =
                "perfil.html";

            botonLogin.classList.add(
                "usuario-cabecera"
            );

            botonLogin.setAttribute(
                "aria-label",
                `Abrir menú de usuario de ${nombreUsuario}`
            );

            botonLogin.setAttribute(
                "aria-haspopup",
                "true"
            );

            botonLogin.setAttribute(
                "aria-controls",
                "menu-usuario-desplegable"
            );

            botonLogin.innerHTML = `
                ${avatarHTML}

                <span class="usuario-cabecera__nombre">
                    ${escaparTextoHTML(
                        nombreUsuario
                    )}
                </span>

                <i
                    class="
                        fa-solid
                        fa-chevron-down
                        usuario-cabecera__flecha
                    "
                    aria-hidden="true"
                ></i>
            `;
        }

        /* MÓVIL */

        if (loginMovil) {
            loginMovil.href =
                "perfil.html";

            loginMovil.setAttribute(
                "aria-label",
                `Abrir perfil de ${nombreUsuario}`
            );

            loginMovil.innerHTML = `
                ${avatarHTML}

                <span>
                    Mi perfil
                </span>
            `;
        }

        /* PUBLICAR PLAN */

        enlacesPublicar.forEach(
            (enlace) => {
                enlace.href =
                    "publicar-plan.html";
            }
        );

        return;
    }

    /* USUARIO SIN SESIÓN */

    if (botonLogin) {
        botonLogin.href =
            "login.html";

        botonLogin.classList.remove(
            "usuario-cabecera"
        );

        botonLogin.removeAttribute(
            "aria-label"
        );

        botonLogin.removeAttribute(
            "aria-haspopup"
        );

        botonLogin.removeAttribute(
            "aria-controls"
        );

        botonLogin.setAttribute(
            "aria-expanded",
            "false"
        );

        botonLogin.textContent =
            "Iniciar sesión";
    }

    if (loginMovil) {
        loginMovil.href =
            "login.html";

        loginMovil.innerHTML = `
            <i class="fa-regular fa-user"></i>

            <span>
                Iniciar sesión
            </span>
        `;
    }

    enlacesPublicar.forEach(
        (enlace) => {
            enlace.href =
                "login.html";
        }
    );
}

/* =====================================================
   MENÚ DESPLEGABLE DEL USUARIO
===================================================== */

const contenedorMenuUsuario =
    document.querySelector(
        "#menu-usuario"
    );

const botonUsuario =
    document.querySelector(
        "#boton-usuario"
    );

const botonCerrarSesionHeader =
    document.querySelector(
        "#cerrar-sesion"
    );

const botonCerrarSesionMovil =
    document.querySelector(
        "#cerrar-sesion-movil"
    );

const opcionesUsuarioMovil =
    document.querySelectorAll(
        ".opcion-usuario-movil"
    );


function cerrarMenuUsuario(
    devolverFoco = false
) {
    if (!contenedorMenuUsuario) {
        return;
    }

    const estabaAbierto =
        contenedorMenuUsuario.classList.contains(
            "abierto"
        );

    contenedorMenuUsuario.classList.remove(
        "abierto"
    );

    botonUsuario?.setAttribute(
        "aria-expanded",
        "false"
    );

    if (
        devolverFoco &&
        estabaAbierto
    ) {
        botonUsuario?.focus();
    }
}


function alternarMenuUsuario(
    evento
) {
    if (!sesionActual?.conectado) {
        return;
    }

    evento.preventDefault();
    evento.stopPropagation();

    const menuAbierto =
        contenedorMenuUsuario?.classList.toggle(
            "abierto"
        );

    botonUsuario?.setAttribute(
        "aria-expanded",
        String(Boolean(menuAbierto))
    );
}

async function cerrarSesionSuralia() {
    try {
        if (
            window.clienteSupabase
        ) {
            const {
                error
            } =
                await window.clienteSupabase
                    .auth
                    .signOut();

            if (error) {
                console.error(
                    "Error al cerrar la sesión de Supabase:",
                    error
                );
            }
        }
    } catch (error) {
        console.error(
            "No se ha podido cerrar la sesión:",
            error
        );
    } finally {
        localStorage.removeItem(
            "sesionSuralia"
        );

        

        sessionStorage.removeItem(
            "destinoDespuesLoginSuralia"
        );

        cerrarMenuUsuario();

        window.location.replace(
            "login.html"
        );
    }
}

if (
    sesionActual?.conectado &&
    navegacion
) {
    navegacion.classList.add(
        "usuario-conectado"
    );
} else {
    opcionesUsuarioMovil.forEach(
        (opcion) => {
            opcion.remove();
        }
    );
}


if (
    botonUsuario &&
    contenedorMenuUsuario
) {
    botonUsuario.addEventListener(
        "click",
        alternarMenuUsuario
    );
}


botonCerrarSesionHeader?.addEventListener(
    "click",
    cerrarSesionSuralia
);


botonCerrarSesionMovil?.addEventListener(
    "click",
    cerrarSesionSuralia
);


document.addEventListener(
    "click",
    (evento) => {
        if (
            contenedorMenuUsuario &&
            !contenedorMenuUsuario.contains(
                evento.target
            )
        ) {
            cerrarMenuUsuario();
        }
    }
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key !== "Escape") {
            return;
        }

        const menuMovilAbierto =
            navegacion?.classList.contains(
                "activa"
            );

        const menuUsuarioAbierto =
            contenedorMenuUsuario?.classList.contains(
                "abierto"
            );

        if (menuMovilAbierto) {
            cerrarMenuMovil(
                true
            );
        }

        if (menuUsuarioAbierto) {
            cerrarMenuUsuario(
                true
            );
        }
    }
);

/* =====================================================
   BUSCADOR DE LA PORTADA
===================================================== */

const formularioBuscador =
    document.querySelector(
        "#formulario-buscador"
    );


if (formularioBuscador) {
    formularioBuscador.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const campoBusqueda =
                document.querySelector(
                    "#busqueda"
                );

            const campoFecha =
                document.querySelector(
                    "#fecha"
                );

            const busqueda =
                campoBusqueda?.value.trim() ||
                "";

            const fecha =
                campoFecha?.value ||
                "";

            if (
                !busqueda &&
                !fecha
            ) {
                mostrarNotificacionPrincipal(
                    "Escribe una búsqueda o selecciona una fecha."
                );

                return;
            }

            const parametros =
                new URLSearchParams();

            if (busqueda) {
                parametros.set(
                    "busqueda",
                    busqueda
                );
            }

            if (fecha) {
                parametros.set(
                    "fecha",
                    fecha
                );
            }

            window.location.href =
                `planes.html?${parametros.toString()}`;
        }
    );
}


/* =====================================================
   NOTIFICACIÓN
===================================================== */

const notificacionPrincipal =
    document.querySelector(
        "#notificacion"
    );

let temporizadorNotificacionPrincipal;


function mostrarNotificacionPrincipal(
    mensaje
) {
    if (!notificacionPrincipal) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionPrincipal.querySelector(
            "span"
        );

    if (texto) {
        texto.textContent =
            mensaje;
    }

    notificacionPrincipal.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacionPrincipal
    );

    temporizadorNotificacionPrincipal =
        setTimeout(() => {
            notificacionPrincipal.classList.remove(
                "visible"
            );
        }, 3000);
}


/* =====================================================
   DATOS OFICIALES DESDE EL CATÁLOGO
===================================================== */

function obtenerPlanCatalogoPortada(
    tarjeta
) {
    const planId =
        tarjeta?.dataset.planId ||
        "";

    if (
        !planId ||
        typeof window.obtenerPlanSuralia !==
            "function"
    ) {
        return null;
    }

    return window.obtenerPlanSuralia(
        planId
    );
}


function obtenerDatosCatalogoPortada(
    tarjeta
) {
    const datosCatalogo =
        obtenerPlanCatalogoPortada(
            tarjeta
        );

    return {
        planId:
            datosCatalogo?.planId ||
            tarjeta?.dataset.planId ||
            "",

        titulo:
            datosCatalogo?.titulo ||
            tarjeta?.dataset.titulo ||
            tarjeta?.dataset.nombre ||
            "",

        categoria:
            datosCatalogo?.categoriaTexto ||
            tarjeta?.dataset.categoriaTexto ||
            tarjeta?.dataset.categoria ||
            "",

        imagen:
            datosCatalogo?.imagen ||
            tarjeta?.dataset.imagen ||
            "",

        fechaTexto:
            datosCatalogo?.fechaTexto ||
            tarjeta?.dataset.fecha ||
            "",

        fechaIso:
            datosCatalogo?.fechaIso ||
            tarjeta?.dataset.fechaIso ||
            "",

        ubicacion:
            datosCatalogo?.ubicacion ||
            tarjeta?.dataset.ubicacion ||
            "",

        precio:
            Number(
                datosCatalogo?.precio ??
                tarjeta?.dataset.precio ??
                0
            ),

        valoracion:
            Number(
                datosCatalogo?.valoracion ??
                tarjeta?.dataset.valoracion ??
                0
            ),

        enlace:
            datosCatalogo?.enlace ||
            tarjeta?.dataset.enlace ||
            (
                tarjeta?.dataset.planId
                    ? `detalle-plan.html?id=${tarjeta.dataset.planId}`
                    : "planes.html"
            )
    };
}


/* =====================================================
   FAVORITOS DE LAS TARJETAS DE LA PORTADA
===================================================== */

function obtenerBotonesFavoritosPortada() {
    return document.querySelectorAll(
        "#planes .tarjeta-plan__favorito"
    );
}


function obtenerFavoritosPortada() {
    const favoritos =
        leerLocalStorage(
            "favoritosSuralia",
            []
        );

    return Array.isArray(favoritos)
        ? favoritos
        : [];
}


function obtenerDatosPlanPortada(
    tarjeta
) {
    return obtenerDatosCatalogoPortada(
        tarjeta
    );
}


function estaEnFavoritosPortada(
    planId,
    email
) {
    const favoritos =
        obtenerFavoritosPortada();

    return favoritos.some(
        (favorito) => {
            return (
                favorito.planId ===
                    planId &&
                favorito.usuarioEmail ===
                    email
            );
        }
    );
}


function actualizarCorazonPortada(
    boton,
    esFavorito
) {
    if (!boton) {
        return;
    }

    const icono =
        boton.querySelector("i");

    boton.classList.toggle(
        "favorito-activo",
        esFavorito
    );

    if (icono) {
        icono.className =
            esFavorito
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";
    }

    boton.setAttribute(
        "aria-label",
        esFavorito
            ? "Eliminar de favoritos"
            : "Añadir a favoritos"
    );
}


function cargarFavoritosPortada() {
    obtenerBotonesFavoritosPortada().forEach(
        (boton) => {
            const tarjeta =
                boton.closest(
                    ".tarjeta-plan"
                );

            if (!tarjeta) {
                return;
            }

            const planId =
                tarjeta.dataset.planId;

            const esFavorito =
                Boolean(
                    sesionActual?.conectado &&
                    planId &&
                    estaEnFavoritosPortada(
                        planId,
                        sesionActual.email
                    )
                );

            actualizarCorazonPortada(
                boton,
                esFavorito
            );
        }
    );
}


function alternarFavoritoPortada(
    boton
) {
    if (!sesionActual?.conectado) {
        sessionStorage.setItem(
            "destinoDespuesLoginSuralia",
            window.location.href
        );

        mostrarNotificacionPrincipal(
            "Debes iniciar sesión para guardar favoritos."
        );

        setTimeout(() => {
            window.location.href =
                "login.html";
        }, 1200);

        return;
    }

    const tarjeta =
        boton.closest(
            ".tarjeta-plan"
        );

    if (!tarjeta) {
        return;
    }

    const datosPlan =
        obtenerDatosPlanPortada(
            tarjeta
        );

    if (!datosPlan.planId) {
        console.error(
            "La tarjeta no tiene data-plan-id."
        );

        mostrarNotificacionPrincipal(
            "No se ha podido guardar este plan."
        );

        return;
    }

    const favoritos =
        obtenerFavoritosPortada();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlan.planId &&
                    favorito.usuarioEmail ===
                        sesionActual.email
                );
            }
        );

    let quedaGuardado;

    if (posicion !== -1) {
        favoritos.splice(
            posicion,
            1
        );

        quedaGuardado = false;

        mostrarNotificacionPrincipal(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlan,

            id:
                Date.now(),

            usuarioEmail:
                sesionActual.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacionPrincipal(
            "El plan se ha guardado en favoritos."
        );
    }

    const favoritoGuardado =
        guardarLocalStorage(
            "favoritosSuralia",
            favoritos
        );

    if (!favoritoGuardado) {
        mostrarNotificacionPrincipal(
            "No se ha podido actualizar favoritos."
        );

        return;
    }

    actualizarCorazonPortada(
        boton,
        quedaGuardado
    );
}


const gridPlanesPortada =
    document.querySelector(
        "#planes .planes__grid"
    );

gridPlanesPortada?.addEventListener(
    "click",
    (evento) => {
        const boton =
            evento.target.closest(
                ".tarjeta-plan__favorito"
            );

        if (!boton) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();

        alternarFavoritoPortada(
            boton
        );
    }
);


/* =====================================================
   PRÓXIMOS PLANES DE LA PORTADA
===================================================== */

const PLAN_PONCHO_K_SUPABASE_ID =
    "b3039583-9882-4877-ac4a-5a713393f495";

const MAXIMO_PLANES_PORTADA = 3;

const planesFijosSuralia = [
    {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.8,
        fechaTexto: "25 de julio",
        fechaIso: "2026-07-25",
        hora: "10:30",
        ubicacion: "Santiponce, Sevilla",
        imagen: "img/italica principal.jpg",
        enlace: "detalle-plan.html?id=italica"
    },
    {
        planId: "kayak-atardecer",
        titulo: "Kayak al atardecer",
        categoria: "aventura",
        categoriaTexto: "Aventura",
        precio: 18,
        valoracion: 4.9,
        fechaTexto: "27 de julio",
        fechaIso: "2026-07-27",
        hora: "19:00",
        ubicacion: "Río Guadalquivir, Sevilla",
        imagen: "img/kayak principal.jpg",
        enlace: "detalle-kayak.html"
    },
    {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 8,
        valoracion: 4.9,
        fechaTexto: "2 de agosto",
        fechaIso: "2026-08-02",
        hora: "09:00",
        ubicacion: "San Nicolás del Puerto",
        imagen: "img/cerro1.jpg",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },
    {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "gastronomia",
        categoriaTexto: "Gastronomía",
        precio: 25,
        valoracion: 4.6,
        fechaTexto: "3 de agosto",
        fechaIso: "2026-08-03",
        hora: "13:00",
        ubicacion: "Triana, Sevilla",
        imagen: "img/triana1.jpg",
        enlace: "detalle-plan.html?id=tapas-triana"
    },
    {
        planId: "sierra-norte",
        titulo: "Ruta de senderismo por la Sierra Norte",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 12,
        valoracion: 4.9,
        fechaTexto: "8 de agosto de 2026",
        fechaIso: "2026-08-08",
        hora: "09:00",
        ubicacion: "Constantina, Sevilla",
        imagen: "img/sierra-norte-principal.jpg",
        enlace: "detalle-sierra-norte.html"
    },
    {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.5,
        fechaTexto: "Hasta el 10 de agosto",
        fechaIso: "2026-08-10",
        hora: "11:00",
        ubicacion: "Centro de Sevilla",
        imagen: "img/andaluz1.jpg",
        enlace: "detalle-plan.html?id=exposicion-contemporanea"
    },
    {
        planId: "poncho-k-cartuja",
        titulo: "PONCHO K - Cartuja Center CITE",
        categoria: "musica",
        categoriaTexto: "Música",
        precio: 25,
        valoracion: 4.8,
        fechaTexto: "21 de noviembre de 2026",
        fechaIso: "2026-11-21",
        hora: "21:00",
        ubicacion: "Cartuja Center CITE, Sevilla",
        imagen: "img/poncho-k.jpg",
        enlace: "detalle-poncho-k.html"
    }
];

function obtenerFechaLocalISO() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

function planPortadaHaCaducado(fechaIso) {
    if (!fechaIso) {
        return false;
    }

    const fechaSegura = String(fechaIso).slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaSegura)) {
        return false;
    }

    return fechaSegura < obtenerFechaLocalISO();
}

function formatearPrecioPortada(precio) {
    const cantidad = Number(precio || 0);

    if (cantidad === 0) {
        return "Gratis";
    }

    return `${cantidad
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}

function crearTarjetaProximoPlanHTML(plan) {
    const planId = escaparAtributoHTML(plan.planId || "");
    const titulo = escaparTextoHTML(plan.titulo || "Actividad de Suralia");
    const categoria = escaparAtributoHTML(plan.categoria || "");
    const categoriaTexto = escaparTextoHTML(
        plan.categoriaTexto || plan.categoria || "Actividad"
    );
    const fechaTexto = escaparTextoHTML(
        plan.fechaTexto || "Fecha por confirmar"
    );
    const fechaIso = escaparAtributoHTML(plan.fechaIso || "");
    const hora = escaparTextoHTML(plan.hora || "Hora por confirmar");
    const ubicacion = escaparTextoHTML(
        plan.ubicacion || "Ubicación por confirmar"
    );
    const imagen = escaparAtributoHTML(
        plan.imagen || "img/placeholder-plan.jpg"
    );
    const enlace = escaparAtributoHTML(plan.enlace || "planes.html");
    const precio = Number(plan.precio || 0);
    const valoracion = Number(plan.valoracion || 0);

    return `
        <article
            class="tarjeta-plan"
            data-plan-id="${planId}"
            data-nombre="${escaparAtributoHTML(plan.titulo || "")}"
            data-titulo="${escaparAtributoHTML(plan.titulo || "")}"
            data-categoria="${categoria}"
            data-categoria-texto="${escaparAtributoHTML(plan.categoriaTexto || "")}"
            data-precio="${precio}"
            data-valoracion="${valoracion}"
            data-fecha="${escaparAtributoHTML(plan.fechaTexto || "")}"
            data-fecha-iso="${fechaIso}"
            data-ubicacion="${escaparAtributoHTML(plan.ubicacion || "")}"
            data-imagen="${imagen}"
            data-enlace="${enlace}"
        >
            <a
                href="${enlace}"
                class="tarjeta-plan__enlace"
                aria-label="Ver detalles de ${titulo}"
            >
                <div
                    class="tarjeta-plan__imagen"
                    style="background-image: url('${imagen}');"
                >
                    <span class="tarjeta-plan__precio">
                        ${formatearPrecioPortada(precio)}
                    </span>

                    <button
                        class="tarjeta-plan__favorito"
                        type="button"
                        aria-label="Añadir ${titulo} a favoritos"
                        aria-pressed="false"
                    >
                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="tarjeta-plan__contenido">
                    <div class="tarjeta-plan__meta">
                        <span>
                            <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                            ${fechaTexto}
                        </span>

                        <span>
                            <i class="fa-regular fa-clock" aria-hidden="true"></i>
                            ${hora}
                        </span>
                    </div>

                    <h3>${titulo}</h3>

                    <p class="tarjeta-plan__ubicacion">
                        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                        ${ubicacion}
                    </p>

                    <div class="tarjeta-plan__pie">
                        <span>${categoriaTexto}</span>

                        <strong>
                            ${
                                valoracion > 0
                                    ? `${String(valoracion).replace(".", ",")} <i class="fa-solid fa-star" aria-hidden="true"></i>`
                                    : "Nuevo"
                            }
                        </strong>
                    </div>
                </div>
            </a>
        </article>
    `;
}

function normalizarPlanSupabasePortada(plan) {
    return {
        planId: plan.id,
        titulo: plan.titulo || "Actividad de Suralia",
        categoria: plan.categoria || "",
        categoriaTexto:
            plan.nombre_categoria ||
            plan.categoria ||
            "Actividad",
        precio: Number(plan.precio || 0),
        valoracion: 0,
        fechaTexto: plan.fecha
            ? new Intl.DateTimeFormat(
                "es-ES",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(new Date(`${plan.fecha}T00:00:00`))
            : "Fecha por confirmar",
        fechaIso: plan.fecha || "",
        hora: plan.hora
            ? String(plan.hora).slice(0, 5)
            : "Hora por confirmar",
        ubicacion: plan.ubicacion || "Ubicación por confirmar",
        imagen: plan.imagen_url || "img/placeholder-plan.jpg",
        enlace: `detalle-plan.html?id=${encodeURIComponent(plan.id || "")}`
    };
}

function actualizarHeroConProximoPlan(
    plan
) {
    const tarjetaHero =
        document.querySelector(
            ".tarjeta-principal"
        );

    if (
        !tarjetaHero ||
        !plan
    ) {
        return;
    }

    const enlaceHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__enlace"
        );

    const imagenHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__imagen"
        );

    const categoriaHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__categoria"
        );

    const fechaHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__info span"
        );

    const tituloHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__info h2"
        );

    const ubicacionHero =
        tarjetaHero.querySelector(
            ".tarjeta-principal__info p"
        );

    const valoracionHero =
        document.querySelector(
            ".tarjeta-flotante--valoracion strong"
        );

    const textoValoracionHero =
        document.querySelector(
            ".tarjeta-flotante--valoracion span"
        );

    tarjetaHero.dataset.planId =
        plan.planId || "";

    tarjetaHero.dataset.titulo =
        plan.titulo || "";

    tarjetaHero.dataset.categoria =
        plan.categoria || "";

    tarjetaHero.dataset.categoriaTexto =
        plan.categoriaTexto || "";

    tarjetaHero.dataset.imagen =
        plan.imagen || "";

    tarjetaHero.dataset.fecha =
        plan.fechaTexto || "";

    tarjetaHero.dataset.fechaIso =
        plan.fechaIso || "";

    tarjetaHero.dataset.ubicacion =
        plan.ubicacion || "";

    tarjetaHero.dataset.precio =
        String(
            Number(
                plan.precio ||
                0
            )
        );

    tarjetaHero.dataset.valoracion =
        String(
            Number(
                plan.valoracion ||
                0
            )
        );

    tarjetaHero.dataset.enlace =
        plan.enlace ||
        "planes.html";

    if (enlaceHero) {
        enlaceHero.href =
            plan.enlace ||
            "planes.html";

        enlaceHero.setAttribute(
            "aria-label",
            `Ver detalles de ${
                plan.titulo ||
                "este plan"
            }`
        );
    }

    if (imagenHero) {
        imagenHero.style.backgroundImage =
            `url('${escaparAtributoHTML(
                plan.imagen ||
                "img/placeholder-plan.jpg"
            )}')`;
    }

    if (categoriaHero) {
        categoriaHero.innerHTML = `
            <i
                class="fa-solid fa-compass"
                aria-hidden="true"
            ></i>
            ${escaparTextoHTML(
                plan.categoriaTexto ||
                "Actividad"
            )}
        `;
    }

    if (fechaHero) {
        fechaHero.textContent =
            plan.fechaTexto ||
            "Fecha por confirmar";
    }

    if (tituloHero) {
        tituloHero.textContent =
            plan.titulo ||
            "Actividad de Suralia";
    }

    if (ubicacionHero) {
        ubicacionHero.innerHTML = `
            <i
                class="fa-solid fa-location-dot"
                aria-hidden="true"
            ></i>
            ${escaparTextoHTML(
                plan.ubicacion ||
                "Ubicación por confirmar"
            )}
        `;
    }

    if (valoracionHero) {
        valoracionHero.textContent =
            Number(
                plan.valoracion ||
                0
            ) > 0
                ? String(
                    plan.valoracion
                ).replace(
                    ".",
                    ","
                )
                : "Nuevo";
    }

    if (textoValoracionHero) {
        textoValoracionHero.textContent =
            Number(
                plan.valoracion ||
                0
            ) > 0
                ? "Actividad recomendada"
                : "Actividad recién publicada";
    }

    botonFavoritoSierraNorte?.setAttribute(
        "aria-label",
        `Añadir ${
            plan.titulo ||
            "este plan"
        } a favoritos`
    );
}



let planesHeroDisponibles =
    [];

let indiceHeroActual =
    -1;

let intervaloHero =
    null;

const INTERVALO_CAMBIO_HERO =
    8000;


function elegirIndiceHeroAleatorio() {
    if (
        planesHeroDisponibles.length ===
        0
    ) {
        return -1;
    }

    if (
        planesHeroDisponibles.length ===
        1
    ) {
        return 0;
    }

    let nuevoIndice =
        indiceHeroActual;

    while (
        nuevoIndice ===
        indiceHeroActual
    ) {
        nuevoIndice =
            Math.floor(
                Math.random() *
                planesHeroDisponibles.length
            );
    }

    return nuevoIndice;
}


function cambiarHeroAleatoriamente() {
    const nuevoIndice =
        elegirIndiceHeroAleatorio();

    if (
        nuevoIndice < 0
    ) {
        return;
    }

    indiceHeroActual =
        nuevoIndice;

    actualizarHeroConProximoPlan(
        planesHeroDisponibles[
            indiceHeroActual
        ]
    );

    actualizarFavoritoSierraNorte();
    actualizarContadorSierraNorte();
}


function detenerRotacionHero() {
    if (!intervaloHero) {
        return;
    }

    clearInterval(
        intervaloHero
    );

    intervaloHero =
        null;
}


function iniciarRotacionHero() {
    detenerRotacionHero();

    if (
        planesHeroDisponibles.length <=
        1
    ) {
        return;
    }

    intervaloHero =
        setInterval(
            cambiarHeroAleatoriamente,
            INTERVALO_CAMBIO_HERO
        );
}


function prepararRotacionHero() {
    const heroVisual =
        document.querySelector(
            ".hero__visual"
        );

    if (!heroVisual) {
        return;
    }

    heroVisual.addEventListener(
        "mouseenter",
        detenerRotacionHero
    );

    heroVisual.addEventListener(
        "mouseleave",
        iniciarRotacionHero
    );

    heroVisual.addEventListener(
        "focusin",
        detenerRotacionHero
    );

    heroVisual.addEventListener(
        "focusout",
        iniciarRotacionHero
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                iniciarRotacionHero();
            } else {
                detenerRotacionHero();
            }
        }
    );
}


async function cargarProximosPlanesPortada() {
    if (!gridPlanesPortada) {
        return;
    }

    let planesSupabase = [];
    const cliente = window.clienteSupabase;

    if (cliente) {
        try {
            const { data, error } = await cliente
                .from("planes")
                .select(`
                    id,
                    titulo,
                    categoria,
                    nombre_categoria,
                    fecha,
                    hora,
                    ubicacion,
                    precio,
                    imagen_url
                `)
                .eq("estado", "publicado")
                .gte("fecha", obtenerFechaLocalISO());

            if (error) {
                throw error;
            }

            planesSupabase = (
                Array.isArray(data)
                    ? data
                    : []
            )
                .filter(
                    (plan) =>
                        String(plan.id || "") !==
                        PLAN_PONCHO_K_SUPABASE_ID
                )
                .map(
                    normalizarPlanSupabasePortada
                );
        } catch (error) {
            console.error(
                "No se pudieron cargar los planes publicados para la portada:",
                error
            );
        }
    }

    const planesDisponibles = [
        ...planesFijosSuralia,
        ...planesSupabase
    ]
        .filter(
            (plan) =>
                !planPortadaHaCaducado(plan.fechaIso)
        )
        .sort(
            (planA, planB) =>
                String(planA.fechaIso).localeCompare(
                    String(planB.fechaIso)
                )
        );

    const idsIncluidos = new Set();

    const planesUnicos = planesDisponibles
        .filter((plan) => {
            const id = String(plan.planId || "");

            if (!id || idsIncluidos.has(id)) {
                return false;
            }

            idsIncluidos.add(id);
            return true;
        });

    const proximosPlanes =
        planesUnicos.slice(
            0,
            MAXIMO_PLANES_PORTADA
        );

    gridPlanesPortada.innerHTML =
        proximosPlanes
            .map(crearTarjetaProximoPlanHTML)
            .join("");

    planesHeroDisponibles =
        planesUnicos;

    indiceHeroActual =
        planesHeroDisponibles.length > 0
            ? Math.floor(
                Math.random() *
                planesHeroDisponibles.length
            )
            : -1;

    actualizarHeroConProximoPlan(
        indiceHeroActual >= 0
            ? planesHeroDisponibles[
                indiceHeroActual
            ]
            : null
    );

    cargarFavoritosPortada();
    actualizarFavoritoSierraNorte();
    actualizarContadorSierraNorte();
    iniciarRotacionHero();
}


/* =====================================================
   FAVORITO DEL HERO: SIERRA NORTE
===================================================== */

const botonFavoritoSierraNorte =
    document.querySelector(
        "#favorito-sierra-norte"
    );


function obtenerDatosSierraNorte() {
    const tarjeta =
        botonFavoritoSierraNorte?.closest(
            ".tarjeta-principal"
        );

    const datosPlan =
        obtenerDatosCatalogoPortada(
            tarjeta
        );

    return {
        id:
            Date.now(),

        planId:
            datosPlan.planId ||
            tarjeta?.dataset.planId ||
            "",

        titulo:
            datosPlan.titulo ||
            tarjeta?.dataset.titulo ||
            "Actividad de Suralia",

        categoria:
            datosPlan.categoria ||
            tarjeta?.dataset.categoriaTexto ||
            tarjeta?.dataset.categoria ||
            "Actividad",

        imagen:
            datosPlan.imagen ||
            tarjeta?.dataset.imagen ||
            "img/placeholder-plan.jpg",

        fechaTexto:
            datosPlan.fechaTexto ||
            tarjeta?.dataset.fecha ||
            "Fecha por confirmar",

        fechaIso:
            datosPlan.fechaIso ||
            tarjeta?.dataset.fechaIso ||
            "",

        ubicacion:
            datosPlan.ubicacion ||
            tarjeta?.dataset.ubicacion ||
            "Ubicación por confirmar",

        precio:
            Number(
                datosPlan.precio ??
                tarjeta?.dataset.precio ??
                0
            ),

        valoracion:
            Number(
                datosPlan.valoracion ??
                tarjeta?.dataset.valoracion ??
                0
            ),

        enlace:
            datosPlan.enlace ||
            tarjeta?.dataset.enlace ||
            "planes.html"
    };
}


function actualizarFavoritoSierraNorte() {
    if (!botonFavoritoSierraNorte) {
        return;
    }

    const datosPlan =
        obtenerDatosSierraNorte();

    const favoritos =
        obtenerFavoritosPortada();

    const estaGuardado =
        Boolean(
            sesionActual?.conectado &&
            favoritos.some(
                (favorito) => {
                    return (
                        favorito.planId ===
                            datosPlan.planId &&
                        favorito.usuarioEmail ===
                            sesionActual.email
                    );
                }
            )
        );

    actualizarCorazonPortada(
        botonFavoritoSierraNorte,
        estaGuardado
    );
}


function alternarFavoritoSierraNorte() {
    if (!sesionActual?.conectado) {
        sessionStorage.setItem(
            "destinoDespuesLoginSuralia",
            window.location.href
        );

        mostrarNotificacionPrincipal(
            "Debes iniciar sesión para guardar favoritos."
        );

        setTimeout(() => {
            window.location.href =
                "login.html";
        }, 1200);

        return;
    }

    const datosPlan =
        obtenerDatosSierraNorte();

    const favoritos =
        obtenerFavoritosPortada();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlan.planId &&
                    favorito.usuarioEmail ===
                        sesionActual.email
                );
            }
        );

    let quedaGuardado;

    if (posicion !== -1) {
        favoritos.splice(
            posicion,
            1
        );

        quedaGuardado = false;

        mostrarNotificacionPrincipal(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlan,

            usuarioEmail:
                sesionActual.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacionPrincipal(
            "El plan se ha guardado en favoritos."
        );
    }

    const favoritoGuardado =
        guardarLocalStorage(
            "favoritosSuralia",
            favoritos
        );

    if (!favoritoGuardado) {
        mostrarNotificacionPrincipal(
            "No se ha podido actualizar favoritos."
        );

        return;
    }

    actualizarCorazonPortada(
        botonFavoritoSierraNorte,
        quedaGuardado
    );
}


if (botonFavoritoSierraNorte) {
    botonFavoritoSierraNorte.addEventListener(
        "click",
        (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            alternarFavoritoSierraNorte();
        }
    );
}


/* =====================================================
   CONTADOR DE PERSONAS DE SIERRA NORTE
===================================================== */

const contadorPersonasSierraNorte =
    document.querySelector(
        "#contador-personas-sierra-norte"
    );


function obtenerReservasSierraNorte() {
    const reservas =
        leerLocalStorage(
            "reservasSuralia",
            []
        );

    if (!Array.isArray(reservas)) {
        return [];
    }

    const planActual =
        obtenerDatosSierraNorte();

    return reservas.filter(
        (reserva) => {
            return (
                reserva.planId ===
                    planActual.planId &&
                reserva.estado ===
                    "confirmada"
            );
        }
    );
}


function obtenerNumeroPersonasSierraNorte() {
    const reservas =
        obtenerReservasSierraNorte();

    return reservas.reduce(
        (total, reserva) => {
            const cantidad =
                Number(
                    reserva.personas ||
                    reserva.entradas ||
                    1
                );

            return (
                total +
                (
                    Number.isNaN(
                        cantidad
                    )
                        ? 0
                        : cantidad
                )
            );
        },
        0
    );
}


function actualizarContadorSierraNorte() {
    if (!contadorPersonasSierraNorte) {
        return;
    }

    const numeroPersonas =
        obtenerNumeroPersonasSierraNorte();

    if (numeroPersonas > 0) {
        contadorPersonasSierraNorte.textContent =
            `${numeroPersonas} ${
                numeroPersonas === 1
                    ? "persona"
                    : "personas"
            }`;

        return;
    }

    contadorPersonasSierraNorte.textContent =
        "Nuevo plan";
}



window.addEventListener(
    "beforeunload",
    detenerRotacionHero
);


/* =====================================================
   CAMBIOS DESDE OTRAS PESTAÑAS
===================================================== */

window.addEventListener(
    "storage",
    (evento) => {
        if (
            evento.key ===
            "reservasSuralia"
        ) {
            actualizarContadorSierraNorte();
        }

        if (
            evento.key ===
            "favoritosSuralia"
        ) {
            cargarFavoritosPortada();
            actualizarFavoritoSierraNorte();
        }

        if (
            evento.key ===
                "sesionSuralia" ||
            evento.key ===
                "usuarioSuralia"
        ) {
            window.location.reload();
        }
    }
);


/* =====================================================
   CARGA INICIAL
===================================================== */

async function iniciarPaginaPrincipal() {
    if (
        typeof window.obtenerPlanSuralia !==
        "function"
    ) {
        console.warn(
            "No se ha cargado js/datos-planes.js. Se usarán los datos del HTML."
        );
    }

    await sincronizarAvatarCabeceraDesdeSupabase();

    actualizarCabeceraSesion();
    await comprobarAccesoAdministracion();
    await iniciarContadorMensajesHeader();
    prepararRotacionHero();
    await cargarProximosPlanesPortada();
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPaginaPrincipal
    );
} else {
    iniciarPaginaPrincipal();
}
/* =====================================================
   NOTIFICACIONES GLOBALES DE SURALIA
   Carga js/notificaciones.js automáticamente en todas
   las páginas que ya utilizan js/main.js
===================================================== */

(function cargarNotificacionesGlobales() {
    function insertarScriptNotificaciones() {
        const yaExiste =
            Array.from(
                document.scripts
            ).some(
                (script) => {
                    const src =
                        script.getAttribute(
                            "src"
                        ) || "";

                    return (
                        src ===
                            "js/notificaciones.js" ||
                        src.endsWith(
                            "/js/notificaciones.js"
                        )
                    );
                }
            );

        if (yaExiste) {
            return;
        }

        const script =
            document.createElement(
                "script"
            );

        script.src =
            "js/notificaciones.js";

        script.defer =
            true;

        script.dataset.suraliaNotificaciones =
            "true";

        document.body.appendChild(
            script
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            insertarScriptNotificaciones,
            {
                once:
                    true
            }
        );
    } else {
        insertarScriptNotificaciones();
    }
})();