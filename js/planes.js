/* =====================================================
   ELEMENTOS DE LOS FILTROS
===================================================== */

const formularioFiltros = document.querySelector(
    "#formulario-filtros"
);

const filtroTexto = document.querySelector(
    "#filtro-texto"
);

const filtroCategoria = document.querySelector(
    "#filtro-categoria"
);

const filtroPrecio = document.querySelector(
    "#filtro-precio"
);

const filtroOrden = document.querySelector(
    "#filtro-orden"
);

const botonLimpiar = document.querySelector(
    "#boton-limpiar"
);

const botonRestablecer = document.querySelector(
    "#boton-restablecer"
);

const listaPlanes = document.querySelector(
    "#lista-planes"
);

const planes = Array.from(
    document.querySelectorAll(
        "#lista-planes .tarjeta-plan"
    )
);

const numeroResultados = document.querySelector(
    "#numero-resultados"
);

const sinResultados = document.querySelector(
    "#sin-resultados"
);

let fechaBuscadaDesdePortada = "";


/* =====================================================
   NOTIFICACIONES
===================================================== */

const notificacionPlanes = document.querySelector(
    "#notificacion"
);

let temporizadorNotificacionPlanes;

function mostrarNotificacion(mensaje) {
    if (!notificacionPlanes) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionPlanes.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPlanes.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacionPlanes
    );

    temporizadorNotificacionPlanes = setTimeout(
        () => {
            notificacionPlanes.classList.remove(
                "visible"
            );
        },
        3000
    );
}


/* =====================================================
   PARÁMETROS RECIBIDOS DESDE INDEX.HTML
===================================================== */

function obtenerParametrosBusqueda() {
    const parametros = new URLSearchParams(
        window.location.search
    );

    return {
        busqueda:
            parametros.get("busqueda") || "",

        fecha:
            parametros.get("fecha") || ""
    };
}


function aplicarParametrosIniciales() {
    const parametros =
        obtenerParametrosBusqueda();

    if (
        parametros.busqueda &&
        filtroTexto
    ) {
        filtroTexto.value =
            parametros.busqueda;
    }

    fechaBuscadaDesdePortada =
        parametros.fecha;
}


/* =====================================================
   FILTROS
===================================================== */

function normalizarTexto(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


function cumpleFiltroPrecio(
    precio,
    filtro
) {
    if (filtro === "gratis") {
        return precio === 0;
    }

    if (filtro === "menos-20") {
        return precio > 0 && precio < 20;
    }

    if (filtro === "mas-20") {
        return precio >= 20;
    }

    return true;
}


function ordenarPlanes(
    planesVisibles
) {
    const orden =
        filtroOrden?.value ||
        "recomendados";

    return planesVisibles.sort(
        (planA, planB) => {
            const precioA = Number(
                planA.dataset.precio || 0
            );

            const precioB = Number(
                planB.dataset.precio || 0
            );

            const valoracionA = Number(
                planA.dataset.valoracion || 0
            );

            const valoracionB = Number(
                planB.dataset.valoracion || 0
            );

            if (orden === "precio-menor") {
                return precioA - precioB;
            }

            if (orden === "precio-mayor") {
                return precioB - precioA;
            }

            if (orden === "valoracion") {
                return valoracionB - valoracionA;
            }

            return 0;
        }
    );
}


function aplicarFiltros() {
    if (
        !filtroTexto ||
        !filtroCategoria ||
        !filtroPrecio ||
        !listaPlanes
    ) {
        return;
    }

    const textoBuscado = normalizarTexto(
        filtroTexto.value.trim()
    );

    const categoriaSeleccionada =
        filtroCategoria.value;

    const precioSeleccionado =
        filtroPrecio.value;

    let planesVisibles = planes.filter(
        (plan) => {
            const nombre = normalizarTexto(
                plan.dataset.nombre || ""
            );

            const titulo = normalizarTexto(
                plan.dataset.titulo || ""
            );

            const ubicacion = normalizarTexto(
                plan.dataset.ubicacion || ""
            );

            const categoriaTexto =
                normalizarTexto(
                    plan.dataset.categoriaTexto || ""
                );

            const categoria =
                plan.dataset.categoria || "";

            const precio = Number(
                plan.dataset.precio || 0
            );

            const fechaIso =
                plan.dataset.fechaIso || "";

            const coincideTexto =
                !textoBuscado ||
                nombre.includes(textoBuscado) ||
                titulo.includes(textoBuscado) ||
                ubicacion.includes(textoBuscado) ||
                categoriaTexto.includes(
                    textoBuscado
                );

            const coincideCategoria =
                categoriaSeleccionada ===
                    "todas" ||
                categoria ===
                    categoriaSeleccionada;

            const coincidePrecio =
                cumpleFiltroPrecio(
                    precio,
                    precioSeleccionado
                );

            const coincideFecha =
                !fechaBuscadaDesdePortada ||
                fechaIso ===
                    fechaBuscadaDesdePortada;

            return (
                coincideTexto &&
                coincideCategoria &&
                coincidePrecio &&
                coincideFecha
            );
        }
    );

    planes.forEach((plan) => {
        plan.style.display = "none";
    });

    planesVisibles =
        ordenarPlanes(planesVisibles);

    planesVisibles.forEach((plan) => {
        plan.style.display = "block";
        listaPlanes.appendChild(plan);
    });

    if (numeroResultados) {
        numeroResultados.textContent =
            planesVisibles.length;
    }

    if (sinResultados) {
        sinResultados.classList.toggle(
            "visible",
            planesVisibles.length === 0
        );
    }
}


function limpiarFiltros() {
    if (filtroTexto) {
        filtroTexto.value = "";
    }

    if (filtroCategoria) {
        filtroCategoria.value = "todas";
    }

    if (filtroPrecio) {
        filtroPrecio.value = "todos";
    }

    if (filtroOrden) {
        filtroOrden.value =
            "recomendados";
    }

    fechaBuscadaDesdePortada = "";

    window.history.replaceState(
        {},
        "",
        window.location.pathname
    );

    aplicarFiltros();
}


/* =====================================================
   EVENTOS DE LOS FILTROS
===================================================== */

/*
    El formulario se ejecuta al pulsar el botón Buscar
    o al pulsar Enter dentro del campo de búsqueda.
*/

if (formularioFiltros) {
    formularioFiltros.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            fechaBuscadaDesdePortada = "";

            window.history.replaceState(
                {},
                "",
                window.location.pathname
            );

            aplicarFiltros();
        }
    );
}


/*
    La ordenación continúa reaccionando inmediatamente,
    sin necesidad de pulsar Buscar.
*/

if (filtroOrden) {
    filtroOrden.addEventListener(
        "change",
        aplicarFiltros
    );
}


if (botonLimpiar) {
    botonLimpiar.addEventListener(
        "click",
        limpiarFiltros
    );
}


if (botonRestablecer) {
    botonRestablecer.addEventListener(
        "click",
        limpiarFiltros
    );
}


/* =====================================================
   FAVORITOS DESDE EL LISTADO
===================================================== */

const botonesFavoritosPlanes =
    document.querySelectorAll(
        ".tarjeta-plan__favorito"
    );


function obtenerSesionPlanes() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "sesionSuralia"
            )
        );
    } catch (error) {
        console.error(
            "No se pudo leer la sesión:",
            error
        );

        return null;
    }
}


function obtenerFavoritosPlanes() {
    try {
        const favoritos = JSON.parse(
            localStorage.getItem(
                "favoritosSuralia"
            )
        );

        return Array.isArray(favoritos)
            ? favoritos
            : [];
    } catch (error) {
        console.error(
            "No se pudieron leer los favoritos:",
            error
        );

        return [];
    }
}


function obtenerDatosTarjeta(
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


function tarjetaEstaEnFavoritos(
    planId,
    email
) {
    const favoritos =
        obtenerFavoritosPlanes();

    return favoritos.some(
        (favorito) => {
            return (
                favorito.planId === planId &&
                favorito.usuarioEmail === email
            );
        }
    );
}


function actualizarBotonFavoritoTarjeta(
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


function cargarEstadoFavoritosTarjetas() {
    const sesion =
        obtenerSesionPlanes();

    botonesFavoritosPlanes.forEach(
        (boton) => {
            const tarjeta = boton.closest(
                ".tarjeta-plan"
            );

            if (!tarjeta) {
                return;
            }

            const planId =
                tarjeta.dataset.planId;

            const esFavorito = Boolean(
                sesion?.conectado &&
                planId &&
                tarjetaEstaEnFavoritos(
                    planId,
                    sesion.email
                )
            );

            actualizarBotonFavoritoTarjeta(
                boton,
                esFavorito
            );
        }
    );
}


function alternarFavoritoTarjeta(
    boton
) {
    const sesion =
        obtenerSesionPlanes();

    if (!sesion?.conectado) {
        mostrarNotificacion(
            "Debes iniciar sesión para guardar favoritos."
        );

        setTimeout(() => {
            window.location.href =
                "login.html";
        }, 1200);

        return;
    }

    const tarjeta = boton.closest(
        ".tarjeta-plan"
    );

    if (!tarjeta) {
        return;
    }

    const datosPlan =
        obtenerDatosTarjeta(tarjeta);

    if (!datosPlan.planId) {
        console.error(
            "La tarjeta no tiene data-plan-id."
        );

        mostrarNotificacion(
            "No se ha podido guardar este plan."
        );

        return;
    }

    const favoritos =
        obtenerFavoritosPlanes();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlan.planId &&
                    favorito.usuarioEmail ===
                        sesion.email
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

        mostrarNotificacion(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlan,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacion(
            "El plan se ha guardado en favoritos."
        );
    }

    localStorage.setItem(
        "favoritosSuralia",
        JSON.stringify(favoritos)
    );

    actualizarBotonFavoritoTarjeta(
        boton,
        quedaGuardado
    );
}


botonesFavoritosPlanes.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();
                evento.stopPropagation();

                alternarFavoritoTarjeta(
                    boton
                );
            }
        );
    }
);


/* =====================================================
   CARGA INICIAL
===================================================== */

aplicarParametrosIniciales();
aplicarFiltros();
cargarEstadoFavoritosTarjetas();