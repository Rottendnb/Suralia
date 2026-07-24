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


if (
    botonMenu &&
    navegacion
) {
    botonMenu.addEventListener(
        "click",
        () => {
            const menuAbierto =
                navegacion.classList.toggle(
                    "activa"
                );

            botonMenu.setAttribute(
                "aria-expanded",
                String(menuAbierto)
            );

            botonMenu.innerHTML =
                menuAbierto
                    ? '<i class="fa-solid fa-xmark"></i>'
                    : '<i class="fa-solid fa-bars"></i>';
        }
    );

    navegacion
        .querySelectorAll("a")
        .forEach((enlace) => {
            enlace.addEventListener(
                "click",
                () => {
                    navegacion.classList.remove(
                        "activa"
                    );

                    botonMenu.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    botonMenu.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';
                }
            );
        });
}


/* =====================================================
   SESIÓN DEL USUARIO
===================================================== */

const sesionActual =
    leerLocalStorage(
        "sesionSuralia",
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


function actualizarCabeceraSesion() {
    if (sesionActual?.conectado) {
        if (botonLogin) {
            botonLogin.href =
                "perfil.html";

            botonLogin.innerHTML = `
                <i class="fa-regular fa-user"></i>
                ${sesionActual.nombre || "Mi perfil"}
            `;
        }

        if (loginMovil) {
            loginMovil.href =
                "perfil.html";

            loginMovil.innerHTML = `
                <i class="fa-regular fa-user"></i>
                Mi perfil
            `;
        }

        enlacesPublicar.forEach(
            (enlace) => {
                enlace.href =
                    "publicar-plan.html";
            }
        );
    } else {
        enlacesPublicar.forEach(
            (enlace) => {
                enlace.href =
                    "login.html";
            }
        );
    }
}


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
    return {
        planId:
            tarjeta.dataset.planId,

        titulo:
            tarjeta.dataset.titulo ||
            tarjeta.dataset.nombre,

        categoria:
            tarjeta.dataset.categoriaTexto ||
            tarjeta.dataset.categoria,

        imagen:
            tarjeta.dataset.imagen,

        fechaTexto:
            tarjeta.dataset.fecha,

        fechaIso:
            tarjeta.dataset.fechaIso,

        ubicacion:
            tarjeta.dataset.ubicacion,

        precio:
            Number(
                tarjeta.dataset.precio ||
                0
            ),

        valoracion:
            Number(
                tarjeta.dataset.valoracion ||
                0
            ),

        enlace:
            tarjeta.dataset.enlace ||
            "detalle-plan.html"
    };
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

    guardarLocalStorage(
        "favoritosSuralia",
        favoritos
    );

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

    return {
        id:
            Date.now(),

        planId:
            tarjeta?.dataset.planId ||
            "sierra-norte",

        titulo:
            tarjeta?.dataset.titulo ||
            "Ruta por la Sierra Norte",

        categoria:
            tarjeta?.dataset.categoria ||
            "Naturaleza",

        imagen:
            tarjeta?.dataset.imagen ||
            "img/sierra-norte-nueva.png",

        fechaTexto:
            tarjeta?.dataset.fecha ||
            "Este sábado",

        ubicacion:
            tarjeta?.dataset.ubicacion ||
            "Constantina, Sevilla",

        precio:
            Number(
                tarjeta?.dataset.precio ||
                0
            ),

        valoracion:
            Number(
                tarjeta?.dataset.valoracion ||
                4.9
            ),

        enlace:
            tarjeta?.dataset.enlace ||
            "planes.html?busqueda=Naturaleza"
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

    guardarLocalStorage(
        "favoritosSuralia",
        favoritos
    );

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


/*
    Si las reservas cambian desde otra pestaña,
    el contador se actualiza automáticamente.
*/

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
    }
);


/* =====================================================
   CARGA INICIAL
===================================================== */

function iniciarPaginaPrincipal() {
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