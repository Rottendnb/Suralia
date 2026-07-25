/* =====================================================
   CONFIGURACIÓN DE COOKIES DE SURALIA
===================================================== */

const CLAVE_COOKIES_SURALIA =
    "preferenciasCookiesSuralia";


/* =====================================================
   ELEMENTOS DEL BANNER
===================================================== */

const bannerCookies =
    document.querySelector(
        "#banner-cookies"
    );

const botonAceptarCookies =
    document.querySelector(
        "#aceptar-cookies"
    );

const botonRechazarCookies =
    document.querySelector(
        "#rechazar-cookies"
    );

const botonConfigurarCookies =
    document.querySelector(
        "#configurar-cookies"
    );


/* =====================================================
   ELEMENTOS DE LA PÁGINA DE COOKIES
===================================================== */

const campoCookiePreferencias =
    document.querySelector(
        "#cookie-preferencias"
    );

const campoCookieAnalitica =
    document.querySelector(
        "#cookie-analitica"
    );

const campoCookieMarketing =
    document.querySelector(
        "#cookie-marketing"
    );

const botonGuardarCookiesPagina =
    document.querySelector(
        "#guardar-cookies-pagina"
    );

const botonAceptarCookiesPagina =
    document.querySelector(
        "#aceptar-cookies-pagina"
    );

const botonRechazarCookiesPagina =
    document.querySelector(
        "#rechazar-cookies-pagina"
    );

const mensajeConfiguracionCookies =
    document.querySelector(
        "#mensaje-configuracion-cookies"
    );

let temporizadorMensajeCookies;


/* =====================================================
   FUNCIONES DE ALMACENAMIENTO
===================================================== */

function leerPreferenciasCookies() {
    try {
        const preferenciasGuardadas =
            localStorage.getItem(
                CLAVE_COOKIES_SURALIA
            );

        if (!preferenciasGuardadas) {
            return null;
        }

        return JSON.parse(
            preferenciasGuardadas
        );
    } catch (error) {
        console.error(
            "No se han podido leer las preferencias de cookies:",
            error
        );

        return null;
    }
}


function guardarPreferenciasCookies(
    preferencias
) {
    const datosGuardar = {
        necesarias: true,

        preferencias:
            Boolean(
                preferencias.preferencias
            ),

        analitica:
            Boolean(
                preferencias.analitica
            ),

        marketing:
            Boolean(
                preferencias.marketing
            ),

        fechaConsentimiento:
            new Date().toISOString(),

        version:
            "1.0"
    };

    try {
        localStorage.setItem(
            CLAVE_COOKIES_SURALIA,
            JSON.stringify(
                datosGuardar
            )
        );

        aplicarPreferenciasCookies(
            datosGuardar
        );

        actualizarCamposCookies(
            datosGuardar
        );

        ocultarBannerCookies();

        return true;
    } catch (error) {
        console.error(
            "No se han podido guardar las preferencias de cookies:",
            error
        );

        return false;
    }
}


/* =====================================================
   MOSTRAR Y OCULTAR BANNER
===================================================== */

function mostrarBannerCookies() {
    if (!bannerCookies) {
        return;
    }

    bannerCookies.classList.remove(
        "oculto"
    );

    document.body.classList.add(
        "cookies-banner-visible"
    );
}


function ocultarBannerCookies() {
    if (!bannerCookies) {
        return;
    }

    bannerCookies.classList.add(
        "oculto"
    );

    document.body.classList.remove(
        "cookies-banner-visible"
    );
}


/* =====================================================
   APLICAR PREFERENCIAS
===================================================== */

function aplicarPreferenciasCookies(
    preferencias
) {
    /*
     * Aquí conectaremos en el futuro los
     * servicios reales de analítica,
     * marketing o personalización.
     */

    if (preferencias.preferencias) {
        document.documentElement.dataset
            .cookiesPreferencias =
            "activadas";
    } else {
        delete document.documentElement
            .dataset.cookiesPreferencias;
    }


    if (preferencias.analitica) {
        document.documentElement.dataset
            .cookiesAnalitica =
            "activadas";

        activarAnaliticaSuralia();
    } else {
        delete document.documentElement
            .dataset.cookiesAnalitica;

        desactivarAnaliticaSuralia();
    }


    if (preferencias.marketing) {
        document.documentElement.dataset
            .cookiesMarketing =
            "activadas";

        activarMarketingSuralia();
    } else {
        delete document.documentElement
            .dataset.cookiesMarketing;

        desactivarMarketingSuralia();
    }
}


/* =====================================================
   SERVICIOS OPCIONALES
===================================================== */

function activarAnaliticaSuralia() {
    /*
     * Cuando añadas Google Analytics,
     * Plausible u otra herramienta,
     * el script deberá cargarse aquí.
     */

    console.log(
        "Cookies de analítica aceptadas."
    );
}


function desactivarAnaliticaSuralia() {
    /*
     * Aquí se eliminarán o desactivarán
     * las cookies de analítica cuando
     * exista una herramienta real.
     */

    console.log(
        "Cookies de analítica desactivadas."
    );
}


function activarMarketingSuralia() {
    console.log(
        "Cookies de marketing aceptadas."
    );
}


function desactivarMarketingSuralia() {
    console.log(
        "Cookies de marketing desactivadas."
    );
}


/* =====================================================
   ACTUALIZAR INTERRUPTORES
===================================================== */

function actualizarCamposCookies(
    preferencias
) {
    if (campoCookiePreferencias) {
        campoCookiePreferencias.checked =
            Boolean(
                preferencias.preferencias
            );
    }

    if (campoCookieAnalitica) {
        campoCookieAnalitica.checked =
            Boolean(
                preferencias.analitica
            );
    }

    if (campoCookieMarketing) {
        campoCookieMarketing.checked =
            Boolean(
                preferencias.marketing
            );
    }
}


/* =====================================================
   MENSAJE DE CONFIRMACIÓN
===================================================== */

function mostrarMensajeCookies(
    mensaje
) {
    if (!mensajeConfiguracionCookies) {
        return;
    }

    mensajeConfiguracionCookies.textContent =
        mensaje;

    mensajeConfiguracionCookies.classList.add(
        "visible"
    );

    clearTimeout(
        temporizadorMensajeCookies
    );

    temporizadorMensajeCookies =
        setTimeout(
            () => {
                mensajeConfiguracionCookies
                    .classList.remove(
                        "visible"
                    );
            },
            3500
        );
}


/* =====================================================
   ACEPTAR TODAS
===================================================== */

function aceptarTodasLasCookies() {
    const guardadoCorrecto =
        guardarPreferenciasCookies({
            preferencias: true,
            analitica: true,
            marketing: true
        });

    if (guardadoCorrecto) {
        mostrarMensajeCookies(
            "Has aceptado todas las cookies."
        );
    }
}


/* =====================================================
   RECHAZAR OPCIONALES
===================================================== */

function rechazarCookiesOpcionales() {
    const guardadoCorrecto =
        guardarPreferenciasCookies({
            preferencias: false,
            analitica: false,
            marketing: false
        });

    if (guardadoCorrecto) {
        mostrarMensajeCookies(
            "Se han rechazado las cookies opcionales."
        );
    }
}


/* =====================================================
   GUARDAR SELECCIÓN PERSONALIZADA
===================================================== */

function guardarSeleccionCookies() {
    const guardadoCorrecto =
        guardarPreferenciasCookies({
            preferencias:
                campoCookiePreferencias
                    ?.checked || false,

            analitica:
                campoCookieAnalitica
                    ?.checked || false,

            marketing:
                campoCookieMarketing
                    ?.checked || false
        });

    if (guardadoCorrecto) {
        mostrarMensajeCookies(
            "Tus preferencias se han guardado correctamente."
        );
    }
}


/* =====================================================
   CONFIGURAR DESDE EL BANNER
===================================================== */

function abrirConfiguracionCookies() {
    if (
        window.location.pathname
            .endsWith(
                "cookies.html"
            )
    ) {
        ocultarBannerCookies();

        const configuracion =
            document.querySelector(
                "#configuracion"
            );

        configuracion?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    window.location.href =
        "cookies.html#configuracion";
}


/* =====================================================
   EVENTOS DEL BANNER
===================================================== */

botonAceptarCookies?.addEventListener(
    "click",
    aceptarTodasLasCookies
);


botonRechazarCookies?.addEventListener(
    "click",
    rechazarCookiesOpcionales
);


botonConfigurarCookies?.addEventListener(
    "click",
    abrirConfiguracionCookies
);


/* =====================================================
   EVENTOS DE LA PÁGINA
===================================================== */

botonGuardarCookiesPagina?.addEventListener(
    "click",
    guardarSeleccionCookies
);


botonAceptarCookiesPagina?.addEventListener(
    "click",
    aceptarTodasLasCookies
);


botonRechazarCookiesPagina?.addEventListener(
    "click",
    rechazarCookiesOpcionales
);


/* =====================================================
   ABRIR EL PANEL DESDE OTROS ENLACES
===================================================== */

document
    .querySelectorAll(
        "[data-abrir-cookies]"
    )
    .forEach((boton) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();

                abrirConfiguracionCookies();
            }
        );
    });


/* =====================================================
   INICIO
===================================================== */

function iniciarCookiesSuralia() {
    const preferencias =
        leerPreferenciasCookies();

    if (!preferencias) {
        actualizarCamposCookies({
            preferencias: false,
            analitica: false,
            marketing: false
        });

        mostrarBannerCookies();

        return;
    }

    actualizarCamposCookies(
        preferencias
    );

    aplicarPreferenciasCookies(
        preferencias
    );

    ocultarBannerCookies();
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarCookiesSuralia
    );
} else {
    iniciarCookiesSuralia();
}