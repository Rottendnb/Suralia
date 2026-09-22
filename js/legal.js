"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const enlacesIndice = Array.from(
        document.querySelectorAll(
            '.legal__indice a[href^="#"]'
        )
    );

    if (!enlacesIndice.length) {
        return;
    }

    const secciones = enlacesIndice
        .map((enlace) => {
            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return null;
            }

            const seccion = document.querySelector(destino);

            if (!seccion) {
                return null;
            }

            return {
                enlace,
                seccion
            };
        })
        .filter(Boolean);

    if (!secciones.length) {
        return;
    }

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let seccionActiva = "";
    let actualizacionPendiente = false;

    function activarEnlace(idSeccion) {
        if (!idSeccion || seccionActiva === idSeccion) {
            return;
        }

        seccionActiva = idSeccion;

        secciones.forEach(({ enlace, seccion }) => {
            const estaActivo = seccion.id === idSeccion;

            enlace.classList.toggle(
                "activo",
                estaActivo
            );

            if (estaActivo) {
                enlace.setAttribute(
                    "aria-current",
                    "location"
                );
            } else {
                enlace.removeAttribute(
                    "aria-current"
                );
            }
        });
    }

    function obtenerSeccionVisible() {
        const margenCabecera = 140;
        let visible = secciones[0];

        secciones.forEach((item) => {
            const posicion =
                item.seccion.getBoundingClientRect().top;

            if (posicion <= margenCabecera) {
                visible = item;
            }
        });

        return visible;
    }

    function actualizarIndice() {
        actualizacionPendiente = false;

        const visible = obtenerSeccionVisible();

        if (visible) {
            activarEnlace(visible.seccion.id);
        }
    }

    function solicitarActualizacion() {
        if (actualizacionPendiente) {
            return;
        }

        actualizacionPendiente = true;

        window.requestAnimationFrame(
            actualizarIndice
        );
    }

    enlacesIndice.forEach((enlace) => {
        enlace.addEventListener("click", (evento) => {
            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const seccion = document.querySelector(destino);

            if (!seccion) {
                return;
            }

            evento.preventDefault();

            seccion.scrollIntoView({
                behavior: reducirMovimiento.matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            activarEnlace(seccion.id);

            try {
                window.history.pushState(
                    null,
                    "",
                    destino
                );
            } catch (error) {
                window.location.hash = destino;
            }
        });
    });

    window.addEventListener(
        "scroll",
        solicitarActualizacion,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        solicitarActualizacion
    );

    window.addEventListener("hashchange", () => {
        const idDestino = window.location.hash.slice(1);
        const existeDestino = secciones.some(
            ({ seccion }) =>
                seccion.id === idDestino
        );

        if (existeDestino) {
            activarEnlace(idDestino);
        } else {
            solicitarActualizacion();
        }
    });

    const idInicial = window.location.hash.slice(1);
    const destinoInicial = secciones.find(
        ({ seccion }) =>
            seccion.id === idInicial
    );

    if (destinoInicial) {
        activarEnlace(destinoInicial.seccion.id);
    } else {
        actualizarIndice();
    }
});
