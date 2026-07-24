/* =====================================================
   DATOS DEL PLAN
===================================================== */

const datosPlanPonchoK = {
    planId:
        document.body.dataset.planId ||
        "poncho-k-cartuja",

    titulo:
        document.body.dataset.planTitulo ||
        "PONCHO K - Cartuja Center CITE",

    categoria:
        document.body.dataset.planCategoria ||
        "Música",

    imagen:
        document.body.dataset.planImagen ||
        "img/poncho-k.jpg",

    precio:
        Number(
            document.body.dataset.planPrecio || 25
        ),

    valoracion:
        Number(
            document.body.dataset.planValoracion || 4.8
        ),

    fechaTexto:
        document.body.dataset.planFecha ||
        "21 de noviembre de 2026",

    ubicacion:
        document.body.dataset.planUbicacion ||
        "Cartuja Center CITE, Sevilla",

    enlace:
        document.body.dataset.planEnlace ||
        "detalle-poncho-k.html"
};


/* =====================================================
   ELEMENTOS DE LA PÁGINA
===================================================== */

const botonLeerMas = document.querySelector(
    "#boton-leer-mas"
);

const descripcionAmpliada = document.querySelector(
    "#descripcion-ampliada"
);

const botonCompartir = document.querySelector(
    "#boton-compartir"
);

const botonFavoritoPlan = document.querySelector(
    "#boton-favorito-plan"
);

const formularioReserva = document.querySelector(
    "#formulario-reserva"
);

const fechaReserva = document.querySelector(
    "#fecha-reserva"
);

const personasReserva = document.querySelector(
    "#personas-reserva"
);

const numeroPersonasDesglose =
    document.querySelector(
        "#numero-personas-desglose"
    );

const precioActividad = document.querySelector(
    "#precio-actividad"
);

const precioTotal = document.querySelector(
    "#precio-total"
);

const modalImagen = document.querySelector(
    "#modal-imagen"
);

const imagenModal = document.querySelector(
    "#imagen-modal"
);

const cerrarModalImagen = document.querySelector(
    "#cerrar-modal-imagen"
);

const botonesGaleria = document.querySelectorAll(
    ".galeria-plan button[data-imagen]"
);

const notificacion = document.querySelector(
    "#notificacion"
);

let temporizadorNotificacion;


/* =====================================================
   LOCALSTORAGE
===================================================== */

function leerLocalStorage(clave, valorAlternativo) {
    try {
        const contenido = localStorage.getItem(clave);

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


function obtenerSesion() {
    return leerLocalStorage(
        "sesionSuralia",
        null
    );
}


function obtenerFavoritos() {
    const favoritos = leerLocalStorage(
        "favoritosSuralia",
        []
    );

    return Array.isArray(favoritos)
        ? favoritos
        : [];
}


function obtenerReservas() {
    const reservas = leerLocalStorage(
        "reservasSuralia",
        []
    );

    return Array.isArray(reservas)
        ? reservas
        : [];
}


function guardarFavoritos(favoritos) {
    localStorage.setItem(
        "favoritosSuralia",
        JSON.stringify(favoritos)
    );
}


function guardarReservas(reservas) {
    localStorage.setItem(
        "reservasSuralia",
        JSON.stringify(reservas)
    );
}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(mensaje) {
    if (!notificacion) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacion.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacion.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacion
    );

    temporizadorNotificacion = setTimeout(
        () => {
            notificacion.classList.remove(
                "visible"
            );
        },
        3000
    );
}


/* =====================================================
   LEER DESCRIPCIÓN COMPLETA
===================================================== */

if (
    botonLeerMas &&
    descripcionAmpliada
) {
    botonLeerMas.addEventListener(
        "click",
        () => {
            const estaVisible =
                descripcionAmpliada.classList.toggle(
                    "visible"
                );

            botonLeerMas.innerHTML =
                estaVisible
                    ? `
                        Mostrar menos
                        <i class="fa-solid fa-chevron-up"></i>
                    `
                    : `
                        Leer descripción completa
                        <i class="fa-solid fa-chevron-down"></i>
                    `;
        }
    );
}


/* =====================================================
   GALERÍA DE IMÁGENES
===================================================== */

function abrirModalImagen(rutaImagen) {
    if (
        !modalImagen ||
        !imagenModal ||
        !rutaImagen
    ) {
        return;
    }

    imagenModal.src = rutaImagen;

    modalImagen.classList.add(
        "visible"
    );

    document.body.style.overflow =
        "hidden";
}


function cerrarGaleria() {
    if (!modalImagen) {
        return;
    }

    modalImagen.classList.remove(
        "visible"
    );

    document.body.style.overflow =
        "";

    if (imagenModal) {
        imagenModal.src = "";
    }
}


botonesGaleria.forEach((boton) => {
    boton.addEventListener(
        "click",
        () => {
            abrirModalImagen(
                boton.dataset.imagen
            );
        }
    );
});


if (cerrarModalImagen) {
    cerrarModalImagen.addEventListener(
        "click",
        cerrarGaleria
    );
}


if (modalImagen) {
    modalImagen.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalImagen
            ) {
                cerrarGaleria();
            }
        }
    );
}


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Escape" &&
            modalImagen?.classList.contains(
                "visible"
            )
        ) {
            cerrarGaleria();
        }
    }
);


/* =====================================================
   COMPARTIR
===================================================== */

async function copiarEnlace() {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(
            window.location.href
        );

        return;
    }

    const campoTemporal =
        document.createElement("textarea");

    campoTemporal.value =
        window.location.href;

    campoTemporal.style.position =
        "fixed";

    campoTemporal.style.opacity =
        "0";

    document.body.appendChild(
        campoTemporal
    );

    campoTemporal.select();

    document.execCommand("copy");

    campoTemporal.remove();
}


if (botonCompartir) {
    botonCompartir.addEventListener(
        "click",
        async () => {
            const informacion = {
                title:
                    datosPlanPonchoK.titulo,

                text:
                    `Descubre ${datosPlanPonchoK.titulo} en Suralia.`,

                url:
                    window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(
                        informacion
                    );

                    mostrarNotificacion(
                        "Plan compartido correctamente."
                    );

                    return;
                }

                await copiarEnlace();

                mostrarNotificacion(
                    "Enlace copiado al portapapeles."
                );
            } catch (error) {
                if (
                    error.name !==
                    "AbortError"
                ) {
                    console.error(
                        "No se pudo compartir:",
                        error
                    );

                    mostrarNotificacion(
                        "No se ha podido compartir el plan."
                    );
                }
            }
        }
    );
}


/* =====================================================
   FAVORITOS
===================================================== */

function planEstaEnFavoritos(
    planId,
    email
) {
    const favoritos =
        obtenerFavoritos();

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


function actualizarBotonFavorito(
    esFavorito
) {
    if (!botonFavoritoPlan) {
        return;
    }

    const icono =
        botonFavoritoPlan.querySelector(
            "i"
        );

    const texto =
        botonFavoritoPlan.querySelector(
            "span"
        );

    botonFavoritoPlan.classList.toggle(
        "favorito-activo",
        esFavorito
    );

    if (icono) {
        icono.className =
            esFavorito
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";
    }

    if (texto) {
        texto.textContent =
            esFavorito
                ? "Guardado"
                : "Guardar";
    }

    botonFavoritoPlan.setAttribute(
        "aria-label",
        esFavorito
            ? "Eliminar plan de favoritos"
            : "Añadir plan a favoritos"
    );
}


function cargarEstadoFavorito() {
    const sesion =
        obtenerSesion();

    const esFavorito = Boolean(
        sesion?.conectado &&
        planEstaEnFavoritos(
            datosPlanPonchoK.planId,
            sesion.email
        )
    );

    actualizarBotonFavorito(
        esFavorito
    );
}


function alternarFavorito() {
    const sesion =
        obtenerSesion();

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

    const favoritos =
        obtenerFavoritos();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlanPonchoK.planId &&
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
            "El concierto se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlanPonchoK,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacion(
            "El concierto se ha guardado en favoritos."
        );
    }

    guardarFavoritos(
        favoritos
    );

    actualizarBotonFavorito(
        quedaGuardado
    );
}


if (botonFavoritoPlan) {
    botonFavoritoPlan.addEventListener(
        "click",
        alternarFavorito
    );
}


/* =====================================================
   CÁLCULO DEL PRECIO
===================================================== */

function actualizarPrecioReserva() {
    if (!personasReserva) {
        return;
    }

    const numeroEntradas = Number(
        personasReserva.value || 1
    );

    const total =
        numeroEntradas *
        datosPlanPonchoK.precio;

    if (numeroPersonasDesglose) {
        numeroPersonasDesglose.textContent =
            numeroEntradas;
    }

    if (precioActividad) {
        precioActividad.textContent =
            `${total} €`;
    }

    if (precioTotal) {
        precioTotal.textContent =
            `${total} €`;
    }
}


if (personasReserva) {
    personasReserva.addEventListener(
        "change",
        actualizarPrecioReserva
    );
}


/* =====================================================
   RESERVAS
===================================================== */

function obtenerTextoSeleccionado(select) {
    if (!select) {
        return "";
    }

    return (
        select.options[
            select.selectedIndex
        ]?.textContent.trim() || ""
    );
}


function existeReserva(
    reservas,
    email,
    planId,
    fechaValor
) {
    return reservas.some(
        (reserva) => {
            return (
                reserva.usuarioEmail ===
                    email &&
                reserva.planId ===
                    planId &&
                reserva.fechaValor ===
                    fechaValor &&
                reserva.estado !==
                    "cancelada"
            );
        }
    );
}


if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const sesion =
                obtenerSesion();

            if (!sesion?.conectado) {
                mostrarNotificacion(
                    "Debes iniciar sesión para reservar entradas."
                );

                setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1200);

                return;
            }

            const fechaValor =
                fechaReserva?.value || "";

            const fechaTexto =
                obtenerTextoSeleccionado(
                    fechaReserva
                );

            const entradas = Number(
                personasReserva?.value || 1
            );

            const total =
                entradas *
                datosPlanPonchoK.precio;

            const reservas =
                obtenerReservas();

            if (
                existeReserva(
                    reservas,
                    sesion.email,
                    datosPlanPonchoK.planId,
                    fechaValor
                )
            ) {
                mostrarNotificacion(
                    "Ya tienes una reserva para este concierto."
                );

                return;
            }

            const nuevaReserva = {
                id:
                    Date.now(),

                planId:
                    datosPlanPonchoK.planId,

                titulo:
                    datosPlanPonchoK.titulo,

                categoria:
                    datosPlanPonchoK.categoria,

                imagen:
                    datosPlanPonchoK.imagen,

                ubicacion:
                    datosPlanPonchoK.ubicacion,

                enlace:
                    datosPlanPonchoK.enlace,

                precioUnitario:
                    datosPlanPonchoK.precio,

                personas:
                    entradas,

                entradas,

                precioTotal:
                    total,

                fechaValor,

                fechaTexto,

                hora:
                    "21:00",

                estado:
                    "confirmada",

                usuarioEmail:
                    sesion.email,

                fechaReserva:
                    new Date().toISOString()
            };

            reservas.push(
                nuevaReserva
            );

            guardarReservas(
                reservas
            );

            mostrarNotificacion(
                "Entradas reservadas correctamente."
            );

            formularioReserva.reset();

            actualizarPrecioReserva();
        }
    );
}


/* =====================================================
   MAPA DE CARTUJA CENTER CITE
===================================================== */

function crearMapaPonchoK() {
    const contenedorMapa =
        document.querySelector(
            "#mapa-plan"
        );

    if (!contenedorMapa) {
        return;
    }

    if (typeof L === "undefined") {
        console.error(
            "Leaflet no se ha cargado correctamente."
        );

        return;
    }

    /*
        Evita que Leaflet cree dos mapas si el script
        se ejecuta más de una vez.
    */

    if (contenedorMapa.dataset.mapaCreado) {
        return;
    }

    contenedorMapa.dataset.mapaCreado =
        "true";

    const coordenadas = [
        37.4073,
        -6.0088
    ];

    const mapa = L.map(
        "mapa-plan"
    ).setView(
        coordenadas,
        16
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    L.marker(
        coordenadas
    )
        .addTo(mapa)
        .bindPopup(
            `
                <strong>Cartuja Center CITE</strong>
                <br>
                PONCHO K
                <br>
                21 de noviembre de 2026
            `
        )
        .openPopup();

    setTimeout(() => {
        mapa.invalidateSize();
    }, 250);
}


/* =====================================================
   CARGA INICIAL
===================================================== */

function iniciarDetallePonchoK() {
    cargarEstadoFavorito();
    actualizarPrecioReserva();
    crearMapaPonchoK();
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarDetallePonchoK
    );
} else {
    iniciarDetallePonchoK();
}