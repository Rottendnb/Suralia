/* =====================================================
   ELEMENTOS
===================================================== */

const formularioRestablecer =
    document.querySelector(
        "#formulario-restablecer-password"
    );

const nuevaPassword =
    document.querySelector(
        "#nueva-password"
    );

const confirmarNuevaPassword =
    document.querySelector(
        "#confirmar-nueva-password"
    );

const botonRestablecer =
    document.querySelector(
        "#boton-restablecer-password"
    );

const estadoEnlace =
    document.querySelector(
        "#estado-enlace-recuperacion"
    );

const notificacionAuth =
    document.querySelector(
        "#notificacion-auth"
    );

const barraPassword =
    document.querySelector(
        "#barra-password"
    );

const textoSeguridadPassword =
    document.querySelector(
        "#texto-seguridad-password"
    );

const botonesPassword =
    document.querySelectorAll(
        ".boton-ver-password"
    );

let temporizadorNotificacion;
let recuperacionValida = false;


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

const clienteRestablecer =
    obtenerClienteSupabase();


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(
    mensaje,
    tipo = "exito"
) {
    if (!notificacionAuth) {
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
        }, 4000);
}


/* =====================================================
   ERRORES DE FORMULARIO
===================================================== */

function mostrarError(
    input,
    idError,
    mensaje
) {
    const mensajeError =
        document.querySelector(
            `#${idError}`
        );

    const control =
        input?.closest(
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
    const mensajeError =
        document.querySelector(
            `#${idError}`
        );

    const control =
        input?.closest(
            ".campo-formulario__control"
        );

    if (mensajeError) {
        mensajeError.textContent =
            "";
    }

    if (control) {
        control.classList.remove(
            "error"
        );
    }
}


/* =====================================================
   ESTADO DEL ENLACE
===================================================== */

function mostrarEnlaceInvalido() {
    recuperacionValida = false;

    if (formularioRestablecer) {
        formularioRestablecer.hidden =
            true;
    }

    if (estadoEnlace) {
        estadoEnlace.classList.remove(
            "auth__estado--oculto"
        );
    }
}

function mostrarFormulario() {
    recuperacionValida = true;

    if (formularioRestablecer) {
        formularioRestablecer.hidden =
            false;
    }

    if (estadoEnlace) {
        estadoEnlace.classList.add(
            "auth__estado--oculto"
        );
    }
}


/* =====================================================
   COMPROBAR LA SESIÓN DE RECUPERACIÓN
===================================================== */

async function comprobarRecuperacion() {
    if (!clienteRestablecer) {
        mostrarEnlaceInvalido();

        mostrarNotificacion(
            "No se ha podido conectar con el servicio.",
            "error"
        );

        return;
    }

    const {
        data: suscripcion
    } =
        clienteRestablecer.auth
            .onAuthStateChange(
                (evento, sesion) => {
                    if (
                        evento ===
                        "PASSWORD_RECOVERY"
                    ) {
                        mostrarFormulario();
                    }

                    if (
                        evento ===
                            "SIGNED_IN" &&
                        sesion
                    ) {
                        mostrarFormulario();
                    }
                }
            );

    try {
        const {
            data,
            error
        } =
            await clienteRestablecer.auth
                .getSession();

        if (error) {
            console.error(
                "Error al comprobar la recuperación:",
                error
            );

            mostrarEnlaceInvalido();

            return;
        }

        if (data.session) {
            mostrarFormulario();
            return;
        }

        window.setTimeout(() => {
            if (!recuperacionValida) {
                mostrarEnlaceInvalido();
            }
        }, 1500);
    } catch (error) {
        console.error(
            "No se pudo comprobar el enlace:",
            error
        );

        mostrarEnlaceInvalido();
    }

    window.addEventListener(
        "beforeunload",
        () => {
            suscripcion?.subscription
                ?.unsubscribe();
        }
    );
}


/* =====================================================
   MOSTRAR CONTRASEÑAS
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

                const visible =
                    input.type === "text";

                input.type =
                    visible
                        ? "password"
                        : "text";

                if (icono) {
                    icono.classList.toggle(
                        "fa-eye",
                        visible
                    );

                    icono.classList.toggle(
                        "fa-eye-slash",
                        !visible
                    );
                }

                boton.setAttribute(
                    "aria-label",
                    visible
                        ? "Mostrar contraseña"
                        : "Ocultar contraseña"
                );
            }
        );
    }
);


/* =====================================================
   SEGURIDAD DE LA CONTRASEÑA
===================================================== */

function calcularSeguridadPassword(
    password
) {
    let puntuacion = 0;

    if (password.length >= 8) {
        puntuacion++;
    }

    if (/[A-Z]/.test(password)) {
        puntuacion++;
    }

    if (/[0-9]/.test(password)) {
        puntuacion++;
    }

    if (
        /[^A-Za-z0-9]/.test(password)
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

    const puntuacion =
        calcularSeguridadPassword(
            nuevaPassword.value
        );

    const niveles = [
        {
            ancho: "0%",
            texto:
                "Usa al menos 8 caracteres."
        },
        {
            ancho: "25%",
            texto:
                "Contraseña muy débil."
        },
        {
            ancho: "50%",
            texto:
                "Contraseña mejorable."
        },
        {
            ancho: "75%",
            texto:
                "Contraseña segura."
        },
        {
            ancho: "100%",
            texto:
                "Contraseña muy segura."
        }
    ];

    const nivel =
        niveles[puntuacion];

    barraPassword.style.width =
        nivel.ancho;

    textoSeguridadPassword.textContent =
        nivel.texto;
}

nuevaPassword?.addEventListener(
    "input",
    () => {
        limpiarError(
            nuevaPassword,
            "error-nueva-password"
        );

        actualizarSeguridadPassword();
    }
);

confirmarNuevaPassword
    ?.addEventListener(
        "input",
        () => {
            limpiarError(
                confirmarNuevaPassword,
                "error-confirmar-nueva-password"
            );
        }
    );


/* =====================================================
   CAMBIAR CONTRASEÑA
===================================================== */

formularioRestablecer
    ?.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            limpiarError(
                nuevaPassword,
                "error-nueva-password"
            );

            limpiarError(
                confirmarNuevaPassword,
                "error-confirmar-nueva-password"
            );

            if (!recuperacionValida) {
                mostrarNotificacion(
                    "El enlace de recuperación no es válido o ha caducado.",
                    "error"
                );

                return;
            }

            const password =
                nuevaPassword.value;

            const confirmacion =
                confirmarNuevaPassword.value;

            let formularioValido =
                true;

            if (
                password.length < 8
            ) {
                mostrarError(
                    nuevaPassword,
                    "error-nueva-password",
                    "La contraseña debe tener al menos 8 caracteres."
                );

                formularioValido =
                    false;
            }

            if (
                password !== confirmacion
            ) {
                mostrarError(
                    confirmarNuevaPassword,
                    "error-confirmar-nueva-password",
                    "Las contraseñas no coinciden."
                );

                formularioValido =
                    false;
            }

            if (!formularioValido) {
                return;
            }

            botonRestablecer.disabled =
                true;

            botonRestablecer.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Guardando contraseña...
            `;

            try {
                const {
                    data,
                    error
                } =
                    await clienteRestablecer.auth
                        .updateUser({
                            password
                        });

                if (error) {
                    throw error;
                }

                if (!data.user) {
                    throw new Error(
                        "No se ha podido actualizar el usuario."
                    );
                }

                localStorage.removeItem(
                    "sesionSuralia"
                );

                localStorage.removeItem(
                    "usuarioSuralia"
                );

                formularioRestablecer.reset();

                actualizarSeguridadPassword();

                mostrarNotificacion(
                    "Tu contraseña se ha actualizado correctamente."
                );

                await clienteRestablecer.auth
                    .signOut();

                window.setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1800);
            } catch (error) {
                console.error(
                    "Error al cambiar la contraseña:",
                    error
                );

                mostrarNotificacion(
                    traducirErrorSupabase(
                        error.message
                    ),
                    "error"
                );
            } finally {
                botonRestablecer.disabled =
                    false;

                botonRestablecer.innerHTML = `
                    Guardar nueva contraseña
                    <i class="fa-solid fa-arrow-right"></i>
                `;
            }
        }
    );


/* =====================================================
   TRADUCCIÓN DE ERRORES
===================================================== */

function traducirErrorSupabase(
    mensaje = ""
) {
    const mensajeNormalizado =
        mensaje.toLowerCase();

    if (
        mensajeNormalizado.includes(
            "same password"
        )
    ) {
        return "La nueva contraseña debe ser diferente de la anterior.";
    }

    if (
        mensajeNormalizado.includes(
            "password should be"
        )
    ) {
        return "La contraseña no cumple los requisitos mínimos.";
    }

    if (
        mensajeNormalizado.includes(
            "session"
        ) ||
        mensajeNormalizado.includes(
            "token"
        )
    ) {
        return "El enlace ha caducado. Solicita uno nuevo.";
    }

    return "No se ha podido actualizar la contraseña.";
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

comprobarRecuperacion();