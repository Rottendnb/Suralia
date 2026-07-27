/* =====================================================
   ELEMENTOS GENERALES
===================================================== */

const formularioLogin =
    document.querySelector(
        "#formulario-login"
    );

const formularioRegistro =
    document.querySelector(
        "#formulario-registro"
    );

const botonesPassword =
    document.querySelectorAll(
        ".boton-ver-password"
    );

const notificacionAuth =
    document.querySelector(
        "#notificacion-auth"
    );

const botonGoogle =
    document.querySelector(
        "#login-google"
    );

const botonRecuperarPassword =
    document.querySelector(
        "#recuperar-password"
    );

let temporizadorNotificacion;


/* =====================================================
   CLIENTE DE SUPABASE
===================================================== */

function obtenerClienteSupabase() {
    if (
        typeof clienteSupabase !==
        "undefined"
    ) {
        return clienteSupabase;
    }

    if (
        typeof supabaseCliente !==
        "undefined"
    ) {
        return supabaseCliente;
    }

    if (
        typeof supabaseClient !==
        "undefined"
    ) {
        return supabaseClient;
    }

    console.error(
        "No se ha encontrado el cliente de Supabase."
    );

    return null;
}

const clienteAuth =
    obtenerClienteSupabase();


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(
    mensaje,
    tipo = "exito"
) {
    if (!notificacionAuth) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionAuth.querySelector(
            "span"
        );

    const icono =
        notificacionAuth.querySelector(
            "i"
        );

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionAuth.classList.remove(
        "notificacion--error"
    );

    if (tipo === "error") {
        notificacionAuth.classList.add(
            "notificacion--error"
        );

        if (icono) {
            icono.className =
                "fa-solid fa-circle-exclamation";
        }
    } else if (icono) {
        icono.className =
            "fa-solid fa-circle-check";
    }

    notificacionAuth.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacion
    );

    temporizadorNotificacion =
        setTimeout(() => {
            notificacionAuth.classList.remove(
                "visible"
            );
        }, 3500);
}


/* =====================================================
   ERRORES DE FORMULARIO
===================================================== */

function mostrarError(
    input,
    idError,
    mensaje
) {
    if (!input) {
        return;
    }

    const mensajeError =
        document.querySelector(
            `#${idError}`
        );

    const control =
        input.closest(
            ".campo-formulario__control"
        );

    if (mensajeError) {
        mensajeError.textContent =
            mensaje;
    }

    if (control) {
        control.classList.add(
            "error"
        );
    }
}

function limpiarError(
    input,
    idError
) {
    if (!input) {
        return;
    }

    const mensajeError =
        document.querySelector(
            `#${idError}`
        );

    const control =
        input.closest(
            ".campo-formulario__control"
        );

    if (mensajeError) {
        mensajeError.textContent = "";
    }

    if (control) {
        control.classList.remove(
            "error"
        );
    }
}

function validarEmail(email) {
    const expresionEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresionEmail.test(
        email
    );
}


/* =====================================================
   ESTADO DE LOS BOTONES
===================================================== */

function cambiarEstadoBoton(
    boton,
    cargando,
    textoNormal,
    textoCargando
) {
    if (!boton) {
        return;
    }

    boton.disabled = cargando;

    if (cargando) {
        boton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${textoCargando}
        `;
    } else {
        boton.innerHTML = `
            ${textoNormal}
            <i class="fa-solid fa-arrow-right"></i>
        `;
    }
}


/* =====================================================
   SESIÓN LOCAL PARA SURALIA
===================================================== */

function guardarSesionSuralia(
    usuarioSupabase
) {
    const metadatos =
        usuarioSupabase.user_metadata ||
        {};

    const usuarioAnterior =
        JSON.parse(
            localStorage.getItem(
                "usuarioSuralia"
            )
        ) || {};

    const nombre =
        metadatos.nombre ||
        metadatos.full_name
            ?.split(" ")[0] ||
        usuarioAnterior.nombre ||
        usuarioSupabase.email
            ?.split("@")[0] ||
        "Usuario";

    const apellidos =
        metadatos.apellidos ||
        usuarioAnterior.apellidos ||
        "";

    const mismoUsuario =
        !usuarioAnterior.email ||
        usuarioAnterior.email ===
            usuarioSupabase.email;

    const usuarioSuralia = {
        id:
            usuarioSupabase.id,

        nombre,

        apellidos,

        email:
            usuarioSupabase.email ||
            "",

        telefono:
            mismoUsuario
                ? usuarioAnterior.telefono ||
                  ""
                : "",

        avatarTipo:
            mismoUsuario
                ? usuarioAnterior.avatarTipo ||
                  ""
                : "",

        avatarValor:
            mismoUsuario
                ? usuarioAnterior.avatarValor ||
                  ""
                : ""
    };

    const sesionSuralia = {
        id:
            usuarioSupabase.id,

        nombre,

        apellidos,

        email:
            usuarioSupabase.email ||
            "",

        conectado:
            true
    };

    localStorage.setItem(
        "usuarioSuralia",
        JSON.stringify(
            usuarioSuralia
        )
    );

    localStorage.setItem(
        "sesionSuralia",
        JSON.stringify(
            sesionSuralia
        )
    );
}

/* =====================================================
   REDIRECCIÓN DESPUÉS DEL LOGIN
===================================================== */

function obtenerPaginaDestino() {
    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const destinoURL =
        parametros.get(
            "redirect"
        );

    const destinoGuardado =
        sessionStorage.getItem(
            "destinoDespuesLoginSuralia"
        );

    const destino =
        destinoURL ||
        destinoGuardado ||
        "perfil.html";

    sessionStorage.removeItem(
        "destinoDespuesLoginSuralia"
    );

    if (
        destino.startsWith("http://") ||
        destino.startsWith("https://") ||
        destino.startsWith("//")
    ) {
        return "perfil.html";
    }

    return destino;
}


/* =====================================================
   MOSTRAR Y OCULTAR CONTRASEÑAS
===================================================== */

botonesPassword.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            () => {
                const idInput =
                    boton.dataset.password;

                const input =
                    document.querySelector(
                        `#${idInput}`
                    );

                const icono =
                    boton.querySelector(
                        "i"
                    );

                if (!input) {
                    return;
                }

                const passwordVisible =
                    input.type === "text";

                input.type =
                    passwordVisible
                        ? "password"
                        : "text";

                if (icono) {
                    icono.classList.toggle(
                        "fa-eye",
                        passwordVisible
                    );

                    icono.classList.toggle(
                        "fa-eye-slash",
                        !passwordVisible
                    );
                }

                boton.setAttribute(
                    "aria-label",
                    passwordVisible
                        ? "Mostrar contraseña"
                        : "Ocultar contraseña"
                );
            }
        );
    }
);


/* =====================================================
   COMPROBAR SI YA EXISTE SESIÓN
===================================================== */

async function comprobarSesionActiva() {
    if (!clienteAuth) {
        return;
    }

    try {
        const {
            data,
            error
        } =
            await clienteAuth.auth.getSession();

        if (error) {
            console.error(
                "Error al comprobar la sesión:",
                error
            );

            return;
        }

        const usuario =
            data.session?.user;

        if (!usuario) {
            return;
        }

        guardarSesionSuralia(
            usuario
        );

        const paginaActual =
            window.location.pathname
                .split("/")
                .pop();

        if (
            paginaActual ===
                "login.html" ||
            paginaActual ===
                "registro.html"
        ) {
            window.location.replace(
                obtenerPaginaDestino()
            );
        }
    } catch (error) {
        console.error(
            "No se pudo comprobar la sesión:",
            error
        );
    }
}


/* =====================================================
   INICIO DE SESIÓN
===================================================== */

if (formularioLogin) {
    const emailLogin =
        document.querySelector(
            "#login-email"
        );

    const passwordLogin =
        document.querySelector(
            "#login-password"
        );

    const botonEnviar =
        formularioLogin.querySelector(
            'button[type="submit"]'
        );

    formularioLogin.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            let formularioValido =
                true;

            const email =
                emailLogin.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordLogin.value;

            limpiarError(
                emailLogin,
                "error-login-email"
            );

            limpiarError(
                passwordLogin,
                "error-login-password"
            );

            if (!email) {
                mostrarError(
                    emailLogin,
                    "error-login-email",
                    "Introduce tu correo electrónico."
                );

                formularioValido =
                    false;
            } else if (
                !validarEmail(email)
            ) {
                mostrarError(
                    emailLogin,
                    "error-login-email",
                    "Introduce un correo electrónico válido."
                );

                formularioValido =
                    false;
            }

            if (!password) {
                mostrarError(
                    passwordLogin,
                    "error-login-password",
                    "Introduce tu contraseña."
                );

                formularioValido =
                    false;
            }

            if (!formularioValido) {
                return;
            }

            if (!clienteAuth) {
                mostrarNotificacion(
                    "No se ha podido conectar con el servicio de acceso.",
                    "error"
                );

                return;
            }

            cambiarEstadoBoton(
                botonEnviar,
                true,
                "Iniciar sesión",
                "Iniciando sesión..."
            );

            try {
                const {
                    data,
                    error
                } =
                    await clienteAuth.auth
                        .signInWithPassword({
                            email,
                            password
                        });

                if (error) {
                    console.error(
                        "Error de acceso:",
                        error
                    );

                    mostrarError(
                        passwordLogin,
                        "error-login-password",
                        traducirErrorSupabase(
                            error.message
                        )
                    );

                    return;
                }

                if (!data.user) {
                    mostrarNotificacion(
                        "No se ha podido recuperar la información del usuario.",
                        "error"
                    );

                    return;
                }

                guardarSesionSuralia(
                    data.user
                );

                mostrarNotificacion(
                    `Bienvenido de nuevo, ${
                        data.user
                            .user_metadata
                            ?.nombre ||
                        data.user.email
                            ?.split("@")[0] ||
                        "usuario"
                    }.`
                );

                setTimeout(() => {
                    window.location.href =
                        obtenerPaginaDestino();
                }, 1000);
            } catch (error) {
                console.error(
                    "Error inesperado durante el acceso:",
                    error
                );

                mostrarNotificacion(
                    "Se ha producido un error. Inténtalo de nuevo.",
                    "error"
                );
            } finally {
                cambiarEstadoBoton(
                    botonEnviar,
                    false,
                    "Iniciar sesión",
                    "Iniciando sesión..."
                );
            }
        }
    );

    emailLogin.addEventListener(
        "input",
        () => {
            limpiarError(
                emailLogin,
                "error-login-email"
            );
        }
    );

    passwordLogin.addEventListener(
        "input",
        () => {
            limpiarError(
                passwordLogin,
                "error-login-password"
            );
        }
    );
}


/* =====================================================
   REGISTRO
===================================================== */

if (formularioRegistro) {
    const nombre =
        document.querySelector(
            "#registro-nombre"
        );

    const apellidos =
        document.querySelector(
            "#registro-apellidos"
        );

    const email =
        document.querySelector(
            "#registro-email"
        );

    const password =
        document.querySelector(
            "#registro-password"
        );

    const confirmarPassword =
        document.querySelector(
            "#registro-confirmar"
        );

    const aceptarCondiciones =
        document.querySelector(
            "#aceptar-condiciones"
        );

    const barraPassword =
        document.querySelector(
            "#barra-password"
        );

    const textoSeguridadPassword =
        document.querySelector(
            "#texto-seguridad-password"
        );

    const errorCondiciones =
        document.querySelector(
            "#error-condiciones"
        );

    const botonEnviar =
        formularioRegistro.querySelector(
            'button[type="submit"]'
        );

    function calcularSeguridadPassword(
        valor
    ) {
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

        if (
            /[^A-Za-z0-9]/.test(
                valor
            )
        ) {
            puntuacion++;
        }

        return puntuacion;
    }

    function actualizarSeguridadPassword() {
        if (
            !barraPassword ||
            !textoSeguridadPassword
        ) {
            return;
        }

        const valor =
            password.value;

        const puntuacion =
            calcularSeguridadPassword(
                valor
            );

        const niveles = [
            {
                ancho: "0%",
                texto:
                    "Usa al menos 8 caracteres.",
                color: "#d94848"
            },
            {
                ancho: "25%",
                texto:
                    "Contraseña muy débil.",
                color: "#d94848"
            },
            {
                ancho: "50%",
                texto:
                    "Contraseña mejorable.",
                color: "#e58c34"
            },
            {
                ancho: "75%",
                texto:
                    "Contraseña segura.",
                color: "#d1a72e"
            },
            {
                ancho: "100%",
                texto:
                    "Contraseña muy segura.",
                color: "#2c8b63"
            }
        ];

        const nivel =
            niveles[puntuacion];

        barraPassword.style.width =
            nivel.ancho;

        barraPassword.style
            .backgroundColor =
            nivel.color;

        textoSeguridadPassword
            .textContent =
            nivel.texto;

        textoSeguridadPassword
            .style.color =
            nivel.color;
    }

    password.addEventListener(
        "input",
        actualizarSeguridadPassword
    );

    formularioRegistro.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            let formularioValido =
                true;

            const valorNombre =
                nombre.value.trim();

            const valorApellidos =
                apellidos.value.trim();

            const valorEmail =
                email.value
                    .trim()
                    .toLowerCase();

            const valorPassword =
                password.value;

            const valorConfirmar =
                confirmarPassword.value;

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

            if (errorCondiciones) {
                errorCondiciones.textContent =
                    "";
            }

            if (
                valorNombre.length < 2
            ) {
                mostrarError(
                    nombre,
                    "error-registro-nombre",
                    "Introduce un nombre válido."
                );

                formularioValido =
                    false;
            }

            if (
                valorApellidos.length < 2
            ) {
                mostrarError(
                    apellidos,
                    "error-registro-apellidos",
                    "Introduce tus apellidos."
                );

                formularioValido =
                    false;
            }

            if (
                !validarEmail(
                    valorEmail
                )
            ) {
                mostrarError(
                    email,
                    "error-registro-email",
                    "Introduce un correo electrónico válido."
                );

                formularioValido =
                    false;
            }

            if (
                valorPassword.length < 8
            ) {
                mostrarError(
                    password,
                    "error-registro-password",
                    "La contraseña debe tener al menos 8 caracteres."
                );

                formularioValido =
                    false;
            }

            if (
                valorPassword !==
                valorConfirmar
            ) {
                mostrarError(
                    confirmarPassword,
                    "error-registro-confirmar",
                    "Las contraseñas no coinciden."
                );

                formularioValido =
                    false;
            }

            if (
                !aceptarCondiciones
                    ?.checked
            ) {
                if (errorCondiciones) {
                    errorCondiciones
                        .textContent =
                        "Debes aceptar las condiciones para continuar.";
                }

                formularioValido =
                    false;
            }

            if (!formularioValido) {
                return;
            }

            if (!clienteAuth) {
                mostrarNotificacion(
                    "No se ha podido conectar con el servicio de registro.",
                    "error"
                );

                return;
            }

            cambiarEstadoBoton(
                botonEnviar,
                true,
                "Crear cuenta",
                "Creando cuenta..."
            );

            try {
                const {
                    data,
                    error
                } =
                    await clienteAuth.auth
                        .signUp({
                            email:
                                valorEmail,
                            password:
                                valorPassword,
                            options: {
                                data: {
                                    nombre:
                                        valorNombre,
                                    apellidos:
                                        valorApellidos
                                }
                            }
                        });

                if (error) {
                    console.error(
                        "Error de registro:",
                        error
                    );

                    mostrarError(
                        email,
                        "error-registro-email",
                        traducirErrorSupabase(
                            error.message
                        )
                    );

                    return;
                }

                formularioRegistro.reset();

                actualizarSeguridadPassword();

                if (data.session) {
                    guardarSesionSuralia(
                        data.user
                    );

                    mostrarNotificacion(
                        "Tu cuenta se ha creado correctamente."
                    );

                    setTimeout(() => {
                        window.location.href =
                            "perfil.html";
                    }, 1200);

                    return;
                }

                mostrarNotificacion(
                    "Cuenta creada. Revisa tu correo para confirmar el registro."
                );

                setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 2500);
            } catch (error) {
                console.error(
                    "Error inesperado durante el registro:",
                    error
                );

                mostrarNotificacion(
                    "No se ha podido crear la cuenta. Inténtalo de nuevo.",
                    "error"
                );
            } finally {
                cambiarEstadoBoton(
                    botonEnviar,
                    false,
                    "Crear cuenta",
                    "Creando cuenta..."
                );
            }
        }
    );

    [
        {
            input: nombre,
            error:
                "error-registro-nombre"
        },
        {
            input: apellidos,
            error:
                "error-registro-apellidos"
        },
        {
            input: email,
            error:
                "error-registro-email"
        },
        {
            input: password,
            error:
                "error-registro-password"
        },
        {
            input:
                confirmarPassword,
            error:
                "error-registro-confirmar"
        }
    ].forEach((campo) => {
        campo.input?.addEventListener(
            "input",
            () => {
                limpiarError(
                    campo.input,
                    campo.error
                );
            }
        );
    });

    aceptarCondiciones
        ?.addEventListener(
            "change",
            () => {
                if (
                    errorCondiciones
                ) {
                    errorCondiciones
                        .textContent =
                        "";
                }
            }
        );
}


/* =====================================================
   ACCESO CON GOOGLE
===================================================== */

if (botonGoogle) {
    botonGoogle.addEventListener(
        "click",
        async () => {
            if (!clienteAuth) {
                mostrarNotificacion(
                    "No se ha podido conectar con Google.",
                    "error"
                );

                return;
            }

            botonGoogle.disabled = true;

            botonGoogle.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Conectando con Google...
            `;

            try {
                const urlRedireccion =
                    new URL(
                        "perfil.html",
                        window.location.href
                    ).href;

                const {
                    error
                } =
                    await clienteAuth.auth
                        .signInWithOAuth({
                            provider:
                                "google",
                            options: {
                                redirectTo:
                                    urlRedireccion
                            }
                        });

                if (error) {
                    throw error;
                }
            } catch (error) {
                console.error(
                    "Error con Google:",
                    error
                );

                mostrarNotificacion(
                    "No se ha podido iniciar sesión con Google.",
                    "error"
                );

                botonGoogle.disabled =
                    false;

                botonGoogle.innerHTML = `
                    <i class="fa-brands fa-google"></i>
                    Continuar con Google
                `;
            }
        }
    );
}


/* =====================================================
   RECUPERACIÓN DE CONTRASEÑA
===================================================== */

if (botonRecuperarPassword) {
    botonRecuperarPassword.addEventListener(
        "click",
        async () => {
            const emailLogin =
                document.querySelector(
                    "#login-email"
                );

            const email =
                emailLogin?.value
                    .trim()
                    .toLowerCase();

            limpiarError(
                emailLogin,
                "error-login-email"
            );

            if (
                !email ||
                !validarEmail(email)
            ) {
                mostrarError(
                    emailLogin,
                    "error-login-email",
                    "Introduce primero un correo electrónico válido."
                );

                emailLogin?.focus();

                return;
            }

            if (!clienteAuth) {
                mostrarNotificacion(
                    "No se ha podido conectar con el servicio.",
                    "error"
                );

                return;
            }

            botonRecuperarPassword
                .disabled = true;

            try {
                const {
                    error
                } =
                    await clienteAuth.auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    new URL(
                                        "restablecer-password.html",
                                        window.location.href
                                    ).href
                            }
                        );

                if (error) {
                    throw error;
                }

                mostrarNotificacion(
                    "Te hemos enviado un enlace para restablecer la contraseña."
                );
            } catch (error) {
                console.error(
                    "Error al recuperar la contraseña:",
                    error
                );

                mostrarNotificacion(
                    "No se ha podido enviar el correo de recuperación.",
                    "error"
                );
            } finally {
                botonRecuperarPassword
                    .disabled = false;
            }
        }
    );
}


/* =====================================================
   TRADUCCIÓN DE ERRORES DE SUPABASE
===================================================== */

function traducirErrorSupabase(
    mensaje = ""
) {
    const mensajeNormalizado =
        mensaje.toLowerCase();

    if (
        mensajeNormalizado.includes(
            "invalid login credentials"
        )
    ) {
        return "El correo o la contraseña no son correctos.";
    }

    if (
        mensajeNormalizado.includes(
            "email not confirmed"
        )
    ) {
        return "Debes confirmar tu correo electrónico antes de iniciar sesión.";
    }

    if (
        mensajeNormalizado.includes(
            "user already registered"
        )
    ) {
        return "Ya existe una cuenta registrada con este correo.";
    }

    if (
        mensajeNormalizado.includes(
            "password should be"
        )
    ) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }

    if (
        mensajeNormalizado.includes(
            "signup is disabled"
        )
    ) {
        return "El registro de usuarios no está disponible en este momento.";
    }

    if (
        mensajeNormalizado.includes(
            "rate limit"
        ) ||
        mensajeNormalizado.includes(
            "too many requests"
        )
    ) {
        return "Has realizado demasiados intentos. Espera unos minutos.";
    }

    return "Se ha producido un error. Revisa los datos e inténtalo de nuevo.";
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

comprobarSesionActiva();