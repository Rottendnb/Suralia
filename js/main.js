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

const botonesFavoritosPortada =
    document.querySelectorAll(
        "#planes .tarjeta-plan__favorito"
    );


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
    botonesFavoritosPortada.forEach(
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


botonesFavoritosPortada.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();
                evento.stopPropagation();

                alternarFavoritoPortada(
                    boton
                );
            }
        );
    }
);


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
            "sierra-norte",

        titulo:
            datosPlan.titulo ||
            "Ruta de senderismo por la Sierra Norte",

        categoria:
            datosPlan.categoria ||
            "Naturaleza",

        imagen:
            datosPlan.imagen ||
            "img/sierra-norte-principal.jpg",

        fechaTexto:
            datosPlan.fechaTexto ||
            "8 de agosto de 2026",

        fechaIso:
            datosPlan.fechaIso ||
            "2026-08-08",

        ubicacion:
            datosPlan.ubicacion ||
            "Constantina, Sevilla",

        precio:
            Number(
                datosPlan.precio ??
                12
            ),

        valoracion:
            Number(
                datosPlan.valoracion ??
                4.9
            ),

        enlace:
            datosPlan.enlace ||
            "detalle-sierra-norte.html"
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
            "La ruta se ha eliminado de favoritos."
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
            "La ruta se ha guardado en favoritos."
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

    return reservas.filter(
        (reserva) => {
            return (
                reserva.planId ===
                    "sierra-norte" &&
                reserva.estado ===
                    "confirmada"
            );
        }
    );
}


function obtenerNumeroPersonasSierraNorte() {
    const personasIniciales = 24;

    const reservas =
        obtenerReservasSierraNorte();

    const personasReservadas =
        reservas.reduce(
            (total, reserva) => {
                const cantidad = Number(
                    reserva.personas ||
                    reserva.entradas ||
                    1
                );

                return (
                    total +
                    (
                        Number.isNaN(cantidad)
                            ? 0
                            : cantidad
                    )
                );
            },
            0
        );

    return (
        personasIniciales +
        personasReservadas
    );
}


function actualizarContadorSierraNorte() {
    if (!contadorPersonasSierraNorte) {
        return;
    }

    const numeroPersonas =
        obtenerNumeroPersonasSierraNorte();

    contadorPersonasSierraNorte.textContent =
        `${numeroPersonas} ${
            numeroPersonas === 1
                ? "persona"
                : "personas"
        }`;
}


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
    cargarFavoritosPortada();
    actualizarFavoritoSierraNorte();
    actualizarContadorSierraNorte();
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