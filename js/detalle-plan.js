/* =====================================================
   DATOS DE LOS PLANES DINÁMICOS
===================================================== */

/* =====================================================
   OBTENER PLAN DE LA URL
===================================================== */

const parametrosUrl = new URLSearchParams(
    window.location.search
);

const planIdUrl =
    String(
        parametrosUrl.get("id") ||
        ""
    ).trim();

let planActual = null;


/* =====================================================
   PLANES PUBLICADOS DESDE SUPABASE
===================================================== */

function esUuidPlan(valor) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(String(valor || ""));
}

function obtenerInicialesOrganizador(nombre = "") {
    const partes = String(nombre)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    return (
        partes
            .slice(0, 2)
            .map((parte) => parte.charAt(0))
            .join("")
            .toUpperCase() ||
        "SU"
    );
}

function formatearFechaDetalleSupabase(fechaIso) {
    if (!fechaIso) {
        return "Fecha por confirmar";
    }

    const fecha = new Date(`${fechaIso}T00:00:00`);

    if (Number.isNaN(fecha.getTime())) {
        return fechaIso;
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(fecha);
}


function obtenerHoyLocalIso() {
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


function fechaPlanHaPasado(
    fechaValor
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

    /*
        Si no hay una fecha ISO válida, no la tratamos como
        caducada automáticamente.
    */
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            fecha
        )
    ) {
        return false;
    }

    /*
        Se compara solo el día, no la hora:
        un plan de hoy sigue siendo reservable durante todo el día.
    */
    return fecha <
        obtenerHoyLocalIso();
}


function normalizarHoraPlan(
    valor
) {
    const texto =
        String(
            valor ||
            ""
        ).trim();

    if (!texto) {
        return "";
    }

    return texto.slice(
        0,
        5
    );
}


function crearFechasReservaSupabase(
    plan
) {
    const resultado =
        [];

    const claves =
        new Set();

    const anadirFecha = (
        fechaValor,
        horaValor = "",
        plazasValor = null
    ) => {
        const fechaLimpia =
            String(
                fechaValor ||
                ""
            ).trim();

        const horaLimpia =
            normalizarHoraPlan(
                horaValor
            );

        if (!fechaLimpia) {
            return;
        }

        /*
            Las fechas anteriores a hoy desaparecen del detalle
            y nunca llegan al selector de reserva.
        */
        if (
            fechaPlanHaPasado(
                fechaLimpia
            )
        ) {
            return;
        }

        const clave =
            `${fechaLimpia}|${horaLimpia}`;

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

        const fechaTexto =
            formatearFechaDetalleSupabase(
                fechaLimpia
            );

        const texto =
            horaLimpia
                ? `${fechaTexto} · ${horaLimpia}`
                : fechaTexto;

        const plazasNumero =
            Number(
                plazasValor
            );

        resultado.push({
            valor:
                horaLimpia
                    ? `${fechaLimpia}T${horaLimpia}`
                    : fechaLimpia,
            fecha:
                fechaLimpia,
            hora:
                horaLimpia,
            plazas:
                Number.isFinite(
                    plazasNumero
                ) &&
                plazasNumero > 0
                    ? Math.floor(
                        plazasNumero
                    )
                    : null,
            texto
        });
    };

    if (plan?.fecha) {
        anadirFecha(
            plan.fecha,
            plan.hora,
            plan.plazas
        );
    }

    if (
        Array.isArray(
            plan?.fechas
        )
    ) {
        plan.fechas.forEach(
            (
                item
            ) => {
                if (
                    typeof item ===
                    "string"
                ) {
                    anadirFecha(
                        item,
                        plan.hora,
                        null
                    );

                    return;
                }

                anadirFecha(
                    item?.fecha,
                    item?.hora ||
                        plan.hora,
                    item?.plazas
                );
            }
        );
    }

    resultado.sort(
        (
            a,
            b
        ) => {
            const claveA =
                `${a.fecha}T${a.hora || "00:00"}`;

            const claveB =
                `${b.fecha}T${b.hora || "00:00"}`;

            return claveA.localeCompare(
                claveB
            );
        }
    );

    return resultado;
}


function normalizarOpcionFechaReserva(
    item
) {
    if (
        Array.isArray(
            item
        )
    ) {
        const valor =
            String(
                item[0] ||
                ""
            );

        const texto =
            String(
                item[1] ||
                valor
            );

        return {
            valor,
            fecha:
                /^\d{4}-\d{2}-\d{2}$/.test(
                    valor
                )
                    ? valor
                    : (
                        planActual?.fechaIso ||
                        valor
                    ),
            hora:
                normalizarHoraPlan(
                    planActual?.hora
                ),
            plazas:
                null,
            texto
        };
    }

    if (
        item &&
        typeof item ===
            "object"
    ) {
        const plazasNumero =
            Number(
                item.plazas
            );

        return {
            valor:
                String(
                    item.valor ||
                    item.fecha ||
                    ""
                ),
            fecha:
                String(
                    item.fecha ||
                    ""
                ),
            hora:
                normalizarHoraPlan(
                    item.hora
                ),
            plazas:
                Number.isFinite(
                    plazasNumero
                ) &&
                plazasNumero > 0
                    ? Math.floor(
                        plazasNumero
                    )
                    : null,
            texto:
                String(
                    item.texto ||
                    item.fecha ||
                    ""
                )
        };
    }

    return null;
}


function obtenerOpcionesFechasReserva() {
    const fechas =
        Array.isArray(
            planActual?.fechasReserva
        )
            ? planActual.fechasReserva
            : [];

    return fechas
        .map(
            normalizarOpcionFechaReserva
        )
        .filter(
            (
                item
            ) =>
                item &&
                item.valor &&
                !fechaPlanHaPasado(
                    item.fecha
                )
        );
}


function crearPlanDetalleDesdeSupabase(plan, perfil) {
    const nombreOrganizador =
        perfil?.nombre_visible ||
        "Usuario de Suralia";

    const fechaTexto =
        formatearFechaDetalleSupabase(plan.fecha);

    const hora =
        plan.hora
            ? String(plan.hora).slice(0, 5)
            : "Hora por confirmar";

    const duracion =
        plan.duracion ||
        "Duración por confirmar";

    const dificultad =
        plan.dificultad ||
        "No indicada";

    const plazas =
        Number(plan.plazas || 0);

    const categoriaTexto =
        plan.nombre_categoria ||
        plan.categoria ||
        "Actividad";

    const esMusica =
        String(
            plan.categoria ||
            ""
        ).toLowerCase() ===
            "musica";

    const detallesExtra =
        plan.detalles_extra &&
        typeof plan.detalles_extra === "object" &&
        !Array.isArray(plan.detalles_extra)
            ? plan.detalles_extra
            : {};

    const tipoEvento =
        String(
            detallesExtra.tipo_evento ||
            ""
        ).trim();

    const artistaCartel =
        String(
            detallesExtra.artista_cartel ||
            ""
        ).trim();

    const aperturaPuertas =
        normalizarHoraPlan(
            detallesExtra.apertura_puertas
        );

    const horaFin =
        normalizarHoraPlan(
            detallesExtra.hora_fin
        );

    const edadMinima =
        String(
            detallesExtra.edad_minima ||
            "Todos los públicos"
        ).trim();

    const tipoEntrada =
        String(
            detallesExtra.tipo_entrada ||
            "General"
        ).trim();

    const iconos = {
        cultura: "fa-solid fa-landmark",
        naturaleza: "fa-solid fa-leaf",
        musica: "fa-solid fa-music",
        gastronomia: "fa-solid fa-utensils",
        aventura: "fa-solid fa-person-hiking",
        talleres: "fa-solid fa-screwdriver-wrench"
    };

    const descripcion = String(
        plan.descripcion ||
        "El organizador todavía no ha añadido una descripción detallada."
    )
        .split(/\n+/)
        .map((parrafo) => parrafo.trim())
        .filter(Boolean);

    const imagen =
        plan.imagen_url ||
        "img/placeholder-plan.jpg";

    const municipio =
        String(
            plan.municipio ||
            ""
        ).trim();

    const provincia =
        String(
            plan.provincia ||
            "Sevilla"
        ).trim();

    const direccion =
        String(
            plan.direccion ||
            ""
        ).trim();

    const ubicacionCabecera =
        municipio
            ? `${municipio}${
                provincia
                    ? `, ${provincia}`
                    : ""
            }`
            : (
                plan.ubicacion ||
                direccion ||
                "Ubicación por confirmar"
            );

    const ubicacionMapa =
        direccion
            ? [
                direccion,
                municipio,
                provincia
            ]
                .filter(Boolean)
                .join(", ")
            : ubicacionCabecera;

    const latitud =
        Number(
            plan.latitud
        );

    const longitud =
        Number(
            plan.longitud
        );

    const tieneCoordenadas =
        Number.isFinite(
            latitud
        ) &&
        Number.isFinite(
            longitud
        );

    const coordenadas =
        tieneCoordenadas
            ? [
                latitud,
                longitud
            ]
            : null;

    const destinoGoogleMaps =
        tieneCoordenadas
            ? `${latitud},${longitud}`
            : ubicacionMapa;

    const fechasReserva =
        crearFechasReservaSupabase(
            plan
        );

    /*
        Si el plan tenía varias fechas y la principal ya pasó,
        mostramos como fecha principal la siguiente disponible.
    */
    const primeraFechaVigente =
        fechasReserva[0] ||
        null;

    const fechaPrincipalIso =
        primeraFechaVigente?.fecha ||
        plan.fecha ||
        "";

    const fechaPrincipalTexto =
        primeraFechaVigente
            ? formatearFechaDetalleSupabase(
                primeraFechaVigente.fecha
            )
            : fechaTexto;

    const horaPrincipal =
        primeraFechaVigente?.hora ||
        (
            hora === "Hora por confirmar"
                ? ""
                : hora
        );

    let descripcionAmpliada;
    let incluye;

    if (esMusica) {
        descripcionAmpliada = [
            duracion !== "Duración por confirmar"
                ? `Duración aproximada: ${duracion}.`
                : "",
            aperturaPuertas
                ? `Apertura de puertas: ${aperturaPuertas}.`
                : "",
            horaFin
                ? `Finalización aproximada: ${horaFin}.`
                : ""
        ].filter(Boolean);

        if (descripcionAmpliada.length === 0) {
            descripcionAmpliada = [
                "Consulta la información principal del evento y las condiciones de acceso antes de asistir."
            ];
        }

        incluye = [
            [
                "si",
                tipoEvento ||
                    "Evento musical"
            ],
            [
                "si",
                artistaCartel
                    ? `Artista o cartel: ${artistaCartel}`
                    : "Artista o cartel por confirmar"
            ],
            [
                "si",
                `Acceso: ${edadMinima || "Todos los públicos"}`
            ],
            [
                "si",
                `Tipo de entrada: ${tipoEntrada || "General"}`
            ]
        ];
    } else {
        descripcionAmpliada = [
            `Duración: ${duracion}.`,
            `Dificultad: ${dificultad}.`
        ];

        incluye = [
            ["si", `Duración aproximada: ${duracion}`],
            ["si", `Dificultad: ${dificultad}`],
            [
                "si",
                fechasReserva.length > 1
                    ? "Plazas independientes según fecha o pase"
                    : (
                        plazas > 0
                            ? `${plazas} plazas disponibles inicialmente`
                            : "Plazas por confirmar"
                    )
            ],
            [
                "si",
                `Provincia: ${plan.provincia || "Sevilla"}`
            ]
        ];
    }

    return {
        planId: plan.id,
        titulo: plan.titulo || "Actividad de Suralia",
        categoria: plan.categoria || "",
        categoriaTexto,
        categoriaIcono:
            iconos[plan.categoria] ||
            "fa-solid fa-compass",
        precio: Number(plan.precio || 0),
        valoracion: 0,
        opiniones: 0,
        fechaTexto:
            fechaPrincipalTexto,
        fechaIso:
            fechaPrincipalIso,
        fechaPrincipal:
            fechaPrincipalTexto,
        horario:
            horaPrincipal
                ? (
                    esMusica
                        ? `Inicio: ${horaPrincipal}`
                        : `Hora de inicio: ${horaPrincipal}`
                )
                : "Hora por confirmar",
        hora:
            horaPrincipal,
        ubicacion: ubicacionCabecera,
        direccion:
            direccion ||
            ubicacionCabecera,
        personasApuntadas:
            esMusica
                ? "Evento recién publicado"
                : "Actividad recién publicada",
        tipoGrupo:
            esMusica
                ? (
                    tipoEvento ||
                    "Evento musical"
                )
                : (
                    dificultad === "No indicada"
                        ? "Actividad abierta"
                        : `Dificultad: ${dificultad}`
                ),
        maxPersonas:
            esMusica
                ? (
                    fechasReserva.length > 1
                        ? "Entradas según fecha o pase"
                        : (
                            plazas > 0
                                ? `Aforo indicado: ${plazas} entradas`
                                : "Aforo por confirmar"
                        )
                )
                : (
                    fechasReserva.length > 1
                        ? "Plazas según fecha o pase"
                        : (
                            plazas > 0
                                ? `Máximo ${plazas} ${
                                    plazas === 1
                                        ? "persona"
                                        : "personas"
                                }`
                                : "Plazas por confirmar"
                        )
                ),
        idioma:
            esMusica
                ? (
                    edadMinima ||
                    "Todos los públicos"
                )
                : "Actividad en español",
        organizador: nombreOrganizador,
        organizadorIniciales:
            obtenerInicialesOrganizador(
                nombreOrganizador
            ),
        imagen,
        imagenes: [
            imagen,
            plan.imagen_2_url || imagen,
            plan.imagen_3_url ||
                plan.imagen_2_url ||
                imagen
        ],
        descripcion:
            descripcion.length > 0
                ? descripcion
                : [
                    "El organizador todavía no ha añadido una descripción detallada."
                ],
        descripcionAmpliada,
        incluye,
        fechasReserva,
        coordenadas,
        zoom:
            tieneCoordenadas
                ? 16
                : 12,
        mapaTitulo:
            direccion ||
            ubicacionCabecera,
        enlaceMapa:
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                destinoGoogleMaps
            )}`,
        enlace:
            `detalle-plan.html?id=${encodeURIComponent(
                plan.id
            )}`,

        enlaceReserva:
            String(
                plan.enlace_reserva ||
                ""
            ).trim(),

        esPlanSupabase: true,
        fotoOrganizador:
            perfil?.foto_principal_url || "",

        esMusica,
        detallesExtra,
        detallesMusica: {
            tipoEvento,
            artistaCartel,
            aperturaPuertas,
            horaInicio:
                hora === "Hora por confirmar"
                    ? ""
                    : hora,
            horaFin,
            edadMinima:
                edadMinima ||
                "Todos los públicos",
            tipoEntrada:
                tipoEntrada ||
                "General"
        }
    };
}

async function cargarPlanSupabaseDetalle() {
    if (!esUuidPlan(planIdUrl)) {
        return null;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        throw new Error(
            "Supabase no está disponible."
        );
    }

    const {
        data: plan,
        error: errorPlan
    } = await cliente
        .from("planes")
        .select(`
            id,
            usuario_id,
            titulo,
            categoria,
            nombre_categoria,
            descripcion,
            fecha,
            hora,
            fechas,
            detalles_extra,
            duracion,
            plazas,
            ubicacion,
            municipio,
            direccion,
            latitud,
            longitud,
            precio,
            dificultad,
            provincia,
            enlace_reserva,
            imagen_url,
            imagen_2_url,
            imagen_3_url,
            estado
        `)
        .eq("id", planIdUrl)
        .eq("estado", "publicado")
        .maybeSingle();

    if (errorPlan) {
        throw errorPlan;
    }

    if (!plan) {
        return null;
    }

    let perfil = null;

    if (plan.usuario_id) {
        const {
            data: datosPerfil,
            error: errorPerfil
        } = await cliente
            .from("perfiles_sociales")
            .select(`
                nombre_visible,
                foto_principal_url
            `)
            .eq("usuario_id", plan.usuario_id)
            .maybeSingle();

        if (!errorPerfil) {
            perfil = datosPerfil;
        }
    }

    return crearPlanDetalleDesdeSupabase(
        plan,
        perfil
    );
}

function mostrarPlanFinalizado() {
    document.title =
        "Plan finalizado | Suralia";

    cambiarTexto(
        "#miga-plan",
        "Plan finalizado"
    );

    cambiarTexto(
        "#detalle-titulo",
        "Este plan ya ha finalizado"
    );

    cambiarTexto(
        "#detalle-ubicacion-cabecera",
        "La fecha de este plan ya ha pasado."
    );

    const contenido =
        seleccionar(
            ".detalle-contenido"
        );

    if (contenido) {
        contenido.innerHTML = `
            <div class="contenedor">
                <section class="bloque-detalle">
                    <h2>Este plan ya no está disponible</h2>

                    <p>
                        Todas las fechas de este plan ya han pasado,
                        por lo que no es posible realizar una reserva.
                    </p>

                    <a
                        href="planes.html"
                        class="boton-principal"
                    >
                        Ver planes disponibles
                    </a>
                </section>
            </div>
        `;
    }

    seleccionar(
        ".galeria-plan"
    )?.remove();

    seleccionar(
        ".planes-relacionados"
    )?.remove();
}


function mostrarPlanNoEncontrado() {
    document.title =
        "Plan no encontrado | Suralia";

    cambiarTexto(
        "#miga-plan",
        "Plan no encontrado"
    );

    cambiarTexto(
        "#detalle-titulo",
        "Este plan no está disponible"
    );

    cambiarTexto(
        "#detalle-ubicacion-cabecera",
        "Puede haberse eliminado o no estar publicado."
    );

    const contenido =
        seleccionar(".detalle-contenido");

    if (contenido) {
        contenido.innerHTML = `
            <div class="contenedor">
                <section class="bloque-detalle">
                    <h2>No hemos encontrado este plan</h2>

                    <p>
                        El plan puede haber sido eliminado,
                        rechazado o todavía no estar publicado.
                    </p>

                    <a
                        href="planes.html"
                        class="boton-principal"
                    >
                        Volver a explorar planes
                    </a>
                </section>
            </div>
        `;
    }

    seleccionar(".galeria-plan")?.remove();
    seleccionar(".planes-relacionados")?.remove();
}


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


function marcarDetalleComoListo() {
    const body =
        seleccionar("#detalle-plan");

    if (body) {
        body.dataset.detalleListo =
            "true";
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

const botonReservarPlan =
    formularioReserva?.querySelector(
        ".boton-reservar"
    );

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
        Number(planActual.valoracion || 0) > 0
            ? String(planActual.valoracion).replace(".", ",")
            : "Nuevo"
    );

    cambiarTexto(
        "#detalle-opiniones-texto",
        Number(planActual.opiniones || 0) > 0
            ? `${planActual.opiniones} opiniones`
            : "Sin opiniones todavía"
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

    if (avatarOrganizador) {
        avatarOrganizador.setAttribute(
            "aria-label",
            `Avatar de ${planActual.organizador}`
        );

        if (planActual.fotoOrganizador) {
            avatarOrganizador.textContent = "";
            avatarOrganizador.style.backgroundImage =
                `url('${planActual.fotoOrganizador}')`;
            avatarOrganizador.style.backgroundSize =
                "cover";
            avatarOrganizador.style.backgroundPosition =
                "center";
        } else {
            avatarOrganizador.style.backgroundImage =
                "";
        }
    }

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
        Number(planActual.valoracion || 0) > 0
            ? String(planActual.valoracion).replace(".", ",")
            : "Nuevo"
    );

    cambiarTexto(
        "#opiniones-total",
        Number(planActual.opiniones || 0) > 0
            ? `${planActual.opiniones} valoraciones`
            : "Sin valoraciones todavía"
    );

    cambiarTexto(
        "#detalle-precio",
        formatearPrecio(
            planActual.precio
        )
    );

    cambiarTexto(
        "#reserva-valoracion",
        Number(planActual.valoracion || 0) > 0
            ? String(planActual.valoracion).replace(".", ",")
            : "Nuevo"
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

        enlaceMapa.innerHTML = `
            <i
                class="fa-solid fa-diamond-turn-right"
                aria-hidden="true"
            ></i>
            Cómo llegar con Google Maps
        `;
    }

    const body =
        seleccionar("#detalle-plan");

    if (body) {
        body.classList.toggle(
            "detalle-plan--musica",
            Boolean(planActual.esMusica)
        );

        body.dataset.tipoDetalle =
            planActual.esMusica
                ? "musica"
                : "actividad";

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


function escaparHTMLOpinionDetalle(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function obtenerInicialesOpinionDetalle(nombre) {
    const partes =
        String(nombre || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    return (
        partes
            .slice(0, 2)
            .map(
                (parte) =>
                    parte.charAt(0).toUpperCase()
            )
            .join("") ||
        "SU"
    );
}


function formatearFechaOpinionDetalle(fechaIso) {
    if (!fechaIso) {
        return "";
    }

    const fecha =
        new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            month: "long",
            year: "numeric"
        }
    ).format(fecha);
}


function crearEstrellasOpinionDetalle(puntuacion) {
    const valor =
        Math.max(
            0,
            Math.min(
                5,
                Number(puntuacion || 0)
            )
        );

    return Array.from(
        { length: 5 },
        (_, indice) => `
            <i
                class="${
                    indice < valor
                        ? "fa-solid"
                        : "fa-regular"
                } fa-star"
                aria-hidden="true"
            ></i>
        `
    ).join("");
}


function actualizarResumenValoracionesDetalle(
    media,
    total
) {
    const totalNumero =
        Number(total || 0);

    const mediaNumero =
        Number(media);

    const tieneValoraciones =
        totalNumero > 0 &&
        Number.isFinite(mediaNumero);

    const mediaTexto =
        tieneValoraciones
            ? mediaNumero
                .toFixed(1)
                .replace(".", ",")
            : "Nuevo";

    const totalTexto =
        totalNumero > 0
            ? `${totalNumero} ${
                totalNumero === 1
                    ? "opinión"
                    : "opiniones"
            }`
            : "Sin opiniones todavía";

    planActual.valoracion =
        tieneValoraciones
            ? mediaNumero
            : 0;

    planActual.opiniones =
        totalNumero;

    cambiarTexto(
        "#detalle-valoracion",
        mediaTexto
    );

    cambiarTexto(
        "#detalle-opiniones-texto",
        totalTexto
    );

    cambiarTexto(
        "#opiniones-valoracion",
        tieneValoraciones
            ? mediaTexto
            : "—"
    );

    cambiarTexto(
        "#opiniones-total",
        totalNumero > 0
            ? `${totalNumero} ${
                totalNumero === 1
                    ? "valoración"
                    : "valoraciones"
            }`
            : "Sin valoraciones todavía"
    );

    cambiarTexto(
        "#reserva-valoracion",
        mediaTexto
    );
}


function pintarOpinionesRealesDetalle(opiniones) {
    const contenedor =
        seleccionar(
            "#opiniones-grid"
        );

    if (!contenedor) {
        return;
    }

    const lista =
        Array.isArray(opiniones)
            ? opiniones
            : [];

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio estado-vacio--pequeno">

                <span class="estado-vacio__icono">
                    <i
                        class="fa-regular fa-comment-dots"
                        aria-hidden="true"
                    ></i>
                </span>

                <h3>
                    Todavía no hay opiniones
                </h3>

                <p>
                    Las valoraciones reales aparecerán aquí cuando
                    personas que hayan asistido al plan compartan
                    su experiencia.
                </p>

            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        lista
            .map(
                (opinion) => {
                    const nombre =
                        escaparHTMLOpinionDetalle(
                            opinion.nombre_visible ||
                            "Usuario de Suralia"
                        );

                    const iniciales =
                        escaparHTMLOpinionDetalle(
                            obtenerInicialesOpinionDetalle(
                                opinion.nombre_visible
                            )
                        );

                    const fecha =
                        escaparHTMLOpinionDetalle(
                            formatearFechaOpinionDetalle(
                                opinion.creado_en
                            )
                        );

                    const comentario =
                        escaparHTMLOpinionDetalle(
                            String(
                                opinion.comentario ||
                                ""
                            ).trim()
                        );

                    const puntuacion =
                        Math.max(
                            1,
                            Math.min(
                                5,
                                Number(
                                    opinion.puntuacion ||
                                    0
                                )
                            )
                        );

                    return `
                        <article class="opinion">

                            <div class="opinion__usuario">

                                <div class="opinion__avatar">
                                    ${iniciales}
                                </div>

                                <div>
                                    <strong>
                                        ${nombre}
                                    </strong>

                                    <span>
                                        ${fecha}
                                    </span>
                                </div>

                            </div>

                            <div
                                class="opinion__estrellas"
                                aria-label="${puntuacion} de 5 estrellas"
                            >
                                ${crearEstrellasOpinionDetalle(
                                    puntuacion
                                )}
                            </div>

                            ${
                                comentario
                                    ? `
                                        <p>
                                            ${comentario}
                                        </p>
                                    `
                                    : `
                                        <p class="texto-suave">
                                            Valoración sin comentario escrito.
                                        </p>
                                    `
                            }

                        </article>
                    `;
                }
            )
            .join("");
}


async function cargarOpinionesRealesDetalle() {
    if (
        !planActual?.esPlanSupabase ||
        !esUuidPlan(planActual?.planId)
    ) {
        return;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return;
    }

    try {
        const [
            resultadoResumen,
            resultadoOpiniones
        ] = await Promise.all([
            cliente.rpc(
                "obtener_valoracion_plan",
                {
                    p_plan_id:
                        planActual.planId
                }
            ),
            cliente.rpc(
                "obtener_opiniones_plan",
                {
                    p_plan_id:
                        planActual.planId
                }
            )
        ]);

        if (resultadoResumen.error) {
            throw resultadoResumen.error;
        }

        if (resultadoOpiniones.error) {
            throw resultadoOpiniones.error;
        }

        const resumen =
            Array.isArray(
                resultadoResumen.data
            )
                ? resultadoResumen.data[0]
                : resultadoResumen.data;

        actualizarResumenValoracionesDetalle(
            resumen?.valoracion_media,
            resumen?.total_valoraciones
        );

        pintarOpinionesRealesDetalle(
            resultadoOpiniones.data
        );
    } catch (error) {
        console.error(
            "No se pudieron cargar las opiniones reales del plan:",
            error
        );
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


function actualizarDatoMusica(
    tarjetaSelector,
    valorSelector,
    valor,
    ocultarSiVacio = false
) {
    const tarjeta =
        seleccionar(tarjetaSelector);

    const elementoValor =
        seleccionar(valorSelector);

    const texto =
        String(
            valor ||
            ""
        ).trim();

    if (tarjeta) {
        tarjeta.classList.toggle(
            "oculto",
            ocultarSiVacio && !texto
        );
    }

    if (elementoValor && texto) {
        elementoValor.textContent =
            texto;
    }
}


function cargarDetalleMusica() {
    const bloqueMusica =
        seleccionar(
            "#detalle-musica-evento"
        );

    const bloqueIncluye =
        seleccionar(
            "#bloque-detalle-incluye"
        );

    if (!planActual?.esMusica) {
        bloqueMusica?.classList.add(
            "oculto"
        );

        bloqueIncluye?.classList.remove(
            "oculto"
        );

        return;
    }

    const datos =
        planActual.detallesMusica ||
        {};

    bloqueMusica?.classList.remove(
        "oculto"
    );

    /*
       En música sustituimos el bloque genérico “Qué incluye”
       por una ficha de evento mucho más útil.
    */
    bloqueIncluye?.classList.add(
        "oculto"
    );

    const tipoEvento =
        String(
            datos.tipoEvento ||
            "Evento musical"
        ).trim();

    const tituloMusica =
        tipoEvento.toLowerCase() ===
            "festival"
            ? "Información del festival"
            : tipoEvento.toLowerCase() ===
                "concierto"
                ? "Información del concierto"
                : "Información del evento";

    cambiarTexto(
        "#titulo-detalle-musica",
        tituloMusica
    );

    cambiarTexto(
        "#musica-tipo-evento-badge",
        tipoEvento
    );

    actualizarDatoMusica(
        "#musica-dato-artista",
        "#musica-artista-cartel",
        datos.artistaCartel,
        true
    );

    actualizarDatoMusica(
        "#musica-dato-apertura",
        "#musica-apertura-puertas",
        datos.aperturaPuertas,
        true
    );

    actualizarDatoMusica(
        "#musica-dato-inicio",
        "#musica-hora-inicio",
        datos.horaInicio,
        false
    );

    actualizarDatoMusica(
        "#musica-dato-fin",
        "#musica-hora-fin",
        datos.horaFin,
        true
    );

    actualizarDatoMusica(
        "#musica-dato-edad",
        "#musica-edad-minima",
        datos.edadMinima ||
            "Todos los públicos",
        false
    );

    actualizarDatoMusica(
        "#musica-dato-entrada",
        "#musica-tipo-entrada",
        datos.tipoEntrada ||
            "General",
        false
    );

    cambiarTexto(
        "#detalle-organizador-etiqueta",
        "Evento organizado por"
    );

    const iconoGrupo =
        seleccionar(
            "#detalle-resumen-grupo-icono"
        );

    if (iconoGrupo) {
        iconoGrupo.className =
            "fa-solid fa-ticket";
    }

    const iconoAcceso =
        seleccionar(
            "#detalle-resumen-acceso-icono"
        );

    if (iconoAcceso) {
        iconoAcceso.className =
            "fa-solid fa-user-shield";
    }

    cambiarTexto(
        "#detalle-resumen-acceso-titulo",
        "Acceso"
    );

    cambiarTexto(
        "#detalle-sobre-titulo",
        tipoEvento.toLowerCase() ===
            "festival"
            ? "Sobre este festival"
            : tipoEvento.toLowerCase() ===
                "concierto"
                ? "Sobre este concierto"
                : "Sobre este evento"
    );

    cambiarTexto(
        "#detalle-precio-unidad",
        Number(planActual.precio || 0) > 0
            ? "desde"
            : "por entrada"
    );

    cambiarTexto(
        "#etiqueta-personas-reserva",
        "¿Cuántas entradas necesitáis?"
    );
}





function obtenerUnidadReserva() {
    return planActual?.esMusica
        ? {
            singular: "entrada",
            plural: "entradas"
        }
        : {
            singular: "plaza",
            plural: "plazas"
        };
}


function textoCantidadReserva(
    cantidad
) {
    const numero =
        Number(cantidad || 0);

    if (planActual?.esMusica) {
        return `${numero} ${
            numero === 1
                ? "entrada"
                : "entradas"
        }`;
    }

    return `${numero} ${
        numero === 1
            ? "persona"
            : "personas"
    }`;
}


const disponibilidadGlobalPorPase =
    new Map();

let disponibilidadGlobalCargada =
    false;


function crearClaveFechaPase(
    fechaValor,
    horaValor
) {
    return `${
        String(
            fechaValor ||
            ""
        ).trim()
    }|${
        normalizarHoraPlan(
            horaValor
        )
    }`;
}


async function cargarDisponibilidadGlobalPlan() {
    disponibilidadGlobalPorPase.clear();
    disponibilidadGlobalCargada =
        false;

    if (
        !planActual?.esPlanSupabase ||
        !esUuidPlan(
            planActual?.planId
        )
    ) {
        return;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        console.warn(
            "Supabase no está disponible para consultar las plazas."
        );

        return;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_disponibilidad_social_plan",
            {
                p_plan_id:
                    planActual.planId
            }
        );

        if (error) {
            throw error;
        }

        (
            Array.isArray(data)
                ? data
                : []
        ).forEach(
            (
                item
            ) => {
                const clave =
                    crearClaveFechaPase(
                        item.fecha,
                        item.hora
                    );

                const total =
                    Number(
                        item.plazas_totales
                    );

                const reservadas =
                    Number(
                        item.plazas_reservadas
                    );

                const disponibles =
                    Number(
                        item.plazas_disponibles
                    );

                const personasSolas =
                    Number(
                        item.personas_solas
                    );

                const reservasSolas =
                    Number(
                        item.reservas_solas
                    );

                disponibilidadGlobalPorPase.set(
                    clave,
                    {
                        total:
                            Number.isFinite(
                                total
                            ) &&
                            total > 0
                                ? total
                                : null,

                        reservadas:
                            Number.isFinite(
                                reservadas
                            )
                                ? reservadas
                                : 0,

                        restantes:
                            Number.isFinite(
                                disponibles
                            )
                                ? Math.max(
                                    0,
                                    disponibles
                                )
                                : null,

                        agotado:
                            Number.isFinite(
                                disponibles
                            ) &&
                            disponibles <= 0,

                        personasSolas:
                            Number.isFinite(
                                personasSolas
                            )
                                ? Math.max(
                                    0,
                                    personasSolas
                                )
                                : 0,

                        reservasSolas:
                            Number.isFinite(
                                reservasSolas
                            )
                                ? Math.max(
                                    0,
                                    reservasSolas
                                )
                                : 0
                    }
                );
            }
        );

        disponibilidadGlobalCargada =
            true;
    } catch (error) {
        console.error(
            "No se pudo consultar la disponibilidad global:",
            error
        );
    }
}


function obtenerReservasActivasDelPlan() {
    const reservas =
        obtenerDatosLocalStorage(
            "reservasSuralia"
        );

    return reservas.filter(
        (
            reserva
        ) =>
            String(
                reserva?.planId ||
                ""
            ) ===
                String(
                    planActual?.planId ||
                    ""
                ) &&
            reserva?.estado !==
                "cancelada"
    );
}


function reservaCoincideConOpcionFecha(
    reserva,
    opcion
) {
    if (
        !reserva ||
        !opcion
    ) {
        return false;
    }

    if (
        reserva.fechaValor &&
        String(
            reserva.fechaValor
        ) ===
            String(
                opcion.valor
            )
    ) {
        return true;
    }

    const fechaReserva =
        String(
            reserva.fechaIso ||
            reserva.fecha ||
            ""
        );

    const horaReserva =
        normalizarHoraPlan(
            reserva.hora
        );

    return (
        fechaReserva ===
            String(
                opcion.fecha ||
                ""
            ) &&
        (
            !opcion.hora ||
            !horaReserva ||
            horaReserva ===
                normalizarHoraPlan(
                    opcion.hora
                )
        )
    );
}


function obtenerDisponibilidadOpcionFecha(
    opcion
) {
    if (
        planActual?.esPlanSupabase &&
        disponibilidadGlobalCargada
    ) {
        const clave =
            crearClaveFechaPase(
                opcion?.fecha,
                opcion?.hora
            );

        const global =
            disponibilidadGlobalPorPase.get(
                clave
            );

        if (global) {
            return {
                total:
                    global.total,
                reservadas:
                    global.reservadas,
                restantes:
                    global.restantes,
                agotado:
                    global.agotado,

                personasSolas:
                    global.personasSolas ||
                    0,

                reservasSolas:
                    global.reservasSolas ||
                    0
            };
        }
    }

    const total =
        Number(
            opcion?.plazas
        );

    const tieneCupo =
        Number.isFinite(
            total
        ) &&
        total > 0;

    if (!tieneCupo) {
        return {
            total:
                null,
            reservadas:
                0,
            restantes:
                null,
            agotado:
                false,
            personasSolas:
                0,
            reservasSolas:
                0
        };
    }

    const reservadas =
        obtenerReservasActivasDelPlan()
            .filter(
                (
                    reserva
                ) =>
                    reservaCoincideConOpcionFecha(
                        reserva,
                        opcion
                    )
            )
            .reduce(
                (
                    acumulado,
                    reserva
                ) =>
                    acumulado +
                    Math.max(
                        0,
                        Number(
                            reserva?.personas ||
                            0
                        )
                    ),
                0
            );

    const restantes =
        Math.max(
            0,
            total -
                reservadas
        );

    return {
        total,
        reservadas,
        restantes,
        agotado:
            restantes <= 0,
        personasSolas:
            0,
        reservasSolas:
            0
    };
}


function obtenerOpcionFechaSeleccionada() {
    const selectorFecha =
        seleccionar(
            "#fecha-reserva"
        );

    if (!selectorFecha) {
        return null;
    }

    const valor =
        selectorFecha.value;

    return (
        obtenerOpcionesFechasReserva()
            .find(
                (
                    opcion
                ) =>
                    String(
                        opcion.valor
                    ) ===
                    String(
                        valor
                    )
            ) ||
        null
    );
}


function textoDisponibilidadFecha(
    opcion,
    paraReservaExterna = false
) {
    const disponibilidad =
        obtenerDisponibilidadOpcionFecha(
            opcion
        );

    const unidad =
        obtenerUnidadReserva();

    if (
        disponibilidad.total ===
        null
    ) {
        return paraReservaExterna
            ? "Disponibilidad en la web del organizador"
            : planActual?.esMusica
                ? "Entradas por confirmar"
                : "Plazas por confirmar";
    }

    if (paraReservaExterna) {
        return `${disponibilidad.total} ${
            disponibilidad.total === 1
                ? unidad.singular
                : unidad.plural
        } indicadas`;
    }

    if (disponibilidad.agotado) {
        return "Agotado";
    }

    return `${disponibilidad.restantes} ${
        disponibilidad.restantes === 1
            ? `${unidad.singular} disponible`
            : `${unidad.plural} disponibles`
    }`;
}


function actualizarSelectorPersonasPorDisponibilidad() {
    const selectorPersonas =
        seleccionar(
            "#personas-reserva"
        );

    const botonReserva =
        botonReservarPlan;

    if (
        !selectorPersonas ||
        !botonReserva ||
        planUsaReservaExterna()
    ) {
        return;
    }

    const opcion =
        obtenerOpcionFechaSeleccionada();

    const disponibilidad =
        obtenerDisponibilidadOpcionFecha(
            opcion
        );

    const voySolo =
        obtenerVoySoloReserva();

    const valorAnterior =
        Number(
            selectorPersonas.value ||
            2
        );

    selectorPersonas.innerHTML =
        "";

    if (
        disponibilidad.total !==
            null &&
        disponibilidad.agotado
    ) {
        const opcionSinPlazas =
            document.createElement(
                "option"
            );

        opcionSinPlazas.value =
            "";

        opcionSinPlazas.textContent =
            "Sin plazas disponibles";

        selectorPersonas.appendChild(
            opcionSinPlazas
        );

        selectorPersonas.disabled =
            true;

        botonReserva.disabled =
            true;

        botonReserva.textContent =
            planActual?.esMusica
                ? "Entradas agotadas"
                : "Pase agotado";

        return;
    }

    const maximoPorReserva =
        disponibilidad.restantes !==
            null
            ? Math.min(
                4,
                disponibilidad.restantes
            )
            : 4;

    /*
        El selector solo representa reservas acompañadas,
        por eso empieza en 2.
    */
    for (
        let numero = 2;
        numero <= maximoPorReserva;
        numero += 1
    ) {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(
                numero
            );

        option.textContent =
            textoCantidadReserva(
                numero
            );

        selectorPersonas.appendChild(
            option
        );
    }

    const hayPlazasParaAcompanado =
        maximoPorReserva >=
        2;

    if (!hayPlazasParaAcompanado) {
        const opcionSoloUna =
            document.createElement(
                "option"
            );

        opcionSoloUna.value =
            "";

        opcionSoloUna.textContent =
            planActual?.esMusica
                ? "Solo queda 1 entrada"
                : "Solo queda 1 plaza";

        selectorPersonas.appendChild(
            opcionSoloUna
        );

        selectorPersonas.disabled =
            true;
    } else {
        selectorPersonas.disabled =
            false;

        selectorPersonas.value =
            String(
                Math.min(
                    Math.max(
                        2,
                        Number.isFinite(
                            valorAnterior
                        )
                            ? valorAnterior
                            : 2
                    ),
                    maximoPorReserva
                )
            );
    }

    /*
        Una sola plaza disponible sigue permitiendo reservar
        cuando la persona ha elegido "Voy solo".
    */
    if (
        voySolo ===
            false &&
        !hayPlazasParaAcompanado
    ) {
        botonReserva.disabled =
            true;

        botonReserva.textContent =
            "No hay plazas para ir acompañado";
    } else {
        botonReserva.disabled =
            false;

        botonReserva.textContent =
            planActual?.esMusica
                ? "Reservar entrada"
                : "Reservar plaza";
    }
}


function actualizarEstadoPlazasReserva() {
    const estado =
        seleccionar(
            "#estado-plazas-reserva"
        );

    if (
        !estado ||
        planUsaReservaExterna()
    ) {
        return;
    }

    const opcion =
        obtenerOpcionFechaSeleccionada();

    const unidad =
        obtenerUnidadReserva();

    if (!opcion) {
        estado.textContent =
            planActual?.esMusica
                ? "Selecciona una fecha para consultar las entradas."
                : "Selecciona una fecha para consultar las plazas.";

        return;
    }

    const disponibilidad =
        obtenerDisponibilidadOpcionFecha(
            opcion
        );

    if (
        disponibilidad.total ===
        null
    ) {
        estado.textContent =
            planActual?.esMusica
                ? "Entradas por confirmar para esta fecha."
                : "Plazas por confirmar para esta fecha.";

        return;
    }

    if (
        disponibilidad.agotado
    ) {
        estado.textContent =
            planActual?.esMusica
                ? "No quedan entradas para esta fecha."
                : "No quedan plazas para esta fecha.";

        return;
    }

    estado.textContent =
        `Quedan ${disponibilidad.restantes} de ${disponibilidad.total} ${
            disponibilidad.total === 1
                ? unidad.singular
                : unidad.plural
        } para esta fecha.`;
}


function actualizarResumenSocialFechaSeleccionada() {
    const contadorApuntadas =
        seleccionar(
            "#detalle-personas-apuntadas"
        );

    const bloqueVoySolo =
        seleccionar(
            "#detalle-voy-solo-meta"
        );

    const contadorSolas =
        seleccionar(
            "#detalle-personas-solas"
        );

    if (
        !contadorApuntadas ||
        !bloqueVoySolo ||
        !contadorSolas
    ) {
        return;
    }

    const opcion =
        obtenerOpcionFechaSeleccionada();

    if (
        !opcion ||
        !planActual?.esPlanSupabase ||
        !disponibilidadGlobalCargada
    ) {
        bloqueVoySolo.hidden =
            true;

        return;
    }

    const disponibilidad =
        obtenerDisponibilidadOpcionFecha(
            opcion
        );

    const apuntadas =
        Math.max(
            0,
            Number(
                disponibilidad.reservadas ||
                0
            )
        );

    const solas =
        Math.max(
            0,
            Number(
                disponibilidad.personasSolas ||
                0
            )
        );

    contadorApuntadas.textContent =
        `${apuntadas} ${
            apuntadas === 1
                ? "persona apuntada"
                : "personas apuntadas"
        }`;

    if (
        solas <= 0
    ) {
        contadorSolas.textContent =
            "Nadie viene solo todavía";
    } else {
        contadorSolas.textContent =
            `${solas} ${
                solas === 1
                    ? "viene sola"
                    : "vienen solas"
            }`;
    }

    bloqueVoySolo.hidden =
        false;
}


function actualizarDisponibilidadReservaSeleccionada() {
    actualizarSelectorPersonasPorDisponibilidad();
    actualizarEstadoPlazasReserva();
    actualizarDesgloseReserva();
    actualizarResumenSocialFechaSeleccionada();
}


function sincronizarFechaVisibleSeleccionada() {
    const selectorFecha =
        seleccionar(
            "#fecha-reserva"
        );

    const lista =
        seleccionar(
            "#lista-fechas-disponibles"
        );

    if (
        !selectorFecha ||
        !lista
    ) {
        return;
    }

    const valorSeleccionado =
        String(
            selectorFecha.value ||
            ""
        );

    lista
        .querySelectorAll(
            "[data-fecha-reserva-valor]"
        )
        .forEach(
            (
                elemento
            ) => {
                const estaSeleccionada =
                    !planUsaReservaExterna() &&
                    String(
                        elemento.dataset.fechaReservaValor ||
                        ""
                    ) ===
                        valorSeleccionado;

                elemento.classList.toggle(
                    "fecha-disponible-detalle--seleccionada",
                    estaSeleccionada
                );

                if (
                    elemento.tagName ===
                    "BUTTON"
                ) {
                    elemento.setAttribute(
                        "aria-pressed",
                        String(
                            estaSeleccionada
                        )
                    );
                }

                const accion =
                    elemento.querySelector(
                        ".fecha-disponible-detalle__accion"
                    );

                if (
                    accion &&
                    !elemento.disabled
                ) {
                    accion.textContent =
                        estaSeleccionada
                            ? "Seleccionada"
                            : "Elegir";
                }
            }
        );
}


function cargarFechasDisponiblesDetalle() {
    const bloque =
        seleccionar(
            "#bloque-fechas-disponibles"
        );

    const lista =
        seleccionar(
            "#lista-fechas-disponibles"
        );

    const contador =
        seleccionar(
            "#contador-fechas-disponibles"
        );

    const textoAyuda =
        seleccionar(
            "#texto-fechas-disponibles"
        );

    if (
        !bloque ||
        !lista
    ) {
        return;
    }

    const opciones =
        obtenerOpcionesFechasReserva();

    /*
        Con una sola fecha ya se muestra arriba en el resumen.
        Este bloque cobra sentido cuando existen varios días o pases.
    */
    if (
        opciones.length <=
        1
    ) {
        bloque.classList.add(
            "oculto"
        );

        lista.innerHTML =
            "";

        return;
    }

    bloque.classList.remove(
        "oculto"
    );

    if (contador) {
        contador.textContent =
            `${opciones.length} ${
                opciones.length ===
                    1
                    ? "fecha"
                    : "fechas"
            }`;
    }

    if (textoAyuda) {
        textoAyuda.textContent =
            planUsaReservaExterna()
                ? "Consulta los días y horarios disponibles. La compra o reserva se completará en la web del organizador."
                : "Elige aquí un día o selecciónalo después en el cuadro de reserva.";
    }

    lista.innerHTML =
        "";

    opciones.forEach(
        (
            opcion
        ) => {
            const elemento =
                document.createElement(
                    planUsaReservaExterna()
                        ? "div"
                        : "button"
                );

            if (
                elemento.tagName ===
                "BUTTON"
            ) {
                elemento.type =
                    "button";

                elemento.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }

            elemento.className =
                "fecha-disponible-detalle";

            elemento.dataset.fechaReservaValor =
                opcion.valor;

            elemento.setAttribute(
                "role",
                "listitem"
            );

            const fechaTexto =
                formatearFechaDetalleSupabase(
                    opcion.fecha
                );

            const esReservaExterna =
                planUsaReservaExterna();

            const disponibilidad =
                obtenerDisponibilidadOpcionFecha(
                    opcion
                );

            const agotado =
                !esReservaExterna &&
                disponibilidad.agotado;

            if (agotado) {
                elemento.classList.add(
                    "fecha-disponible-detalle--agotada"
                );

                if (
                    elemento.tagName ===
                    "BUTTON"
                ) {
                    elemento.disabled =
                        true;
                }
            }

            elemento.innerHTML = `
                <span class="fecha-disponible-detalle__icono">
                    <i
                        class="fa-regular fa-calendar"
                        aria-hidden="true"
                    ></i>
                </span>

                <span class="fecha-disponible-detalle__contenido">
                    <strong>
                        ${fechaTexto}
                    </strong>

                    <span>
                        <i
                            class="fa-regular fa-clock"
                            aria-hidden="true"
                        ></i>
                        ${
                            opcion.hora ||
                            "Hora por confirmar"
                        }
                    </span>

                    <span class="fecha-disponible-detalle__plazas">
                        <i
                            class="fa-solid fa-user-group"
                            aria-hidden="true"
                        ></i>
                        ${
                            textoDisponibilidadFecha(
                                opcion,
                                esReservaExterna
                            )
                        }
                    </span>
                </span>

                ${
                    esReservaExterna
                        ? ""
                        : `
                            <span class="fecha-disponible-detalle__accion">
                                ${
                                    agotado
                                        ? "Agotado"
                                        : "Elegir"
                                }
                            </span>
                        `
                }
            `;

            if (
                elemento.tagName ===
                "BUTTON"
            ) {
                elemento.addEventListener(
                    "click",
                    () => {
                        const selectorFecha =
                            seleccionar(
                                "#fecha-reserva"
                            );

                        if (!selectorFecha) {
                            return;
                        }

                        selectorFecha.value =
                            opcion.valor;

                        selectorFecha.dispatchEvent(
                            new Event(
                                "change",
                                {
                                    bubbles:
                                        true
                                }
                            )
                        );
                    }
                );
            }

            lista.appendChild(
                elemento
            );
        }
    );

    sincronizarFechaVisibleSeleccionada();
}


function cargarFechasReserva() {
    const selectorFecha =
        seleccionar(
            "#fecha-reserva"
        );

    if (!selectorFecha) {
        return;
    }

    const opciones =
        obtenerOpcionesFechasReserva();

    selectorFecha.innerHTML =
        "";

    if (
        opciones.length ===
        0
    ) {
        const opcion =
            document.createElement(
                "option"
            );

        opcion.value =
            "";

        opcion.textContent =
            "Fecha por confirmar";

        selectorFecha.appendChild(
            opcion
        );

        cargarFechasDisponiblesDetalle();

        return;
    }

    opciones.forEach(
        (
            item
        ) => {
            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                item.valor;

            opcion.textContent =
                item.texto;

            opcion.dataset.fecha =
                item.fecha;

            opcion.dataset.hora =
                item.hora;

            opcion.dataset.plazas =
                item.plazas ??
                "";

            if (
                !planUsaReservaExterna()
            ) {
                const disponibilidad =
                    obtenerDisponibilidadOpcionFecha(
                        item
                    );

                if (
                    disponibilidad.agotado
                ) {
                    opcion.disabled =
                        true;

                    opcion.textContent =
                        `${item.texto} · Agotado`;
                } else if (
                    disponibilidad.restantes !==
                    null
                ) {
                    opcion.textContent =
                        `${item.texto} · ${disponibilidad.restantes} ${
                            disponibilidad.restantes ===
                                1
                                ? "plaza"
                                : "plazas"
                        }`;
                }
            }

            selectorFecha.appendChild(
                opcion
            );
        }
    );

    const primeraDisponible =
        Array.from(
            selectorFecha.options
        ).find(
            (
                opcion
            ) =>
                !opcion.disabled
        );

    if (primeraDisponible) {
        selectorFecha.value =
            primeraDisponible.value;
    }

    cargarFechasDisponiblesDetalle();
    sincronizarFechaVisibleSeleccionada();
    actualizarDisponibilidadReservaSeleccionada();
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

    if (
        !Array.isArray(
            planActual.coordenadas
        ) ||
        planActual.coordenadas.length !==
            2
    ) {
        contenedorMapa.classList.add(
            "oculto"
        );

        return;
    }

    contenedorMapa.classList.remove(
        "oculto"
    );

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


function planUsaReservaExterna() {
    return Boolean(
        String(
            planActual?.enlaceReserva ||
            ""
        ).trim()
    );
}


function configurarTipoReserva() {
    if (
        !formularioReserva ||
        !botonReservarPlan
    ) {
        return;
    }

    const esExterna =
        planUsaReservaExterna();

    const esMusica =
        Boolean(
            planActual?.esMusica
        );

    const camposReserva =
        formularioReserva.querySelectorAll(
            ".campo-reserva"
        );

    camposReserva.forEach(
        (
            campo
        ) => {
            campo.classList.toggle(
                "oculto",
                esExterna
            );
        }
    );

    const tarjetaReserva =
        formularioReserva.closest(
            ".reserva-plan__tarjeta"
        );

    const aviso =
        tarjetaReserva?.querySelector(
            ".reserva-plan__aviso"
        );

    const desglose =
        tarjetaReserva?.querySelector(
            ".reserva-plan__desglose"
        );

    const plazas =
        tarjetaReserva?.querySelector(
            ".reserva-plan__plazas"
        );

    const seguridadTitulo =
        seleccionar(
            "#seguridad-reserva-titulo"
        );

    const seguridadTexto =
        seleccionar(
            "#seguridad-reserva-texto"
        );

    if (esExterna) {
        botonReservarPlan.innerHTML =
            esMusica
                ? `
                    Comprar entradas
                    <i
                        class="fa-solid fa-arrow-up-right-from-square"
                        aria-hidden="true"
                    ></i>
                `
                : `
                    Reservar en la web
                    <i
                        class="fa-solid fa-arrow-up-right-from-square"
                        aria-hidden="true"
                    ></i>
                `;

        botonReservarPlan.setAttribute(
            "aria-label",
            esMusica
                ? "Abrir la web externa de venta de entradas"
                : "Abrir la web externa de entradas o reservas"
        );

        if (aviso) {
            aviso.textContent =
                esMusica
                    ? "La compra de entradas se completará en la web externa del organizador."
                    : "La reserva o compra se completará en la web externa del organizador.";
        }

        if (seguridadTitulo) {
            seguridadTitulo.textContent =
                "Compra en la web oficial";
        }

        if (seguridadTexto) {
            seguridadTexto.textContent =
                "Suralia te redirigirá al enlace facilitado por el organizador para completar el proceso.";
        }

        desglose?.classList.add(
            "oculto"
        );

        plazas?.classList.add(
            "oculto"
        );

        return;
    }

    botonReservarPlan.innerHTML =
        esMusica
            ? "Reservar entrada"
            : "Reservar plaza";

    botonReservarPlan.setAttribute(
        "aria-label",
        esMusica
            ? "Reservar entrada en Suralia"
            : "Reservar plaza en Suralia"
    );

    if (aviso) {
        aviso.textContent =
            "No se realizará ningún cobro.";
    }

    if (seguridadTitulo) {
        seguridadTitulo.textContent =
            esMusica
                ? "Reserva de entradas segura"
                : "Reserva segura";
    }

    if (seguridadTexto) {
        seguridadTexto.textContent =
            esMusica
                ? "Tu reserva de entradas quedará registrada en Suralia."
                : "Tus datos estarán protegidos durante todo el proceso.";
    }

    desglose?.classList.remove(
        "oculto"
    );

    plazas?.classList.remove(
        "oculto"
    );
}


function obtenerNumeroPersonasReserva() {
    const voySolo =
        obtenerVoySoloReserva();

    if (
        voySolo ===
        true
    ) {
        return 1;
    }

    if (
        voySolo ===
        false
    ) {
        const numero =
            Number(
                selectorPersonasReserva?.value
            );

        return Number.isInteger(
            numero
        )
            ? numero
            : 0;
    }

    /*
        Antes de elegir cómo viene, mostramos el precio base
        de una persona para no dar una cifra engañosa.
    */
    return 1;
}


function actualizarDesgloseReserva() {
    const numeroPersonas =
        obtenerNumeroPersonasReserva();

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

const campoPersonasReserva =
    seleccionar("#campo-personas-reserva");

const campoComoVienesReserva =
    seleccionar("#campo-como-vienes");

const opcionesVoySoloReserva =
    document.querySelectorAll(
        'input[name="voy_solo"]'
    );


function obtenerVoySoloReserva() {
    const opcionSeleccionada =
        document.querySelector(
            'input[name="voy_solo"]:checked'
        );

    if (!opcionSeleccionada) {
        return null;
    }

    return opcionSeleccionada.value ===
        "true";
}


function actualizarCampoPersonasSegunComoVienes() {
    const voySolo =
        obtenerVoySoloReserva();

    if (!campoPersonasReserva) {
        return;
    }

    const mostrarPersonas =
        voySolo ===
        false;

    campoPersonasReserva.hidden =
        !mostrarPersonas;

    campoPersonasReserva.setAttribute(
        "aria-hidden",
        String(
            !mostrarPersonas
        )
    );

    if (
        voySolo ===
        true
    ) {
        marcarCampoReserva(
            selectorPersonasReserva,
            false
        );
    }

    if (
        mostrarPersonas &&
        selectorPersonasReserva &&
        (
            !selectorPersonasReserva.value ||
            Number(
                selectorPersonasReserva.value
            ) < 2
        )
    ) {
        const primeraOpcionValida =
            Array.from(
                selectorPersonasReserva.options
            ).find(
                (
                    opcion
                ) =>
                    Number(
                        opcion.value
                    ) >= 2 &&
                    !opcion.disabled
            );

        if (primeraOpcionValida) {
            selectorPersonasReserva.value =
                primeraOpcionValida.value;
        }
    }
}


function marcarComoVienesInvalido(
    invalido
) {
    if (!campoComoVienesReserva) {
        return;
    }

    campoComoVienesReserva.classList.toggle(
        "campo-reserva--invalido",
        invalido
    );

    campoComoVienesReserva.setAttribute(
        "aria-invalid",
        String(invalido)
    );
}

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

        sincronizarFechaVisibleSeleccionada();
        actualizarDisponibilidadReservaSeleccionada();
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


opcionesVoySoloReserva.forEach(
    (
        opcion
    ) => {
        opcion.addEventListener(
            "change",
            () => {
                marcarComoVienesInvalido(
                    false
                );

                actualizarCampoPersonasSegunComoVienes();

                actualizarSelectorPersonasPorDisponibilidad();

                actualizarDesgloseReserva();
            }
        );
    }
);

actualizarCampoPersonasSegunComoVienes();


async function crearReservaSupabaseDetalle({
    fechaSeleccionada,
    fechaIsoSeleccionada,
    horaSeleccionada,
    textoFecha,
    numeroPersonas,
    voySolo,
    sesionActual
}) {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        throw new Error(
            "No se ha podido conectar con Supabase."
        );
    }

    const {
        data: datosSesion,
        error: errorSesion
    } = await cliente.auth.getSession();

    if (errorSesion) {
        throw errorSesion;
    }

    if (!datosSesion?.session) {
        throw new Error(
            "Tu sesión ha caducado. Inicia sesión de nuevo."
        );
    }

    const {
        data,
        error
    } = await cliente.rpc(
        "crear_reserva_plan",
        {
            p_plan_id:
                planActual.planId,

            p_fecha:
                fechaIsoSeleccionada,

            p_hora:
                horaSeleccionada,

            p_personas:
                numeroPersonas,

            p_voy_solo:
                voySolo
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
        Copia temporal para que perfil.html#reservas
        siga mostrando la reserva mientras migramos
        esa sección a Supabase.

        La disponibilidad REAL ya no depende de esta copia.
    */
    const reservasLocales =
        obtenerDatosLocalStorage(
            "reservasSuralia"
        );

    const yaExisteCopia =
        reservasLocales.some(
            (
                reserva
            ) =>
                String(
                    reserva.reservaSupabaseId ||
                    ""
                ) ===
                    String(
                        respuesta.reserva_id ||
                        ""
                    )
        );

    if (!yaExisteCopia) {
        reservasLocales.push({
            id:
                respuesta.reserva_id,

            reservaSupabaseId:
                respuesta.reserva_id,

            origen:
                "supabase",

            planId:
                planActual.planId,

            titulo:
                planActual.titulo,

            categoria:
                planActual.categoriaTexto,

            imagen:
                planActual.imagen,

            fecha:
                fechaIsoSeleccionada,

            fechaIso:
                fechaIsoSeleccionada,

            fechaValor:
                fechaSeleccionada,

            fechaTexto:
                textoFecha,

            hora:
                horaSeleccionada,

            personas:
                numeroPersonas,

            voySolo:
                voySolo,

            voy_solo:
                voySolo,

            ubicacion:
                planActual.ubicacion,

            precio:
                Number(
                    respuesta.precio_unitario ??
                    planActual.precio ??
                    0
                ),

            precioUnitario:
                Number(
                    respuesta.precio_unitario ??
                    planActual.precio ??
                    0
                ),

            precioTotal:
                Number(
                    respuesta.precio_total ??
                    (
                        Number(
                            planActual.precio ||
                            0
                        ) *
                        numeroPersonas
                    )
                ),

            enlace:
                planActual.enlace,

            estado:
                respuesta.estado ||
                "confirmada",

            usuarioEmail:
                sesionActual?.email ||
                datosSesion.session.user?.email ||
                "",

            fechaReserva:
                new Date().toISOString()
        });

        guardarDatosLocalStorage(
            "reservasSuralia",
            reservasLocales
        );
    }

    return respuesta;
}


function obtenerMensajeErrorReservaSupabase(
    error
) {
    const mensaje =
        String(
            error?.message ||
            ""
        ).trim();

    if (!mensaje) {
        return "No se ha podido completar la reserva.";
    }

    return mensaje
        .replace(
            /^.*?error:\s*/i,
            ""
        )
        .replace(
            /\s+CONTEXT:.*$/i,
            ""
        )
        .trim();
}


/* =====================================================
   RESERVAS
===================================================== */

if (formularioReserva) {
    formularioReserva.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            if (
                planUsaReservaExterna()
            ) {
                const urlReserva =
                    String(
                        planActual.enlaceReserva ||
                        ""
                    ).trim();

                try {
                    const url =
                        new URL(
                            urlReserva
                        );

                    if (
                        url.protocol !== "https:" &&
                        url.protocol !== "http:"
                    ) {
                        throw new Error(
                            "Protocolo no permitido."
                        );
                    }

                    window.open(
                        url.href,
                        "_blank",
                        "noopener,noreferrer"
                    );
                } catch (error) {
                    console.error(
                        "El enlace externo de reserva no es válido:",
                        error
                    );

                    mostrarNotificacion(
                        "No se ha podido abrir la web de reservas."
                    );
                }

                return;
            }

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

            const opcionFechaSeleccionada =
                selectorFecha.options[
                    selectorFecha.selectedIndex
                ];

            const fechaIsoSeleccionada =
                opcionFechaSeleccionada?.dataset
                    ?.fecha ||
                fechaSeleccionada;

            const horaSeleccionada =
                opcionFechaSeleccionada?.dataset
                    ?.hora ||
                normalizarHoraPlan(
                    planActual.hora
                );

            const textoFecha =
                opcionFechaSeleccionada?.text ||
                "";

            const voySolo =
                obtenerVoySoloReserva();

            const numeroPersonas =
                voySolo === true
                    ? 1
                    : Number(
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
                typeof voySolo !==
                "boolean"
            ) {
                marcarComoVienesInvalido(
                    true
                );

                mostrarNotificacion(
                    "Indica si vienes solo o acompañado."
                );

                campoComoVienesReserva?.scrollIntoView({
                    behavior:
                        "smooth",
                    block:
                        "center"
                });

                return;
            }

            marcarComoVienesInvalido(
                false
            );

            if (
                voySolo ===
                    false &&
                (
                    !Number.isInteger(
                        numeroPersonas
                    ) ||
                    numeroPersonas < 2
                )
            ) {
                marcarCampoReserva(
                    selectorPersonas,
                    true
                );

                mostrarNotificacion(
                    "Indica cuántos sois en total."
                );

                selectorPersonas.focus();

                return;
            }

            marcarCampoReserva(
                selectorPersonas,
                false
            );

            const opcionReserva =
                obtenerOpcionFechaSeleccionada();

            const disponibilidadReserva =
                obtenerDisponibilidadOpcionFecha(
                    opcionReserva
                );

            if (
                disponibilidadReserva.restantes !==
                    null &&
                numeroPersonas >
                    disponibilidadReserva.restantes
            ) {
                mostrarNotificacion(
                    disponibilidadReserva.agotado
                        ? "Este pase ya está agotado."
                        : `Solo quedan ${disponibilidadReserva.restantes} ${
                            disponibilidadReserva.restantes === 1
                                ? obtenerUnidadReserva().singular
                                : obtenerUnidadReserva().plural
                        } para esta fecha.`
                );

                cargarFechasReserva();

                return;
            }

            if (
                planActual?.esPlanSupabase &&
                esUuidPlan(
                    planActual.planId
                )
            ) {
                const textoOriginalBoton =
                    botonReservarPlan?.textContent ||
                    "Reservar plaza";

                if (botonReservarPlan) {
                    botonReservarPlan.disabled =
                        true;

                    botonReservarPlan.textContent =
                        "Confirmando reserva...";
                }

                try {
                    await crearReservaSupabaseDetalle({
                        fechaSeleccionada,
                        fechaIsoSeleccionada,
                        horaSeleccionada,
                        textoFecha,
                        numeroPersonas,
                        voySolo,
                        sesionActual
                    });

                    await cargarDisponibilidadGlobalPlan();

                    cargarFechasReserva();

                    mostrarNotificacion(
                        `Reserva confirmada para ${textoCantidadReserva(
                            numeroPersonas
                        )}.`
                    );

                    setTimeout(
                        () => {
                            window.location.href =
                                "perfil.html#reservas";
                        },
                        1400
                    );
                } catch (error) {
                    console.error(
                        "No se pudo crear la reserva en Supabase:",
                        error
                    );

                    await cargarDisponibilidadGlobalPlan();

                    cargarFechasReserva();

                    if (botonReservarPlan) {
                        botonReservarPlan.disabled =
                            false;

                        botonReservarPlan.textContent =
                            textoOriginalBoton;
                    }

                    mostrarNotificacion(
                        obtenerMensajeErrorReservaSupabase(
                            error
                        )
                    );
                }

                return;
            }

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
                            reserva.fechaValor ===
                                fechaSeleccionada ||
                            (
                                (
                                    reserva.fechaIso ===
                                        fechaIsoSeleccionada ||
                                    reserva.fecha ===
                                        fechaIsoSeleccionada
                                ) &&
                                (
                                    !reserva.hora ||
                                    normalizarHoraPlan(
                                        reserva.hora
                                    ) ===
                                        horaSeleccionada
                                )
                            )
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
                    fechaIsoSeleccionada,

                fechaIso:
                    fechaIsoSeleccionada,

                fechaValor:
                    fechaSeleccionada,

                fechaTexto:
                    textoFecha,

                hora:
                    horaSeleccionada,

                personas:
                    numeroPersonas,

                voySolo:
                    voySolo,

                voy_solo:
                    voySolo,

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

            cargarFechasReserva();

            mostrarNotificacion(
                `Reserva confirmada para ${textoCantidadReserva(
                    numeroPersonas
                )}.`
            );

            setTimeout(() => {
                window.location.href =
                    "perfil.html#reservas";
            }, 1400);
        }
    );
}


/* =====================================================
   OTROS PLANES CERCANOS DINÁMICOS
===================================================== */




function obtenerFechaLocalISODetalle() {
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


function planRelacionadoCaducado(
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
        obtenerFechaLocalISODetalle()
    );
}


function obtenerProximoPaseVigenteRelacionado(
    plan
) {
    const hoy =
        obtenerFechaLocalISODetalle();

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

    anadirPase(
        plan?.fecha,
        plan?.hora
    );

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

    pases.sort(
        (
            a,
            b
        ) => {
            const cmp =
                a.fecha.localeCompare(
                    b.fecha
                );

            if (
                cmp !== 0
            ) {
                return cmp;
            }

            return String(
                a.hora ||
                ""
            ).localeCompare(
                String(
                    b.hora ||
                    ""
                )
            );
        }
    );

    return pases[0] ||
        null;
}


function barajarPlanesRelacionados(
    planes
) {
    const copia =
        [...planes];

    for (
        let indice = copia.length - 1;
        indice > 0;
        indice -= 1
    ) {
        const posicionAleatoria =
            Math.floor(
                Math.random() *
                (indice + 1)
            );

        [
            copia[indice],
            copia[posicionAleatoria]
        ] = [
            copia[posicionAleatoria],
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


function crearTarjetaPlanRelacionado(
    plan
) {
    const titulo =
        escaparTextoHTML(
            plan.titulo ||
            "Actividad de Suralia"
        );

    const imagen =
        escaparAtributoHTML(
            plan.imagen ||
            "img/placeholder-plan.jpg"
        );

    const enlace =
        escaparAtributoHTML(
            plan.enlace ||
            "planes.html"
        );

    const fechaTexto =
        escaparTextoHTML(
            plan.fechaTexto ||
            "Fecha por confirmar"
        );

    const ubicacion =
        escaparTextoHTML(
            plan.ubicacion ||
            "Ubicación por confirmar"
        );

    const categoriaTexto =
        escaparTextoHTML(
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
            data-plan-id="${escaparAtributoHTML(
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


async function cargarPlanesRelacionadosDinamicos() {
    const grid =
        seleccionar(
            ".planes-relacionados .planes__grid"
        );

    if (
        !grid ||
        !planActual
    ) {
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
                        hora,
                        fechas,
                        ubicacion,
                        precio,
                        imagen_url
                    `
                )
                .eq(
                    "estado",
                    "publicado"
                );

            if (error) {
                throw error;
            }

            planesSupabase =
                (
                    Array.isArray(data)
                        ? data
                        : []
                )
                    .map(
                        (
                            plan
                        ) => {
                            const proximoPase =
                                obtenerProximoPaseVigenteRelacionado(
                                    plan
                                );

                            if (
                                !proximoPase
                            ) {
                                return null;
                            }

                            return {
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
                                    new Intl.DateTimeFormat(
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
                                            `${proximoPase.fecha}T00:00:00`
                                        )
                                    ),

                                fechaIso:
                                    proximoPase.fecha,

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
                            };
                        }
                    )
                    .filter(Boolean);
        } catch (error) {
            console.error(
                "No se pudieron cargar los planes relacionados desde Supabase:",
                error
            );
        }
    }

    const idsIncluidos =
        new Set();

    const disponibles = [
        ...planesSupabase
    ]
        .filter(
            (
                plan
            ) => {
                const id =
                    String(
                        plan.planId ||
                        ""
                    );

                if (
                    !id ||
                    id ===
                    String(
                        planActual.planId ||
                        ""
                    ) ||
                    planRelacionadoCaducado(
                        plan.fechaIso
                    ) ||
                    idsIncluidos.has(
                        id
                    )
                ) {
                    return false;
                }

                idsIncluidos.add(
                    id
                );

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
        seleccionar(
            ".planes-relacionados"
        )?.remove();

        return;
    }

    grid.innerHTML =
        relacionados
            .map(
                crearTarjetaPlanRelacionado
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
            actualizarBotonFavoritoDetalle();
        }
    }
);


/* =====================================================
   INICIALIZACIÓN
===================================================== */

async function iniciarDetallePlan() {
    try {
        if (
            esUuidPlan(
                planIdUrl
            )
        ) {
            planActual =
                await cargarPlanSupabaseDetalle();
        }

        if (!planActual) {
            mostrarPlanNoEncontrado();
            marcarDetalleComoListo();
            return;
        }

        /*
            Si el plan tenía fecha(s) pero ya no queda ninguna
            vigente, no mostramos el detalle ni permitimos reservar.
        */
        if (
            planActual.esPlanSupabase &&
            Array.isArray(
                planActual.fechasReserva
            ) &&
            planActual.fechasReserva.length ===
                0 &&
            Boolean(
                planActual.fechaIso
            )
        ) {
            mostrarPlanFinalizado();
            marcarDetalleComoListo();
            return;
        }

        cargarDatosBasicos();
        cargarGaleria();
        cargarDescripcion();
        cargarIncluye();
        cargarDetalleMusica();

        await Promise.all([
            cargarOpinionesRealesDetalle(),
            cargarDisponibilidadGlobalPlan()
        ]);

        cargarFechasReserva();
        cargarMapa();
        configurarTipoReserva();
        actualizarDesgloseReserva();
        actualizarBotonFavoritoDetalle();
        await cargarPlanesRelacionadosDinamicos();

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

        marcarDetalleComoListo();
    } catch (error) {
        console.error(
            "No se pudo cargar el detalle del plan:",
            error
        );

        mostrarPlanNoEncontrado();
        marcarDetalleComoListo();
    }
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarDetallePlan
    );
} else {
    iniciarDetallePlan();
}