/* =====================================================
   ELEMENTOS DE PREGUNTAS FRECUENTES
===================================================== */

const formularioBusquedaFaq =
    document.querySelector("#faq-buscador");

const campoBusquedaFaq =
    document.querySelector("#faq-busqueda");

const botonesCategoriasFaq =
    document.querySelectorAll(".faq-categoria");

const preguntasFaq =
    document.querySelectorAll(".faq-item");

const textoResultadosFaq =
    document.querySelector("#faq-resultados-texto");

const estadoSinResultadosFaq =
    document.querySelector("#faq-sin-resultados");

const botonLimpiarBusquedaFaq =
    document.querySelector("#faq-limpiar-busqueda");

let categoriaFaqActual = "todas";


/* =====================================================
   NORMALIZAR TEXTO
===================================================== */

function normalizarTextoFaq(texto = "") {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


/* =====================================================
   ACORDEÓN
===================================================== */

function cerrarPreguntaFaq(pregunta) {
    if (!pregunta) {
        return;
    }

    pregunta.classList.remove("abierta");

    const boton =
        pregunta.querySelector(".faq-item__pregunta");

    if (boton) {
        boton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}


function abrirPreguntaFaq(pregunta) {
    if (!pregunta) {
        return;
    }

    pregunta.classList.add("abierta");

    const boton =
        pregunta.querySelector(".faq-item__pregunta");

    if (boton) {
        boton.setAttribute(
            "aria-expanded",
            "true"
        );
    }
}


function activarAcordeonFaq() {
    preguntasFaq.forEach((pregunta) => {
        const boton =
            pregunta.querySelector(
                ".faq-item__pregunta"
            );

        if (!boton) {
            return;
        }

        boton.addEventListener(
            "click",
            () => {
                const estaAbierta =
                    pregunta.classList.contains(
                        "abierta"
                    );

                preguntasFaq.forEach(
                    cerrarPreguntaFaq
                );

                if (!estaAbierta) {
                    abrirPreguntaFaq(
                        pregunta
                    );
                }
            }
        );
    });
}


/* =====================================================
   FILTRAR PREGUNTAS
===================================================== */

function obtenerTextoPreguntaFaq(pregunta) {
    const preguntaGuardada =
        pregunta.dataset.pregunta || "";

    const contenidoVisible =
        pregunta.textContent || "";

    return normalizarTextoFaq(
        `${preguntaGuardada} ${contenidoVisible}`
    );
}


function actualizarTextoResultadosFaq(cantidad) {
    if (!textoResultadosFaq) {
        return;
    }

    const busqueda =
        campoBusquedaFaq?.value.trim() || "";

    if (cantidad === 0) {
        textoResultadosFaq.textContent =
            "No se han encontrado preguntas.";
        return;
    }

    if (
        categoriaFaqActual === "todas" &&
        !busqueda
    ) {
        textoResultadosFaq.textContent =
            `Mostrando ${cantidad} preguntas frecuentes.`;
        return;
    }

    if (cantidad === 1) {
        textoResultadosFaq.textContent =
            "Se ha encontrado 1 pregunta.";
        return;
    }

    textoResultadosFaq.textContent =
        `Se han encontrado ${cantidad} preguntas.`;
}


function filtrarPreguntasFaq() {
    const busqueda =
        normalizarTextoFaq(
            campoBusquedaFaq?.value || ""
        );

    let preguntasVisibles = 0;

    preguntasFaq.forEach((pregunta) => {
        const categoriaPregunta =
            pregunta.dataset.categoria || "";

        const coincideCategoria =
            categoriaFaqActual === "todas" ||
            categoriaPregunta ===
                categoriaFaqActual;

        const textoPregunta =
            obtenerTextoPreguntaFaq(
                pregunta
            );

        const coincideBusqueda =
            !busqueda ||
            textoPregunta.includes(busqueda);

        const debeMostrarse =
            coincideCategoria &&
            coincideBusqueda;

        pregunta.classList.toggle(
            "oculto",
            !debeMostrarse
        );

        if (!debeMostrarse) {
            cerrarPreguntaFaq(
                pregunta
            );
        }

        if (debeMostrarse) {
            preguntasVisibles++;
        }
    });

    if (estadoSinResultadosFaq) {
        estadoSinResultadosFaq.classList.toggle(
            "oculto",
            preguntasVisibles !== 0
        );
    }

    actualizarTextoResultadosFaq(
        preguntasVisibles
    );
}


/* =====================================================
   BOTONES DE CATEGORÍAS
===================================================== */

botonesCategoriasFaq.forEach((boton) => {
    boton.addEventListener(
        "click",
        () => {
            categoriaFaqActual =
                boton.dataset.categoria ||
                "todas";

            botonesCategoriasFaq.forEach(
                (otroBoton) => {
                    otroBoton.classList.toggle(
                        "activa",
                        otroBoton === boton
                    );
                }
            );

            filtrarPreguntasFaq();
        }
    );
});


/* =====================================================
   BUSCADOR
===================================================== */

if (formularioBusquedaFaq) {
    formularioBusquedaFaq.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            filtrarPreguntasFaq();

            const primeraPreguntaVisible =
                Array.from(
                    preguntasFaq
                ).find((pregunta) => {
                    return !pregunta.classList.contains(
                        "oculto"
                    );
                });

            if (primeraPreguntaVisible) {
                primeraPreguntaVisible.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    );
}


if (campoBusquedaFaq) {
    campoBusquedaFaq.addEventListener(
        "input",
        () => {
            filtrarPreguntasFaq();
        }
    );
}


/* =====================================================
   LIMPIAR BÚSQUEDA
===================================================== */

function limpiarBusquedaFaq() {
    if (campoBusquedaFaq) {
        campoBusquedaFaq.value = "";
    }

    categoriaFaqActual = "todas";

    botonesCategoriasFaq.forEach((boton) => {
        boton.classList.toggle(
            "activa",
            boton.dataset.categoria ===
                "todas"
        );
    });

    preguntasFaq.forEach(
        cerrarPreguntaFaq
    );

    filtrarPreguntasFaq();

    campoBusquedaFaq?.focus();
}


if (botonLimpiarBusquedaFaq) {
    botonLimpiarBusquedaFaq.addEventListener(
        "click",
        limpiarBusquedaFaq
    );
}


/* =====================================================
   ABRIR PREGUNTA DESDE LA URL
===================================================== */

function abrirPreguntaDesdeUrlFaq() {
    const identificador =
        window.location.hash
            .replace("#", "")
            .trim();

    if (!identificador) {
        return;
    }

    const pregunta =
        document.querySelector(
            `[data-pregunta="${identificador}"]`
        );

    if (!pregunta) {
        return;
    }

    preguntasFaq.forEach(
        cerrarPreguntaFaq
    );

    abrirPreguntaFaq(
        pregunta
    );

    setTimeout(() => {
        pregunta.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 150);
}


/* =====================================================
   CARGA INICIAL
===================================================== */

function iniciarPreguntasFrecuentes() {
    activarAcordeonFaq();
    filtrarPreguntasFaq();
    abrirPreguntaDesdeUrlFaq();
}


if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPreguntasFrecuentes
    );
} else {
    iniciarPreguntasFrecuentes();
}