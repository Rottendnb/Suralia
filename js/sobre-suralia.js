/* =====================================================
   ANIMACIONES DE SOBRE SURALIA
===================================================== */

const elementosAnimablesSobre =
    document.querySelectorAll(
        `
        .sobre-historia__texto,
        .sobre-historia__visual,
        .sobre-propuesta__tarjeta,
        .sobre-valores__introduccion,
        .sobre-valor,
        .sobre-categorias__grid > a,
        .sobre-creador__avatar,
        .sobre-creador__texto
        `
    );


/* =====================================================
   PREPARAR ELEMENTOS
===================================================== */

function prepararAnimacionesSobre() {
    elementosAnimablesSobre.forEach(
        (elemento, indice) => {
            elemento.classList.add(
                "sobre-animable"
            );

            const retraso =
                Math.min(
                    (indice % 4) * 80,
                    240
                );

            elemento.style.transitionDelay =
                `${retraso}ms`;
        }
    );
}


/* =====================================================
   OBSERVADOR
===================================================== */

function activarAnimacionesSobre() {
    if (
        !("IntersectionObserver" in window)
    ) {
        elementosAnimablesSobre.forEach(
            (elemento) => {
                elemento.classList.add(
                    "sobre-visible"
                );
            }
        );

        return;
    }

    const observador =
        new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach(
                    (entrada) => {
                        if (
                            !entrada.isIntersecting
                        ) {
                            return;
                        }

                        entrada.target.classList.add(
                            "sobre-visible"
                        );

                        observer.unobserve(
                            entrada.target
                        );
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    elementosAnimablesSobre.forEach(
        (elemento) => {
            observador.observe(elemento);
        }
    );
}


/* =====================================================
   DESPLAZAMIENTO HACIA LA HISTORIA
===================================================== */

const enlaceConocerProyecto =
    document.querySelector(
        'a[href="#historia"]'
    );

if (enlaceConocerProyecto) {
    enlaceConocerProyecto.addEventListener(
        "click",
        (evento) => {
            const seccionHistoria =
                document.querySelector(
                    "#historia"
                );

            if (!seccionHistoria) {
                return;
            }

            evento.preventDefault();

            seccionHistoria.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}


/* =====================================================
   INICIAR
===================================================== */

function iniciarSobreSuralia() {
    prepararAnimacionesSobre();
    activarAnimacionesSobre();
}


if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarSobreSuralia
    );
} else {
    iniciarSobreSuralia();
}