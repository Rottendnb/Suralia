/* =====================================================
   DATOS DEL PLAN
===================================================== */

function obtenerDatosOficialesSierraNorte() {
    if (
        typeof window.obtenerPlanSuralia !==
        "function"
    ) {
        return null;
    }

    return window.obtenerPlanSuralia(
        "sierra-norte"
    );
}


const datosCatalogoSierraNorte =
    obtenerDatosOficialesSierraNorte();


const datosPlanSierraNorte = {
    planId:
        datosCatalogoSierraNorte?.planId ||
        document.body.dataset.planId ||
        "sierra-norte",

    titulo:
        datosCatalogoSierraNorte?.titulo ||
        document.body.dataset.planTitulo ||
        "Ruta de senderismo por la Sierra Norte",

    categoria:
        datosCatalogoSierraNorte?.categoriaTexto ||
        document.body.dataset.planCategoria ||
        "Naturaleza",

    imagen:
        datosCatalogoSierraNorte?.imagen ||
        document.body.dataset.planImagen ||
        "img/sierra-norte-principal.jpg",

    precio:
        Number(
            datosCatalogoSierraNorte?.precio ??
            document.body.dataset.planPrecio ??
            12
        ),

    valoracion:
        Number(
            datosCatalogoSierraNorte?.valoracion ??
            document.body.dataset.planValoracion ??
            4.9
        ),

    fechaTexto:
        datosCatalogoSierraNorte?.fechaTexto ||
        document.body.dataset.planFecha ||
        "8 de agosto de 2026",

    fechaIso:
        datosCatalogoSierraNorte?.fechaIso ||
        document.body.dataset.planFechaIso ||
        "2026-08-08",

    hora:
        datosCatalogoSierraNorte?.hora ||
        "09:00",

    ubicacion:
        datosCatalogoSierraNorte?.ubicacion ||
        document.body.dataset.planUbicacion ||
        "Constantina, Sevilla",

    enlace:
        datosCatalogoSierraNorte?.enlace ||
        document.body.dataset.planEnlace ||
        "detalle-sierra-norte.html"
};


/* =====================================================
   ELEMENTOS
===================================================== */

const botonLeerMas = document.querySelector(
    "#boton-leer-mas"
);

const descripcionAmpliada = document.querySelector(
    "#descripcion-ampliada"
);

const botonCompartir = document.querySelector(
    "#boton-compartir"
);

const botonFavoritoPlan = document.querySelector(
    "#boton-favorito-plan"
);

const formularioReserva = document.querySelector(
    "#formulario-reserva"
);

const fechaReserva = document.querySelector(
    "#fecha-reserva"
);

const personasReserva = document.querySelector(
    "#personas-reserva"
);

const numeroPersonasDesglose =
    document.querySelector(
        "#numero-personas-desglose"
    );

const precioActividad = document.querySelector(
    "#precio-actividad"
);

const precioTotal = document.querySelector(
    "#precio-total"
);

const modalImagen = document.querySelector(
    "#modal-imagen"
);

const imagenModal = document.querySelector(
    "#imagen-modal"
);

const cerrarModalImagen = document.querySelector(
    "#cerrar-modal-imagen"
);

const botonesGaleria = document.querySelectorAll(
    ".galeria-plan button[data-imagen]"
);

const notificacion = document.querySelector(
    "#notificacion"
);

let temporizadorNotificacion;


/* =====================================================
   LOCALSTORAGE
===================================================== */

function leerLocalStorage(
    clave,
    valorAlternativo
) {
    try {
        const contenido =
            localStorage.getItem(clave);

        if (!contenido) {
            return valorAlternativo;
        }

        return JSON.parse(contenido);
    } catch (error) {
        console.error(
            `No se pudo leer ${clave}:`,
            error
        );

        return valorAlternativo;
    }
}


function obtenerSesion() {
    return leerLocalStorage(
        "sesionSuralia",
        null
    );
}


function obtenerFavoritos() {
    const favoritos =
        leerLocalStorage(
            "favoritosSuralia",
            []
        );

    return Array.isArray(favoritos)
        ? favoritos
        : [];
}


function obtenerReservas() {
    const reservas =
        leerLocalStorage(
            "reservasSuralia",
            []
        );

    return Array.isArray(reservas)
        ? reservas
        : [];
}


function guardarLocalStorage(
    clave,
    valor
) {
    try {
        localStorage.setItem(
            clave,
            JSON.stringify(valor)
        );

        return true;
    } catch (error) {
        console.error(
            `No se pudo guardar ${clave}:`,
            error
        );

        return false;
    }
}


function guardarFavoritos(favoritos) {
    return guardarLocalStorage(
        "favoritosSuralia",
        favoritos
    );
}


function guardarReservas(reservas) {
    return guardarLocalStorage(
        "reservasSuralia",
        reservas
    );
}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(mensaje) {
    if (!notificacion) {
        console.log(mensaje);
        return;
    }

    const texto =
        notificacion.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacion.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorNotificacion
    );

    temporizadorNotificacion = setTimeout(
        () => {
            notificacion.classList.remove(
                "visible"
            );
        },
        3000
    );
}


/* =====================================================
   LEER MÁS
===================================================== */

if (
    botonLeerMas &&
    descripcionAmpliada
) {
    botonLeerMas.addEventListener(
        "click",
        () => {
            const estaVisible =
                descripcionAmpliada.classList.toggle(
                    "visible"
                );

            botonLeerMas.innerHTML =
                estaVisible
                    ? `
                        Mostrar menos
                        <i class="fa-solid fa-chevron-up"></i>
                    `
                    : `
                        Leer descripción completa
                        <i class="fa-solid fa-chevron-down"></i>
                    `;
        }
    );
}


/* =====================================================
   GALERÍA
===================================================== */

function abrirModalImagen(rutaImagen) {
    if (
        !modalImagen ||
        !imagenModal ||
        !rutaImagen
    ) {
        return;
    }

    imagenModal.src = rutaImagen;

    modalImagen.classList.add(
        "visible"
    );

    document.body.style.overflow =
        "hidden";
}


function cerrarGaleria() {
    if (!modalImagen) {
        return;
    }

    modalImagen.classList.remove(
        "visible"
    );

    document.body.style.overflow =
        "";

    if (imagenModal) {
        imagenModal.src = "";
    }
}


botonesGaleria.forEach((boton) => {
    boton.addEventListener(
        "click",
        () => {
            abrirModalImagen(
                boton.dataset.imagen
            );
        }
    );
});


if (cerrarModalImagen) {
    cerrarModalImagen.addEventListener(
        "click",
        cerrarGaleria
    );
}


if (modalImagen) {
    modalImagen.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalImagen
            ) {
                cerrarGaleria();
            }
        }
    );
}


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Escape" &&
            modalImagen?.classList.contains(
                "visible"
            )
        ) {
            cerrarGaleria();
        }
    }
);


/* =====================================================
   COMPARTIR
===================================================== */

async function copiarEnlace() {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(
            window.location.href
        );

        return;
    }

    const campoTemporal =
        document.createElement("textarea");

    campoTemporal.value =
        window.location.href;

    campoTemporal.style.position =
        "fixed";

    campoTemporal.style.opacity =
        "0";

    document.body.appendChild(
        campoTemporal
    );

    campoTemporal.select();

    document.execCommand("copy");

    campoTemporal.remove();
}


if (botonCompartir) {
    botonCompartir.addEventListener(
        "click",
        async () => {
            const informacion = {
                title:
                    datosPlanSierraNorte.titulo,

                text:
                    `Descubre ${datosPlanSierraNorte.titulo} en Suralia.`,

                url:
                    window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(
                        informacion
                    );

                    mostrarNotificacion(
                        "Plan compartido correctamente."
                    );

                    return;
                }

                await copiarEnlace();

                mostrarNotificacion(
                    "Enlace copiado al portapapeles."
                );
            } catch (error) {
                if (
                    error.name !==
                    "AbortError"
                ) {
                    console.error(
                        "No se pudo compartir:",
                        error
                    );

                    mostrarNotificacion(
                        "No se ha podido compartir el plan."
                    );
                }
            }
        }
    );
}


/* =====================================================
   FAVORITOS
===================================================== */

function planEstaEnFavoritos(
    planId,
    email
) {
    const favoritos =
        obtenerFavoritos();

    return favoritos.some(
        (favorito) => {
            return (
                favorito.planId ===
                    planId &&
                favorito.usuarioEmail ===
                    email
            );
        }
    );
}


function actualizarBotonFavorito(
    esFavorito
) {
    if (!botonFavoritoPlan) {
        return;
    }

    const icono =
        botonFavoritoPlan.querySelector(
            "i"
        );

    const texto =
        botonFavoritoPlan.querySelector(
            "span"
        );

    botonFavoritoPlan.classList.toggle(
        "favorito-activo",
        esFavorito
    );

    if (icono) {
        icono.className =
            esFavorito
                ? "fa-solid fa-heart"
                : "fa-regular fa-heart";
    }

    if (texto) {
        texto.textContent =
            esFavorito
                ? "Guardado"
                : "Guardar";
    }

    botonFavoritoPlan.setAttribute(
        "aria-label",
        esFavorito
            ? "Eliminar ruta de favoritos"
            : "Añadir ruta a favoritos"
    );
}


function cargarEstadoFavorito() {
    const sesion =
        obtenerSesion();

    const esFavorito = Boolean(
        sesion?.conectado &&
        planEstaEnFavoritos(
            datosPlanSierraNorte.planId,
            sesion.email
        )
    );

    actualizarBotonFavorito(
        esFavorito
    );
}


function alternarFavorito() {
    const sesion =
        obtenerSesion();

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

    const favoritos =
        obtenerFavoritos();

    const posicion =
        favoritos.findIndex(
            (favorito) => {
                return (
                    favorito.planId ===
                        datosPlanSierraNorte.planId &&
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
            "La ruta se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlanSierraNorte,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacion(
            "La ruta se ha guardado en favoritos."
        );
    }

    const guardadoCorrecto =
        guardarFavoritos(
            favoritos
        );

    if (!guardadoCorrecto) {
        mostrarNotificacion(
            "No se ha podido actualizar favoritos."
        );

        return;
    }

    actualizarBotonFavorito(
        quedaGuardado
    );
}


if (botonFavoritoPlan) {
    botonFavoritoPlan.addEventListener(
        "click",
        alternarFavorito
    );
}


/* =====================================================
   PRECIO
===================================================== */

function actualizarPrecioReserva() {
    if (!personasReserva) {
        return;
    }

    const personas = Number(
        personasReserva.value || 1
    );

    const total =
        personas *
        datosPlanSierraNorte.precio;

    if (numeroPersonasDesglose) {
        numeroPersonasDesglose.textContent =
            personas;
    }

    if (precioActividad) {
        precioActividad.textContent =
            `${total} €`;
    }

    if (precioTotal) {
        precioTotal.textContent =
            `${total} €`;
    }
}


if (personasReserva) {
    personasReserva.addEventListener(
        "change",
        actualizarPrecioReserva
    );
}


/* =====================================================
   RESERVAS
===================================================== */

function obtenerTextoSeleccionado(select) {
    if (!select) {
        return "";
    }

    return (
        select.options[
            select.selectedIndex
        ]?.textContent.trim() || ""
    );
}


function obtenerFechaIsoReserva(
    fechaValor
) {
    const fechasIso = {
        "8-agosto-2026": "2026-08-08",
        "15-agosto-2026": "2026-08-15",
        "22-agosto-2026": "2026-08-22"
    };

    return (
        fechasIso[fechaValor] ||
        datosPlanSierraNorte.fechaIso ||
        ""
    );
}


function existeReserva(
    reservas,
    email,
    planId,
    fechaValor
) {
    return reservas.some(
        (reserva) => {
            return (
                reserva.usuarioEmail ===
                    email &&
                reserva.planId ===
                    planId &&
                (
                    reserva.fecha ===
                        fechaValor ||
                    reserva.fechaIso ===
                        fechaValor ||
                    reserva.fechaValor ===
                        fechaValor
                ) &&
                reserva.estado !==
                    "cancelada"
            );
        }
    );
}


if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const sesion =
                obtenerSesion();

            if (!sesion?.conectado) {
                sessionStorage.setItem(
                    "destinoDespuesLoginSuralia",
                    window.location.href
                );

                mostrarNotificacion(
                    "Debes iniciar sesión para reservar."
                );

                setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1200);

                return;
            }

            const fechaValor =
                fechaReserva?.value || "";

            const fechaTexto =
                obtenerTextoSeleccionado(
                    fechaReserva
                );

            const fechaIso =
                obtenerFechaIsoReserva(
                    fechaValor
                );

            const personas = Number(
                personasReserva?.value || 1
            );

            const total =
                personas *
                datosPlanSierraNorte.precio;

            const reservas =
                obtenerReservas();

            if (
                existeReserva(
                    reservas,
                    sesion.email,
                    datosPlanSierraNorte.planId,
                    fechaIso
                )
            ) {
                mostrarNotificacion(
                    "Ya tienes una reserva para esta fecha."
                );

                return;
            }

            const nuevaReserva = {
                id:
                    Date.now(),

                planId:
                    datosPlanSierraNorte.planId,

                titulo:
                    datosPlanSierraNorte.titulo,

                categoria:
                    datosPlanSierraNorte.categoria,

                imagen:
                    datosPlanSierraNorte.imagen,

                ubicacion:
                    datosPlanSierraNorte.ubicacion,

                enlace:
                    datosPlanSierraNorte.enlace,

                precio:
                    datosPlanSierraNorte.precio,

                precioUnitario:
                    datosPlanSierraNorte.precio,

                personas,

                precioTotal:
                    total,

                fecha:
                    fechaIso,

                fechaIso,

                fechaValor,

                fechaTexto,

                hora:
                    datosPlanSierraNorte.hora,

                estado:
                    "confirmada",

                usuarioEmail:
                    sesion.email,

                fechaReserva:
                    new Date().toISOString()
            };

            reservas.push(
                nuevaReserva
            );

            const reservaGuardada =
                guardarReservas(
                    reservas
                );

            if (!reservaGuardada) {
                mostrarNotificacion(
                    "No se ha podido guardar la reserva."
                );

                return;
            }

            mostrarNotificacion(
                "Reserva realizada correctamente."
            );

            formularioReserva.reset();
            actualizarPrecioReserva();

            setTimeout(() => {
                window.location.href =
                    "perfil.html#reservas";
            }, 900);
        }
    );
}


/* =====================================================
   MAPA
===================================================== */

function crearMapaSierraNorte() {
    const contenedorMapa =
        document.querySelector(
            "#mapa-plan"
        );

    if (!contenedorMapa) {
        return;
    }

    if (typeof L === "undefined") {
        console.error(
            "Leaflet no se ha cargado correctamente."
        );

        return;
    }

    if (contenedorMapa.dataset.mapaCreado) {
        return;
    }

    contenedorMapa.dataset.mapaCreado =
        "true";

    const coordenadas = [
        37.8728,
        -5.6192
    ];

    const mapa = L.map(
        "mapa-plan"
    ).setView(
        coordenadas,
        14
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    L.marker(
        coordenadas
    )
        .addTo(mapa)
        .bindPopup(
            `
                <strong>Área recreativa Isla Margarita</strong>
                <br>
                Constantina, Sevilla
            `
        )
        .openPopup();

    setTimeout(() => {
        mapa.invalidateSize();
    }, 250);
}





/* =====================================================
   OTROS PLANES DINÁMICOS
===================================================== */

const PLANES_RELACIONADOS_FIJOS = [
    {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.8,
        fechaTexto: "25 de julio",
        fechaIso: "2026-07-25",
        ubicacion: "Santiponce, Sevilla",
        imagen: "img/italica principal.jpg",
        enlace: "detalle-plan.html?id=italica"
    },
    {
        planId: "kayak-atardecer",
        titulo: "Kayak al atardecer",
        categoria: "aventura",
        categoriaTexto: "Aventura",
        precio: 18,
        valoracion: 4.9,
        fechaTexto: "27 de julio",
        fechaIso: "2026-07-27",
        ubicacion: "Río Guadalquivir, Sevilla",
        imagen: "img/kayak principal.jpg",
        enlace: "detalle-kayak.html"
    },
    {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 8,
        valoracion: 4.9,
        fechaTexto: "2 de agosto",
        fechaIso: "2026-08-02",
        ubicacion: "San Nicolás del Puerto",
        imagen: "img/cerro1.jpg",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },
    {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "gastronomia",
        categoriaTexto: "Gastronomía",
        precio: 25,
        valoracion: 4.6,
        fechaTexto: "3 de agosto",
        fechaIso: "2026-08-03",
        ubicacion: "Triana, Sevilla",
        imagen: "img/triana1.jpg",
        enlace: "detalle-plan.html?id=tapas-triana"
    },
    {
        planId: "sierra-norte",
        titulo: "Ruta de senderismo por la Sierra Norte",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 12,
        valoracion: 4.9,
        fechaTexto: "8 de agosto de 2026",
        fechaIso: "2026-08-08",
        ubicacion: "Constantina, Sevilla",
        imagen: "img/sierra-norte-principal.jpg",
        enlace: "detalle-sierra-norte.html"
    },
    {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.5,
        fechaTexto: "Hasta el 10 de agosto",
        fechaIso: "2026-08-10",
        ubicacion: "Centro de Sevilla",
        imagen: "img/andaluz1.jpg",
        enlace: "detalle-plan.html?id=exposicion-contemporanea"
    },
    {
        planId: "poncho-k-cartuja",
        titulo: "PONCHO K - Cartuja Center CITE",
        categoria: "musica",
        categoriaTexto: "Música",
        precio: 25,
        valoracion: 4.8,
        fechaTexto: "21 de noviembre de 2026",
        fechaIso: "2026-11-21",
        ubicacion: "Cartuja Center CITE, Sevilla",
        imagen: "img/poncho-k.jpg",
        enlace: "detalle-poncho-k.html"
    }
];


function obtenerFechaLocalISO() {
    const ahora = new Date();

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


function planRelacionadoHaPasado(
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


function escaparHTMLRelacionado(
    valor = ""
) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function barajarPlanesRelacionados(
    planes
) {
    const copia =
        [...planes];

    for (
        let indice =
            copia.length - 1;
        indice > 0;
        indice -= 1
    ) {
        const posicion =
            Math.floor(
                Math.random() *
                (indice + 1)
            );

        [
            copia[indice],
            copia[posicion]
        ] = [
            copia[posicion],
            copia[indice]
        ];
    }

    return copia;
}


function formatearPrecioRelacionado(
    precio
) {
    const cantidad =
        Number(
            precio ||
            0
        );

    if (cantidad === 0) {
        return "Gratis";
    }

    return `${cantidad
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function crearTarjetaRelacionadoHTML(
    plan
) {
    const titulo =
        escaparHTMLRelacionado(
            plan.titulo ||
            "Actividad de Suralia"
        );

    const imagen =
        escaparHTMLRelacionado(
            plan.imagen ||
            "img/placeholder-plan.jpg"
        );

    const enlace =
        escaparHTMLRelacionado(
            plan.enlace ||
            "planes.html"
        );

    const fechaTexto =
        escaparHTMLRelacionado(
            plan.fechaTexto ||
            "Fecha por confirmar"
        );

    const ubicacion =
        escaparHTMLRelacionado(
            plan.ubicacion ||
            "Ubicación por confirmar"
        );

    const categoriaTexto =
        escaparHTMLRelacionado(
            plan.categoriaTexto ||
            plan.categoria ||
            "Actividad"
        );

    const valoracion =
        Number(
            plan.valoracion ||
            0
        );

    return `
        <article
            class="tarjeta-plan"
            data-plan-id="${escaparHTMLRelacionado(
                plan.planId ||
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
                        ${formatearPrecioRelacionado(
                            plan.precio
                        )}
                    </span>

                </div>

                <div class="tarjeta-plan__contenido">

                    <div class="tarjeta-plan__meta">

                        <span>
                            <i
                                class="fa-regular fa-calendar"
                                aria-hidden="true"
                            ></i>
                            ${fechaTexto}
                        </span>

                    </div>

                    <h3>
                        ${titulo}
                    </h3>

                    <p class="tarjeta-plan__ubicacion">
                        <i
                            class="fa-solid fa-location-dot"
                            aria-hidden="true"
                        ></i>
                        ${ubicacion}
                    </p>

                    <div class="tarjeta-plan__pie">

                        <span>
                            ${categoriaTexto}
                        </span>

                        <strong>
                            ${
                                valoracion > 0
                                    ? `${String(
                                        valoracion
                                    ).replace(
                                        ".",
                                        ","
                                    )} <i class="fa-solid fa-star" aria-hidden="true"></i>`
                                    : "Nuevo"
                            }
                        </strong>

                    </div>

                </div>

            </a>

        </article>
    `;
}


async function cargarPlanesRelacionados(
    planActualId
) {
    const grid =
        document.querySelector(
            ".planes-relacionados .planes__grid"
        );

    if (!grid) {
        return;
    }

    let planesSupabase =
        [];

    const cliente =
        window.clienteSupabase;

    if (cliente) {
        try {
            const {
                data,
                error
            } = await cliente
                .from(
                    "planes"
                )
                .select(
                    `
                        id,
                        titulo,
                        categoria,
                        nombre_categoria,
                        fecha,
                        ubicacion,
                        precio,
                        imagen_url
                    `
                )
                .eq(
                    "estado",
                    "publicado"
                )
                .gte(
                    "fecha",
                    obtenerFechaLocalISO()
                );

            if (error) {
                throw error;
            }

            planesSupabase =
                (
                    Array.isArray(data)
                        ? data
                        : []
                ).map(
                    (plan) => ({
                        planId:
                            plan.id,

                        titulo:
                            plan.titulo ||
                            "Actividad de Suralia",

                        categoria:
                            plan.categoria ||
                            "",

                        categoriaTexto:
                            plan.nombre_categoria ||
                            plan.categoria ||
                            "Actividad",

                        precio:
                            Number(
                                plan.precio ||
                                0
                            ),

                        valoracion:
                            0,

                        fechaTexto:
                            plan.fecha
                                ? new Intl.DateTimeFormat(
                                    "es-ES",
                                    {
                                        day:
                                            "numeric",

                                        month:
                                            "long",

                                        year:
                                            "numeric"
                                    }
                                ).format(
                                    new Date(
                                        `${plan.fecha}T00:00:00`
                                    )
                                )
                                : "Fecha por confirmar",

                        fechaIso:
                            plan.fecha ||
                            "",

                        ubicacion:
                            plan.ubicacion ||
                            "Ubicación por confirmar",

                        imagen:
                            plan.imagen_url ||
                            "img/placeholder-plan.jpg",

                        enlace:
                            `detalle-plan.html?id=${encodeURIComponent(
                                plan.id ||
                                ""
                            )}`
                    })
                );
        } catch (error) {
            console.error(
                "No se pudieron cargar los planes relacionados:",
                error
            );
        }
    }

    const idsIncluidos =
        new Set();

    const disponibles = [
        ...PLANES_RELACIONADOS_FIJOS,
        ...planesSupabase
    ]
        .filter(
            (plan) => {
                const id =
                    String(
                        plan.planId ||
                        ""
                    );

                if (
                    !id ||
                    id ===
                    String(
                        planActualId ||
                        ""
                    ) ||
                    planRelacionadoHaPasado(
                        plan.fechaIso
                    ) ||
                    idsIncluidos.has(id)
                ) {
                    return false;
                }

                idsIncluidos.add(id);

                return true;
            }
        );

    const relacionados =
        barajarPlanesRelacionados(
            disponibles
        ).slice(
            0,
            3
        );

    if (
        relacionados.length ===
        0
    ) {
        document
            .querySelector(
                ".planes-relacionados"
            )
            ?.remove();

        return;
    }

    grid.innerHTML =
        relacionados
            .map(
                crearTarjetaRelacionadoHTML
            )
            .join("");
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
            cargarEstadoFavorito();
        }
    }
);

/* =====================================================
   CARGA INICIAL
===================================================== */

async function iniciarDetalleSierraNorte() {
    if (
        typeof window.obtenerPlanSuralia !==
        "function"
    ) {
        console.warn(
            "No se ha cargado js/datos-planes.js. Se usarán los datos del HTML."
        );
    }

    cargarEstadoFavorito();
    actualizarPrecioReserva();
    crearMapaSierraNorte();

    await cargarPlanesRelacionados(
        datosPlanSierraNorte.planId
    );
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarDetalleSierraNorte
    );
} else {
    iniciarDetalleSierraNorte();
}