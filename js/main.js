/* =====================================================
   MENÚ MÓVIL
===================================================== */

const botonMenu = document.querySelector("#boton-menu");
const navegacion = document.querySelector("#navegacion");

if (botonMenu && navegacion) {
    botonMenu.addEventListener("click", () => {
        const menuAbierto =
            navegacion.classList.toggle("activa");

        botonMenu.setAttribute(
            "aria-expanded",
            String(menuAbierto)
        );

        botonMenu.innerHTML = menuAbierto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navegacion
        .querySelectorAll("a")
        .forEach((enlace) => {
            enlace.addEventListener("click", () => {
                navegacion.classList.remove("activa");

                botonMenu.setAttribute(
                    "aria-expanded",
                    "false"
                );

                botonMenu.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';
            });
        });
}


/* =====================================================
   SESIÓN DEL USUARIO
===================================================== */

const sesionActual = JSON.parse(
    localStorage.getItem("sesionSuralia")
);

const botonLogin = document.querySelector(
    ".boton-login"
);

const loginMovil = document.querySelector(
    ".login-movil"
);

const enlacesPublicar = document.querySelectorAll(
    ".enlace-publicar"
);

if (sesionActual?.conectado) {
    if (botonLogin) {
        botonLogin.href = "perfil.html";

        botonLogin.innerHTML = `
            <i class="fa-regular fa-user"></i>
            ${sesionActual.nombre}
        `;
    }

    if (loginMovil) {
        loginMovil.href = "perfil.html";

        loginMovil.innerHTML = `
            <i class="fa-regular fa-user"></i>
            Mi perfil
        `;
    }

    enlacesPublicar.forEach((enlace) => {
        enlace.href = "publicar-plan.html";
    });
} else {
    enlacesPublicar.forEach((enlace) => {
        enlace.href = "login.html";
    });
}


/* =====================================================
   BUSCADOR DE LA PORTADA
===================================================== */

const formularioBuscador = document.querySelector(
    "#formulario-buscador"
);

if (formularioBuscador) {
    formularioBuscador.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const campoBusqueda =
                document.querySelector("#busqueda");

            const campoFecha =
                document.querySelector("#fecha");

            const busqueda =
                campoBusqueda?.value.trim() || "";

            const fecha =
                campoFecha?.value || "";

            if (!busqueda && !fecha) {
                alert(
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
   NOTIFICACIÓN DE LA PORTADA
===================================================== */

const notificacionPrincipal =
    document.querySelector(
        "#notificacion"
    );

let temporizadorNotificacionPrincipal;

function mostrarNotificacionPrincipal(mensaje) {
    if (!notificacionPrincipal) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionPrincipal.querySelector(
            "span"
        );

    if (texto) {
        texto.textContent = mensaje;
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
        ".tarjeta-plan__favorito"
    );

function obtenerFavoritosPortada() {
    return JSON.parse(
        localStorage.getItem(
            "favoritosSuralia"
        )
    ) || [];
}


function obtenerDatosPlanPortada(tarjeta) {
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

        ubicacion:
            tarjeta.dataset.ubicacion,

        precio:
            Number(
                tarjeta.dataset.precio || 0
            ),

        valoracion:
            Number(
                tarjeta.dataset.valoracion || 0
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

    return favoritos.some((favorito) => {
        return (
            favorito.planId === planId &&
            favorito.usuarioEmail === email
        );
    });
}


function actualizarCorazonPortada(
    boton,
    esFavorito
) {
    const icono =
        boton.querySelector("i");

    boton.classList.toggle(
        "favorito-activo",
        esFavorito
    );

    if (icono) {
        icono.className = esFavorito
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

            const esFavorito = Boolean(
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


function alternarFavoritoPortada(boton) {
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
        boton.closest(".tarjeta-plan");

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

    localStorage.setItem(
        "favoritosSuralia",
        JSON.stringify(favoritos)
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
   FAVORITO DE LA TARJETA PRINCIPAL
===================================================== */

const botonFavoritoPrincipal =
    document.querySelector(
        ".boton-favorito"
    );

if (botonFavoritoPrincipal) {
    botonFavoritoPrincipal.addEventListener(
        "click",
        (evento) => {
            evento.preventDefault();

            const icono =
                botonFavoritoPrincipal.querySelector(
                    "i"
                );

            const estaGuardado =
                icono?.classList.contains(
                    "fa-solid"
                );

            if (icono) {
                icono.className = estaGuardado
                    ? "fa-regular fa-heart"
                    : "fa-solid fa-heart";
            }

            botonFavoritoPrincipal.classList.toggle(
                "favorito-activo",
                !estaGuardado
            );
        }
    );
}


/* =====================================================
   CARGA INICIAL
===================================================== */

cargarFavoritosPortada();