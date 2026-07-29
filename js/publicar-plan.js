const sesionPublicar = JSON.parse(
    localStorage.getItem("sesionSuralia")
);

if (!sesionPublicar?.conectado) {
    window.location.href = "login.html";
}

const formularioPublicar = document.querySelector(
    "#formulario-publicar"
);

const titulo = document.querySelector("#plan-titulo");
const categoria = document.querySelector("#plan-categoria");
const descripcion = document.querySelector("#plan-descripcion");
const fecha = document.querySelector("#plan-fecha");
const hora = document.querySelector("#plan-hora");
const duracion = document.querySelector("#plan-duracion");
const plazas = document.querySelector("#plan-plazas");
const ubicacion = document.querySelector("#plan-ubicacion");
const precio = document.querySelector("#plan-precio");
const dificultad = document.querySelector("#plan-dificultad");
const imagen = document.querySelector("#plan-imagen");
const confirmarPlan = document.querySelector("#confirmar-plan");

const zonaSubida = document.querySelector("#zona-subida-imagen");
const resultadoImagen = document.querySelector("#resultado-imagen");
const imagenSeleccionada = document.querySelector("#imagen-seleccionada");
const nombreImagen = document.querySelector("#nombre-imagen");
const eliminarImagen = document.querySelector("#eliminar-imagen");

const contadorTitulo = document.querySelector("#contador-titulo");
const contadorDescripcion = document.querySelector(
    "#contador-descripcion"
);

const vistaTitulo = document.querySelector("#vista-previa-titulo");
const vistaDescripcion = document.querySelector(
    "#vista-previa-descripcion"
);
const vistaCategoria = document.querySelector(
    "#vista-previa-categoria"
);
const vistaFecha = document.querySelector("#vista-previa-fecha");
const vistaHora = document.querySelector("#vista-previa-hora");
const vistaUbicacion = document.querySelector(
    "#vista-previa-ubicacion"
);
const vistaPrecio = document.querySelector("#vista-previa-precio");
const vistaImagen = document.querySelector("#vista-previa-imagen");

const guardarBorrador = document.querySelector("#guardar-borrador");
const notificacionPublicar = document.querySelector(
    "#notificacion-publicar"
);

let imagenBase64 = "";
let temporizadorNotificacion;

resultadoImagen?.setAttribute(
    "aria-hidden",
    resultadoImagen.classList.contains(
        "visible"
    )
        ? "false"
        : "true"
);

const fechaActual = new Date();
const fechaMinima = fechaActual.toISOString().split("T")[0];

fecha.min = fechaMinima;

function mostrarNotificacion(mensaje) {
    if (!notificacionPublicar) {
        console.log(mensaje);
        return;
    }

    const texto = notificacionPublicar.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPublicar.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacionPublicar.classList.remove("visible");
    }, 3000);
}

function mostrarError(input, idError, mensaje) {
    const error = document.querySelector(`#${idError}`);

    if (error) {
        error.textContent = mensaje;
    }

    input?.setAttribute(
        "aria-invalid",
        "true"
    );

    const control = input?.closest(".campo-formulario__control");

    if (control) {
        control.classList.add("error");
    }
}

function limpiarError(input, idError) {
    const error = document.querySelector(`#${idError}`);

    if (error) {
        error.textContent = "";
    }

    input?.setAttribute(
        "aria-invalid",
        "false"
    );

    const control = input?.closest(".campo-formulario__control");

    if (control) {
        control.classList.remove("error");
    }
}

function formatearFecha(valor) {
    if (!valor) {
        return "Fecha pendiente";
    }

    const fechaElegida = new Date(`${valor}T00:00:00`);

    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long"
    }).format(fechaElegida);
}

function actualizarVistaPrevia() {
    vistaTitulo.textContent =
        titulo.value.trim() || "Título de la actividad";

    vistaDescripcion.textContent =
        descripcion.value.trim() ||
        "La descripción del plan aparecerá aquí.";

    vistaCategoria.textContent =
        categoria.options[categoria.selectedIndex]?.text ||
        "Categoría";

    vistaFecha.innerHTML = `
        <i
            class="fa-regular fa-calendar"
            aria-hidden="true"
        ></i>
        ${formatearFecha(fecha.value)}
    `;

    vistaHora.innerHTML = `
        <i
            class="fa-regular fa-clock"
            aria-hidden="true"
        ></i>
        ${hora.value || "Hora pendiente"}
    `;

    vistaUbicacion.innerHTML = `
        <i
            class="fa-solid fa-location-dot"
            aria-hidden="true"
        ></i>
        ${ubicacion.value.trim() || "Ubicación pendiente"}
    `;

    const valorPrecio = Number(precio.value);

    vistaPrecio.textContent =
        !precio.value || valorPrecio === 0
            ? "Gratis"
            : `${valorPrecio.toFixed(2).replace(".00", "")} €`;
}

function actualizarContadores() {
    contadorTitulo.textContent = `${titulo.value.length}/70`;
    contadorDescripcion.textContent =
        `${descripcion.value.length}/600`;
}

function procesarImagen(archivo) {
    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const tamanoMaximo = 2 * 1024 * 1024;

    const errorImagen =
        document.querySelector("#error-plan-imagen");

    if (errorImagen) {
        errorImagen.textContent = "";
    }

    imagen?.setAttribute(
        "aria-invalid",
        "false"
    );

    if (!tiposPermitidos.includes(archivo.type)) {
        if (errorImagen) {
            errorImagen.textContent =
                "Selecciona una imagen JPG, PNG o WEBP.";
        }

        imagen?.setAttribute(
            "aria-invalid",
            "true"
        );

        return;
    }

    if (archivo.size > tamanoMaximo) {
        if (errorImagen) {
            errorImagen.textContent =
                "La imagen no puede superar los 2 MB.";
        }

        imagen?.setAttribute(
            "aria-invalid",
            "true"
        );

        return;
    }

    const lector = new FileReader();

    lector.addEventListener("load", () => {
        imagenBase64 = lector.result;

        imagenSeleccionada.src = imagenBase64;
        nombreImagen.textContent = archivo.name;

        resultadoImagen.classList.add("visible");
        resultadoImagen.setAttribute(
            "aria-hidden",
            "false"
        );

        zonaSubida.style.display = "none";
        zonaSubida.setAttribute(
            "aria-hidden",
            "true"
        );

        vistaImagen.style.backgroundImage =
            `url("${imagenBase64}")`;

        vistaImagen.classList.add("tiene-imagen");
    });

    lector.readAsDataURL(archivo);
}

imagen.addEventListener("change", () => {
    const archivo = imagen.files[0];

    if (archivo) {
        procesarImagen(archivo);
    }
});

zonaSubida?.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Enter" ||
            evento.key === " "
        ) {
            evento.preventDefault();
            imagen?.click();
        }
    }
);

zonaSubida.addEventListener("dragover", (evento) => {
    evento.preventDefault();
    zonaSubida.classList.add("arrastrando");
    zonaSubida.setAttribute(
        "aria-label",
        "Suelta la imagen para seleccionarla"
    );
});

zonaSubida.addEventListener("dragleave", () => {
    zonaSubida.classList.remove("arrastrando");
    zonaSubida.removeAttribute(
        "aria-label"
    );
});

zonaSubida.addEventListener("drop", (evento) => {
    evento.preventDefault();
    zonaSubida.classList.remove("arrastrando");
    zonaSubida.removeAttribute(
        "aria-label"
    );

    const archivo = evento.dataTransfer.files[0];

    if (archivo) {
        procesarImagen(archivo);
    }
});

eliminarImagen.addEventListener("click", () => {
    imagen.value = "";
    imagenBase64 = "";

    imagenSeleccionada.src = "";
    nombreImagen.textContent = "";

    resultadoImagen.classList.remove("visible");
    resultadoImagen.setAttribute(
        "aria-hidden",
        "true"
    );

    zonaSubida.style.display = "flex";
    zonaSubida.setAttribute(
        "aria-hidden",
        "false"
    );

    imagen?.setAttribute(
        "aria-invalid",
        "false"
    );

    const errorImagen =
        document.querySelector(
            "#error-plan-imagen"
        );

    if (errorImagen) {
        errorImagen.textContent = "";
    }

    vistaImagen.style.backgroundImage = "";
    vistaImagen.classList.remove("tiene-imagen");
});

const camposVistaPrevia = [
    titulo,
    categoria,
    descripcion,
    fecha,
    hora,
    ubicacion,
    precio
];

camposVistaPrevia.forEach((campo) => {
    campo.addEventListener("input", () => {
        actualizarVistaPrevia();
        campo.setAttribute(
            "aria-invalid",
            "false"
        );
    });

    campo.addEventListener("change", () => {
        actualizarVistaPrevia();
        campo.setAttribute(
            "aria-invalid",
            "false"
        );
    });
});

titulo.addEventListener("input", actualizarContadores);
descripcion.addEventListener("input", actualizarContadores);

function obtenerDatosFormulario() {
    const idBorradorActual = Number(
        localStorage.getItem("borradorActualSuralia")
    );

    return {
        id: idBorradorActual || Date.now(),
        titulo: titulo.value.trim(),
        categoria: categoria.value,
        nombreCategoria:
            categoria.options[categoria.selectedIndex]?.text || "",
        descripcion: descripcion.value.trim(),
        fecha: fecha.value,
        hora: hora.value,
        duracion: duracion.value,
        plazas: Number(plazas.value),
        ubicacion: ubicacion.value.trim(),
        precio: Number(precio.value || 0),
        dificultad: dificultad.value,
        provincia: "Sevilla",
        imagen: imagenBase64,
        estado: "pendiente",
        creadoPor: sesionPublicar.email,
        fechaCreacion: new Date().toISOString()
    };
}

function guardarPlan(datos, clave) {
    const planesGuardados = JSON.parse(
        localStorage.getItem(clave)
    ) || [];

    const idBorradorActual = Number(
        localStorage.getItem("borradorActualSuralia")
    );

    if (
        clave === "borradoresSuralia" &&
        idBorradorActual
    ) {
        const posicion = planesGuardados.findIndex(
            (plan) => Number(plan.id) === idBorradorActual
        );

        if (posicion !== -1) {
            datos.id = idBorradorActual;
            planesGuardados[posicion] = datos;
        } else {
            planesGuardados.push(datos);
        }
    } else {
        planesGuardados.push(datos);
    }

    localStorage.setItem(
        clave,
        JSON.stringify(planesGuardados)
    );
}

guardarBorrador.addEventListener("click", () => {
    limpiarError(
        titulo,
        "error-plan-titulo"
    );

    const datos = obtenerDatosFormulario();

    if (!datos.titulo) {
        mostrarError(
            titulo,
            "error-plan-titulo",
            "Introduce al menos un título para guardar el borrador."
        );

        titulo.focus();
        return;
    }

    datos.estado = "borrador";

guardarPlan(
    datos,
    "borradoresSuralia"
);

localStorage.setItem(
    "borradorActualSuralia",
    String(datos.id)
);

localStorage.setItem(
    "borradorEditarSuralia",
    String(datos.id)
);

mostrarNotificacion(
    "El borrador se ha guardado correctamente."
);
});

formularioPublicar.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let formularioValido = true;

    limpiarError(titulo, "error-plan-titulo");
    limpiarError(categoria, "error-plan-categoria");
    limpiarError(descripcion, "error-plan-descripcion");
    limpiarError(fecha, "error-plan-fecha");
    limpiarError(hora, "error-plan-hora");
    limpiarError(duracion, "error-plan-duracion");
    limpiarError(plazas, "error-plan-plazas");
    limpiarError(ubicacion, "error-plan-ubicacion");
    limpiarError(precio, "error-plan-precio");

    const errorImagen =
        document.querySelector(
            "#error-plan-imagen"
        );

    const errorConfirmacion =
        document.querySelector(
            "#error-confirmar-plan"
        );

    if (errorImagen) {
        errorImagen.textContent = "";
    }

    if (errorConfirmacion) {
        errorConfirmacion.textContent = "";
    }

    imagen?.setAttribute(
        "aria-invalid",
        "false"
    );

    confirmarPlan?.setAttribute(
        "aria-invalid",
        "false"
    );

    if (titulo.value.trim().length < 8) {
        mostrarError(
            titulo,
            "error-plan-titulo",
            "El título debe tener al menos 8 caracteres."
        );

        formularioValido = false;
    }

    if (!categoria.value) {
        mostrarError(
            categoria,
            "error-plan-categoria",
            "Selecciona una categoría."
        );

        formularioValido = false;
    }

    if (descripcion.value.trim().length < 50) {
        mostrarError(
            descripcion,
            "error-plan-descripcion",
            "La descripción debe tener al menos 50 caracteres."
        );

        formularioValido = false;
    }

    if (!fecha.value) {
        mostrarError(
            fecha,
            "error-plan-fecha",
            "Selecciona una fecha."
        );

        formularioValido = false;
    } else if (fecha.value < fechaMinima) {
        mostrarError(
            fecha,
            "error-plan-fecha",
            "La fecha no puede estar en el pasado."
        );

        formularioValido = false;
    }

    if (!hora.value) {
        mostrarError(
            hora,
            "error-plan-hora",
            "Selecciona una hora."
        );

        formularioValido = false;
    }

    if (!duracion.value) {
        mostrarError(
            duracion,
            "error-plan-duracion",
            "Selecciona una duración."
        );

        formularioValido = false;
    }

    if (
        !plazas.value ||
        Number(plazas.value) < 1 ||
        Number(plazas.value) > 500
    ) {
        mostrarError(
            plazas,
            "error-plan-plazas",
            "Introduce entre 1 y 500 plazas."
        );

        formularioValido = false;
    }

    if (ubicacion.value.trim().length < 5) {
        mostrarError(
            ubicacion,
            "error-plan-ubicacion",
            "Introduce una ubicación válida."
        );

        formularioValido = false;
    }

    if (
        precio.value === "" ||
        Number(precio.value) < 0
    ) {
        mostrarError(
            precio,
            "error-plan-precio",
            "Introduce un precio válido. Usa 0 si es gratis."
        );

        formularioValido = false;
    }

    if (!imagenBase64) {
        if (errorImagen) {
            errorImagen.textContent =
                "Selecciona una imagen para la actividad.";
        }

        imagen?.setAttribute(
            "aria-invalid",
            "true"
        );

        formularioValido = false;
    }

    if (!confirmarPlan.checked) {
        if (errorConfirmacion) {
            errorConfirmacion.textContent =
                "Debes confirmar la información antes de publicar.";
        }

        confirmarPlan.setAttribute(
            "aria-invalid",
            "true"
        );

        formularioValido = false;
    }

    if (!formularioValido) {
        mostrarNotificacion(
            "Revisa los campos señalados del formulario."
        );

        const primerCampoInvalido =
            formularioPublicar.querySelector(
                '[aria-invalid="true"]'
            );

        primerCampoInvalido?.focus();

        return;
    }

    const nuevoPlan = obtenerDatosFormulario();

    guardarPlan(nuevoPlan, "planesPublicadosSuralia");


    const idBorradorActual = Number(
    localStorage.getItem("borradorActualSuralia")
);

if (idBorradorActual) {
    const borradores = JSON.parse(
        localStorage.getItem("borradoresSuralia")
    ) || [];

    const borradoresActualizados = borradores.filter(
        (plan) => Number(plan.id) !== idBorradorActual
    );

    localStorage.setItem(
        "borradoresSuralia",
        JSON.stringify(borradoresActualizados)
    );

    localStorage.removeItem("borradorActualSuralia");
    localStorage.removeItem("borradorEditarSuralia");
}


    mostrarNotificacion(
        "La actividad se ha enviado para su revisión."
    );

    setTimeout(() => {
    window.location.href =
        "perfil.html#publicados";
}, 1500);
});

confirmarPlan.addEventListener("change", () => {
    const errorConfirmacion =
        document.querySelector(
            "#error-confirmar-plan"
        );

    if (errorConfirmacion) {
        errorConfirmacion.textContent = "";
    }

    confirmarPlan.setAttribute(
        "aria-invalid",
        "false"
    );
});


function cargarBorradorParaEditar() {
    const idBorrador = Number(
        localStorage.getItem("borradorEditarSuralia")
    );

    if (!idBorrador) {
        return;
    }

    const borradores = JSON.parse(
        localStorage.getItem("borradoresSuralia")
    ) || [];

    const borrador = borradores.find(
        (plan) => Number(plan.id) === idBorrador
    );

    if (!borrador) {
        localStorage.removeItem("borradorEditarSuralia");
        return;
    }

    titulo.value = borrador.titulo || "";
    categoria.value = borrador.categoria || "";
    descripcion.value = borrador.descripcion || "";
    fecha.value = borrador.fecha || "";
    hora.value = borrador.hora || "";
    duracion.value = borrador.duracion || "";
    plazas.value = borrador.plazas || "";
    ubicacion.value = borrador.ubicacion || "";
    precio.value = borrador.precio ?? "";
    dificultad.value =
        borrador.dificultad || "Todos los públicos";

    if (borrador.imagen) {
        imagenBase64 = borrador.imagen;

        imagenSeleccionada.src = borrador.imagen;
        nombreImagen.textContent = "Imagen del borrador";

        resultadoImagen.classList.add("visible");
        resultadoImagen.setAttribute(
            "aria-hidden",
            "false"
        );

        zonaSubida.style.display = "none";
        zonaSubida.setAttribute(
            "aria-hidden",
            "true"
        );

        vistaImagen.style.backgroundImage =
            `url("${borrador.imagen}")`;

        vistaImagen.classList.add("tiene-imagen");
    }

    localStorage.setItem(
        "borradorActualSuralia",
        String(idBorrador)
    );

    actualizarContadores();
    actualizarVistaPrevia();

    mostrarNotificacion(
        "Borrador cargado. Puedes continuar editándolo."
    );
}

[
    titulo,
    categoria,
    descripcion,
    fecha,
    hora,
    duracion,
    plazas,
    ubicacion,
    precio,
    imagen,
    confirmarPlan
].forEach((campo) => {
    campo?.setAttribute(
        "aria-invalid",
        "false"
    );
});

cargarBorradorParaEditar();

actualizarContadores();
actualizarVistaPrevia();