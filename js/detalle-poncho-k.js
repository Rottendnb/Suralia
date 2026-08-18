/* =====================================================
   DATOS DEL PLAN
===================================================== */

function obtenerDatosOficialesPonchoK() {
    if (
        typeof window.obtenerPlanSuralia !==
        "function"
    ) {
        return null;
    }

    return window.obtenerPlanSuralia(
        "poncho-k-cartuja"
    );
}


const datosCatalogoPonchoK =
    obtenerDatosOficialesPonchoK();


const datosPlanPonchoK = {
    planId:
        datosCatalogoPonchoK?.planId ||
        document.body.dataset.planId ||
        "poncho-k-cartuja",

    titulo:
        datosCatalogoPonchoK?.titulo ||
        document.body.dataset.planTitulo ||
        "PONCHO K - Cartuja Center CITE",

    categoria:
        datosCatalogoPonchoK?.categoriaTexto ||
        document.body.dataset.planCategoria ||
        "Música",

    imagen:
        datosCatalogoPonchoK?.imagen ||
        document.body.dataset.planImagen ||
        "img/poncho-k.jpg",

    precio:
        Number(
            datosCatalogoPonchoK?.precio ??
            document.body.dataset.planPrecio ??
            25
        ),

    valoracion:
        Number(
            datosCatalogoPonchoK?.valoracion ??
            document.body.dataset.planValoracion ??
            4.8
        ),

    fechaTexto:
        datosCatalogoPonchoK?.fechaTexto ||
        document.body.dataset.planFecha ||
        "21 de noviembre de 2026",

    fechaIso:
        datosCatalogoPonchoK?.fechaIso ||
        document.body.dataset.planFechaIso ||
        "2026-11-21",

    hora:
        datosCatalogoPonchoK?.hora ||
        "21:00",

    ubicacion:
        datosCatalogoPonchoK?.ubicacion ||
        document.body.dataset.planUbicacion ||
        "Cartuja Center CITE, Sevilla",

    enlace:
        datosCatalogoPonchoK?.enlace ||
        document.body.dataset.planEnlace ||
        "detalle-poncho-k.html"
};


/*
   El plan conserva su ID histórico "poncho-k-cartuja"
   para favoritos, catálogo y enlaces antiguos.

   Las reservas usan el UUID real de public.planes.
*/
const PLAN_SUPABASE_ID_PONCHO_K =
    document.body.dataset.planSupabaseId ||
    "b3039583-9882-4877-ac4a-5a713393f495";


/* =====================================================
   ELEMENTOS DE LA PÁGINA
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

function leerLocalStorage(clave, valorAlternativo) {
    try {
        const contenido = localStorage.getItem(clave);

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
    const favoritos = leerLocalStorage(
        "favoritosSuralia",
        []
    );

    return Array.isArray(favoritos)
        ? favoritos
        : [];
}


function obtenerReservas() {
    const reservas = leerLocalStorage(
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
   LEER DESCRIPCIÓN COMPLETA
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
   GALERÍA DE IMÁGENES
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
                    datosPlanPonchoK.titulo,

                text:
                    `Descubre ${datosPlanPonchoK.titulo} en Suralia.`,

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
            ? "Eliminar plan de favoritos"
            : "Añadir plan a favoritos"
    );
}


function cargarEstadoFavorito() {
    const sesion =
        obtenerSesion();

    const esFavorito = Boolean(
        sesion?.conectado &&
        planEstaEnFavoritos(
            datosPlanPonchoK.planId,
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
                        datosPlanPonchoK.planId &&
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
            "El concierto se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            ...datosPlanPonchoK,

            id:
                Date.now(),

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        quedaGuardado = true;

        mostrarNotificacion(
            "El concierto se ha guardado en favoritos."
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
   CÁLCULO DEL PRECIO
===================================================== */

function actualizarPrecioReserva() {
    if (!personasReserva) {
        return;
    }

    const numeroEntradas = Number(
        personasReserva.value || 1
    );

    const total =
        numeroEntradas *
        datosPlanPonchoK.precio;

    if (numeroPersonasDesglose) {
        numeroPersonasDesglose.textContent =
            numeroEntradas;
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
   RESERVAS · SUPABASE
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
        "21-noviembre-2026":
            "2026-11-21"
    };

    return (
        fechasIso[fechaValor] ||
        datosPlanPonchoK.fechaIso ||
        ""
    );
}


function limpiarReservaLegacyPonchoK(
    emailUsuario
) {
    if (!emailUsuario) {
        return;
    }

    const reservas =
        obtenerReservas();

    const reservasLimpias =
        reservas.filter(
            (reserva) => {
                const esPonchoK =
                    String(
                        reserva?.planId ||
                        ""
                    ) ===
                    "poncho-k-cartuja";

                const esDelUsuario =
                    String(
                        reserva?.usuarioEmail ||
                        ""
                    ).toLowerCase() ===
                    String(
                        emailUsuario
                    ).toLowerCase();

                return !(
                    esPonchoK &&
                    esDelUsuario
                );
            }
        );

    if (
        reservasLimpias.length !==
        reservas.length
    ) {
        guardarReservas(
            reservasLimpias
        );
    }
}


function obtenerMensajeErrorReservaPonchoK(
    error
) {
    const mensaje =
        String(
            error?.message ||
            error ||
            ""
        );

    if (
        mensaje.includes(
            "Ya tienes una reserva activa"
        )
    ) {
        return "Ya tienes una reserva para este concierto.";
    }

    if (
        mensaje.includes(
            "Solo quedan"
        ) ||
        mensaje.includes(
            "agotado"
        )
    ) {
        return mensaje;
    }

    if (
        mensaje.includes(
            "número de personas"
        )
    ) {
        return "Puedes reservar entre 1 y 4 entradas.";
    }

    if (
        mensaje.includes(
            "plan no está disponible"
        )
    ) {
        return "Este concierto no está disponible para reservar.";
    }

    return "No se ha podido completar la reserva. Inténtalo de nuevo.";
}


if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            const cliente =
                window.clienteSupabase;

            if (!cliente?.auth) {
                mostrarNotificacion(
                    "No se ha podido conectar con el sistema de reservas."
                );

                return;
            }

            const botonReservar =
                formularioReserva.querySelector(
                    'button[type="submit"]'
                );

            const textoBotonOriginal =
                botonReservar?.textContent ||
                "Reservar entradas";

            try {
                const {
                    data: datosSesion,
                    error: errorSesion
                } = await cliente.auth.getSession();

                if (errorSesion) {
                    throw errorSesion;
                }

                const usuario =
                    datosSesion?.session?.user;

                if (!usuario) {
                    sessionStorage.setItem(
                        "destinoDespuesLoginSuralia",
                        window.location.href
                    );

                    mostrarNotificacion(
                        "Debes iniciar sesión para reservar entradas."
                    );

                    setTimeout(() => {
                        window.location.href =
                            "login.html";
                    }, 1200);

                    return;
                }

                const fechaValor =
                    fechaReserva?.value ||
                    "";

                const fechaIso =
                    obtenerFechaIsoReserva(
                        fechaValor
                    );

                const entradas =
                    Number(
                        personasReserva?.value ||
                        1
                    );

                if (
                    !fechaIso ||
                    !datosPlanPonchoK.hora
                ) {
                    mostrarNotificacion(
                        "Selecciona una fecha válida para reservar."
                    );

                    return;
                }

                if (
                    !Number.isInteger(
                        entradas
                    ) ||
                    entradas < 1 ||
                    entradas > 4
                ) {
                    mostrarNotificacion(
                        "Puedes reservar entre 1 y 4 entradas."
                    );

                    return;
                }

                if (botonReservar) {
                    botonReservar.disabled =
                        true;

                    botonReservar.textContent =
                        "Reservando...";
                }

                const {
                    data,
                    error
                } = await cliente.rpc(
                    "crear_reserva_plan",
                    {
                        p_plan_id:
                            PLAN_SUPABASE_ID_PONCHO_K,

                        p_fecha:
                            fechaIso,

                        p_hora:
                            datosPlanPonchoK.hora,

                        p_personas:
                            entradas
                    }
                );

                if (error) {
                    throw error;
                }

                const respuesta =
                    Array.isArray(data)
                        ? data[0]
                        : data;

                if (
                    !respuesta ||
                    respuesta.ok !== true
                ) {
                    throw new Error(
                        "No se ha podido confirmar la reserva."
                    );
                }

                /*
                    El perfil ya lee las reservas reales
                    desde public.reservas. Eliminamos únicamente
                    una posible reserva antigua de Poncho K que
                    hubiera quedado en localStorage para evitar
                    que se muestre duplicada.
                */
                limpiarReservaLegacyPonchoK(
                    usuario.email ||
                    ""
                );

                mostrarNotificacion(
                    "Entradas reservadas correctamente."
                );

                formularioReserva.reset();
                actualizarPrecioReserva();

                setTimeout(() => {
                    window.location.href =
                        "perfil.html#reservas";
                }, 900);
            } catch (error) {
                console.error(
                    "No se pudo crear la reserva de Poncho K:",
                    error
                );

                mostrarNotificacion(
                    obtenerMensajeErrorReservaPonchoK(
                        error
                    )
                );
            } finally {
                if (botonReservar) {
                    botonReservar.disabled =
                        false;

                    botonReservar.textContent =
                        textoBotonOriginal.trim();
                }
            }
        }
    );
}


/* =====================================================
   MAPA DE CARTUJA CENTER CITE
===================================================== */

function crearMapaPonchoK() {
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

    /*
        Evita que Leaflet cree dos mapas si el script
        se ejecuta más de una vez.
    */

    if (contenedorMapa.dataset.mapaCreado) {
        return;
    }

    contenedorMapa.dataset.mapaCreado =
        "true";

    const coordenadas = [
        37.4073,
        -6.0088
    ];

    const mapa = L.map(
        "mapa-plan"
    ).setView(
        coordenadas,
        16
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
                <strong>Cartuja Center CITE</strong>
                <br>
                PONCHO K
                <br>
                21 de noviembre de 2026
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

async function iniciarDetallePonchoK() {
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
    crearMapaPonchoK();

    await cargarPlanesRelacionados(
        datosPlanPonchoK.planId
    );
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarDetallePonchoK
    );
} else {
    iniciarDetallePonchoK();
}