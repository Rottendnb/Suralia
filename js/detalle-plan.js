/* =====================================================
   ELEMENTOS DE LA PÁGINA
===================================================== */

const botonCompartir = document.querySelector(
    "#boton-compartir"
);

const botonLeerMas = document.querySelector(
    "#boton-leer-mas"
);

const descripcionAmpliada = document.querySelector(
    "#descripcion-ampliada"
);

const formularioReserva = document.querySelector(
    "#formulario-reserva"
);

const notificacion = document.querySelector(
    "#notificacion"
);

const botonesGaleria = document.querySelectorAll(
    ".galeria-plan button[data-imagen]"
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

let temporizadorNotificacion;


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(mensaje) {
    if (!notificacion) {
        console.log(mensaje);
        return;
    }

    const textoNotificacion =
        notificacion.querySelector("span");

    if (textoNotificacion) {
        textoNotificacion.textContent = mensaje;
    }

    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacion.classList.remove("visible");
    }, 3000);
}


/* =====================================================
   COMPARTIR PLAN
===================================================== */

if (botonCompartir) {
    botonCompartir.addEventListener(
        "click",
        async () => {
            const datosCompartir = {
                title:
                    "Visita guiada por Itálica | Suralia",

                text:
                    "Descubre esta experiencia en Suralia.",

                url:
                    window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(
                        datosCompartir
                    );

                    return;
                }

                await navigator.clipboard.writeText(
                    window.location.href
                );

                mostrarNotificacion(
                    "El enlace se ha copiado al portapapeles."
                );
            } catch (error) {
                console.error(
                    "No se pudo compartir:",
                    error
                );
            }
        }
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
            const estaVisible =
                descripcionAmpliada.classList.toggle(
                    "visible"
                );

            botonLeerMas.innerHTML = estaVisible
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
   RESERVAS
===================================================== */

if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const sesionActual = JSON.parse(
                localStorage.getItem(
                    "sesionSuralia"
                )
            );

            if (!sesionActual?.conectado) {
                mostrarNotificacion(
                    "Debes iniciar sesión para reservar una plaza."
                );

                setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1200);

                return;
            }

            const selectorFecha =
                document.querySelector(
                    "#fecha-reserva"
                );

            const selectorPersonas =
                document.querySelector(
                    "#personas-reserva"
                );

            if (
                !selectorFecha ||
                !selectorPersonas
            ) {
                mostrarNotificacion(
                    "No se ha podido completar la reserva."
                );

                return;
            }

            const fechaSeleccionada =
                selectorFecha.value;

            const textoFecha =
                selectorFecha.options[
                    selectorFecha.selectedIndex
                ].text;

            const numeroPersonas =
                Number(
                    selectorPersonas.value
                );

            if (!fechaSeleccionada) {
                mostrarNotificacion(
                    "Selecciona una fecha."
                );

                return;
            }

            if (
                !numeroPersonas ||
                numeroPersonas < 1
            ) {
                mostrarNotificacion(
                    "Selecciona el número de personas."
                );

                return;
            }

            const reservasGuardadas =
                JSON.parse(
                    localStorage.getItem(
                        "reservasSuralia"
                    )
                ) || [];

            const reservaExistente =
                reservasGuardadas.find(
                    (reserva) => {
                        return (
                            reserva.usuarioEmail ===
                                sesionActual.email &&
                            reserva.planId ===
                                "italica" &&
                            reserva.fecha ===
                                fechaSeleccionada &&
                            reserva.estado ===
                                "confirmada"
                        );
                    }
                );

            if (reservaExistente) {
                mostrarNotificacion(
                    "Ya tienes una reserva para esta actividad y fecha."
                );

                return;
            }

            const nuevaReserva = {
                id: Date.now(),

                planId:
                    "italica",

                titulo:
                    "Visita guiada por Itálica",

                categoria:
                    "Cultura",

                imagen:
                    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=900&q=80",

                fecha:
                    fechaSeleccionada,

                fechaTexto:
                    textoFecha,

                hora:
                    "10:30",

                personas:
                    numeroPersonas,

                ubicacion:
                    "Santiponce, Sevilla",

                precio:
                    0,

                estado:
                    "confirmada",

                usuarioEmail:
                    sesionActual.email,

                fechaReserva:
                    new Date().toISOString()
            };

            reservasGuardadas.push(
                nuevaReserva
            );

            localStorage.setItem(
                "reservasSuralia",
                JSON.stringify(
                    reservasGuardadas
                )
            );

            mostrarNotificacion(
                `Reserva confirmada para ${numeroPersonas} ${
                    numeroPersonas === 1
                        ? "persona"
                        : "personas"
                }.`
            );

            setTimeout(() => {
                window.location.href =
                    "perfil.html";
            }, 1400);
        }
    );
}


/* =====================================================
   GALERÍA DE IMÁGENES
===================================================== */

botonesGaleria.forEach((boton) => {
    boton.addEventListener(
        "click",
        () => {
            if (
                !modalImagen ||
                !imagenModal
            ) {
                return;
            }

            const imagen =
                boton.dataset.imagen;

            imagenModal.src =
                imagen;

            modalImagen.classList.add(
                "visible"
            );

            document.body.style.overflow =
                "hidden";
        }
    );
});


function cerrarModal() {
    if (
        !modalImagen ||
        !imagenModal
    ) {
        return;
    }

    modalImagen.classList.remove(
        "visible"
    );

    imagenModal.src = "";

    document.body.style.overflow = "";
}


if (cerrarModalImagen) {
    cerrarModalImagen.addEventListener(
        "click",
        cerrarModal
    );
}


if (modalImagen) {
    modalImagen.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalImagen
            ) {
                cerrarModal();
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
            cerrarModal();
        }
    }
);


/* =====================================================
   MAPA
===================================================== */

if (
    typeof L !== "undefined" &&
    document.querySelector("#mapa-plan")
) {
    const mapa = L.map(
        "mapa-plan",
        {
            scrollWheelZoom: false
        }
    ).setView(
        [37.4431, -6.0448],
        15
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    L.marker(
        [37.4431, -6.0448]
    )
        .addTo(mapa)
        .bindPopup(
            `
                <strong>
                    Conjunto Arqueológico de Itálica
                </strong>
                <br>
                Santiponce, Sevilla
            `
        )
        .openPopup();
}


/* =====================================================
   FAVORITOS
===================================================== */

const botonFavoritoPlan =
    document.querySelector(
        "#boton-favorito-plan"
    );

const planDetalle = {
    planId:
        "italica",

    titulo:
        "Visita guiada por Itálica",

    categoria:
        "Cultura",

    imagen:
        "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=900&q=80",

    fechaTexto:
        "25 de julio",

    ubicacion:
        "Santiponce, Sevilla",

    precio:
        0,

    valoracion:
        4.8,

    enlace:
        "detalle-plan.html"
};


function obtenerSesionFavoritos() {
    return JSON.parse(
        localStorage.getItem(
            "sesionSuralia"
        )
    );
}


function obtenerFavoritosGuardados() {
    return JSON.parse(
        localStorage.getItem(
            "favoritosSuralia"
        )
    ) || [];
}


function planEstaEnFavoritos() {
    const sesion =
        obtenerSesionFavoritos();

    if (!sesion?.conectado) {
        return false;
    }

    const favoritos =
        obtenerFavoritosGuardados();

    return favoritos.some(
        (favorito) => {
            return (
                favorito.usuarioEmail ===
                    sesion.email &&
                favorito.planId ===
                    planDetalle.planId
            );
        }
    );
}


function actualizarBotonFavoritoDetalle() {
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

    const esFavorito =
        planEstaEnFavoritos();

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


function alternarFavoritoDetalle() {
    const sesion =
        obtenerSesionFavoritos();

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
        obtenerFavoritosGuardados();

    const posicionFavorito =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.usuarioEmail ===
                        sesion.email &&
                    favorito.planId ===
                        planDetalle.planId
                );
            }
        );

    if (posicionFavorito !== -1) {
        favoritos.splice(
            posicionFavorito,
            1
        );

        localStorage.setItem(
            "favoritosSuralia",
            JSON.stringify(
                favoritos
            )
        );

        mostrarNotificacion(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...planDetalle,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        localStorage.setItem(
            "favoritosSuralia",
            JSON.stringify(
                favoritos
            )
        );

        mostrarNotificacion(
            "El plan se ha guardado en favoritos."
        );
    }

    actualizarBotonFavoritoDetalle();
}


if (botonFavoritoPlan) {
    botonFavoritoPlan.addEventListener(
        "click",
        alternarFavoritoDetalle
    );
}


actualizarBotonFavoritoDetalle();