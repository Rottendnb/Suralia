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

const botonCancelarReserva = document.querySelector(
    ".boton-cancelar-reserva"
);

const modalCancelacion = document.querySelector(
    "#modal-cancelacion"
);

const mantenerReserva = document.querySelector(
    "#mantener-reserva"
);

const confirmarCancelacion = document.querySelector(
    "#confirmar-cancelacion"
);

let temporizadorNotificacion;

function obtenerIniciales(nombre, apellidos) {
    const inicialNombre = nombre?.trim().charAt(0) || "";
    const inicialApellido = apellidos?.trim().charAt(0) || "";

    return `${inicialNombre}${inicialApellido}`.toUpperCase();
}

function mostrarNotificacion(mensaje) {
    const texto = notificacionPerfil.querySelector("span");

    texto.textContent = mensaje;
    notificacionPerfil.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacionPerfil.classList.remove("visible");
    }, 3000);
}

function cargarDatosUsuario() {
    const nombreCompleto =
        `${usuarioGuardado.nombre} ${usuarioGuardado.apellidos}`.trim();

    const iniciales = obtenerIniciales(
        usuarioGuardado.nombre,
        usuarioGuardado.apellidos
    );

    document.querySelector("#nombre-header").textContent =
        usuarioGuardado.nombre;

    document.querySelector("#nombre-perfil").textContent =
        nombreCompleto;

    document.querySelector("#email-perfil").textContent =
        usuarioGuardado.email;

    document.querySelector("#saludo-usuario").textContent =
        usuarioGuardado.nombre;

    document.querySelector("#avatar-header").textContent =
        iniciales;

    document.querySelector("#avatar-perfil").textContent =
        iniciales;

    document.querySelector("#perfil-nombre").value =
        usuarioGuardado.nombre || "";

    document.querySelector("#perfil-apellidos").value =
        usuarioGuardado.apellidos || "";

    document.querySelector("#perfil-email").value =
        usuarioGuardado.email || "";

    document.querySelector("#perfil-telefono").value =
        usuarioGuardado.telefono || "";
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

botonesMenuPerfil.forEach((boton) => {
    boton.addEventListener("click", () => {
        cambiarSeccion(boton.dataset.seccion);
    });
});

enlacesSeccion.forEach((boton) => {
    boton.addEventListener("click", () => {
        cambiarSeccion(boton.dataset.irSeccion);
    });
});

botonCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("sesionSuralia");
    window.location.href = "login.html";
});

formularioPerfil.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document
        .querySelector("#perfil-nombre")
        .value
        .trim();

    const apellidos = document
        .querySelector("#perfil-apellidos")
        .value
        .trim();

    const email = document
        .querySelector("#perfil-email")
        .value
        .trim();

    const telefono = document
        .querySelector("#perfil-telefono")
        .value
        .trim();

    const errorNombre = document.querySelector(
        "#error-perfil-nombre"
    );

    const errorApellidos = document.querySelector(
        "#error-perfil-apellidos"
    );

    const errorEmail = document.querySelector(
        "#error-perfil-email"
    );

    errorNombre.textContent = "";
    errorApellidos.textContent = "";
    errorEmail.textContent = "";

    let formularioValido = true;

    if (nombre.length < 2) {
        errorNombre.textContent =
            "Introduce un nombre válido.";

        formularioValido = false;
    }

    if (apellidos.length < 2) {
        errorApellidos.textContent =
            "Introduce tus apellidos.";

        formularioValido = false;
    }

    const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionEmail.test(email)) {
        errorEmail.textContent =
            "Introduce un correo electrónico válido.";

        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

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

    cargarDatosUsuario();

    mostrarNotificacion(
        "Tus datos se han actualizado correctamente."
    );
});

botonCancelarReserva.addEventListener("click", () => {
    modalCancelacion.classList.add("visible");
});

mantenerReserva.addEventListener("click", () => {
    modalCancelacion.classList.remove("visible");
});

confirmarCancelacion.addEventListener("click", () => {
    const reserva = document.querySelector(".reserva-item");
    const resumen = document.querySelector(".reserva-resumen");

    reserva?.remove();
    resumen?.remove();

    modalCancelacion.classList.remove("visible");

    mostrarNotificacion(
        "La reserva se ha cancelado correctamente."
    );
});

modalCancelacion.addEventListener("click", (evento) => {
    if (evento.target === modalCancelacion) {
        modalCancelacion.classList.remove("visible");
    }
});

document
    .querySelectorAll(".perfil-favoritos .tarjeta-plan__favorito")
    .forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            const tarjeta = boton.closest(".tarjeta-plan");

            tarjeta.remove();

            mostrarNotificacion(
                "El plan se ha eliminado de favoritos."
            );
        });
    });

cargarDatosUsuario();