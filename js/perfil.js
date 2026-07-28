function leerDatoLocal(clave, valorAlternativo = null) {
    try {
        const contenido = localStorage.getItem(clave);

        if (!contenido) {
            return valorAlternativo;
        }

        return JSON.parse(contenido);
    } catch (error) {
        console.error(`No se pudo leer ${clave}:`, error);
        return valorAlternativo;
    }
}

function guardarDatoLocal(clave, valor) {
    try {
        localStorage.setItem(
            clave,
            JSON.stringify(valor)
        );

        return true;
    } catch (error) {
        console.error(`No se pudo guardar ${clave}:`, error);
        return false;
    }
}

const usuarioGuardado =
    leerDatoLocal("usuarioSuralia", {});

const sesionGuardada =
    leerDatoLocal("sesionSuralia", null);

if (
    !sesionGuardada ||
    !sesionGuardada.conectado
) {
    window.location.replace("login.html");
}

/* =========================================
   ELEMENTOS GENERALES DEL PERFIL
========================================= */

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

/* =========================================
   MODAL DE CANCELACIÓN DE RESERVA
========================================= */

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

/* =========================================
   FUNCIONES GENERALES
========================================= */

function obtenerIniciales(nombre, apellidos) {
    const inicialNombre = nombre?.trim().charAt(0) || "";
    const inicialApellido = apellidos?.trim().charAt(0) || "";

    return `${inicialNombre}${inicialApellido}`.toUpperCase();
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

function aplicarAvatar(elemento) {
    if (!elemento) {
        return;
    }

    const iniciales =
        obtenerIniciales(
            usuarioGuardado.nombre,
            usuarioGuardado.apellidos
        ) || "SU";

    elemento.classList.remove(
        "avatar--imagen"
    );

    elemento.style.backgroundImage = "";
    elemento.textContent = "";

    if (
        usuarioGuardado.avatarTipo === "imagen" &&
        usuarioGuardado.avatarValor
    ) {
        elemento.classList.add(
            "avatar--imagen"
        );

        elemento.style.backgroundImage =
            `url("${usuarioGuardado.avatarValor}")`;

        return;
    }

    if (
        usuarioGuardado.avatarTipo === "emoji" &&
        usuarioGuardado.avatarValor
    ) {
        elemento.textContent =
            usuarioGuardado.avatarValor;

        return;
    }

    elemento.textContent = iniciales;
}

function cargarDatosUsuario() {
    const nombreCompleto =
        `${usuarioGuardado.nombre || ""} ${usuarioGuardado.apellidos || ""}`.trim();

    const nombreHeader =
        document.querySelector("#nombre-header");

    const nombrePerfil =
        document.querySelector("#nombre-perfil");

    const emailPerfil =
        document.querySelector("#email-perfil");

    const saludoUsuario =
        document.querySelector("#saludo-usuario");

    const avatarHeader =
        document.querySelector("#avatar-header");

    const avatarPerfil =
        document.querySelector("#avatar-perfil");

    const avatarPreview =
        document.querySelector("#avatar-preview");

    const perfilNombre =
        document.querySelector("#perfil-nombre");

    const perfilApellidos =
        document.querySelector("#perfil-apellidos");

    const perfilEmail =
        document.querySelector("#perfil-email");

    const perfilTelefono =
        document.querySelector("#perfil-telefono");

    if (nombreHeader) {
        nombreHeader.textContent =
            usuarioGuardado.nombre ||
            "Usuario";
    }

    if (nombrePerfil) {
        nombrePerfil.textContent =
            nombreCompleto ||
            "Usuario";
    }

    if (emailPerfil) {
        emailPerfil.textContent =
            usuarioGuardado.email ||
            "";
    }

    if (saludoUsuario) {
        saludoUsuario.textContent =
            usuarioGuardado.nombre ||
            "Usuario";
    }

    aplicarAvatar(avatarHeader);
    aplicarAvatar(avatarPerfil);
    aplicarAvatar(avatarPreview);

    if (perfilNombre) {
        perfilNombre.value =
            usuarioGuardado.nombre ||
            "";
    }

    if (perfilApellidos) {
        perfilApellidos.value =
            usuarioGuardado.apellidos ||
            "";
    }

    if (perfilEmail) {
        perfilEmail.value =
            usuarioGuardado.email ||
            "";
    }

    if (perfilTelefono) {
        perfilTelefono.value =
            usuarioGuardado.telefono ||
            "";
    }
}

function cambiarSeccion(nombreSeccion) {
    const seccionExiste =
        document.querySelector(
            `#seccion-${nombreSeccion}`
        );

    if (!seccionExiste) {
        nombreSeccion = "resumen";
    }

    botonesMenuPerfil.forEach((boton) => {
        boton.classList.toggle(
            "activo",
            boton.dataset.seccion === nombreSeccion
        );
    });

    seccionesPerfil.forEach((seccion) => {
        seccion.classList.toggle(
            "activa",
            seccion.id ===
                `seccion-${nombreSeccion}`
        );
    });

    if (
        window.location.hash !==
        `#${nombreSeccion}`
    ) {
        history.replaceState(
            null,
            "",
            `#${nombreSeccion}`
        );
    }
}

/* =========================================
   NAVEGACIÓN DEL PERFIL
========================================= */

botonesMenuPerfil.forEach((boton) => {
    boton.addEventListener(
        "click",
        (evento) => {
            evento.preventDefault();

            cambiarSeccion(
                boton.dataset.seccion
            );
        }
    );
});

enlacesSeccion.forEach((boton) => {
    boton.addEventListener(
        "click",
        (evento) => {
            evento.preventDefault();

            cambiarSeccion(
                boton.dataset.irSeccion
            );
        }
    );
});

function cargarSeccionDesdeURL() {
    const seccionURL =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();

    const seccionesPermitidas = [
        "resumen",
        "reservas",
        "favoritos",
        "publicados",
        "datos"
    ];

    cambiarSeccion(
        seccionesPermitidas.includes(
            seccionURL
        )
            ? seccionURL
            : "resumen"
    );
}

window.addEventListener(
    "hashchange",
    cargarSeccionDesdeURL
);

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener(
        "click",
        async () => {
            botonCerrarSesion.disabled = true;

            try {
                if (window.clienteSupabase) {
                    const { error } =
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
                    "No se pudo cerrar la sesión:",
                    error
                );
            } finally {
                localStorage.removeItem(
                    "sesionSuralia"
                );

                sessionStorage.removeItem(
                    "destinoDespuesLoginSuralia"
                );

                window.location.replace(
                    "login.html"
                );
            }
        }
    );
}

/* =========================================
   IMAGEN Y AVATAR DEL USUARIO
========================================= */

const inputAvatar =
    document.querySelector("#input-avatar");

const botonEliminarAvatar =
    document.querySelector(
        "#boton-eliminar-avatar"
    );

const botonesAvatarPredeterminado =
    document.querySelectorAll(
        ".avatar-predeterminado"
    );

const errorAvatar =
    document.querySelector("#error-avatar");

function mostrarErrorAvatar(mensaje = "") {
    if (errorAvatar) {
        errorAvatar.textContent = mensaje;
    }
}

function guardarAvatarUsuario(tipo, valor) {
    usuarioGuardado.avatarTipo = tipo;
    usuarioGuardado.avatarValor = valor;

    const guardadoCorrecto =
        guardarDatoLocal(
            "usuarioSuralia",
            usuarioGuardado
        );

    if (!guardadoCorrecto) {
        mostrarErrorAvatar(
            "No se ha podido guardar la imagen. Prueba con una fotografía más pequeña."
        );

        return false;
    }

    cargarDatosUsuario();

    return true;
}

function reducirImagenAvatar(
    archivo,
    maximo = 500,
    calidad = 0.82
) {
    return new Promise(
        (resolve, reject) => {
            const lector =
                new FileReader();

            lector.onerror = () => {
                reject(
                    new Error(
                        "No se pudo leer la imagen."
                    )
                );
            };

            lector.onload = () => {
                const imagen =
                    new Image();

                imagen.onerror = () => {
                    reject(
                        new Error(
                            "El archivo no es una imagen válida."
                        )
                    );
                };

                imagen.onload = () => {
                    const escala =
                        Math.min(
                            1,
                            maximo /
                                Math.max(
                                    imagen.width,
                                    imagen.height
                                )
                        );

                    const ancho =
                        Math.max(
                            1,
                            Math.round(
                                imagen.width *
                                    escala
                            )
                        );

                    const alto =
                        Math.max(
                            1,
                            Math.round(
                                imagen.height *
                                    escala
                            )
                        );

                    const lienzo =
                        document.createElement(
                            "canvas"
                        );

                    lienzo.width = ancho;
                    lienzo.height = alto;

                    const contexto =
                        lienzo.getContext(
                            "2d"
                        );

                    contexto.drawImage(
                        imagen,
                        0,
                        0,
                        ancho,
                        alto
                    );

                    resolve(
                        lienzo.toDataURL(
                            "image/jpeg",
                            calidad
                        )
                    );
                };

                imagen.src =
                    lector.result;
            };

            lector.readAsDataURL(
                archivo
            );
        }
    );
}

if (inputAvatar) {
    inputAvatar.addEventListener(
        "change",
        async () => {
            const archivo =
                inputAvatar.files?.[0];

            mostrarErrorAvatar("");

            if (!archivo) {
                return;
            }

            const tiposPermitidos = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (
                !tiposPermitidos.includes(
                    archivo.type
                )
            ) {
                mostrarErrorAvatar(
                    "Selecciona una imagen JPG, PNG o WEBP."
                );

                inputAvatar.value = "";
                return;
            }

            if (
                archivo.size >
                8 * 1024 * 1024
            ) {
                mostrarErrorAvatar(
                    "La imagen no puede superar los 8 MB."
                );

                inputAvatar.value = "";
                return;
            }

            try {
                const imagenReducida =
                    await reducirImagenAvatar(
                        archivo
                    );

                if (
                    guardarAvatarUsuario(
                        "imagen",
                        imagenReducida
                    )
                ) {
                    mostrarNotificacion(
                        "La imagen de perfil se ha guardado."
                    );
                }
            } catch (error) {
                console.error(
                    "No se pudo procesar el avatar:",
                    error
                );

                mostrarErrorAvatar(
                    "No se ha podido procesar la imagen."
                );
            } finally {
                inputAvatar.value = "";
            }
        }
    );
}

botonesAvatarPredeterminado.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            () => {
                mostrarErrorAvatar("");

                if (
                    guardarAvatarUsuario(
                        "emoji",
                        boton.dataset.avatar ||
                            ""
                    )
                ) {
                    mostrarNotificacion(
                        "El avatar se ha actualizado."
                    );
                }
            }
        );
    }
);

if (botonEliminarAvatar) {
    botonEliminarAvatar.addEventListener(
        "click",
        () => {
            mostrarErrorAvatar("");

            if (
                guardarAvatarUsuario(
                    "",
                    ""
                )
            ) {
                mostrarNotificacion(
                    "La imagen de perfil se ha eliminado."
                );
            }
        }
    );
}

/* =========================================
   EDICIÓN DE DATOS DEL USUARIO
========================================= */

if (formularioPerfil) {
    formularioPerfil.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campoNombre = document.querySelector("#perfil-nombre");
        const campoApellidos = document.querySelector("#perfil-apellidos");
        const campoEmail = document.querySelector("#perfil-email");
        const campoTelefono = document.querySelector("#perfil-telefono");

        const nombre = campoNombre?.value.trim() || "";
        const apellidos = campoApellidos?.value.trim() || "";
        const email = campoEmail?.value.trim() || "";
        const telefono = campoTelefono?.value.trim() || "";

        const errorNombre = document.querySelector(
            "#error-perfil-nombre"
        );

        const errorApellidos = document.querySelector(
            "#error-perfil-apellidos"
        );

        const errorEmail = document.querySelector(
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

        const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

        const emailAnterior = usuarioGuardado.email;

        usuarioGuardado.nombre = nombre;
        usuarioGuardado.apellidos = apellidos;
        usuarioGuardado.email = email;
        usuarioGuardado.telefono = telefono;

        guardarDatoLocal(
            "usuarioSuralia",
            usuarioGuardado
        );

        guardarDatoLocal(
            "sesionSuralia",
            {
                ...sesionGuardada,
                id:
                    sesionGuardada?.id ||
                    usuarioGuardado.id,
                nombre,
                apellidos,
                email,
                conectado: true
            }
        );

        actualizarEmailEnDatosGuardados(emailAnterior, email);
        cargarDatosUsuario();
        mostrarReservasPerfil();
        mostrarFavoritosPerfil();
        mostrarPublicaciones();

        mostrarNotificacion(
            "Tus datos se han actualizado correctamente."
        );
    });
}

function actualizarEmailEnDatosGuardados(emailAnterior, emailNuevo) {
    const claves = [
        "reservasSuralia",
        "favoritosSuralia",
        "planesPublicadosSuralia",
        "borradoresSuralia"
    ];

    claves.forEach((clave) => {
        const datos = leerDatoLocal(
            clave,
            []
        );

        if (!Array.isArray(datos)) {
            return;
        }

        const datosActualizados = datos.map((elemento) => {
            if (elemento.usuarioEmail === emailAnterior) {
                return {
                    ...elemento,
                    usuarioEmail: emailNuevo
                };
            }

            if (elemento.creadoPor === emailAnterior) {
                return {
                    ...elemento,
                    creadoPor: emailNuevo
                };
            }

            return elemento;
        });

        localStorage.setItem(
            clave,
            JSON.stringify(datosActualizados)
        );
    });
}

/* =========================================
   RESERVAS DINÁMICAS
========================================= */

const listaReservasPerfil = document.querySelector(
    "#lista-reservas-perfil"
);

const estadoVacioReservas = document.querySelector(
    "#estado-vacio-reservas"
);

const proximaReservaPerfil = document.querySelector(
    "#proxima-reserva-perfil"
);

const contadorReservasPerfil = document.querySelector(
    "#contador-reservas-perfil"
);

const catalogoPlanesReservas = {
    italica: {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "Cultura",
        imagen: "img/italica principal.jpg",
        ubicacion: "Santiponce, Sevilla",
        precio: 0,
        hora: "10:30",
        enlace: "detalle-plan.html?id=italica"
    },

    "kayak-atardecer": {
        planId: "kayak-atardecer",
        titulo: "Kayak al atardecer",
        categoria: "Aventura",
        imagen: "img/kayak principal.jpg",
        ubicacion: "Río Guadalquivir, Sevilla",
        precio: 18,
        hora: "19:00",
        enlace: "detalle-kayak.html"
    },

    "poncho-k-cartuja": {
        planId: "poncho-k-cartuja",
        titulo: "PONCHO K - Cartuja Center CITE",
        categoria: "Música",
        imagen: "img/poncho-k.jpg",
        ubicacion: "Cartuja Center CITE, Sevilla",
        precio: 25,
        hora: "21:00",
        enlace: "detalle-poncho-k.html"
    },

    "cerro-hierro": {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "Naturaleza",
        imagen: "img/cerro1.jpg",
        ubicacion: "San Nicolás del Puerto",
        precio: 8,
        hora: "09:00",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },

    "tapas-triana": {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "Gastronomía",
        imagen: "img/triana1.jpg",
        ubicacion: "Triana, Sevilla",
        precio: 25,
        hora: "13:00",
        enlace: "detalle-plan.html?id=tapas-triana"
    },

    "exposicion-contemporanea": {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "Cultura",
        imagen: "img/andaluz1.jpg",
        ubicacion: "Centro de Sevilla",
        precio: 0,
        hora: "11:00",
        enlace: "detalle-plan.html?id=exposicion-contemporanea"
    },

    "sierra-norte": {
        planId: "sierra-norte",
        titulo: "Ruta por la Sierra Norte",
        categoria: "Naturaleza",
        imagen: "img/rutasierranorte.jpg",
        ubicacion: "Constantina, Sevilla",
        precio: 0,
        hora: "09:00",
        enlace: "detalle-sierra-norte.html"
    }
};


function obtenerIdPlanReserva(reserva) {
    const idDirecto =
        reserva?.planId ||
        reserva?.idPlan ||
        "";

    if (idDirecto) {
        return String(idDirecto);
    }

    const titulo = String(
        reserva?.titulo ||
        reserva?.nombre ||
        ""
    )
        .trim()
        .toLowerCase();

    const idsPorTitulo = {
        "visita guiada por itálica": "italica",
        "visita guiada por italica": "italica",
        "kayak al atardecer": "kayak-atardecer",
        "poncho k - cartuja center cite": "poncho-k-cartuja",
        "ruta por el cerro del hierro": "cerro-hierro",
        "ruta de tapas por triana": "tapas-triana",
        "exposición de arte contemporáneo":
            "exposicion-contemporanea",
        "exposicion de arte contemporaneo":
            "exposicion-contemporanea",
        "ruta por la sierra norte": "sierra-norte"
    };

    return idsPorTitulo[titulo] || "";
}


function normalizarReserva(reserva) {
    const planId =
        obtenerIdPlanReserva(reserva);

    const datosOficiales =
        catalogoPlanesReservas[planId];

    if (!datosOficiales) {
        return {
            ...reserva,
            planId:
                planId ||
                String(
                    reserva?.planId ||
                    reserva?.id ||
                    ""
                ),
            imagen:
                reserva?.imagen ||
                "img/placeholder-plan.jpg",
            enlace:
                reserva?.enlace ||
                "planes.html"
        };
    }

    return {
        ...reserva,
        ...datosOficiales,

        /*
           Se conservan los datos propios de la reserva:
           fecha elegida, texto de fecha, personas,
           estado, usuario e identificador.
        */
        id:
            reserva.id,

        fecha:
            reserva.fecha,

        fechaIso:
            reserva.fechaIso ||
            reserva.fecha,

        fechaTexto:
            reserva.fechaTexto ||
            reserva.fecha ||
            "Fecha pendiente",

        personas:
            reserva.personas ||
            reserva.entradas ||
            1,

        estado:
            reserva.estado ||
            "confirmada",

        usuarioEmail:
            reserva.usuarioEmail ||
            usuarioGuardado.email,

        fechaReserva:
            reserva.fechaReserva ||
            new Date().toISOString()
    };
}


function migrarReservasAntiguas() {
    const reservas =
        leerDatoLocal(
            "reservasSuralia",
            []
        );

    if (!Array.isArray(reservas)) {
        guardarDatoLocal(
            "reservasSuralia",
            []
        );

        return [];
    }

    const reservasActualizadas =
        reservas.map(normalizarReserva);

    guardarDatoLocal(
        "reservasSuralia",
        reservasActualizadas
    );

    return reservasActualizadas;
}


function obtenerReservasUsuario() {
    const reservas =
        migrarReservasAntiguas();

    return reservas
        .filter((reserva) => {
            return (
                reserva.usuarioEmail === usuarioGuardado.email &&
                reserva.estado === "confirmada"
            );
        })
        .sort((reservaA, reservaB) => {
            const fechaA = reservaA.fecha
                ? new Date(`${reservaA.fecha}T${reservaA.hora || "00:00"}`)
                : new Date(reservaA.fechaReserva);

            const fechaB = reservaB.fecha
                ? new Date(`${reservaB.fecha}T${reservaB.hora || "00:00"}`)
                : new Date(reservaB.fechaReserva);

            return fechaA - fechaB;
        });
}


function obtenerEnlacePlan(plan) {
    if (plan?.enlace) {
        return plan.enlace;
    }

    const enlacesPorPlan = {
        italica: "detalle-plan.html?id=italica",
        "kayak-atardecer": "detalle-kayak.html",
        "poncho-k-cartuja": "detalle-poncho-k.html",
        "cerro-hierro": "detalle-plan.html?id=cerro-hierro",
        "tapas-triana": "detalle-plan.html?id=tapas-triana",
        "exposicion-contemporanea":
            "detalle-plan.html?id=exposicion-contemporanea",
        "sierra-norte": "detalle-sierra-norte.html"
    };

    return enlacesPorPlan[plan?.planId] || "planes.html";
}

function crearProximaReservaHTML(reserva) {
    return `
        <article class="reserva-resumen">

            <div class="reserva-resumen__imagen">
                <img
                    src="${reserva.imagen}"
                    alt="${reserva.titulo}"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >
            </div>

            <div class="reserva-resumen__contenido">

                <span class="reserva-estado">
                    Confirmada
                </span>

                <h3>${reserva.titulo}</h3>

                <p>
                    <i class="fa-regular fa-calendar"></i>
                    ${reserva.fechaTexto || reserva.fecha || "Fecha pendiente"}
                </p>

                <p>
                    <i class="fa-regular fa-clock"></i>
                    ${reserva.hora || "Hora pendiente"}
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
                    href="${obtenerEnlacePlan(reserva)}"
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
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >
            </div>

            <div class="reserva-item__contenido">

                <div class="reserva-item__superior">

                    <div>
                        <span class="reserva-estado">
                            Confirmada
                        </span>

                        <h3>${reserva.titulo}</h3>
                    </div>

                </div>

                <div class="reserva-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${reserva.fechaTexto || reserva.fecha || "Fecha pendiente"}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${reserva.hora || "Hora pendiente"}
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
                        href="${obtenerEnlacePlan(reserva)}"
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
    const reservas = obtenerReservasUsuario();

    if (contadorReservasPerfil) {
        contadorReservasPerfil.textContent = reservas.length;
    }

    if (!listaReservasPerfil || !proximaReservaPerfil) {
        return;
    }

    if (reservas.length === 0) {
        listaReservasPerfil.innerHTML = "";

        proximaReservaPerfil.innerHTML = `
            <div class="estado-vacio estado-vacio--pequeno">

                <span class="estado-vacio__icono">
                    <i class="fa-regular fa-calendar"></i>
                </span>

                <h3>No tienes próximas reservas</h3>

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
            estadoVacioReservas.classList.remove("oculto");
        }

        return;
    }

    if (estadoVacioReservas) {
        estadoVacioReservas.classList.add("oculto");
    }

    proximaReservaPerfil.innerHTML =
        crearProximaReservaHTML(reservas[0]);

    listaReservasPerfil.innerHTML = reservas
        .map(crearReservaHTML)
        .join("");

    activarBotonesCancelarReserva();
}

function activarBotonesCancelarReserva() {
    document
        .querySelectorAll(".boton-cancelar-reserva")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                reservaPendienteCancelar = Number(
                    boton.dataset.reservaId
                );

                if (modalCancelacion) {
                    modalCancelacion.classList.add("visible");
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

    const reservasActualizadas = reservas.filter((reserva) => {
        return Number(reserva.id) !== reservaPendienteCancelar;
    });

    localStorage.setItem(
        "reservasSuralia",
        JSON.stringify(reservasActualizadas)
    );

    reservaPendienteCancelar = null;

    if (modalCancelacion) {
        modalCancelacion.classList.remove("visible");
    }

    mostrarReservasPerfil();

    mostrarNotificacion(
        "La reserva se ha cancelado correctamente."
    );
}

if (mantenerReserva) {
    mantenerReserva.addEventListener("click", () => {
        reservaPendienteCancelar = null;

        if (modalCancelacion) {
            modalCancelacion.classList.remove("visible");
        }
    });
}

if (confirmarCancelacion) {
    confirmarCancelacion.addEventListener(
        "click",
        cancelarReservaGuardada
    );
}

if (modalCancelacion) {
    modalCancelacion.addEventListener("click", (evento) => {
        if (evento.target === modalCancelacion) {
            modalCancelacion.classList.remove("visible");
            reservaPendienteCancelar = null;
        }
    });
}

/* =========================================
   FAVORITOS
========================================= */

const listaFavoritosPerfil =
    document.querySelector(
        "#lista-favoritos-perfil"
    );

const estadoVacioFavoritos =
    document.querySelector(
        "#estado-vacio-favoritos"
    );

const contadorFavoritosPerfil =
    document.querySelector(
        "#contador-favoritos-perfil"
    );

/*
   Datos oficiales de los planes.

   Estos valores coinciden con planes.html.
   También se incluye Sierra Norte, que aparece
   como plan destacado de la portada.
*/
const catalogoPlanesFavoritos = {
    italica: {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "Cultura",
        precio: 0,
        valoracion: 4.8,
        fechaTexto: "25 de julio",
        fechaIso: "2026-07-25",
        ubicacion: "Santiponce, Sevilla",
        imagen: "img/italica principal.jpg",
        enlace: "detalle-plan.html?id=italica"
    },

    "kayak-atardecer": {
        planId: "kayak-atardecer",
        titulo: "Kayak al atardecer",
        categoria: "Aventura",
        precio: 18,
        valoracion: 4.9,
        fechaTexto: "27 de julio",
        fechaIso: "2026-07-27",
        ubicacion: "Río Guadalquivir, Sevilla",
        imagen: "img/kayak principal.jpg",
        enlace: "detalle-kayak.html"
    },

    "poncho-k-cartuja": {
        planId: "poncho-k-cartuja",
        titulo: "PONCHO K - Cartuja Center CITE",
        categoria: "Música",
        precio: 25,
        valoracion: 4.8,
        fechaTexto: "21 de noviembre de 2026",
        fechaIso: "2026-11-21",
        ubicacion: "Cartuja Center CITE, Sevilla",
        imagen: "img/poncho-k.jpg",
        enlace: "detalle-poncho-k.html"
    },

    "cerro-hierro": {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "Naturaleza",
        precio: 8,
        valoracion: 4.9,
        fechaTexto: "2 de agosto",
        fechaIso: "2026-08-02",
        ubicacion: "San Nicolás del Puerto",
        imagen:
            "img/cerro1.jpg",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },

    "tapas-triana": {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "Gastronomía",
        precio: 25,
        valoracion: 4.6,
        fechaTexto: "3 de agosto",
        fechaIso: "2026-08-03",
        ubicacion: "Triana, Sevilla",
        imagen:
            "img/triana1.jpg",
        enlace: "detalle-plan.html?id=tapas-triana"
    },

    "exposicion-contemporanea": {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "Cultura",
        precio: 0,
        valoracion: 4.5,
        fechaTexto: "Hasta el 10 de agosto",
        fechaIso: "2026-08-10",
        ubicacion: "Centro de Sevilla",
        imagen:
            "img/andaluz1.jpg",
        enlace: "detalle-plan.html?id=exposicion-contemporanea"
    },

    "sierra-norte": {
        planId: "sierra-norte",
        titulo: "Ruta por la Sierra Norte",
        categoria: "Naturaleza",
        precio: 0,
        valoracion: 4.9,
        fechaTexto: "Este sábado",
        ubicacion: "Constantina, Sevilla",
        imagen: "img/rutasierranorte.jpg",
        enlace: "detalle-sierra-norte.html"
    }
};

function obtenerIdPlanFavorito(favorito) {
    const idDirecto =
        favorito?.planId ||
        favorito?.idPlan ||
        "";

    if (idDirecto) {
        return String(idDirecto);
    }

    const titulo =
        String(
            favorito?.titulo ||
            favorito?.nombre ||
            ""
        )
            .trim()
            .toLowerCase();

    const idsPorTitulo = {
        "visita guiada por itálica":
            "italica",

        "visita guiada por italica":
            "italica",

        "kayak al atardecer":
            "kayak-atardecer",

        "poncho k - cartuja center cite":
            "poncho-k-cartuja",

        "ruta por el cerro del hierro":
            "cerro-hierro",

        "ruta de tapas por triana":
            "tapas-triana",

        "exposición de arte contemporáneo":
            "exposicion-contemporanea",

        "exposicion de arte contemporaneo":
            "exposicion-contemporanea",

        "ruta por la sierra norte":
            "sierra-norte"
    };

    return idsPorTitulo[titulo] || "";
}

function normalizarFavorito(favorito) {
    const planId =
        obtenerIdPlanFavorito(
            favorito
        );

    const datosOficiales =
        catalogoPlanesFavoritos[
            planId
        ];

    if (!datosOficiales) {
        return {
            ...favorito,
            planId:
                planId ||
                String(
                    favorito.planId ||
                    favorito.id ||
                    ""
                ),
            imagen:
                favorito.imagen ||
                "img/placeholder-plan.jpg",
            enlace:
                favorito.enlace ||
                "planes.html"
        };
    }

    /*
       Los datos oficiales se colocan al final
       para sustituir imágenes, precios y enlaces
       antiguos guardados en localStorage.
    */
    return {
        ...favorito,
        ...datosOficiales,
        usuarioEmail:
            favorito.usuarioEmail ||
            usuarioGuardado.email
    };
}

function migrarFavoritosAntiguos() {
    const favoritos =
        leerDatoLocal(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        guardarDatoLocal(
            "favoritosSuralia",
            []
        );

        return [];
    }

    const favoritosActualizados =
        favoritos.map(
            normalizarFavorito
        );

    guardarDatoLocal(
        "favoritosSuralia",
        favoritosActualizados
    );

    return favoritosActualizados;
}

function obtenerFavoritosUsuario() {
    const favoritos =
        migrarFavoritosAntiguos();

    return favoritos
        .filter((favorito) => {
            return (
                favorito.usuarioEmail ===
                usuarioGuardado.email
            );
        })
        .sort((favoritoA, favoritoB) => {
            const fechaA =
                new Date(
                    favoritoA.fechaGuardado ||
                    0
                );

            const fechaB =
                new Date(
                    favoritoB.fechaGuardado ||
                    0
                );

            return fechaB - fechaA;
        });
}

function formatearPrecioFavorito(precio) {
    const precioNumerico =
        Number(precio || 0);

    if (precioNumerico === 0) {
        return "Gratis";
    }

    return `${precioNumerico
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}

function escaparHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function crearFavoritoHTML(favoritoOriginal) {
    const favorito =
        normalizarFavorito(
            favoritoOriginal
        );

    const planId =
        escaparHTML(
            favorito.planId ||
            favorito.id ||
            ""
        );

    const titulo =
        escaparHTML(
            favorito.titulo ||
            "Plan guardado"
        );

    const categoria =
        escaparHTML(
            favorito.categoria ||
            "Actividad"
        );

    const ubicacion =
        escaparHTML(
            favorito.ubicacion ||
            "Ubicación pendiente"
        );

    const fecha =
        escaparHTML(
            favorito.fechaTexto ||
            favorito.fecha ||
            "Fecha por confirmar"
        );

    const imagen =
        escaparHTML(
            favorito.imagen ||
            "img/placeholder-plan.jpg"
        );

    const enlace =
        escaparHTML(
            favorito.enlace ||
            "planes.html"
        );

    const precio =
        formatearPrecioFavorito(
            favorito.precio
        );

    return `
        <article
            class="tarjeta-plan"
            data-plan-id="${planId}"
        >

            <div class="tarjeta-plan__imagen">

                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >

                <span class="tarjeta-plan__precio">
                    ${precio}
                </span>

                <button
                    type="button"
                    class="
                        tarjeta-plan__favorito
                        favorito-activo
                    "
                    data-eliminar-favorito="${planId}"
                    aria-label="Eliminar ${titulo} de favoritos"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

            <div class="tarjeta-plan__contenido">

                <div class="tarjeta-plan__meta">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${fecha}
                    </span>

                </div>

                <h3>
                    ${titulo}
                </h3>

                <p class="tarjeta-plan__ubicacion">
                    <i class="fa-solid fa-location-dot"></i>
                    ${ubicacion}
                </p>

                <div class="tarjeta-plan__pie">

                    <span>
                        ${categoria}
                    </span>

                    <strong>
                        ${String(
                            favorito.valoracion || 0
                        ).replace(".", ",")}
                        <i class="fa-solid fa-star"></i>
                    </strong>

                </div>

                <a
                    href="${enlace}"
                    class="boton-principal-pequeno"
                >
                    Ver actividad
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}

function eliminarFavoritoGuardado(
    planId
) {
    const favoritos =
        leerDatoLocal(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        return;
    }

    const favoritosActualizados =
        favoritos.filter(
            (favorito) => {
                const idFavorito =
                    obtenerIdPlanFavorito(
                        favorito
                    ) ||
                    String(
                        favorito.planId ||
                        favorito.id ||
                        ""
                    );

                return !(
                    idFavorito ===
                        String(planId) &&
                    favorito.usuarioEmail ===
                        usuarioGuardado.email
                );
            }
        );

    guardarDatoLocal(
        "favoritosSuralia",
        favoritosActualizados
    );

    mostrarFavoritosPerfil();

    mostrarNotificacion(
        "El plan se ha eliminado de favoritos."
    );
}

function activarBotonesEliminarFavorito() {
    document
        .querySelectorAll(
            "[data-eliminar-favorito]"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                (evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();

                    eliminarFavoritoGuardado(
                        boton.dataset
                            .eliminarFavorito
                    );
                }
            );
        });
}

function mostrarFavoritosPerfil() {
    const favoritos =
        obtenerFavoritosUsuario();

    if (contadorFavoritosPerfil) {
        contadorFavoritosPerfil
            .textContent =
            favoritos.length;
    }

    if (
        !listaFavoritosPerfil ||
        !estadoVacioFavoritos
    ) {
        return;
    }

    if (favoritos.length === 0) {
        listaFavoritosPerfil.innerHTML =
            "";

        listaFavoritosPerfil
            .classList.add(
                "oculta"
            );

        estadoVacioFavoritos
            .classList.remove(
                "oculto"
            );

        return;
    }

    listaFavoritosPerfil
        .classList.remove(
            "oculta"
        );

    estadoVacioFavoritos
        .classList.add(
            "oculto"
        );

    listaFavoritosPerfil.innerHTML =
        favoritos
            .map(
                crearFavoritoHTML
            )
            .join("");

    activarBotonesEliminarFavorito();
}

/* =========================================
   PLANES PUBLICADOS Y BORRADORES
========================================= */

const listaPublicaciones = document.querySelector(
    "#lista-publicaciones"
);

const estadoVacioPublicaciones = document.querySelector(
    "#estado-vacio-publicaciones"
);

const filtrosPublicaciones = document.querySelectorAll(
    "[data-filtro-publicacion]"
);

const contadorPublicaciones = document.querySelector(
    "#contador-publicaciones"
);

const contadorPendientes = document.querySelector(
    "#contador-pendientes"
);

const contadorBorradores = document.querySelector(
    "#contador-borradores"
);

const modalEliminarPlan = document.querySelector(
    "#modal-eliminar-plan"
);

const cancelarEliminarPlan = document.querySelector(
    "#cancelar-eliminar-plan"
);

const confirmarEliminarPlan = document.querySelector(
    "#confirmar-eliminar-plan"
);

let planPendienteEliminar = null;
let filtroPublicacionActual = "todos";

function obtenerPlanesUsuario() {
    const publicados = JSON.parse(
        localStorage.getItem("planesPublicadosSuralia")
    ) || [];

    const borradores = JSON.parse(
        localStorage.getItem("borradoresSuralia")
    ) || [];

    const emailUsuario = usuarioGuardado.email;

    const planesPublicadosUsuario = publicados
        .filter((plan) => plan.creadoPor === emailUsuario)
        .map((plan) => ({
            ...plan,
            almacenamiento: "planesPublicadosSuralia"
        }));

    const borradoresUsuario = borradores
        .filter((plan) => plan.creadoPor === emailUsuario)
        .map((plan) => ({
            ...plan,
            almacenamiento: "borradoresSuralia"
        }));

    return [
        ...planesPublicadosUsuario,
        ...borradoresUsuario
    ].sort((planA, planB) => {
        return new Date(planB.fechaCreacion) -
            new Date(planA.fechaCreacion);
    });
}

function formatearFechaPlan(fecha) {
    if (!fecha) {
        return "Fecha pendiente";
    }

    const fechaPlan = new Date(`${fecha}T00:00:00`);

    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(fechaPlan);
}

function obtenerTextoEstado(estado) {
    const estados = {
        pendiente: "Pendiente de revisión",
        borrador: "Borrador",
        publicado: "Publicado"
    };

    return estados[estado] || estado;
}

function crearPublicacionHTML(plan) {
    const precio = Number(plan.precio) === 0
        ? "Gratis"
        : `${Number(plan.precio).toFixed(2).replace(".00", "")} €`;

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
                            class="estado-publicacion estado-publicacion--${plan.estado}"
                        >
                            ${obtenerTextoEstado(plan.estado)}
                        </span>

                        <h3>${plan.titulo}</h3>
                    </div>

                    <strong>${precio}</strong>

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
                        ${plan.hora || "Hora pendiente"}
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${plan.ubicacion || "Ubicación pendiente"}
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

                        ${
                            plan.estado === "borrador"
                                ? `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-editar-plan"
                                        data-plan-id="${plan.id}"
                                    >
                                        <i class="fa-regular fa-pen-to-square"></i>
                                        Continuar
                                    </button>
                                `
                                : `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-ver-plan"
                                        data-plan-id="${plan.id}"
                                    >
                                        <i class="fa-regular fa-eye"></i>
                                        Ver
                                    </button>
                                `
                        }

                        <button
                            type="button"
                            class="boton-publicacion boton-publicacion--eliminar boton-eliminar-plan"
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

function actualizarContadoresPublicaciones(planes) {
    if (contadorPublicaciones) {
        contadorPublicaciones.textContent = planes.length;
    }

    if (contadorPendientes) {
        contadorPendientes.textContent = planes.filter(
            (plan) => plan.estado === "pendiente"
        ).length;
    }

    if (contadorBorradores) {
        contadorBorradores.textContent = planes.filter(
            (plan) => plan.estado === "borrador"
        ).length;
    }
}

function mostrarPublicaciones() {
    if (!listaPublicaciones || !estadoVacioPublicaciones) {
        return;
    }

    const todosLosPlanes = obtenerPlanesUsuario();

    actualizarContadoresPublicaciones(todosLosPlanes);

    const planesFiltrados = todosLosPlanes.filter((plan) => {
        if (filtroPublicacionActual === "todos") {
            return true;
        }

        return plan.estado === filtroPublicacionActual;
    });

    listaPublicaciones.innerHTML = planesFiltrados
        .map(crearPublicacionHTML)
        .join("");

    const noHayPlanesTotales = todosLosPlanes.length === 0;
    const noHayResultados = planesFiltrados.length === 0;

    estadoVacioPublicaciones.classList.toggle(
        "oculto",
        !noHayPlanesTotales
    );

    listaPublicaciones.classList.toggle(
        "oculta",
        noHayPlanesTotales
    );

    if (!noHayPlanesTotales && noHayResultados) {
        listaPublicaciones.innerHTML = `
            <div class="estado-vacio">
                <span class="estado-vacio__icono">
                    <i class="fa-solid fa-filter"></i>
                </span>

                <h3>No hay planes en esta categoría</h3>

                <p>
                    Cambia el filtro para consultar otras publicaciones.
                </p>
            </div>
        `;
    }

    activarEventosPublicaciones();
}

function activarEventosPublicaciones() {
    document
        .querySelectorAll(".boton-eliminar-plan")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                planPendienteEliminar = {
                    id: Number(boton.dataset.planId),
                    almacenamiento: boton.dataset.almacenamiento
                };

                if (modalEliminarPlan) {
                    modalEliminarPlan.classList.add("visible");
                }
            });
        });

    document
        .querySelectorAll(".boton-editar-plan")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                const idPlan = Number(boton.dataset.planId);

                localStorage.setItem(
                    "borradorEditarSuralia",
                    String(idPlan)
                );

                window.location.href = "publicar-plan.html";
            });
        });

    document
        .querySelectorAll(".boton-ver-plan")
        .forEach((boton) => {
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

    const clave = planPendienteEliminar.almacenamiento;

    const planes = JSON.parse(
        localStorage.getItem(clave)
    ) || [];

    const planesActualizados = planes.filter(
        (plan) => Number(plan.id) !== planPendienteEliminar.id
    );

    localStorage.setItem(
        clave,
        JSON.stringify(planesActualizados)
    );

    if (modalEliminarPlan) {
        modalEliminarPlan.classList.remove("visible");
    }

    mostrarNotificacion(
        "El plan se ha eliminado correctamente."
    );

    planPendienteEliminar = null;

    mostrarPublicaciones();
}

filtrosPublicaciones.forEach((boton) => {
    boton.addEventListener("click", () => {
        filtroPublicacionActual =
            boton.dataset.filtroPublicacion;

        filtrosPublicaciones.forEach((filtro) => {
            filtro.classList.toggle(
                "activo",
                filtro === boton
            );
        });

        mostrarPublicaciones();
    });
});

if (cancelarEliminarPlan) {
    cancelarEliminarPlan.addEventListener("click", () => {
        if (modalEliminarPlan) {
            modalEliminarPlan.classList.remove("visible");
        }

        planPendienteEliminar = null;
    });
}

if (confirmarEliminarPlan) {
    confirmarEliminarPlan.addEventListener(
        "click",
        eliminarPlanGuardado
    );
}

if (modalEliminarPlan) {
    modalEliminarPlan.addEventListener("click", (evento) => {
        if (evento.target === modalEliminarPlan) {
            modalEliminarPlan.classList.remove("visible");
            planPendienteEliminar = null;
        }
    });
}

/* =========================================
   CARGA INICIAL
========================================= */

function iniciarPerfil() {
    cargarDatosUsuario();
    mostrarReservasPerfil();
    mostrarFavoritosPerfil();
    mostrarPublicaciones();
    cargarSeccionDesdeURL();
}

if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPerfil
    );
} else {
    iniciarPerfil();
}