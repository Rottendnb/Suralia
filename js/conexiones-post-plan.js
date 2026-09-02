/* =========================================================
   SURALIA · CONEXIONES DESPUÉS DEL PLAN
   Archivo: js/conexiones-post-plan.js

   Se carga DESPUÉS de js/perfil.js.
   No modifica ni sustituye perfil.js.
========================================================= */

(() => {
    "use strict";

    const SELECTOR_LISTA_RESERVAS =
        "#lista-reservas-perfil";

    const SELECTOR_RESERVA_REALIZADA =
        ".reserva-item.reserva-item--realizada[data-reserva-id]";

    const claseModal =
        "modal-post-plan";

    let usuarioActual = null;
    let reservasRealizadas = [];
    let reservasPorId = new Map();
    let observadorReservas = null;


    function escaparHTMLPostPlan(
        valor = ""
    ) {
        return String(valor)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function normalizarHoraPostPlan(
        hora = ""
    ) {
        return String(hora)
            .trim()
            .slice(0, 5);
    }


    function obtenerFechaHoyISO() {
        const ahora = new Date();

        const anio =
            ahora.getFullYear();

        const mes =
            String(
                ahora.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                ahora.getDate()
            ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }


    function mostrarAvisoPostPlan(
        mensaje
    ) {
        if (
            typeof window.mostrarNotificacion ===
            "function"
        ) {
            window.mostrarNotificacion(
                mensaje
            );
            return;
        }

        const notificacion =
            document.querySelector(
                "#notificacion-perfil"
            );

        const texto =
            notificacion?.querySelector(
                "span"
            );

        if (
            notificacion &&
            texto
        ) {
            texto.textContent =
                mensaje;

            notificacion.classList.add(
                "visible"
            );

            setTimeout(
                () => {
                    notificacion.classList.remove(
                        "visible"
                    );
                },
                3000
            );

            return;
        }

        console.log(mensaje);
    }


    function obtenerInicialesPostPlan(
        nombre = "Usuario"
    ) {
        return String(nombre)
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (parte) =>
                    parte.charAt(0)
            )
            .join("")
            .toUpperCase() ||
            "SU";
    }


    async function obtenerUsuarioActualPostPlan() {
        const cliente =
            window.clienteSupabase;

        if (!cliente?.auth) {
            return null;
        }

        const {
            data,
            error
        } = await cliente.auth.getSession();

        if (error) {
            throw error;
        }

        return (
            data.session?.user ||
            null
        );
    }


    async function cargarReservasRealizadasPostPlan() {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !usuarioActual
        ) {
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from("reservas")
            .select(`
                id,
                plan_id,
                fecha,
                hora,
                estado
            `)
            .eq(
                "usuario_id",
                usuarioActual.id
            )
            .eq(
                "estado",
                "confirmada"
            )
            .lt(
                "fecha",
                obtenerFechaHoyISO()
            )
            .order(
                "fecha",
                {
                    ascending:
                        false
                }
            )
            .order(
                "hora",
                {
                    ascending:
                        false
                }
            );

        if (error) {
            throw error;
        }

        reservasRealizadas =
            Array.isArray(data)
                ? data
                : [];

        reservasPorId =
            new Map(
                reservasRealizadas.map(
                    (reserva) => [
                        String(
                            reserva.id
                        ),
                        {
                            ...reserva,

                            hora:
                                normalizarHoraPostPlan(
                                    reserva.hora
                                )
                        }
                    ]
                )
            );
    }


    function crearBotonPostPlan(
        reserva
    ) {
        const boton =
            document.createElement(
                "button"
            );

        boton.type =
            "button";

        boton.className =
            "boton-conectar-post-plan";

        boton.dataset.reservaPostPlan =
            String(reserva.id);

        boton.innerHTML = `
            <i
                class="fa-solid fa-user-group"
                aria-hidden="true"
            ></i>

            <span>
                Conectar con asistentes
            </span>
        `;

        return boton;
    }


    function inyectarBotonesPostPlan() {
        document
            .querySelectorAll(
                SELECTOR_RESERVA_REALIZADA
            )
            .forEach(
                (tarjeta) => {
                    const reservaId =
                        String(
                            tarjeta.dataset
                                .reservaId ||
                            ""
                        );

                    const reserva =
                        reservasPorId.get(
                            reservaId
                        );

                    if (!reserva) {
                        return;
                    }

                    const acciones =
                        tarjeta.querySelector(
                            ".reserva-item__acciones"
                        );

                    if (!acciones) {
                        return;
                    }

                    if (
                        acciones.querySelector(
                            `[data-reserva-post-plan="${CSS.escape(
                                reservaId
                            )}"]`
                        )
                    ) {
                        return;
                    }

                    acciones.appendChild(
                        crearBotonPostPlan(
                            reserva
                        )
                    );
                }
            );
    }


    function crearModalPostPlan() {
        let modal =
            document.querySelector(
                `.${claseModal}`
            );

        if (modal) {
            return modal;
        }

        modal =
            document.createElement(
                "div"
            );

        modal.className =
            `${claseModal} oculto`;

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        modal.innerHTML = `
            <div
                class="modal-post-plan__fondo"
                data-cerrar-post-plan
            ></div>

            <section
                class="modal-post-plan__dialogo"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-post-plan"
            >
                <div class="modal-post-plan__cabecera">

                    <div class="modal-post-plan__titulo-bloque">
                        <span
                            class="modal-post-plan__icono"
                            aria-hidden="true"
                        >
                            <i class="fa-solid fa-link"></i>
                        </span>

                        <div>
                            <span class="modal-post-plan__eyebrow">
                                Sigue la conexión
                            </span>

                            <h2 id="titulo-modal-post-plan">
                                Personas que estuvieron contigo
                            </h2>

                            <p id="texto-modal-post-plan">
                                El plan terminó, pero quizá la gente que conociste merezca quedarse.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="modal-post-plan__cerrar"
                        data-cerrar-post-plan
                        aria-label="Cerrar"
                    >
                        <i
                            class="fa-solid fa-xmark"
                            aria-hidden="true"
                        ></i>
                    </button>

                </div>

                <div
                    class="modal-post-plan__contenido"
                    id="contenido-modal-post-plan"
                ></div>
            </section>
        `;

        document.body.appendChild(
            modal
        );

        modal.addEventListener(
            "click",
            (evento) => {
                if (
                    evento.target.closest(
                        "[data-cerrar-post-plan]"
                    )
                ) {
                    cerrarModalPostPlan();
                }
            }
        );

        return modal;
    }


    function abrirModalPostPlan() {
        const modal =
            crearModalPostPlan();

        modal.classList.remove(
            "oculto"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-post-plan-abierto"
        );

        requestAnimationFrame(
            () => {
                modal
                    .querySelector(
                        ".modal-post-plan__cerrar"
                    )
                    ?.focus();
            }
        );
    }


    function cerrarModalPostPlan() {
        const modal =
            document.querySelector(
                `.${claseModal}`
            );

        if (!modal) {
            return;
        }

        modal.classList.add(
            "oculto"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-post-plan-abierto"
        );
    }


    function mostrarCargandoPostPlan() {
        const contenido =
            document.querySelector(
                "#contenido-modal-post-plan"
            );

        if (!contenido) {
            return;
        }

        contenido.innerHTML = `
            <div class="post-plan-cargando">
                <span>
                    <i
                        class="fa-solid fa-spinner fa-spin"
                        aria-hidden="true"
                    ></i>
                </span>

                <div>
                    <strong>
                        Buscando a las personas del plan...
                    </strong>

                    <p>
                        Solo mostramos asistentes del mismo día y hora.
                    </p>
                </div>
            </div>
        `;
    }


    function crearAvatarAsistentePostPlan(
        asistente
    ) {
        const nombre =
            escaparHTMLPostPlan(
                asistente.nombre_visible ||
                "Usuario de Suralia"
            );

        const foto =
            escaparHTMLPostPlan(
                asistente.foto_principal_url ||
                ""
            );

        if (foto) {
            return `
                <span class="post-plan-persona__avatar">
                    <img
                        src="${foto}"
                        alt="Foto de ${nombre}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.parentElement.textContent='${obtenerInicialesPostPlan(
                                asistente.nombre_visible
                            )}';
                        "
                    >
                </span>
            `;
        }

        return `
            <span
                class="post-plan-persona__avatar"
                aria-hidden="true"
            >
                ${obtenerInicialesPostPlan(
                    asistente.nombre_visible
                )}
            </span>
        `;
    }


    function textoInteresesComunesPostPlan(
        cantidad
    ) {
        const total =
            Number(cantidad || 0);

        if (total <= 0) {
            return "";
        }

        return total === 1
            ? "1 interés en común"
            : `${total} intereses en común`;
    }


    function crearAccionConexionPostPlan(
        asistente
    ) {
        const usuarioId =
            escaparHTMLPostPlan(
                asistente.usuario_id ||
                ""
            );

        const nombre =
            escaparHTMLPostPlan(
                asistente.nombre_visible ||
                "Usuario"
            );

        const estado =
            String(
                asistente.estado_conexion ||
                "ninguna"
            );

        if (
            estado ===
            "conectados"
        ) {
            return `
                <button
                    type="button"
                    class="post-plan-persona__accion post-plan-persona__accion--mensaje"
                    data-post-plan-mensaje="${usuarioId}"
                    data-post-plan-nombre="${nombre}"
                >
                    <i
                        class="fa-regular fa-comments"
                        aria-hidden="true"
                    ></i>
                    Enviar mensaje
                </button>
            `;
        }

        if (
            estado ===
            "enviada"
        ) {
            return `
                <span class="post-plan-persona__estado">
                    <i
                        class="fa-solid fa-clock"
                        aria-hidden="true"
                    ></i>
                    Solicitud enviada
                </span>
            `;
        }

        if (
            estado ===
            "recibida"
        ) {
            return `
                <a
                    href="perfil.html#conexiones"
                    class="post-plan-persona__accion post-plan-persona__accion--responder"
                >
                    <i
                        class="fa-solid fa-user-check"
                        aria-hidden="true"
                    ></i>
                    Responder solicitud
                </a>
            `;
        }

        if (
            estado ===
            "rechazada"
        ) {
            return `
                <span class="post-plan-persona__estado post-plan-persona__estado--neutro">
                    Conexión no disponible
                </span>
            `;
        }

        return `
            <button
                type="button"
                class="post-plan-persona__accion post-plan-persona__accion--conectar"
                data-post-plan-conectar="${usuarioId}"
            >
                <i
                    class="fa-solid fa-user-plus"
                    aria-hidden="true"
                ></i>
                Conectar
            </button>
        `;
    }


    function renderizarAsistentesPostPlan(
        asistentes,
        reserva,
        tituloPlan
    ) {
        const contenido =
            document.querySelector(
                "#contenido-modal-post-plan"
            );

        const texto =
            document.querySelector(
                "#texto-modal-post-plan"
            );

        if (!contenido) {
            return;
        }

        if (texto) {
            texto.textContent =
                tituloPlan
                    ? `Coincidisteis en “${tituloPlan}”. Solo aparecen personas del mismo pase.`
                    : "Solo aparecen personas que participaron en el mismo día y hora.";
        }

        if (
            !Array.isArray(asistentes) ||
            asistentes.length === 0
        ) {
            contenido.innerHTML = `
                <div class="post-plan-vacio">
                    <span aria-hidden="true">
                        <i class="fa-solid fa-user-group"></i>
                    </span>

                    <div>
                        <strong>
                            No hay otros perfiles disponibles
                        </strong>

                        <p>
                            Puede que fueras la única persona con perfil público o que los demás asistentes no estén disponibles para conectar.
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        contenido.innerHTML = `
            <div class="post-plan-resumen">
                <span>
                    <i
                        class="fa-solid fa-users"
                        aria-hidden="true"
                    ></i>
                    ${asistentes.length}
                    ${
                        asistentes.length === 1
                            ? "persona disponible"
                            : "personas disponibles"
                    }
                </span>

                <span>
                    <i
                        class="fa-regular fa-calendar-check"
                        aria-hidden="true"
                    ></i>
                    ${escaparHTMLPostPlan(
                        reserva.fecha
                    )}
                    ·
                    ${escaparHTMLPostPlan(
                        reserva.hora
                    )}
                </span>
            </div>

            <div class="post-plan-personas">
                ${asistentes
                    .map(
                        (asistente) => {
                            const perfilId =
                                escaparHTMLPostPlan(
                                    asistente.perfil_publico_id ||
                                    ""
                                );

                            const nombre =
                                escaparHTMLPostPlan(
                                    asistente.nombre_visible ||
                                    "Usuario de Suralia"
                                );

                            const localidad =
                                escaparHTMLPostPlan(
                                    asistente.localidad ||
                                    "Localidad no indicada"
                                );

                            const comunes =
                                textoInteresesComunesPostPlan(
                                    asistente.intereses_comunes
                                );

                            return `
                                <article class="post-plan-persona">

                                    ${crearAvatarAsistentePostPlan(
                                        asistente
                                    )}

                                    <div class="post-plan-persona__contenido">

                                        <div class="post-plan-persona__datos">
                                            <h3>
                                                ${nombre}
                                            </h3>

                                            <p>
                                                <i
                                                    class="fa-solid fa-location-dot"
                                                    aria-hidden="true"
                                                ></i>
                                                ${localidad}
                                            </p>

                                            ${
                                                comunes
                                                    ? `
                                                        <span class="post-plan-persona__afinidad">
                                                            <i
                                                                class="fa-solid fa-sparkles"
                                                                aria-hidden="true"
                                                            ></i>
                                                            ${escaparHTMLPostPlan(
                                                                comunes
                                                            )}
                                                        </span>
                                                    `
                                                    : ""
                                            }
                                        </div>

                                        <div class="post-plan-persona__acciones">

                                            ${
                                                perfilId
                                                    ? `
                                                        <a
                                                            href="perfil-publico.html?id=${encodeURIComponent(
                                                                perfilId
                                                            )}"
                                                            class="post-plan-persona__perfil"
                                                        >
                                                            <i
                                                                class="fa-regular fa-user"
                                                                aria-hidden="true"
                                                            ></i>
                                                            Ver perfil
                                                        </a>
                                                    `
                                                    : ""
                                            }

                                            ${crearAccionConexionPostPlan(
                                                asistente
                                            )}

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


    async function cargarAsistentesPostPlan(
        reserva,
        tarjeta
    ) {
        const cliente =
            window.clienteSupabase;

        if (!cliente) {
            mostrarAvisoPostPlan(
                "No se ha podido conectar con Suralia."
            );
            return;
        }

        abrirModalPostPlan();
        mostrarCargandoPostPlan();

        const tituloPlan =
            tarjeta
                ?.querySelector(
                    ".reserva-item__superior h3"
                )
                ?.textContent
                ?.trim() ||
            "";

        try {
            const {
                data,
                error
            } = await cliente.rpc(
                "obtener_asistentes_post_plan",
                {
                    plan_buscado:
                        reserva.plan_id,

                    fecha_buscada:
                        reserva.fecha,

                    hora_buscada:
                        reserva.hora
                }
            );

            if (error) {
                throw error;
            }

            renderizarAsistentesPostPlan(
                Array.isArray(data)
                    ? data
                    : [],
                reserva,
                tituloPlan
            );
        } catch (error) {
            console.error(
                "No se pudieron cargar los asistentes del plan:",
                error
            );

            const contenido =
                document.querySelector(
                    "#contenido-modal-post-plan"
                );

            if (contenido) {
                contenido.innerHTML = `
                    <div class="post-plan-vacio post-plan-vacio--error">
                        <span aria-hidden="true">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </span>

                        <div>
                            <strong>
                                No hemos podido cargar los asistentes
                            </strong>

                            <p>
                                Recarga la página e inténtalo de nuevo.
                            </p>
                        </div>
                    </div>
                `;
            }
        }
    }


    async function solicitarConexionPostPlan(
        otroUsuarioId,
        boton
    ) {
        const cliente =
            window.clienteSupabase;

        const reservaId =
            document
                .querySelector(
                    ".modal-post-plan"
                )
                ?.dataset
                .reservaActiva ||
            "";

        const reserva =
            reservasPorId.get(
                reservaId
            );

        if (
            !cliente ||
            !reserva ||
            !otroUsuarioId
        ) {
            return;
        }

        const contenidoOriginal =
            boton.innerHTML;

        boton.disabled = true;

        boton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
            Enviando
        `;

        try {
            const {
                data,
                error
            } = await cliente.rpc(
                "solicitar_conexion_post_plan",
                {
                    usuario_destino:
                        otroUsuarioId,

                    plan_buscado:
                        reserva.plan_id,

                    fecha_buscada:
                        reserva.fecha,

                    hora_buscada:
                        reserva.hora
                }
            );

            if (error) {
                throw error;
            }

            const estado =
                String(
                    data?.estado ||
                    ""
                );

            if (
                estado ===
                "enviada"
            ) {
                boton.outerHTML = `
                    <span class="post-plan-persona__estado">
                        <i
                            class="fa-solid fa-clock"
                            aria-hidden="true"
                        ></i>
                        Solicitud enviada
                    </span>
                `;

                mostrarAvisoPostPlan(
                    "Solicitud de conexión enviada."
                );

                return;
            }

            if (
                estado ===
                "conectados"
            ) {
                mostrarAvisoPostPlan(
                    "Ya sois conexiones."
                );
            } else if (
                estado ===
                "recibida"
            ) {
                mostrarAvisoPostPlan(
                    "Esta persona ya te ha enviado una solicitud."
                );
            } else {
                mostrarAvisoPostPlan(
                    data?.mensaje ||
                    "No se ha podido enviar la solicitud."
                );
            }

            await recargarModalActualPostPlan();
        } catch (error) {
            console.error(
                "No se pudo enviar la conexión post-plan:",
                error
            );

            mostrarAvisoPostPlan(
                error?.message ||
                "No se ha podido enviar la solicitud."
            );

            boton.disabled = false;
            boton.innerHTML =
                contenidoOriginal;
        }
    }


    async function abrirChatPostPlan(
        otroUsuarioId,
        nombre,
        boton
    ) {
        const cliente =
            window.clienteSupabase;

        if (
            !cliente ||
            !otroUsuarioId
        ) {
            return;
        }

        const contenidoOriginal =
            boton.innerHTML;

        boton.disabled = true;

        boton.innerHTML = `
            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
            Abriendo
        `;

        try {
            const {
                data,
                error
            } = await cliente.rpc(
                "obtener_o_crear_conversacion",
                {
                    otro_usuario:
                        otroUsuarioId
                }
            );

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error(
                    "No se ha podido abrir la conversación."
                );
            }

            sessionStorage.setItem(
                "nombreConversacionSuralia",
                nombre ||
                "Usuario de Suralia"
            );

            window.location.href =
                `mensajes.html?id=${encodeURIComponent(
                    data
                )}`;
        } catch (error) {
            console.error(
                "No se pudo abrir el chat post-plan:",
                error
            );

            mostrarAvisoPostPlan(
                error?.message ||
                "No se ha podido abrir el chat."
            );

            boton.disabled = false;
            boton.innerHTML =
                contenidoOriginal;
        }
    }


    async function recargarModalActualPostPlan() {
        const modal =
            document.querySelector(
                ".modal-post-plan"
            );

        const reservaId =
            modal?.dataset
                .reservaActiva ||
            "";

        const reserva =
            reservasPorId.get(
                reservaId
            );

        if (!reserva) {
            return;
        }

        const tarjeta =
            document.querySelector(
                `${SELECTOR_RESERVA_REALIZADA}[data-reserva-id="${CSS.escape(
                    reservaId
                )}"]`
            );

        await cargarAsistentesPostPlan(
            reserva,
            tarjeta
        );
    }


    function activarEventosPostPlan() {
        document.addEventListener(
            "click",
            async (evento) => {
                const botonAbrir =
                    evento.target.closest(
                        "[data-reserva-post-plan]"
                    );

                if (botonAbrir) {
                    const reservaId =
                        String(
                            botonAbrir.dataset
                                .reservaPostPlan ||
                            ""
                        );

                    const reserva =
                        reservasPorId.get(
                            reservaId
                        );

                    if (!reserva) {
                        return;
                    }

                    const modal =
                        crearModalPostPlan();

                    modal.dataset.reservaActiva =
                        reservaId;

                    const tarjeta =
                        botonAbrir.closest(
                            ".reserva-item"
                        );

                    await cargarAsistentesPostPlan(
                        reserva,
                        tarjeta
                    );

                    return;
                }


                const conectar =
                    evento.target.closest(
                        "[data-post-plan-conectar]"
                    );

                if (conectar) {
                    await solicitarConexionPostPlan(
                        conectar.dataset
                            .postPlanConectar,
                        conectar
                    );

                    return;
                }


                const mensaje =
                    evento.target.closest(
                        "[data-post-plan-mensaje]"
                    );

                if (mensaje) {
                    await abrirChatPostPlan(
                        mensaje.dataset
                            .postPlanMensaje,
                        mensaje.dataset
                            .postPlanNombre,
                        mensaje
                    );
                }
            }
        );


        document.addEventListener(
            "keydown",
            (evento) => {
                if (
                    evento.key ===
                    "Escape"
                ) {
                    cerrarModalPostPlan();
                }
            }
        );
    }


    function observarListaReservasPostPlan() {
        const lista =
            document.querySelector(
                SELECTOR_LISTA_RESERVAS
            );

        if (!lista) {
            return;
        }

        observadorReservas =
            new MutationObserver(
                () => {
                    inyectarBotonesPostPlan();
                }
            );

        observadorReservas.observe(
            lista,
            {
                childList:
                    true,

                subtree:
                    true
            }
        );
    }


    async function iniciarConexionesPostPlan() {
        try {
            usuarioActual =
                await obtenerUsuarioActualPostPlan();

            if (!usuarioActual) {
                return;
            }

            await cargarReservasRealizadasPostPlan();

            activarEventosPostPlan();
            observarListaReservasPostPlan();

            inyectarBotonesPostPlan();

            /*
               perfil.js carga reservas de Supabase de forma asíncrona.
               Estos reintentos cubren el caso en que el HTML aún
               no esté renderizado al iniciar este módulo.
            */
            [350, 900, 1700].forEach(
                (espera) => {
                    setTimeout(
                        inyectarBotonesPostPlan,
                        espera
                    );
                }
            );
        } catch (error) {
            console.error(
                "No se pudo iniciar Conexiones después del plan:",
                error
            );
        }
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarConexionesPostPlan
        );
    } else {
        iniciarConexionesPostPlan();
    }
})();
