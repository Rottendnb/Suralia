const formularioLogin = document.querySelector("#formulario-login");
const formularioRegistro = document.querySelector("#formulario-registro");

const botonesPassword = document.querySelectorAll(
    ".boton-ver-password"
);

const notificacionAuth = document.querySelector(
    "#notificacion-auth"
);

let temporizadorNotificacion;

function mostrarNotificacion(mensaje) {
    if (!notificacionAuth) {
        return;
    }

    const texto = notificacionAuth.querySelector("span");

    texto.textContent = mensaje;

    notificacionAuth.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacionAuth.classList.remove("visible");
    }, 3000);
}

function mostrarError(input, idError, mensaje) {
    const mensajeError = document.querySelector(`#${idError}`);
    const control = input.closest(".campo-formulario__control");

    mensajeError.textContent = mensaje;
    control.classList.add("error");
}

function limpiarError(input, idError) {
    const mensajeError = document.querySelector(`#${idError}`);
    const control = input.closest(".campo-formulario__control");

    mensajeError.textContent = "";
    control.classList.remove("error");
}

function validarEmail(email) {
    const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresionEmail.test(email);
}

botonesPassword.forEach((boton) => {
    boton.addEventListener("click", () => {
        const idInput = boton.dataset.password;
        const input = document.querySelector(`#${idInput}`);
        const icono = boton.querySelector("i");

        const passwordVisible = input.type === "text";

        input.type = passwordVisible
            ? "password"
            : "text";

        icono.classList.toggle("fa-eye", passwordVisible);
        icono.classList.toggle("fa-eye-slash", !passwordVisible);

        boton.setAttribute(
            "aria-label",
            passwordVisible
                ? "Mostrar contraseña"
                : "Ocultar contraseña"
        );
    });
});

if (formularioLogin) {
    const emailLogin = document.querySelector("#login-email");
    const passwordLogin = document.querySelector("#login-password");

    formularioLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let formularioValido = true;

        const email = emailLogin.value.trim();
        const password = passwordLogin.value.trim();

        limpiarError(emailLogin, "error-login-email");
        limpiarError(passwordLogin, "error-login-password");

        if (!email) {
            mostrarError(
                emailLogin,
                "error-login-email",
                "Introduce tu correo electrónico."
            );

            formularioValido = false;
        } else if (!validarEmail(email)) {
            mostrarError(
                emailLogin,
                "error-login-email",
                "Introduce un correo electrónico válido."
            );

            formularioValido = false;
        }

        if (!password) {
            mostrarError(
                passwordLogin,
                "error-login-password",
                "Introduce tu contraseña."
            );

            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        const usuarioGuardado = JSON.parse(
            localStorage.getItem("usuarioSuralia")
        );

        if (
            !usuarioGuardado ||
            usuarioGuardado.email !== email ||
            usuarioGuardado.password !== password
        ) {
            mostrarError(
                passwordLogin,
                "error-login-password",
                "El correo o la contraseña no son correctos."
            );

            return;
        }

        localStorage.setItem(
            "sesionSuralia",
            JSON.stringify({
                nombre: usuarioGuardado.nombre,
                email: usuarioGuardado.email,
                conectado: true
            })
        );

        mostrarNotificacion(
            `Bienvenido de nuevo, ${usuarioGuardado.nombre}.`
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });

    emailLogin.addEventListener("input", () => {
        limpiarError(emailLogin, "error-login-email");
    });

    passwordLogin.addEventListener("input", () => {
        limpiarError(passwordLogin, "error-login-password");
    });
}

if (formularioRegistro) {
    const nombre = document.querySelector("#registro-nombre");
    const apellidos = document.querySelector("#registro-apellidos");
    const email = document.querySelector("#registro-email");
    const password = document.querySelector("#registro-password");
    const confirmarPassword = document.querySelector(
        "#registro-confirmar"
    );

    const aceptarCondiciones = document.querySelector(
        "#aceptar-condiciones"
    );

    const barraPassword = document.querySelector("#barra-password");

    const textoSeguridadPassword = document.querySelector(
        "#texto-seguridad-password"
    );

    function calcularSeguridadPassword(valor) {
        let puntuacion = 0;

        if (valor.length >= 8) {
            puntuacion++;
        }

        if (/[A-Z]/.test(valor)) {
            puntuacion++;
        }

        if (/[0-9]/.test(valor)) {
            puntuacion++;
        }

        if (/[^A-Za-z0-9]/.test(valor)) {
            puntuacion++;
        }

        return puntuacion;
    }

    function actualizarSeguridadPassword() {
        const valor = password.value;
        const puntuacion = calcularSeguridadPassword(valor);

        const niveles = [
            {
                ancho: "0%",
                texto: "Usa al menos 8 caracteres.",
                color: "#d94848"
            },
            {
                ancho: "25%",
                texto: "Contraseña muy débil.",
                color: "#d94848"
            },
            {
                ancho: "50%",
                texto: "Contraseña mejorable.",
                color: "#e58c34"
            },
            {
                ancho: "75%",
                texto: "Contraseña segura.",
                color: "#d1a72e"
            },
            {
                ancho: "100%",
                texto: "Contraseña muy segura.",
                color: "#2c8b63"
            }
        ];

        const nivel = niveles[puntuacion];

        barraPassword.style.width = nivel.ancho;
        barraPassword.style.backgroundColor = nivel.color;

        textoSeguridadPassword.textContent = nivel.texto;
        textoSeguridadPassword.style.color = nivel.color;
    }

    password.addEventListener(
        "input",
        actualizarSeguridadPassword
    );

    formularioRegistro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let formularioValido = true;

        const valorNombre = nombre.value.trim();
        const valorApellidos = apellidos.value.trim();
        const valorEmail = email.value.trim();
        const valorPassword = password.value;
        const valorConfirmar = confirmarPassword.value;

        limpiarError(
            nombre,
            "error-registro-nombre"
        );

        limpiarError(
            apellidos,
            "error-registro-apellidos"
        );

        limpiarError(
            email,
            "error-registro-email"
        );

        limpiarError(
            password,
            "error-registro-password"
        );

        limpiarError(
            confirmarPassword,
            "error-registro-confirmar"
        );

        document.querySelector("#error-condiciones").textContent = "";

        if (valorNombre.length < 2) {
            mostrarError(
                nombre,
                "error-registro-nombre",
                "Introduce un nombre válido."
            );

            formularioValido = false;
        }

        if (valorApellidos.length < 2) {
            mostrarError(
                apellidos,
                "error-registro-apellidos",
                "Introduce tus apellidos."
            );

            formularioValido = false;
        }

        if (!validarEmail(valorEmail)) {
            mostrarError(
                email,
                "error-registro-email",
                "Introduce un correo electrónico válido."
            );

            formularioValido = false;
        }

        if (valorPassword.length < 8) {
            mostrarError(
                password,
                "error-registro-password",
                "La contraseña debe tener al menos 8 caracteres."
            );

            formularioValido = false;
        }

        if (valorPassword !== valorConfirmar) {
            mostrarError(
                confirmarPassword,
                "error-registro-confirmar",
                "Las contraseñas no coinciden."
            );

            formularioValido = false;
        }

        if (!aceptarCondiciones.checked) {
            document.querySelector(
                "#error-condiciones"
            ).textContent =
                "Debes aceptar las condiciones para continuar.";

            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        const usuario = {
            nombre: valorNombre,
            apellidos: valorApellidos,
            email: valorEmail,
            password: valorPassword
        };

        localStorage.setItem(
            "usuarioSuralia",
            JSON.stringify(usuario)
        );

        mostrarNotificacion(
            "Tu cuenta se ha creado correctamente."
        );

        formularioRegistro.reset();
        actualizarSeguridadPassword();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1400);
    });

    [
        {
            input: nombre,
            error: "error-registro-nombre"
        },
        {
            input: apellidos,
            error: "error-registro-apellidos"
        },
        {
            input: email,
            error: "error-registro-email"
        },
        {
            input: password,
            error: "error-registro-password"
        },
        {
            input: confirmarPassword,
            error: "error-registro-confirmar"
        }
    ].forEach((campo) => {
        campo.input.addEventListener("input", () => {
            limpiarError(campo.input, campo.error);
        });
    });

    aceptarCondiciones.addEventListener("change", () => {
        document.querySelector(
            "#error-condiciones"
        ).textContent = "";
    });
}

const botonGoogle = document.querySelector("#login-google");

if (botonGoogle) {
    botonGoogle.addEventListener("click", () => {
        mostrarNotificacion(
            "El acceso con Google estará disponible próximamente."
        );
    });
}