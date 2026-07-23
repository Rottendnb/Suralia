/* =====================================================
   DATOS DEL PLAN
===================================================== */

const datosPlanKayak = {
    planId:
        document.body.dataset.planId ||
        "kayak-atardecer",

    titulo:
        document.body.dataset.planTitulo ||
        "Kayak al atardecer",

    categoria:
        document.body.dataset.planCategoria ||
        "Aventura",

    imagen:
        document.body.dataset.planImagen ||
        "img/kayak.jpg",

    precio:
        Number(
            document.body.dataset.planPrecio || 18
        ),

    valoracion:
        Number(
            document.body.dataset.planValoracion || 4.9
        ),

    fechaTexto:
        document.body.dataset.planFecha ||
        "27 de julio de 2026",

    ubicacion:
        document.body.dataset.planUbicacion ||
        "Río Guadalquivir, Sevilla",

    enlace:
        document.body.dataset.planEnlace ||
        "detalle-kayak.html"
};


/* =====================================================
   ELEMENTOS
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
   UTILIDADES DE LOCALSTORAGE
===================================================== */

function obtenerSesion() {
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


function obtenerFavoritos() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "favoritosSuralia"
            )
        ) || [];
    } catch (error) {
        console.error(
            "No se pudieron leer los favoritos:",
            error
        );

        return [];
    }
}


function obtenerReservas() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "reservasSuralia"
            )
        ) || [];
    } catch (error) {
        console.error(
            "No se pudieron leer las reservas:",
            error
        );

        return [];
    }
}


/* =====================================================
   NOTIFICACIÓN
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

    notificacion.classList.add("visible");

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
   LEER MÁS
===================================================== */

if (
    botonLeerMas &&
    descripcionAmpliada
) {
    botonLeerMas.addEventListener(
        "click",
        () => {
            const estaAbierta =
                descripcionAmpliada.classList.toggle(
                    "visible"
                );

            botonLeerMas.innerHTML =
                estaAbierta
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
   GALERÍA
===================================================== */

function abrirModalImagen(rutaImagen) {
    if (
        !modalImagen ||
        !imagenModal
    ) {
        return;
    }

    imagenModal.src = rutaImagen;
    modalImagen.classList.add("visible");

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
}


botonesGaleria.forEach((boton) => {
    boton.addEventListener(
        "click",
        () => {
            const rutaImagen =
                boton.dataset.imagen;

            if (rutaImagen) {
                abrirModalImagen(
                    rutaImagen
                );
            }
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

if (botonCompartir) {
    botonCompartir.addEventListener(
        "click",
        async () => {
            const datosCompartir = {
                title:
                    datosPlanKayak.titulo,

                text:
                    `Descubre ${datosPlanKayak.titulo} en Suralia.`,

                url:
                    window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(
                        datosCompartir
                    );

                    mostrarNotificacion(
                        "Plan compartido correctamente."
                    );

                    return;
                }

                await navigator.clipboard.writeText(
                    window.location.href
                );

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
        icono.className = esFavorito
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";
    }

    if (texto) {
        texto.textContent = esFavorito
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
            datosPlanKayak.planId,
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
                        datosPlanKayak.planId &&
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
            ...datosPlanKayak,

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
   PRECIO DE LA RESERVA
===================================================== */

function actualizarPrecioReserva() {
    if (!personasReserva) {
        return;
    }

    const numeroPersonas = Number(
        personasReserva.value
    );

    const total =
        numeroPersonas *
        datosPlanKayak.precio;

    if (numeroPersonasDesglose) {
        numeroPersonasDesglose.textContent =
            numeroPersonas;
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

function obtenerTextoOpcionSeleccionada(
    select
) {
    if (!select) {
        return "";
    }

    return select.options[
        select.selectedIndex
    ]?.textContent.trim() || "";
}


function existeReserva(
    reservas,
    email,
    fecha,
    planId
) {
    return reservas.some(
        (reserva) => {
            return (
                reserva.usuarioEmail ===
                    email &&
                reserva.planId ===
                    planId &&
                reserva.fechaValor ===
                    fecha &&
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
                    "Debes iniciar sesión para reservar."
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
                obtenerTextoOpcionSeleccionada(
                    fechaReserva
                );

            const personas = Number(
                personasReserva?.value || 1
            );

            const total =
                personas *
                datosPlanKayak.precio;

            const reservas =
                obtenerReservas();

            if (
                existeReserva(
                    reservas,
                    sesion.email,
                    fechaValor,
                    datosPlanKayak.planId
                )
            ) {
                mostrarNotificacion(
                    "Ya tienes una reserva para esta fecha."
                );

                return;
            }

            const nuevaReserva = {
                id:
                    Date.now(),

                planId:
                    datosPlanKayak.planId,

                titulo:
                    datosPlanKayak.titulo,

                categoria:
                    datosPlanKayak.categoria,

                imagen:
                    datosPlanKayak.imagen,

                ubicacion:
                    datosPlanKayak.ubicacion,

                enlace:
                    datosPlanKayak.enlace,

                precioUnitario:
                    datosPlanKayak.precio,

                personas,

                precioTotal:
                    total,

                fechaValor,

                fechaTexto,

                hora:
                    "19:00",

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

            localStorage.setItem(
                "reservasSuralia",
                JSON.stringify(reservas)
            );

            mostrarNotificacion(
                "Reserva realizada correctamente."
            );

            formularioReserva.reset();

            actualizarPrecioReserva();
        }
    );
}


/* =====================================================
   MAPA
===================================================== */

function crearMapaKayak() {
    const contenedorMapa =
        document.querySelector(
            "#mapa-plan"
        );

    if (
        !contenedorMapa ||
        typeof L === "undefined"
    ) {
        return;
    }

    const coordenadas = [
        37.3863,
        -6.0065
    ];

    const mapa = L.map(
        "mapa-plan"
    ).setView(
        coordenadas,
        15
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
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
                <strong>Kayak al atardecer</strong>
                <br>
                Paseo de la O, Sevilla
            `
        )
        .openPopup();

    setTimeout(() => {
        mapa.invalidateSize();
    }, 150);
}


/* =====================================================
   CARGA INICIAL
===================================================== */

cargarEstadoFavorito();
actualizarPrecioReserva();
crearMapaKayak();