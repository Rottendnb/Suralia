/* =====================================================
   COMPROBAR USUARIO Y SESIÓN
===================================================== */

const usuarioGuardado = JSON.parse(
    localStorage.getItem("usuarioSuralia")
);

const sesionGuardada = JSON.parse(
    localStorage.getItem("sesionSuralia")
);

if (
    !usuarioGuardado ||
    !sesionGuardada ||
    !sesionGuardada.conectado
) {
    window.location.href = "login.html";
}


/* =====================================================
   ELEMENTOS GENERALES
===================================================== */

const botonesMenuPerfil = document.querySelectorAll(
    ".perfil-menu__enlace"
);

const seccionesPerfil = document.querySelectorAll(
    ".perfil-seccion"
);

const enlacesSeccion = document.querySelectorAll(
    "[data-ir-seccion]"
);

const botonCerrarSesion = document.querySelector(
    "#boton-cerrar-sesion"
);

const formularioPerfil = document.querySelector(
    "#formulario-perfil"
);

const notificacionPerfil = document.querySelector(
    "#notificacion-perfil"
);

let temporizadorNotificacion;


/* =====================================================
   MODAL DE CANCELACIÓN DE RESERVA
===================================================== */

const modalCancelacion = document.querySelector(
    "#modal-cancelacion"
);

const mantenerReserva = document.querySelector(
    "#mantener-reserva"
);

const confirmarCancelacion = document.querySelector(
    "#confirmar-cancelacion"
);

let reservaPendienteCancelar = null;


/* =====================================================
   FUNCIONES GENERALES
===================================================== */

function obtenerIniciales(nombre, apellidos) {
    const inicialNombre =
        nombre?.trim().charAt(0) || "";

    const inicialApellido =
        apellidos?.trim().charAt(0) || "";

    return (
        inicialNombre + inicialApellido
    ).toUpperCase();
}


function mostrarNotificacion(mensaje) {
    if (!notificacionPerfil) {
        console.log(mensaje);
        return;
    }

    const texto = notificacionPerfil.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPerfil.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacionPerfil.classList.remove("visible");
    }, 3000);
}


function cargarDatosUsuario() {
    const nombreCompleto = `
        ${usuarioGuardado.nombre || ""}
        ${usuarioGuardado.apellidos || ""}
    `.trim();

    const iniciales = obtenerIniciales(
        usuarioGuardado.nombre,
        usuarioGuardado.apellidos
    );

    const nombreHeader = document.querySelector(
        "#nombre-header"
    );

    const nombrePerfil = document.querySelector(
        "#nombre-perfil"
    );

    const emailPerfil = document.querySelector(
        "#email-perfil"
    );

    const saludoUsuario = document.querySelector(
        "#saludo-usuario"
    );

    const avatarHeader = document.querySelector(
        "#avatar-header"
    );

    const avatarPerfil = document.querySelector(
        "#avatar-perfil"
    );

    const perfilNombre = document.querySelector(
        "#perfil-nombre"
    );

    const perfilApellidos = document.querySelector(
        "#perfil-apellidos"
    );

    const perfilEmail = document.querySelector(
        "#perfil-email"
    );

    const perfilTelefono = document.querySelector(
        "#perfil-telefono"
    );

    if (nombreHeader) {
        nombreHeader.textContent =
            usuarioGuardado.nombre || "Usuario";
    }

    if (nombrePerfil) {
        nombrePerfil.textContent =
            nombreCompleto || "Usuario";
    }

    if (emailPerfil) {
        emailPerfil.textContent =
            usuarioGuardado.email || "";
    }

    if (saludoUsuario) {
        saludoUsuario.textContent =
            usuarioGuardado.nombre || "Usuario";
    }

    if (avatarHeader) {
        avatarHeader.textContent =
            iniciales || "SU";
    }

    if (avatarPerfil) {
        avatarPerfil.textContent =
            iniciales || "SU";
    }

    if (perfilNombre) {
        perfilNombre.value =
            usuarioGuardado.nombre || "";
    }

    if (perfilApellidos) {
        perfilApellidos.value =
            usuarioGuardado.apellidos || "";
    }

    if (perfilEmail) {
        perfilEmail.value =
            usuarioGuardado.email || "";
    }

    if (perfilTelefono) {
        perfilTelefono.value =
            usuarioGuardado.telefono || "";
    }
}


function cambiarSeccion(nombreSeccion) {
    botonesMenuPerfil.forEach((boton) => {
        boton.classList.toggle(
            "activo",
            boton.dataset.seccion === nombreSeccion
        );
    });

    seccionesPerfil.forEach((seccion) => {
        seccion.classList.toggle(
            "activa",
            seccion.id === `seccion-${nombreSeccion}`
        );
    });
}


/* =====================================================
   NAVEGACIÓN DEL PERFIL
===================================================== */

botonesMenuPerfil.forEach((boton) => {
    boton.addEventListener("click", () => {
        cambiarSeccion(
            boton.dataset.seccion
        );
    });
});


enlacesSeccion.forEach((boton) => {
    boton.addEventListener("click", () => {
        cambiarSeccion(
            boton.dataset.irSeccion
        );
    });
});


if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("sesionSuralia");

        window.location.href = "login.html";
    });
}


/* =====================================================
   EDICIÓN DEL PERFIL
===================================================== */

if (formularioPerfil) {
    formularioPerfil.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const campoNombre =
                document.querySelector("#perfil-nombre");

            const campoApellidos =
                document.querySelector("#perfil-apellidos");

            const campoEmail =
                document.querySelector("#perfil-email");

            const campoTelefono =
                document.querySelector("#perfil-telefono");

            const nombre =
                campoNombre?.value.trim() || "";

            const apellidos =
                campoApellidos?.value.trim() || "";

            const email =
                campoEmail?.value.trim() || "";

            const telefono =
                campoTelefono?.value.trim() || "";

            const errorNombre =
                document.querySelector(
                    "#error-perfil-nombre"
                );

            const errorApellidos =
                document.querySelector(
                    "#error-perfil-apellidos"
                );

            const errorEmail =
                document.querySelector(
                    "#error-perfil-email"
                );

            if (errorNombre) {
                errorNombre.textContent = "";
            }

            if (errorApellidos) {
                errorApellidos.textContent = "";
            }

            if (errorEmail) {
                errorEmail.textContent = "";
            }

            let formularioValido = true;

            if (nombre.length < 2) {
                if (errorNombre) {
                    errorNombre.textContent =
                        "Introduce un nombre válido.";
                }

                formularioValido = false;
            }

            if (apellidos.length < 2) {
                if (errorApellidos) {
                    errorApellidos.textContent =
                        "Introduce tus apellidos.";
                }

                formularioValido = false;
            }

            const expresionEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!expresionEmail.test(email)) {
                if (errorEmail) {
                    errorEmail.textContent =
                        "Introduce un correo electrónico válido.";
                }

                formularioValido = false;
            }

            if (!formularioValido) {
                return;
            }

            const emailAnterior =
                usuarioGuardado.email;

            usuarioGuardado.nombre = nombre;
            usuarioGuardado.apellidos = apellidos;
            usuarioGuardado.email = email;
            usuarioGuardado.telefono = telefono;

            localStorage.setItem(
                "usuarioSuralia",
                JSON.stringify(usuarioGuardado)
            );

            localStorage.setItem(
                "sesionSuralia",
                JSON.stringify({
                    nombre,
                    email,
                    conectado: true
                })
            );

            actualizarEmailGuardado(
                emailAnterior,
                email
            );

            cargarDatosUsuario();
            mostrarReservasPerfil();
            mostrarFavoritosPerfil();
            mostrarPublicaciones();

            mostrarNotificacion(
                "Tus datos se han actualizado correctamente."
            );
        }
    );
}


function actualizarEmailGuardado(
    emailAnterior,
    emailNuevo
) {
    const claves = [
    "reservasSuralia",
    "favoritosSuralia",
    "planesPublicadosSuralia",
    "borradoresSuralia"
    ];

    claves.forEach((clave) => {
        const datos = JSON.parse(
            localStorage.getItem(clave)
        ) || [];

        const datosActualizados = datos.map(
            (elemento) => {
                if (
                    elemento.usuarioEmail ===
                    emailAnterior
                ) {
                    return {
                        ...elemento,
                        usuarioEmail: emailNuevo
                    };
                }

                if (
                    elemento.creadoPor ===
                    emailAnterior
                ) {
                    return {
                        ...elemento,
                        creadoPor: emailNuevo
                    };
                }

                return elemento;
            }
        );

        localStorage.setItem(
            clave,
            JSON.stringify(datosActualizados)
        );
    });
}


/* =====================================================
   RESERVAS
===================================================== */

const listaReservasPerfil =
    document.querySelector(
        "#lista-reservas-perfil"
    );

const estadoVacioReservas =
    document.querySelector(
        "#estado-vacio-reservas"
    );

const proximaReservaPerfil =
    document.querySelector(
        "#proxima-reserva-perfil"
    );

const contadorReservasPerfil =
    document.querySelector(
        "#contador-reservas-perfil"
    );


function obtenerReservasUsuario() {
    const reservas = JSON.parse(
        localStorage.getItem("reservasSuralia")
    ) || [];

    return reservas
        .filter((reserva) => {
            return (
                reserva.usuarioEmail ===
                    usuarioGuardado.email &&
                reserva.estado === "confirmada"
            );
        })
        .sort((reservaA, reservaB) => {
            const fechaA = reservaA.fecha
                ? new Date(
                    `${reservaA.fecha}T${
                        reservaA.hora || "00:00"
                    }`
                )
                : new Date(
                    reservaA.fechaReserva
                );

            const fechaB = reservaB.fecha
                ? new Date(
                    `${reservaB.fecha}T${
                        reservaB.hora || "00:00"
                    }`
                )
                : new Date(
                    reservaB.fechaReserva
                );

            return fechaA - fechaB;
        });
}


function crearProximaReservaHTML(reserva) {
    return `
        <article class="reserva-resumen">

            <div class="reserva-resumen__imagen">

                <img
                    src="${reserva.imagen}"
                    alt="${reserva.titulo}"
                >

            </div>

            <div class="reserva-resumen__contenido">

                <span class="reserva-estado">
                    Confirmada
                </span>

                <h3>
                    ${reserva.titulo}
                </h3>

                <p>
                    <i class="fa-regular fa-calendar"></i>

                    ${
                        reserva.fechaTexto ||
                        reserva.fecha ||
                        "Fecha pendiente"
                    }
                </p>

                <p>
                    <i class="fa-regular fa-clock"></i>

                    ${
                        reserva.hora ||
                        "Hora pendiente"
                    }
                </p>

                <p>
                    <i class="fa-solid fa-user-group"></i>

                    ${reserva.personas}

                    ${
                        Number(reserva.personas) === 1
                            ? "persona"
                            : "personas"
                    }
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>

                    ${reserva.ubicacion}
                </p>

                <a
                    href="detalle-plan.html"
                    class="boton-ver-reserva"
                >
                    Ver actividad
                </a>

            </div>

        </article>
    `;
}


function crearReservaHTML(reserva) {
    return `
        <article
            class="reserva-item"
            data-reserva-id="${reserva.id}"
        >

            <div class="reserva-item__imagen">

                <img
                    src="${reserva.imagen}"
                    alt="${reserva.titulo}"
                >

            </div>

            <div class="reserva-item__contenido">

                <div class="reserva-item__superior">

                    <div>

                        <span class="reserva-estado">
                            Confirmada
                        </span>

                        <h3>
                            ${reserva.titulo}
                        </h3>

                    </div>

                </div>

                <div class="reserva-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${
                            reserva.fechaTexto ||
                            reserva.fecha ||
                            "Fecha pendiente"
                        }
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>

                        ${
                            reserva.hora ||
                            "Hora pendiente"
                        }
                    </span>

                    <span>
                        <i class="fa-solid fa-user-group"></i>

                        ${reserva.personas}

                        ${
                            Number(reserva.personas) === 1
                                ? "persona"
                                : "personas"
                        }
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>

                        ${reserva.ubicacion}
                    </span>

                </div>

                <div class="reserva-item__acciones">

                    <a
                        href="detalle-plan.html"
                        class="boton-principal-pequeno"
                    >
                        Ver actividad
                    </a>

                    <button
                        type="button"
                        class="boton-cancelar-reserva"
                        data-reserva-id="${reserva.id}"
                    >
                        Cancelar reserva
                    </button>

                </div>

            </div>

        </article>
    `;
}


function mostrarReservasPerfil() {
    const reservas =
        obtenerReservasUsuario();

    if (contadorReservasPerfil) {
        contadorReservasPerfil.textContent =
            reservas.length;
    }

    if (
        !listaReservasPerfil ||
        !proximaReservaPerfil
    ) {
        return;
    }

    if (reservas.length === 0) {
        listaReservasPerfil.innerHTML = "";

        proximaReservaPerfil.innerHTML = `
            <div
                class="
                    estado-vacio
                    estado-vacio--pequeno
                "
            >

                <span class="estado-vacio__icono">
                    <i class="fa-regular fa-calendar"></i>
                </span>

                <h3>
                    No tienes próximas reservas
                </h3>

                <p>
                    Encuentra un plan y reserva tu próxima experiencia.
                </p>

                <a
                    href="planes.html"
                    class="boton-principal-pequeno"
                >
                    Explorar planes
                </a>

            </div>
        `;

        if (estadoVacioReservas) {
            estadoVacioReservas.classList.remove(
                "oculto"
            );
        }

        return;
    }

    if (estadoVacioReservas) {
        estadoVacioReservas.classList.add(
            "oculto"
        );
    }

    proximaReservaPerfil.innerHTML =
        crearProximaReservaHTML(
            reservas[0]
        );

    listaReservasPerfil.innerHTML =
        reservas
            .map(crearReservaHTML)
            .join("");

    activarBotonesCancelarReserva();
}


function activarBotonesCancelarReserva() {
    const botonesCancelar =
        document.querySelectorAll(
            ".boton-cancelar-reserva"
        );

    botonesCancelar.forEach((boton) => {
        boton.addEventListener("click", () => {
            reservaPendienteCancelar =
                Number(
                    boton.dataset.reservaId
                );

            if (modalCancelacion) {
                modalCancelacion.classList.add(
                    "visible"
                );
            }
        });
    });
}


function cancelarReservaGuardada() {
    if (!reservaPendienteCancelar) {
        return;
    }

    const reservas = JSON.parse(
        localStorage.getItem("reservasSuralia")
    ) || [];

    const reservasActualizadas =
        reservas.filter((reserva) => {
            return (
                Number(reserva.id) !==
                reservaPendienteCancelar
            );
        });

    localStorage.setItem(
        "reservasSuralia",
        JSON.stringify(
            reservasActualizadas
        )
    );

    reservaPendienteCancelar = null;

    if (modalCancelacion) {
        modalCancelacion.classList.remove(
            "visible"
        );
    }

    mostrarReservasPerfil();

    mostrarNotificacion(
        "La reserva se ha cancelado correctamente."
    );
}


if (mantenerReserva) {
    mantenerReserva.addEventListener(
        "click",
        () => {
            reservaPendienteCancelar = null;

            if (modalCancelacion) {
                modalCancelacion.classList.remove(
                    "visible"
                );
            }
        }
    );
}


if (confirmarCancelacion) {
    confirmarCancelacion.addEventListener(
        "click",
        cancelarReservaGuardada
    );
}


if (modalCancelacion) {
    modalCancelacion.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target ===
                modalCancelacion
            ) {
                modalCancelacion.classList.remove(
                    "visible"
                );

                reservaPendienteCancelar = null;
            }
        }
    );
}


/* =====================================================
   FAVORITOS DINÁMICOS
===================================================== */

const listaFavoritosPerfil = document.querySelector(
    "#lista-favoritos-perfil"
);

const estadoVacioFavoritos = document.querySelector(
    "#estado-vacio-favoritos"
);

const contadorFavoritosPerfil = document.querySelector(
    "#contador-favoritos-perfil"
);

function obtenerFavoritosUsuario() {
    const favoritos = JSON.parse(
        localStorage.getItem("favoritosSuralia")
    ) || [];

    return favoritos
        .filter((favorito) => {
            return (
                favorito.usuarioEmail ===
                usuarioGuardado.email
            );
        })
        .sort((favoritoA, favoritoB) => {
            return (
                new Date(favoritoB.fechaGuardado) -
                new Date(favoritoA.fechaGuardado)
            );
        });
}

function obtenerPrecioFavorito(precio) {
    const precioNumerico = Number(precio);

    if (!precioNumerico) {
        return "Gratis";
    }

    return `${precioNumerico
        .toFixed(2)
        .replace(".00", "")} €`;
}

function crearFavoritoHTML(favorito) {
    return `
        <article
            class="tarjeta-plan"
            data-favorito-plan-id="${favorito.planId}"
        >

            <div class="tarjeta-plan__imagen">

                <img
                    src="${favorito.imagen}"
                    alt="${favorito.titulo}"
                >

                <span class="tarjeta-plan__precio">
                    ${obtenerPrecioFavorito(favorito.precio)}
                </span>

                <button
                    type="button"
                    class="
                        tarjeta-plan__favorito
                        favorito-activo
                        boton-eliminar-favorito
                    "
                    data-plan-id="${favorito.planId}"
                    aria-label="Eliminar de favoritos"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

            <div class="tarjeta-plan__contenido">

                <div class="tarjeta-plan__meta">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${
                            favorito.fechaTexto ||
                            "Fecha por confirmar"
                        }
                    </span>

                </div>

                <h3>
                    ${favorito.titulo}
                </h3>

                <p class="tarjeta-plan__ubicacion">
                    <i class="fa-solid fa-location-dot"></i>
                    ${favorito.ubicacion}
                </p>

                <div class="tarjeta-plan__pie">

                    <span>
                        ${favorito.categoria}
                    </span>

                    <strong>
                        ${favorito.valoracion || "Nuevo"}
                        ${
                            favorito.valoracion
                                ? '<i class="fa-solid fa-star"></i>'
                                : ""
                        }
                    </strong>

                </div>

                <a
                    href="${favorito.enlace || "detalle-plan.html"}"
                    class="boton-principal-pequeno"
                >
                    Ver actividad
                </a>

            </div>

        </article>
    `;
}

function mostrarFavoritosPerfil() {
    const favoritos = obtenerFavoritosUsuario();

    if (contadorFavoritosPerfil) {
        contadorFavoritosPerfil.textContent =
            favoritos.length;
    }

    if (
        !listaFavoritosPerfil ||
        !estadoVacioFavoritos
    ) {
        return;
    }

    if (favoritos.length === 0) {
        listaFavoritosPerfil.innerHTML = "";

        listaFavoritosPerfil.classList.add("oculto");
        estadoVacioFavoritos.classList.remove("oculto");

        return;
    }

    listaFavoritosPerfil.classList.remove("oculto");
    estadoVacioFavoritos.classList.add("oculto");

    listaFavoritosPerfil.innerHTML = favoritos
        .map(crearFavoritoHTML)
        .join("");

    activarBotonesEliminarFavorito();
}

function activarBotonesEliminarFavorito() {
    document
        .querySelectorAll(".boton-eliminar-favorito")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                const planId = boton.dataset.planId;

                eliminarFavoritoGuardado(planId);
            });
        });
}

function eliminarFavoritoGuardado(planId) {
    const favoritos = JSON.parse(
        localStorage.getItem("favoritosSuralia")
    ) || [];

    const favoritosActualizados = favoritos.filter(
        (favorito) => {
            const perteneceAlUsuario =
                favorito.usuarioEmail ===
                usuarioGuardado.email;

            const esMismoPlan =
                favorito.planId === planId;

            return !(
                perteneceAlUsuario &&
                esMismoPlan
            );
        }
    );

    localStorage.setItem(
        "favoritosSuralia",
        JSON.stringify(favoritosActualizados)
    );

    mostrarFavoritosPerfil();

    mostrarNotificacion(
        "El plan se ha eliminado de favoritos."
    );
}




/* =====================================================
   PLANES PUBLICADOS Y BORRADORES
===================================================== */

const listaPublicaciones =
    document.querySelector(
        "#lista-publicaciones"
    );

const estadoVacioPublicaciones =
    document.querySelector(
        "#estado-vacio-publicaciones"
    );

const filtrosPublicaciones =
    document.querySelectorAll(
        "[data-filtro-publicacion]"
    );

const contadorPublicaciones =
    document.querySelector(
        "#contador-publicaciones"
    );

const contadorPendientes =
    document.querySelector(
        "#contador-pendientes"
    );

const contadorBorradores =
    document.querySelector(
        "#contador-borradores"
    );

const modalEliminarPlan =
    document.querySelector(
        "#modal-eliminar-plan"
    );

const cancelarEliminarPlan =
    document.querySelector(
        "#cancelar-eliminar-plan"
    );

const confirmarEliminarPlan =
    document.querySelector(
        "#confirmar-eliminar-plan"
    );

let planPendienteEliminar = null;
let filtroPublicacionActual = "todos";


function obtenerPlanesUsuario() {
    const publicados = JSON.parse(
        localStorage.getItem(
            "planesPublicadosSuralia"
        )
    ) || [];

    const borradores = JSON.parse(
        localStorage.getItem(
            "borradoresSuralia"
        )
    ) || [];

    const emailUsuario =
        usuarioGuardado.email;

    const planesPublicadosUsuario =
        publicados
            .filter((plan) => {
                return (
                    plan.creadoPor ===
                    emailUsuario
                );
            })
            .map((plan) => {
                return {
                    ...plan,
                    almacenamiento:
                        "planesPublicadosSuralia"
                };
            });

    const borradoresUsuario =
        borradores
            .filter((plan) => {
                return (
                    plan.creadoPor ===
                    emailUsuario
                );
            })
            .map((plan) => {
                return {
                    ...plan,
                    almacenamiento:
                        "borradoresSuralia"
                };
            });

    return [
        ...planesPublicadosUsuario,
        ...borradoresUsuario
    ].sort((planA, planB) => {
        return (
            new Date(planB.fechaCreacion) -
            new Date(planA.fechaCreacion)
        );
    });
}


function formatearFechaPlan(fecha) {
    if (!fecha) {
        return "Fecha pendiente";
    }

    const fechaPlan = new Date(
        `${fecha}T00:00:00`
    );

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(fechaPlan);
}


function obtenerTextoEstado(estado) {
    const estados = {
        pendiente:
            "Pendiente de revisión",

        borrador:
            "Borrador",

        publicado:
            "Publicado"
    };

    return estados[estado] || estado;
}


function crearPublicacionHTML(plan) {
    const precio =
        Number(plan.precio) === 0
            ? "Gratis"
            : `${Number(plan.precio)
                .toFixed(2)
                .replace(".00", "")} €`;

    const imagenPlan = plan.imagen
        ? `
            <img
                src="${plan.imagen}"
                alt="${plan.titulo}"
            >
        `
        : `
            <div class="publicacion-item__sin-imagen">
                <i class="fa-regular fa-image"></i>
            </div>
        `;

    const botonPrincipal =
        plan.estado === "borrador"
            ? `
                <button
                    type="button"
                    class="
                        boton-publicacion
                        boton-editar-plan
                    "
                    data-plan-id="${plan.id}"
                >
                    <i class="fa-regular fa-pen-to-square"></i>
                    Continuar
                </button>
            `
            : `
                <button
                    type="button"
                    class="
                        boton-publicacion
                        boton-ver-plan
                    "
                    data-plan-id="${plan.id}"
                >
                    <i class="fa-regular fa-eye"></i>
                    Ver
                </button>
            `;

    return `
        <article
            class="publicacion-item"
            data-plan-id="${plan.id}"
            data-plan-estado="${plan.estado}"
        >

            <div class="publicacion-item__imagen">
                ${imagenPlan}
            </div>

            <div class="publicacion-item__contenido">

                <div class="publicacion-item__superior">

                    <div>

                        <span
                            class="
                                estado-publicacion
                                estado-publicacion--${plan.estado}
                            "
                        >
                            ${obtenerTextoEstado(plan.estado)}
                        </span>

                        <h3>
                            ${plan.titulo}
                        </h3>

                    </div>

                    <strong>
                        ${precio}
                    </strong>

                </div>

                <p class="publicacion-item__descripcion">

                    ${
                        plan.descripcion ||
                        "Este borrador todavía no tiene descripción."
                    }

                </p>

                <div class="publicacion-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${formatearFechaPlan(plan.fecha)}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>

                        ${
                            plan.hora ||
                            "Hora pendiente"
                        }
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>

                        ${
                            plan.ubicacion ||
                            "Ubicación pendiente"
                        }
                    </span>

                    <span>
                        <i class="fa-solid fa-user-group"></i>

                        ${plan.plazas || 0} plazas
                    </span>

                </div>

                <div class="publicacion-item__pie">

                    <span class="publicacion-item__categoria">

                        ${
                            plan.nombreCategoria ||
                            plan.categoria ||
                            "Sin categoría"
                        }

                    </span>

                    <div class="publicacion-item__acciones">

                        ${botonPrincipal}

                        <button
                            type="button"
                            class="
                                boton-publicacion
                                boton-publicacion--eliminar
                                boton-eliminar-plan
                            "
                            data-plan-id="${plan.id}"
                            data-almacenamiento="${plan.almacenamiento}"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}


function actualizarContadoresPublicaciones(
    planes
) {
    if (contadorPublicaciones) {
        contadorPublicaciones.textContent =
            planes.length;
    }

    if (contadorPendientes) {
        contadorPendientes.textContent =
            planes.filter((plan) => {
                return plan.estado === "pendiente";
            }).length;
    }

    if (contadorBorradores) {
        contadorBorradores.textContent =
            planes.filter((plan) => {
                return plan.estado === "borrador";
            }).length;
    }
}


function mostrarPublicaciones() {
    if (
        !listaPublicaciones ||
        !estadoVacioPublicaciones
    ) {
        return;
    }

    const todosLosPlanes =
        obtenerPlanesUsuario();

    actualizarContadoresPublicaciones(
        todosLosPlanes
    );

    const planesFiltrados =
        todosLosPlanes.filter((plan) => {
            if (
                filtroPublicacionActual ===
                "todos"
            ) {
                return true;
            }

            return (
                plan.estado ===
                filtroPublicacionActual
            );
        });

    listaPublicaciones.innerHTML =
        planesFiltrados
            .map(crearPublicacionHTML)
            .join("");

    const noHayPlanesTotales =
        todosLosPlanes.length === 0;

    const noHayResultados =
        planesFiltrados.length === 0;

    estadoVacioPublicaciones.classList.toggle(
        "oculto",
        !noHayPlanesTotales
    );

    listaPublicaciones.classList.toggle(
        "oculta",
        noHayPlanesTotales
    );

    if (
        !noHayPlanesTotales &&
        noHayResultados
    ) {
        listaPublicaciones.innerHTML = `
            <div class="estado-vacio">

                <span class="estado-vacio__icono">
                    <i class="fa-solid fa-filter"></i>
                </span>

                <h3>
                    No hay planes en esta categoría
                </h3>

                <p>
                    Cambia el filtro para consultar otras publicaciones.
                </p>

            </div>
        `;
    }

    activarEventosPublicaciones();
}


function activarEventosPublicaciones() {
    const botonesEliminar =
        document.querySelectorAll(
            ".boton-eliminar-plan"
        );

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            planPendienteEliminar = {
                id: Number(
                    boton.dataset.planId
                ),

                almacenamiento:
                    boton.dataset.almacenamiento
            };

            if (modalEliminarPlan) {
                modalEliminarPlan.classList.add(
                    "visible"
                );
            }
        });
    });


    const botonesEditar =
        document.querySelectorAll(
            ".boton-editar-plan"
        );

    botonesEditar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idPlan = Number(
                boton.dataset.planId
            );

            localStorage.setItem(
                "borradorEditarSuralia",
                String(idPlan)
            );

            window.location.href =
                "publicar-plan.html";
        });
    });


    const botonesVer =
        document.querySelectorAll(
            ".boton-ver-plan"
        );

    botonesVer.forEach((boton) => {
        boton.addEventListener("click", () => {
            mostrarNotificacion(
                "La vista individual de este plan se añadirá más adelante."
            );
        });
    });
}


function eliminarPlanGuardado() {
    if (!planPendienteEliminar) {
        return;
    }

    const clave =
        planPendienteEliminar.almacenamiento;

    const planes = JSON.parse(
        localStorage.getItem(clave)
    ) || [];

    const planesActualizados =
        planes.filter((plan) => {
            return (
                Number(plan.id) !==
                planPendienteEliminar.id
            );
        });

    localStorage.setItem(
        clave,
        JSON.stringify(
            planesActualizados
        )
    );

    if (modalEliminarPlan) {
        modalEliminarPlan.classList.remove(
            "visible"
        );
    }

    planPendienteEliminar = null;

    mostrarPublicaciones();

    mostrarNotificacion(
        "El plan se ha eliminado correctamente."
    );
}


/* =====================================================
   EVENTOS DE LOS FILTROS
===================================================== */

filtrosPublicaciones.forEach((boton) => {
    boton.addEventListener("click", () => {
        filtroPublicacionActual =
            boton.dataset.filtroPublicacion;

        filtrosPublicaciones.forEach(
            (filtro) => {
                filtro.classList.toggle(
                    "activo",
                    filtro === boton
                );
            }
        );

        mostrarPublicaciones();
    });
});


if (cancelarEliminarPlan) {
    cancelarEliminarPlan.addEventListener(
        "click",
        () => {
            if (modalEliminarPlan) {
                modalEliminarPlan.classList.remove(
                    "visible"
                );
            }

            planPendienteEliminar = null;
        }
    );
}


if (confirmarEliminarPlan) {
    confirmarEliminarPlan.addEventListener(
        "click",
        eliminarPlanGuardado
    );
}


if (modalEliminarPlan) {
    modalEliminarPlan.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target ===
                modalEliminarPlan
            ) {
                modalEliminarPlan.classList.remove(
                    "visible"
                );

                planPendienteEliminar = null;
            }
        }
    );
}


/* =====================================================
   CARGA INICIAL
===================================================== */

cargarDatosUsuario();
mostrarReservasPerfil();
mostrarFavoritosPerfil();
mostrarPublicaciones();