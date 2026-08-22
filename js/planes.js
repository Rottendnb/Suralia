/* =====================================================
   ELEMENTOS DE LOS FILTROS
===================================================== */

const formularioFiltros = document.querySelector(
    "#formulario-filtros"
);

const filtroTexto = document.querySelector(
    "#filtro-texto"
);

const filtroCategoria = document.querySelector(
    "#filtro-categoria"
);

const filtroPrecio = document.querySelector(
    "#filtro-precio"
);

const filtroOrden = document.querySelector(
    "#filtro-orden"
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

let vistaCompactaActiva = false;


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
    */
    return {
        ...plan,
        fecha:
            proximoPase.fecha,
        hora:
            proximoPase.hora ||
            plan.hora ||
            null
    };
}


function cumpleFiltroPrecio(
    precio,
    filtro
) {
    if (filtro === "gratis") {
        return precio === 0;
    }

    if (filtro === "menos-20") {
        return precio > 0 && precio < 20;
    }

    if (filtro === "mas-20") {
        return precio >= 20;
    }

    return true;
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
        !filtroCategoria ||
        !filtroPrecio ||
        !listaPlanes
    ) {
        return;
    }

    const textoBuscado = normalizarTexto(
        filtroTexto.value.trim()
    );

    const categoriaSeleccionada =
        filtroCategoria.value;

    const precioSeleccionado =
        filtroPrecio.value;

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

            const categoria =
                datosPlan.categoria;

            const precio =
                datosPlan.precio;

            const fechaIso =
                datosPlan.fechaIso;

            const coincideTexto =
                !textoBuscado ||
                nombre.includes(textoBuscado) ||
                titulo.includes(textoBuscado) ||
                ubicacion.includes(textoBuscado) ||
                categoriaTexto.includes(
                    textoBuscado
                );

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
                !fechaBuscadaDesdePortada ||
                fechaIso ===
                    fechaBuscadaDesdePortada;

            const sigueDisponible =
                !planHaCaducado(
                    fechaIso
                );

            return (
                coincideTexto &&
                coincideCategoria &&
                coincidePrecio &&
                coincideFecha &&
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

    actualizarEstadoSinResultados(
        planesVisibles.length
    );
}


function limpiarFiltros(
    devolverFoco = false
) {
    if (filtroTexto) {
        filtroTexto.value = "";
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

    fechaBuscadaDesdePortada = "";

    window.history.replaceState(
        {},
        "",
        window.location.pathname
    );

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

            fechaBuscadaDesdePortada = "";

            window.history.replaceState(
                {},
                "",
                window.location.pathname
            );

            aplicarFiltros();
        }
    );
}


/*
    La ordenación continúa reaccionando inmediatamente,
    sin necesidad de pulsar Buscar.
*/

if (filtroOrden) {
    filtroOrden.addEventListener(
        "change",
        aplicarFiltros
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


if (botonVista) {
    botonVista.addEventListener(
        "click",
        alternarVistaResultados
    );

    actualizarBotonVista();
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
            data-ubicacion="${ubicacion}"
            data-imagen="${imagen}"
            data-enlace="${enlace}"
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

        listaPlanes.innerHTML =
            planesNuevos
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

        aplicarFiltros();
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
actualizarBotonVista();
asegurarCategoriaTalleres();
cargarPlanesPublicadosSupabase();