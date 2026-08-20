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

/* =====================================================
   CAMPOS ESPECÍFICOS PARA CONCIERTOS Y FESTIVALES
===================================================== */

const bloqueMusicaPublicar =
    document.querySelector("#bloque-musica-publicar");

const tipoEventoMusica =
    document.querySelector("#plan-tipo-evento");

const artistaCartelMusica =
    document.querySelector("#plan-artista-cartel");

const aperturaPuertasMusica =
    document.querySelector("#plan-apertura-puertas");

const horaFinMusica =
    document.querySelector("#plan-hora-fin");

const edadMinimaMusica =
    document.querySelector("#plan-edad-minima");

const tipoEntradaMusica =
    document.querySelector("#plan-tipo-entrada");

const campoDificultad =
    document.querySelector("#campo-plan-dificultad");

const etiquetaTituloPlan =
    document.querySelector("#etiqueta-plan-titulo");

const etiquetaDescripcionPlan =
    document.querySelector("#etiqueta-plan-descripcion");

const etiquetaFechaPlan =
    document.querySelector("#etiqueta-plan-fecha");

const etiquetaHoraPlan =
    document.querySelector("#etiqueta-plan-hora");

const etiquetaDuracionPlan =
    document.querySelector("#etiqueta-plan-duracion");

const etiquetaPlazasPlan =
    document.querySelector("#etiqueta-plan-plazas");

const ayudaPlazasPlan =
    document.querySelector("#ayuda-plan-plazas");

const etiquetaUbicacionPlan =
    document.querySelector("#etiqueta-plan-ubicacion");

const ayudaUbicacionPlan =
    document.querySelector("#ayuda-plan-ubicacion");

const etiquetaPrecioPlan =
    document.querySelector("#etiqueta-plan-precio");

const textoBloqueUbicacion =
    document.querySelector("#texto-bloque-ubicacion");

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

let temporizadorGeocodificacionDireccion =
    null;

let secuenciaGeocodificacionDireccion =
    0;

let secuenciaGeocodificacionInversa =
    0;

let ultimaConsultaGeocodificada =
    "";


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
    horaValor = "",
    plazasValor = ""
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

        <div class="campo-formulario">
            <label
                for="plan-plazas-adicional-${identificador}"
                class="sr-only"
            >
                Plazas de esta fecha
            </label>

            <div class="campo-formulario__control">
                <i
                    class="fa-solid fa-user-group"
                    aria-hidden="true"
                ></i>

                <input
                    type="number"
                    id="plan-plazas-adicional-${identificador}"
                    data-plazas-adicional
                    aria-label="Plazas de la fecha adicional"
                    min="1"
                    max="500"
                    inputmode="numeric"
                    placeholder="Plazas"
                    value="${plazasValor}"
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
                "",
            plazas:
                plazas?.value
                    ? Number(
                        plazas.value
                    )
                    : null
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

                const campoPlazas =
                    fila.querySelector(
                        "[data-plazas-adicional]"
                    );

                const valorFecha =
                    campoFecha?.value ||
                    "";

                const valorHora =
                    campoHora?.value ||
                    "";

                const valorPlazas =
                    campoPlazas?.value
                        ? Number(
                            campoPlazas.value
                        )
                        : null;

                if (
                    valorFecha ||
                    valorHora ||
                    valorPlazas
                ) {
                    fechasSeleccionadas.push({
                        fecha:
                            valorFecha,
                        hora:
                            valorHora,
                        plazas:
                            valorPlazas
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
                            "",
                        plazas:
                            null
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
                        ),
                    plazas:
                        item?.plazas !==
                            undefined &&
                        item?.plazas !==
                            null &&
                        item?.plazas !==
                            ""
                            ? Number(
                                item.plazas
                            )
                            : null
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
                item.hora,
                item.plazas ??
                    ""
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
            !item.hora ||
            !item.plazas ||
            Number(item.plazas) < 1 ||
            Number(item.plazas) > 500
        ) {
            if (errorFechasPlan) {
                errorFechasPlan.textContent =
                    "Completa fecha, hora y plazas de todos los días o pases añadidos (entre 1 y 500 plazas).";
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
                    "",
                plazas?.value ||
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


/* =====================================================
   MODO CONCIERTO / FESTIVAL
===================================================== */

function esPlanMusical() {
    return categoria?.value === "musica";
}


function limpiarErroresMusica() {
    limpiarError(
        tipoEventoMusica,
        "error-plan-tipo-evento"
    );

    limpiarError(
        artistaCartelMusica,
        "error-plan-artista-cartel"
    );
}


function actualizarModoPublicacion() {
    const modoMusica =
        esPlanMusical();

    if (bloqueMusicaPublicar) {
        bloqueMusicaPublicar.hidden =
            !modoMusica;
    }

    if (campoDificultad) {
        campoDificultad.hidden =
            modoMusica;
    }

    if (modoMusica) {
        if (dificultad) {
            dificultad.value =
                "Todos los públicos";
        }

        if (etiquetaTituloPlan) {
            etiquetaTituloPlan.textContent =
                "Nombre del concierto o festival";
        }

        if (titulo) {
            titulo.placeholder =
                "Ejemplo: Poncho K - Cartuja Center CITE";
        }

        if (etiquetaDescripcionPlan) {
            etiquetaDescripcionPlan.textContent =
                "Información del evento";
        }

        if (descripcion) {
            descripcion.placeholder =
                "Cuenta quién actúa, cómo será el evento, qué incluye la entrada y cualquier información importante para asistir.";
        }

        if (etiquetaFechaPlan) {
            etiquetaFechaPlan.textContent =
                "Primera fecha / día";
        }

        if (etiquetaHoraPlan) {
            etiquetaHoraPlan.textContent =
                "Hora del concierto / inicio";
        }

        if (etiquetaDuracionPlan) {
            etiquetaDuracionPlan.textContent =
                "Duración aproximada del evento";
        }

        if (etiquetaPlazasPlan) {
            etiquetaPlazasPlan.textContent =
                "Aforo o entradas disponibles";
        }

        if (ayudaPlazasPlan) {
            ayudaPlazasPlan.textContent =
                "Indica las entradas disponibles para esta fecha. Si añades más días o pases, cada uno podrá tener su propio aforo.";
        }

        if (etiquetaUbicacionPlan) {
            etiquetaUbicacionPlan.textContent =
                "Recinto o sala";
        }

        if (ubicacion) {
            ubicacion.placeholder =
                "Ejemplo: Cartuja Center CITE o Calle Leonardo da Vinci, 7";
        }

        if (ayudaUbicacionPlan) {
            ayudaUbicacionPlan.textContent =
                "Escribe el recinto o la calle con número. El mapa intentará localizarlo automáticamente; también puedes pulsar sobre el mapa para rellenar la dirección desde el marcador.";
        }

        if (etiquetaPrecioPlan) {
            etiquetaPrecioPlan.textContent =
                "Precio desde";
        }

        if (textoBloqueUbicacion) {
            textoBloqueUbicacion.textContent =
                "Añade el recinto, la ubicación exacta y el precio de las entradas.";
        }
    } else {
        if (etiquetaTituloPlan) {
            etiquetaTituloPlan.textContent =
                "Título del plan";
        }

        if (titulo) {
            titulo.placeholder =
                "Ejemplo: Ruta nocturna por Sevilla";
        }

        if (etiquetaDescripcionPlan) {
            etiquetaDescripcionPlan.textContent =
                "Descripción";
        }

        if (descripcion) {
            descripcion.placeholder =
                "Explica en qué consiste la actividad, qué se hará y a quién está dirigida.";
        }

        if (etiquetaFechaPlan) {
            etiquetaFechaPlan.textContent =
                "Primera fecha";
        }

        if (etiquetaHoraPlan) {
            etiquetaHoraPlan.textContent =
                "Hora de inicio";
        }

        if (etiquetaDuracionPlan) {
            etiquetaDuracionPlan.textContent =
                "Duración aproximada";
        }

        if (etiquetaPlazasPlan) {
            etiquetaPlazasPlan.textContent =
                "Plazas de la primera fecha";
        }

        if (ayudaPlazasPlan) {
            ayudaPlazasPlan.textContent =
                "Si añades más fechas, cada una podrá tener un número de plazas diferente.";
        }

        if (etiquetaUbicacionPlan) {
            etiquetaUbicacionPlan.textContent =
                "Lugar o dirección concreta";
        }

        if (ubicacion) {
            ubicacion.placeholder =
                "Ejemplo: Calle Feria, 12";
        }

        if (ayudaUbicacionPlan) {
            ayudaUbicacionPlan.textContent =
                "Escribe la calle con su número o el nombre del lugar. El mapa intentará localizarlo automáticamente; si marcas un punto en el mapa, Suralia intentará rellenar municipio, calle y número.";
        }

        if (etiquetaPrecioPlan) {
            etiquetaPrecioPlan.textContent =
                "Precio por persona";
        }

        if (textoBloqueUbicacion) {
            textoBloqueUbicacion.textContent =
                "Añade el lugar de encuentro y el precio por persona.";
        }

        limpiarErroresMusica();
    }

    actualizarVistaPrevia();
}


function obtenerDetallesExtraFormulario() {
    if (!esPlanMusical()) {
        return {};
    }

    return {
        tipo_evento:
            tipoEventoMusica?.value ||
            "",

        artista_cartel:
            artistaCartelMusica?.value.trim() ||
            "",

        apertura_puertas:
            aperturaPuertasMusica?.value ||
            null,

        hora_fin:
            horaFinMusica?.value ||
            null,

        edad_minima:
            edadMinimaMusica?.value ||
            "Todos los públicos",

        tipo_entrada:
            tipoEntradaMusica?.value ||
            "General"
    };
}


categoria?.addEventListener(
    "change",
    actualizarModoPublicacion
);

[
    tipoEventoMusica,
    artistaCartelMusica,
    aperturaPuertasMusica,
    horaFinMusica,
    edadMinimaMusica,
    tipoEntradaMusica
].forEach((campo) => {
    campo?.addEventListener(
        "input",
        actualizarVistaPrevia
    );

    campo?.addEventListener(
        "change",
        actualizarVistaPrevia
    );
});


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

    const categoriaTexto =
        categoria.options[categoria.selectedIndex]?.text ||
        "Categoría";

    const tipoEventoTexto =
        tipoEventoMusica?.value ||
        "";

    vistaCategoria.textContent =
        esPlanMusical() &&
        tipoEventoTexto
            ? `${categoriaTexto} · ${tipoEventoTexto}`
            : categoriaTexto;

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

    const precioFormateado =
        `${valorPrecio.toFixed(2).replace(".00", "")} €`;

    vistaPrecio.textContent =
        !precio.value || valorPrecio === 0
            ? "Gratis"
            : esPlanMusical()
                ? `Desde ${precioFormateado}`
                : precioFormateado;
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


function actualizarEstadoMapaPublicar(
    mensaje,
    seleccionado = false
) {
    if (!estadoMapaPublicar) {
        return;
    }

    estadoMapaPublicar.textContent =
        mensaje;

    estadoMapaPublicar.classList.toggle(
        "mapa-publicar__estado--seleccionado",
        seleccionado
    );
}


function actualizarEstadoPuntoMapa(
    latitud,
    longitud
) {
    if (
        !Number.isFinite(latitud) ||
        !Number.isFinite(longitud)
    ) {
        actualizarEstadoMapaPublicar(
            "Ubicación pendiente",
            false
        );

        return;
    }

    actualizarEstadoMapaPublicar(
        "Ubicación localizada",
        true
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

    const textoPopup =
        ubicacion?.value.trim() ||
        municipio?.value.trim() ||
        "Ubicación del plan";

    if (!marcadorUbicacionPublicar) {
        marcadorUbicacionPublicar =
            L.marker(
                [
                    lat,
                    lng
                ],
                {
                    draggable:
                        true,
                    autoPan:
                        true
                }
            ).addTo(
                mapaUbicacionPublicar
            );

        marcadorUbicacionPublicar.on(
            "dragend",
            async (
                evento
            ) => {
                const posicion =
                    evento.target.getLatLng();

                guardarPuntoMapa(
                    posicion.lat,
                    posicion.lng,
                    false
                );

                await rellenarDireccionDesdeMarcador(
                    posicion.lat,
                    posicion.lng
                );
            }
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
        textoPopup
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


function obtenerDatosDireccionMapa() {
    return {
        municipio:
            municipio?.value.trim() ||
            "",

        direccion:
            ubicacion?.value.trim() ||
            ""
    };
}


function normalizarDireccionBusqueda(
    valor
) {
    return String(
        valor ||
        ""
    )
        .replace(
            /\bC\/\s*/gi,
            "Calle "
        )
        .replace(
            /\bC\.\s*/gi,
            "Calle "
        )
        .replace(
            /\bAvda\.?\s*/gi,
            "Avenida "
        )
        .replace(
            /\bAv\.\s*/gi,
            "Avenida "
        )
        .replace(
            /\bPza\.?\s*/gi,
            "Plaza "
        )
        .replace(
            /\s*,\s*/g,
            ", "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}


function obtenerConsultaDireccionMapa() {
    const datos =
        obtenerDatosDireccionMapa();

    if (
        datos.municipio.length < 2 ||
        datos.direccion.length < 3
    ) {
        return "";
    }

    return [
        normalizarDireccionBusqueda(
            datos.direccion
        ),
        datos.municipio,
        "Sevilla",
        "España"
    ]
        .filter(Boolean)
        .join(", ");
}


function obtenerVariantesDireccion(
    direccion
) {
    const original =
        normalizarDireccionBusqueda(
            direccion
        );

    if (!original) {
        return [];
    }

    const sinComas =
        original.replace(
            /,/g,
            " "
        );

    const sinTipoVia =
        sinComas
            .replace(
                /^(calle|avenida|plaza|paseo|camino|carretera|ronda|glorieta|alameda)\s+/i,
                ""
            )
            .trim();

    return [
        ...new Set(
            [
                original,
                sinComas,
                sinTipoVia
            ]
                .map(
                    (texto) =>
                        texto
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim()
                )
                .filter(Boolean)
        )
    ];
}


function obtenerConsultasAlternativasDireccionMapa() {
    const {
        municipio:
            municipioTexto,
        direccion:
            direccionTexto
    } = obtenerDatosDireccionMapa();

    if (
        municipioTexto.length < 2 ||
        direccionTexto.length < 3
    ) {
        return [];
    }

    const variantes =
        obtenerVariantesDireccion(
            direccionTexto
        );

    const consultas =
        [];

    variantes.forEach(
        (
            direccionVariante
        ) => {
            consultas.push(
                [
                    direccionVariante,
                    municipioTexto,
                    "Sevilla",
                    "España"
                ].join(", ")
            );

            consultas.push(
                [
                    direccionVariante,
                    municipioTexto,
                    "España"
                ].join(", ")
            );

            consultas.push(
                [
                    direccionVariante,
                    "Sevilla",
                    "España"
                ].join(", ")
            );
        }
    );

    return [
        ...new Set(
            consultas
                .map(
                    (consulta) =>
                        consulta
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim()
                )
                .filter(Boolean)
        )
    ];
}


function limpiarCoordenadasPorCambioDireccion() {
    if (latitudPlan) {
        latitudPlan.value =
            "";
    }

    if (longitudPlan) {
        longitudPlan.value =
            "";
    }

    mapaPublicarPlan?.setAttribute(
        "aria-invalid",
        "false"
    );

    if (errorCoordenadas) {
        errorCoordenadas.textContent =
            "";
    }
}


async function buscarDireccionNominatimEstructurada() {
    const {
        municipio:
            municipioTexto,
        direccion:
            direccionTexto
    } = obtenerDatosDireccionMapa();

    if (
        municipioTexto.length < 2 ||
        direccionTexto.length < 3
    ) {
        return null;
    }

    const variantes =
        obtenerVariantesDireccion(
            direccionTexto
        );

    for (
        const calle of
            variantes
    ) {
        const parametros =
            new URLSearchParams({
                street:
                    calle,
                city:
                    municipioTexto,
                county:
                    "Sevilla",
                country:
                    "España",
                countrycodes:
                    "es",
                format:
                    "jsonv2",
                limit:
                    "1",
                addressdetails:
                    "1",
                "accept-language":
                    "es"
            });

        const respuesta =
            await fetch(
                `https://nominatim.openstreetmap.org/search?${parametros.toString()}`,
                {
                    method:
                        "GET",
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

        if (!respuesta.ok) {
            throw new Error(
                `Nominatim respondió ${respuesta.status}.`
            );
        }

        const resultados =
            await respuesta.json();

        const resultado =
            Array.isArray(
                resultados
            )
                ? resultados[0]
                : null;

        const lat =
            Number(
                resultado?.lat
            );

        const lng =
            Number(
                resultado?.lon
            );

        if (
            Number.isFinite(
                lat
            ) &&
            Number.isFinite(
                lng
            )
        ) {
            return {
                lat,
                lng,
                nombre:
                    resultado?.display_name ||
                    calle,
                proveedor:
                    "OpenStreetMap"
            };
        }
    }

    return null;
}


async function buscarDireccionNominatim(
    consulta
) {
    const parametros =
        new URLSearchParams({
            q:
                consulta,
            format:
                "jsonv2",
            limit:
                "1",
            countrycodes:
                "es",
            addressdetails:
                "1",
            "accept-language":
                "es"
        });

    const respuesta =
        await fetch(
            `https://nominatim.openstreetmap.org/search?${parametros.toString()}`,
            {
                method:
                    "GET",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

    if (!respuesta.ok) {
        throw new Error(
            `Nominatim respondió ${respuesta.status}.`
        );
    }

    const resultados =
        await respuesta.json();

    const resultado =
        Array.isArray(resultados)
            ? resultados[0]
            : null;

    const lat =
        Number(
            resultado?.lat
        );

    const lng =
        Number(
            resultado?.lon
        );

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return null;
    }

    return {
        lat,
        lng,
        nombre:
            resultado?.display_name ||
            consulta,
        proveedor:
            "OpenStreetMap"
    };
}


async function buscarDireccionPhoton(
    consulta
) {
    const parametros =
        new URLSearchParams({
            q:
                consulta,
            limit:
                "1",
            lang:
                "es",
            lat:
                "37.3891",
            lon:
                "-5.9845"
        });

    const respuesta =
        await fetch(
            `https://photon.komoot.io/api/?${parametros.toString()}`,
            {
                method:
                    "GET",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

    if (!respuesta.ok) {
        throw new Error(
            `Photon respondió ${respuesta.status}.`
        );
    }

    const datos =
        await respuesta.json();

    const feature =
        Array.isArray(
            datos?.features
        )
            ? datos.features[0]
            : null;

    const coordenadas =
        feature?.geometry?.coordinates;

    const lng =
        Number(
            coordenadas?.[0]
        );

    const lat =
        Number(
            coordenadas?.[1]
        );

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return null;
    }

    const propiedades =
        feature?.properties ||
        {};

    const partesNombre = [
        propiedades.name,
        propiedades.street,
        propiedades.housenumber,
        propiedades.city ||
            propiedades.town ||
            propiedades.village,
        propiedades.state
    ]
        .filter(Boolean);

    return {
        lat,
        lng,
        nombre:
            partesNombre.join(", ") ||
            consulta,
        proveedor:
            "Photon"
    };
}


async function buscarDireccionConFallback(
    consultas
) {
    /*
        1. Búsqueda estructurada:
        suele funcionar mejor cuando hay calle + número.
    */
    try {
        const resultadoEstructurado =
            await buscarDireccionNominatimEstructurada();

        if (resultadoEstructurado) {
            return resultadoEstructurado;
        }
    } catch (error) {
        console.warn(
            "La búsqueda estructurada de OpenStreetMap falló:",
            error
        );
    }

    /*
        2. Búsquedas libres con distintas variantes.
    */
    for (
        const consulta of
            consultas
    ) {
        try {
            const resultado =
                await buscarDireccionNominatim(
                    consulta
                );

            if (resultado) {
                return {
                    ...resultado,
                    consulta
                };
            }
        } catch (error) {
            console.warn(
                "Nominatim no pudo resolver la dirección:",
                error
            );

            break;
        }
    }

    /*
        3. Proveedor alternativo.
    */
    for (
        const consulta of
            consultas
    ) {
        try {
            const resultado =
                await buscarDireccionPhoton(
                    consulta
                );

            if (resultado) {
                return {
                    ...resultado,
                    consulta
                };
            }
        } catch (error) {
            console.warn(
                "Photon no pudo resolver la dirección:",
                error
            );

            break;
        }
    }

    return null;
}


async function geocodificarDireccionMapa() {
    const consultaPrincipal =
        obtenerConsultaDireccionMapa();

    const consultas =
        obtenerConsultasAlternativasDireccionMapa();

    if (
        !consultaPrincipal ||
        consultas.length === 0
    ) {
        ultimaConsultaGeocodificada =
            "";

        limpiarCoordenadasPorCambioDireccion();

        actualizarEstadoMapaPublicar(
            "Escribe municipio, calle y número",
            false
        );

        return;
    }

    if (
        consultaPrincipal ===
            ultimaConsultaGeocodificada &&
        latitudPlan?.value &&
        longitudPlan?.value
    ) {
        return;
    }

    const numeroSolicitud =
        ++secuenciaGeocodificacionDireccion;

    limpiarCoordenadasPorCambioDireccion();

    actualizarEstadoMapaPublicar(
        "Buscando dirección...",
        false
    );

    try {
        const resultado =
            await buscarDireccionConFallback(
                consultas
            );

        if (
            numeroSolicitud !==
            secuenciaGeocodificacionDireccion
        ) {
            return;
        }

        if (!resultado) {
            actualizarEstadoMapaPublicar(
                "No se ha encontrado la dirección",
                false
            );

            if (errorCoordenadas) {
                errorCoordenadas.textContent =
                    "No hemos localizado esa dirección. Prueba con calle y número, por ejemplo: Calle Feria, 12. También puedes marcar el punto en el mapa y Suralia intentará rellenar la dirección.";
            }

            return;
        }

        ultimaConsultaGeocodificada =
            consultaPrincipal;

        guardarPuntoMapa(
            resultado.lat,
            resultado.lng,
            true
        );

        actualizarEstadoMapaPublicar(
            "Ubicación encontrada automáticamente",
            true
        );

        if (errorCoordenadas) {
            errorCoordenadas.textContent =
                "";
        }
    } catch (error) {
        if (
            numeroSolicitud !==
            secuenciaGeocodificacionDireccion
        ) {
            return;
        }

        console.error(
            "No se pudo localizar automáticamente la dirección:",
            error
        );

        actualizarEstadoMapaPublicar(
            "No se pudo localizar automáticamente",
            false
        );

        if (errorCoordenadas) {
            errorCoordenadas.textContent =
                "No se ha podido localizar automáticamente. Escribe calle y número o marca el punto en el mapa.";
        }
    }
}


function programarGeocodificacionDireccion(
    espera = 1200
) {
    window.clearTimeout(
        temporizadorGeocodificacionDireccion
    );

    secuenciaGeocodificacionDireccion +=
        1;

    const consulta =
        obtenerConsultaDireccionMapa();

    if (!consulta) {
        limpiarCoordenadasPorCambioDireccion();

        actualizarEstadoMapaPublicar(
            "Escribe municipio, calle y número",
            false
        );

        return;
    }

    actualizarEstadoMapaPublicar(
        "Preparando ubicación...",
        false
    );

    temporizadorGeocodificacionDireccion =
        window.setTimeout(
            geocodificarDireccionMapa,
            espera
        );
}


function construirDireccionDesdeAddressNominatim(
    address
) {
    const datos =
        address ||
        {};

    const via =
        datos.road ||
        datos.pedestrian ||
        datos.residential ||
        datos.living_street ||
        datos.footway ||
        datos.path ||
        datos.cycleway ||
        datos.square ||
        datos.place ||
        "";

    const numero =
        datos.house_number ||
        "";

    const direccion =
        [
            via,
            numero
        ]
            .filter(Boolean)
            .join(", ");

    const municipioEncontrado =
        datos.city ||
        datos.town ||
        datos.village ||
        datos.municipality ||
        datos.hamlet ||
        "";

    return {
        direccion,
        municipio:
            municipioEncontrado
    };
}


async function buscarDireccionInversaNominatim(
    lat,
    lng
) {
    const parametros =
        new URLSearchParams({
            lat:
                String(lat),
            lon:
                String(lng),
            format:
                "jsonv2",
            zoom:
                "18",
            addressdetails:
                "1",
            "accept-language":
                "es"
        });

    const respuesta =
        await fetch(
            `https://nominatim.openstreetmap.org/reverse?${parametros.toString()}`,
            {
                method:
                    "GET",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

    if (!respuesta.ok) {
        throw new Error(
            `Nominatim reverse respondió ${respuesta.status}.`
        );
    }

    const datos =
        await respuesta.json();

    const direccion =
        construirDireccionDesdeAddressNominatim(
            datos?.address
        );

    if (
        !direccion.direccion &&
        !direccion.municipio
    ) {
        return null;
    }

    return {
        ...direccion,
        nombreCompleto:
            datos?.display_name ||
            ""
    };
}


async function buscarDireccionInversaPhoton(
    lat,
    lng
) {
    const parametros =
        new URLSearchParams({
            lat:
                String(lat),
            lon:
                String(lng),
            lang:
                "es"
        });

    const respuesta =
        await fetch(
            `https://photon.komoot.io/reverse?${parametros.toString()}`,
            {
                method:
                    "GET",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

    if (!respuesta.ok) {
        throw new Error(
            `Photon reverse respondió ${respuesta.status}.`
        );
    }

    const datos =
        await respuesta.json();

    const feature =
        Array.isArray(
            datos?.features
        )
            ? datos.features[0]
            : null;

    const propiedades =
        feature?.properties ||
        {};

    const via =
        propiedades.street ||
        propiedades.name ||
        "";

    const numero =
        propiedades.housenumber ||
        "";

    const municipioEncontrado =
        propiedades.city ||
        propiedades.town ||
        propiedades.village ||
        propiedades.district ||
        "";

    if (
        !via &&
        !municipioEncontrado
    ) {
        return null;
    }

    return {
        direccion:
            [
                via,
                numero
            ]
                .filter(Boolean)
                .join(", "),

        municipio:
            municipioEncontrado,

        nombreCompleto:
            [
                via,
                numero,
                municipioEncontrado
            ]
                .filter(Boolean)
                .join(", ")
    };
}


async function obtenerDireccionDesdeCoordenadas(
    lat,
    lng
) {
    try {
        const resultado =
            await buscarDireccionInversaNominatim(
                lat,
                lng
            );

        if (resultado) {
            return resultado;
        }
    } catch (error) {
        console.warn(
            "OpenStreetMap no pudo obtener la dirección del marcador:",
            error
        );
    }

    try {
        return await buscarDireccionInversaPhoton(
            lat,
            lng
        );
    } catch (error) {
        console.warn(
            "Photon no pudo obtener la dirección del marcador:",
            error
        );

        return null;
    }
}


async function rellenarDireccionDesdeMarcador(
    lat,
    lng
) {
    const numeroSolicitud =
        ++secuenciaGeocodificacionInversa;

    actualizarEstadoMapaPublicar(
        "Obteniendo calle y municipio...",
        true
    );

    const resultado =
        await obtenerDireccionDesdeCoordenadas(
            lat,
            lng
        );

    if (
        numeroSolicitud !==
        secuenciaGeocodificacionInversa
    ) {
        return;
    }

    if (!resultado) {
        actualizarEstadoMapaPublicar(
            "Punto guardado; dirección no encontrada",
            true
        );

        return;
    }

    if (
        resultado.municipio &&
        municipio
    ) {
        municipio.value =
            resultado.municipio;
    }

    if (
        resultado.direccion &&
        ubicacion
    ) {
        ubicacion.value =
            resultado.direccion;
    }

    limpiarError(
        municipio,
        "error-plan-municipio"
    );

    limpiarError(
        ubicacion,
        "error-plan-ubicacion"
    );

    if (errorCoordenadas) {
        errorCoordenadas.textContent =
            "";
    }

    ultimaConsultaGeocodificada =
        obtenerConsultaDireccionMapa();

    actualizarVistaPrevia();

    if (marcadorUbicacionPublicar) {
        const popup =
            [
                ubicacion?.value.trim(),
                municipio?.value.trim()
            ]
                .filter(Boolean)
                .join(" · ");

        if (popup) {
            marcadorUbicacionPublicar
                .bindPopup(
                    popup
                )
                .openPopup();
        }
    }

    actualizarEstadoMapaPublicar(
        "Municipio, calle y número obtenidos del mapa",
        true
    );

    if (
        marcadorUbicacionPublicar
    ) {
        marcadorUbicacionPublicar.dragging?.enable();
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
                    true,
                doubleClickZoom:
                    true,
                touchZoom:
                    true,
                boxZoom:
                    true,
                keyboard:
                    true,
                dragging:
                    true,
                zoomControl:
                    true
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

    const ControlMiUbicacion =
        L.Control.extend({
            options: {
                position:
                    "topright"
            },

            onAdd() {
                const boton =
                    L.DomUtil.create(
                        "button",
                        "leaflet-bar mapa-publicar__mi-ubicacion"
                    );

                boton.type =
                    "button";

                boton.title =
                    "Usar mi ubicación";

                boton.setAttribute(
                    "aria-label",
                    "Usar mi ubicación"
                );

                boton.innerHTML = `
                    <i
                        class="fa-solid fa-location-crosshairs"
                        aria-hidden="true"
                    ></i>
                `;

                L.DomEvent.disableClickPropagation(
                    boton
                );

                L.DomEvent.disableScrollPropagation(
                    boton
                );

                L.DomEvent.on(
                    boton,
                    "click",
                    async () => {
                        if (
                            !navigator.geolocation
                        ) {
                            actualizarEstadoMapaPublicar(
                                "Tu navegador no permite obtener la ubicación",
                                false
                            );

                            return;
                        }

                        boton.disabled =
                            true;

                        actualizarEstadoMapaPublicar(
                            "Buscando tu ubicación...",
                            false
                        );

                        navigator.geolocation.getCurrentPosition(
                            async (
                                posicion
                            ) => {
                                const lat =
                                    posicion.coords.latitude;

                                const lng =
                                    posicion.coords.longitude;

                                guardarPuntoMapa(
                                    lat,
                                    lng,
                                    true
                                );

                                await rellenarDireccionDesdeMarcador(
                                    lat,
                                    lng
                                );

                                boton.disabled =
                                    false;
                            },

                            (
                                error
                            ) => {
                                console.warn(
                                    "No se pudo obtener la ubicación actual:",
                                    error
                                );

                                actualizarEstadoMapaPublicar(
                                    "No se ha podido obtener tu ubicación",
                                    false
                                );

                                boton.disabled =
                                    false;
                            },

                            {
                                enableHighAccuracy:
                                    true,
                                timeout:
                                    10000,
                                maximumAge:
                                    30000
                            }
                        );
                    }
                );

                return boton;
            }
        });

    mapaUbicacionPublicar.addControl(
        new ControlMiUbicacion()
    );


    mapaUbicacionPublicar.on(
        "click",
        async (
            evento
        ) => {
            window.clearTimeout(
                temporizadorGeocodificacionDireccion
            );

            /*
                Invalida una búsqueda automática en curso.
            */
            secuenciaGeocodificacionDireccion +=
                1;

            const lat =
                evento.latlng.lat;

            const lng =
                evento.latlng.lng;

            guardarPuntoMapa(
                lat,
                lng,
                false
            );

            await rellenarDireccionDesdeMarcador(
                lat,
                lng
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


municipio?.addEventListener(
    "input",
    () => {
        programarGeocodificacionDireccion();
    }
);

ubicacion?.addEventListener(
    "input",
    () => {
        programarGeocodificacionDireccion();
    }
);

municipio?.addEventListener(
    "change",
    () => {
        programarGeocodificacionDireccion(
            100
        );
    }
);

ubicacion?.addEventListener(
    "change",
    () => {
        programarGeocodificacionDireccion(
            100
        );
    }
);


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

                    detalles_extra:
                        datos.detallesExtra,

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

        detallesExtra:
            obtenerDetallesExtraFormulario(),

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

    limpiarErroresMusica();

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

    if (esPlanMusical()) {
        if (!tipoEventoMusica?.value) {
            mostrarError(
                tipoEventoMusica,
                "error-plan-tipo-evento",
                "Selecciona si es concierto, festival, sesión DJ u otro tipo de evento."
            );

            formularioValido = false;
        }

        if (
            !artistaCartelMusica?.value.trim() ||
            artistaCartelMusica.value.trim().length < 2
        ) {
            mostrarError(
                artistaCartelMusica,
                "error-plan-artista-cartel",
                "Indica el artista, grupo, DJ o cartel del evento."
            );

            formularioValido = false;
        }
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
                "Escribe municipio, calle y número para localizar el plan. También puedes marcar el punto en el mapa y Suralia intentará rellenar esos datos.";
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

    const detallesExtraBorrador =
        borrador.detallesExtra ||
        borrador.detalles_extra ||
        {};

    if (tipoEventoMusica) {
        tipoEventoMusica.value =
            detallesExtraBorrador.tipo_evento ||
            "";
    }

    if (artistaCartelMusica) {
        artistaCartelMusica.value =
            detallesExtraBorrador.artista_cartel ||
            "";
    }

    if (aperturaPuertasMusica) {
        aperturaPuertasMusica.value =
            detallesExtraBorrador.apertura_puertas ||
            "";
    }

    if (horaFinMusica) {
        horaFinMusica.value =
            detallesExtraBorrador.hora_fin ||
            "";
    }

    if (edadMinimaMusica) {
        edadMinimaMusica.value =
            detallesExtraBorrador.edad_minima ||
            "Todos los públicos";
    }

    if (tipoEntradaMusica) {
        tipoEntradaMusica.value =
            detallesExtraBorrador.tipo_entrada ||
            "General";
    }

    actualizarModoPublicacion();

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
    tipoEventoMusica,
    artistaCartelMusica,
    aperturaPuertasMusica,
    horaFinMusica,
    edadMinimaMusica,
    tipoEntradaMusica,
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
actualizarModoPublicacion();

if (
    !latitudPlan?.value &&
    !longitudPlan?.value &&
    obtenerConsultaDireccionMapa()
) {
    programarGeocodificacionDireccion(
        250
    );
}

actualizarContadores();
actualizarVistaPrevia();