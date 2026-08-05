/* =====================================================
   PROTECCIÓN DEL PANEL DE ADMINISTRACIÓN
===================================================== */

const comprobacionAdmin =
    document.querySelector(
        "#admin-comprobacion"
    );

const contenidoAdmin =
    document.querySelector(
        "#admin-principal"
    );

const footerAdmin =
    document.querySelector(
        "#admin-footer"
    );


/* =====================================================
   ELEMENTOS DE VERIFICACIONES
===================================================== */

const listaVerificaciones =
    document.querySelector(
        "#lista-verificaciones"
    );

const estadoVerificaciones =
    document.querySelector(
        "#estado-verificaciones"
    );

const contadorVerificaciones =
    document.querySelector(
        "#contador-verificaciones"
    );

const modalRechazarVerificacion =
    document.querySelector(
        "#modal-rechazar-verificacion"
    );

const cerrarModalRechazo =
    document.querySelector(
        "#cerrar-modal-rechazo"
    );

const cancelarRechazoVerificacion =
    document.querySelector(
        "#cancelar-rechazo-verificacion"
    );

const confirmarRechazoVerificacion =
    document.querySelector(
        "#confirmar-rechazo-verificacion"
    );

const motivoRechazoVerificacion =
    document.querySelector(
        "#motivo-rechazo-verificacion"
    );

const errorMotivoRechazo =
    document.querySelector(
        "#error-motivo-rechazo"
    );

const listaPlanesPendientes =
    document.querySelector(
        "#lista-planes-pendientes"
    );

const estadoPlanesPendientes =
    document.querySelector(
        "#estado-planes-pendientes"
    );

const contadorPlanesPendientes =
    document.querySelector(
        "#contador-planes-pendientes"
    );

const modalRechazarPlan =
    document.querySelector(
        "#modal-rechazar-plan"
    );

const motivoRechazoPlan =
    document.querySelector(
        "#motivo-rechazo-plan"
    );

const errorMotivoRechazoPlan =
    document.querySelector(
        "#error-motivo-rechazo-plan"
    );

const cerrarModalRechazarPlan =
    document.querySelector(
        "#cerrar-modal-rechazar-plan"
    );

const cancelarRechazoPlan =
    document.querySelector(
        "#cancelar-rechazo-plan"
    );

const confirmarRechazoPlan =
    document.querySelector(
        "#confirmar-rechazo-plan"
    );


const listaPlanesPublicados =
    document.querySelector(
        "#lista-planes-publicados"
    );

const estadoPlanesPublicados =
    document.querySelector(
        "#estado-planes-publicados"
    );

const contadorPlanesPublicados =
    document.querySelector(
        "#contador-planes-publicados"
    );

const BUCKET_IMAGENES_PLANES =
    "imagenes-planes";

let planesPublicadosAdmin =
    [];

let planesPendientesAdmin =
    [];

let planPendienteRechazar =
    null;

let botonPlanPendienteRechazar =
    null;


const listaUsuariosAdmin =
    document.querySelector(
        "#lista-usuarios"
    );

const estadoUsuariosAdmin =
    document.querySelector(
        "#estado-usuarios"
    );

const contadorUsuariosAdmin =
    document.querySelector(
        "#contador-usuarios"
    );

let usuariosAdmin =
    [];


const BUCKET_VERIFICACIONES =
    "verificaciones-perfil";

let verificacionesPendientes =
    [];

let verificacionPendienteRechazar =
    null;

let botonQueAbrioModalRechazo =
    null;


/* =====================================================
   FUNCIONES GENERALES
===================================================== */

function escaparHTML(
    valor = ""
) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatearFechaAdmin(
    fechaIso
) {
    if (!fechaIso) {
        return "Fecha no disponible";
    }

    const fecha =
        new Date(fechaIso);

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day:
                "numeric",

            month:
                "long",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(fecha);
}


function mostrarErrorAccesoAdmin(
    titulo,
    mensaje
) {
    if (!comprobacionAdmin) {
        return;
    }

    comprobacionAdmin.classList.add(
        "admin-comprobacion--error"
    );

    comprobacionAdmin.innerHTML = `
        <span class="admin-comprobacion__icono">
            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
            ></i>
        </span>

        <div>
            <strong>
                ${escaparHTML(titulo)}
            </strong>

            <p>
                ${escaparHTML(mensaje)}
            </p>
        </div>
    `;
}


function actualizarContadorVerificaciones() {
    if (!contadorVerificaciones) {
        return;
    }

    const total =
        verificacionesPendientes.length;

    contadorVerificaciones.textContent =
        `${total} ${
            total === 1
                ? "pendiente"
                : "pendientes"
        }`;
}


/* =====================================================
   MODAL DE RECHAZO
===================================================== */

function abrirModalRechazo(
    verificacionId,
    boton
) {
    if (!modalRechazarVerificacion) {
        return;
    }

    verificacionPendienteRechazar =
        Number(verificacionId);

    botonQueAbrioModalRechazo =
        boton ||
        null;

    motivoRechazoVerificacion.value =
        "";

    errorMotivoRechazo.textContent =
        "";

    modalRechazarVerificacion.classList.add(
        "visible"
    );

    modalRechazarVerificacion.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    setTimeout(() => {
        motivoRechazoVerificacion?.focus();
    }, 50);
}


function cerrarModalRechazoVerificacion() {
    modalRechazarVerificacion?.classList.remove(
        "visible"
    );

    modalRechazarVerificacion?.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    verificacionPendienteRechazar =
        null;

    motivoRechazoVerificacion.value =
        "";

    errorMotivoRechazo.textContent =
        "";

    botonQueAbrioModalRechazo?.focus();

    botonQueAbrioModalRechazo =
        null;
}


cerrarModalRechazo?.addEventListener(
    "click",
    cerrarModalRechazoVerificacion
);


cancelarRechazoVerificacion?.addEventListener(
    "click",
    cerrarModalRechazoVerificacion
);


modalRechazarVerificacion?.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            evento.target ===
            modalRechazarVerificacion
        ) {
            cerrarModalRechazoVerificacion();
        }
    }
);


document.addEventListener(
    "keydown",
    (
        evento
    ) => {
        if (
            evento.key ===
                "Escape" &&
            modalRechazarVerificacion
                ?.classList.contains(
                    "visible"
                )
        ) {
            cerrarModalRechazoVerificacion();
        }
    }
);


/* =====================================================
   PLANES PENDIENTES
===================================================== */

function formatearFechaPlanAdmin(
    fechaIso
) {
    if (!fechaIso) {
        return "Fecha pendiente";
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
            day:
                "numeric",

            month:
                "long",

            year:
                "numeric"
        }
    ).format(
        fecha
    );
}


function formatearPrecioPlanAdmin(
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


function actualizarContadorPlanesPendientes() {
    if (!contadorPlanesPendientes) {
        return;
    }

    const total =
        planesPendientesAdmin.length;

    contadorPlanesPendientes.textContent =
        `${total} ${
            total === 1
                ? "pendiente"
                : "pendientes"
        }`;
}


function crearPlanPendienteHTML(
    plan
) {
    const planId =
        escaparHTML(
            plan.plan_id ||
            ""
        );

    const titulo =
        escaparHTML(
            plan.titulo ||
            "Plan sin título"
        );

    const nombreAutor =
        escaparHTML(
            plan.nombre_visible ||
            "Usuario de Suralia"
        );

    const fotoAutor =
        escaparHTML(
            plan.foto_principal_url ||
            ""
        );

    const descripcion =
        escaparHTML(
            plan.descripcion ||
            ""
        );

    const categoria =
        escaparHTML(
            plan.nombre_categoria ||
            plan.categoria ||
            "Sin categoría"
        );

    const imagen =
        escaparHTML(
            plan.imagen_url ||
            "img/placeholder-plan.jpg"
        );

    const ubicacion =
        escaparHTML(
            plan.ubicacion ||
            "Ubicación pendiente"
        );

    const hora =
        escaparHTML(
            plan.hora
                ? String(
                    plan.hora
                ).slice(
                    0,
                    5
                )
                : "Hora pendiente"
        );

    const duracion =
        escaparHTML(
            plan.duracion ||
            "Duración pendiente"
        );

    const dificultad =
        escaparHTML(
            plan.dificultad ||
            "Sin indicar"
        );

    const provincia =
        escaparHTML(
            plan.provincia ||
            "Sevilla"
        );

    return `
        <article
            class="admin-plan"
            data-plan-pendiente-id="${planId}"
        >

            <div class="admin-plan__imagen">

                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >

                <span class="admin-plan__precio">
                    ${formatearPrecioPlanAdmin(
                        plan.precio
                    )}
                </span>

            </div>

            <div class="admin-plan__contenido">

                <div class="admin-plan__superior">

                    <div>

                        <span class="admin-plan__categoria">
                            ${categoria}
                        </span>

                        <h3>
                            ${titulo}
                        </h3>

                    </div>

                    <span class="admin-plan__estado">
                        Pendiente
                    </span>

                </div>

                <p class="admin-plan__descripcion">
                    ${descripcion}
                </p>

                <div class="admin-plan__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatearFechaPlanAdmin(
                            plan.fecha
                        )}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${hora}
                    </span>

                    <span>
                        <i class="fa-solid fa-hourglass-half"></i>
                        ${duracion}
                    </span>

                    <span>
                        <i class="fa-solid fa-user-group"></i>
                        ${Number(
                            plan.plazas ||
                            0
                        )} plazas
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${ubicacion}
                    </span>

                    <span>
                        <i class="fa-solid fa-map"></i>
                        ${provincia}
                    </span>

                    <span>
                        <i class="fa-solid fa-signal"></i>
                        ${dificultad}
                    </span>

                </div>

                <div class="admin-plan__autor">

                    ${
                        fotoAutor
                            ? `
                                <img
                                    src="${fotoAutor}"
                                    alt="Fotografía de ${nombreAutor}"
                                    loading="lazy"
                                >
                            `
                            : `
                                <span
                                    class="admin-plan__autor-avatar"
                                    aria-hidden="true"
                                >
                                    ${escaparHTML(
                                        obtenerInicialesAdmin(
                                            nombreAutor
                                        )
                                    )}
                                </span>
                            `
                    }

                    <div>

                        <small>
                            Publicado por
                        </small>

                        <strong>
                            ${nombreAutor}
                        </strong>

                    </div>

                </div>

                <div class="admin-plan__acciones">

                    <button
                        type="button"
                        class="admin-boton admin-boton--aprobar"
                        data-aprobar-plan="${planId}"
                    >
                        <i class="fa-solid fa-check"></i>
                        Aprobar
                    </button>

                    <button
                        type="button"
                        class="admin-boton admin-boton--peligro"
                        data-rechazar-plan="${planId}"
                    >
                        <i class="fa-solid fa-xmark"></i>
                        Rechazar
                    </button>

                </div>

            </div>

        </article>
    `;
}


function mostrarPlanesPendientes() {
    actualizarContadorPlanesPendientes();

    if (
        !listaPlanesPendientes ||
        !estadoPlanesPendientes
    ) {
        return;
    }

    if (
        planesPendientesAdmin.length ===
        0
    ) {
        listaPlanesPendientes.innerHTML =
            "";

        estadoPlanesPendientes.className =
            "admin-planes__estado admin-planes__estado--vacio";

        estadoPlanesPendientes.innerHTML = `
            <i
                class="fa-solid fa-circle-check"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No hay planes pendientes
                </strong>

                <p>
                    Las nuevas actividades enviadas aparecerán aquí.
                </p>
            </div>
        `;

        return;
    }

    estadoPlanesPendientes.className =
        "admin-planes__estado oculto";

    listaPlanesPendientes.innerHTML =
        planesPendientesAdmin
            .map(
                crearPlanPendienteHTML
            )
            .join("");

    activarAccionesPlanesPendientes();
}


async function cargarPlanesPendientesAdmin() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !listaPlanesPendientes ||
        !estadoPlanesPendientes
    ) {
        return;
    }

    estadoPlanesPendientes.className =
        "admin-planes__estado";

    estadoPlanesPendientes.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>

        Cargando planes...
    `;

    listaPlanesPendientes.innerHTML =
        "";

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "listar_planes_pendientes"
        );

        if (error) {
            throw error;
        }

        planesPendientesAdmin =
            Array.isArray(data)
                ? data
                : [];

        mostrarPlanesPendientes();
    } catch (error) {
        console.error(
            "No se pudieron cargar los planes pendientes:",
            error
        );

        planesPendientesAdmin =
            [];

        actualizarContadorPlanesPendientes();

        estadoPlanesPendientes.className =
            "admin-planes__estado admin-planes__estado--error";

        estadoPlanesPendientes.innerHTML = `
            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No se pudieron cargar los planes
                </strong>

                <p>
                    Revisa la consola y vuelve a intentarlo.
                </p>
            </div>
        `;
    }
}


async function revisarPlanAdmin(
    planId,
    nuevoEstado,
    motivo,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !planId
    ) {
        return false;
    }

    const contenidoOriginal =
        boton?.innerHTML ||
        "";

    if (boton) {
        boton.disabled =
            true;

        boton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
            Guardando...
        `;
    }

    try {
        const {
            error
        } = await cliente.rpc(
            "revisar_plan",
            {
                plan_buscado:
                    planId,

                nuevo_estado:
                    nuevoEstado,

                motivo:
                    motivo ||
                    null
            }
        );

        if (error) {
            throw error;
        }

        planesPendientesAdmin =
            planesPendientesAdmin.filter(
                (
                    plan
                ) =>
                    String(
                        plan.plan_id
                    ) !==
                    String(
                        planId
                    )
            );

        mostrarPlanesPendientes();

        if (
            nuevoEstado ===
            "publicado"
        ) {
            await cargarPlanesPublicadosAdmin();
        }

        return true;
    } catch (error) {
        console.error(
            "No se pudo revisar el plan:",
            error
        );

        alert(
            error?.message ||
            "No se ha podido guardar la revisión."
        );

        if (boton) {
            boton.disabled =
                false;

            boton.innerHTML =
                contenidoOriginal;
        }

        return false;
    }
}


function abrirModalRechazoPlan(
    planId,
    boton
) {
    planPendienteRechazar =
        planId;

    botonPlanPendienteRechazar =
        boton ||
        null;

    if (motivoRechazoPlan) {
        motivoRechazoPlan.value =
            "";
    }

    if (errorMotivoRechazoPlan) {
        errorMotivoRechazoPlan.textContent =
            "";
    }

    modalRechazarPlan?.classList.add(
        "visible"
    );

    modalRechazarPlan?.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    setTimeout(
        () => {
            motivoRechazoPlan?.focus();
        },
        50
    );
}


function cerrarModalRechazoPlanAdmin() {
    modalRechazarPlan?.classList.remove(
        "visible"
    );

    modalRechazarPlan?.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    botonPlanPendienteRechazar?.focus();

    planPendienteRechazar =
        null;

    botonPlanPendienteRechazar =
        null;

    if (motivoRechazoPlan) {
        motivoRechazoPlan.value =
            "";
    }

    if (errorMotivoRechazoPlan) {
        errorMotivoRechazoPlan.textContent =
            "";
    }
}


function activarAccionesPlanesPendientes() {
    document
        .querySelectorAll(
            "[data-aprobar-plan]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const confirmar =
                            window.confirm(
                                "¿Confirmas que este plan puede publicarse?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        await revisarPlanAdmin(
                            boton.dataset
                                .aprobarPlan,
                            "publicado",
                            null,
                            boton
                        );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            "[data-rechazar-plan]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        abrirModalRechazoPlan(
                            boton.dataset
                                .rechazarPlan,
                            boton
                        );
                    }
                );
            }
        );
}


confirmarRechazoPlan?.addEventListener(
    "click",
    async () => {
        const motivo =
            motivoRechazoPlan
                ?.value
                .trim() ||
            "";

        if (errorMotivoRechazoPlan) {
            errorMotivoRechazoPlan.textContent =
                "";
        }

        if (motivo.length < 5) {
            if (errorMotivoRechazoPlan) {
                errorMotivoRechazoPlan.textContent =
                    "Escribe un motivo un poco más detallado.";
            }

            motivoRechazoPlan?.focus();

            return;
        }

        confirmarRechazoPlan.disabled =
            true;

        const textoOriginal =
            confirmarRechazoPlan.innerHTML;

        confirmarRechazoPlan.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Guardando...
        `;

        const guardado =
            await revisarPlanAdmin(
                planPendienteRechazar,
                "rechazado",
                motivo,
                botonPlanPendienteRechazar
            );

        confirmarRechazoPlan.disabled =
            false;

        confirmarRechazoPlan.innerHTML =
            textoOriginal;

        if (guardado) {
            cerrarModalRechazoPlanAdmin();
        }
    }
);


[
    cerrarModalRechazarPlan,
    cancelarRechazoPlan
].forEach(
    (
        boton
    ) => {
        boton?.addEventListener(
            "click",
            cerrarModalRechazoPlanAdmin
        );
    }
);


modalRechazarPlan?.addEventListener(
    "click",
    (
        evento
    ) => {
        if (
            evento.target ===
            modalRechazarPlan
        ) {
            cerrarModalRechazoPlanAdmin();
        }
    }
);


/* =====================================================
   PLANES PUBLICADOS
===================================================== */

function actualizarContadorPlanesPublicados() {
    if (!contadorPlanesPublicados) {
        return;
    }

    const total =
        planesPublicadosAdmin.length;

    contadorPlanesPublicados.textContent =
        `${total} ${
            total === 1
                ? "publicado"
                : "publicados"
        }`;
}


function crearPlanPublicadoHTML(
    plan
) {
    const planId =
        escaparHTML(
            plan.plan_id ||
            ""
        );

    const titulo =
        escaparHTML(
            plan.titulo ||
            "Plan sin título"
        );

    const nombreAutor =
        escaparHTML(
            plan.nombre_visible ||
            "Usuario de Suralia"
        );

    const categoria =
        escaparHTML(
            plan.nombre_categoria ||
            plan.categoria ||
            "Sin categoría"
        );

    const imagen =
        escaparHTML(
            plan.imagen_url ||
            "img/placeholder-plan.jpg"
        );

    const ubicacion =
        escaparHTML(
            plan.ubicacion ||
            "Ubicación pendiente"
        );

    const hora =
        escaparHTML(
            plan.hora
                ? String(
                    plan.hora
                ).slice(
                    0,
                    5
                )
                : "Hora pendiente"
        );

    const enlaceDetalle =
        `detalle-plan.html?id=${encodeURIComponent(
            plan.plan_id ||
            ""
        )}`;

    return `
        <article
            class="admin-plan admin-plan--publicado"
            data-plan-publicado-id="${planId}"
        >

            <div class="admin-plan__imagen">

                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >

                <span class="admin-plan__precio">
                    ${formatearPrecioPlanAdmin(
                        plan.precio
                    )}
                </span>

            </div>

            <div class="admin-plan__contenido">

                <div class="admin-plan__superior">

                    <div>

                        <span class="admin-plan__categoria">
                            ${categoria}
                        </span>

                        <h3>
                            ${titulo}
                        </h3>

                    </div>

                    <span class="admin-plan__estado admin-plan__estado--publicado">
                        Publicado
                    </span>

                </div>

                <div class="admin-plan__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatearFechaPlanAdmin(
                            plan.fecha
                        )}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${hora}
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${ubicacion}
                    </span>

                    <span>
                        <i class="fa-solid fa-user"></i>
                        ${nombreAutor}
                    </span>

                    <span>
                        <i class="fa-solid fa-images"></i>
                        ${
                            [
                                plan.imagen_url,
                                plan.imagen_2_url,
                                plan.imagen_3_url
                            ].filter(Boolean).length
                        } imágenes
                    </span>

                </div>

                <div class="admin-plan__acciones">

                    <a
                        href="${escaparHTML(
                            enlaceDetalle
                        )}"
                        class="admin-boton admin-boton--secundario"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-solid fa-up-right-from-square"></i>
                        Abrir detalle
                    </a>

                    <button
                        type="button"
                        class="admin-boton admin-boton--peligro"
                        data-eliminar-plan-publicado="${planId}"
                        data-titulo-plan="${titulo}"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Eliminar
                    </button>

                </div>

            </div>

        </article>
    `;
}


function mostrarPlanesPublicados() {
    actualizarContadorPlanesPublicados();

    if (
        !listaPlanesPublicados ||
        !estadoPlanesPublicados
    ) {
        return;
    }

    if (
        planesPublicadosAdmin.length ===
        0
    ) {
        listaPlanesPublicados.innerHTML =
            "";

        estadoPlanesPublicados.className =
            "admin-planes__estado admin-planes__estado--vacio";

        estadoPlanesPublicados.innerHTML = `
            <i
                class="fa-regular fa-calendar"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No hay planes publicados
                </strong>

                <p>
                    Los planes aprobados aparecerán aquí.
                </p>
            </div>
        `;

        return;
    }

    estadoPlanesPublicados.className =
        "admin-planes__estado oculto";

    listaPlanesPublicados.innerHTML =
        planesPublicadosAdmin
            .map(
                crearPlanPublicadoHTML
            )
            .join("");

    activarAccionesPlanesPublicados();
}


async function cargarPlanesPublicadosAdmin() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !listaPlanesPublicados ||
        !estadoPlanesPublicados
    ) {
        return;
    }

    estadoPlanesPublicados.className =
        "admin-planes__estado";

    estadoPlanesPublicados.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>

        Cargando planes publicados...
    `;

    listaPlanesPublicados.innerHTML =
        "";

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "listar_planes_publicados_admin"
        );

        if (error) {
            throw error;
        }

        planesPublicadosAdmin =
            Array.isArray(data)
                ? data
                : [];

        mostrarPlanesPublicados();
    } catch (error) {
        console.error(
            "No se pudieron cargar los planes publicados:",
            error
        );

        planesPublicadosAdmin =
            [];

        actualizarContadorPlanesPublicados();

        estadoPlanesPublicados.className =
            "admin-planes__estado admin-planes__estado--error";

        estadoPlanesPublicados.innerHTML = `
            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No se pudieron cargar los planes publicados
                </strong>

                <p>
                    Revisa la consola y vuelve a intentarlo.
                </p>
            </div>
        `;
    }
}


async function eliminarImagenesPlanStorage(
    rutas
) {
    const cliente =
        window.clienteSupabase;

    const rutasValidas =
        rutas
            .filter(Boolean)
            .map(
                (
                    ruta
                ) => String(
                    ruta
                ).trim()
            )
            .filter(Boolean);

    if (
        !cliente ||
        rutasValidas.length ===
        0
    ) {
        return true;
    }

    const {
        error
    } = await cliente
        .storage
        .from(
            BUCKET_IMAGENES_PLANES
        )
        .remove(
            rutasValidas
        );

    if (error) {
        console.error(
            "El plan se eliminó, pero no se pudieron borrar todas sus imágenes:",
            error
        );

        return false;
    }

    return true;
}


async function eliminarPlanPublicadoAdmin(
    planId,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !planId
    ) {
        return;
    }

    const contenidoOriginal =
        boton?.innerHTML ||
        "";

    if (boton) {
        boton.disabled =
            true;

        boton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
            Eliminando...
        `;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "eliminar_plan_admin",
            {
                plan_buscado:
                    planId
            }
        );

        if (error) {
            throw error;
        }

        const rutasDevueltas =
            Array.isArray(data) &&
            data.length > 0
                ? data[0]
                : {};

        const imagenesEliminadas =
            await eliminarImagenesPlanStorage(
                [
                    rutasDevueltas
                        .ruta_storage,
                    rutasDevueltas
                        .ruta_storage_2,
                    rutasDevueltas
                        .ruta_storage_3
                ]
            );

        planesPublicadosAdmin =
            planesPublicadosAdmin.filter(
                (
                    plan
                ) =>
                    String(
                        plan.plan_id
                    ) !==
                    String(
                        planId
                    )
            );

        mostrarPlanesPublicados();

        if (!imagenesEliminadas) {
            alert(
                "El plan se ha eliminado del catálogo, pero alguna imagen no pudo borrarse del almacenamiento. Revisa la consola."
            );
        }
    } catch (error) {
        console.error(
            "No se pudo eliminar el plan publicado:",
            error
        );

        alert(
            error?.message ||
            "No se ha podido eliminar el plan."
        );

        if (boton) {
            boton.disabled =
                false;

            boton.innerHTML =
                contenidoOriginal;
        }
    }
}


function activarAccionesPlanesPublicados() {
    document
        .querySelectorAll(
            "[data-eliminar-plan-publicado]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const titulo =
                            boton.dataset
                                .tituloPlan ||
                            "este plan";

                        const confirmar =
                            window.confirm(
                                `¿Eliminar definitivamente "${titulo}"?\n\nTambién se borrarán sus imágenes. Esta acción no se puede deshacer.`
                            );

                        if (!confirmar) {
                            return;
                        }

                        await eliminarPlanPublicadoAdmin(
                            boton.dataset
                                .eliminarPlanPublicado,
                            boton
                        );
                    }
                );
            }
        );
}


/* =====================================================
   USUARIOS Y ROLES
===================================================== */

function obtenerTextoRol(
    rol
) {
    const textos = {
        usuario:
            "Usuario",

        moderador:
            "Moderador",

        administrador:
            "Administrador"
    };

    return textos[rol] ||
        "Usuario";
}


function obtenerClaseRol(
    rol
) {
    const clases = {
        usuario:
            "admin-rol--usuario",

        moderador:
            "admin-rol--moderador",

        administrador:
            "admin-rol--administrador"
    };

    return clases[rol] ||
        clases.usuario;
}


function obtenerInicialesAdmin(
    nombre = ""
) {
    return String(nombre)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            (
                parte
            ) => parte.charAt(0)
        )
        .join("")
        .toUpperCase() ||
        "SU";
}


function actualizarContadorUsuarios() {
    if (!contadorUsuariosAdmin) {
        return;
    }

    const total =
        usuariosAdmin.length;

    contadorUsuariosAdmin.textContent =
        `${total} ${
            total === 1
                ? "usuario"
                : "usuarios"
        }`;
}


function crearUsuarioAdminHTML(
    usuario
) {
    const usuarioId =
        escaparHTML(
            usuario.usuario_id ||
            ""
        );

    const nombre =
        escaparHTML(
            usuario.nombre_visible ||
            "Usuario de Suralia"
        );

    const foto =
        escaparHTML(
            usuario.foto_principal_url ||
            ""
        );

    const rol =
        String(
            usuario.rol ||
            "usuario"
        );

    const esUsuarioActual =
        Boolean(
            usuario.es_usuario_actual
        );

    const textoRol =
        escaparHTML(
            obtenerTextoRol(
                rol
            )
        );

    const claseRol =
        escaparHTML(
            obtenerClaseRol(
                rol
            )
        );

    return `
        <article
            class="admin-usuario"
            data-usuario-id="${usuarioId}"
        >

            <div class="admin-usuario__identidad">

                ${
                    foto
                        ? `
                            <img
                                src="${foto}"
                                alt="Fotografía de ${nombre}"
                                loading="lazy"
                            >
                        `
                        : `
                            <span
                                class="admin-usuario__avatar"
                                aria-hidden="true"
                            >
                                ${escaparHTML(
                                    obtenerInicialesAdmin(
                                        nombre
                                    )
                                )}
                            </span>
                        `
                }

                <div>

                    <div class="admin-usuario__nombre">

                        <h3>
                            ${nombre}
                        </h3>

                        ${
                            esUsuarioActual
                                ? `
                                    <span class="admin-usuario__actual">
                                        Tu cuenta
                                    </span>
                                `
                                : ""
                        }

                    </div>

                    <span class="admin-rol ${claseRol}">
                        ${textoRol}
                    </span>

                </div>

            </div>

            <div class="admin-usuario__acciones">

                <label
                    for="rol-${usuarioId}"
                >
                    Rol
                </label>

                <select
                    id="rol-${usuarioId}"
                    data-cambiar-rol="${usuarioId}"
                    data-rol-actual="${escaparHTML(rol)}"
                    ${
                        esUsuarioActual
                            ? "disabled"
                            : ""
                    }
                >
                    <option
                        value="usuario"
                        ${
                            rol === "usuario"
                                ? "selected"
                                : ""
                        }
                    >
                        Usuario
                    </option>

                    <option
                        value="moderador"
                        ${
                            rol === "moderador"
                                ? "selected"
                                : ""
                        }
                    >
                        Moderador
                    </option>

                    <option
                        value="administrador"
                        ${
                            rol === "administrador"
                                ? "selected"
                                : ""
                        }
                    >
                        Administrador
                    </option>
                </select>

                ${
                    esUsuarioActual
                        ? `
                            <small>
                                No puedes modificar tu propio rol.
                            </small>
                        `
                        : `
                            <small>
                                El cambio se guarda al seleccionar un rol.
                            </small>
                        `
                }

            </div>

        </article>
    `;
}


function mostrarUsuariosAdmin() {
    actualizarContadorUsuarios();

    if (
        !listaUsuariosAdmin ||
        !estadoUsuariosAdmin
    ) {
        return;
    }

    if (
        usuariosAdmin.length ===
        0
    ) {
        listaUsuariosAdmin.innerHTML =
            "";

        estadoUsuariosAdmin.className =
            "admin-usuarios__estado admin-usuarios__estado--vacio";

        estadoUsuariosAdmin.innerHTML = `
            <i
                class="fa-regular fa-user"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No hay usuarios disponibles
                </strong>

                <p>
                    Los perfiles registrados aparecerán aquí.
                </p>
            </div>
        `;

        return;
    }

    estadoUsuariosAdmin.className =
        "admin-usuarios__estado oculto";

    listaUsuariosAdmin.innerHTML =
        usuariosAdmin
            .map(
                crearUsuarioAdminHTML
            )
            .join("");

    activarCambiosRol();
}


async function cargarUsuariosAdmin() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !listaUsuariosAdmin ||
        !estadoUsuariosAdmin
    ) {
        return;
    }

    estadoUsuariosAdmin.className =
        "admin-usuarios__estado";

    estadoUsuariosAdmin.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>

        Cargando usuarios...
    `;

    listaUsuariosAdmin.innerHTML =
        "";

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "listar_usuarios_admin"
        );

        if (error) {
            throw error;
        }

        usuariosAdmin =
            Array.isArray(data)
                ? data
                : [];

        mostrarUsuariosAdmin();
    } catch (error) {
        console.error(
            "No se pudieron cargar los usuarios:",
            error
        );

        usuariosAdmin =
            [];

        actualizarContadorUsuarios();

        estadoUsuariosAdmin.className =
            "admin-usuarios__estado admin-usuarios__estado--error";

        estadoUsuariosAdmin.innerHTML = `
            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No se pudieron cargar los usuarios
                </strong>

                <p>
                    Revisa la consola y vuelve a intentarlo.
                </p>
            </div>
        `;
    }
}


async function cambiarRolUsuario(
    usuarioId,
    nuevoRol,
    selector
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !usuarioId ||
        !selector
    ) {
        return;
    }

    const rolAnterior =
        selector.dataset
            .rolActual ||
        "usuario";

    selector.disabled =
        true;

    try {
        const {
            error
        } = await cliente.rpc(
            "cambiar_rol_usuario",
            {
                usuario_buscado:
                    usuarioId,

                nuevo_rol:
                    nuevoRol
            }
        );

        if (error) {
            throw error;
        }

        selector.dataset.rolActual =
            nuevoRol;

        const usuarioActualizado =
            usuariosAdmin.find(
                (
                    usuario
                ) =>
                    usuario.usuario_id ===
                    usuarioId
            );

        if (usuarioActualizado) {
            usuarioActualizado.rol =
                nuevoRol;
        }

        mostrarUsuariosAdmin();
    } catch (error) {
        console.error(
            "No se pudo cambiar el rol del usuario:",
            error
        );

        selector.value =
            rolAnterior;

        alert(
            error?.message ||
            "No se ha podido cambiar el rol."
        );

        selector.disabled =
            false;
    }
}


function activarCambiosRol() {
    document
        .querySelectorAll(
            "[data-cambiar-rol]"
        )
        .forEach(
            (
                selector
            ) => {
                selector.addEventListener(
                    "change",
                    async () => {
                        const usuarioId =
                            selector.dataset
                                .cambiarRol;

                        const nuevoRol =
                            selector.value;

                        const rolAnterior =
                            selector.dataset
                                .rolActual;

                        if (
                            nuevoRol ===
                            rolAnterior
                        ) {
                            return;
                        }

                        const confirmar =
                            window.confirm(
                                `¿Confirmas el cambio de rol a ${obtenerTextoRol(
                                    nuevoRol
                                )}?`
                            );

                        if (!confirmar) {
                            selector.value =
                                rolAnterior;

                            return;
                        }

                        await cambiarRolUsuario(
                            usuarioId,
                            nuevoRol,
                            selector
                        );
                    }
                );
            }
        );
}


/* =====================================================
   SELFIES Y TARJETAS DE VERIFICACIÓN
===================================================== */

async function obtenerUrlSelfie(
    rutaStorage
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !rutaStorage
    ) {
        return "";
    }

    const {
        data,
        error
    } = await cliente
        .storage
        .from(
            BUCKET_VERIFICACIONES
        )
        .createSignedUrl(
            rutaStorage,
            600
        );

    if (error) {
        throw error;
    }

    return data?.signedUrl ||
        "";
}


async function prepararVerificacion(
    verificacion
) {
    try {
        const selfieUrl =
            await obtenerUrlSelfie(
                verificacion.ruta_storage
            );

        return {
            ...verificacion,
            selfie_url_temporal:
                selfieUrl
        };
    } catch (error) {
        console.error(
            "No se pudo generar la URL de la selfie:",
            error
        );

        return {
            ...verificacion,
            selfie_url_temporal:
                ""
        };
    }
}


function crearVerificacionHTML(
    verificacion
) {
    const id =
        Number(
            verificacion.verificacion_id
        );

    const nombre =
        escaparHTML(
            verificacion.nombre_visible ||
            "Usuario de Suralia"
        );

    const fotoPerfil =
        escaparHTML(
            verificacion.foto_principal_url ||
            ""
        );

    const selfie =
        escaparHTML(
            verificacion.selfie_url_temporal ||
            ""
        );

    const codigo =
        escaparHTML(
            verificacion.codigo_verificacion ||
            "Sin código"
        );

    const fecha =
        escaparHTML(
            formatearFechaAdmin(
                verificacion.enviado_en
            )
        );

    return `
        <article
            class="admin-verificacion"
            data-verificacion-id="${id}"
        >

            <div class="admin-verificacion__identidad">

                <div class="admin-verificacion__perfil">

                    ${
                        fotoPerfil
                            ? `
                                <img
                                    src="${fotoPerfil}"
                                    alt="Fotografía principal de ${nombre}"
                                    loading="lazy"
                                >
                            `
                            : `
                                <span>
                                    <i
                                        class="fa-regular fa-user"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            `
                    }

                    <div>

                        <span class="admin-verificacion__etiqueta">
                            Perfil
                        </span>

                        <h3>
                            ${nombre}
                        </h3>

                        <p>
                            Solicitud enviada el ${fecha}
                        </p>

                    </div>

                </div>

                <div class="admin-verificacion__codigo">

                    <span>
                        Código solicitado
                    </span>

                    <strong>
                        ${codigo}
                    </strong>

                </div>

            </div>

            <div class="admin-verificacion__imagenes">

                <figure>

                    <figcaption>
                        Fotografía del perfil
                    </figcaption>

                    ${
                        fotoPerfil
                            ? `
                                <img
                                    src="${fotoPerfil}"
                                    alt="Fotografía del perfil de ${nombre}"
                                    loading="lazy"
                                >
                            `
                            : `
                                <div class="admin-verificacion__sin-imagen">
                                    <i
                                        class="fa-regular fa-image"
                                        aria-hidden="true"
                                    ></i>

                                    Sin fotografía principal
                                </div>
                            `
                    }

                </figure>

                <figure>

                    <figcaption>
                        Selfie de verificación
                    </figcaption>

                    ${
                        selfie
                            ? `
                                <a
                                    href="${selfie}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="admin-verificacion__selfie"
                                    aria-label="Abrir selfie de ${nombre} en tamaño completo"
                                >
                                    <img
                                        src="${selfie}"
                                        alt="Selfie de verificación de ${nombre}"
                                    >

                                    <span>
                                        <i
                                            class="fa-solid fa-up-right-from-square"
                                            aria-hidden="true"
                                        ></i>

                                        Ampliar
                                    </span>
                                </a>
                            `
                            : `
                                <div class="admin-verificacion__sin-imagen">
                                    <i
                                        class="fa-solid fa-triangle-exclamation"
                                        aria-hidden="true"
                                    ></i>

                                    No se pudo cargar la selfie
                                </div>
                            `
                    }

                </figure>

            </div>

            <div class="admin-verificacion__acciones">

                <button
                    type="button"
                    class="admin-boton admin-boton--aprobar"
                    data-aprobar-verificacion="${id}"
                >
                    <i
                        class="fa-solid fa-check"
                        aria-hidden="true"
                    ></i>

                    Aprobar
                </button>

                <button
                    type="button"
                    class="admin-boton admin-boton--peligro"
                    data-rechazar-verificacion="${id}"
                >
                    <i
                        class="fa-solid fa-xmark"
                        aria-hidden="true"
                    ></i>

                    Rechazar
                </button>

            </div>

        </article>
    `;
}


function mostrarVerificacionesPendientes() {
    actualizarContadorVerificaciones();

    if (
        !listaVerificaciones ||
        !estadoVerificaciones
    ) {
        return;
    }

    if (
        verificacionesPendientes.length ===
        0
    ) {
        listaVerificaciones.innerHTML =
            "";

        estadoVerificaciones.className =
            "admin-verificaciones__estado admin-verificaciones__estado--vacio";

        estadoVerificaciones.innerHTML = `
            <i
                class="fa-solid fa-circle-check"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No hay verificaciones pendientes
                </strong>

                <p>
                    Las nuevas solicitudes aparecerán aquí.
                </p>
            </div>
        `;

        return;
    }

    estadoVerificaciones.className =
        "admin-verificaciones__estado oculto";

    listaVerificaciones.innerHTML =
        verificacionesPendientes
            .map(
                crearVerificacionHTML
            )
            .join("");

    activarAccionesVerificaciones();
}


/* =====================================================
   CARGAR Y REVISAR VERIFICACIONES
===================================================== */

async function cargarVerificacionesPendientes() {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !listaVerificaciones ||
        !estadoVerificaciones
    ) {
        return;
    }

    estadoVerificaciones.className =
        "admin-verificaciones__estado";

    estadoVerificaciones.innerHTML = `
        <i
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
        ></i>

        Cargando verificaciones...
    `;

    listaVerificaciones.innerHTML =
        "";

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "listar_verificaciones_pendientes"
        );

        if (error) {
            throw error;
        }

        const recibidas =
            Array.isArray(data)
                ? data
                : [];

        verificacionesPendientes =
            await Promise.all(
                recibidas.map(
                    prepararVerificacion
                )
            );

        mostrarVerificacionesPendientes();
    } catch (error) {
        console.error(
            "No se pudieron cargar las verificaciones pendientes:",
            error
        );

        verificacionesPendientes =
            [];

        actualizarContadorVerificaciones();

        estadoVerificaciones.className =
            "admin-verificaciones__estado admin-verificaciones__estado--error";

        estadoVerificaciones.innerHTML = `
            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
            ></i>

            <div>
                <strong>
                    No se pudieron cargar las solicitudes
                </strong>

                <p>
                    Revisa la consola y vuelve a intentarlo.
                </p>
            </div>
        `;
    }
}


async function revisarVerificacion(
    verificacionId,
    nuevoEstado,
    motivo,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !verificacionId
    ) {
        return;
    }

    const contenidoOriginal =
        boton?.innerHTML ||
        "";

    if (boton) {
        boton.disabled =
            true;

        boton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>

            Guardando...
        `;
    }

    try {
        const {
            error
        } = await cliente.rpc(
            "revisar_verificacion_perfil",
            {
                verificacion_buscada:
                    Number(
                        verificacionId
                    ),

                nuevo_estado:
                    nuevoEstado,

                motivo:
                    motivo ||
                    null
            }
        );

        if (error) {
            throw error;
        }

        verificacionesPendientes =
            verificacionesPendientes.filter(
                (
                    verificacion
                ) => {
                    return (
                        Number(
                            verificacion
                                .verificacion_id
                        ) !==
                        Number(
                            verificacionId
                        )
                    );
                }
            );

        mostrarVerificacionesPendientes();
    } catch (error) {
        console.error(
            "No se pudo revisar la verificación:",
            error
        );

        alert(
            error?.message ||
            "No se ha podido guardar la revisión."
        );

        if (boton) {
            boton.disabled =
                false;

            boton.innerHTML =
                contenidoOriginal;
        }
    }
}


function activarAccionesVerificaciones() {
    document
        .querySelectorAll(
            "[data-aprobar-verificacion]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const confirmar =
                            window.confirm(
                                "¿Confirmas que esta identidad puede marcarse como verificada?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        await revisarVerificacion(
                            boton.dataset
                                .aprobarVerificacion,
                            "verificado",
                            null,
                            boton
                        );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            "[data-rechazar-verificacion]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        abrirModalRechazo(
                            boton.dataset
                                .rechazarVerificacion,
                            boton
                        );
                    }
                );
            }
        );
}


confirmarRechazoVerificacion?.addEventListener(
    "click",
    async () => {
        const motivo =
            motivoRechazoVerificacion
                ?.value
                .trim() ||
            "";

        errorMotivoRechazo.textContent =
            "";

        if (
            motivo.length <
            5
        ) {
            errorMotivoRechazo.textContent =
                "Escribe un motivo un poco más detallado.";

            motivoRechazoVerificacion?.focus();

            return;
        }

        confirmarRechazoVerificacion.disabled =
            true;

        const textoOriginal =
            confirmarRechazoVerificacion.innerHTML;

        confirmarRechazoVerificacion.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>

            Rechazando...
        `;

        const id =
            verificacionPendienteRechazar;

        try {
            await revisarVerificacion(
                id,
                "rechazado",
                motivo,
                null
            );

            cerrarModalRechazoVerificacion();
        } finally {
            confirmarRechazoVerificacion.disabled =
                false;

            confirmarRechazoVerificacion.innerHTML =
                textoOriginal;
        }
    }
);


/* =====================================================
   PROTEGER Y MOSTRAR EL PANEL
===================================================== */

async function protegerPanelAdministracion() {
    const cliente =
        window.clienteSupabase;

    if (!cliente?.auth) {
        mostrarErrorAccesoAdmin(
            "No se ha podido conectar",
            "Recarga la página para volver a intentarlo."
        );

        return;
    }

    try {
        const {
            data: datosSesion,
            error: errorSesion
        } = await cliente.auth.getSession();

        if (errorSesion) {
            throw errorSesion;
        }

        const usuario =
            datosSesion.session?.user;

        if (!usuario) {
            sessionStorage.setItem(
                "destinoDespuesLoginSuralia",
                "admin.html"
            );

            window.location.replace(
                "login.html?redirect=admin.html"
            );

            return;
        }

        const {
            data: esAdministrador,
            error: errorRol
        } = await cliente.rpc(
            "es_administrador"
        );

        if (errorRol) {
            throw errorRol;
        }

        if (esAdministrador !== true) {
            mostrarErrorAccesoAdmin(
                "Acceso no autorizado",
                "Tu cuenta no tiene permisos para entrar en esta sección."
            );

            setTimeout(() => {
                window.location.replace(
                    "index.html"
                );
            }, 1800);

            return;
        }

        comprobacionAdmin?.remove();

        if (contenidoAdmin) {
            contenidoAdmin.hidden =
                false;
        }

        if (footerAdmin) {
            footerAdmin.hidden =
                false;
        }

        document.body.classList.remove(
            "pagina-admin--comprobando"
        );

        await Promise.all([
            cargarPlanesPendientesAdmin(),
            cargarPlanesPublicadosAdmin(),
            cargarUsuariosAdmin(),
            cargarVerificacionesPendientes()
        ]);
    } catch (error) {
        console.error(
            "No se pudo comprobar el acceso al panel:",
            error
        );

        mostrarErrorAccesoAdmin(
            "No se pudo verificar el acceso",
            "Comprueba la conexión y recarga la página."
        );
    }
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        protegerPanelAdministracion
    );
} else {
    protegerPanelAdministracion();
}