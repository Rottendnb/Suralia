/* =========================================================
   SURALIA · IDEAL PARA PRIMERA VEZ · DETALLE DEL PLAN
   Archivo: js/primera-vez-detalle.js

   Cargar DESPUÉS de js/detalle-plan.js
========================================================= */

(() => {
    "use strict";

    function esUuid(valor = "") {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test(
                String(valor).trim()
            );
    }


    function obtenerPlanId() {
        return (
            new URLSearchParams(
                window.location.search
            ).get("id") ||
            ""
        );
    }


    function insertarInsignia() {
        if (
            document.querySelector(
                ".detalle-primera-vez"
            )
        ) {
            return;
        }

        const categoria =
            document.querySelector(
                "#detalle-categoria"
            );

        const titulo =
            document.querySelector(
                "#detalle-titulo"
            );

        if (!titulo) {
            return;
        }

        const insignia =
            document.createElement(
                "span"
            );

        insignia.className =
            "detalle-primera-vez";

        insignia.innerHTML = `
            <span aria-hidden="true">
                👋
            </span>

            <span>
                Ideal para tu primera vez
            </span>
        `;

        if (categoria) {
            categoria.insertAdjacentElement(
                "afterend",
                insignia
            );
        } else {
            titulo.insertAdjacentElement(
                "beforebegin",
                insignia
            );
        }
    }


    async function esperarSupabase(
        intentos = 30
    ) {
        for (
            let intento = 0;
            intento < intentos;
            intento += 1
        ) {
            if (window.clienteSupabase) {
                return window.clienteSupabase;
            }

            await new Promise(
                (resolver) =>
                    setTimeout(
                        resolver,
                        100
                    )
            );
        }

        return null;
    }


    async function iniciar() {
        const planId =
            obtenerPlanId();

        if (!esUuid(planId)) {
            return;
        }

        const cliente =
            await esperarSupabase();

        if (!cliente) {
            return;
        }

        try {
            const {
                data,
                error
            } = await cliente
                .from("planes")
                .select(
                    "detalles_extra"
                )
                .eq(
                    "id",
                    planId
                )
                .eq(
                    "estado",
                    "publicado"
                )
                .maybeSingle();

            if (error) {
                throw error;
            }

            const detalles =
                data?.detalles_extra &&
                typeof data.detalles_extra ===
                    "object"
                    ? data.detalles_extra
                    : {};

            /*
               En detalle mostramos la insignia SOLO cuando
               el organizador lo ha marcado explícitamente.
            */
            if (
                detalles.ideal_primera_vez ===
                true
            ) {
                insertarInsignia();
            }
        } catch (error) {
            console.error(
                "No se pudo cargar la marca de primera vez:",
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
            iniciar
        );
    } else {
        iniciar();
    }
})();
