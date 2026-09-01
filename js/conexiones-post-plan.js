/* =========================================================
   SURALIA · CONEXIONES DESPUÉS DEL PLAN
   Archivo independiente para perfil.html
========================================================= */

(function () {
    "use strict";

    const MARCA = "data-conexiones-post-plan-listo";

    function escapar(valor = "") {
        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function crearModal() {
        if (document.querySelector("#modal-conexiones-post-plan")) {
            return;
        }

        const modal = document.createElement("div");
        modal.id = "modal-conexiones-post-plan";
        modal.className = "modal-conexiones-post-plan";
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div class="modal-conexiones-post-plan__fondo" data-cerrar-post-plan></div>

            <section
                class="modal-conexiones-post-plan__tarjeta"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-conexiones-post-plan"
            >
                <button
                    type="button"
                    class="modal-conexiones-post-plan__cerrar"
                    data-cerrar-post-plan
                    aria-label="Cerrar"
                >
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>

                <span class="modal-conexiones-post-plan__icono" aria-hidden="true">
                    🤝
                </span>

                <h2 id="titulo-conexiones-post-plan">
                    Personas que estuvieron contigo
                </h2>

                <p>
                    Puedes visitar sus perfiles y, si os apetece, conectar en Suralia.
                </p>

                <div
                    class="modal-conexiones-post-plan__lista"
                    id="lista-conexiones-post-plan"
                    aria-live="polite"
                ></div>
            </section>
        `;

        document.body.appendChild(modal);

        modal.addEventListener("click", (evento) => {
            if (evento.target.closest("[data-cerrar-post-plan]")) {
                cerrarModal();
            }
        });
    }

    function abrirModal() {
        crearModal();

        const modal = document.querySelector("#modal-conexiones-post-plan");
        modal?.classList.add("visible");
        modal?.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-abierto");
    }

    function cerrarModal() {
        const modal = document.querySelector("#modal-conexiones-post-plan");
        modal?.classList.remove("visible");
        modal?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-abierto");
    }

    function avatarHTML(persona) {
        const nombre = escapar(persona?.nombre || "Usuario de Suralia");
        const foto = escapar(persona?.foto || "");

        if (foto) {
            return `
                <span class="conexion-post-plan__avatar">
                    <img src="${foto}" alt="Foto de ${nombre}" loading="lazy">
                </span>
            `;
        }

        return `
            <span class="conexion-post-plan__avatar" aria-hidden="true">
                <i class="fa-regular fa-user"></i>
            </span>
        `;
    }

    function pintarPersonas(personas) {
        const lista = document.querySelector("#lista-conexiones-post-plan");

        if (!lista) {
            return;
        }

        if (!Array.isArray(personas) || personas.length === 0) {
            lista.innerHTML = `
                <div class="conexion-post-plan__vacio">
                    <i class="fa-regular fa-user" aria-hidden="true"></i>
                    <strong>No hay otros perfiles disponibles</strong>
                    <span>Puede que los demás asistentes tengan el perfil privado.</span>
                </div>
            `;
            return;
        }

        lista.innerHTML = personas.map((persona) => {
            const perfilId = escapar(persona.perfil_publico_id || "");
            const nombre = escapar(persona.nombre || "Usuario de Suralia");
            const localidad = escapar(persona.localidad || "");
            const verificado = persona.verificado === true;

            return `
                <article class="conexion-post-plan">
                    ${avatarHTML(persona)}

                    <div class="conexion-post-plan__contenido">
                        <strong>
                            ${nombre}
                            ${verificado ? '<i class="fa-solid fa-circle-check conexion-post-plan__verificado" title="Perfil verificado"></i>' : ''}
                        </strong>
                        ${localidad ? `<span>${localidad}</span>` : ''}
                    </div>

                    <a
                        href="perfil-publico.html?id=${encodeURIComponent(perfilId)}"
                        class="conexion-post-plan__perfil"
                    >
                        Ver perfil
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </article>
            `;
        }).join("");
    }

    async function cargarPersonas(reservaId, boton) {
        const cliente = window.clienteSupabase;

        if (!cliente || !reservaId) {
            return;
        }

        abrirModal();

        const lista = document.querySelector("#lista-conexiones-post-plan");
        if (lista) {
            lista.innerHTML = `
                <div class="conexion-post-plan__cargando">
                    <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                    Buscando asistentes…
                </div>
            `;
        }

        const original = boton?.innerHTML || "";
        if (boton) {
            boton.disabled = true;
        }

        try {
            const { data, error } = await cliente.rpc(
                "obtener_personas_mismo_plan_realizado",
                {
                    p_reserva_id: reservaId
                }
            );

            if (error) {
                throw error;
            }

            pintarPersonas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("No se pudieron cargar los asistentes del plan:", error);

            if (lista) {
                lista.innerHTML = `
                    <div class="conexion-post-plan__vacio">
                        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                        <strong>No se han podido cargar los asistentes</strong>
                        <span>Comprueba que has ejecutado la RPC de conexiones post-plan.</span>
                    </div>
                `;
            }
        } finally {
            if (boton) {
                boton.disabled = false;
                boton.innerHTML = original;
            }
        }
    }

    function enriquecerReservasRealizadas() {
        document
            .querySelectorAll(`.reserva-item--realizada:not([${MARCA}])`)
            .forEach((reserva) => {
                reserva.setAttribute(MARCA, "true");

                const reservaId = reserva.dataset.reservaId || "";
                const acciones = reserva.querySelector(".reserva-item__acciones");

                if (!reservaId || !acciones) {
                    return;
                }

                const boton = document.createElement("button");
                boton.type = "button";
                boton.className = "boton-conectar-post-plan";
                boton.innerHTML = `
                    <i class="fa-solid fa-user-group" aria-hidden="true"></i>
                    Conectar con asistentes
                `;

                boton.addEventListener("click", () => {
                    cargarPersonas(reservaId, boton);
                });

                acciones.appendChild(boton);
            });
    }

    document.addEventListener("DOMContentLoaded", enriquecerReservasRealizadas);

    const observador = new MutationObserver(enriquecerReservasRealizadas);
    observador.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
