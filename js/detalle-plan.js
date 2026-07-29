/* =====================================================
   DATOS DE LOS PLANES DINÁMICOS
===================================================== */

const PLANES_DETALLE = {
    italica: {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        categoriaIcono: "fa-solid fa-landmark",
        precio: 0,
        valoracion: 4.8,
        opiniones: 37,
        fechaTexto: "25 de julio",
        fechaIso: "2026-07-25",
        fechaPrincipal: "Sábado, 25 de julio",
        horario: "De 10:30 a 13:00",
        hora: "10:30",
        ubicacion: "Santiponce, Sevilla",
        direccion:
            "Conjunto Arqueológico de Itálica, avenida de Extremadura, Santiponce.",
        personasApuntadas: "24 personas apuntadas",
        tipoGrupo: "Grupo reducido",
        maxPersonas: "Máximo 30 personas",
        idioma: "Actividad en español",
        organizador: "Rutas Sevilla",
        organizadorIniciales: "RS",
        imagen: "img/italica principal.jpg",
        imagenes: [
            "img/Arquitectura histórica.jpg",
            "img/Restos arqueológicos romanos.jpg",
            "img/Ruinas del conjunto arqueológico de Itálica.jpg"
        ],
        descripcion: [
            "Descubre uno de los conjuntos arqueológicos más importantes de la antigua Hispania romana en una visita guiada por Itálica.",
            "Durante el recorrido conocerás la historia de la ciudad, sus principales edificios, el anfiteatro y las antiguas viviendas decoradas con mosaicos.",
            "La actividad está pensada para personas interesadas en la historia, la arquitectura y el patrimonio de Sevilla."
        ],
        descripcionAmpliada: [
            "El recorrido incluye explicaciones sobre la fundación de Itálica, su evolución durante el Imperio romano y la importancia de personajes como Trajano y Adriano.",
            "Se recomienda llevar calzado cómodo, agua y protección solar, especialmente durante los meses de verano."
        ],
        incluye: [
            ["si", "Guía especializado"],
            ["si", "Entrada al recinto"],
            ["si", "Recorrido de aproximadamente 2 horas y media"],
            ["si", "Explicaciones históricas"],
            ["no", "Transporte hasta Santiponce"],
            ["no", "Comida o bebida"]
        ],
        fechasReserva: [
            ["2026-07-25", "Sábado, 25 de julio"],
            ["2026-08-01", "Sábado, 1 de agosto"],
            ["2026-08-08", "Sábado, 8 de agosto"]
        ],
        coordenadas: [37.4431, -6.0448],
        zoom: 15,
        mapaTitulo: "Conjunto Arqueológico de Itálica",
        enlaceMapa:
            "https://www.google.com/maps/search/?api=1&query=Itálica+Santiponce",
        enlace: "detalle-plan.html?id=italica"
    },

    "cerro-hierro": {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        categoriaIcono: "fa-solid fa-mountain-sun",
        precio: 8,
        valoracion: 4.9,
        opiniones: 29,
        fechaTexto: "2 de agosto",
        fechaIso: "2026-08-02",
        fechaPrincipal: "Domingo, 2 de agosto",
        horario: "De 09:00 a 13:30",
        hora: "09:00",
        ubicacion: "San Nicolás del Puerto",
        direccion:
            "Monumento Natural Cerro del Hierro, San Nicolás del Puerto, Sevilla.",
        personasApuntadas: "18 personas apuntadas",
        tipoGrupo: "Grupo de senderismo",
        maxPersonas: "Máximo 25 personas",
        idioma: "Actividad en español",
        organizador: "Senderos del Sur",
        organizadorIniciales: "SS",
        imagen:
            "img/cerro1.jpg",
        imagenes: [
            "img/cerro2.jpg",
            "img/cerro3.jpg",
            "img/cerro4.jpg"
        ],
        descripcion: [
            "Recorre uno de los paisajes naturales más sorprendentes de la Sierra Norte de Sevilla.",
            "La ruta atraviesa antiguas galerías mineras, formaciones de roca caliza y senderos rodeados de vegetación mediterránea.",
            "Es una actividad pensada para disfrutar de la naturaleza a un ritmo tranquilo."
        ],
        descripcionAmpliada: [
            "La ruta tiene dificultad baja-media y se realizarán varias paradas para conocer la historia geológica y minera del entorno.",
            "Se recomienda llevar calzado de senderismo, agua, algo de comida y protección solar."
        ],
        incluye: [
            ["si", "Guía acompañante"],
            ["si", "Ruta interpretativa"],
            ["si", "Seguro de la actividad"],
            ["si", "Paradas explicativas"],
            ["no", "Transporte hasta el punto de encuentro"],
            ["no", "Comida o bebida"]
        ],
        fechasReserva: [
            ["2026-08-02", "Domingo, 2 de agosto"],
            ["2026-08-09", "Domingo, 9 de agosto"],
            ["2026-08-16", "Domingo, 16 de agosto"]
        ],
        coordenadas: [37.9537, -5.6257],
        zoom: 14,
        mapaTitulo: "Cerro del Hierro",
        enlaceMapa:
            "https://www.google.com/maps/search/?api=1&query=Cerro+del+Hierro+Sevilla",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },

    "tapas-triana": {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "gastronomia",
        categoriaTexto: "Gastronomía",
        categoriaIcono: "fa-solid fa-utensils",
        precio: 25,
        valoracion: 4.6,
        opiniones: 41,
        fechaTexto: "3 de agosto",
        fechaIso: "2026-08-03",
        fechaPrincipal: "Lunes, 3 de agosto",
        horario: "De 13:00 a 15:30",
        hora: "13:00",
        ubicacion: "Triana, Sevilla",
        direccion:
            "Punto de encuentro en la plaza del Altozano, Triana, Sevilla.",
        personasApuntadas: "16 personas apuntadas",
        tipoGrupo: "Grupo reducido",
        maxPersonas: "Máximo 18 personas",
        idioma: "Actividad en español",
        organizador: "Sabores de Sevilla",
        organizadorIniciales: "SS",
        imagen:
            "img/triana1.jpg",
        imagenes: [
            "img/triana2.jpg",
            "img/triana3.jpg",
            "img/triana4.jpg"
        ],
        descripcion: [
            "Disfruta de una selección de tapas tradicionales en varios establecimientos del barrio de Triana.",
            "La ruta combina gastronomía, historia local y algunos de los rincones más conocidos del barrio.",
            "Es una experiencia pensada para conocer sabores sevillanos en un ambiente cercano."
        ],
        descripcionAmpliada: [
            "Durante la actividad se visitarán varios bares seleccionados y se explicará el origen de algunas tapas tradicionales.",
            "Se recomienda avisar previamente en caso de alergias o intolerancias alimentarias."
        ],
        incluye: [
            ["si", "Acompañamiento durante la ruta"],
            ["si", "Selección de tapas"],
            ["si", "Una bebida en cada parada incluida"],
            ["si", "Explicaciones sobre la gastronomía local"],
            ["no", "Consumiciones adicionales"],
            ["no", "Transporte hasta Triana"]
        ],
        fechasReserva: [
            ["2026-08-03", "Lunes, 3 de agosto"],
            ["2026-08-07", "Viernes, 7 de agosto"],
            ["2026-08-10", "Lunes, 10 de agosto"]
        ],
        coordenadas: [37.3853, -6.0035],
        zoom: 16,
        mapaTitulo: "Plaza del Altozano",
        enlaceMapa:
            "https://www.google.com/maps/search/?api=1&query=Plaza+del+Altozano+Sevilla",
        enlace: "detalle-plan.html?id=tapas-triana"
    },

    "exposicion-contemporanea": {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        categoriaIcono: "fa-solid fa-palette",
        precio: 0,
        valoracion: 4.5,
        opiniones: 22,
        fechaTexto: "Hasta el 10 de agosto",
        fechaIso: "2026-08-10",
        fechaPrincipal: "Disponible hasta el 10 de agosto",
        horario: "De 11:00 a 20:00",
        hora: "11:00",
        ubicacion: "Centro de Sevilla",
        direccion:
            "Espacio cultural situado en el centro de Sevilla.",
        personasApuntadas: "31 personas interesadas",
        tipoGrupo: "Acceso por turnos",
        maxPersonas: "Aforo limitado",
        idioma: "Contenido en español",
        organizador: "Cultura Sevilla",
        organizadorIniciales: "CS",
        imagen:
            "img/andaluz1.jpg",
        imagenes: [
            "img/andaluz2.jpg",
            "img/andaluz3.jpg",
            "img/andaluz4.jpg"
        ],
        descripcion: [
            "Descubre una selección de obras de artistas emergentes en un espacio cultural sevillano.",
            "La exposición reúne pintura, fotografía, instalación y diferentes propuestas visuales contemporáneas.",
            "La visita puede realizarse libremente dentro del horario de apertura."
        ],
        descripcionAmpliada: [
            "El recorrido está organizado por salas temáticas y permite conocer diferentes formas de creación artística actual.",
            "La entrada es gratuita, aunque se recomienda reservar para controlar el aforo."
        ],
        incluye: [
            ["si", "Entrada a la exposición"],
            ["si", "Acceso a todas las salas"],
            ["si", "Información de las obras"],
            ["si", "Guardarropa sujeto a disponibilidad"],
            ["no", "Visita guiada privada"],
            ["no", "Consumiciones"]
        ],
        fechasReserva: [
            ["2026-08-01", "Sábado, 1 de agosto"],
            ["2026-08-05", "Miércoles, 5 de agosto"],
            ["2026-08-10", "Lunes, 10 de agosto"]
        ],
        coordenadas: [37.3891, -5.9845],
        zoom: 15,
        mapaTitulo: "Centro de Sevilla",
        enlaceMapa:
            "https://www.google.com/maps/search/?api=1&query=Centro+de+Sevilla",
        enlace:
            "detalle-plan.html?id=exposicion-contemporanea"
    }
};


/* =====================================================
   OBTENER PLAN DE LA URL
===================================================== */

const parametrosUrl = new URLSearchParams(
    window.location.search
);

const planIdUrl =
    parametrosUrl.get("id") || "italica";

function combinarConCatalogo(
    planDetalle
) {
    if (
        !planDetalle ||
        typeof window.obtenerPlanSuralia !==
            "function"
    ) {
        return planDetalle;
    }

    const datosCatalogo =
        window.obtenerPlanSuralia(
            planDetalle.planId
        );

    if (!datosCatalogo) {
        return planDetalle;
    }

    return {
        ...planDetalle,

        /*
           Los datos comunes del catálogo se colocan
           al final para que sean la fuente oficial.
        */
        planId:
            datosCatalogo.planId,

        titulo:
            datosCatalogo.titulo,

        categoria:
            datosCatalogo.categoria,

        categoriaTexto:
            datosCatalogo.categoriaTexto,

        precio:
            datosCatalogo.precio,

        valoracion:
            datosCatalogo.valoracion,

        fechaTexto:
            datosCatalogo.fechaTexto,

        fechaIso:
            datosCatalogo.fechaIso,

        hora:
            datosCatalogo.hora ||
            planDetalle.hora,

        ubicacion:
            datosCatalogo.ubicacion,

        imagen:
            datosCatalogo.imagen,

        enlace:
            datosCatalogo.enlace
    };
}


const planActual =
    combinarConCatalogo(
        PLANES_DETALLE[planIdUrl] ||
        PLANES_DETALLE.italica
    );


/* =====================================================
   UTILIDADES
===================================================== */

function seleccionar(selector) {
    return document.querySelector(selector);
}


function cambiarTexto(selector, texto) {
    const elemento = seleccionar(selector);

    if (elemento) {
        elemento.textContent = texto;
    }
}


function formatearPrecio(precio) {
    return Number(precio) === 0
        ? "Gratis"
        : `${Number(precio).toLocaleString(
            "es-ES"
        )} €`;
}


function obtenerDatosLocalStorage(clave) {
    try {
        return JSON.parse(
            localStorage.getItem(clave)
        ) || [];
    } catch (error) {
        console.error(
            `No se pudo leer ${clave}:`,
            error
        );

        return [];
    }
}


function guardarDatosLocalStorage(
    clave,
    datos
) {
    try {
        localStorage.setItem(
            clave,
            JSON.stringify(datos)
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


/* =====================================================
   ELEMENTOS GENERALES
===================================================== */

const botonCompartir =
    seleccionar("#boton-compartir");

const botonLeerMas =
    seleccionar("#boton-leer-mas");

const descripcionAmpliada =
    seleccionar("#descripcion-ampliada");

const formularioReserva =
    seleccionar("#formulario-reserva");

const notificacion =
    seleccionar("#notificacion");

const modalImagen =
    seleccionar("#modal-imagen");

const imagenModal =
    seleccionar("#imagen-modal");

const cerrarModalImagen =
    seleccionar("#cerrar-modal-imagen");

const botonFavoritoPlan =
    seleccionar("#boton-favorito-plan");

let temporizadorNotificacion;
let mapaPlan;
let elementoQueAbrioModalImagen = null;


/* =====================================================
   NOTIFICACIONES
===================================================== */

function mostrarNotificacion(mensaje) {
    if (!notificacion) {
        console.log(mensaje);
        return;
    }

    const textoNotificacion =
        notificacion.querySelector("span");

    if (textoNotificacion) {
        textoNotificacion.textContent =
            mensaje;
    }

    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion =
        setTimeout(() => {
            notificacion.classList.remove(
                "visible"
            );
        }, 3000);
}


/* =====================================================
   CARGAR CONTENIDO DEL PLAN
===================================================== */

function cargarDatosBasicos() {
    document.title =
        `${planActual.titulo} | Suralia`;

    cambiarTexto(
        "#miga-plan",
        planActual.titulo
    );

    cambiarTexto(
        "#detalle-categoria-texto",
        planActual.categoriaTexto
    );

    const iconoCategoria =
        seleccionar(
            "#detalle-categoria-icono"
        );

    if (iconoCategoria) {
        iconoCategoria.className =
            planActual.categoriaIcono;

        iconoCategoria.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    cambiarTexto(
        "#detalle-titulo",
        planActual.titulo
    );

    cambiarTexto(
        "#detalle-valoracion",
        String(planActual.valoracion)
            .replace(".", ",")
    );

    cambiarTexto(
        "#detalle-opiniones-texto",
        `${planActual.opiniones} opiniones`
    );

    cambiarTexto(
        "#detalle-ubicacion-cabecera",
        planActual.ubicacion
    );

    cambiarTexto(
        "#detalle-personas-apuntadas",
        planActual.personasApuntadas
    );

    cambiarTexto(
        "#organizador-avatar",
        planActual.organizadorIniciales
    );

    const avatarOrganizador =
        seleccionar("#organizador-avatar");

    avatarOrganizador?.setAttribute(
        "aria-label",
        `Avatar de ${planActual.organizador}`
    );

    cambiarTexto(
        "#organizador-nombre",
        planActual.organizador
    );

    cambiarTexto(
        "#detalle-fecha-principal",
        planActual.fechaPrincipal
    );

    cambiarTexto(
        "#detalle-horario",
        planActual.horario
    );

    cambiarTexto(
        "#detalle-tipo-grupo",
        planActual.tipoGrupo
    );

    cambiarTexto(
        "#detalle-max-personas",
        planActual.maxPersonas
    );

    cambiarTexto(
        "#detalle-idioma",
        planActual.idioma
    );

    cambiarTexto(
        "#detalle-direccion",
        planActual.direccion
    );

    cambiarTexto(
        "#opiniones-valoracion",
        String(planActual.valoracion)
            .replace(".", ",")
    );

    cambiarTexto(
        "#opiniones-total",
        `${planActual.opiniones} valoraciones`
    );

    cambiarTexto(
        "#detalle-precio",
        formatearPrecio(
            planActual.precio
        )
    );

    cambiarTexto(
        "#reserva-valoracion",
        String(planActual.valoracion)
            .replace(".", ",")
    );

    const precioTexto =
        `${Number(planActual.precio)
            .toLocaleString("es-ES")} €`;

    cambiarTexto(
        "#desglose-precio",
        precioTexto
    );

    cambiarTexto(
        "#desglose-gestion",
        "0 €"
    );

    cambiarTexto(
        "#desglose-total",
        precioTexto
    );

    const enlaceMapa =
        seleccionar("#enlace-como-llegar");

    if (enlaceMapa) {
        enlaceMapa.href =
            planActual.enlaceMapa;
    }

    const body =
        seleccionar("#detalle-plan");

    if (body) {
        body.dataset.planId =
            planActual.planId;

        body.dataset.titulo =
            planActual.titulo;

        body.dataset.categoria =
            planActual.categoria;

        body.dataset.categoriaTexto =
            planActual.categoriaTexto;

        body.dataset.precio =
            String(planActual.precio);

        body.dataset.valoracion =
            String(planActual.valoracion);

        body.dataset.fecha =
            planActual.fechaTexto;

        body.dataset.fechaIso =
            planActual.fechaIso;

        body.dataset.ubicacion =
            planActual.ubicacion;

        body.dataset.imagen =
            planActual.imagen;

        body.dataset.enlace =
            planActual.enlace;
    }
}


function cargarGaleria() {
    const configuracionGaleria = [
        {
            boton:
                "#galeria-boton-principal",
            imagen:
                "#galeria-imagen-principal"
        },
        {
            boton:
                "#galeria-boton-secundaria-1",
            imagen:
                "#galeria-imagen-secundaria-1"
        },
        {
            boton:
                "#galeria-boton-secundaria-2",
            imagen:
                "#galeria-imagen-secundaria-2"
        }
    ];

    configuracionGaleria.forEach(
        (elemento, indice) => {
            const boton =
                seleccionar(elemento.boton);

            const imagen =
                seleccionar(elemento.imagen);

            const rutaImagen =
                planActual.imagenes[indice] ||
                planActual.imagen;

            if (boton) {
                boton.dataset.imagen =
                    rutaImagen;

                boton.setAttribute(
                    "aria-label",
                    `Ampliar imagen ${
                        indice + 1
                    } de ${planActual.titulo}`
                );
            }

            if (imagen) {
                imagen.src =
                    rutaImagen;

                imagen.alt =
                    `${planActual.titulo}, imagen ${
                        indice + 1
                    }`;
            }
        }
    );
}


function cargarDescripcion() {
    const contenedor =
        seleccionar("#detalle-descripcion");

    if (contenedor) {
        contenedor.innerHTML =
            planActual.descripcion
                .map(
                    (parrafo) =>
                        `<p>${parrafo}</p>`
                )
                .join("");
    }

    if (descripcionAmpliada) {
        descripcionAmpliada.innerHTML =
            planActual.descripcionAmpliada
                .map(
                    (parrafo) =>
                        `<p>${parrafo}</p>`
                )
                .join("");
    }
}


function cargarIncluye() {
    const contenedor =
        seleccionar("#detalle-incluye");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        planActual.incluye
            .map(([tipo, texto]) => {
                const noIncluido =
                    tipo === "no";

                return `
                    <div
                        ${
                            noIncluido
                                ? 'class="no-incluido"'
                                : ""
                        }
                        role="listitem"
                    >
                        <i
                            class="fa-solid ${
                                noIncluido
                                    ? "fa-xmark"
                                    : "fa-check"
                            }"
                            aria-hidden="true"
                        ></i>
                        ${texto}
                    </div>
                `;
            })
            .join("");
}


function cargarFechasReserva() {
    const selectorFecha =
        seleccionar("#fecha-reserva");

    if (!selectorFecha) {
        return;
    }

    selectorFecha.innerHTML =
        planActual.fechasReserva
            .map(
                ([valor, texto]) =>
                    `<option value="${valor}">${texto}</option>`
            )
            .join("");
}


/* =====================================================
   MAPA DINÁMICO
===================================================== */

function cargarMapa() {
    const contenedorMapa =
        seleccionar("#mapa-plan");

    if (
        typeof L === "undefined" ||
        !contenedorMapa
    ) {
        return;
    }

    if (mapaPlan) {
        mapaPlan.remove();
    }

    mapaPlan = L.map(
        "mapa-plan",
        {
            scrollWheelZoom: false
        }
    ).setView(
        planActual.coordenadas,
        planActual.zoom
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapaPlan);

    L.marker(planActual.coordenadas)
        .addTo(mapaPlan)
        .bindPopup(
            `
                <strong>
                    ${planActual.mapaTitulo}
                </strong>
                <br>
                ${planActual.ubicacion}
            `
        )
        .openPopup();

    setTimeout(() => {
        mapaPlan.invalidateSize();
    }, 100);
}


/* =====================================================
   COMPARTIR PLAN
===================================================== */

if (botonCompartir) {
    botonCompartir.addEventListener(
        "click",
        async () => {
            const datosCompartir = {
                title:
                    `${planActual.titulo} | Suralia`,

                text:
                    `Descubre ${planActual.titulo} en Suralia.`,

                url:
                    window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(
                        datosCompartir
                    );

                    return;
                }

                if (
                    navigator.clipboard &&
                    window.isSecureContext
                ) {
                    await navigator.clipboard.writeText(
                        window.location.href
                    );
                } else {
                    const campoTemporal =
                        document.createElement(
                            "textarea"
                        );

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

                    document.execCommand(
                        "copy"
                    );

                    campoTemporal.remove();
                }

                mostrarNotificacion(
                    "El enlace se ha copiado al portapapeles."
                );
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(
                        "No se pudo compartir:",
                        error
                    );
                }
            }
        }
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

            botonLeerMas.setAttribute(
                "aria-expanded",
                String(estaVisible)
            );

            descripcionAmpliada.setAttribute(
                "aria-hidden",
                String(!estaVisible)
            );

            botonLeerMas.innerHTML =
                estaVisible
                    ? `
                        Mostrar menos
                        <i
                            class="fa-solid fa-chevron-up"
                            aria-hidden="true"
                        ></i>
                    `
                    : `
                        Leer descripción completa
                        <i
                            class="fa-solid fa-chevron-down"
                            aria-hidden="true"
                        ></i>
                    `;
        }
    );
}


/* =====================================================
   GALERÍA DE IMÁGENES
===================================================== */

document
    .querySelectorAll(
        ".galeria-plan button[data-imagen]"
    )
    .forEach((boton) => {
        boton.addEventListener(
            "click",
            () => {
                if (
                    !modalImagen ||
                    !imagenModal
                ) {
                    return;
                }

                imagenModal.src =
                    boton.dataset.imagen;

                const imagenGaleria =
                    boton.querySelector("img");

                imagenModal.alt =
                    imagenGaleria?.alt ||
                    `Imagen ampliada de ${planActual.titulo}`;

                elementoQueAbrioModalImagen =
                    boton;

                modalImagen.classList.add(
                    "visible"
                );

                modalImagen.setAttribute(
                    "aria-hidden",
                    "false"
                );

                document.body.style.overflow =
                    "hidden";

                cerrarModalImagen?.focus();
            }
        );
    });


function cerrarModal() {
    if (
        !modalImagen ||
        !imagenModal
    ) {
        return;
    }

    modalImagen.classList.remove(
        "visible"
    );

    modalImagen.setAttribute(
        "aria-hidden",
        "true"
    );

    imagenModal.src = "";
    imagenModal.alt =
        "Imagen ampliada del plan";

    document.body.style.overflow = "";

    elementoQueAbrioModalImagen?.focus();

    elementoQueAbrioModalImagen = null;
}


if (cerrarModalImagen) {
    cerrarModalImagen.addEventListener(
        "click",
        cerrarModal
    );
}


if (modalImagen) {
    modalImagen.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target === modalImagen
            ) {
                cerrarModal();
            }
        }
    );
}


function mantenerFocoEnModalImagen(
    evento
) {
    if (
        evento.key !== "Tab" ||
        !modalImagen?.classList.contains(
            "visible"
        )
    ) {
        return;
    }

    const elementosEnfocables =
        Array.from(
            modalImagen.querySelectorAll(
                `
                    button:not([disabled]),
                    a[href],
                    [tabindex]:not([tabindex="-1"])
                `
            )
        );

    if (
        elementosEnfocables.length === 0
    ) {
        return;
    }

    const primero =
        elementosEnfocables[0];

    const ultimo =
        elementosEnfocables[
            elementosEnfocables.length - 1
        ];

    if (
        evento.shiftKey &&
        document.activeElement === primero
    ) {
        evento.preventDefault();
        ultimo.focus();
    } else if (
        !evento.shiftKey &&
        document.activeElement === ultimo
    ) {
        evento.preventDefault();
        primero.focus();
    }
}


document.addEventListener(
    "keydown",
    (evento) => {
        mantenerFocoEnModalImagen(
            evento
        );

        if (
            evento.key === "Escape" &&
            modalImagen?.classList.contains(
                "visible"
            )
        ) {
            cerrarModal();
        }
    }
);


/* =====================================================
   FAVORITOS
===================================================== */

function obtenerSesion() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "sesionSuralia"
            )
        );
    } catch (error) {
        return null;
    }
}


function obtenerFavoritosGuardados() {
    return obtenerDatosLocalStorage(
        "favoritosSuralia"
    );
}


function planEstaEnFavoritos() {
    const sesion =
        obtenerSesion();

    if (!sesion?.conectado) {
        return false;
    }

    return obtenerFavoritosGuardados().some(
        (favorito) =>
            favorito.usuarioEmail ===
                sesion.email &&
            favorito.planId ===
                planActual.planId
    );
}


function actualizarBotonFavoritoDetalle() {
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

    const esFavorito =
        planEstaEnFavoritos();

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
        "aria-pressed",
        String(esFavorito)
    );

    botonFavoritoPlan.setAttribute(
        "aria-label",
        esFavorito
            ? `Eliminar ${planActual.titulo} de favoritos`
            : `Añadir ${planActual.titulo} a favoritos`
    );

    if (icono) {
        icono.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


function alternarFavoritoDetalle() {
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
        obtenerFavoritosGuardados();

    const posicion =
        favoritos.findIndex(
            (favorito) =>
                favorito.usuarioEmail ===
                    sesion.email &&
                favorito.planId ===
                    planActual.planId
        );

    if (posicion !== -1) {
        favoritos.splice(posicion, 1);

        mostrarNotificacion(
            "El plan se ha eliminado de favoritos."
        );
    } else {
        favoritos.push({
            planId:
                planActual.planId,

            titulo:
                planActual.titulo,

            categoria:
                planActual.categoriaTexto,

            imagen:
                planActual.imagen,

            fechaTexto:
                planActual.fechaTexto,

            fechaIso:
                planActual.fechaIso,

            ubicacion:
                planActual.ubicacion,

            precio:
                planActual.precio,

            valoracion:
                planActual.valoracion,

            enlace:
                planActual.enlace,

            usuarioEmail:
                sesion.email,

            fechaGuardado:
                new Date().toISOString()
        });

        mostrarNotificacion(
            "El plan se ha guardado en favoritos."
        );
    }

    const favoritoGuardado =
        guardarDatosLocalStorage(
            "favoritosSuralia",
            favoritos
        );

    if (!favoritoGuardado) {
        mostrarNotificacion(
            "No se ha podido actualizar favoritos."
        );

        return;
    }

    actualizarBotonFavoritoDetalle();
}


if (botonFavoritoPlan) {
    botonFavoritoPlan.addEventListener(
        "click",
        alternarFavoritoDetalle
    );
}


function actualizarDesgloseReserva() {
    const selectorPersonas =
        seleccionar(
            "#personas-reserva"
        );

    const numeroPersonas =
        Number(
            selectorPersonas?.value ||
            1
        );

    const precioUnitario =
        Number(
            planActual.precio ||
            0
        );

    const total =
        precioUnitario *
        (
            Number.isFinite(
                numeroPersonas
            )
                ? numeroPersonas
                : 1
        );

    cambiarTexto(
        "#desglose-precio",
        `${precioUnitario.toLocaleString(
            "es-ES"
        )} €`
    );

    cambiarTexto(
        "#desglose-gestion",
        "0 €"
    );

    cambiarTexto(
        "#desglose-total",
        `${total.toLocaleString(
            "es-ES"
        )} €`
    );
}


function marcarCampoReserva(
    campo,
    invalido
) {
    campo?.setAttribute(
        "aria-invalid",
        String(invalido)
    );
}


const selectorFechaReserva =
    seleccionar("#fecha-reserva");

const selectorPersonasReserva =
    seleccionar("#personas-reserva");

selectorFechaReserva?.setAttribute(
    "aria-invalid",
    "false"
);

selectorPersonasReserva?.setAttribute(
    "aria-invalid",
    "false"
);

selectorFechaReserva?.addEventListener(
    "change",
    () => {
        marcarCampoReserva(
            selectorFechaReserva,
            false
        );
    }
);

selectorPersonasReserva?.addEventListener(
    "change",
    () => {
        marcarCampoReserva(
            selectorPersonasReserva,
            false
        );

        actualizarDesgloseReserva();
    }
);


/* =====================================================
   RESERVAS
===================================================== */

if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const sesionActual =
                obtenerSesion();

            if (!sesionActual?.conectado) {
                sessionStorage.setItem(
                    "destinoDespuesLoginSuralia",
                    window.location.href
                );

                mostrarNotificacion(
                    "Debes iniciar sesión para reservar una plaza."
                );

                setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1200);

                return;
            }

            const selectorFecha =
                seleccionar("#fecha-reserva");

            const selectorPersonas =
                seleccionar(
                    "#personas-reserva"
                );

            if (
                !selectorFecha ||
                !selectorPersonas
            ) {
                mostrarNotificacion(
                    "No se ha podido completar la reserva."
                );

                return;
            }

            const fechaSeleccionada =
                selectorFecha.value;

            const textoFecha =
                selectorFecha.options[
                    selectorFecha.selectedIndex
                ]?.text || "";

            const numeroPersonas =
                Number(
                    selectorPersonas.value
                );

            if (!fechaSeleccionada) {
                marcarCampoReserva(
                    selectorFecha,
                    true
                );

                mostrarNotificacion(
                    "Selecciona una fecha."
                );

                selectorFecha.focus();

                return;
            }

            marcarCampoReserva(
                selectorFecha,
                false
            );

            if (
                !Number.isInteger(
                    numeroPersonas
                ) ||
                numeroPersonas < 1
            ) {
                marcarCampoReserva(
                    selectorPersonas,
                    true
                );

                mostrarNotificacion(
                    "Selecciona el número de personas."
                );

                selectorPersonas.focus();

                return;
            }

            marcarCampoReserva(
                selectorPersonas,
                false
            );

            const reservasGuardadas =
                obtenerDatosLocalStorage(
                    "reservasSuralia"
                );

            const reservaExistente =
                reservasGuardadas.some(
                    (reserva) =>
                        reserva.usuarioEmail ===
                            sesionActual.email &&
                        reserva.planId ===
                            planActual.planId &&
                        (
                            reserva.fecha ===
                                fechaSeleccionada ||
                            reserva.fechaIso ===
                                fechaSeleccionada ||
                            reserva.fechaValor ===
                                fechaSeleccionada
                        ) &&
                        reserva.estado !==
                            "cancelada"
                );

            if (reservaExistente) {
                mostrarNotificacion(
                    "Ya tienes una reserva para esta actividad y fecha."
                );

                return;
            }

            const nuevaReserva = {
                id:
                    Date.now(),

                planId:
                    planActual.planId,

                titulo:
                    planActual.titulo,

                categoria:
                    planActual.categoriaTexto,

                imagen:
                    planActual.imagen,

                fecha:
                    fechaSeleccionada,

                fechaIso:
                    fechaSeleccionada,

                fechaTexto:
                    textoFecha,

                hora:
                    planActual.hora,

                personas:
                    numeroPersonas,

                ubicacion:
                    planActual.ubicacion,

                precio:
                    planActual.precio,

                precioUnitario:
                    planActual.precio,

                precioTotal:
                    planActual.precio *
                    numeroPersonas,

                enlace:
                    planActual.enlace,

                estado:
                    "confirmada",

                usuarioEmail:
                    sesionActual.email,

                fechaReserva:
                    new Date().toISOString()
            };

            reservasGuardadas.push(
                nuevaReserva
            );

            const reservaGuardada =
                guardarDatosLocalStorage(
                    "reservasSuralia",
                    reservasGuardadas
                );

            if (!reservaGuardada) {
                mostrarNotificacion(
                    "No se ha podido guardar la reserva."
                );

                return;
            }

            mostrarNotificacion(
                `Reserva confirmada para ${numeroPersonas} ${
                    numeroPersonas === 1
                        ? "persona"
                        : "personas"
                }.`
            );

            setTimeout(() => {
                window.location.href =
                    "perfil.html#reservas";
            }, 1400);
        }
    );
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
            actualizarBotonFavoritoDetalle();
        }
    }
);


/* =====================================================
   INICIALIZACIÓN
===================================================== */

if (
    typeof window.obtenerPlanSuralia !==
    "function"
) {
    console.warn(
        "No se ha cargado js/datos-planes.js. Se usarán los datos internos del detalle."
    );
}

cargarDatosBasicos();
cargarGaleria();
cargarDescripcion();
cargarIncluye();
cargarFechasReserva();
cargarMapa();
actualizarDesgloseReserva();
actualizarBotonFavoritoDetalle();

descripcionAmpliada?.setAttribute(
    "aria-hidden",
    descripcionAmpliada.classList.contains(
        "visible"
    )
        ? "false"
        : "true"
);

modalImagen?.setAttribute(
    "aria-hidden",
    modalImagen.classList.contains(
        "visible"
    )
        ? "false"
        : "true"
);