/* =====================================================
   FUNCIONES SEGURAS PARA LOCALSTORAGE
===================================================== */

function leerLocalStorage(clave, valorAlternativo = null) {
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


function guardarLocalStorage(clave, valor) {
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
   COMPROBAR USUARIO Y SESIÓN
===================================================== */

const usuarioGuardado = leerLocalStorage(
    "usuarioSuralia",
    null
);

const sesionGuardada = leerLocalStorage(
    "sesionSuralia",
    null
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

const botonesMenuPerfil =
    document.querySelectorAll(
        ".perfil-menu__enlace"
    );

const seccionesPerfil =
    document.querySelectorAll(
        ".perfil-seccion"
    );

const enlacesSeccion =
    document.querySelectorAll(
        "[data-ir-seccion]"
    );

const botonCerrarSesion =
    document.querySelector(
        "#boton-cerrar-sesion"
    );

const formularioPerfil =
    document.querySelector(
        "#formulario-perfil"
    );

const notificacionPerfil =
    document.querySelector(
        "#notificacion-perfil"
    );

let temporizadorNotificacion;


/* =====================================================
   ELEMENTOS DEL AVATAR
===================================================== */

const avatarPreview =
    document.querySelector(
        "#avatar-preview"
    );

const inputAvatar =
    document.querySelector(
        "#input-avatar"
    );

const botonEliminarAvatar =
    document.querySelector(
        "#boton-eliminar-avatar"
    );

const botonesAvatarPredeterminado =
    document.querySelectorAll(
        ".avatar-predeterminado"
    );

const errorAvatar =
    document.querySelector(
        "#error-avatar"
    );


/* =====================================================
   MODAL DE CANCELACIÓN DE RESERVA
===================================================== */

const modalCancelacion =
    document.querySelector(
        "#modal-cancelacion"
    );

const mantenerReserva =
    document.querySelector(
        "#mantener-reserva"
    );

const confirmarCancelacion =
    document.querySelector(
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
        inicialNombre +
        inicialApellido
    ).toUpperCase();
}


function mostrarNotificacion(mensaje) {
    if (!notificacionPerfil) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionPerfil.querySelector(
            "span"
        );

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPerfil.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacion
    );

    temporizadorNotificacion = setTimeout(
        () => {
            notificacionPerfil.classList.remove(
                "visible"
            );
        },
        3000
    );
}


function escaparHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   IMÁGENES DE RESPALDO
===================================================== */

const imagenFallback = `
    data:image/svg+xml;charset=UTF-8,
    %3Csvg xmlns='http://www.w3.org/2000/svg'
    width='800' height='500'
    viewBox='0 0 800 500'%3E
    %3Crect width='800' height='500'
    fill='%23f5f2ef'/%3E
    %3Cpath d='M335 210h130v95H335z'
    fill='none' stroke='%2395a09c'
    stroke-width='12'/%3E
    %3Ccircle cx='375' cy='245' r='16'
    fill='%2395a09c'/%3E
    %3Cpath d='M350 290l35-32 28 25 22-18 30 25'
    fill='none' stroke='%2395a09c'
    stroke-width='12'
    stroke-linejoin='round'/%3E
    %3C/svg%3E
`.replace(/\s+/g, "");


function activarFallbackImagenes(contenedor = document) {
    contenedor
        .querySelectorAll(
            "img[data-imagen-fallback]"
        )
        .forEach((imagen) => {
            imagen.addEventListener(
                "error",
                () => {
                    if (
                        imagen.dataset.fallbackAplicado ===
                        "true"
                    ) {
                        return;
                    }

                    imagen.dataset.fallbackAplicado =
                        "true";

                    imagen.src =
                        imagenFallback;
                }
            );
        });
}


/* =====================================================
   FOTO Y AVATAR DEL USUARIO
===================================================== */

function limpiarEstiloAvatar(elemento) {
    if (!elemento) {
        return;
    }

    elemento.style.backgroundImage = "";

    elemento.classList.remove(
        "avatar-con-imagen"
    );
}


function aplicarAvatarEnElemento(
    elemento,
    iniciales
) {
    if (!elemento) {
        return;
    }

    limpiarEstiloAvatar(elemento);

    const tipoAvatar =
        usuarioGuardado.avatarTipo;

    const valorAvatar =
        usuarioGuardado.avatarValor;

    if (
        tipoAvatar === "imagen" &&
        valorAvatar
    ) {
        elemento.textContent = "";

        elemento.style.backgroundImage =
            `url("${valorAvatar}")`;

        elemento.classList.add(
            "avatar-con-imagen"
        );

        return;
    }

    if (
        tipoAvatar === "emoji" &&
        valorAvatar
    ) {
        elemento.textContent =
            valorAvatar;

        return;
    }

    elemento.textContent =
        iniciales || "SU";
}


function actualizarAvataresUsuario() {
    const iniciales = obtenerIniciales(
        usuarioGuardado.nombre,
        usuarioGuardado.apellidos
    );

    const avatarHeader =
        document.querySelector(
            "#avatar-header"
        );

    const avatarPerfil =
        document.querySelector(
            "#avatar-perfil"
        );

    aplicarAvatarEnElemento(
        avatarHeader,
        iniciales
    );

    aplicarAvatarEnElemento(
        avatarPerfil,
        iniciales
    );

    aplicarAvatarEnElemento(
        avatarPreview,
        iniciales
    );

    botonesAvatarPredeterminado.forEach(
        (boton) => {
            const estaSeleccionado =
                usuarioGuardado.avatarTipo ===
                    "emoji" &&
                usuarioGuardado.avatarValor ===
                    boton.dataset.avatar;

            boton.classList.toggle(
                "activo",
                estaSeleccionado
            );
        }
    );
}


function guardarAvatarUsuario(tipo, valor) {
    usuarioGuardado.avatarTipo = tipo;
    usuarioGuardado.avatarValor = valor;

    const guardadoCorrecto =
        guardarLocalStorage(
            "usuarioSuralia",
            usuarioGuardado
        );

    if (!guardadoCorrecto) {
        mostrarNotificacion(
            "No se ha podido guardar el avatar."
        );

        return false;
    }

    actualizarAvataresUsuario();

    return true;
}


function reducirImagenAvatar(archivo) {
    return new Promise(
        (resolve, reject) => {
            const lector =
                new FileReader();

            lector.onload = () => {
                const imagen =
                    new Image();

                imagen.onload = () => {
                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    const contexto =
                        canvas.getContext("2d");

                    if (!contexto) {
                        reject(
                            new Error(
                                "No se ha podido procesar la imagen."
                            )
                        );

                        return;
                    }

                    const medidaMaxima = 350;

                    let ancho = imagen.width;
                    let alto = imagen.height;

                    if (ancho > alto) {
                        alto =
                            alto *
                            (
                                medidaMaxima /
                                ancho
                            );

                        ancho = medidaMaxima;
                    } else {
                        ancho =
                            ancho *
                            (
                                medidaMaxima /
                                alto
                            );

                        alto = medidaMaxima;
                    }

                    canvas.width =
                        Math.round(ancho);

                    canvas.height =
                        Math.round(alto);

                    contexto.drawImage(
                        imagen,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    resolve(
                        canvas.toDataURL(
                            "image/jpeg",
                            0.78
                        )
                    );
                };

                imagen.onerror = () => {
                    reject(
                        new Error(
                            "No se ha podido abrir la imagen."
                        )
                    );
                };

                imagen.src =
                    lector.result;
            };

            lector.onerror = () => {
                reject(
                    new Error(
                        "No se ha podido leer el archivo."
                    )
                );
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
                if (errorAvatar) {
                    errorAvatar.textContent =
                        "Selecciona una imagen JPG, PNG o WEBP.";
                }

                inputAvatar.value = "";

                return;
            }

            const tamañoMaximo =
                5 * 1024 * 1024;

            if (
                archivo.size >
                tamañoMaximo
            ) {
                if (errorAvatar) {
                    errorAvatar.textContent =
                        "La imagen no puede superar los 5 MB.";
                }

                inputAvatar.value = "";

                return;
            }

            if (errorAvatar) {
                errorAvatar.textContent = "";
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
                        "La foto de perfil se ha actualizado."
                    );
                }
            } catch (error) {
                console.error(error);

                if (errorAvatar) {
                    errorAvatar.textContent =
                        "No se ha podido guardar la imagen.";
                }
            }

            inputAvatar.value = "";
        }
    );
}


botonesAvatarPredeterminado.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            () => {
                const avatar =
                    boton.dataset.avatar;

                if (!avatar) {
                    return;
                }

                if (
                    guardarAvatarUsuario(
                        "emoji",
                        avatar
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
            delete usuarioGuardado.avatarTipo;
            delete usuarioGuardado.avatarValor;

            guardarLocalStorage(
                "usuarioSuralia",
                usuarioGuardado
            );

            actualizarAvataresUsuario();

            if (errorAvatar) {
                errorAvatar.textContent = "";
            }

            mostrarNotificacion(
                "Se han restaurado tus iniciales."
            );
        }
    );
}


/* =====================================================
   CARGAR DATOS DEL USUARIO
===================================================== */

function cargarDatosUsuario() {
    const nombreCompleto = `
        ${usuarioGuardado.nombre || ""}
        ${usuarioGuardado.apellidos || ""}
    `.trim();

    const nombreHeader =
        document.querySelector(
            "#nombre-header"
        );

    const nombrePerfil =
        document.querySelector(
            "#nombre-perfil"
        );

    const emailPerfil =
        document.querySelector(
            "#email-perfil"
        );

    const saludoUsuario =
        document.querySelector(
            "#saludo-usuario"
        );

    const perfilNombre =
        document.querySelector(
            "#perfil-nombre"
        );

    const perfilApellidos =
        document.querySelector(
            "#perfil-apellidos"
        );

    const perfilEmail =
        document.querySelector(
            "#perfil-email"
        );

    const perfilTelefono =
        document.querySelector(
            "#perfil-telefono"
        );

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

    actualizarAvataresUsuario();
}


/* =====================================================
   NAVEGACIÓN DEL PERFIL
===================================================== */

function cambiarSeccion(nombreSeccion) {
    if (!nombreSeccion) {
        return;
    }

    botonesMenuPerfil.forEach(
        (boton) => {
            boton.classList.toggle(
                "activo",
                boton.dataset.seccion ===
                    nombreSeccion
            );
        }
    );

    seccionesPerfil.forEach(
        (seccion) => {
            seccion.classList.toggle(
                "activa",
                seccion.id ===
                    `seccion-${nombreSeccion}`
            );
        }
    );

    window.location.hash =
        nombreSeccion;
}


botonesMenuPerfil.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();
                evento.stopPropagation();

                cambiarSeccion(
                    boton.dataset.seccion
                );
            }
        );
    }
);


enlacesSeccion.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();

                cambiarSeccion(
                    boton.dataset.irSeccion
                );
            }
        );
    }
);


function cargarSeccionDesdeURL() {
    const seccionURL =
        window.location.hash
            .replace("#", "")
            .trim();

    const seccionesPermitidas = [
        "resumen",
        "reservas",
        "favoritos",
        "publicados",
        "datos"
    ];

    if (
        seccionesPermitidas.includes(
            seccionURL
        )
    ) {
        cambiarSeccion(
            seccionURL
        );

        return;
    }

    cambiarSeccion("resumen");
}


if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener(
        "click",
        () => {
            localStorage.removeItem(
                "sesionSuralia"
            );

            window.location.href =
                "login.html";
        }
    );
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
                document.querySelector(
                    "#perfil-nombre"
                );

            const campoApellidos =
                document.querySelector(
                    "#perfil-apellidos"
                );

            const campoEmail =
                document.querySelector(
                    "#perfil-email"
                );

            const campoTelefono =
                document.querySelector(
                    "#perfil-telefono"
                );

            const nombre =
                campoNombre?.value.trim() ||
                "";

            const apellidos =
                campoApellidos?.value.trim() ||
                "";

            const email =
                campoEmail?.value
                    .trim()
                    .toLowerCase() ||
                "";

            const telefono =
                campoTelefono?.value.trim() ||
                "";

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

            const errorTelefono =
                document.querySelector(
                    "#error-perfil-telefono"
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

            if (errorTelefono) {
                errorTelefono.textContent = "";
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

            if (
                !expresionEmail.test(
                    email
                )
            ) {
                if (errorEmail) {
                    errorEmail.textContent =
                        "Introduce un correo electrónico válido.";
                }

                formularioValido = false;
            }

            const telefonoLimpio =
                telefono.replace(
                    /[\s-]/g,
                    ""
                );

            if (
                telefonoLimpio &&
                !/^[6789]\d{8}$/.test(
                    telefonoLimpio
                )
            ) {
                if (errorTelefono) {
                    errorTelefono.textContent =
                        "Introduce un teléfono español válido de 9 cifras.";
                }

                formularioValido = false;
            }

            if (!formularioValido) {
                mostrarNotificacion(
                    "Revisa los campos del formulario."
                );

                return;
            }

            const emailAnterior =
                usuarioGuardado.email;

            usuarioGuardado.nombre =
                nombre;

            usuarioGuardado.apellidos =
                apellidos;

            usuarioGuardado.email =
                email;

            usuarioGuardado.telefono =
                telefonoLimpio;

            guardarLocalStorage(
                "usuarioSuralia",
                usuarioGuardado
            );

            guardarLocalStorage(
                "sesionSuralia",
                {
                    nombre,
                    email,
                    conectado: true
                }
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
        const datos =
            leerLocalStorage(
                clave,
                []
            );

        if (!Array.isArray(datos)) {
            return;
        }

        const datosActualizados =
            datos.map((elemento) => {
                const actualizado = {
                    ...elemento
                };

                if (
                    elemento.usuarioEmail ===
                    emailAnterior
                ) {
                    actualizado.usuarioEmail =
                        emailNuevo;
                }

                if (
                    elemento.creadoPor ===
                    emailAnterior
                ) {
                    actualizado.creadoPor =
                        emailNuevo;
                }

                return actualizado;
            });

        guardarLocalStorage(
            clave,
            datosActualizados
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


function obtenerReservasGuardadas() {
    const reservas =
        leerLocalStorage(
            "reservasSuralia",
            []
        );

    return Array.isArray(reservas)
        ? reservas
        : [];
}


function obtenerFechaOrdenReserva(reserva) {
    const fechaIso =
        reserva.fechaIso ||
        reserva.fecha;

    if (
        fechaIso &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            fechaIso
        )
    ) {
        return new Date(
            `${fechaIso}T${
                reserva.hora ||
                "00:00"
            }`
        );
    }

    const equivalenciasFecha = {
        "25-julio-2026":
            "2026-07-25",

        "27-julio-2026":
            "2026-07-27",

        "29-julio-2026":
            "2026-07-29",

        "1-agosto-2026":
            "2026-08-01",

        "8-agosto-2026":
            "2026-08-08",

        "15-agosto-2026":
            "2026-08-15",

        "22-agosto-2026":
            "2026-08-22",

        "21-noviembre-2026":
            "2026-11-21"
    };

    const fechaConvertida =
        equivalenciasFecha[
            reserva.fechaValor
        ];

    if (fechaConvertida) {
        return new Date(
            `${fechaConvertida}T${
                reserva.hora ||
                "00:00"
            }`
        );
    }

    if (reserva.fechaReserva) {
        return new Date(
            reserva.fechaReserva
        );
    }

    return new Date(
        8640000000000000
    );
}


function obtenerReservasUsuario() {
    return obtenerReservasGuardadas()
        .filter((reserva) => {
            return (
                reserva.usuarioEmail ===
                    usuarioGuardado.email &&
                reserva.estado ===
                    "confirmada"
            );
        })
        .sort((reservaA, reservaB) => {
            return (
                obtenerFechaOrdenReserva(
                    reservaA
                ) -
                obtenerFechaOrdenReserva(
                    reservaB
                )
            );
        });
}


function obtenerEnlaceReserva(reserva) {
    if (
        reserva.enlace &&
        reserva.enlace !==
            "detalle-plan.html"
    ) {
        return reserva.enlace;
    }

    const enlacesPorPlan = {
        italica:
            "detalle-plan.html",

        "kayak-atardecer":
            "detalle-kayak.html",

        "poncho-k-cartuja":
            "detalle-poncho-k.html",

        "sierra-norte":
            "detalle-sierra-norte.html"
    };

    return (
        enlacesPorPlan[
            reserva.planId
        ] ||
        reserva.enlace ||
        "planes.html"
    );
}


function obtenerImagenReserva(reserva) {
    const imagenesPorPlan = {
        italica:
            "img/italica principal.jpg",

        "kayak-atardecer":
            "img/kayak principal.jpg",

        "poncho-k-cartuja":
            "img/poncho-k.jpg",

        "sierra-norte":
            "img/sierra-norte-principal.jpg"
    };

    const imagenAsignada =
        imagenesPorPlan[
            reserva.planId
        ];

    if (imagenAsignada) {
        return imagenAsignada;
    }

    if (
        reserva.imagen &&
        reserva.imagen.trim()
    ) {
        return reserva.imagen;
    }

    return imagenFallback;
}


function obtenerTextoCantidadReserva(
    reserva
) {
    const cantidad = Number(
        reserva.entradas ||
        reserva.personas ||
        1
    );

    const esConcierto =
        reserva.planId ===
            "poncho-k-cartuja" ||
        reserva.entradas !==
            undefined;

    if (esConcierto) {
        return `${cantidad} ${
            cantidad === 1
                ? "entrada"
                : "entradas"
        }`;
    }

    return `${cantidad} ${
        cantidad === 1
            ? "persona"
            : "personas"
    }`;
}


function obtenerIconoCantidadReserva(
    reserva
) {
    const esConcierto =
        reserva.planId ===
            "poncho-k-cartuja" ||
        reserva.entradas !==
            undefined;

    return esConcierto
        ? "fa-solid fa-ticket"
        : "fa-solid fa-user-group";
}


function obtenerPrecioReserva(reserva) {
    const total = Number(
        reserva.precioTotal
    );

    if (
        Number.isNaN(total) ||
        total === 0
    ) {
        return "Gratis";
    }

    return `${total
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function obtenerFechaTextoReserva(reserva) {
    return (
        reserva.fechaTexto ||
        reserva.fecha ||
        "Fecha pendiente"
    );
}


function obtenerHoraReserva(reserva) {
    return (
        reserva.hora ||
        "Hora pendiente"
    );
}


function crearProximaReservaHTML(reserva) {
    const enlace =
        obtenerEnlaceReserva(
            reserva
        );

    const imagen =
        obtenerImagenReserva(
            reserva
        );

    return `
        <article class="reserva-resumen">

            <div class="reserva-resumen__imagen">

                <img
                    src="${escaparHTML(imagen)}"
                    alt="${escaparHTML(
                        reserva.titulo ||
                        "Actividad reservada"
                    )}"
                    data-imagen-fallback
                >

            </div>

            <div class="reserva-resumen__contenido">

                <span class="reserva-estado">
                    <i class="fa-solid fa-circle-check"></i>
                    Confirmada
                </span>

                <h3>
                    ${escaparHTML(
                        reserva.titulo ||
                        "Actividad reservada"
                    )}
                </h3>

                <p>
                    <i class="fa-regular fa-calendar"></i>

                    ${escaparHTML(
                        obtenerFechaTextoReserva(
                            reserva
                        )
                    )}
                </p>

                <p>
                    <i class="fa-regular fa-clock"></i>

                    ${escaparHTML(
                        obtenerHoraReserva(
                            reserva
                        )
                    )}
                </p>

                <p>
                    <i class="${
                        obtenerIconoCantidadReserva(
                            reserva
                        )
                    }"></i>

                    ${escaparHTML(
                        obtenerTextoCantidadReserva(
                            reserva
                        )
                    )}
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>

                    ${escaparHTML(
                        reserva.ubicacion ||
                        "Ubicación pendiente"
                    )}
                </p>

                <p class="reserva-resumen__precio">
                    <i class="fa-solid fa-receipt"></i>

                    Total:

                    <strong>
                        ${obtenerPrecioReserva(
                            reserva
                        )}
                    </strong>
                </p>

                <a
                    href="${escaparHTML(enlace)}"
                    class="boton-ver-reserva"
                >
                    Ver actividad
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}


function crearReservaHTML(reserva) {
    const enlace =
        obtenerEnlaceReserva(
            reserva
        );

    const imagen =
        obtenerImagenReserva(
            reserva
        );

    return `
        <article
            class="reserva-item"
            data-reserva-id="${Number(
                reserva.id
            )}"
        >

            <div class="reserva-item__imagen">

                <img
                    src="${escaparHTML(imagen)}"
                    alt="${escaparHTML(
                        reserva.titulo ||
                        "Actividad reservada"
                    )}"
                    data-imagen-fallback
                >

            </div>

            <div class="reserva-item__contenido">

                <div class="reserva-item__superior">

                    <div>

                        <span class="reserva-estado">
                            <i class="fa-solid fa-circle-check"></i>
                            Confirmada
                        </span>

                        <h3>
                            ${escaparHTML(
                                reserva.titulo ||
                                "Actividad reservada"
                            )}
                        </h3>

                        <span class="reserva-item__categoria">
                            ${escaparHTML(
                                reserva.categoria ||
                                "Actividad"
                            )}
                        </span>

                    </div>

                    <strong class="reserva-item__precio">
                        ${obtenerPrecioReserva(
                            reserva
                        )}
                    </strong>

                </div>

                <div class="reserva-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${escaparHTML(
                            obtenerFechaTextoReserva(
                                reserva
                            )
                        )}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>

                        ${escaparHTML(
                            obtenerHoraReserva(
                                reserva
                            )
                        )}
                    </span>

                    <span>
                        <i class="${
                            obtenerIconoCantidadReserva(
                                reserva
                            )
                        }"></i>

                        ${escaparHTML(
                            obtenerTextoCantidadReserva(
                                reserva
                            )
                        )}
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>

                        ${escaparHTML(
                            reserva.ubicacion ||
                            "Ubicación pendiente"
                        )}
                    </span>

                </div>

                <div class="reserva-item__acciones">

                    <a
                        href="${escaparHTML(enlace)}"
                        class="boton-principal-pequeno"
                    >
                        <i class="fa-regular fa-eye"></i>
                        Ver actividad
                    </a>

                    <button
                        type="button"
                        class="boton-cancelar-reserva"
                        data-reserva-id="${Number(
                            reserva.id
                        )}"
                    >
                        <i class="fa-regular fa-calendar-xmark"></i>
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

        listaReservasPerfil.classList.add(
            "oculto"
        );

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

    listaReservasPerfil.classList.remove(
        "oculto"
    );

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

    activarFallbackImagenes(
        proximaReservaPerfil
    );

    activarFallbackImagenes(
        listaReservasPerfil
    );

    activarBotonesCancelarReserva();
}


function activarBotonesCancelarReserva() {
    document
        .querySelectorAll(
            ".boton-cancelar-reserva"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    reservaPendienteCancelar =
                        Number(
                            boton.dataset.reservaId
                        );

                    if (modalCancelacion) {
                        modalCancelacion.classList.add(
                            "visible"
                        );
                    }
                }
            );
        });
}


function cancelarReservaGuardada() {
    if (
        reservaPendienteCancelar ===
        null
    ) {
        return;
    }

    const reservas =
        obtenerReservasGuardadas();

    const reservasActualizadas =
        reservas.filter((reserva) => {
            return (
                Number(reserva.id) !==
                Number(
                    reservaPendienteCancelar
                )
            );
        });

    guardarLocalStorage(
        "reservasSuralia",
        reservasActualizadas
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


function cerrarModalCancelacion() {
    reservaPendienteCancelar = null;

    if (modalCancelacion) {
        modalCancelacion.classList.remove(
            "visible"
        );
    }
}


if (mantenerReserva) {
    mantenerReserva.addEventListener(
        "click",
        cerrarModalCancelacion
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
                cerrarModalCancelacion();
            }
        }
    );
}


/* =====================================================
   FAVORITOS
===================================================== */

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


function obtenerFavoritosUsuario() {
    const favoritos =
        leerLocalStorage(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        return [];
    }

    return favoritos
        .filter((favorito) => {
            return (
                favorito.usuarioEmail ===
                usuarioGuardado.email
            );
        })
        .sort((favoritoA, favoritoB) => {
            return (
                new Date(
                    favoritoB.fechaGuardado ||
                    0
                ) -
                new Date(
                    favoritoA.fechaGuardado ||
                    0
                )
            );
        });
}


function obtenerPrecioFavorito(precio) {
    const precioNumerico =
        Number(precio);

    if (!precioNumerico) {
        return "Gratis";
    }

    return `${precioNumerico
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function obtenerImagenFavorito(favorito) {
    const imagenesActualizadas = {
        "sierra-norte":
            "img/sierra-norte-principal.jpg",

        "kayak-atardecer":
            "img/kayak principal.jpg",

        "exposicion-contemporanea":
            "img/andaluz1.jpg",

        "italica":
            "img/italica principal.jpg",

        "poncho-k-cartuja":
            "img/poncho-k.jpg",

        "tapas-triana":
            "img/triana1.jpg",

        "cerro-hierro":
            "img/cerro1.jpg"
    };

    return (
        imagenesActualizadas[favorito.planId] ||
        favorito.imagen ||
        imagenFallback
    );
}

function obtenerEnlaceFavorito(favorito) {
    const enlaces = {
        italica:
            "detalle-plan.html",

        "kayak-atardecer":
            "detalle-kayak.html",

        "poncho-k-cartuja":
            "detalle-poncho-k.html",

        "sierra-norte":
            "detalle-sierra-norte.html"
    };

    return (
        enlaces[favorito.planId] ||
        favorito.enlace ||
        "planes.html"
    );
}


function crearFavoritoHTML(favorito) {
    const imagen =
        obtenerImagenFavorito(
            favorito
        );

    const enlace =
        obtenerEnlaceFavorito(
            favorito
        );

    return `
        <article
            class="tarjeta-plan"
            data-favorito-plan-id="${escaparHTML(
                favorito.planId
            )}"
        >

            <div class="tarjeta-plan__imagen">

                <img
                    src="${escaparHTML(imagen)}"
                    alt="${escaparHTML(
                        favorito.titulo ||
                        "Plan favorito"
                    )}"
                    data-imagen-fallback
                >

                <span class="tarjeta-plan__precio">
                    ${obtenerPrecioFavorito(
                        favorito.precio
                    )}
                </span>

                <button
                    type="button"
                    class="
                        tarjeta-plan__favorito
                        favorito-activo
                        boton-eliminar-favorito
                    "
                    data-plan-id="${escaparHTML(
                        favorito.planId
                    )}"
                    aria-label="Eliminar de favoritos"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

            <div class="tarjeta-plan__contenido">

                <div class="tarjeta-plan__meta">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${escaparHTML(
                            favorito.fechaTexto ||
                            "Fecha por confirmar"
                        )}
                    </span>

                </div>

                <h3>
                    ${escaparHTML(
                        favorito.titulo ||
                        "Plan favorito"
                    )}
                </h3>

                <p class="tarjeta-plan__ubicacion">
                    <i class="fa-solid fa-location-dot"></i>

                    ${escaparHTML(
                        favorito.ubicacion ||
                        "Ubicación pendiente"
                    )}
                </p>

                <div class="tarjeta-plan__pie">

                    <span>
                        ${escaparHTML(
                            favorito.categoria ||
                            "Actividad"
                        )}
                    </span>

                    <strong>
                        ${
                            favorito.valoracion ||
                            "Nuevo"
                        }

                        ${
                            favorito.valoracion
                                ? '<i class="fa-solid fa-star"></i>'
                                : ""
                        }
                    </strong>

                </div>

                <a
                    href="${escaparHTML(enlace)}"
                    class="boton-principal-pequeno"
                >
                    Ver actividad
                </a>

            </div>

        </article>
    `;
}


function mostrarFavoritosPerfil() {
    const favoritos =
        obtenerFavoritosUsuario();

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

        listaFavoritosPerfil.classList.add(
            "oculto"
        );

        estadoVacioFavoritos.classList.remove(
            "oculto"
        );

        return;
    }

    listaFavoritosPerfil.classList.remove(
        "oculto"
    );

    estadoVacioFavoritos.classList.add(
        "oculto"
    );

    listaFavoritosPerfil.innerHTML =
        favoritos
            .map(crearFavoritoHTML)
            .join("");

    activarFallbackImagenes(
        listaFavoritosPerfil
    );

    activarBotonesEliminarFavorito();
}


function activarBotonesEliminarFavorito() {
    document
        .querySelectorAll(
            ".boton-eliminar-favorito"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                (evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();

                    eliminarFavoritoGuardado(
                        boton.dataset.planId
                    );
                }
            );
        });
}


function eliminarFavoritoGuardado(planId) {
    const favoritos =
        leerLocalStorage(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        return;
    }

    const favoritosActualizados =
        favoritos.filter((favorito) => {
            const perteneceAlUsuario =
                favorito.usuarioEmail ===
                usuarioGuardado.email;

            const esMismoPlan =
                favorito.planId ===
                planId;

            return !(
                perteneceAlUsuario &&
                esMismoPlan
            );
        });

    guardarLocalStorage(
        "favoritosSuralia",
        favoritosActualizados
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
    const publicados =
        leerLocalStorage(
            "planesPublicadosSuralia",
            []
        );

    const borradores =
        leerLocalStorage(
            "borradoresSuralia",
            []
        );

    const listaPublicados =
        Array.isArray(publicados)
            ? publicados
            : [];

    const listaBorradores =
        Array.isArray(borradores)
            ? borradores
            : [];

    const emailUsuario =
        usuarioGuardado.email;

    const publicadosUsuario =
        listaPublicados
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
        listaBorradores
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
        ...publicadosUsuario,
        ...borradoresUsuario
    ].sort((planA, planB) => {
        return (
            new Date(
                planB.fechaCreacion ||
                0
            ) -
            new Date(
                planA.fechaCreacion ||
                0
            )
        );
    });
}


function formatearFechaPlan(fecha) {
    if (!fecha) {
        return "Fecha pendiente";
    }

    const fechaPlan =
        new Date(
            `${fecha}T00:00:00`
        );

    if (
        Number.isNaN(
            fechaPlan.getTime()
        )
    ) {
        return "Fecha pendiente";
    }

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

    return (
        estados[estado] ||
        estado ||
        "Sin estado"
    );
}


function crearPublicacionHTML(plan) {
    const precio =
        Number(plan.precio) === 0
            ? "Gratis"
            : `${Number(
                plan.precio ||
                0
            )
                .toFixed(2)
                .replace(".00", "")
                .replace(".", ",")} €`;

    const imagenPlan =
        plan.imagen
            ? `
                <img
                    src="${escaparHTML(
                        plan.imagen
                    )}"
                    alt="${escaparHTML(
                        plan.titulo ||
                        "Plan publicado"
                    )}"
                    data-imagen-fallback
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
                    data-plan-id="${Number(
                        plan.id
                    )}"
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
                    data-plan-id="${Number(
                        plan.id
                    )}"
                >
                    <i class="fa-regular fa-eye"></i>
                    Ver
                </button>
            `;

    return `
        <article
            class="publicacion-item"
            data-plan-id="${Number(
                plan.id
            )}"
            data-plan-estado="${escaparHTML(
                plan.estado ||
                ""
            )}"
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
                                estado-publicacion--${escaparHTML(
                                    plan.estado ||
                                    ""
                                )}
                            "
                        >
                            ${escaparHTML(
                                obtenerTextoEstado(
                                    plan.estado
                                )
                            )}
                        </span>

                        <h3>
                            ${escaparHTML(
                                plan.titulo ||
                                "Plan sin título"
                            )}
                        </h3>

                    </div>

                    <strong>
                        ${precio}
                    </strong>

                </div>

                <p class="publicacion-item__descripcion">

                    ${escaparHTML(
                        plan.descripcion ||
                        "Este plan todavía no tiene descripción."
                    )}

                </p>

                <div class="publicacion-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>

                        ${formatearFechaPlan(
                            plan.fecha
                        )}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>

                        ${escaparHTML(
                            plan.hora ||
                            "Hora pendiente"
                        )}
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>

                        ${escaparHTML(
                            plan.ubicacion ||
                            "Ubicación pendiente"
                        )}
                    </span>

                    <span>
                        <i class="fa-solid fa-user-group"></i>

                        ${Number(
                            plan.plazas ||
                            0
                        )} plazas
                    </span>

                </div>

                <div class="publicacion-item__pie">

                    <span class="publicacion-item__categoria">

                        ${escaparHTML(
                            plan.nombreCategoria ||
                            plan.categoria ||
                            "Sin categoría"
                        )}

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
                            data-plan-id="${Number(
                                plan.id
                            )}"
                            data-almacenamiento="${escaparHTML(
                                plan.almacenamiento
                            )}"
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
        contadorPublicaciones.textContent =
            planes.length;
    }

    if (contadorPendientes) {
        contadorPendientes.textContent =
            planes.filter((plan) => {
                return (
                    plan.estado ===
                    "pendiente"
                );
            }).length;
    }

    if (contadorBorradores) {
        contadorBorradores.textContent =
            planes.filter((plan) => {
                return (
                    plan.estado ===
                    "borrador"
                );
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
        "oculto",
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

    activarFallbackImagenes(
        listaPublicaciones
    );

    activarEventosPublicaciones();
}


function activarEventosPublicaciones() {
    document
        .querySelectorAll(
            ".boton-eliminar-plan"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    planPendienteEliminar = {
                        id:
                            Number(
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
                }
            );
        });

    document
        .querySelectorAll(
            ".boton-editar-plan"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    localStorage.setItem(
                        "borradorEditarSuralia",
                        String(
                            boton.dataset.planId
                        )
                    );

                    window.location.href =
                        "publicar-plan.html";
                }
            );
        });

    document
        .querySelectorAll(
            ".boton-ver-plan"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    mostrarNotificacion(
                        "La vista individual de este plan se añadirá más adelante."
                    );
                }
            );
        });
}


function eliminarPlanGuardado() {
    if (!planPendienteEliminar) {
        return;
    }

    const clave =
        planPendienteEliminar.almacenamiento;

    const planes =
        leerLocalStorage(
            clave,
            []
        );

    if (!Array.isArray(planes)) {
        return;
    }

    const planesActualizados =
        planes.filter((plan) => {
            return (
                Number(plan.id) !==
                planPendienteEliminar.id
            );
        });

    guardarLocalStorage(
        clave,
        planesActualizados
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


filtrosPublicaciones.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            () => {
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
            }
        );
    }
);


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
   CERRAR MODALES CON ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key !== "Escape") {
            return;
        }

        if (
            modalCancelacion?.classList.contains(
                "visible"
            )
        ) {
            cerrarModalCancelacion();
        }

        if (
            modalEliminarPlan?.classList.contains(
                "visible"
            )
        ) {
            modalEliminarPlan.classList.remove(
                "visible"
            );

            planPendienteEliminar = null;
        }
    }
);


/* =====================================================
   CARGA INICIAL
===================================================== */

function iniciarPerfil() {
    cargarDatosUsuario();
    mostrarReservasPerfil();
    mostrarFavoritosPerfil();
    mostrarPublicaciones();
    cargarSeccionDesdeURL();
    activarFallbackImagenes();
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPerfil
    );
} else {
    iniciarPerfil();
}