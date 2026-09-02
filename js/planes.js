/* =====================================================
   ELEMENTOS DE LOS FILTROS
===================================================== */

const formularioFiltros = document.querySelector(
    "#formulario-filtros"
);

const filtroTexto = document.querySelector(
    "#filtro-texto"
);

const filtroMunicipio = document.querySelector(
    "#filtro-municipio"
);

const filtroCategoria = document.querySelector(
    "#filtro-categoria"
);

const filtroPrecio = document.querySelector(
    "#filtro-precio"
);

const filtroDistancia = document.querySelector(
    "#filtro-distancia"
);

const estadoUbicacionFiltro =
    document.querySelector(
        "#estado-ubicacion-filtro"
    );

const filtroOrden = document.querySelector(
    "#filtro-orden"
);

const filtroVoySolo = document.querySelector(
    "#filtro-voy-solo"
);

const filtroPrimeraVez = document.querySelector(
    "#filtro-primera-vez"
);

const filtroAmbiente = document.querySelector(
    "#filtro-ambiente"
);

const filtroGratisRapido = document.querySelector(
    "#filtro-gratis-rapido"
);

const filtroNuevos = document.querySelector(
    "#filtro-nuevos"
);

const filtroAnimo = document.querySelector(
    "#filtro-animo"
);

const opcionesAnimoUnificado = Array.from(
    document.querySelectorAll(
        'input[name="animo-rapido"]'
    )
);

const opcionesDistanciaUnificada = Array.from(
    document.querySelectorAll(
        'input[name="distancia-rapida"]'
    )
);

const botonCercaDeMi = document.querySelector(
    "#boton-cerca-de-mi"
);

const filtrosActivos = document.querySelector(
    "#filtros-activos"
);

const listaFiltrosActivos = document.querySelector(
    "#lista-filtros-activos"
);

const botonVistaLista = document.querySelector(
    "#vista-lista"
);

const botonVistaMapa = document.querySelector(
    "#vista-mapa"
);

const mapaPlanesExplorar = document.querySelector(
    "#mapa-planes-explorar"
);

const botonModoSuralia = document.querySelector(
    "#boton-modo-suralia"
);

const contenidoModoSuralia = document.querySelector(
    "#contenido-modo-suralia"
);

const buscarModoSuralia = document.querySelector(
    "#buscar-modo-suralia"
);

const resultadosModoSuralia = document.querySelector(
    "#resultados-modo-suralia"
);

const sorprenderModoSuralia = document.querySelector(
    "#sorprendeme-modo-suralia"
);

/*
    Modo Suralia reactivo:
    después de generar la primera recomendación, cualquier cambio
    en ánimo, fecha, presupuesto, compañía o distancia actualiza
    automáticamente los planes sin volver a pulsar el botón.
*/
const opcionesInteractivasModoSuralia = Array.from(
    document.querySelectorAll(
        'input[name^="modo-suralia-"]'
    )
);

let modoSuraliaEnUso = false;
let temporizadorActualizacionModoSuralia = null;
let secuenciaRecomendacionModoSuralia = 0;

const botonesFiltroFecha = Array.from(
    document.querySelectorAll(
        ".filtro-fecha-rapida[data-filtro-fecha]"
    )
);

const filtroFechaPersonalizada =
    document.querySelector(
        "#filtro-fecha-personalizada"
    );

const contenedorFechaPersonalizada =
    document.querySelector(
        ".filtro-fecha-personalizada"
    );

const botonLimpiar = document.querySelector(
    "#boton-limpiar"
);

const botonRestablecer = document.querySelector(
    "#boton-restablecer"
);

const listaPlanes = document.querySelector(
    "#lista-planes"
);

let planes = Array.from(
    document.querySelectorAll(
        "#lista-planes .tarjeta-plan"
    )
);


/* =====================================================
   DATOS OFICIALES DESDE EL CATÁLOGO
===================================================== */

function obtenerPlanCatalogo(
    tarjeta
) {
    const planId =
        tarjeta?.dataset.planId ||
        "";

    if (
        !planId ||
        typeof window.obtenerPlanSuralia !==
            "function"
    ) {
        return null;
    }

    return window.obtenerPlanSuralia(
        planId
    );
}


function obtenerDatosPlan(
    tarjeta
) {
    const datosCatalogo =
        obtenerPlanCatalogo(
            tarjeta
        );

    return {
        planId:
            datosCatalogo?.planId ||
            tarjeta?.dataset.planId ||
            "",

        titulo:
            datosCatalogo?.titulo ||
            tarjeta?.dataset.titulo ||
            tarjeta?.dataset.nombre ||
            "",

        categoria:
            datosCatalogo?.categoria ||
            tarjeta?.dataset.categoria ||
            "",

        categoriaTexto:
            datosCatalogo?.categoriaTexto ||
            tarjeta?.dataset.categoriaTexto ||
            tarjeta?.dataset.categoria ||
            "",

        imagen:
            datosCatalogo?.imagen ||
            tarjeta?.dataset.imagen ||
            "",

        fechaTexto:
            datosCatalogo?.fechaTexto ||
            tarjeta?.dataset.fecha ||
            "",

        fechaIso:
            datosCatalogo?.fechaIso ||
            tarjeta?.dataset.fechaIso ||
            "",

        ubicacion:
            datosCatalogo?.ubicacion ||
            tarjeta?.dataset.ubicacion ||
            "",

        municipio:
            tarjeta?.dataset.municipio ||
            "",

        descripcion:
            tarjeta?.dataset.descripcion ||
            tarjeta?.querySelector(
                ".tarjeta-plan__descripcion"
            )?.textContent ||
            "",

        idealPrimeraVez:
            tarjeta?.dataset.idealPrimeraVez ===
                "true",

        latitud:
            Number(
                tarjeta?.dataset.latitud ||
                0
            ),

        longitud:
            Number(
                tarjeta?.dataset.longitud ||
                0
            ),

        precio:
            Number(
                datosCatalogo?.precio ??
                tarjeta?.dataset.precio ??
                0
            ),

        valoracion:
            Number(
                datosCatalogo?.valoracion ??
                tarjeta?.dataset.valoracion ??
                0
            ),

        enlace:
            datosCatalogo?.enlace ||
            tarjeta?.dataset.enlace ||
            (
                tarjeta?.dataset.planId
                    ? `detalle-plan.html?id=${tarjeta.dataset.planId}`
                    : "planes.html"
            )
    };
}

const numeroResultados = document.querySelector(
    "#numero-resultados"
);

const sinResultados = document.querySelector(
    "#sin-resultados"
);

const resumenResultados = document.querySelector(
    "#resumen-resultados"
);

const botonVista = document.querySelector(
    ".boton-vista"
);

let fechaBuscadaDesdePortada = "";

let filtroFechaRapidaActual = "";

let vistaCompactaActiva = false;

let ubicacionUsuarioFiltro = null;

let vistaResultadosActual = "lista";

let mapaExplorar = null;

let capaMarcadoresMapa = null;

let planesVisiblesActuales = [];


/* =====================================================
   NOTIFICACIONES
===================================================== */

const notificacionPlanes = document.querySelector(
    "#notificacion"
);

let temporizadorNotificacionPlanes;

function mostrarNotificacion(mensaje) {
    if (!notificacionPlanes) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacionPlanes.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPlanes.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacionPlanes
    );

    temporizadorNotificacionPlanes = setTimeout(
        () => {
            notificacionPlanes.classList.remove(
                "visible"
            );
        },
        3000
    );
}


/* =====================================================
   PARÁMETROS RECIBIDOS DESDE INDEX.HTML
===================================================== */

function obtenerParametrosBusqueda() {
    const parametros = new URLSearchParams(
        window.location.search
    );

    return {
        busqueda:
            parametros.get("busqueda") || "",

        fecha:
            parametros.get("fecha") || ""
    };
}


function aplicarParametrosIniciales() {
    const parametros =
        obtenerParametrosBusqueda();

    if (
        parametros.busqueda &&
        filtroTexto
    ) {
        filtroTexto.value =
            parametros.busqueda;
    }

    fechaBuscadaDesdePortada =
        parametros.fecha;

    if (
        filtroFechaPersonalizada &&
        parametros.fecha &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            parametros.fecha
        )
    ) {
        filtroFechaPersonalizada.value =
            parametros.fecha;
    }

    actualizarEstadoFiltrosFecha();
}


/* =====================================================
   FILTROS
===================================================== */

function normalizarTexto(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


function obtenerFechaLocalISO() {
    const ahora =
        new Date();

    const anio =
        ahora.getFullYear();

    const mes =
        String(
            ahora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            ahora.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${anio}-${mes}-${dia}`;
}


function crearFechaLocalDesdeISO(
    fechaIso
) {
    const valor =
        String(
            fechaIso ||
            ""
        ).slice(
            0,
            10
        );

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            valor
        )
    ) {
        return null;
    }

    const [
        anio,
        mes,
        dia
    ] = valor
        .split("-")
        .map(Number);

    const fecha =
        new Date(
            anio,
            mes - 1,
            dia
        );

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return null;
    }

    return fecha;
}


function convertirFechaLocalAISO(
    fecha
) {
    if (
        !(fecha instanceof Date) ||
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return "";
    }

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const dia =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${anio}-${mes}-${dia}`;
}


function sumarDiasFecha(
    fecha,
    dias
) {
    const copia =
        new Date(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate()
        );

    copia.setDate(
        copia.getDate() +
        Number(
            dias ||
            0
        )
    );

    return copia;
}


function obtenerRangoFiltroFecha(
    tipo
) {
    const hoy =
        crearFechaLocalDesdeISO(
            obtenerFechaLocalISO()
        );

    if (!hoy) {
        return null;
    }

    let inicio =
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        );

    let fin =
        new Date(
            inicio.getFullYear(),
            inicio.getMonth(),
            inicio.getDate()
        );

    const diaSemana =
        inicio.getDay();

    if (
        tipo ===
        "hoy"
    ) {
        return {
            inicio:
                convertirFechaLocalAISO(
                    inicio
                ),

            fin:
                convertirFechaLocalAISO(
                    fin
                )
        };
    }

    if (
        tipo ===
        "manana"
    ) {
        inicio =
            sumarDiasFecha(
                inicio,
                1
            );

        fin =
            new Date(
                inicio.getFullYear(),
                inicio.getMonth(),
                inicio.getDate()
            );

        return {
            inicio:
                convertirFechaLocalAISO(
                    inicio
                ),

            fin:
                convertirFechaLocalAISO(
                    fin
                )
        };
    }

    if (
        tipo ===
        "finde"
    ) {
        /*
            Si hoy es sábado, el finde es sábado + domingo.
            Si hoy es domingo, queda únicamente el domingo.
            El resto de días toma el sábado y domingo próximos.
        */
        if (
            diaSemana ===
            6
        ) {
            fin =
                sumarDiasFecha(
                    inicio,
                    1
                );
        } else if (
            diaSemana ===
            0
        ) {
            fin =
                new Date(
                    inicio.getFullYear(),
                    inicio.getMonth(),
                    inicio.getDate()
                );
        } else {
            inicio =
                sumarDiasFecha(
                    inicio,
                    6 -
                    diaSemana
                );

            fin =
                sumarDiasFecha(
                    inicio,
                    1
                );
        }

        return {
            inicio:
                convertirFechaLocalAISO(
                    inicio
                ),

            fin:
                convertirFechaLocalAISO(
                    fin
                )
        };
    }

    if (
        tipo ===
        "semana"
    ) {
        const diasHastaDomingo =
            diaSemana ===
                0
                ? 0
                : 7 -
                  diaSemana;

        fin =
            sumarDiasFecha(
                inicio,
                diasHastaDomingo
            );

        return {
            inicio:
                convertirFechaLocalAISO(
                    inicio
                ),

            fin:
                convertirFechaLocalAISO(
                    fin
                )
        };
    }

    if (
        tipo ===
        "proxima-semana"
    ) {
        const diasHastaLunesSiguiente =
            diaSemana ===
                0
                ? 1
                : 8 -
                  diaSemana;

        inicio =
            sumarDiasFecha(
                inicio,
                diasHastaLunesSiguiente
            );

        fin =
            sumarDiasFecha(
                inicio,
                6
            );

        return {
            inicio:
                convertirFechaLocalAISO(
                    inicio
                ),

            fin:
                convertirFechaLocalAISO(
                    fin
                )
        };
    }

    return null;
}


function obtenerFechasVigentesTarjeta(
    tarjeta
) {
    if (!tarjeta) {
        return [];
    }

    const fechasDataset =
        String(
            tarjeta.dataset.fechasVigentes ||
            ""
        )
            .split(",")
            .map(
                (
                    fecha
                ) =>
                    fecha
                        .trim()
                        .slice(
                            0,
                            10
                        )
            )
            .filter(
                (
                    fecha
                ) =>
                    /^\d{4}-\d{2}-\d{2}$/.test(
                        fecha
                    )
            );

    if (
        fechasDataset.length >
        0
    ) {
        return Array.from(
            new Set(
                fechasDataset
            )
        );
    }

    const fechaPrincipal =
        String(
            tarjeta.dataset.fechaIso ||
            ""
        ).slice(
            0,
            10
        );

    return /^\d{4}-\d{2}-\d{2}$/.test(
        fechaPrincipal
    )
        ? [
            fechaPrincipal
        ]
        : [];
}


function cumpleFiltroFechaPlan(
    tarjeta
) {
    const fechas =
        obtenerFechasVigentesTarjeta(
            tarjeta
        );

    if (
        fechas.length ===
        0
    ) {
        return (
            !fechaBuscadaDesdePortada &&
            !filtroFechaRapidaActual &&
            !filtroFechaPersonalizada?.value
        );
    }

    /*
        Si la búsqueda llega desde la portada con una fecha exacta,
        esa fecha tiene prioridad hasta que el usuario toque
        alguno de los filtros de fecha de esta página.
    */
    if (
        fechaBuscadaDesdePortada
    ) {
        return fechas.includes(
            fechaBuscadaDesdePortada
        );
    }

    const fechaPersonalizada =
        filtroFechaPersonalizada?.value ||
        "";

    if (
        fechaPersonalizada
    ) {
        return fechas.includes(
            fechaPersonalizada
        );
    }

    if (
        !filtroFechaRapidaActual
    ) {
        return true;
    }

    const rango =
        obtenerRangoFiltroFecha(
            filtroFechaRapidaActual
        );

    if (!rango) {
        return true;
    }

    return fechas.some(
        (
            fecha
        ) =>
            fecha >=
                rango.inicio &&
            fecha <=
                rango.fin
    );
}


function actualizarEstadoFiltrosFecha() {
    
botonesFiltroFecha.forEach(
        (
            boton
        ) => {
            const activo =
                boton.dataset.filtroFecha ===
                filtroFechaRapidaActual;

            boton.classList.toggle(
                "filtro-fecha-rapida--activa",
                activo
            );

            boton.setAttribute(
                "aria-pressed",
                String(
                    activo
                )
            );
        }
    );

    const hayFechaPersonalizada =
        Boolean(
            filtroFechaPersonalizada?.value ||
            fechaBuscadaDesdePortada
        );

    contenedorFechaPersonalizada?.classList.toggle(
        "filtro-fecha-personalizada--activa",
        hayFechaPersonalizada
    );
}


function limpiarFechaDeUrl() {
    fechaBuscadaDesdePortada =
        "";

    window.history.replaceState(
        {},
        "",
        window.location.pathname
    );
}


function seleccionarFiltroFechaRapida(
    tipo
) {
    const tipoSeguro =
        String(
            tipo ||
            ""
        );

    filtroFechaRapidaActual =
        filtroFechaRapidaActual ===
            tipoSeguro
            ? ""
            : tipoSeguro;

    if (
        filtroFechaPersonalizada
    ) {
        filtroFechaPersonalizada.value =
            "";
    }

    limpiarFechaDeUrl();

    actualizarEstadoFiltrosFecha();
    aplicarFiltros();
}


function prepararFiltrosFecha() {
    if (
        filtroFechaPersonalizada
    ) {
        filtroFechaPersonalizada.min =
            obtenerFechaLocalISO();
    }

    actualizarEstadoFiltrosFecha();
}


function planHaCaducado(
    fechaIso
) {
    if (!fechaIso) {
        return false;
    }

    const fechaSegura =
        String(
            fechaIso
        ).slice(
            0,
            10
        );

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            fechaSegura
        )
    ) {
        return false;
    }

    return (
        fechaSegura <
        obtenerFechaLocalISO()
    );
}


function obtenerPasesVigentesPlan(
    plan
) {
    const hoy =
        obtenerFechaLocalISO();

    const pases =
        [];

    const claves =
        new Set();

    function anadirPase(
        fechaValor,
        horaValor
    ) {
        const fecha =
            String(
                fechaValor ||
                ""
            )
                .trim()
                .slice(
                    0,
                    10
                );

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(
                fecha
            )
        ) {
            return;
        }

        /*
            Un plan de hoy sigue disponible durante todo el día.
        */
        if (
            fecha <
            hoy
        ) {
            return;
        }

        const hora =
            String(
                horaValor ||
                ""
            )
                .trim()
                .slice(
                    0,
                    5
                );

        const clave =
            `${fecha}|${hora}`;

        if (
            claves.has(
                clave
            )
        ) {
            return;
        }

        claves.add(
            clave
        );

        pases.push({
            fecha,
            hora
        });
    }


    /*
        Fecha principal.
    */
    anadirPase(
        plan?.fecha,
        plan?.hora
    );


    /*
        Fechas adicionales guardadas en planes.fechas.
    */
    if (
        Array.isArray(
            plan?.fechas
        )
    ) {
        plan.fechas.forEach(
            (
                pase
            ) => {
                anadirPase(
                    pase?.fecha,
                    pase?.hora
                );
            }
        );
    }


    return pases.sort(
        (
            paseA,
            paseB
        ) => {
            const fechaComparada =
                paseA.fecha.localeCompare(
                    paseB.fecha
                );

            if (
                fechaComparada !==
                0
            ) {
                return fechaComparada;
            }

            return String(
                paseA.hora ||
                ""
            ).localeCompare(
                String(
                    paseB.hora ||
                    ""
                )
            );
        }
    );
}


function prepararPlanPublicadoVigente(
    plan
) {
    const pasesVigentes =
        obtenerPasesVigentesPlan(
            plan
        );

    if (
        pasesVigentes.length ===
        0
    ) {
        return null;
    }

    const proximoPase =
        pasesVigentes[0];

    /*
        La tarjeta muestra siempre la próxima fecha disponible,
        aunque la fecha principal original del plan ya haya pasado.
        Conservamos además TODOS los pases vigentes para los nuevos
        filtros Hoy / Mañana / Finde / Semana / Fecha concreta.
    */
    return {
        ...plan,

        fecha:
            proximoPase.fecha,

        hora:
            proximoPase.hora ||
            plan.hora ||
            null,

        pases_vigentes:
            pasesVigentes
    };
}


function gradosARadianes(grados) {
    return Number(grados) * Math.PI / 180;
}

function calcularDistanciaKm(latitudA, longitudA, latitudB, longitudB) {
    const latA = Number(latitudA);
    const lonA = Number(longitudA);
    const latB = Number(latitudB);
    const lonB = Number(longitudB);

    if (![latA, lonA, latB, lonB].every(Number.isFinite)) {
        return null;
    }

    const radioTierraKm = 6371;
    const dLat = gradosARadianes(latB - latA);
    const dLon = gradosARadianes(lonB - lonA);
    const latARad = gradosARadianes(latA);
    const latBRad = gradosARadianes(latB);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(latARad) * Math.cos(latBRad) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radioTierraKm * c;
}

function actualizarEstadoUbicacionFiltro(mensaje = "", tipo = "") {
    if (!estadoUbicacionFiltro) return;

    estadoUbicacionFiltro.textContent = mensaje;
    estadoUbicacionFiltro.classList.remove(
        "filtro-distancia__estado--ok",
        "filtro-distancia__estado--error"
    );

    if (tipo === "ok") {
        estadoUbicacionFiltro.classList.add("filtro-distancia__estado--ok");
    }

    if (tipo === "error") {
        estadoUbicacionFiltro.classList.add("filtro-distancia__estado--error");
    }
}

function solicitarUbicacionParaFiltro() {
    return new Promise((resolver) => {
        if (ubicacionUsuarioFiltro) {
            resolver(true);
            return;
        }

        if (!navigator.geolocation) {
            actualizarEstadoUbicacionFiltro(
                "Tu navegador no permite usar la ubicación.",
                "error"
            );
            resolver(false);
            return;
        }

        actualizarEstadoUbicacionFiltro("Obteniendo tu ubicación…");

        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const latitud = Number(posicion.coords.latitude);
                const longitud = Number(posicion.coords.longitude);

                if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) {
                    actualizarEstadoUbicacionFiltro(
                        "No se ha podido determinar tu ubicación.",
                        "error"
                    );
                    resolver(false);
                    return;
                }

                ubicacionUsuarioFiltro = { latitud, longitud };
                actualizarEstadoUbicacionFiltro("Ubicación activada", "ok");
                resolver(true);
            },
            (error) => {
                console.warn(
                    "No se pudo obtener la ubicación del usuario:",
                    error
                );

                const mensaje = error?.code === 1
                    ? "Permite tu ubicación para usar la distancia."
                    : "No se ha podido obtener tu ubicación.";

                actualizarEstadoUbicacionFiltro(mensaje, "error");
                resolver(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    });
}

function obtenerDistanciaTarjetaKm(tarjeta) {
    if (
        !tarjeta ||
        !ubicacionUsuarioFiltro
    ) {
        return null;
    }

    const datosPlan =
        obtenerDatosPlan(
            tarjeta
        );

    if (
        !Number.isFinite(datosPlan.latitud) ||
        !Number.isFinite(datosPlan.longitud) ||
        (
            datosPlan.latitud === 0 &&
            datosPlan.longitud === 0
        )
    ) {
        return null;
    }

    const distanciaKm =
        calcularDistanciaKm(
            ubicacionUsuarioFiltro.latitud,
            ubicacionUsuarioFiltro.longitud,
            datosPlan.latitud,
            datosPlan.longitud
        );

    if (
        distanciaKm === null
    ) {
        return null;
    }

    tarjeta.dataset.distanciaKm =
        distanciaKm.toFixed(
            2
        );

    return distanciaKm;
}


function formatearDistanciaTarjeta(distanciaKm) {
    const distancia = Number(distanciaKm);

    if (!Number.isFinite(distancia)) {
        return "";
    }

    if (distancia < 1) {
        const metros =
            Math.max(
                50,
                Math.round(
                    distancia * 1000 / 50
                ) * 50
            );

        return `A ${metros} m de ti`;
    }

    const decimales =
        distancia < 10
            ? 1
            : 0;

    return `A ${distancia
        .toFixed(decimales)
        .replace(".", ",")} km de ti`;
}


function actualizarDistanciasTarjetas() {
    const distanciaActiva =
        Boolean(
            filtroDistancia &&
            filtroDistancia.value !== "todas" &&
            Number(filtroDistancia.value) > 0
        );

    const mostrarDistancias =
        Boolean(
            ubicacionUsuarioFiltro
        ) &&
        (
            filtroOrden?.value === "cercania" ||
            distanciaActiva
        );

    planes.forEach((tarjeta) => {
        const elemento =
            tarjeta.querySelector(
                ".tarjeta-plan__distancia"
            );

        const texto =
            elemento?.querySelector(
                ".tarjeta-plan__distancia-texto"
            );

        if (!elemento || !texto) {
            return;
        }

        if (!mostrarDistancias) {
            elemento.hidden = true;
            texto.textContent = "";
            tarjeta.removeAttribute(
                "data-distancia-km"
            );
            return;
        }

        const distanciaKm =
            obtenerDistanciaTarjetaKm(
                tarjeta
            );

        if (distanciaKm === null) {
            elemento.hidden = true;
            texto.textContent = "";
            return;
        }

        texto.textContent =
            formatearDistanciaTarjeta(
                distanciaKm
            );

        elemento.hidden = false;
    });
}


function cumpleFiltroDistancia(tarjeta) {
    const radioSeleccionado =
        Number(
            filtroDistancia?.value ||
            0
        );

    if (!radioSeleccionado) {
        return true;
    }

    if (!ubicacionUsuarioFiltro) {
        return true;
    }

    const distanciaKm =
        obtenerDistanciaTarjetaKm(
            tarjeta
        );

    if (distanciaKm === null) {
        return false;
    }

    return distanciaKm <= radioSeleccionado;
}


function planEsRecienPublicado(
    fechaCreacion,
    dias = 14
) {
    const fecha = new Date(
        String(
            fechaCreacion ||
            ""
        )
    );

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return false;
    }

    const ahora =
        new Date();

    const diferenciaMs =
        ahora.getTime() -
        fecha.getTime();

    if (diferenciaMs < 0) {
        return true;
    }

    const limiteMs =
        Number(dias || 14) *
        24 *
        60 *
        60 *
        1000;

    return diferenciaMs <=
        limiteMs;
}


function cumpleFiltroPrecio(
    precio,
    filtro
) {
    const valor = Number(precio || 0);

    if (filtro === "gratis") {
        return valor === 0;
    }

    if (filtro === "hasta-20") {
        return valor <= 20;
    }

    if (filtro === "hasta-50") {
        return valor <= 50;
    }

    if (filtro === "mas-50") {
        return valor > 50;
    }

    /* Compatibilidad con búsquedas guardadas antiguas. */
    if (filtro === "menos-20") {
        return valor > 0 && valor < 20;
    }

    if (filtro === "mas-20") {
        return valor >= 20;
    }

    return true;
}



function textoOpcionSeleccionada(select) {
    if (!select) {
        return "";
    }

    return select.options[
        select.selectedIndex
    ]?.textContent?.trim() || "";
}


function obtenerEtiquetaFechaActiva() {
    if (
        filtroFechaPersonalizada?.value
    ) {
        const fecha = new Date(
            `${filtroFechaPersonalizada.value}T12:00:00`
        );

        if (!Number.isNaN(fecha.getTime())) {
            return new Intl.DateTimeFormat(
                "es-ES",
                {
                    day: "numeric",
                    month: "short"
                }
            ).format(fecha);
        }
    }

    const etiquetas = {
        hoy: "Hoy",
        manana: "Mañana",
        finde: "Este finde",
        semana: "Esta semana",
        "proxima-semana": "Próxima semana"
    };

    return etiquetas[
        filtroFechaRapidaActual
    ] || "";
}


function obtenerFiltrosActivosActuales() {
    const activos = [];

    const texto = filtroTexto?.value.trim();

    if (texto) {
        activos.push({
            id: "texto",
            texto: `“${texto}”`
        });
    }

    if (
        filtroMunicipio?.value &&
        filtroMunicipio.value !== "todos"
    ) {
        activos.push({
            id: "municipio",
            texto: textoOpcionSeleccionada(
                filtroMunicipio
            )
        });
    }

    if (
        filtroCategoria?.value &&
        filtroCategoria.value !== "todas"
    ) {
        activos.push({
            id: "categoria",
            texto: textoOpcionSeleccionada(
                filtroCategoria
            )
        });
    }

    if (
        filtroPrecio?.value &&
        filtroPrecio.value !== "todos"
    ) {
        activos.push({
            id: "precio",
            texto: textoOpcionSeleccionada(
                filtroPrecio
            )
        });
    }

    const fecha = obtenerEtiquetaFechaActiva();

    if (fecha) {
        activos.push({
            id: "fecha",
            texto: fecha
        });
    }

    if (filtroVoySolo?.checked) {
        activos.push({
            id: "voy-solo",
            texto: "Voy solo"
        });
    }

    if (filtroPrimeraVez?.checked) {
        activos.push({
            id: "primera-vez",
            texto: "Ideal para empezar"
        });
    }

    if (filtroAmbiente?.checked) {
        activos.push({
            id: "ambiente",
            texto: "Con ambiente"
        });
    }

    if (filtroNuevos?.checked) {
        activos.push({
            id: "nuevos",
            texto: "Recién publicados"
        });
    }

    const etiquetasAnimo = {
        social: "Conocer gente",
        tranquilo: "Algo tranquilo",
        diferente: "Algo diferente",
        activo: "Moverme",
        cultural: "Descubrir"
    };

    if (
        filtroAnimo?.value &&
        filtroAnimo.value !== "cualquiera"
    ) {
        activos.push({
            id: "animo",
            texto: etiquetasAnimo[filtroAnimo.value] || filtroAnimo.value
        });
    }

    if (
        filtroDistancia?.value &&
        filtroDistancia.value !== "todas"
    ) {
        activos.push({
            id: "distancia",
            texto: `Hasta ${filtroDistancia.value} km`
        });
    }

    return activos;
}


function actualizarChipsFiltrosActivos() {
    if (
        !filtrosActivos ||
        !listaFiltrosActivos
    ) {
        return;
    }

    const activos =
        obtenerFiltrosActivosActuales();

    filtrosActivos.hidden =
        activos.length === 0;

    listaFiltrosActivos.innerHTML =
        activos
            .map(
                (filtro) => `
                    <button
                        type="button"
                        class="filtro-activo-chip"
                        data-quitar-filtro="${escaparHTMLPlanes(
                            filtro.id
                        )}"
                        title="Quitar filtro"
                    >
                        <span>${escaparHTMLPlanes(
                            filtro.texto
                        )}</span>
                        <i
                            class="fa-solid fa-xmark"
                            aria-hidden="true"
                        ></i>
                    </button>
                `
            )
            .join("");
}


function quitarFiltroActivo(id) {
    switch (id) {
        case "texto":
            filtroTexto.value = "";
            break;

        case "municipio":
            filtroMunicipio.value = "todos";
            break;

        case "categoria":
            filtroCategoria.value = "todas";
            break;

        case "precio":
            filtroPrecio.value = "todos";
            actualizarEstadoFiltroGratisRapido();
            break;

        case "fecha":
            filtroFechaRapidaActual = "";
            fechaBuscadaDesdePortada = "";

            if (filtroFechaPersonalizada) {
                filtroFechaPersonalizada.value = "";
            }

            actualizarEstadoFiltrosFecha();
            break;

        case "voy-solo":
            if (filtroVoySolo) {
                filtroVoySolo.checked = false;
            }
            break;

        case "primera-vez":
            if (filtroPrimeraVez) {
                filtroPrimeraVez.checked = false;
            }
            break;

        case "ambiente":
            if (filtroAmbiente) {
                filtroAmbiente.checked = false;
            }
            break;

        case "nuevos":
            if (filtroNuevos) {
                filtroNuevos.checked = false;
            }
            break;

        case "animo":
            if (filtroAnimo) {
                filtroAnimo.value = "cualquiera";
            }

            opcionesAnimoUnificado.forEach((opcion) => {
                opcion.checked = opcion.value === "cualquiera";
            });
            break;

        case "distancia":
            if (filtroDistancia) {
                filtroDistancia.value = "todas";
            }

            opcionesDistanciaUnificada.forEach((opcion) => {
                opcion.checked = opcion.value === "todas";
            });

            actualizarEstadoUbicacionFiltro(
                ubicacionUsuarioFiltro
                    ? "Ubicación activada"
                    : "",
                ubicacionUsuarioFiltro
                    ? "ok"
                    : ""
            );
            break;
    }

    actualizarDistanciasTarjetas();
    aplicarFiltros();
}


function actualizarSelectorVistaResultados() {
    const esMapa =
        vistaResultadosActual === "mapa";

    botonVistaLista?.classList.toggle(
        "activo",
        !esMapa
    );

    botonVistaMapa?.classList.toggle(
        "activo",
        esMapa
    );

    botonVistaLista?.setAttribute(
        "aria-pressed",
        String(!esMapa)
    );

    botonVistaMapa?.setAttribute(
        "aria-pressed",
        String(esMapa)
    );

    if (listaPlanes) {
        listaPlanes.hidden = esMapa;
    }

    if (mapaPlanesExplorar) {
        mapaPlanesExplorar.hidden = !esMapa;
    }

    if (esMapa) {
        renderizarMapaPlanes(
            planesVisiblesActuales
        );
    }
}


function obtenerMapaExplorar() {
    if (
        !mapaPlanesExplorar ||
        !window.L
    ) {
        return null;
    }

    if (!mapaExplorar) {
        mapaExplorar = window.L.map(
            mapaPlanesExplorar,
            {
                scrollWheelZoom: false
            }
        ).setView(
            [37.3891, -5.9845],
            11
        );

        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    "&copy; OpenStreetMap"
            }
        ).addTo(mapaExplorar);

        capaMarcadoresMapa =
            window.L.layerGroup()
                .addTo(mapaExplorar);
    }

    return mapaExplorar;
}


function renderizarMapaPlanes(planesMostrar = []) {
    const mapa = obtenerMapaExplorar();

    if (!mapa || !capaMarcadoresMapa) {
        return;
    }

    capaMarcadoresMapa.clearLayers();

    const coordenadas = [];

    planesMostrar.forEach((tarjeta) => {
        const datos = obtenerDatosPlan(tarjeta);

        if (
            !Number.isFinite(datos.latitud) ||
            !Number.isFinite(datos.longitud) ||
            (
                datos.latitud === 0 &&
                datos.longitud === 0
            )
        ) {
            return;
        }

        const distancia =
            ubicacionUsuarioFiltro
                ? obtenerDistanciaTarjetaKm(
                    tarjeta
                )
                : null;

        const distanciaTexto =
            distancia === null
                ? ""
                : `<span class="mapa-plan-popup__distancia">${escaparHTMLPlanes(
                    formatearDistanciaTarjeta(
                        distancia
                    )
                )}</span>`;

        const iconoSuralia =
            window.L.divIcon({
                className:
                    "mapa-plan-marcador-wrapper",
                html: `
                    <div class="mapa-plan-marcador">
                        <i
                            class="fa-solid fa-location-dot"
                            aria-hidden="true"
                        ></i>
                    </div>
                `,
                iconSize: [42, 48],
                iconAnchor: [21, 45],
                popupAnchor: [0, -42]
            });

        const marcador = window.L.marker(
            [
                datos.latitud,
                datos.longitud
            ],
            {
                icon: iconoSuralia,
                riseOnHover: true,
                riseOffset: 500
            }
        );

        marcador.bindPopup(
            `
                <article class="mapa-plan-popup">
                    <span class="mapa-plan-popup__eyebrow">
                        <i
                            class="fa-solid fa-compass"
                            aria-hidden="true"
                        ></i>
                        Plan en Suralia
                    </span>

                    <strong class="mapa-plan-popup__titulo">
                        ${escaparHTMLPlanes(
                            datos.titulo
                        )}
                    </strong>

                    <span class="mapa-plan-popup__ubicacion">
                        <i
                            class="fa-solid fa-location-dot"
                            aria-hidden="true"
                        ></i>
                        ${escaparHTMLPlanes(
                            datos.ubicacion
                        )}
                    </span>

                    ${distanciaTexto}

                    <div class="mapa-plan-popup__acciones">
                        <a
                            class="mapa-plan-popup__enlace"
                            href="${escaparHTMLPlanes(
                                datos.enlace
                            )}"
                        >
                            <span>Ver plan</span>
                            <i
                                class="fa-solid fa-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </a>

                        <a
                            class="mapa-plan-popup__como-llegar"
                            href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                datos.latitud
                            )}%2C${encodeURIComponent(
                                datos.longitud
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Cómo llegar</span>
                            <i
                                class="fa-solid fa-route"
                                aria-hidden="true"
                            ></i>
                        </a>
                    </div>
                </article>
            `,
            {
                maxWidth: 330,
                minWidth: 310,
                className:
                    "mapa-popup-suralia",
                closeButton: true
            }
        );

        marcador.addTo(capaMarcadoresMapa);

        coordenadas.push([
            datos.latitud,
            datos.longitud
        ]);
    });

    setTimeout(() => {
        mapa.invalidateSize();

        if (coordenadas.length === 1) {
            mapa.setView(
                coordenadas[0],
                14
            );
        } else if (coordenadas.length > 1) {
            mapa.fitBounds(
                coordenadas,
                {
                    padding: [35, 35],
                    maxZoom: 14
                }
            );
        } else {
            mapa.setView(
                [37.3891, -5.9845],
                10
            );
        }
    }, 50);
}


function cumpleFiltroFechaModoSuralia(
    tarjeta,
    filtro
) {
    if (!filtro || filtro === "cualquiera") {
        return true;
    }

    const rango = obtenerRangoFiltroFecha(
        filtro
    );

    if (!rango) {
        return true;
    }

    return obtenerFechasVigentesTarjeta(
        tarjeta
    ).some(
        (fecha) =>
            fecha >= rango.inicio &&
            fecha <= rango.fin
    );
}


function obtenerValorModoSuralia(
    nombre,
    valorPorDefecto
) {
    return (
        document.querySelector(
            `input[name="${nombre}"]:checked`
        )?.value ||
        valorPorDefecto
    );
}


function obtenerOpcionesModoSuralia() {
    return {
        animo:
            obtenerValorModoSuralia(
                "modo-suralia-animo",
                "social"
            ),

        fecha:
            obtenerValorModoSuralia(
                "modo-suralia-fecha",
                "cualquiera"
            ),

        presupuesto:
            obtenerValorModoSuralia(
                "modo-suralia-presupuesto",
                "cualquiera"
            ),

        compania:
            obtenerValorModoSuralia(
                "modo-suralia-compania",
                "cualquiera"
            ),

        distancia:
            obtenerValorModoSuralia(
                "modo-suralia-distancia",
                "todas"
            )
    };
}


function categoriaAfinAnimo(
    categoria,
    animo
) {
    const mapa = {
        tranquilo: [
            "naturaleza",
            "gastronomia",
            "cultura"
        ],

        social: [
            "musica",
            "gastronomia",
            "cultura"
        ],

        diferente: [
            "aventura",
            "musica",
            "cultura",
            "naturaleza"
        ],

        activo: [
            "aventura",
            "naturaleza"
        ],

        cultural: [
            "cultura",
            "gastronomia"
        ]
    };

    return (
        mapa[animo] || []
    ).includes(categoria);
}


function cumplePresupuestoModoSuralia(
    precio,
    presupuesto
) {
    if (
        !presupuesto ||
        presupuesto === "cualquiera"
    ) {
        return true;
    }

    if (presupuesto === "gratis") {
        return Number(precio) === 0;
    }

    const limite = Number(presupuesto);

    return (
        Number.isFinite(limite) &&
        Number(precio) <= limite
    );
}


function cumpleCompaniaModoSuralia(
    tarjeta,
    datos,
    compania
) {
    if (
        !compania ||
        compania === "cualquiera"
    ) {
        return true;
    }

    const personasSolas =
        Number(
            tarjeta.dataset.personasSolas || 0
        );

    const personasApuntadas =
        Number(
            tarjeta.dataset.personasApuntadas || 0
        );

    if (compania === "solo") {
        return personasSolas > 0;
    }

    if (compania === "primera") {
        return Boolean(
            datos.idealPrimeraVez
        );
    }

    if (compania === "acompanado") {
        return personasApuntadas > 1;
    }

    return true;
}


function obtenerMotivosModoSuralia(
    tarjeta,
    datos,
    opciones,
    distancia
) {
    const motivos = [];

    const personasSolas =
        Number(
            tarjeta.dataset.personasSolas || 0
        );

    const personasApuntadas =
        Number(
            tarjeta.dataset.personasApuntadas || 0
        );

    if (
        opciones.compania === "solo" &&
        personasSolas > 0
    ) {
        motivos.push(
            personasSolas === 1
                ? "1 persona va sola"
                : `${personasSolas} personas van solas`
        );
    }

    if (
        opciones.compania !== "solo" &&
        personasSolas > 0
    ) {
        motivos.push(
            "Ideal si no conoces a nadie"
        );
    }

    if (
        opciones.compania === "primera" &&
        datos.idealPrimeraVez
    ) {
        motivos.push(
            "Ideal para tu primera vez"
        );
    }

    if (
        opciones.animo &&
        categoriaAfinAnimo(
            datos.categoria,
            opciones.animo
        )
    ) {
        const textos = {
            social:
                "Buen ambiente para conocer gente",

            tranquilo:
                "Encaja con un plan tranquilo",

            diferente:
                "Una opción para salir de lo típico",

            activo:
                "Perfecto para moverte",

            cultural:
                "Buen plan para descubrir algo"
        };

        if (textos[opciones.animo]) {
            motivos.push(
                textos[opciones.animo]
            );
        }
    }

    if (
        opciones.presupuesto === "gratis" &&
        datos.precio === 0
    ) {
        motivos.push("Es gratis");
    } else if (
        opciones.presupuesto !== "cualquiera" &&
        cumplePresupuestoModoSuralia(
            datos.precio,
            opciones.presupuesto
        )
    ) {
        motivos.push(
            "Encaja con tu presupuesto"
        );
    }

    if (
        distancia !== null &&
        Number.isFinite(distancia)
    ) {
        motivos.push(
            formatearDistanciaTarjeta(
                distancia
            )
        );
    }

    if (
        personasApuntadas > 1 &&
        motivos.length < 4
    ) {
        motivos.push(
            `${personasApuntadas} personas apuntadas`
        );
    }

    return Array.from(
        new Set(motivos)
    ).slice(0, 4);
}


function cumpleCoincidenciaExactaModoSuralia(
    tarjeta,
    datos,
    opciones,
    distancia
) {
    if (
        opciones.animo &&
        !categoriaAfinAnimo(
            datos.categoria,
            opciones.animo
        )
    ) {
        return false;
    }

    if (
        opciones.fecha !== "cualquiera" &&
        !cumpleFiltroFechaModoSuralia(
            tarjeta,
            opciones.fecha
        )
    ) {
        return false;
    }

    if (
        !cumplePresupuestoModoSuralia(
            datos.precio,
            opciones.presupuesto
        )
    ) {
        return false;
    }

    if (
        !cumpleCompaniaModoSuralia(
            tarjeta,
            datos,
            opciones.compania
        )
    ) {
        return false;
    }

    const radio =
        Number(
            opciones.distancia || 0
        );

    if (
        radio > 0 &&
        (
            distancia === null ||
            distancia > radio
        )
    ) {
        return false;
    }

    return true;
}


function puntuarPlanModoSuralia(
    tarjeta,
    datos,
    opciones,
    distancia
) {
    let puntuacion = 10;

    if (
        categoriaAfinAnimo(
            datos.categoria,
            opciones.animo
        )
    ) {
        puntuacion += 9;
    }

    if (
        opciones.fecha !== "cualquiera"
    ) {
        puntuacion +=
            cumpleFiltroFechaModoSuralia(
                tarjeta,
                opciones.fecha
            )
                ? 7
                : -5;
    }

    if (
        opciones.presupuesto !== "cualquiera"
    ) {
        puntuacion +=
            cumplePresupuestoModoSuralia(
                datos.precio,
                opciones.presupuesto
            )
                ? 6
                : -4;
    }

    if (
        opciones.compania !== "cualquiera"
    ) {
        puntuacion +=
            cumpleCompaniaModoSuralia(
                tarjeta,
                datos,
                opciones.compania
            )
                ? 8
                : -4;
    }

    const radio =
        Number(
            opciones.distancia || 0
        );

    if (
        radio > 0 &&
        distancia !== null
    ) {
        if (distancia <= radio) {
            puntuacion += Math.max(
                2,
                7 - distancia / radio * 5
            );
        } else {
            puntuacion -= Math.min(
                7,
                (
                    distancia - radio
                ) / Math.max(
                    radio,
                    1
                ) * 5
            );
        }
    }

    const valoracion =
        Number(
            datos.valoracion || 0
        );

    if (valoracion > 0) {
        puntuacion += Math.min(
            3,
            valoracion / 2
        );
    }

    return puntuacion;
}


function mezclarArrayModoSuralia(
    elementos
) {
    const copia = [...elementos];

    for (
        let i = copia.length - 1;
        i > 0;
        i -= 1
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            copia[i],
            copia[j]
        ] = [
            copia[j],
            copia[i]
        ];
    }

    return copia;
}


function crearEstadoModoSuralia(
    cantidad,
    relajado,
    sorpresaTotal
) {
    if (sorpresaTotal) {
        return `
            <div class="modo-suralia__resultado-cabecera">
                <div>
                    <span class="modo-suralia__resultado-eyebrow">
                        Selección sorpresa
                    </span>

                    <h3>
                        ${cantidad} ${
                            cantidad === 1
                                ? "plan para romper la rutina"
                                : "planes para romper la rutina"
                        }
                    </h3>
                </div>

                <span class="modo-suralia__resultado-estado">
                    <i
                        class="fa-solid fa-shuffle"
                        aria-hidden="true"
                    ></i>
                    Elegidos al azar
                </span>
            </div>
        `;
    }

    return `
        <div class="modo-suralia__resultado-cabecera">
            <div>
                <span class="modo-suralia__resultado-eyebrow">
                    Tus recomendaciones
                </span>

                <h3>
                    ${cantidad} ${
                        cantidad === 1
                            ? "plan que encaja contigo"
                            : "planes que encajan contigo"
                    }
                </h3>
            </div>

            <span class="modo-suralia__resultado-estado ${
                relajado
                    ? "modo-suralia__resultado-estado--relajado"
                    : ""
            }">
                <i
                    class="fa-solid ${
                        relajado
                            ? "fa-wand-magic-sparkles"
                            : "fa-circle-check"
                    }"
                    aria-hidden="true"
                ></i>

                ${
                    relajado
                        ? "Hemos ampliado un poco la búsqueda"
                        : "Coincidencia alta"
                }
            </span>
        </div>
    `;
}


function renderizarRecomendacionesModoSuralia(
    candidatos,
    relajado,
    sorpresaTotal
) {
    if (!resultadosModoSuralia) {
        return;
    }

    resultadosModoSuralia.innerHTML = `
        ${crearEstadoModoSuralia(
            candidatos.length,
            relajado,
            sorpresaTotal
        )}

        <div class="modo-suralia__recomendaciones">
            ${candidatos
                .map(
                    (
                        item,
                        indice
                    ) => {
                        const destacada =
                            indice === 0;

                        const motivos =
                            item.motivos.length
                                ? item.motivos
                                : [
                                    "Puede encajar contigo"
                                ];

                        const imagen =
                            item.datos.imagen
                                ? `
                                    <img
                                        src="${escaparHTMLPlanes(
                                            item.datos.imagen
                                        )}"
                                        alt=""
                                        loading="lazy"
                                    >
                                `
                                : `
                                    <span
                                        class="modo-suralia-recomendacion__sin-imagen"
                                        aria-hidden="true"
                                    >
                                        ✨
                                    </span>
                                `;

                        const personasSolas =
                            Number(
                                item.tarjeta.dataset.personasSolas || 0
                            );

                        return `
                            <article
                                class="modo-suralia-recomendacion ${
                                    destacada
                                        ? "modo-suralia-recomendacion--destacada"
                                        : ""
                                }"
                            >

                                <div class="modo-suralia-recomendacion__imagen">
                                    ${imagen}

                                    <span class="modo-suralia-recomendacion__categoria">
                                        ${escaparHTMLPlanes(
                                            item.datos.categoriaTexto
                                        )}
                                    </span>

                                    ${
                                        destacada
                                            ? `
                                                <span class="modo-suralia-recomendacion__eleccion">
                                                    <i
                                                        class="fa-solid fa-sparkles"
                                                        aria-hidden="true"
                                                    ></i>
                                                    La elección Suralia
                                                </span>
                                            `
                                            : ""
                                    }
                                </div>

                                <div class="modo-suralia-recomendacion__cuerpo">

                                    <div class="modo-suralia-recomendacion__encabezado">
                                        <div>
                                            <span class="modo-suralia-recomendacion__fecha">
                                                ${escaparHTMLPlanes(
                                                    item.datos.fechaTexto || "Próximamente"
                                                )}
                                            </span>

                                            <h3>
                                                ${escaparHTMLPlanes(
                                                    item.datos.titulo
                                                )}
                                            </h3>
                                        </div>

                                        <span class="modo-suralia-recomendacion__precio">
                                            ${
                                                item.datos.precio === 0
                                                    ? "Gratis"
                                                    : `${item.datos.precio
                                                        .toFixed(2)
                                                        .replace(".", ",")} €`
                                            }
                                        </span>
                                    </div>

                                    <div class="modo-suralia-recomendacion__motivos">
                                        ${motivos
                                            .map(
                                                (motivo) => `
                                                    <span>
                                                        <i
                                                            class="fa-solid fa-check"
                                                            aria-hidden="true"
                                                        ></i>
                                                        ${escaparHTMLPlanes(
                                                            motivo
                                                        )}
                                                    </span>
                                                `
                                            )
                                            .join("")}
                                    </div>

                                    <div class="modo-suralia-recomendacion__pie">
                                        <div class="modo-suralia-recomendacion__social">
                                            ${
                                                personasSolas > 0
                                                    ? `
                                                        <span>
                                                            🙋
                                                            ${
                                                                personasSolas === 1
                                                                    ? "1 va sola"
                                                                    : `${personasSolas} van solas`
                                                            }
                                                        </span>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                item.datos.ubicacion
                                                    ? `
                                                        <span>
                                                            <i
                                                                class="fa-solid fa-location-dot"
                                                                aria-hidden="true"
                                                            ></i>
                                                            ${escaparHTMLPlanes(
                                                                item.datos.ubicacion
                                                            )}
                                                        </span>
                                                    `
                                                    : ""
                                            }
                                        </div>

                                        <a
                                            href="${escaparHTMLPlanes(
                                                item.datos.enlace
                                            )}"
                                            class="modo-suralia-recomendacion__ver"
                                        >
                                            Ver plan
                                            <i
                                                class="fa-solid fa-arrow-right"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                    </div>

                                </div>

                            </article>
                        `;
                    }
                )
                .join("")}
        </div>
    `;
}


async function recomendarModoSuralia(
    {
        sorpresaTotal = false,
        desplazarResultados = true
    } = {}
) {
    if (!resultadosModoSuralia) {
        return;
    }

    modoSuraliaEnUso = true;

    const secuenciaActual =
        ++secuenciaRecomendacionModoSuralia;

    const opciones =
        obtenerOpcionesModoSuralia();

    if (!sorpresaTotal) {
        const radio =
            Number(
                opciones.distancia || 0
            );

        if (radio > 0) {
            resultadosModoSuralia.innerHTML = `
                <div class="modo-suralia__cargando">
                    <span class="modo-suralia__cargando-icono">
                        <i
                            class="fa-solid fa-location-crosshairs"
                            aria-hidden="true"
                        ></i>
                    </span>

                    <div>
                        <strong>
                            Calculando qué tienes cerca...
                        </strong>

                        <span>
                            Usamos tu ubicación solo para esta recomendación.
                        </span>
                    </div>
                </div>
            `;

            const disponible =
                await solicitarUbicacionParaFiltro();

            /*
                Si el usuario cambia otra opción mientras el navegador
                resuelve la ubicación, ignoramos esta recomendación vieja.
            */
            if (
                secuenciaActual !==
                secuenciaRecomendacionModoSuralia
            ) {
                return;
            }

            if (!disponible) {
                resultadosModoSuralia.innerHTML = `
                    <div class="modo-suralia__vacio">
                        <span aria-hidden="true">
                            📍
                        </span>

                        <div>
                            <strong>
                                No hemos podido usar tu ubicación
                            </strong>

                            <p>
                                Selecciona “Sin límite” o permite la ubicación para recomendarte por distancia.
                            </p>
                        </div>
                    </div>
                `;
                return;
            }
        }
    }

    const candidatosBase =
        planes
            .filter(
                (tarjeta) => {
                    const datos =
                        obtenerDatosPlan(
                            tarjeta
                        );

                    return !planHaCaducado(
                        datos.fechaIso
                    );
                }
            )
            .map(
                (
                    tarjeta,
                    indice
                ) => {
                    const datos =
                        obtenerDatosPlan(
                            tarjeta
                        );

                    const distancia =
                        ubicacionUsuarioFiltro
                            ? obtenerDistanciaTarjetaKm(
                                tarjeta
                            )
                            : null;

                    const exacto =
                        sorpresaTotal
                            ? true
                            : cumpleCoincidenciaExactaModoSuralia(
                                tarjeta,
                                datos,
                                opciones,
                                distancia
                            );

                    const puntuacion =
                        sorpresaTotal
                            ? 0
                            : puntuarPlanModoSuralia(
                                tarjeta,
                                datos,
                                opciones,
                                distancia
                            );

                    return {
                        tarjeta,
                        datos,
                        distancia,
                        exacto,
                        puntuacion,
                        indice,
                        motivos:
                            sorpresaTotal
                                ? obtenerMotivosModoSuralia(
                                    tarjeta,
                                    datos,
                                    opciones,
                                    distancia
                                )
                                : obtenerMotivosModoSuralia(
                                    tarjeta,
                                    datos,
                                    opciones,
                                    distancia
                                )
                    };
                }
            );

    if (!candidatosBase.length) {
        resultadosModoSuralia.innerHTML = `
            <div class="modo-suralia__vacio">
                <span aria-hidden="true">
                    🌱
                </span>

                <div>
                    <strong>
                        Todavía no hay planes disponibles
                    </strong>

                    <p>
                        En cuanto haya nuevos planes publicados aparecerán aquí.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    if (sorpresaTotal) {
        const seleccion =
            mezclarArrayModoSuralia(
                candidatosBase
            ).slice(0, 3);

        renderizarRecomendacionesModoSuralia(
            seleccion,
            false,
            true
        );

        if (desplazarResultados) {
            resultadosModoSuralia.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }

        return;
    }

    const exactos =
        candidatosBase
            .filter(
                (item) =>
                    item.exacto
            )
            .sort(
                (a, b) =>
                    b.puntuacion -
                        a.puntuacion ||
                    a.indice -
                        b.indice
            );

    const relajado =
        exactos.length < 3;

    const seleccion =
        (
            relajado
                ? [...candidatosBase]
                : exactos
        )
            .sort(
                (a, b) =>
                    b.puntuacion -
                        a.puntuacion ||
                    a.indice -
                        b.indice
            )
            .slice(0, 3);

    renderizarRecomendacionesModoSuralia(
        seleccion,
        relajado,
        false
    );

    if (desplazarResultados) {
        resultadosModoSuralia.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}


function ordenarPlanes(
    planesVisibles
) {
    const orden =
        filtroOrden?.value ||
        "recomendados";

    return planesVisibles.sort(
        (planA, planB) => {
            const datosPlanA =
                obtenerDatosPlan(
                    planA
                );

            const datosPlanB =
                obtenerDatosPlan(
                    planB
                );

            const precioA =
                datosPlanA.precio;

            const precioB =
                datosPlanB.precio;

            const valoracionA =
                datosPlanA.valoracion;

            const valoracionB =
                datosPlanB.valoracion;

            if (orden === "precio-menor") {
                return precioA - precioB;
            }

            if (orden === "precio-mayor") {
                return precioB - precioA;
            }

            if (orden === "valoracion") {
                return valoracionB - valoracionA;
            }

            if (
                orden ===
                "cercania"
            ) {
                const distanciaA =
                    obtenerDistanciaTarjetaKm(
                        planA
                    );

                const distanciaB =
                    obtenerDistanciaTarjetaKm(
                        planB
                    );

                /*
                    Los planes sin coordenadas se envían al final.
                */
                if (
                    distanciaA ===
                        null &&
                    distanciaB ===
                        null
                ) {
                    return 0;
                }

                if (
                    distanciaA ===
                    null
                ) {
                    return 1;
                }

                if (
                    distanciaB ===
                    null
                ) {
                    return -1;
                }

                return (
                    distanciaA -
                    distanciaB
                );
            }

            return 0;
        }
    );
}


function obtenerTextoResultados(
    cantidad
) {
    return cantidad === 1
        ? "Mostrando 1 resultado"
        : `Mostrando ${cantidad} resultados`;
}


function actualizarResumenResultados(
    cantidad
) {
    if (numeroResultados) {
        numeroResultados.textContent =
            cantidad;
    }

    if (resumenResultados) {
        resumenResultados.setAttribute(
            "aria-label",
            obtenerTextoResultados(
                cantidad
            )
        );
    }
}


function actualizarEstadoSinResultados(
    cantidad
) {
    if (!sinResultados) {
        return;
    }

    const sinCoincidencias =
        cantidad === 0;

    sinResultados.classList.toggle(
        "visible",
        sinCoincidencias
    );

    sinResultados.setAttribute(
        "aria-hidden",
        String(!sinCoincidencias)
    );

    if (listaPlanes) {
        listaPlanes.setAttribute(
            "aria-hidden",
            String(sinCoincidencias)
        );
    }
}


function actualizarBotonVista() {
    if (!botonVista) {
        return;
    }

    botonVista.setAttribute(
        "aria-pressed",
        String(vistaCompactaActiva)
    );

    botonVista.setAttribute(
        "aria-label",
        vistaCompactaActiva
            ? "Mostrar resultados en tarjetas grandes"
            : "Mostrar resultados en vista compacta"
    );

    botonVista.setAttribute(
        "title",
        vistaCompactaActiva
            ? "Vista de tarjetas grandes"
            : "Vista compacta"
    );
}


function alternarVistaResultados() {
    if (!listaPlanes) {
        return;
    }

    vistaCompactaActiva =
        !vistaCompactaActiva;

    listaPlanes.classList.toggle(
        "vista-compacta",
        vistaCompactaActiva
    );

    actualizarBotonVista();
}


function aplicarFiltros() {
    if (
        !filtroTexto ||
        !filtroMunicipio ||
        !filtroCategoria ||
        !filtroPrecio ||
        !listaPlanes
    ) {
        return;
    }

    const textoBuscado = normalizarTexto(
        filtroTexto.value.trim()
    );

    const municipioSeleccionado =
        filtroMunicipio.value;

    const categoriaSeleccionada =
        filtroCategoria.value;

    const precioSeleccionado =
        filtroPrecio.value;

    const soloPlanesConGenteSola =
        Boolean(
            filtroVoySolo?.checked
        );

    const soloPlanesPrimeraVez =
        Boolean(
            filtroPrimeraVez?.checked
        );

    const soloPlanesConAmbiente =
        Boolean(
            filtroAmbiente?.checked
        );

    const soloPlanesNuevos =
        Boolean(
            filtroNuevos?.checked
        );

    const animoSeleccionado =
        filtroAnimo?.value ||
        "cualquiera";

    let planesVisibles = planes.filter(
        (plan) => {
            const datosPlan =
                obtenerDatosPlan(
                    plan
                );

            const nombre =
                normalizarTexto(
                    datosPlan.titulo
                );

            const titulo =
                normalizarTexto(
                    datosPlan.titulo
                );

            const ubicacion =
                normalizarTexto(
                    datosPlan.ubicacion
                );

            const categoriaTexto =
                normalizarTexto(
                    datosPlan.categoriaTexto
                );

            const municipio =
                normalizarValorMunicipio(
                    datosPlan.municipio
                );

            const categoria =
                datosPlan.categoria;

            const precio =
                datosPlan.precio;

            const fechaIso =
                datosPlan.fechaIso;

            const personasSolas =
                Math.max(
                    0,
                    Number(
                        plan.dataset.personasSolas ||
                        0
                    )
                );

            const personasApuntadas =
                Math.max(
                    0,
                    Number(
                        plan.dataset.personasApuntadas ||
                        0
                    )
                );

            const creadoEn =
                plan.dataset.creadoEn ||
                "";

            const coincideTexto =
                !textoBuscado ||
                nombre.includes(textoBuscado) ||
                titulo.includes(textoBuscado) ||
                ubicacion.includes(textoBuscado) ||
                categoriaTexto.includes(
                    textoBuscado
                );

            const coincideMunicipio =
                municipioSeleccionado ===
                    "todos" ||
                municipio ===
                    municipioSeleccionado;

            const coincideCategoria =
                categoriaSeleccionada ===
                    "todas" ||
                categoria ===
                    categoriaSeleccionada;

            const coincidePrecio =
                cumpleFiltroPrecio(
                    precio,
                    precioSeleccionado
                );

            const coincideFecha =
                cumpleFiltroFechaPlan(
                    plan
                );

            const sigueDisponible =
                !planHaCaducado(
                    fechaIso
                );

            const coincideVoySolo =
                !soloPlanesConGenteSola ||
                personasSolas >
                    0;

            const coincidePrimeraVez =
                !soloPlanesPrimeraVez ||
                datosPlan.idealPrimeraVez;

            const coincideAmbiente =
                !soloPlanesConAmbiente ||
                personasApuntadas >= 3;

            const coincideNuevos =
                !soloPlanesNuevos ||
                planEsRecienPublicado(
                    creadoEn,
                    14
                );

            const coincideAnimo =
                animoSeleccionado === "cualquiera" ||
                categoriaAfinAnimo(
                    categoria,
                    animoSeleccionado
                );

            const coincideDistancia =
                cumpleFiltroDistancia(
                    plan
                );

            return (
                coincideTexto &&
                coincideMunicipio &&
                coincideCategoria &&
                coincidePrecio &&
                coincideFecha &&
                coincideVoySolo &&
                coincidePrimeraVez &&
                coincideAmbiente &&
                coincideNuevos &&
                coincideAnimo &&
                coincideDistancia &&
                sigueDisponible
            );
        }
    );

    planes.forEach((plan) => {
        plan.style.display = "none";
    });

    planesVisibles =
        ordenarPlanes(planesVisibles);

    planesVisibles.forEach((plan) => {
        plan.style.display = "block";
        listaPlanes.appendChild(plan);
    });

    actualizarResumenResultados(
        planesVisibles.length
    );

    planesVisiblesActuales =
        [...planesVisibles];

    actualizarResumenResultados(
        planesVisibles.length
    );

    actualizarEstadoSinResultados(
        planesVisibles.length
    );

    actualizarChipsFiltrosActivos();

    if (
        vistaResultadosActual ===
            "mapa"
    ) {
        renderizarMapaPlanes(
            planesVisiblesActuales
        );
    }
}


function limpiarFiltros(
    devolverFoco = false
) {
    if (filtroTexto) {
        filtroTexto.value = "";
    }

    if (filtroMunicipio) {
        filtroMunicipio.value =
            "todos";
    }

    if (filtroCategoria) {
        filtroCategoria.value = "todas";
    }

    if (filtroPrecio) {
        filtroPrecio.value = "todos";
    }

    if (filtroOrden) {
        filtroOrden.value =
            "recomendados";
    }

    actualizarDistanciasTarjetas();

    if (filtroVoySolo) {
        filtroVoySolo.checked =
            false;
    }

    if (filtroPrimeraVez) {
        filtroPrimeraVez.checked =
            false;
    }

    if (filtroAmbiente) {
        filtroAmbiente.checked =
            false;
    }

    if (filtroNuevos) {
        filtroNuevos.checked =
            false;
    }

    if (filtroAnimo) {
        filtroAnimo.value =
            "cualquiera";
    }

    opcionesAnimoUnificado.forEach((opcion) => {
        opcion.checked =
            opcion.value === "cualquiera";
    });

    if (filtroDistancia) {
        filtroDistancia.value =
            "todas";
    }

    opcionesDistanciaUnificada.forEach((opcion) => {
        opcion.checked =
            opcion.value === "todas";
    });

    actualizarEstadoUbicacionFiltro(
        ubicacionUsuarioFiltro
            ? "Ubicación activada"
            : "",
        ubicacionUsuarioFiltro
            ? "ok"
            : ""
    );

    actualizarEstadoFiltroGratisRapido();

    filtroFechaRapidaActual =
        "";

    if (
        filtroFechaPersonalizada
    ) {
        filtroFechaPersonalizada.value =
            "";
    }

    fechaBuscadaDesdePortada = "";

    window.history.replaceState(
        {},
        "",
        window.location.pathname
    );

    actualizarEstadoFiltrosFecha();
    aplicarFiltros();

    if (
        devolverFoco &&
        filtroTexto
    ) {
        filtroTexto.focus();
    }
}


/* =====================================================
   EVENTOS DE LOS FILTROS
===================================================== */

/*
    El formulario se ejecuta al pulsar el botón Buscar
    o al pulsar Enter dentro del campo de búsqueda.
*/

if (formularioFiltros) {
    formularioFiltros.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            /*
                La fecha llegada desde la portada deja de tener prioridad
                cuando el usuario realiza una búsqueda manual aquí.
                Si el selector personalizado conserva esa misma fecha,
                seguirá aplicándose de forma visible.
            */
            fechaBuscadaDesdePortada = "";

            window.history.replaceState(
                {},
                "",
                window.location.pathname
            );

            actualizarEstadoFiltrosFecha();
            actualizarDistanciasTarjetas();
            aplicarFiltros();
        }
    );
}


/*
    Municipio y ordenación reaccionan inmediatamente,
    sin necesidad de pulsar Buscar.
*/

if (filtroMunicipio) {
    filtroMunicipio.addEventListener(
        "change",
        aplicarFiltros
    );
}

if (filtroCategoria) {
    filtroCategoria.addEventListener(
        "change",
        () => {
            fechaBuscadaDesdePortada = "";
            aplicarFiltros();
        }
    );
}


if (filtroOrden) {
    filtroOrden.addEventListener(
        "change",
        async () => {
            if (
                filtroOrden.value !==
                "cercania"
            ) {
                actualizarDistanciasTarjetas();
                aplicarFiltros();
                return;
            }

            const ubicacionDisponible =
                await solicitarUbicacionParaFiltro();

            if (
                !ubicacionDisponible
            ) {
                filtroOrden.value =
                    "recomendados";

                mostrarNotificacion(
                    "Necesitamos tu ubicación para ordenar por cercanía."
                );

                actualizarDistanciasTarjetas();
                aplicarFiltros();

                return;
            }

            actualizarDistanciasTarjetas();
            aplicarFiltros();
        }
    );
}


if (filtroVoySolo) {
    filtroVoySolo.addEventListener(
        "change",
        () => {
            fechaBuscadaDesdePortada =
                "";

            aplicarFiltros();
        }
    );
}


if (filtroPrimeraVez) {
    filtroPrimeraVez.addEventListener(
        "change",
        () => {
            fechaBuscadaDesdePortada = "";
            aplicarFiltros();
        }
    );
}


function actualizarEstadoFiltroGratisRapido() {
    if (!filtroGratisRapido) {
        return;
    }

    const activo =
        filtroPrecio?.value ===
        "gratis";

    filtroGratisRapido.classList.toggle(
        "filtro-experiencia--activo",
        activo
    );

    filtroGratisRapido.setAttribute(
        "aria-pressed",
        String(activo)
    );
}


if (filtroAmbiente) {
    filtroAmbiente.addEventListener(
        "change",
        () => {
            fechaBuscadaDesdePortada = "";
            aplicarFiltros();
        }
    );
}


if (filtroNuevos) {
    filtroNuevos.addEventListener(
        "change",
        () => {
            fechaBuscadaDesdePortada = "";
            aplicarFiltros();
        }
    );
}


filtroGratisRapido?.addEventListener(
    "click",
    () => {
        if (!filtroPrecio) {
            return;
        }

        const activo =
            filtroPrecio.value ===
            "gratis";

        filtroPrecio.value =
            activo
                ? "todos"
                : "gratis";

        fechaBuscadaDesdePortada = "";
        actualizarEstadoFiltroGratisRapido();
        aplicarFiltros();
    }
);


filtroPrecio?.addEventListener(
    "change",
    () => {
        actualizarEstadoFiltroGratisRapido();
        aplicarFiltros();
    }
);

opcionesAnimoUnificado.forEach((opcion) => {
    opcion.addEventListener(
        "change",
        () => {
            if (!opcion.checked || !filtroAnimo) {
                return;
            }

            filtroAnimo.value = opcion.value;
            fechaBuscadaDesdePortada = "";
            aplicarFiltros();
        }
    );
});

opcionesDistanciaUnificada.forEach((opcion) => {
    opcion.addEventListener(
        "change",
        async () => {
            if (!opcion.checked || !filtroDistancia) {
                return;
            }

            const valorAnterior =
                filtroDistancia.value ||
                "todas";

            filtroDistancia.value =
                opcion.value;

            fechaBuscadaDesdePortada = "";

            if (opcion.value === "todas") {
                actualizarDistanciasTarjetas();
                aplicarFiltros();
                return;
            }

            const disponible =
                await solicitarUbicacionParaFiltro();

            if (!disponible) {
                filtroDistancia.value =
                    valorAnterior === "todas"
                        ? "todas"
                        : valorAnterior;

                opcionesDistanciaUnificada.forEach((radio) => {
                    radio.checked =
                        radio.value === filtroDistancia.value;
                });

                actualizarDistanciasTarjetas();
                aplicarFiltros();
                return;
            }

            actualizarDistanciasTarjetas();
            aplicarFiltros();
        }
    );
});

actualizarEstadoFiltroGratisRapido();



listaFiltrosActivos?.addEventListener(
    "click",
    (evento) => {
        const boton = evento.target.closest(
            "[data-quitar-filtro]"
        );

        if (!boton) {
            return;
        }

        quitarFiltroActivo(
            boton.dataset.quitarFiltro || ""
        );
    }
);


botonVistaLista?.addEventListener(
    "click",
    () => {
        vistaResultadosActual = "lista";
        actualizarSelectorVistaResultados();
    }
);


botonVistaMapa?.addEventListener(
    "click",
    () => {
        vistaResultadosActual = "mapa";
        actualizarSelectorVistaResultados();
    }
);


botonModoSuralia?.addEventListener(
    "click",
    () => {
        const abrir =
            contenidoModoSuralia?.hidden !== false;

        if (contenidoModoSuralia) {
            contenidoModoSuralia.hidden = !abrir;
        }

        botonModoSuralia.setAttribute(
            "aria-expanded",
            String(abrir)
        );

        botonModoSuralia.classList.toggle(
            "activo",
            abrir
        );
    }
);


function programarActualizacionAutomaticaModoSuralia() {
    /*
        Antes de la primera búsqueda dejamos que el usuario configure
        tranquilamente sus preferencias. Una vez hay recomendaciones,
        el Modo Suralia pasa a ser completamente reactivo.
    */
    if (!modoSuraliaEnUso) {
        return;
    }

    clearTimeout(
        temporizadorActualizacionModoSuralia
    );

    temporizadorActualizacionModoSuralia =
        setTimeout(
            () => {
                recomendarModoSuralia({
                    desplazarResultados: false
                });
            },
            120
        );
}


opcionesInteractivasModoSuralia.forEach(
    (opcion) => {
        opcion.addEventListener(
            "change",
            programarActualizacionAutomaticaModoSuralia
        );
    }
);


buscarModoSuralia?.addEventListener(
    "click",
    () => {
        recomendarModoSuralia();
    }
);


sorprenderModoSuralia?.addEventListener(
    "click",
    () => {
        recomendarModoSuralia({
            sorpresaTotal: true
        });
    }
);



botonesFiltroFecha.forEach(
    (
        boton
    ) => {
        boton.addEventListener(
            "click",
            () => {
                seleccionarFiltroFechaRapida(
                    boton.dataset.filtroFecha
                );
            }
        );
    }
);


if (
    filtroFechaPersonalizada
) {
    filtroFechaPersonalizada.addEventListener(
        "change",
        () => {
            filtroFechaRapidaActual =
                "";

            limpiarFechaDeUrl();

            actualizarEstadoFiltrosFecha();
            aplicarFiltros();
        }
    );
}


if (botonLimpiar) {
    botonLimpiar.addEventListener(
        "click",
        () => {
            limpiarFiltros(
                true
            );
        }
    );
}


if (botonRestablecer) {
    botonRestablecer.addEventListener(
        "click",
        () => {
            limpiarFiltros(
                true
            );
        }
    );
}




/* =====================================================
   FAVORITOS DESDE EL LISTADO
===================================================== */

function obtenerBotonesFavoritosPlanes() {
    return document.querySelectorAll(
        "#lista-planes .tarjeta-plan__favorito"
    );
}


function obtenerSesionPlanes() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "sesionSuralia"
            )
        );
    } catch (error) {
        console.error(
            "No se pudo leer la sesión:",
            error
        );

        return null;
    }
}


function obtenerFavoritosPlanes() {
    try {
        const favoritos = JSON.parse(
            localStorage.getItem(
                "favoritosSuralia"
            )
        );

        return Array.isArray(favoritos)
            ? favoritos
            : [];
    } catch (error) {
        console.error(
            "No se pudieron leer los favoritos:",
            error
        );

        return [];
    }
}


function obtenerDatosTarjeta(
    tarjeta
) {
    const datosPlan =
        obtenerDatosPlan(
            tarjeta
        );

    return {
        planId:
            datosPlan.planId,

        titulo:
            datosPlan.titulo,

        categoria:
            datosPlan.categoriaTexto,

        imagen:
            datosPlan.imagen,

        fechaTexto:
            datosPlan.fechaTexto,

        fechaIso:
            datosPlan.fechaIso,

        ubicacion:
            datosPlan.ubicacion,

        precio:
            datosPlan.precio,

        valoracion:
            datosPlan.valoracion,

        enlace:
            datosPlan.enlace
    };
}


function tarjetaEstaEnFavoritos(
    planId,
    email
) {
    const favoritos =
        obtenerFavoritosPlanes();

    return favoritos.some(
        (favorito) => {
            return (
                favorito.planId === planId &&
                favorito.usuarioEmail === email
            );
        }
    );
}


function actualizarBotonFavoritoTarjeta(
    boton,
    esFavorito
) {
    const icono =
        boton.querySelector("i");

    const tarjeta =
        boton.closest(
            ".tarjeta-plan"
        );

    const tituloPlan =
        obtenerDatosPlan(
            tarjeta
        ).titulo ||
        "este plan";

    boton.classList.toggle(
        "favorito-activo",
        esFavorito
    );

    boton.setAttribute(
        "aria-pressed",
        String(esFavorito)
    );

    if (icono) {
        icono.className = esFavorito
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";

        icono.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    boton.setAttribute(
        "aria-label",
        esFavorito
            ? `Eliminar ${tituloPlan} de favoritos`
            : `Añadir ${tituloPlan} a favoritos`
    );
}


function cargarEstadoFavoritosTarjetas() {
    const sesion =
        obtenerSesionPlanes();

    obtenerBotonesFavoritosPlanes().forEach(
        (boton) => {
            const tarjeta = boton.closest(
                ".tarjeta-plan"
            );

            if (!tarjeta) {
                return;
            }

            const planId =
                tarjeta.dataset.planId;

            const esFavorito = Boolean(
                sesion?.conectado &&
                planId &&
                tarjetaEstaEnFavoritos(
                    planId,
                    sesion.email
                )
            );

            actualizarBotonFavoritoTarjeta(
                boton,
                esFavorito
            );
        }
    );
}


function alternarFavoritoTarjeta(
    boton
) {
    const sesion =
        obtenerSesionPlanes();

    if (!sesion?.conectado) {
        sessionStorage.setItem(
            "destinoDespuesLoginSuralia",
            window.location.href
        );

        mostrarNotificacion(
            "Debes iniciar sesión para guardar favoritos."
        );

        setTimeout(() => {
            window.location.href =
                "login.html";
        }, 1200);

        return;
    }

    const tarjeta = boton.closest(
        ".tarjeta-plan"
    );

    if (!tarjeta) {
        return;
    }

    const datosPlan =
        obtenerDatosTarjeta(tarjeta);

    if (!datosPlan.planId) {
        console.error(
            "La tarjeta no tiene data-plan-id."
        );

        mostrarNotificacion(
            "No se ha podido guardar este plan."
        );

        return;
    }

    const favoritos =
        obtenerFavoritosPlanes();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlan.planId &&
                    favorito.usuarioEmail ===
                        sesion.email
                );
            }
        );

    let quedaGuardado;

    if (posicion !== -1) {
        favoritos.splice(
            posicion,
            1
        );

        quedaGuardado = false;

        mostrarNotificacion(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlan,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacion(
            "El plan se ha guardado en favoritos."
        );
    }

    try {
        localStorage.setItem(
            "favoritosSuralia",
            JSON.stringify(favoritos)
        );
    } catch (error) {
        console.error(
            "No se pudieron guardar los favoritos:",
            error
        );

        mostrarNotificacion(
            "No se ha podido actualizar favoritos."
        );

        return;
    }

    actualizarBotonFavoritoTarjeta(
        boton,
        quedaGuardado
    );
}


listaPlanes?.addEventListener(
    "click",
    (evento) => {
        const boton =
            evento.target.closest(
                ".tarjeta-plan__favorito"
            );

        if (!boton) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();

        alternarFavoritoTarjeta(
            boton
        );
    }
);




if (filtroTexto) {
    let temporizadorBusquedaTexto = null;

    filtroTexto.addEventListener(
        "input",
        () => {
            clearTimeout(
                temporizadorBusquedaTexto
            );

            temporizadorBusquedaTexto =
                setTimeout(
                    () => {
                        fechaBuscadaDesdePortada = "";
                        aplicarFiltros();
                    },
                    160
                );
        }
    );

    filtroTexto.addEventListener(
        "keydown",
        (evento) => {
            if (evento.key === "Escape") {
                filtroTexto.value = "";
                aplicarFiltros();
            }
        }
    );
}


/* =====================================================
   PLANES PUBLICADOS DESDE SUPABASE
===================================================== */

function escaparHTMLPlanes(
    valor = ""
) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatearFechaPublicada(
    fechaIso
) {
    if (!fechaIso) {
        return "Fecha por confirmar";
    }

    const fecha =
        new Date(
            `${fechaIso}T00:00:00`
        );

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return fechaIso;
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(fecha);
}


function formatearPrecioPublicado(
    precio
) {
    const cantidad =
        Number(precio || 0);

    if (cantidad === 0) {
        return "Gratis";
    }

    return `${cantidad
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function asegurarCategoriaTalleres() {
    if (
        !filtroCategoria ||
        filtroCategoria.querySelector(
            'option[value="talleres"]'
        )
    ) {
        return;
    }

    const opcion =
        document.createElement("option");

    opcion.value = "talleres";
    opcion.textContent = "Talleres";

    filtroCategoria.appendChild(opcion);
}



function normalizarValorMunicipio(
    valor = ""
) {
    return String(
        valor ||
        ""
    )
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}


function cargarOpcionesMunicipio(
    planesPublicados = []
) {
    if (!filtroMunicipio) {
        return;
    }

    const municipios =
        new Map();

    (
        Array.isArray(
            planesPublicados
        )
            ? planesPublicados
            : []
    ).forEach(
        (
            plan
        ) => {
            const nombre =
                String(
                    plan?.municipio ||
                    ""
                ).trim();

            if (!nombre) {
                return;
            }

            const clave =
                normalizarValorMunicipio(
                    nombre
                );

            if (
                !clave ||
                municipios.has(
                    clave
                )
            ) {
                return;
            }

            municipios.set(
                clave,
                nombre
            );
        }
    );

    const valorActual =
        filtroMunicipio.value ||
        "todos";

    filtroMunicipio.innerHTML = `
        <option value="todos">
            Todos
        </option>
    `;

    Array.from(
        municipios.entries()
    )
        .sort(
            (
                [, nombreA],
                [, nombreB]
            ) =>
                nombreA.localeCompare(
                    nombreB,
                    "es",
                    {
                        sensitivity:
                            "base"
                    }
                )
        )
        .forEach(
            (
                [
                    clave,
                    nombre
                ]
            ) => {
                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    clave;

                opcion.textContent =
                    nombre;

                filtroMunicipio.appendChild(
                    opcion
                );
            }
        );

    const sigueExistiendo =
        valorActual ===
            "todos" ||
        Array.from(
            filtroMunicipio.options
        ).some(
            (
                opcion
            ) =>
                opcion.value ===
                valorActual
        );

    filtroMunicipio.value =
        sigueExistiendo
            ? valorActual
            : "todos";
}


function textoPersonasApuntadasTarjeta(
    cantidad
) {
    const numero =
        Math.max(
            0,
            Number(
                cantidad ||
                0
            )
        );

    return numero === 1
        ? "1 apuntada"
        : `${numero} apuntadas`;
}


function textoPersonasSolasTarjeta(
    cantidad
) {
    const numero =
        Math.max(
            0,
            Number(
                cantidad ||
                0
            )
        );

    if (
        numero === 0
    ) {
        return "Nadie va solo aún";
    }

    return numero === 1
        ? "1 va sola"
        : `${numero} van solas`;
}


function crearTarjetaPlanSupabase(
    plan
) {
    const planId =
        escaparHTMLPlanes(plan.id || "");

    const titulo =
        escaparHTMLPlanes(
            plan.titulo ||
            "Actividad de Suralia"
        );

    const categoria =
        escaparHTMLPlanes(
            plan.categoria || ""
        );

    const categoriaTexto =
        escaparHTMLPlanes(
            plan.nombre_categoria ||
            plan.categoria ||
            "Actividad"
        );

    const descripcion =
        escaparHTMLPlanes(
            plan.descripcion || ""
        );

    const fechaIso =
        escaparHTMLPlanes(
            plan.fecha || ""
        );

    const fechaTexto =
        escaparHTMLPlanes(
            formatearFechaPublicada(
                plan.fecha
            )
        );

    const hora =
        escaparHTMLPlanes(
            plan.hora
                ? String(plan.hora).slice(0, 5)
                : "Hora por confirmar"
        );

    const ubicacion =
        escaparHTMLPlanes(
            plan.ubicacion ||
            "Ubicación por confirmar"
        );

    const municipio =
        escaparHTMLPlanes(
            plan.municipio ||
            ""
        );

    const latitud =
        Number(
            plan.latitud ||
            0
        );

    const longitud =
        Number(
            plan.longitud ||
            0
        );

    const imagen =
        escaparHTMLPlanes(
            plan.imagen_url ||
            "img/placeholder-plan.jpg"
        );

    const precioNumero =
        Number(plan.precio || 0);

    const precioTexto =
        escaparHTMLPlanes(
            formatearPrecioPublicado(
                precioNumero
            )
        );

    const enlace =
        `detalle-plan.html?id=${encodeURIComponent(
            plan.id || ""
        )}`;

    const personasApuntadas =
        Number(
            plan.personas_apuntadas ||
            0
        );

    const personasSolas =
        Number(
            plan.personas_solas ||
            0
        );

    const textoApuntadas =
        escaparHTMLPlanes(
            textoPersonasApuntadasTarjeta(
                personasApuntadas
            )
        );

    const textoSolas =
        escaparHTMLPlanes(
            textoPersonasSolasTarjeta(
                personasSolas
            )
        );

    const fechasVigentes =
        Array.from(
            new Set(
                (
                    Array.isArray(
                        plan.pases_vigentes
                    )
                        ? plan.pases_vigentes
                        : []
                )
                    .map(
                        (
                            pase
                        ) =>
                            String(
                                pase?.fecha ||
                                ""
                            ).slice(
                                0,
                                10
                            )
                    )
                    .filter(
                        (
                            fecha
                        ) =>
                            /^\d{4}-\d{2}-\d{2}$/.test(
                                fecha
                            )
                    )
            )
        );

    if (
        fechasVigentes.length ===
            0 &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(
                plan.fecha ||
                ""
            ).slice(
                0,
                10
            )
        )
    ) {
        fechasVigentes.push(
            String(
                plan.fecha
            ).slice(
                0,
                10
            )
        );
    }

    const fechasVigentesDataset =
        escaparHTMLPlanes(
            fechasVigentes.join(
                ","
            )
        );

    const detallesExtra =
        plan.detalles_extra &&
        typeof plan.detalles_extra === "object"
            ? plan.detalles_extra
            : {};

    const textoPrimeraVez =
        `${plan.titulo || ""} ${plan.descripcion || ""} ${plan.dificultad || ""}`
            .toLowerCase();

    /*
       Los planes nuevos usan el dato explícito del organizador.
       Solo los planes antiguos, que todavía no tengan la propiedad,
       conservan la detección anterior para no perder compatibilidad.
    */
    const tieneMarcaPrimeraVez =
        typeof detallesExtra.ideal_primera_vez ===
        "boolean";

    const idealPrimeraVez =
        tieneMarcaPrimeraVez
            ? detallesExtra.ideal_primera_vez
            : (
                personasSolas > 0 ||
                /(primera vez|principiante|nivel inicial|sin experiencia|no necesitas experiencia)/i.test(
                    textoPrimeraVez
                )
            );

    return `
        <article
            class="tarjeta-plan tarjeta-plan--publicada-usuario"
            data-plan-id="${planId}"
            data-nombre="${titulo}"
            data-titulo="${titulo}"
            data-categoria="${categoria}"
            data-categoria-texto="${categoriaTexto}"
            data-precio="${precioNumero}"
            data-valoracion="0"
            data-fecha="${fechaTexto}"
            data-fecha-iso="${fechaIso}"
            data-fechas-vigentes="${fechasVigentesDataset}"
            data-ubicacion="${ubicacion}"
            data-municipio="${municipio}"
            data-descripcion="${descripcion}"
            data-ideal-primera-vez="${idealPrimeraVez}"
            data-latitud="${latitud}"
            data-longitud="${longitud}"
            data-imagen="${imagen}"
            data-enlace="${enlace}"
            data-personas-apuntadas="${personasApuntadas}"
            data-personas-solas="${personasSolas}"
            data-creado-en="${escaparHTMLPlanes(
                plan.creado_en ||
                ""
            )}"
        >

            <a
                href="${enlace}"
                class="tarjeta-plan__enlace"
                aria-label="Ver detalles de ${titulo}"
            >

                <div
                    class="tarjeta-plan__imagen"
                    style="background-image: url('${imagen}');"
                >

                    <span class="tarjeta-plan__precio">
                        ${precioTexto}
                    </span>

                    ${
                        idealPrimeraVez
                            ? `
                                <span class="tarjeta-plan__primera-vez">
                                    <span aria-hidden="true">👋</span>
                                    Ideal para primera vez
                                </span>
                            `
                            : ""
                    }

                    <button
                        class="tarjeta-plan__favorito"
                        type="button"
                        aria-label="Añadir ${titulo} a favoritos"
                        aria-pressed="false"
                    >
                        <i
                            class="fa-regular fa-heart"
                            aria-hidden="true"
                        ></i>
                    </button>

                </div>

                <div class="tarjeta-plan__contenido">

                    <div class="tarjeta-plan__meta">

                        <span>
                            <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                            ${fechaTexto}
                        </span>

                        <span>
                            <i class="fa-regular fa-clock" aria-hidden="true"></i>
                            ${hora}
                        </span>

                    </div>

                    <h3>${titulo}</h3>

                    <p class="tarjeta-plan__descripcion">
                        ${descripcion}
                    </p>

                    <p class="tarjeta-plan__ubicacion">
                        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                        ${ubicacion}
                    </p>

                    <p
                        class="tarjeta-plan__distancia"
                        hidden
                    >
                        <i
                            class="fa-solid fa-location-arrow"
                            aria-hidden="true"
                        ></i>

                        <span class="tarjeta-plan__distancia-texto"></span>
                    </p>

                    <div
                        class="tarjeta-plan__social"
                        aria-label="Personas apuntadas al próximo pase"
                    >

                        <span>
                            <i
                                class="fa-solid fa-user-group"
                                aria-hidden="true"
                            ></i>
                            ${textoApuntadas}
                        </span>

                        <span class="tarjeta-plan__social-solas">
                            <span aria-hidden="true">🙋</span>
                            ${textoSolas}
                        </span>

                    </div>

                    <div class="tarjeta-plan__pie">

                        <span>${categoriaTexto}</span>

                        <strong>Nuevo</strong>

                    </div>

                </div>

            </a>

        </article>
    `;
}


async function cargarPlanesPublicadosSupabase() {
    const cliente =
        window.clienteSupabase;

    if (!listaPlanes) {
        return;
    }

    if (!cliente) {
        planes = [];
        aplicarFiltros();
        mostrarNotificacion(
            "No se ha podido conectar para cargar los planes."
        );
        return;
    }

    try {
        const {
            data,
            error
        } = await cliente
            .from("planes")
            .select(
                `
                    id,
                    titulo,
                    categoria,
                    nombre_categoria,
                    descripcion,
                    fecha,
                    hora,
                    fechas,
                    ubicacion,
                    municipio,
                    latitud,
                    longitud,
                    dificultad,
                    detalles_extra,
                    precio,
                    imagen_url,
                    creado_en
                `
            )
            .eq("estado", "publicado")
            .order(
                "creado_en",
                {
                    ascending: false
                }
            );

        if (error) {
            throw error;
        }

        const idsExistentes =
            new Set(
                Array.from(
                    listaPlanes.querySelectorAll(
                        ".tarjeta-plan"
                    )
                ).map(
                    (tarjeta) =>
                        String(
                            tarjeta.dataset.planId ||
                            ""
                        )
                )
            );

        const planesNuevos =
            (
                Array.isArray(data)
                    ? data
                    : []
            )
                .map(
                    prepararPlanPublicadoVigente
                )
                .filter(
                    (
                        plan
                    ) =>
                        plan &&
                        plan.id &&
                        !idsExistentes.has(
                            String(
                                plan.id
                            )
                        )
                )
                .sort(
                    (
                        planA,
                        planB
                    ) =>
                        String(
                            planA.fecha ||
                            ""
                        ).localeCompare(
                            String(
                                planB.fecha ||
                                ""
                            )
                        )
                );

        let resumenSocialPorPlan =
            new Map();

        const idsPlanes =
            planesNuevos
                .map(
                    (
                        plan
                    ) =>
                        plan.id
                )
                .filter(Boolean);

        if (
            idsPlanes.length >
            0
        ) {
            const {
                data:
                    resumenSocial,
                error:
                    errorResumenSocial
            } = await cliente.rpc(
                "obtener_resumen_social_planes",
                {
                    p_plan_ids:
                        idsPlanes
                }
            );

            if (
                errorResumenSocial
            ) {
                console.warn(
                    "No se pudo cargar el resumen social de los planes:",
                    errorResumenSocial
                );
            } else {
                resumenSocialPorPlan =
                    new Map(
                        (
                            Array.isArray(
                                resumenSocial
                            )
                                ? resumenSocial
                                : []
                        ).map(
                            (
                                item
                            ) => [
                                String(
                                    item.plan_id ||
                                    ""
                                ),

                                item
                            ]
                        )
                    );
            }
        }

        cargarOpcionesMunicipio(
            planesNuevos
        );

        const planesConResumenSocial =
            planesNuevos.map(
                (
                    plan
                ) => {
                    const resumen =
                        resumenSocialPorPlan.get(
                            String(
                                plan.id ||
                                ""
                            )
                        );

                    return {
                        ...plan,

                        personas_apuntadas:
                            Number(
                                resumen?.personas_apuntadas ||
                                0
                            ),

                        personas_solas:
                            Number(
                                resumen?.personas_solas ||
                                0
                            )
                    };
                }
            );

        listaPlanes.innerHTML =
            planesConResumenSocial
                .map(
                    crearTarjetaPlanSupabase
                )
                .join("");

        planes =
            Array.from(
                document.querySelectorAll(
                    "#lista-planes .tarjeta-plan"
                )
            );

        actualizarDistanciasTarjetas();
        aplicarFiltros();
        actualizarSelectorVistaResultados();
        cargarEstadoFavoritosTarjetas();
    } catch (error) {
        console.error(
            "No se pudieron cargar los planes publicados desde Supabase:",
            error
        );

        listaPlanes.innerHTML = "";
        planes = [];
        aplicarFiltros();

        mostrarNotificacion(
            "No se han podido cargar las actividades."
        );
    }
}


/* =====================================================
   SINCRONIZACIÓN ENTRE PESTAÑAS
===================================================== */

window.addEventListener(
    "storage",
    (evento) => {
        if (
            evento.key ===
                "favoritosSuralia" ||
            evento.key ===
                "sesionSuralia"
        ) {
            cargarEstadoFavoritosTarjetas();
        }
    }
);

/* =====================================================
   CARGA INICIAL
===================================================== */

if (
    typeof window.obtenerPlanSuralia !==
    "function"
) {
    console.warn(
        "No se ha cargado js/datos-planes.js. Se usarán los datos del HTML."
    );
}

aplicarParametrosIniciales();
prepararFiltrosFecha();
actualizarBotonVista();
asegurarCategoriaTalleres();
cargarPlanesPublicadosSupabase();


/* =========================================================
   SURALIA · BÚSQUEDAS GUARDADAS + AVISOS
========================================================= */

(() => {
    const botonGuardar =
        document.querySelector(
            "#guardar-busqueda-actual"
        );

    const botonAbrir =
        document.querySelector(
            "#abrir-busquedas-guardadas"
        );

    const botonCerrarPanel =
        document.querySelector(
            "#cerrar-busquedas-guardadas"
        );

    const panel =
        document.querySelector(
            "#panel-busquedas-guardadas"
        );

    const formulario =
        document.querySelector(
            "#formulario-guardar-busqueda"
        );

    const botonCerrarFormulario =
        document.querySelector(
            "#cerrar-formulario-guardar-busqueda"
        );

    const inputNombre =
        document.querySelector(
            "#nombre-busqueda-guardada"
        );

    const inputAvisos =
        document.querySelector(
            "#avisos-busqueda-guardada"
        );

    const lista =
        document.querySelector(
            "#lista-busquedas-guardadas"
        );

    const vacio =
        document.querySelector(
            "#busquedas-guardadas-vacias"
        );

    const contador =
        document.querySelector(
            "#contador-busquedas-guardadas"
        );

    if (
        !botonGuardar ||
        !botonAbrir ||
        !panel ||
        !formulario ||
        !lista
    ) {
        return;
    }

    let busquedasGuardadas = [];


    function obtenerSesionBusquedaGuardada() {
        try {
            const sesion =
                JSON.parse(
                    localStorage.getItem(
                        "sesionSuralia"
                    ) ||
                    "null"
                );

            if (
                !sesion?.conectado ||
                !sesion?.id
            ) {
                return null;
            }

            return sesion;
        } catch (error) {
            console.error(
                "No se pudo leer la sesión para búsquedas guardadas:",
                error
            );

            return null;
        }
    }


    function pedirInicioSesionBusquedas() {
        sessionStorage.setItem(
            "destinoDespuesLoginSuralia",
            "planes.html"
        );

        mostrarNotificacion(
            "Inicia sesión para guardar tus búsquedas."
        );

        setTimeout(
            () => {
                window.location.href =
                    "login.html";
            },
            700
        );
    }


    function abrirPanelBusquedas(
        mostrarFormulario = false
    ) {
        panel.hidden = false;

        botonAbrir.setAttribute(
            "aria-expanded",
            "true"
        );

        if (mostrarFormulario) {
            formulario.hidden = false;

            const activos =
                obtenerFiltrosActivosActuales();

            const sugerencia =
                activos
                    .slice(0, 3)
                    .map(
                        (item) =>
                            item.texto
                    )
                    .join(" · ");

            if (inputNombre) {
                inputNombre.value =
                    sugerencia ||
                    "Mis planes favoritos";

                requestAnimationFrame(
                    () => {
                        inputNombre.focus();
                        inputNombre.select();
                    }
                );
            }

            if (inputAvisos) {
                inputAvisos.checked = true;
            }
        }
    }


    function cerrarFormularioBusqueda() {
        formulario.hidden = true;

        if (inputNombre) {
            inputNombre.value = "";
        }
    }


    function cerrarPanelBusquedas() {
        panel.hidden = true;

        botonAbrir.setAttribute(
            "aria-expanded",
            "false"
        );

        cerrarFormularioBusqueda();
    }


    function obtenerFiltrosParaGuardar() {
        return {
            texto:
                filtroTexto?.value.trim() ||
                "",

            municipio:
                filtroMunicipio?.value ||
                "todos",

            categoria:
                filtroCategoria?.value ||
                "todas",

            precio:
                filtroPrecio?.value ||
                "todos",

            distancia:
                filtroDistancia?.value ||
                "todas",

            animo:
                filtroAnimo?.value ||
                "cualquiera",

            ambiente:
                Boolean(
                    filtroAmbiente?.checked
                ),

            nuevos:
                Boolean(
                    filtroNuevos?.checked
                ),

            fecha_rapida:
                filtroFechaRapidaActual ||
                "",

            fecha_personalizada:
                filtroFechaPersonalizada?.value ||
                "",

            voy_solo:
                Boolean(
                    filtroVoySolo?.checked
                ),

            primera_vez:
                Boolean(
                    filtroPrimeraVez?.checked
                ),

            orden:
                filtroOrden?.value ||
                "recomendados"
        };
    }


    function tieneFiltrosUtiles(
        filtros
    ) {
        return Boolean(
            filtros.texto ||
            filtros.municipio !== "todos" ||
            filtros.categoria !== "todas" ||
            filtros.precio !== "todos" ||
            (filtros.distancia || "todas") !== "todas" ||
            (filtros.animo || "cualquiera") !== "cualquiera" ||
            filtros.ambiente ||
            filtros.nuevos ||
            filtros.fecha_rapida ||
            filtros.fecha_personalizada ||
            filtros.voy_solo ||
            filtros.primera_vez
        );
    }


    function textoValorSelect(
        selector,
        valor
    ) {
        if (!selector) {
            return "";
        }

        return (
            Array.from(
                selector.options
            ).find(
                (option) =>
                    option.value === valor
            )?.textContent?.trim() ||
            ""
        );
    }


    function obtenerResumenBusqueda(
        filtros
    ) {
        const partes = [];

        if (filtros.texto) {
            partes.push(
                `“${filtros.texto}”`
            );
        }

        if (
            filtros.municipio &&
            filtros.municipio !== "todos"
        ) {
            partes.push(
                textoValorSelect(
                    filtroMunicipio,
                    filtros.municipio
                ) ||
                filtros.municipio
            );
        }

        if (
            filtros.categoria &&
            filtros.categoria !== "todas"
        ) {
            partes.push(
                textoValorSelect(
                    filtroCategoria,
                    filtros.categoria
                ) ||
                filtros.categoria
            );
        }

        if (
            filtros.precio &&
            filtros.precio !== "todos"
        ) {
            partes.push(
                textoValorSelect(
                    filtroPrecio,
                    filtros.precio
                ) ||
                filtros.precio
            );
        }

        if (filtros.fecha_rapida) {
            const etiquetas = {
                hoy:
                    "Hoy",

                manana:
                    "Mañana",

                finde:
                    "Este finde",

                semana:
                    "Esta semana",

                "proxima-semana":
                    "Próxima semana"
            };

            partes.push(
                etiquetas[
                    filtros.fecha_rapida
                ] ||
                filtros.fecha_rapida
            );
        }

        if (filtros.fecha_personalizada) {
            partes.push(
                filtros.fecha_personalizada
            );
        }

        if (filtros.voy_solo) {
            partes.push(
                "Voy solo"
            );
        }

        if (filtros.primera_vez) {
            partes.push(
                "Primera vez"
            );
        }

        if (filtros.ambiente) {
            partes.push(
                "Con ambiente"
            );
        }

        if (filtros.nuevos) {
            partes.push(
                "Recién publicados"
            );
        }

        return partes.length
            ? partes.join(" · ")
            : "Todos los planes";
    }


    function escaparAtributoBusqueda(
        valor
    ) {
        return escaparHTMLPlanes(
            String(
                valor ?? ""
            )
        );
    }


    function renderizarBusquedasGuardadas() {
        if (contador) {
            contador.textContent =
                String(
                    busquedasGuardadas.length
                );
        }

        if (vacio) {
            vacio.hidden =
                busquedasGuardadas.length >
                0;
        }

        if (
            busquedasGuardadas.length ===
            0
        ) {
            lista.innerHTML = "";
            return;
        }

        lista.innerHTML =
            busquedasGuardadas
                .map(
                    (busqueda) => {
                        const filtros =
                            busqueda.filtros &&
                            typeof busqueda.filtros ===
                                "object"
                                ? busqueda.filtros
                                : {};

                        const resumen =
                            obtenerResumenBusqueda(
                                filtros
                            );

                        return `
                            <article
                                class="busqueda-guardada-card"
                                data-busqueda-id="${escaparAtributoBusqueda(
                                    busqueda.id
                                )}"
                            >
                                <div class="busqueda-guardada-card__cabecera">
                                    <span class="busqueda-guardada-card__icono">
                                        <i
                                            class="fa-regular fa-bookmark"
                                            aria-hidden="true"
                                        ></i>
                                    </span>

                                    <div>
                                        <h4>
                                            ${escaparHTMLPlanes(
                                                busqueda.nombre ||
                                                "Búsqueda guardada"
                                            )}
                                        </h4>

                                        <p>
                                            ${escaparHTMLPlanes(
                                                resumen
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div class="busqueda-guardada-card__pie">
                                    <label class="busqueda-guardada-card__alerta">
                                        <input
                                            type="checkbox"
                                            data-alerta-busqueda="${escaparAtributoBusqueda(
                                                busqueda.id
                                            )}"
                                            ${
                                                busqueda.avisos
                                                    ? "checked"
                                                    : ""
                                            }
                                        >

                                        <span
                                            class="busqueda-guardada-card__alerta-control"
                                            aria-hidden="true"
                                        ></span>

                                        <span>
                                            ${
                                                busqueda.avisos
                                                    ? "Avisos activos"
                                                    : "Avisos desactivados"
                                            }
                                        </span>
                                    </label>

                                    <div class="busqueda-guardada-card__acciones">
                                        <button
                                            type="button"
                                            class="busqueda-guardada-card__aplicar"
                                            data-aplicar-busqueda="${escaparAtributoBusqueda(
                                                busqueda.id
                                            )}"
                                        >
                                            <i
                                                class="fa-solid fa-arrow-rotate-left"
                                                aria-hidden="true"
                                            ></i>
                                            Aplicar
                                        </button>

                                        <button
                                            type="button"
                                            class="busqueda-guardada-card__eliminar"
                                            data-eliminar-busqueda="${escaparAtributoBusqueda(
                                                busqueda.id
                                            )}"
                                            aria-label="Eliminar búsqueda"
                                            title="Eliminar búsqueda"
                                        >
                                            <i
                                                class="fa-regular fa-trash-can"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        `;
                    }
                )
                .join("");
    }


    async function cargarBusquedasGuardadas() {
        const sesion =
            obtenerSesionBusquedaGuardada();

        const cliente =
            window.clienteSupabase;

        if (
            !sesion ||
            !cliente
        ) {
            busquedasGuardadas = [];
            renderizarBusquedasGuardadas();
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from(
                "busquedas_guardadas"
            )
            .select(
                `
                    id,
                    nombre,
                    filtros,
                    avisos,
                    creado_en,
                    actualizado_en
                `
            )
            .eq(
                "usuario_id",
                sesion.id
            )
            .order(
                "actualizado_en",
                {
                    ascending:
                        false
                }
            );

        if (error) {
            console.error(
                "No se pudieron cargar las búsquedas guardadas:",
                error
            );

            return;
        }

        busquedasGuardadas =
            Array.isArray(data)
                ? data
                : [];

        renderizarBusquedasGuardadas();
    }


    async function guardarBusquedaActual(
        evento
    ) {
        evento.preventDefault();

        const sesion =
            obtenerSesionBusquedaGuardada();

        if (!sesion) {
            pedirInicioSesionBusquedas();
            return;
        }

        const cliente =
            window.clienteSupabase;

        if (!cliente) {
            mostrarNotificacion(
                "No se ha podido conectar con Suralia."
            );
            return;
        }

        const nombre =
            inputNombre?.value.trim() ||
            "";

        if (!nombre) {
            inputNombre?.focus();

            mostrarNotificacion(
                "Ponle un nombre a la búsqueda."
            );
            return;
        }

        const filtros =
            obtenerFiltrosParaGuardar();

        if (
            !tieneFiltrosUtiles(
                filtros
            )
        ) {
            mostrarNotificacion(
                "Selecciona al menos un filtro antes de guardar."
            );
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from(
                "busquedas_guardadas"
            )
            .insert({
                usuario_id:
                    sesion.id,

                nombre,

                filtros,

                avisos:
                    Boolean(
                        inputAvisos?.checked
                    )
            })
            .select(
                `
                    id,
                    nombre,
                    filtros,
                    avisos,
                    creado_en,
                    actualizado_en
                `
            )
            .single();

        if (error) {
            console.error(
                "No se pudo guardar la búsqueda:",
                error
            );

            mostrarNotificacion(
                "No se ha podido guardar la búsqueda."
            );
            return;
        }

        busquedasGuardadas.unshift(
            data
        );

        renderizarBusquedasGuardadas();

        cerrarFormularioBusqueda();

        mostrarNotificacion(
            inputAvisos?.checked
                ? "Búsqueda guardada. Te avisaremos de nuevos planes."
                : "Búsqueda guardada."
        );
    }


    async function cambiarAvisosBusqueda(
        id,
        activo,
        checkbox
    ) {
        const sesion =
            obtenerSesionBusquedaGuardada();

        const cliente =
            window.clienteSupabase;

        if (
            !sesion ||
            !cliente
        ) {
            checkbox.checked =
                !activo;

            return;
        }

        const {
            error
        } = await cliente
            .from(
                "busquedas_guardadas"
            )
            .update({
                avisos:
                    activo,

                actualizado_en:
                    new Date().toISOString()
            })
            .eq(
                "id",
                id
            )
            .eq(
                "usuario_id",
                sesion.id
            );

        if (error) {
            console.error(
                "No se pudieron cambiar los avisos:",
                error
            );

            checkbox.checked =
                !activo;

            mostrarNotificacion(
                "No se han podido cambiar los avisos."
            );

            return;
        }

        const busqueda =
            busquedasGuardadas.find(
                (item) =>
                    String(item.id) ===
                    String(id)
            );

        if (busqueda) {
            busqueda.avisos =
                activo;
        }

        renderizarBusquedasGuardadas();

        mostrarNotificacion(
            activo
                ? "Avisos activados."
                : "Avisos desactivados."
        );
    }


    async function eliminarBusquedaGuardada(
        id
    ) {
        const sesion =
            obtenerSesionBusquedaGuardada();

        const cliente =
            window.clienteSupabase;

        if (
            !sesion ||
            !cliente
        ) {
            return;
        }

        const {
            error
        } = await cliente
            .from(
                "busquedas_guardadas"
            )
            .delete()
            .eq(
                "id",
                id
            )
            .eq(
                "usuario_id",
                sesion.id
            );

        if (error) {
            console.error(
                "No se pudo eliminar la búsqueda:",
                error
            );

            mostrarNotificacion(
                "No se ha podido eliminar la búsqueda."
            );

            return;
        }

        busquedasGuardadas =
            busquedasGuardadas.filter(
                (item) =>
                    String(item.id) !==
                    String(id)
            );

        renderizarBusquedasGuardadas();

        mostrarNotificacion(
            "Búsqueda eliminada."
        );
    }


    async function aplicarBusquedaGuardada(
        id
    ) {
        const busqueda =
            busquedasGuardadas.find(
                (item) =>
                    String(item.id) ===
                    String(id)
            );

        if (!busqueda) {
            return;
        }

        const filtros =
            busqueda.filtros &&
            typeof busqueda.filtros ===
                "object"
                ? busqueda.filtros
                : {};

        if (filtroTexto) {
            filtroTexto.value =
                filtros.texto ||
                "";
        }

        if (filtroMunicipio) {
            filtroMunicipio.value =
                filtros.municipio ||
                "todos";
        }

        if (filtroCategoria) {
            filtroCategoria.value =
                filtros.categoria ||
                "todas";
        }

        if (filtroPrecio) {
            filtroPrecio.value =
                filtros.precio ||
                "todos";
        }

        if (filtroDistancia) {
            filtroDistancia.value =
                filtros.distancia ||
                "todas";
        }

        opcionesDistanciaUnificada.forEach((opcion) => {
            opcion.checked =
                opcion.value ===
                (filtroDistancia?.value || "todas");
        });

        if (filtroAnimo) {
            filtroAnimo.value =
                filtros.animo ||
                "cualquiera";
        }

        opcionesAnimoUnificado.forEach((opcion) => {
            opcion.checked =
                opcion.value ===
                (filtroAnimo?.value || "cualquiera");
        });

        if (filtroVoySolo) {
            filtroVoySolo.checked =
                Boolean(
                    filtros.voy_solo
                );
        }

        if (filtroPrimeraVez) {
            filtroPrimeraVez.checked =
                Boolean(
                    filtros.primera_vez
                );
        }

        if (filtroAmbiente) {
            filtroAmbiente.checked =
                Boolean(
                    filtros.ambiente
                );
        }

        if (filtroNuevos) {
            filtroNuevos.checked =
                Boolean(
                    filtros.nuevos
                );
        }

        if (filtroOrden) {
            filtroOrden.value =
                filtros.orden ||
                "recomendados";
        }

        fechaBuscadaDesdePortada = "";

        filtroFechaRapidaActual =
            filtros.fecha_rapida ||
            "";

        if (filtroFechaPersonalizada) {
            filtroFechaPersonalizada.value =
                filtros.fecha_personalizada ||
                "";
        }

        actualizarEstadoFiltrosFecha();
        actualizarEstadoFiltroGratisRapido();

        const necesitaUbicacion =
            filtroOrden?.value === "cercania" ||
            (
                filtroDistancia?.value &&
                filtroDistancia.value !== "todas"
            );

        if (necesitaUbicacion) {
            const disponible =
                await solicitarUbicacionParaFiltro();

            if (!disponible) {

                if (
                    filtroOrden?.value ===
                        "cercania"
                ) {
                    filtroOrden.value =
                        "recomendados";
                }

                if (
                    filtroDistancia?.value &&
                    filtroDistancia.value !== "todas"
                ) {
                    filtroDistancia.value = "todas";

                    opcionesDistanciaUnificada.forEach((opcion) => {
                        opcion.checked =
                            opcion.value === "todas";
                    });
                }
            }
        }

        actualizarDistanciasTarjetas();
        aplicarFiltros();

        cerrarPanelBusquedas();

        formularioFiltros?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

        mostrarNotificacion(
            `Búsqueda “${busqueda.nombre}” aplicada.`
        );
    }


    botonGuardar.addEventListener(
        "click",
        () => {
            const sesion =
                obtenerSesionBusquedaGuardada();

            if (!sesion) {
                pedirInicioSesionBusquedas();
                return;
            }

            if (
                !tieneFiltrosUtiles(
                    obtenerFiltrosParaGuardar()
                )
            ) {
                mostrarNotificacion(
                    "Selecciona al menos un filtro antes de guardar."
                );

                formularioFiltros?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "center"
                });

                return;
            }

            abrirPanelBusquedas(
                true
            );
        }
    );


    botonAbrir.addEventListener(
        "click",
        () => {
            const sesion =
                obtenerSesionBusquedaGuardada();

            if (!sesion) {
                pedirInicioSesionBusquedas();
                return;
            }

            if (panel.hidden) {
                abrirPanelBusquedas(
                    false
                );
            } else {
                cerrarPanelBusquedas();
            }
        }
    );


    botonCerrarPanel?.addEventListener(
        "click",
        cerrarPanelBusquedas
    );


    botonCerrarFormulario?.addEventListener(
        "click",
        cerrarFormularioBusqueda
    );


    formulario.addEventListener(
        "submit",
        guardarBusquedaActual
    );


    lista.addEventListener(
        "click",
        async (evento) => {
            const aplicar =
                evento.target.closest(
                    "[data-aplicar-busqueda]"
                );

            if (aplicar) {
                await aplicarBusquedaGuardada(
                    aplicar.dataset
                        .aplicarBusqueda
                );

                return;
            }

            const eliminar =
                evento.target.closest(
                    "[data-eliminar-busqueda]"
                );

            if (eliminar) {
                await eliminarBusquedaGuardada(
                    eliminar.dataset
                        .eliminarBusqueda
                );
            }
        }
    );


    lista.addEventListener(
        "change",
        async (evento) => {
            const checkbox =
                evento.target.closest(
                    "[data-alerta-busqueda]"
                );

            if (!checkbox) {
                return;
            }

            await cambiarAvisosBusqueda(
                checkbox.dataset
                    .alertaBusqueda,

                checkbox.checked,

                checkbox
            );
        }
    );


    document.addEventListener(
        "keydown",
        (evento) => {
            if (
                evento.key === "Escape" &&
                !panel.hidden
            ) {
                cerrarPanelBusquedas();
            }
        }
    );


    cargarBusquedasGuardadas();
})();

