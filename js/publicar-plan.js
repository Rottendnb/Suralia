const sesionPublicar = JSON.parse(
    localStorage.getItem("sesionSuralia")
);

if (!sesionPublicar?.conectado) {
    window.location.href = "login.html";
}

const formularioPublicar = document.querySelector(
    "#formulario-publicar"
);

const botonPublicarActividad =
    formularioPublicar?.querySelector(
        'button[type="submit"]'
    );

const BUCKET_IMAGENES_PLANES =
    "imagenes-planes";

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
const imagen2 = document.querySelector("#plan-imagen-2");
const imagen3 = document.querySelector("#plan-imagen-3");
const confirmarPlan = document.querySelector("#confirmar-plan");

const zonaSubida = document.querySelector("#zona-subida-imagen");
const resultadoImagen = document.querySelector("#resultado-imagen");
const imagenSeleccionada = document.querySelector("#imagen-seleccionada");
const nombreImagen = document.querySelector("#nombre-imagen");
const eliminarImagen = document.querySelector("#eliminar-imagen");

const zonaSubida2 = document.querySelector("#zona-subida-imagen-2");
const resultadoImagen2 = document.querySelector("#resultado-imagen-2");
const imagenSeleccionada2 = document.querySelector("#imagen-seleccionada-2");
const nombreImagen2 = document.querySelector("#nombre-imagen-2");
const eliminarImagen2 = document.querySelector("#eliminar-imagen-2");

const zonaSubida3 = document.querySelector("#zona-subida-imagen-3");
const resultadoImagen3 = document.querySelector("#resultado-imagen-3");
const imagenSeleccionada3 = document.querySelector("#imagen-seleccionada-3");
const nombreImagen3 = document.querySelector("#nombre-imagen-3");
const eliminarImagen3 = document.querySelector("#eliminar-imagen-3");

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
let imagen2Base64 = "";
let imagen3Base64 = "";
let temporizadorNotificacion;

[
    resultadoImagen,
    resultadoImagen2,
    resultadoImagen3
].forEach((resultado) => {
    resultado?.setAttribute(
        "aria-hidden",
        resultado.classList.contains("visible")
            ? "false"
            : "true"
    );
});

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

function obtenerConfiguracionImagen(indice) {
    const configuraciones = {
        1: {
            input: imagen,
            zona: zonaSubida,
            resultado: resultadoImagen,
            vista: imagenSeleccionada,
            nombre: nombreImagen,
            eliminar: eliminarImagen,
            errorId: "error-plan-imagen",
            obtenerBase64: () => imagenBase64,
            guardarBase64: (valor) => {
                imagenBase64 = valor;
            },
            esPrincipal: true
        },
        2: {
            input: imagen2,
            zona: zonaSubida2,
            resultado: resultadoImagen2,
            vista: imagenSeleccionada2,
            nombre: nombreImagen2,
            eliminar: eliminarImagen2,
            errorId: "error-plan-imagen-2",
            obtenerBase64: () => imagen2Base64,
            guardarBase64: (valor) => {
                imagen2Base64 = valor;
            },
            esPrincipal: false
        },
        3: {
            input: imagen3,
            zona: zonaSubida3,
            resultado: resultadoImagen3,
            vista: imagenSeleccionada3,
            nombre: nombreImagen3,
            eliminar: eliminarImagen3,
            errorId: "error-plan-imagen-3",
            obtenerBase64: () => imagen3Base64,
            guardarBase64: (valor) => {
                imagen3Base64 = valor;
            },
            esPrincipal: false
        }
    };

    return configuraciones[indice];
}


function procesarImagen(
    archivo,
    indice = 1
) {
    const configuracion =
        obtenerConfiguracionImagen(indice);

    if (!configuracion) {
        return;
    }

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const tamanoMaximo =
        2 * 1024 * 1024;

    const errorImagen =
        document.querySelector(
            `#${configuracion.errorId}`
        );

    if (errorImagen) {
        errorImagen.textContent = "";
    }

    configuracion.input?.setAttribute(
        "aria-invalid",
        "false"
    );

    if (!tiposPermitidos.includes(archivo.type)) {
        if (errorImagen) {
            errorImagen.textContent =
                "Selecciona una imagen JPG, PNG o WEBP.";
        }

        configuracion.input?.setAttribute(
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

        configuracion.input?.setAttribute(
            "aria-invalid",
            "true"
        );

        return;
    }

    const lector = new FileReader();

    lector.addEventListener(
        "load",
        () => {
            configuracion.guardarBase64(
                lector.result
            );

            configuracion.vista.src =
                lector.result;

            configuracion.nombre.textContent =
                archivo.name;

            configuracion.resultado.classList.add(
                "visible"
            );

            configuracion.resultado.setAttribute(
                "aria-hidden",
                "false"
            );

            configuracion.zona.style.display =
                "none";

            configuracion.zona.setAttribute(
                "aria-hidden",
                "true"
            );

            if (configuracion.esPrincipal) {
                vistaImagen.style.backgroundImage =
                    `url("${lector.result}")`;

                vistaImagen.classList.add(
                    "tiene-imagen"
                );
            }
        }
    );

    lector.readAsDataURL(archivo);
}


function eliminarImagenSeleccionada(
    indice = 1
) {
    const configuracion =
        obtenerConfiguracionImagen(indice);

    if (!configuracion) {
        return;
    }

    configuracion.input.value = "";
    configuracion.guardarBase64("");

    configuracion.vista.src = "";
    configuracion.nombre.textContent = "";

    configuracion.resultado.classList.remove(
        "visible"
    );

    configuracion.resultado.setAttribute(
        "aria-hidden",
        "true"
    );

    configuracion.zona.style.display =
        "flex";

    configuracion.zona.setAttribute(
        "aria-hidden",
        "false"
    );

    configuracion.input.setAttribute(
        "aria-invalid",
        "false"
    );

    const errorImagen =
        document.querySelector(
            `#${configuracion.errorId}`
        );

    if (errorImagen) {
        errorImagen.textContent = "";
    }

    if (configuracion.esPrincipal) {
        vistaImagen.style.backgroundImage =
            "";

        vistaImagen.classList.remove(
            "tiene-imagen"
        );
    }
}


function activarZonaImagen(
    indice
) {
    const configuracion =
        obtenerConfiguracionImagen(indice);

    if (!configuracion) {
        return;
    }

    configuracion.input?.addEventListener(
        "change",
        () => {
            const archivo =
                configuracion.input.files?.[0];

            if (archivo) {
                procesarImagen(
                    archivo,
                    indice
                );
            }
        }
    );

    configuracion.zona?.addEventListener(
        "keydown",
        (evento) => {
            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();
                configuracion.input?.click();
            }
        }
    );

    configuracion.zona?.addEventListener(
        "dragover",
        (evento) => {
            evento.preventDefault();

            configuracion.zona.classList.add(
                "arrastrando"
            );
        }
    );

    configuracion.zona?.addEventListener(
        "dragleave",
        () => {
            configuracion.zona.classList.remove(
                "arrastrando"
            );
        }
    );

    configuracion.zona?.addEventListener(
        "drop",
        (evento) => {
            evento.preventDefault();

            configuracion.zona.classList.remove(
                "arrastrando"
            );

            const archivo =
                evento.dataTransfer.files?.[0];

            if (archivo) {
                procesarImagen(
                    archivo,
                    indice
                );
            }
        }
    );

    configuracion.eliminar?.addEventListener(
        "click",
        () => {
            eliminarImagenSeleccionada(
                indice
            );
        }
    );
}


[1, 2, 3].forEach(
    activarZonaImagen
);


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

async function obtenerUsuarioSupabase() {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        throw new Error(
            "No se ha podido conectar con Supabase."
        );
    }

    const {
        data,
        error
    } = await cliente.auth.getUser();

    if (error) {
        throw error;
    }

    if (!data?.user) {
        throw new Error(
            "No existe una sesión válida."
        );
    }

    return data.user;
}


function obtenerExtensionImagen(
    tipo = ""
) {
    const extensiones = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
    };

    return extensiones[tipo] ||
        "jpg";
}


async function convertirBase64EnArchivo(
    contenidoBase64,
    nombreArchivo
) {
    const respuesta =
        await fetch(
            contenidoBase64
        );

    if (!respuesta.ok) {
        throw new Error(
            "No se ha podido preparar la imagen."
        );
    }

    const blob =
        await respuesta.blob();

    return new File(
        [
            blob
        ],
        nombreArchivo,
        {
            type:
                blob.type ||
                "image/jpeg"
        }
    );
}


async function subirImagenPlan(
    cliente,
    usuarioId,
    input,
    contenidoBase64,
    sufijo
) {
    if (
        !input?.files?.[0] &&
        !contenidoBase64
    ) {
        return {
            url: "",
            ruta: ""
        };
    }

    const tipoImagen =
        input?.files?.[0]?.type ||
        contenidoBase64.match(
            /^data:([^;]+);/
        )?.[1] ||
        "image/jpeg";

    const extension =
        obtenerExtensionImagen(
            tipoImagen
        );

    const identificador =
        crypto.randomUUID();

    const ruta =
        `${usuarioId}/${identificador}-${sufijo}.${extension}`;

    const archivo =
        input?.files?.[0] ||
        await convertirBase64EnArchivo(
            contenidoBase64,
            `imagen-${sufijo}.${extension}`
        );

    const {
        error: errorSubida
    } = await cliente
        .storage
        .from(
            BUCKET_IMAGENES_PLANES
        )
        .upload(
            ruta,
            archivo,
            {
                cacheControl: "3600",
                contentType: archivo.type,
                upsert: false
            }
        );

    if (errorSubida) {
        throw errorSubida;
    }

    const {
        data: datosUrl
    } = cliente
        .storage
        .from(
            BUCKET_IMAGENES_PLANES
        )
        .getPublicUrl(
            ruta
        );

    const url =
        datosUrl?.publicUrl ||
        "";

    if (!url) {
        throw new Error(
            "No se ha podido obtener la URL de una imagen."
        );
    }

    return {
        url,
        ruta
    };
}


async function publicarPlanEnSupabase(
    datos
) {
    const cliente =
        window.clienteSupabase;

    const usuario =
        await obtenerUsuarioSupabase();

    const rutasSubidas =
        [];

    try {
        const imagenPrincipal =
            await subirImagenPlan(
                cliente,
                usuario.id,
                imagen,
                imagenBase64,
                "principal"
            );

        rutasSubidas.push(
            imagenPrincipal.ruta
        );

        const segundaImagen =
            await subirImagenPlan(
                cliente,
                usuario.id,
                imagen2,
                imagen2Base64,
                "galeria-2"
            );

        if (segundaImagen.ruta) {
            rutasSubidas.push(
                segundaImagen.ruta
            );
        }

        const terceraImagen =
            await subirImagenPlan(
                cliente,
                usuario.id,
                imagen3,
                imagen3Base64,
                "galeria-3"
            );

        if (terceraImagen.ruta) {
            rutasSubidas.push(
                terceraImagen.ruta
            );
        }

        const {
            error: errorInsercion
        } = await cliente
            .from(
                "planes"
            )
            .insert(
                {
                    usuario_id:
                        usuario.id,

                    titulo:
                        datos.titulo,

                    categoria:
                        datos.categoria,

                    nombre_categoria:
                        datos.nombreCategoria,

                    descripcion:
                        datos.descripcion,

                    fecha:
                        datos.fecha,

                    hora:
                        datos.hora,

                    duracion:
                        datos.duracion,

                    plazas:
                        datos.plazas,

                    ubicacion:
                        datos.ubicacion,

                    precio:
                        datos.precio,

                    dificultad:
                        datos.dificultad,

                    provincia:
                        datos.provincia,

                    imagen_url:
                        imagenPrincipal.url,

                    ruta_storage:
                        imagenPrincipal.ruta,

                    imagen_2_url:
                        segundaImagen.url ||
                        null,

                    ruta_storage_2:
                        segundaImagen.ruta ||
                        null,

                    imagen_3_url:
                        terceraImagen.url ||
                        null,

                    ruta_storage_3:
                        terceraImagen.ruta ||
                        null,

                    estado:
                        "pendiente"
                }
            );

        if (errorInsercion) {
            throw errorInsercion;
        }
    } catch (error) {
        const rutasValidas =
            rutasSubidas.filter(Boolean);

        if (rutasValidas.length > 0) {
            await cliente
                .storage
                .from(
                    BUCKET_IMAGENES_PLANES
                )
                .remove(
                    rutasValidas
                );
        }

        throw error;
    }
}


function eliminarBorradorPublicado() {
    const idBorradorActual =
        Number(
            localStorage.getItem(
                "borradorActualSuralia"
            )
        );

    if (!idBorradorActual) {
        return;
    }

    const borradores =
        JSON.parse(
            localStorage.getItem(
                "borradoresSuralia"
            )
        ) ||
        [];

    const borradoresActualizados =
        borradores.filter(
            (
                plan
            ) =>
                Number(
                    plan.id
                ) !==
                idBorradorActual
        );

    localStorage.setItem(
        "borradoresSuralia",
        JSON.stringify(
            borradoresActualizados
        )
    );

    localStorage.removeItem(
        "borradorActualSuralia"
    );

    localStorage.removeItem(
        "borradorEditarSuralia"
    );
}


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
        imagen2: imagen2Base64,
        imagen3: imagen3Base64,
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

formularioPublicar.addEventListener("submit", async (evento) => {
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

    const nuevoPlan =
        obtenerDatosFormulario();

    const textoBotonOriginal =
        botonPublicarActividad?.innerHTML ||
        "";

    if (botonPublicarActividad) {
        botonPublicarActividad.disabled =
            true;

        botonPublicarActividad.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
            Enviando actividad
        `;
    }

    guardarBorrador.disabled =
        true;

    try {
        await publicarPlanEnSupabase(
            nuevoPlan
        );

        eliminarBorradorPublicado();

        mostrarNotificacion(
            "La actividad se ha enviado para su revisión."
        );

        setTimeout(
            () => {
                window.location.href =
                    "perfil.html#publicados";
            },
            1500
        );
    } catch (error) {
        console.error(
            "No se pudo publicar el plan:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido enviar la actividad."
        );

        if (botonPublicarActividad) {
            botonPublicarActividad.disabled =
                false;

            botonPublicarActividad.innerHTML =
                textoBotonOriginal;
        }

        guardarBorrador.disabled =
            false;
    }
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


    if (borrador.imagen2) {
        imagen2Base64 = borrador.imagen2;
        imagenSeleccionada2.src = borrador.imagen2;
        nombreImagen2.textContent = "Segunda imagen del borrador";
        resultadoImagen2.classList.add("visible");
        resultadoImagen2.setAttribute("aria-hidden", "false");
        zonaSubida2.style.display = "none";
        zonaSubida2.setAttribute("aria-hidden", "true");
    }

    if (borrador.imagen3) {
        imagen3Base64 = borrador.imagen3;
        imagenSeleccionada3.src = borrador.imagen3;
        nombreImagen3.textContent = "Tercera imagen del borrador";
        resultadoImagen3.classList.add("visible");
        resultadoImagen3.setAttribute("aria-hidden", "false");
        zonaSubida3.style.display = "none";
        zonaSubida3.setAttribute("aria-hidden", "true");
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
    imagen2,
    imagen3,
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