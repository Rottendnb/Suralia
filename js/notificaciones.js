/* ============================================================
   SURALIA · CAMPANA DE NOTIFICACIONES
   Archivo: js/notificaciones.js

   Requisitos:
   - @supabase/supabase-js cargado
   - js/supabase-config.js cargado
   - window.clienteSupabase disponible
============================================================ */

(() => {
    "use strict";

    /*
       Evita inicializar dos veces la campana si alguna página
       carga notificaciones.js directamente y main.js también
       intenta cargarlo de forma global.
    */
    if (
        window.__suraliaNotificacionesInicializado
    ) {
        return;
    }

    window.__suraliaNotificacionesInicializado =
        true;

    const SELECTOR_HEADER_ACCIONES =
        ".header__acciones";

    const LIMITE_NOTIFICACIONES =
        20;

    let usuarioNotificaciones =
        null;

    let notificacionesActuales =
        [];

    let canalNotificaciones =
        null;

    let componenteCreado =
        false;


    /* ========================================================
       UTILIDADES
    ======================================================== */

    function escaparHTML(
        valor = ""
    ) {
        return String(
            valor
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    function esperar(
        milisegundos
    ) {
        return new Promise(
            (
                resolver
            ) => {
                window.setTimeout(
                    resolver,
                    milisegundos
                );
            }
        );
    }


    async function esperarClienteSupabase(
        intentosMaximos = 80
    ) {
        for (
            let intento = 0;
            intento < intentosMaximos;
            intento += 1
        ) {
            if (
                window.clienteSupabase?.auth
            ) {
                return window.clienteSupabase;
            }

            await esperar(
                50
            );
        }

        return null;
    }


    function formatearFechaNotificacion(
        fechaIso
    ) {
        if (!fechaIso) {
            return "";
        }

        const fecha =
            new Date(
                fechaIso
            );

        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {
            return "";
        }

        const diferenciaMs =
            fecha.getTime() -
            Date.now();

        const diferenciaMinutos =
            Math.round(
                diferenciaMs /
                60000
            );

        const diferenciaHoras =
            Math.round(
                diferenciaMs /
                3600000
            );

        const diferenciaDias =
            Math.round(
                diferenciaMs /
                86400000
            );

        const relativo =
            new Intl.RelativeTimeFormat(
                "es",
                {
                    numeric:
                        "auto"
                }
            );

        if (
            Math.abs(
                diferenciaMinutos
            ) <
            60
        ) {
            return relativo.format(
                diferenciaMinutos,
                "minute"
            );
        }

        if (
            Math.abs(
                diferenciaHoras
            ) <
            24
        ) {
            return relativo.format(
                diferenciaHoras,
                "hour"
            );
        }

        if (
            Math.abs(
                diferenciaDias
            ) <=
            7
        ) {
            return relativo.format(
                diferenciaDias,
                "day"
            );
        }

        return new Intl.DateTimeFormat(
            "es-ES",
            {
                day:
                    "numeric",
                month:
                    "short",
                year:
                    "numeric"
            }
        ).format(
            fecha
        );
    }


    function obtenerIconoTipo(
        tipo
    ) {
        const iconos = {
            nueva_reserva:
                "fa-solid fa-calendar-check",

            reserva_cancelada_usuario:
                "fa-solid fa-calendar-xmark",

            reserva_cancelada_organizador:
                "fa-solid fa-circle-exclamation",

            plan_pendiente_admin:
                "fa-solid fa-clipboard-check",

            plan_aprobado:
                "fa-solid fa-circle-check",

            plan_rechazado:
                "fa-solid fa-circle-xmark",

            verificacion_aprobada:
                "fa-solid fa-circle-check",

            verificacion_rechazada:
                "fa-solid fa-circle-xmark",

            mensaje:
                "fa-solid fa-comment",

            solicitud_conexion:
                "fa-solid fa-user-plus"
        };

        return iconos[
            tipo
        ] ||
            "fa-regular fa-bell";
    }


    function obtenerElementos() {
        return {
            raiz:
                document.querySelector(
                    "#notificaciones-cabecera"
                ),

            boton:
                document.querySelector(
                    "#boton-notificaciones"
                ),

            contador:
                document.querySelector(
                    "#contador-notificaciones"
                ),

            panel:
                document.querySelector(
                    "#panel-notificaciones"
                ),

            lista:
                document.querySelector(
                    "#lista-notificaciones"
                ),

            vacio:
                document.querySelector(
                    "#notificaciones-vacias"
                ),

            marcarTodas:
                document.querySelector(
                    "#marcar-notificaciones-leidas"
                )
        };
    }


    /* ========================================================
       CREAR UI
    ======================================================== */

    function crearComponenteNotificaciones() {
        if (componenteCreado) {
            return true;
        }

        const accionesHeader =
            document.querySelector(
                SELECTOR_HEADER_ACCIONES
            );

        if (!accionesHeader) {
            return false;
        }

        const contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "notificaciones-cabecera";

        contenedor.id =
            "notificaciones-cabecera";

        contenedor.innerHTML = `
            <button
                type="button"
                class="notificaciones-cabecera__boton"
                id="boton-notificaciones"
                aria-label="Abrir notificaciones"
                aria-expanded="false"
                aria-haspopup="true"
                aria-controls="panel-notificaciones"
            >
                <i
                    class="fa-regular fa-bell"
                    aria-hidden="true"
                ></i>

                <span
                    class="notificaciones-cabecera__contador oculto"
                    id="contador-notificaciones"
                    aria-live="polite"
                >
                    0
                </span>
            </button>

            <div
                class="notificaciones-cabecera__panel"
                id="panel-notificaciones"
                hidden
            >
                <div class="notificaciones-cabecera__cabecera">

                    <div>
                        <span class="notificaciones-cabecera__subtitulo">
                            Suralia
                        </span>

                        <h2>
                            Notificaciones
                        </h2>
                    </div>

                    <button
                        type="button"
                        class="notificaciones-cabecera__marcar"
                        id="marcar-notificaciones-leidas"
                    >
                        Marcar todas como leídas
                    </button>

                </div>

                <div
                    class="notificaciones-cabecera__lista"
                    id="lista-notificaciones"
                    role="list"
                ></div>

                <div
                    class="notificaciones-cabecera__vacio"
                    id="notificaciones-vacias"
                    hidden
                >
                    <span>
                        <i
                            class="fa-regular fa-bell"
                            aria-hidden="true"
                        ></i>
                    </span>

                    <strong>
                        Todo al día
                    </strong>

                    <p>
                        Aquí aparecerán tus avisos de Suralia.
                    </p>
                </div>
            </div>
        `;

        accionesHeader.insertBefore(
            contenedor,
            accionesHeader.firstChild
        );

        componenteCreado =
            true;

        activarEventosComponente();

        return true;
    }


    /* ========================================================
       RENDER
    ======================================================== */

    function actualizarContador() {
        const {
            contador,
            marcarTodas
        } = obtenerElementos();

        const totalNoLeidas =
            notificacionesActuales.filter(
                (
                    notificacion
                ) =>
                    !notificacion.leida
            ).length;

        if (contador) {
            contador.textContent =
                totalNoLeidas > 99
                    ? "99+"
                    : String(
                        totalNoLeidas
                    );

            contador.classList.toggle(
                "oculto",
                totalNoLeidas ===
                    0
            );

            contador.setAttribute(
                "aria-label",
                `${totalNoLeidas} ${
                    totalNoLeidas ===
                        1
                        ? "notificación sin leer"
                        : "notificaciones sin leer"
                }`
            );
        }

        if (marcarTodas) {
            marcarTodas.disabled =
                totalNoLeidas ===
                0;
        }
    }


    function crearNotificacionHTML(
        notificacion
    ) {
        const id =
            escaparHTML(
                notificacion.id
            );

        const titulo =
            escaparHTML(
                notificacion.titulo ||
                "Notificación"
            );

        const mensaje =
            escaparHTML(
                notificacion.mensaje ||
                ""
            );

        const enlace =
            escaparHTML(
                notificacion.enlace ||
                ""
            );

        const fecha =
            escaparHTML(
                formatearFechaNotificacion(
                    notificacion.creado_en
                )
            );

        const icono =
            obtenerIconoTipo(
                notificacion.tipo
            );

        const claseNoLeida =
            notificacion.leida
                ? ""
                : " notificaciones-cabecera__item--no-leida";

        return `
            <article
                class="notificaciones-cabecera__item${claseNoLeida}"
                data-notificacion-id="${id}"
                data-notificacion-enlace="${enlace}"
                role="listitem"
            >

                <button
                    type="button"
                    class="notificaciones-cabecera__item-boton"
                    data-abrir-notificacion="${id}"
                >

                    <span class="notificaciones-cabecera__icono">
                        <i
                            class="${icono}"
                            aria-hidden="true"
                        ></i>
                    </span>

                    <span class="notificaciones-cabecera__contenido">

                        <span class="notificaciones-cabecera__titulo">
                            ${titulo}
                        </span>

                        <span class="notificaciones-cabecera__mensaje">
                            ${mensaje}
                        </span>

                        <span class="notificaciones-cabecera__fecha">
                            ${fecha}
                        </span>

                    </span>

                    ${
                        !notificacion.leida
                            ? `
                                <span
                                    class="notificaciones-cabecera__punto"
                                    aria-label="Sin leer"
                                ></span>
                            `
                            : ""
                    }

                </button>

            </article>
        `;
    }


    function renderizarNotificaciones() {
        const {
            lista,
            vacio
        } = obtenerElementos();

        if (
            !lista ||
            !vacio
        ) {
            return;
        }

        if (
            notificacionesActuales.length ===
            0
        ) {
            lista.innerHTML =
                "";

            vacio.hidden =
                false;

            actualizarContador();

            return;
        }

        vacio.hidden =
            true;

        lista.innerHTML =
            notificacionesActuales
                .map(
                    crearNotificacionHTML
                )
                .join(
                    ""
                );

        actualizarContador();
        activarEventosItems();
    }


    /* ========================================================
       DATOS
    ======================================================== */

    async function cargarNotificaciones() {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !usuarioNotificaciones
        ) {
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from(
                "notificaciones"
            )
            .select(
                `
                    id,
                    tipo,
                    titulo,
                    mensaje,
                    enlace,
                    plan_id,
                    reserva_id,
                    datos,
                    leida,
                    creado_en
                `
            )
            .eq(
                "usuario_id",
                usuarioNotificaciones.id
            )
            .order(
                "creado_en",
                {
                    ascending:
                        false
                }
            )
            .limit(
                LIMITE_NOTIFICACIONES
            );

        if (error) {
            console.error(
                "No se pudieron cargar las notificaciones:",
                error
            );

            return;
        }

        notificacionesActuales =
            Array.isArray(
                data
            )
                ? data
                : [];

        renderizarNotificaciones();
    }


    async function marcarNotificacionLeida(
        notificacionId
    ) {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !usuarioNotificaciones ||
            !notificacionId
        ) {
            return;
        }

        const notificacion =
            notificacionesActuales.find(
                (
                    elemento
                ) =>
                    String(
                        elemento.id
                    ) ===
                    String(
                        notificacionId
                    )
            );

        if (
            !notificacion ||
            notificacion.leida
        ) {
            return;
        }

        const {
            error
        } = await cliente
            .from(
                "notificaciones"
            )
            .update({
                leida:
                    true
            })
            .eq(
                "id",
                notificacionId
            )
            .eq(
                "usuario_id",
                usuarioNotificaciones.id
            );

        if (error) {
            console.error(
                "No se pudo marcar la notificación como leída:",
                error
            );

            return;
        }

        notificacion.leida =
            true;

        renderizarNotificaciones();
    }


    async function marcarTodasComoLeidas() {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !usuarioNotificaciones
        ) {
            return;
        }

        const {
            error
        } = await cliente
            .from(
                "notificaciones"
            )
            .update({
                leida:
                    true
            })
            .eq(
                "usuario_id",
                usuarioNotificaciones.id
            )
            .eq(
                "leida",
                false
            );

        if (error) {
            console.error(
                "No se pudieron marcar todas las notificaciones como leídas:",
                error
            );

            return;
        }

        notificacionesActuales =
            notificacionesActuales.map(
                (
                    notificacion
                ) => ({
                    ...notificacion,
                    leida:
                        true
                })
            );

        renderizarNotificaciones();
    }


    /* ========================================================
       PANEL
    ======================================================== */

    async function abrirPanel() {
        const {
            boton,
            panel
        } = obtenerElementos();

        if (
            !boton ||
            !panel
        ) {
            return;
        }

        /*
           Recargamos SIEMPRE desde Supabase antes de mostrar.
           Así la campana no depende únicamente de Realtime.
        */
        await cargarNotificaciones();

        panel.hidden =
            false;

        boton.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    function cerrarPanel() {
        const {
            boton,
            panel
        } = obtenerElementos();

        if (
            !boton ||
            !panel
        ) {
            return;
        }

        panel.hidden =
            true;

        boton.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    function alternarPanel() {
        const {
            panel
        } = obtenerElementos();

        if (!panel) {
            return;
        }

        if (
            panel.hidden
        ) {
            abrirPanel();
        } else {
            cerrarPanel();
        }
    }


    /* ========================================================
       EVENTOS
    ======================================================== */

    function activarEventosItems() {
        document
            .querySelectorAll(
                "[data-abrir-notificacion]"
            )
            .forEach(
                (
                    boton
                ) => {
                    boton.addEventListener(
                        "click",
                        async () => {
                            const id =
                                boton.dataset
                                    .abrirNotificacion;

                            const item =
                                boton.closest(
                                    "[data-notificacion-enlace]"
                                );

                            const enlace =
                                item?.dataset
                                    ?.notificacionEnlace ||
                                "";

                            await marcarNotificacionLeida(
                                id
                            );

                            if (enlace) {
                                window.location.href =
                                    enlace;
                            }
                        }
                    );
                }
            );
    }


    function activarEventosComponente() {
        const {
            raiz,
            boton,
            marcarTodas
        } = obtenerElementos();

        boton?.addEventListener(
            "click",
            (
                evento
            ) => {
                evento.preventDefault();
                evento.stopPropagation();

                alternarPanel();
            }
        );

        marcarTodas?.addEventListener(
            "click",
            async (
                evento
            ) => {
                evento.preventDefault();
                evento.stopPropagation();

                marcarTodas.disabled =
                    true;

                try {
                    await marcarTodasComoLeidas();
                } finally {
                    actualizarContador();
                }
            }
        );

        raiz?.addEventListener(
            "click",
            (
                evento
            ) => {
                evento.stopPropagation();
            }
        );

        document.addEventListener(
            "click",
            cerrarPanel
        );

        document.addEventListener(
            "keydown",
            (
                evento
            ) => {
                if (
                    evento.key ===
                    "Escape"
                ) {
                    cerrarPanel();
                    boton?.focus();
                }
            }
        );
    }


    /* ========================================================
       REALTIME
    ======================================================== */

    async function activarTiempoReal() {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !usuarioNotificaciones
        ) {
            return;
        }

        if (
            canalNotificaciones
        ) {
            await cliente.removeChannel(
                canalNotificaciones
            );

            canalNotificaciones =
                null;
        }

        canalNotificaciones =
            cliente
                .channel(
                    `notificaciones-${usuarioNotificaciones.id}`
                )
                .on(
                    "postgres_changes",
                    {
                        event:
                            "*",

                        schema:
                            "public",

                        table:
                            "notificaciones",

                        filter:
                            `usuario_id=eq.${usuarioNotificaciones.id}`
                    },
                    async (
                        cambio
                    ) => {
                        await cargarNotificaciones();

                        if (
                            cambio.eventType ===
                            "INSERT"
                        ) {
                            const boton =
                                document.querySelector(
                                    "#boton-notificaciones"
                                );

                            boton?.classList.add(
                                "notificaciones-cabecera__boton--nuevo"
                            );

                            window.setTimeout(
                                () => {
                                    boton?.classList.remove(
                                        "notificaciones-cabecera__boton--nuevo"
                                    );
                                },
                                850
                            );
                        }
                    }
                )
                .subscribe(
                    (
                        estado,
                        error
                    ) => {
                        if (
                            estado ===
                            "CHANNEL_ERROR"
                        ) {
                            console.error(
                                "No se pudo activar Realtime para las notificaciones:",
                                error
                            );
                        }
                    }
                );
    }


    /* ========================================================
       INICIALIZACIÓN
    ======================================================== */

    async function iniciarNotificacionesSuralia() {
        const cliente =
            await esperarClienteSupabase();

        if (!cliente) {
            return;
        }

        const {
            data,
            error
        } = await cliente.auth.getSession();

        if (error) {
            console.error(
                "No se pudo comprobar la sesión para las notificaciones:",
                error
            );

            return;
        }

        const usuario =
            data.session?.user;

        if (!usuario) {
            return;
        }

        usuarioNotificaciones =
            usuario;

        if (
            !crearComponenteNotificaciones()
        ) {
            return;
        }

        await cargarNotificaciones();
        await activarTiempoReal();
    }


    function limpiarCanalNotificaciones() {
        if (
            canalNotificaciones &&
            window.clienteSupabase
        ) {
            window.clienteSupabase
                .removeChannel(
                    canalNotificaciones
                );

            canalNotificaciones =
                null;
        }
    }


    /*
       Permite que otras partes de Suralia pidan refrescar
       la campana inmediatamente después de modificar avisos.
    */
    async function refrescarNotificacionesDesdeSuralia() {
        if (
            !usuarioNotificaciones
        ) {
            return false;
        }

        await cargarNotificaciones();

        return true;
    }


    window.addEventListener(
        "suralia:notificaciones-actualizadas",
        refrescarNotificacionesDesdeSuralia
    );


    /*
       Respaldo para casos en los que Realtime tarde en conectar
       o el navegador haya suspendido la pestaña.
    */
    window.addEventListener(
        "focus",
        () => {
            refrescarNotificacionesDesdeSuralia();
        }
    );


    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                refrescarNotificacionesDesdeSuralia();
            }
        }
    );


    /*
       Función pública muy pequeña para poder comprobar o forzar
       la recarga desde la consola sin tocar variables internas.
    */
    window.refrescarNotificacionesSuralia =
        refrescarNotificacionesDesdeSuralia;


    window.addEventListener(
        "beforeunload",
        limpiarCanalNotificaciones
    );


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarNotificacionesSuralia,
            {
                once:
                    true
            }
        );
    } else {
        iniciarNotificacionesSuralia();
    }

})();