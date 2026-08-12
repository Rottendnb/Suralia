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

const botonAnadirFecha =
    document.querySelector("#anadir-fecha-plan");

const listaFechasPlan =
    document.querySelector("#lista-fechas-plan");

const errorFechasPlan =
    document.querySelector("#error-plan-fechas");

const duracion = document.querySelector("#plan-duracion");
const plazas = document.querySelector("#plan-plazas");
const municipio = document.querySelector("#plan-municipio");
const ubicacion = document.querySelector("#plan-ubicacion");
const precio = document.querySelector("#plan-precio");
const dificultad = document.querySelector("#plan-dificultad");
const enlaceReserva = document.querySelector("#plan-enlace-reserva");

const latitudPlan =
    document.querySelector("#plan-latitud");

const longitudPlan =
    document.querySelector("#plan-longitud");

const mapaPublicarPlan =
    document.querySelector("#mapa-publicar-plan");

const estadoMapaPublicar =
    document.querySelector("#mapa-publicar-estado");

const errorCoordenadas =
    document.querySelector("#error-plan-coordenadas");

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

let mapaUbicacionPublicar =
    null;

let marcadorUbicacionPublicar =
    null;


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


let contadorFechasAdicionales =
    0;

const MAX_FECHAS_PLAN =
    20;


function actualizarLimitesFechasAdicionales() {
    if (!listaFechasPlan) {
        return;
    }

    const fechaBase =
        fecha?.value ||
        fechaMinima;

    listaFechasPlan
        .querySelectorAll(
            "[data-fecha-adicional]"
        )
        .forEach(
            (
                campoFecha
            ) => {
                campoFecha.min =
                    fechaBase;
            }
        );
}


function actualizarBotonAnadirFecha() {
    if (
        !botonAnadirFecha ||
        !listaFechasPlan
    ) {
        return;
    }

    const totalAdicionales =
        listaFechasPlan.querySelectorAll(
            "[data-fila-fecha]"
        ).length;

    const limiteAlcanzado =
        totalAdicionales >=
        MAX_FECHAS_PLAN - 1;

    botonAnadirFecha.disabled =
        limiteAlcanzado;

    botonAnadirFecha.title =
        limiteAlcanzado
            ? `Puedes añadir hasta ${MAX_FECHAS_PLAN} fechas por plan.`
            : "";
}


function crearFilaFechaAdicional(
    fechaValor = "",
    horaValor = ""
) {
    if (!listaFechasPlan) {
        return null;
    }

    const totalAdicionales =
        listaFechasPlan.querySelectorAll(
            "[data-fila-fecha]"
        ).length;

    if (
        totalAdicionales >=
        MAX_FECHAS_PLAN - 1
    ) {
        return null;
    }

    contadorFechasAdicionales +=
        1;

    const identificador =
        contadorFechasAdicionales;

    const fila =
        document.createElement(
            "div"
        );

    fila.className =
        "fecha-adicional-publicar";

    fila.dataset.filaFecha =
        String(
            identificador
        );

    fila.innerHTML = `
        <div class="campo-formulario">
            <label
                for="plan-fecha-adicional-${identificador}"
                class="sr-only"
            >
                Fecha adicional
            </label>

            <div class="campo-formulario__control">
                <i
                    class="fa-regular fa-calendar"
                    aria-hidden="true"
                ></i>

                <input
                    type="date"
                    id="plan-fecha-adicional-${identificador}"
                    data-fecha-adicional
                    aria-label="Fecha adicional"
                    value="${fechaValor}"
                >
            </div>
        </div>

        <div class="campo-formulario">
            <label
                for="plan-hora-adicional-${identificador}"
                class="sr-only"
            >
                Hora de esta fecha
            </label>

            <div class="campo-formulario__control">
                <i
                    class="fa-regular fa-clock"
                    aria-hidden="true"
                ></i>

                <input
                    type="time"
                    id="plan-hora-adicional-${identificador}"
                    data-hora-adicional
                    aria-label="Hora de la fecha adicional"
                    value="${horaValor}"
                >
            </div>
        </div>

        <button
            type="button"
            class="fecha-adicional-publicar__eliminar"
            data-eliminar-fecha
            aria-label="Eliminar esta fecha"
            title="Eliminar fecha"
        >
            <i
                class="fa-solid fa-trash"
                aria-hidden="true"
            ></i>
        </button>
    `;

    listaFechasPlan.appendChild(
        fila
    );

    actualizarLimitesFechasAdicionales();
    actualizarBotonAnadirFecha();

    return fila;
}


function obtenerFechasFormulario() {
    const fechasSeleccionadas =
        [];

    if (
        fecha?.value ||
        hora?.value
    ) {
        fechasSeleccionadas.push({
            fecha:
                fecha?.value ||
                "",
            hora:
                hora?.value ||
                ""
        });
    }

    listaFechasPlan
        ?.querySelectorAll(
            "[data-fila-fecha]"
        )
        .forEach(
            (
                fila
            ) => {
                const campoFecha =
                    fila.querySelector(
                        "[data-fecha-adicional]"
                    );

                const campoHora =
                    fila.querySelector(
                        "[data-hora-adicional]"
                    );

                const valorFecha =
                    campoFecha?.value ||
                    "";

                const valorHora =
                    campoHora?.value ||
                    "";

                if (
                    valorFecha ||
                    valorHora
                ) {
                    fechasSeleccionadas.push({
                        fecha:
                            valorFecha,
                        hora:
                            valorHora
                    });
                }
            }
        );

    return fechasSeleccionadas;
}


function normalizarFechasBorrador(
    fechasGuardadas
) {
    if (
        !Array.isArray(
            fechasGuardadas
        )
    ) {
        return [];
    }

    return fechasGuardadas
        .map(
            (
                item
            ) => {
                if (
                    typeof item ===
                    "string"
                ) {
                    return {
                        fecha:
                            item,
                        hora:
                            ""
                    };
                }

                return {
                    fecha:
                        String(
                            item?.fecha ||
                            ""
                        ),
                    hora:
                        String(
                            item?.hora ||
                            ""
                        )
                };
            }
        )
        .filter(
            (
                item
            ) =>
                item.fecha ||
                item.hora
        );
}


function cargarFechasAdicionalesBorrador(
    fechasGuardadas
) {
    if (!listaFechasPlan) {
        return;
    }

    listaFechasPlan.innerHTML =
        "";

    const normalizadas =
        normalizarFechasBorrador(
            fechasGuardadas
        );

    let primeraOmitida =
        false;

    normalizadas.forEach(
        (
            item
        ) => {
            const coincidePrincipal =
                !primeraOmitida &&
                item.fecha ===
                    (
                        fecha?.value ||
                        ""
                    ) &&
                (
                    !item.hora ||
                    item.hora ===
                        (
                            hora?.value ||
                            ""
                        )
                );

            if (coincidePrincipal) {
                primeraOmitida =
                    true;

                return;
            }

            crearFilaFechaAdicional(
                item.fecha,
                item.hora
            );
        }
    );

    actualizarBotonAnadirFecha();
}


function validarFechasAdicionales() {
    if (errorFechasPlan) {
        errorFechasPlan.textContent =
            "";
    }

    const fechasSeleccionadas =
        obtenerFechasFormulario();

    if (
        fechasSeleccionadas.length ===
        0
    ) {
        return true;
    }

    const claves =
        new Set();

    for (
        const item
        of fechasSeleccionadas
    ) {
        if (
            !item.fecha ||
            !item.hora
        ) {
            if (errorFechasPlan) {
                errorFechasPlan.textContent =
                    "Completa la fecha y la hora de todos los días o pases añadidos.";
            }

            return false;
        }

        if (
            item.fecha <
            fechaMinima
        ) {
            if (errorFechasPlan) {
                errorFechasPlan.textContent =
                    "Ninguna fecha puede estar en el pasado.";
            }

            return false;
        }

        if (
            fecha?.value &&
            item.fecha <
                fecha.value
        ) {
            if (errorFechasPlan) {
                errorFechasPlan.textContent =
                    "Las fechas adicionales no pueden ser anteriores a la primera fecha.";
            }

            return false;
        }

        const clave =
            `${item.fecha}|${item.hora}`;

        if (
            claves.has(
                clave
            )
        ) {
            if (errorFechasPlan) {
                errorFechasPlan.textContent =
                    "Hay una fecha y hora repetidas. Elimina el duplicado.";
            }

            return false;
        }

        claves.add(
            clave
        );
    }

    return true;
}


botonAnadirFecha?.addEventListener(
    "click",
    () => {
        const fila =
            crearFilaFechaAdicional(
                "",
                hora?.value ||
                    ""
            );

        const campoFecha =
            fila?.querySelector(
                "[data-fecha-adicional]"
            );

        campoFecha?.focus();
    }
);


listaFechasPlan?.addEventListener(
    "click",
    (
        evento
    ) => {
        const botonEliminar =
            evento.target.closest(
                "[data-eliminar-fecha]"
            );

        if (!botonEliminar) {
            return;
        }

        botonEliminar
            .closest(
                "[data-fila-fecha]"
            )
            ?.remove();

        if (errorFechasPlan) {
            errorFechasPlan.textContent =
                "";
        }

        actualizarBotonAnadirFecha();
    }
);


listaFechasPlan?.addEventListener(
    "input",
    () => {
        if (errorFechasPlan) {
            errorFechasPlan.textContent =
                "";
        }
    }
);


fecha?.addEventListener(
    "change",
    actualizarLimitesFechasAdicionales
);


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

    const municipioTexto =
        municipio?.value.trim() ||
        "";

    const direccionTexto =
        ubicacion.value.trim();

    const ubicacionVista =
        municipioTexto
            ? `${municipioTexto}, Sevilla${
                direccionTexto
                    ? ` · ${direccionTexto}`
                    : ""
            }`
            : (
                direccionTexto ||
                "Ubicación pendiente"
            );

    vistaUbicacion.innerHTML = `
        <i
            class="fa-solid fa-location-dot"
            aria-hidden="true"
        ></i>
        ${ubicacionVista}
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


function actualizarEstadoPuntoMapa(
    latitud,
    longitud
) {
    if (!estadoMapaPublicar) {
        return;
    }

    if (
        !Number.isFinite(latitud) ||
        !Number.isFinite(longitud)
    ) {
        estadoMapaPublicar.textContent =
            "Punto pendiente";

        estadoMapaPublicar.classList.remove(
            "mapa-publicar__estado--seleccionado"
        );

        return;
    }

    estadoMapaPublicar.textContent =
        `Punto seleccionado: ${latitud.toFixed(5)}, ${longitud.toFixed(5)}`;

    estadoMapaPublicar.classList.add(
        "mapa-publicar__estado--seleccionado"
    );
}


function guardarPuntoMapa(
    latitud,
    longitud,
    centrar = false
) {
    const lat =
        Number(latitud);

    const lng =
        Number(longitud);

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return;
    }

    if (latitudPlan) {
        latitudPlan.value =
            lat.toFixed(7);
    }

    if (longitudPlan) {
        longitudPlan.value =
            lng.toFixed(7);
    }

    if (errorCoordenadas) {
        errorCoordenadas.textContent =
            "";
    }

    mapaPublicarPlan?.setAttribute(
        "aria-invalid",
        "false"
    );

    actualizarEstadoPuntoMapa(
        lat,
        lng
    );

    if (!mapaUbicacionPublicar) {
        return;
    }

    if (!marcadorUbicacionPublicar) {
        marcadorUbicacionPublicar =
            L.marker(
                [
                    lat,
                    lng
                ]
            ).addTo(
                mapaUbicacionPublicar
            );
    } else {
        marcadorUbicacionPublicar.setLatLng(
            [
                lat,
                lng
            ]
        );
    }

    marcadorUbicacionPublicar.bindPopup(
        "Ubicación exacta del plan"
    );

    if (centrar) {
        mapaUbicacionPublicar.setView(
            [
                lat,
                lng
            ],
            16
        );

        marcadorUbicacionPublicar.openPopup();
    }
}


function inicializarMapaPublicar() {
    if (
        typeof L === "undefined" ||
        !mapaPublicarPlan ||
        mapaUbicacionPublicar
    ) {
        return;
    }

    mapaUbicacionPublicar =
        L.map(
            "mapa-publicar-plan",
            {
                scrollWheelZoom:
                    false
            }
        ).setView(
            [
                37.3891,
                -5.9845
            ],
            9
        );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(
        mapaUbicacionPublicar
    );

    mapaUbicacionPublicar.on(
        "click",
        (
            evento
        ) => {
            guardarPuntoMapa(
                evento.latlng.lat,
                evento.latlng.lng
            );
        }
    );

    const latitudGuardada =
        Number(
            latitudPlan?.value
        );

    const longitudGuardada =
        Number(
            longitudPlan?.value
        );

    if (
        Number.isFinite(
            latitudGuardada
        ) &&
        Number.isFinite(
            longitudGuardada
        ) &&
        latitudPlan?.value &&
        longitudPlan?.value
    ) {
        guardarPuntoMapa(
            latitudGuardada,
            longitudGuardada,
            true
        );
    } else {
        actualizarEstadoPuntoMapa(
            NaN,
            NaN
        );
    }

    window.setTimeout(
        () => {
            mapaUbicacionPublicar?.invalidateSize();
        },
        120
    );
}


const camposVistaPrevia = [
    titulo,
    categoria,
    descripcion,
    fecha,
    hora,
    municipio,
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

                    fechas:
                        datos.fechas,

                    duracion:
                        datos.duracion,

                    plazas:
                        datos.plazas,

                    ubicacion:
                        datos.ubicacion,

                    municipio:
                        datos.municipio,

                    direccion:
                        datos.direccion,

                    latitud:
                        datos.latitud,

                    longitud:
                        datos.longitud,

                    precio:
                        datos.precio,

                    dificultad:
                        datos.dificultad,

                    enlace_reserva:
                        datos.enlace_reserva,

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

        fechas:
            obtenerFechasFormulario(),

        duracion: duracion.value,
        plazas: Number(plazas.value),

        municipio:
            municipio?.value.trim() ||
            "",

        direccion:
            ubicacion.value.trim(),

        latitud:
            latitudPlan?.value
                ? Number(
                    latitudPlan.value
                )
                : null,

        longitud:
            longitudPlan?.value
                ? Number(
                    longitudPlan.value
                )
                : null,

        ubicacion:
            [
                ubicacion.value.trim(),
                municipio?.value.trim(),
                "Sevilla"
            ]
                .filter(Boolean)
                .join(", "),

        precio: Number(precio.value || 0),
        dificultad: dificultad.value,

        enlace_reserva:
            enlaceReserva?.value.trim() ||
            null,

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

function enlaceReservaEsValido(
    valor = ""
) {
    const texto =
        String(valor || "").trim();

    if (!texto) {
        return true;
    }

    try {
        const url =
            new URL(texto);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );
    } catch (error) {
        return false;
    }
}


formularioPublicar.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    let formularioValido = true;

    limpiarError(titulo, "error-plan-titulo");
    limpiarError(categoria, "error-plan-categoria");
    limpiarError(descripcion, "error-plan-descripcion");
    limpiarError(fecha, "error-plan-fecha");
    limpiarError(hora, "error-plan-hora");

    if (errorFechasPlan) {
        errorFechasPlan.textContent =
            "";
    }

    limpiarError(duracion, "error-plan-duracion");
    limpiarError(plazas, "error-plan-plazas");
    limpiarError(municipio, "error-plan-municipio");
    limpiarError(ubicacion, "error-plan-ubicacion");

    if (errorCoordenadas) {
        errorCoordenadas.textContent =
            "";
    }

    mapaPublicarPlan?.setAttribute(
        "aria-invalid",
        "false"
    );

    limpiarError(precio, "error-plan-precio");
    limpiarError(
        enlaceReserva,
        "error-plan-enlace-reserva"
    );

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

    if (
        !validarFechasAdicionales()
    ) {
        formularioValido =
            false;
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

    if (
        !municipio ||
        municipio.value.trim().length < 2
    ) {
        mostrarError(
            municipio,
            "error-plan-municipio",
            "Introduce el municipio donde se realiza la actividad."
        );

        formularioValido = false;
    }

    if (ubicacion.value.trim().length < 3) {
        mostrarError(
            ubicacion,
            "error-plan-ubicacion",
            "Introduce el lugar o la dirección concreta."
        );

        formularioValido = false;
    }

    const latitudSeleccionada =
        Number(
            latitudPlan?.value
        );

    const longitudSeleccionada =
        Number(
            longitudPlan?.value
        );

    if (
        !latitudPlan?.value ||
        !longitudPlan?.value ||
        !Number.isFinite(
            latitudSeleccionada
        ) ||
        !Number.isFinite(
            longitudSeleccionada
        )
    ) {
        if (errorCoordenadas) {
            errorCoordenadas.textContent =
                "Marca en el mapa el punto exacto donde se realizará la actividad.";
        }

        mapaPublicarPlan?.setAttribute(
            "aria-invalid",
            "true"
        );

        formularioValido =
            false;
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

    if (
        enlaceReserva?.value.trim() &&
        !enlaceReservaEsValido(
            enlaceReserva.value
        )
    ) {
        mostrarError(
            enlaceReserva,
            "error-plan-enlace-reserva",
            "Introduce una dirección web válida que empiece por http:// o https://."
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

    cargarFechasAdicionalesBorrador(
        borrador.fechas ||
        []
    );

    duracion.value = borrador.duracion || "";
    plazas.value = borrador.plazas || "";

    if (municipio) {
        municipio.value =
            borrador.municipio ||
            "";
    }

    ubicacion.value =
        borrador.direccion ||
        borrador.ubicacion ||
        "";

    if (latitudPlan) {
        latitudPlan.value =
            borrador.latitud ??
            "";
    }

    if (longitudPlan) {
        longitudPlan.value =
            borrador.longitud ??
            "";
    }

    precio.value = borrador.precio ?? "";

    if (enlaceReserva) {
        enlaceReserva.value =
            borrador.enlace_reserva ||
            "";
    }

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
    municipio,
    ubicacion,
    precio,
    enlaceReserva,
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
inicializarMapaPublicar();

actualizarContadores();
actualizarVistaPrevia();