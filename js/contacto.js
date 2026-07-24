/* =====================================================
   FORMULARIO DE CONTACTO
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

const contadorMensaje =
    document.querySelector("#contador-contacto-mensaje");

const notificacion =
    document.querySelector("#notificacion");

let temporizadorNotificacion;


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
    }, 3500);
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


    if (nombre.length < 2) {
        mostrarError(
            campoNombre,
            "#error-contacto-nombre",
            "Introduce un nombre válido."
        );

        formularioValido = false;
    }


    if (apellidos.length < 2) {
        mostrarError(
            campoApellidos,
            "#error-contacto-apellidos",
            "Introduce tus apellidos."
        );

        formularioValido = false;
    }


    if (!expresionEmail.test(email)) {
        mostrarError(
            campoEmail,
            "#error-contacto-email",
            "Introduce un correo electrónico válido."
        );

        formularioValido = false;
    }


    if (!motivo) {
        mostrarError(
            campoMotivo,
            "#error-contacto-motivo",
            "Selecciona el motivo de la consulta."
        );

        formularioValido = false;
    }


    if (asunto.length < 5) {
        mostrarError(
            campoAsunto,
            "#error-contacto-asunto",
            "El asunto debe tener al menos 5 caracteres."
        );

        formularioValido = false;
    }


    if (mensaje.length < 20) {
        mostrarError(
            campoMensaje,
            "#error-contacto-mensaje",
            "El mensaje debe tener al menos 20 caracteres."
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
   GUARDAR MENSAJE
===================================================== */

function guardarMensajeContacto() {
    const mensajesGuardados =
        JSON.parse(
            localStorage.getItem(
                "mensajesContactoSuralia"
            ) || "[]"
        );

    const nuevoMensaje = {
        id: Date.now(),

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
            campoMensaje.value.trim(),

        fecha:
            new Date().toISOString(),

        estado:
            "pendiente"
    };

    mensajesGuardados.push(nuevoMensaje);

    localStorage.setItem(
        "mensajesContactoSuralia",
        JSON.stringify(mensajesGuardados)
    );
}


/* =====================================================
   ENVÍO DEL FORMULARIO
===================================================== */

if (formularioContacto) {
    formularioContacto.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

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

            if (botonEnviar) {
                botonEnviar.disabled = true;

                botonEnviar.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Enviando...
                `;
            }

            setTimeout(() => {
                guardarMensajeContacto();

                formularioContacto.reset();

                actualizarContadorMensaje();

                mostrarNotificacionContacto(
                    "Tu mensaje se ha enviado correctamente."
                );

                if (botonEnviar) {
                    botonEnviar.disabled = false;

                    botonEnviar.innerHTML = `
                        <span>Enviar mensaje</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    `;
                }
            }, 800);
        }
    );
}


/* =====================================================
   CARGA INICIAL
===================================================== */

actualizarContadorMensaje();