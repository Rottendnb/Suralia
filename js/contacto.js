/* =====================================================
   FORMULARIO DE CONTACTO
   Versión Supabase V2 · Antispam básico
===================================================== */

const formularioContacto =
    document.querySelector("#formulario-contacto");

const campoNombre =
    document.querySelector("#contacto-nombre");

const campoApellidos =
    document.querySelector("#contacto-apellidos");

const campoEmail =
    document.querySelector("#contacto-email");

const campoMotivo =
    document.querySelector("#contacto-motivo");

const campoAsunto =
    document.querySelector("#contacto-asunto");

const campoMensaje =
    document.querySelector("#contacto-mensaje");

const campoPrivacidad =
    document.querySelector("#contacto-privacidad");

const campoContactoTrampa =
    document.querySelector("#contacto-website");

const contadorMensaje =
    document.querySelector("#contador-contacto-mensaje");

const notificacion =
    document.querySelector("#notificacion");

const motivosContactoPermitidos = [
    "reserva",
    "actividad",
    "publicacion",
    "cuenta",
    "colaboracion",
    "otro"
];

let temporizadorNotificacion;
let envioContactoEnCurso = false;
let momentoInicioFormulario = Date.now();

const TIEMPO_MINIMO_FORMULARIO_MS =
    2500;


/* =====================================================
   OBTENER CLIENTE DE SUPABASE
===================================================== */

function obtenerClienteSupabaseContacto() {
    if (window.clienteSupabase) {
        return window.clienteSupabase;
    }

    return null;
}


/* =====================================================
   MOSTRAR NOTIFICACIÓN
===================================================== */

function mostrarNotificacionContacto(mensaje) {
    if (!notificacion) {
        return;
    }

    const texto =
        notificacion.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacion.classList.remove("visible");
    }, 4500);
}


/* =====================================================
   ERRORES
===================================================== */

function mostrarError(campo, idError, mensaje) {
    const error =
        document.querySelector(idError);

    const contenedor =
        campo?.closest(".campo-formulario");

    if (error) {
        error.textContent = mensaje;
    }

    if (contenedor) {
        contenedor.classList.add("campo-error");
    }
}


function limpiarError(campo, idError) {
    const error =
        document.querySelector(idError);

    const contenedor =
        campo?.closest(".campo-formulario");

    if (error) {
        error.textContent = "";
    }

    if (contenedor) {
        contenedor.classList.remove("campo-error");
    }
}


function limpiarTodosLosErrores() {
    limpiarError(
        campoNombre,
        "#error-contacto-nombre"
    );

    limpiarError(
        campoApellidos,
        "#error-contacto-apellidos"
    );

    limpiarError(
        campoEmail,
        "#error-contacto-email"
    );

    limpiarError(
        campoMotivo,
        "#error-contacto-motivo"
    );

    limpiarError(
        campoAsunto,
        "#error-contacto-asunto"
    );

    limpiarError(
        campoMensaje,
        "#error-contacto-mensaje"
    );

    const errorPrivacidad =
        document.querySelector(
            "#error-contacto-privacidad"
        );

    if (errorPrivacidad) {
        errorPrivacidad.textContent = "";
    }
}


/* =====================================================
   CONTADOR DEL MENSAJE
===================================================== */

function actualizarContadorMensaje() {
    if (!campoMensaje || !contadorMensaje) {
        return;
    }

    contadorMensaje.textContent =
        `${campoMensaje.value.length} / 1000`;
}


if (campoMensaje) {
    campoMensaje.addEventListener(
        "input",
        actualizarContadorMensaje
    );
}


/* =====================================================
   LIMPIAR ERRORES AL ESCRIBIR
===================================================== */

campoNombre?.addEventListener("input", () => {
    limpiarError(
        campoNombre,
        "#error-contacto-nombre"
    );
});


campoApellidos?.addEventListener("input", () => {
    limpiarError(
        campoApellidos,
        "#error-contacto-apellidos"
    );
});


campoEmail?.addEventListener("input", () => {
    limpiarError(
        campoEmail,
        "#error-contacto-email"
    );
});


campoMotivo?.addEventListener("change", () => {
    limpiarError(
        campoMotivo,
        "#error-contacto-motivo"
    );
});


campoAsunto?.addEventListener("input", () => {
    limpiarError(
        campoAsunto,
        "#error-contacto-asunto"
    );
});


campoMensaje?.addEventListener("input", () => {
    limpiarError(
        campoMensaje,
        "#error-contacto-mensaje"
    );
});


campoPrivacidad?.addEventListener("change", () => {
    const error =
        document.querySelector(
            "#error-contacto-privacidad"
        );

    if (error) {
        error.textContent = "";
    }
});


/* =====================================================
   VALIDACIÓN
===================================================== */

function validarFormularioContacto() {
    limpiarTodosLosErrores();

    let formularioValido = true;

    const nombre =
        campoNombre?.value.trim() || "";

    const apellidos =
        campoApellidos?.value.trim() || "";

    const email =
        campoEmail?.value.trim() || "";

    const motivo =
        campoMotivo?.value || "";

    const asunto =
        campoAsunto?.value.trim() || "";

    const mensaje =
        campoMensaje?.value.trim() || "";

    const expresionEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (nombre.length < 2 || nombre.length > 80) {
        mostrarError(
            campoNombre,
            "#error-contacto-nombre",
            "El nombre debe tener entre 2 y 80 caracteres."
        );

        formularioValido = false;
    }


    if (
        apellidos.length < 2 ||
        apellidos.length > 120
    ) {
        mostrarError(
            campoApellidos,
            "#error-contacto-apellidos",
            "Los apellidos deben tener entre 2 y 120 caracteres."
        );

        formularioValido = false;
    }


    if (
        !expresionEmail.test(email) ||
        email.length > 254
    ) {
        mostrarError(
            campoEmail,
            "#error-contacto-email",
            "Introduce un correo electrónico válido."
        );

        formularioValido = false;
    }


    if (!motivosContactoPermitidos.includes(motivo)) {
        mostrarError(
            campoMotivo,
            "#error-contacto-motivo",
            "Selecciona el motivo de la consulta."
        );

        formularioValido = false;
    }


    if (asunto.length < 5 || asunto.length > 160) {
        mostrarError(
            campoAsunto,
            "#error-contacto-asunto",
            "El asunto debe tener entre 5 y 160 caracteres."
        );

        formularioValido = false;
    }


    if (mensaje.length < 20 || mensaje.length > 1000) {
        mostrarError(
            campoMensaje,
            "#error-contacto-mensaje",
            "El mensaje debe tener entre 20 y 1000 caracteres."
        );

        formularioValido = false;
    }


    if (!campoPrivacidad?.checked) {
        const error =
            document.querySelector(
                "#error-contacto-privacidad"
            );

        if (error) {
            error.textContent =
                "Debes aceptar la política de privacidad.";
        }

        formularioValido = false;
    }


    return formularioValido;
}


/* =====================================================
   ENVIAR MENSAJE A SUPABASE
===================================================== */

async function enviarMensajeContacto() {
    const cliente =
        obtenerClienteSupabaseContacto();

    if (!cliente) {
        throw new Error(
            "No se ha podido iniciar la conexión con Supabase."
        );
    }

    const nuevoMensaje = {
        nombre:
            campoNombre.value.trim(),

        apellidos:
            campoApellidos.value.trim(),

        email:
            campoEmail.value
                .trim()
                .toLowerCase(),

        motivo:
            campoMotivo.value,

        asunto:
            campoAsunto.value.trim(),

        mensaje:
            campoMensaje.value.trim()
    };

    /*
       No añadimos .select(). La tabla permite enviar mensajes,
       pero no leerlos desde el formulario público.
    */
    const { error } = await cliente
        .from("mensajes_contacto")
        .insert(nuevoMensaje);

    if (error) {
        throw error;
    }
}


/* =====================================================
   ESTADO DEL BOTÓN
===================================================== */

function cambiarEstadoBotonContacto(
    boton,
    enviando
) {
    if (!boton) {
        return;
    }

    boton.disabled = enviando;
    boton.setAttribute(
        "aria-busy",
        enviando ? "true" : "false"
    );

    if (enviando) {
        boton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Enviando...
        `;

        return;
    }

    boton.innerHTML = `
        <span>Enviar mensaje</span>
        <i class="fa-solid fa-arrow-right"></i>
    `;
}


/* =====================================================
   ENVÍO DEL FORMULARIO
===================================================== */

if (formularioContacto) {
    formularioContacto.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            if (envioContactoEnCurso) {
                return;
            }

            /*
               Campo trampa: una persona no puede verlo ni rellenarlo.
               Si contiene texto, simulamos un envío correcto sin guardar
               información para no revelar la protección al bot.
            */
            if (
                campoContactoTrampa?.value
                    .trim()
            ) {
                formularioContacto.reset();
                actualizarContadorMensaje();
                momentoInicioFormulario =
                    Date.now();

                mostrarNotificacionContacto(
                    "Tu mensaje se ha enviado correctamente."
                );

                return;
            }

            if (
                Date.now() -
                momentoInicioFormulario <
                TIEMPO_MINIMO_FORMULARIO_MS
            ) {
                mostrarNotificacionContacto(
                    "Espera un momento antes de enviar el mensaje."
                );

                return;
            }

            const esValido =
                validarFormularioContacto();

            if (!esValido) {
                mostrarNotificacionContacto(
                    "Revisa los campos señalados."
                );

                const primerError =
                    formularioContacto.querySelector(
                        ".campo-error input, " +
                        ".campo-error select, " +
                        ".campo-error textarea"
                    );

                primerError?.focus();

                return;
            }

            const botonEnviar =
                formularioContacto.querySelector(
                    ".boton-enviar-contacto"
                );

            envioContactoEnCurso = true;
            cambiarEstadoBotonContacto(
                botonEnviar,
                true
            );

            try {
                await enviarMensajeContacto();

                formularioContacto.reset();
                limpiarTodosLosErrores();
                actualizarContadorMensaje();
                momentoInicioFormulario =
                    Date.now();

                mostrarNotificacionContacto(
                    "Tu mensaje se ha enviado correctamente."
                );
            } catch (error) {
                console.error(
                    "Error al enviar el mensaje de contacto:",
                    error
                );

                mostrarNotificacionContacto(
                    "No hemos podido enviar tu mensaje. Inténtalo de nuevo."
                );
            } finally {
                envioContactoEnCurso = false;

                cambiarEstadoBotonContacto(
                    botonEnviar,
                    false
                );
            }
        }
    );
}


/* =====================================================
   CARGA INICIAL
===================================================== */

actualizarContadorMensaje();
