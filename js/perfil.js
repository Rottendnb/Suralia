function leerDatoLocal(clave, valorAlternativo = null) {
    try {
        const contenido = localStorage.getItem(clave);

        if (!contenido) {
            return valorAlternativo;
        }

        return JSON.parse(contenido);
    } catch (error) {
        console.error(`No se pudo leer ${clave}:`, error);
        return valorAlternativo;
    }
}

function guardarDatoLocal(clave, valor) {
    try {
        localStorage.setItem(
            clave,
            JSON.stringify(valor)
        );

        return true;
    } catch (error) {
        console.error(`No se pudo guardar ${clave}:`, error);
        return false;
    }
}

const PLAN_PONCHO_K_UUID =
    "b3039583-9882-4877-ac4a-5a713393f495";

function migrarPonchoKAntiguoEnLocalStorage() {
    const claves = [
        "reservasSuralia",
        "favoritosSuralia"
    ];

    claves.forEach((clave) => {
        const elementos =
            leerDatoLocal(
                clave,
                []
            );

        if (!Array.isArray(elementos)) {
            return;
        }

        let huboCambios =
            false;

        const actualizados =
            elementos.map((item) => {
                const planId =
                    String(
                        item?.planId ||
                        ""
                    );

                const titulo =
                    String(
                        item?.titulo ||
                        item?.nombre ||
                        ""
                    )
                        .trim()
                        .toLowerCase();

                const esPonchoAntiguo =
                    planId ===
                        "poncho-k-cartuja" ||
                    (
                        !planId &&
                        titulo ===
                            "poncho k - cartuja center cite"
                    );

                if (!esPonchoAntiguo) {
                    return item;
                }

                huboCambios =
                    true;

                return {
                    ...item,
                    planId:
                        PLAN_PONCHO_K_UUID,
                    enlace:
                        `detalle-plan.html?id=${PLAN_PONCHO_K_UUID}`
                };
            });

        if (huboCambios) {
            guardarDatoLocal(
                clave,
                actualizados
            );
        }
    });
}

migrarPonchoKAntiguoEnLocalStorage();

const usuarioGuardado =
    leerDatoLocal("usuarioSuralia", {});

const sesionGuardada =
    leerDatoLocal("sesionSuralia", null);

if (
    !sesionGuardada ||
    !sesionGuardada.conectado
) {
    window.location.replace("login.html");
}

/* =========================================
   ELEMENTOS GENERALES DEL PERFIL
========================================= */

const botonesMenuPerfil = document.querySelectorAll(
    ".perfil-menu__enlace[data-seccion]"
);

const seccionesPerfil = document.querySelectorAll(
    ".perfil-seccion"
);

const enlacesSeccion = document.querySelectorAll(
    "[data-ir-seccion]"
);

const botonCerrarSesion = document.querySelector(
    "#boton-cerrar-sesion"
);

const formularioPerfil = document.querySelector(
    "#formulario-perfil"
);

const perfilFechaNacimiento =
    document.querySelector(
        "#perfil-fecha-nacimiento"
    );

const perfilLocalidad =
    document.querySelector(
        "#perfil-localidad"
    );

const perfilOcupacion =
    document.querySelector(
        "#perfil-ocupacion"
    );

const perfilDescripcion =
    document.querySelector(
        "#perfil-descripcion"
    );

const contadorDescripcionPerfil =
    document.querySelector(
        "#contador-descripcion-perfil"
    );

const perfilVisible =
    document.querySelector(
        "#perfil-visible"
    );

const mostrarEdad =
    document.querySelector(
        "#mostrar-edad"
    );

const notificacionPerfil = document.querySelector(
    "#notificacion-perfil"
);

let temporizadorNotificacion;

/* =========================================
   MODAL DE CANCELACIÓN DE RESERVA
========================================= */

const modalCancelacion = document.querySelector(
    "#modal-cancelacion"
);

const mantenerReserva = document.querySelector(
    "#mantener-reserva"
);

const confirmarCancelacion = document.querySelector(
    "#confirmar-cancelacion"
);

let reservaPendienteCancelar = null;
let tipoCancelacionReservaPendiente = "usuario";
let elementoQueAbrioModalCancelacion = null;

/* =========================================
   MODAL DE ELIMINACIÓN DE CONEXIÓN
========================================= */

const modalEliminarConexion = document.querySelector(
    "#modal-eliminar-conexion"
);

const cancelarEliminarConexion = document.querySelector(
    "#cancelar-eliminar-conexion"
);

const confirmarEliminarConexion = document.querySelector(
    "#confirmar-eliminar-conexion"
);

const descripcionModalEliminarConexion = document.querySelector(
    "#descripcion-modal-eliminar-conexion"
);

let conexionPendienteEliminar = null;
let nombreConexionPendienteEliminar = "";
let botonConexionPendienteEliminar = null;
let elementoQueAbrioModalEliminarConexion = null;

/* =========================================
   FUNCIONES GENERALES
========================================= */

function obtenerIniciales(nombre, apellidos) {
    const inicialNombre = nombre?.trim().charAt(0) || "";
    const inicialApellido = apellidos?.trim().charAt(0) || "";

    return `${inicialNombre}${inicialApellido}`.toUpperCase();
}

function mostrarNotificacion(mensaje) {
    if (!notificacionPerfil) {
        console.log(mensaje);
        return;
    }

    const texto = notificacionPerfil.querySelector("span");

    if (texto) {
        texto.textContent = mensaje;
    }

    notificacionPerfil.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacionPerfil.classList.remove("visible");
    }, 3000);
}

function aplicarAvatar(elemento) {
    if (!elemento) {
        return;
    }

    const iniciales =
        obtenerIniciales(
            usuarioGuardado.nombre,
            usuarioGuardado.apellidos
        ) || "SU";

    elemento.classList.remove(
        "avatar--imagen"
    );

    elemento.style.backgroundImage = "";
    elemento.textContent = "";

    if (
        usuarioGuardado.avatarTipo === "imagen" &&
        usuarioGuardado.avatarValor
    ) {
        elemento.classList.add(
            "avatar--imagen"
        );

        elemento.style.backgroundImage =
            `url("${usuarioGuardado.avatarValor}")`;

        return;
    }


    elemento.textContent = iniciales;
}

function cargarDatosUsuario() {
    const nombreCompleto =
        `${usuarioGuardado.nombre || ""} ${usuarioGuardado.apellidos || ""}`.trim();

    const nombreHeader =
        document.querySelector("#nombre-header");

    const nombrePerfil =
        document.querySelector("#nombre-perfil");

    const emailPerfil =
        document.querySelector("#email-perfil");

    const saludoUsuario =
        document.querySelector("#saludo-usuario");

    const avatarHeader =
        document.querySelector("#avatar-header");

    const avatarPerfil =
        document.querySelector("#avatar-perfil");

    const avatarPreview =
        document.querySelector("#avatar-preview");

    const perfilNombre =
        document.querySelector("#perfil-nombre");

    const perfilApellidos =
        document.querySelector("#perfil-apellidos");

    const perfilEmail =
        document.querySelector("#perfil-email");

    const perfilTelefono =
        document.querySelector("#perfil-telefono");

    if (nombreHeader) {
        nombreHeader.textContent =
            usuarioGuardado.nombre ||
            "Usuario";
    }

    if (nombrePerfil) {
        nombrePerfil.textContent =
            nombreCompleto ||
            "Usuario";
    }

    if (emailPerfil) {
        emailPerfil.textContent =
            usuarioGuardado.email ||
            "";
    }

    if (saludoUsuario) {
        saludoUsuario.textContent =
            usuarioGuardado.nombre ||
            "Usuario";
    }

    aplicarAvatar(avatarHeader);
    aplicarAvatar(avatarPerfil);
    aplicarAvatar(avatarPreview);

    if (perfilNombre) {
        perfilNombre.value =
            usuarioGuardado.nombre ||
            "";
    }

    if (perfilApellidos) {
        perfilApellidos.value =
            usuarioGuardado.apellidos ||
            "";
    }

    if (perfilEmail) {
        perfilEmail.value =
            usuarioGuardado.email ||
            "";
    }

    if (perfilTelefono) {
        perfilTelefono.value =
            usuarioGuardado.telefono ||
            "";
    }
}

function cambiarSeccion(
    nombreSeccion,
    moverFoco = false
) {
    let seccionActiva =
        document.querySelector(
            `#seccion-${nombreSeccion}`
        );

    if (!seccionActiva) {
        nombreSeccion = "resumen";

        seccionActiva =
            document.querySelector(
                "#seccion-resumen"
            );
    }

    botonesMenuPerfil.forEach((boton) => {
        const esActivo =
            boton.dataset.seccion ===
            nombreSeccion;

        boton.classList.toggle(
            "activo",
            esActivo
        );

        boton.setAttribute(
            "aria-selected",
            String(esActivo)
        );

        boton.setAttribute(
            "tabindex",
            esActivo
                ? "0"
                : "-1"
        );
    });

    seccionesPerfil.forEach((seccion) => {
        const esActiva =
            seccion.id ===
            `seccion-${nombreSeccion}`;

        seccion.classList.toggle(
            "activa",
            esActiva
        );

        seccion.setAttribute(
            "aria-hidden",
            String(!esActiva)
        );
    });

    if (
        window.location.hash !==
        `#${nombreSeccion}`
    ) {
        history.replaceState(
            null,
            "",
            `#${nombreSeccion}`
        );
    }

    if (
        moverFoco &&
        seccionActiva
    ) {
        seccionActiva.focus({
            preventScroll: true
        });

        seccionActiva.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* =========================================
   NAVEGACIÓN DEL PERFIL
========================================= */

botonesMenuPerfil.forEach(
    (boton, indice) => {
        boton.addEventListener(
            "click",
            (evento) => {
                evento.preventDefault();

                cambiarSeccion(
                    boton.dataset.seccion,
                    true
                );
            }
        );

        boton.addEventListener(
            "keydown",
            (evento) => {
                const teclasPermitidas = [
                    "ArrowRight",
                    "ArrowLeft",
                    "ArrowDown",
                    "ArrowUp",
                    "Home",
                    "End"
                ];

                if (
                    !teclasPermitidas.includes(
                        evento.key
                    )
                ) {
                    return;
                }

                evento.preventDefault();

                let nuevoIndice = indice;

                if (
                    evento.key ===
                        "ArrowRight" ||
                    evento.key ===
                        "ArrowDown"
                ) {
                    nuevoIndice =
                        (
                            indice + 1
                        ) %
                        botonesMenuPerfil.length;
                }

                if (
                    evento.key ===
                        "ArrowLeft" ||
                    evento.key ===
                        "ArrowUp"
                ) {
                    nuevoIndice =
                        (
                            indice -
                            1 +
                            botonesMenuPerfil.length
                        ) %
                        botonesMenuPerfil.length;
                }

                if (
                    evento.key === "Home"
                ) {
                    nuevoIndice = 0;
                }

                if (
                    evento.key === "End"
                ) {
                    nuevoIndice =
                        botonesMenuPerfil.length -
                        1;
                }

                const nuevoBoton =
                    botonesMenuPerfil[
                        nuevoIndice
                    ];

                nuevoBoton?.focus();

                if (nuevoBoton) {
                    cambiarSeccion(
                        nuevoBoton.dataset
                            .seccion
                    );
                }
            }
        );
    }
);

enlacesSeccion.forEach((boton) => {
    function abrirSeccionEnlazada(evento) {
        evento.preventDefault();

        cambiarSeccion(
            boton.dataset.irSeccion,
            true
        );
    }

    boton.addEventListener(
        "click",
        abrirSeccionEnlazada
    );

    boton.addEventListener(
        "keydown",
        (evento) => {
            if (
                evento.key !== "Enter" &&
                evento.key !== " "
            ) {
                return;
            }

            abrirSeccionEnlazada(evento);
        }
    );
});

function cargarSeccionDesdeURL() {
    const seccionURL =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();

    const seccionesPermitidas = [
        "resumen",
        "reservas",
        "favoritos",
        "afinidades",
        "conexiones",
        "publicados",
        "datos"
    ];

    cambiarSeccion(
        seccionesPermitidas.includes(
            seccionURL
        )
            ? seccionURL
            : "resumen"
    );
}

window.addEventListener(
    "hashchange",
    cargarSeccionDesdeURL
);

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener(
        "click",
        async () => {
            botonCerrarSesion.disabled = true;

            try {
                if (window.clienteSupabase) {
                    const { error } =
                        await window.clienteSupabase
                            .auth
                            .signOut();

                    if (error) {
                        console.error(
                            "Error al cerrar la sesión de Supabase:",
                            error
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "No se pudo cerrar la sesión:",
                    error
                );
            } finally {
                localStorage.removeItem(
                    "sesionSuralia"
                );

                sessionStorage.removeItem(
                    "destinoDespuesLoginSuralia"
                );

                window.location.replace(
                    "login.html"
                );
            }
        }
    );
}

/* =========================================
   GALERÍA DE FOTOS EN SUPABASE
========================================= */

const inputFotosPerfil =
    document.querySelector(
        "#input-fotos-perfil"
    );

const galeriaFotosPerfil =
    document.querySelector(
        "#galeria-fotos-perfil"
    );

const estadoVacioGaleria =
    document.querySelector(
        "#estado-vacio-galeria"
    );

const contadorFotosPerfil =
    document.querySelector(
        "#contador-fotos-perfil"
    );

const botonAnadirFotos =
    document.querySelector(
        "#boton-anadir-fotos"
    );

const errorFotosPerfil =
    document.querySelector(
        "#error-fotos-perfil"
    );

const BUCKET_FOTOS_PERFIL =
    "fotos-perfil";

const MAXIMO_FOTOS_PERFIL =
    6;

let fotosPerfil = [];


function mostrarErrorFotosPerfil(
    mensaje = ""
) {
    if (errorFotosPerfil) {
        errorFotosPerfil.textContent =
            mensaje;
    }
}


function escaparAtributoHTML(
    valor = ""
) {
    return escaparHTML(valor);
}


/*
   Sustituye tu función reducirFotoPerfil() completa por esta versión.

   Esta función:
   1. Lee la imagen.
   2. Detecta bandas negras uniformes en los bordes.
   3. Recorta esas bandas.
   4. Reduce la imagen a un máximo de 1200 px.
   5. La convierte a JPG optimizado.
*/

function reducirFotoPerfil(
    archivo,
    maximo = 1200,
    calidad = 0.86
) {
    return new Promise(
        (resolve, reject) => {
            const lector =
                new FileReader();

            lector.onerror = () => {
                reject(
                    new Error(
                        "No se pudo leer la fotografía."
                    )
                );
            };

            lector.onload = () => {
                const imagen =
                    new Image();

                imagen.onerror = () => {
                    reject(
                        new Error(
                            "El archivo no es una imagen válida."
                        )
                    );
                };

                imagen.onload = () => {
                    const lienzoOriginal =
                        document.createElement(
                            "canvas"
                        );

                    lienzoOriginal.width =
                        imagen.width;

                    lienzoOriginal.height =
                        imagen.height;

                    const contextoOriginal =
                        lienzoOriginal.getContext(
                            "2d",
                            {
                                willReadFrequently:
                                    true
                            }
                        );

                    if (!contextoOriginal) {
                        reject(
                            new Error(
                                "No se pudo procesar la fotografía."
                            )
                        );

                        return;
                    }

                    contextoOriginal.drawImage(
                        imagen,
                        0,
                        0
                    );

                    let recorteX = 0;
                    let recorteY = 0;
                    let recorteAncho =
                        imagen.width;
                    let recorteAlto =
                        imagen.height;

                    try {
                        const datosImagen =
                            contextoOriginal.getImageData(
                                0,
                                0,
                                imagen.width,
                                imagen.height
                            );

                        const pixeles =
                            datosImagen.data;

                        /*
                           Umbral conservador:
                           solo considera negro un píxel
                           cuando sus tres canales son muy oscuros.
                        */
                        const UMBRAL_NEGRO = 24;

                        /*
                           Una fila o columna se considera banda negra
                           cuando al menos el 97 % de sus píxeles
                           son prácticamente negros.
                        */
                        const PORCENTAJE_MINIMO_NEGRO =
                            0.97;

                        /*
                           Límite de seguridad:
                           nunca recorta más del 25 % por cada lado.
                        */
                        const maximoRecorteVertical =
                            Math.floor(
                                imagen.height *
                                0.25
                            );

                        const maximoRecorteHorizontal =
                            Math.floor(
                                imagen.width *
                                0.25
                            );

                        function pixelEsNegro(
                            x,
                            y
                        ) {
                            const indice =
                                (
                                    y *
                                    imagen.width +
                                    x
                                ) * 4;

                            return (
                                pixeles[indice] <=
                                    UMBRAL_NEGRO &&
                                pixeles[indice + 1] <=
                                    UMBRAL_NEGRO &&
                                pixeles[indice + 2] <=
                                    UMBRAL_NEGRO
                            );
                        }

                        function filaEsNegra(
                            y
                        ) {
                            let negros = 0;

                            /*
                               Se muestrea cada dos píxeles
                               para mejorar el rendimiento.
                            */
                            let muestras = 0;

                            for (
                                let x = 0;
                                x < imagen.width;
                                x += 2
                            ) {
                                muestras += 1;

                                if (
                                    pixelEsNegro(
                                        x,
                                        y
                                    )
                                ) {
                                    negros += 1;
                                }
                            }

                            return (
                                negros /
                                muestras >=
                                PORCENTAJE_MINIMO_NEGRO
                            );
                        }

                        function columnaEsNegra(
                            x
                        ) {
                            let negros = 0;
                            let muestras = 0;

                            for (
                                let y = 0;
                                y < imagen.height;
                                y += 2
                            ) {
                                muestras += 1;

                                if (
                                    pixelEsNegro(
                                        x,
                                        y
                                    )
                                ) {
                                    negros += 1;
                                }
                            }

                            return (
                                negros /
                                muestras >=
                                PORCENTAJE_MINIMO_NEGRO
                            );
                        }

                        let bordeSuperior = 0;

                        while (
                            bordeSuperior <
                                maximoRecorteVertical &&
                            filaEsNegra(
                                bordeSuperior
                            )
                        ) {
                            bordeSuperior += 1;
                        }

                        let bordeInferior =
                            imagen.height - 1;

                        while (
                            imagen.height -
                                1 -
                                bordeInferior <
                                maximoRecorteVertical &&
                            filaEsNegra(
                                bordeInferior
                            )
                        ) {
                            bordeInferior -= 1;
                        }

                        let bordeIzquierdo = 0;

                        while (
                            bordeIzquierdo <
                                maximoRecorteHorizontal &&
                            columnaEsNegra(
                                bordeIzquierdo
                            )
                        ) {
                            bordeIzquierdo += 1;
                        }

                        let bordeDerecho =
                            imagen.width - 1;

                        while (
                            imagen.width -
                                1 -
                                bordeDerecho <
                                maximoRecorteHorizontal &&
                            columnaEsNegra(
                                bordeDerecho
                            )
                        ) {
                            bordeDerecho -= 1;
                        }

                        const anchoDetectado =
                            bordeDerecho -
                            bordeIzquierdo +
                            1;

                        const altoDetectado =
                            bordeInferior -
                            bordeSuperior +
                            1;

                        /*
                           Solo aplica el recorte cuando se ha
                           detectado una banda real de al menos 4 px.
                        */
                        const hayRecorteReal =
                            bordeSuperior >= 4 ||
                            imagen.height -
                                1 -
                                bordeInferior >= 4 ||
                            bordeIzquierdo >= 4 ||
                            imagen.width -
                                1 -
                                bordeDerecho >= 4;

                        if (
                            hayRecorteReal &&
                            anchoDetectado > 0 &&
                            altoDetectado > 0
                        ) {
                            recorteX =
                                bordeIzquierdo;

                            recorteY =
                                bordeSuperior;

                            recorteAncho =
                                anchoDetectado;

                            recorteAlto =
                                altoDetectado;
                        }
                    } catch (error) {
                        /*
                           Si la detección falla, la fotografía
                           se procesa sin recorte automático.
                        */
                        console.warn(
                            "No se pudieron detectar los bordes negros:",
                            error
                        );
                    }

                    const escala =
                        Math.min(
                            1,
                            maximo /
                                Math.max(
                                    recorteAncho,
                                    recorteAlto
                                )
                        );

                    const anchoFinal =
                        Math.max(
                            1,
                            Math.round(
                                recorteAncho *
                                    escala
                            )
                        );

                    const altoFinal =
                        Math.max(
                            1,
                            Math.round(
                                recorteAlto *
                                    escala
                            )
                        );

                    const lienzoFinal =
                        document.createElement(
                            "canvas"
                        );

                    lienzoFinal.width =
                        anchoFinal;

                    lienzoFinal.height =
                        altoFinal;

                    const contextoFinal =
                        lienzoFinal.getContext(
                            "2d"
                        );

                    if (!contextoFinal) {
                        reject(
                            new Error(
                                "No se pudo crear la fotografía optimizada."
                            )
                        );

                        return;
                    }

                    /*
                       Fondo blanco para evitar transparencias negras
                       al convertir imágenes PNG a JPG.
                    */
                    contextoFinal.fillStyle =
                        "#ffffff";

                    contextoFinal.fillRect(
                        0,
                        0,
                        anchoFinal,
                        altoFinal
                    );

                    contextoFinal.drawImage(
                        imagen,
                        recorteX,
                        recorteY,
                        recorteAncho,
                        recorteAlto,
                        0,
                        0,
                        anchoFinal,
                        altoFinal
                    );

                    lienzoFinal.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(
                                    new Error(
                                        "No se pudo crear la fotografía optimizada."
                                    )
                                );

                                return;
                            }

                            resolve(blob);
                        },
                        "image/jpeg",
                        calidad
                    );
                };

                imagen.src =
                    lector.result;
            };

            lector.readAsDataURL(
                archivo
            );
        }
    );
}


async function obtenerUsuarioGaleria() {
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

    return data.session?.user || null;
}


function crearFotoGaleriaHTML(
    foto
) {
    const id =
        Number(foto.id);

    const url =
        escaparAtributoHTML(
            foto.foto_url
        );

    const esPrincipal =
        Boolean(
            foto.es_principal
        );

    return `
        <article
            class="foto-perfil-item ${
                esPrincipal
                    ? "foto-perfil-item--principal"
                    : ""
            }"
            data-foto-id="${id}"
        >

            <img
                src="${url}"
                alt="${
                    esPrincipal
                        ? "Fotografía principal del perfil"
                        : "Fotografía de la galería del perfil"
                }"
                loading="lazy"
            >

            ${
                esPrincipal
                    ? `
                        <span class="foto-perfil-item__principal">
                            <i class="fa-solid fa-star"></i>
                            Principal
                        </span>
                    `
                    : ""
            }

            <div class="foto-perfil-item__menu">

                <button
                    type="button"
                    class="foto-perfil-item__menu-boton"
                    aria-label="Abrir opciones de la fotografía"
                    aria-expanded="false"
                    data-menu-foto="${id}"
                >
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>

                <div
                    class="foto-perfil-item__opciones"
                    data-opciones-foto="${id}"
                    hidden
                >

                    ${
                        !esPrincipal
                            ? `
                                <button
                                    type="button"
                                    data-hacer-principal="${id}"
                                >
                                    <i class="fa-solid fa-star"></i>
                                    Hacer principal
                                </button>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="foto-perfil-item__eliminar"
                        data-eliminar-foto="${id}"
                    >
                        <i class="fa-regular fa-trash-can"></i>
                        Eliminar foto
                    </button>

                </div>

            </div>

        </article>
    `;
}


function mostrarGaleriaPerfil() {
    const total =
        fotosPerfil.length;

    if (contadorFotosPerfil) {
        contadorFotosPerfil.textContent =
            String(total);
    }

    if (botonAnadirFotos) {
        const completa =
            total >=
            MAXIMO_FOTOS_PERFIL;

        botonAnadirFotos.classList.toggle(
            "deshabilitado",
            completa
        );

        botonAnadirFotos.setAttribute(
            "aria-disabled",
            String(completa)
        );
    }

    if (
        !galeriaFotosPerfil ||
        !estadoVacioGaleria
    ) {
        return;
    }

    if (total === 0) {
        galeriaFotosPerfil.innerHTML =
            "";

        galeriaFotosPerfil.classList.add(
            "oculta"
        );

        estadoVacioGaleria.classList.remove(
            "oculto"
        );

        return;
    }

    galeriaFotosPerfil.classList.remove(
        "oculta"
    );

    estadoVacioGaleria.classList.add(
        "oculto"
    );

    galeriaFotosPerfil.innerHTML =
        fotosPerfil
            .sort(
                (fotoA, fotoB) =>
                    Number(fotoA.posicion) -
                    Number(fotoB.posicion)
            )
            .map(
                crearFotoGaleriaHTML
            )
            .join("");

    activarEventosGaleria();
}


async function cargarGaleriaPerfil() {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return;
    }

    try {
        const usuario =
            await obtenerUsuarioGaleria();

        if (!usuario) {
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from("fotos_perfil")
            .select(
                `
                    id,
                    foto_url,
                    ruta_storage,
                    es_principal,
                    posicion,
                    creado_en
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .order(
                "posicion",
                {
                    ascending:
                        true
                }
            );

        if (error) {
            throw error;
        }

        fotosPerfil =
            Array.isArray(data)
                ? data
                : [];

        const principal =
            fotosPerfil.find(
                (foto) =>
                    foto.es_principal
            );

        if (principal?.foto_url) {
            usuarioGuardado.avatarTipo =
                "imagen";

            usuarioGuardado.avatarValor =
                principal.foto_url;

            guardarDatoLocal(
                "usuarioSuralia",
                usuarioGuardado
            );

            cargarDatosUsuario();
        }

        mostrarGaleriaPerfil();
    } catch (error) {
        console.error(
            "No se pudo cargar la galería:",
            error
        );

        mostrarErrorFotosPerfil(
            "No se han podido cargar tus fotografías."
        );
    }
}


async function sincronizarFotoPrincipal(
    usuarioId,
    fotoUrl
) {
    const {
        error
    } = await window.clienteSupabase
        .from("perfiles_sociales")
        .upsert(
            {
                usuario_id:
                    usuarioId,

                foto_principal_url:
                    fotoUrl,

                actualizado_en:
                    new Date().toISOString()
            },
            {
                onConflict:
                    "usuario_id"
            }
        );

    if (error) {
        throw error;
    }

    usuarioGuardado.avatarTipo =
        fotoUrl
            ? "imagen"
            : "";

    usuarioGuardado.avatarValor =
        fotoUrl || "";

    guardarDatoLocal(
        "usuarioSuralia",
        usuarioGuardado
    );

    cargarDatosUsuario();
}


async function subirUnaFotoGaleria(
    archivo,
    usuario,
    posicion,
    seraPrincipal
) {
    const blob =
        await reducirFotoPerfil(
            archivo
        );

    const nombreArchivo =
        `foto-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}.jpg`;

    const ruta =
        `${usuario.id}/${nombreArchivo}`;

    const {
        error: errorSubida
    } = await window.clienteSupabase
        .storage
        .from(
            BUCKET_FOTOS_PERFIL
        )
        .upload(
            ruta,
            blob,
            {
                cacheControl:
                    "3600",

                contentType:
                    "image/jpeg",

                upsert:
                    false
            }
        );

    if (errorSubida) {
        throw errorSubida;
    }

    const {
        data: datosUrl
    } = window.clienteSupabase
        .storage
        .from(
            BUCKET_FOTOS_PERFIL
        )
        .getPublicUrl(
            ruta
        );

    const urlPublica =
        datosUrl?.publicUrl;

    if (!urlPublica) {
        await window.clienteSupabase
            .storage
            .from(
                BUCKET_FOTOS_PERFIL
            )
            .remove([
                ruta
            ]);

        throw new Error(
            "No se pudo obtener la URL de la fotografía."
        );
    }

    const {
        data: fotoCreada,
        error: errorRegistro
    } = await window.clienteSupabase
        .from("fotos_perfil")
        .insert({
            usuario_id:
                usuario.id,

            foto_url:
                urlPublica,

            ruta_storage:
                ruta,

            es_principal:
                seraPrincipal,

            posicion:
                posicion
        })
        .select(
            `
                id,
                foto_url,
                ruta_storage,
                es_principal,
                posicion,
                creado_en
            `
        )
        .single();

    if (errorRegistro) {
        await window.clienteSupabase
            .storage
            .from(
                BUCKET_FOTOS_PERFIL
            )
            .remove([
                ruta
            ]);

        throw errorRegistro;
    }

    return fotoCreada;
}


async function subirFotosGaleria(
    archivos
) {
    const usuario =
        await obtenerUsuarioGaleria();

    if (!usuario) {
        throw new Error(
            "No existe una sesión válida."
        );
    }

    const huecosDisponibles =
        MAXIMO_FOTOS_PERFIL -
        fotosPerfil.length;

    const archivosPermitidos =
        archivos.slice(
            0,
            huecosDisponibles
        );

    let siguientePosicion =
        fotosPerfil.length > 0
            ? Math.max(
                ...fotosPerfil.map(
                    (foto) =>
                        Number(
                            foto.posicion
                        )
                )
            ) + 1
            : 1;

    for (
        const archivo
        of archivosPermitidos
    ) {
        const esPrimeraFoto =
            fotosPerfil.length === 0;

        const fotoCreada =
            await subirUnaFotoGaleria(
                archivo,
                usuario,
                siguientePosicion,
                esPrimeraFoto
            );

        fotosPerfil.push(
            fotoCreada
        );

        if (esPrimeraFoto) {
            await sincronizarFotoPrincipal(
                usuario.id,
                fotoCreada.foto_url
            );
        }

        siguientePosicion +=
            1;
    }

    mostrarGaleriaPerfil();
}


async function hacerFotoPrincipal(
    fotoId
) {
    const usuario =
        await obtenerUsuarioGaleria();

    if (!usuario) {
        throw new Error(
            "No existe una sesión válida."
        );
    }

    const fotoElegida =
        fotosPerfil.find(
            (foto) =>
                Number(foto.id) ===
                Number(fotoId)
        );

    if (!fotoElegida) {
        throw new Error(
            "No se ha encontrado la fotografía."
        );
    }

    const principalActual =
        fotosPerfil.find(
            (foto) =>
                foto.es_principal
        );

    if (
        principalActual &&
        Number(principalActual.id) !==
            Number(fotoId)
    ) {
        const {
            error: errorDesmarcar
        } = await window.clienteSupabase
            .from("fotos_perfil")
            .update({
                es_principal:
                    false,

                actualizado_en:
                    new Date().toISOString()
            })
            .eq(
                "id",
                principalActual.id
            )
            .eq(
                "usuario_id",
                usuario.id
            );

        if (errorDesmarcar) {
            throw errorDesmarcar;
        }
    }

    const {
        error: errorPrincipal
    } = await window.clienteSupabase
        .from("fotos_perfil")
        .update({
            es_principal:
                true,

            actualizado_en:
                new Date().toISOString()
        })
        .eq(
            "id",
            fotoId
        )
        .eq(
            "usuario_id",
            usuario.id
        );

    if (errorPrincipal) {
        throw errorPrincipal;
    }

    fotosPerfil =
        fotosPerfil.map(
            (foto) => ({
                ...foto,
                es_principal:
                    Number(foto.id) ===
                    Number(fotoId)
            })
        );

    await sincronizarFotoPrincipal(
        usuario.id,
        fotoElegida.foto_url
    );

    mostrarGaleriaPerfil();
}


async function reordenarPosicionesFotos(
    usuarioId
) {
    const ordenadas =
        [...fotosPerfil].sort(
            (fotoA, fotoB) =>
                Number(fotoA.posicion) -
                Number(fotoB.posicion)
        );

    for (
        let indice = 0;
        indice < ordenadas.length;
        indice += 1
    ) {
        const nuevaPosicion =
            indice + 1;

        if (
            Number(
                ordenadas[indice].posicion
            ) === nuevaPosicion
        ) {
            continue;
        }

        const {
            error
        } = await window.clienteSupabase
            .from("fotos_perfil")
            .update({
                posicion:
                    nuevaPosicion,

                actualizado_en:
                    new Date().toISOString()
            })
            .eq(
                "id",
                ordenadas[indice].id
            )
            .eq(
                "usuario_id",
                usuarioId
            );

        if (error) {
            throw error;
        }

        ordenadas[indice].posicion =
            nuevaPosicion;
    }

    fotosPerfil =
        ordenadas;
}


async function eliminarFotoGaleria(
    fotoId
) {
    const usuario =
        await obtenerUsuarioGaleria();

    if (!usuario) {
        throw new Error(
            "No existe una sesión válida."
        );
    }

    const fotoEliminar =
        fotosPerfil.find(
            (foto) =>
                Number(foto.id) ===
                Number(fotoId)
        );

    if (!fotoEliminar) {
        return;
    }

    const eraPrincipal =
        Boolean(
            fotoEliminar.es_principal
        );

    const {
        error: errorRegistro
    } = await window.clienteSupabase
        .from("fotos_perfil")
        .delete()
        .eq(
            "id",
            fotoEliminar.id
        )
        .eq(
            "usuario_id",
            usuario.id
        );

    if (errorRegistro) {
        throw errorRegistro;
    }

    const {
        error: errorStorage
    } = await window.clienteSupabase
        .storage
        .from(
            BUCKET_FOTOS_PERFIL
        )
        .remove([
            fotoEliminar.ruta_storage
        ]);

    if (errorStorage) {
        console.error(
            "La fila se eliminó, pero el archivo no pudo borrarse:",
            errorStorage
        );
    }

    fotosPerfil =
        fotosPerfil.filter(
            (foto) =>
                Number(foto.id) !==
                Number(fotoId)
        );

    await reordenarPosicionesFotos(
        usuario.id
    );

    if (eraPrincipal) {
        const nuevaPrincipal =
            fotosPerfil[0] ||
            null;

        if (nuevaPrincipal) {
            await hacerFotoPrincipal(
                nuevaPrincipal.id
            );
        } else {
            await sincronizarFotoPrincipal(
                usuario.id,
                null
            );
        }
    }

    mostrarGaleriaPerfil();
}


function cerrarMenusFotos() {
    document
        .querySelectorAll(
            "[data-opciones-foto]"
        )
        .forEach(
            (menu) => {
                menu.hidden =
                    true;
            }
        );

    document
        .querySelectorAll(
            "[data-menu-foto]"
        )
        .forEach(
            (boton) => {
                boton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        );
}


function activarEventosGaleria() {
    document
        .querySelectorAll(
            "[data-menu-foto]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    (evento) => {
                        evento.stopPropagation();

                        const id =
                            boton.dataset
                                .menuFoto;

                        const menu =
                            document.querySelector(
                                `[data-opciones-foto="${id}"]`
                            );

                        const estabaAbierto =
                            menu &&
                            !menu.hidden;

                        cerrarMenusFotos();

                        if (
                            menu &&
                            !estabaAbierto
                        ) {
                            menu.hidden =
                                false;

                            boton.setAttribute(
                                "aria-expanded",
                                "true"
                            );
                        }
                    }
                );
            }
        );

    document
        .querySelectorAll(
            "[data-hacer-principal]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        boton.disabled =
                            true;

                        try {
                            await hacerFotoPrincipal(
                                boton.dataset
                                    .hacerPrincipal
                            );

                            mostrarNotificacion(
                                "La fotografía principal se ha actualizado."
                            );
                        } catch (error) {
                            console.error(
                                "No se pudo cambiar la fotografía principal:",
                                error
                            );

                            mostrarErrorFotosPerfil(
                                "No se ha podido cambiar la fotografía principal."
                            );

                            boton.disabled =
                                false;
                        }
                    }
                );
            }
        );

    document
        .querySelectorAll(
            "[data-eliminar-foto]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        boton.disabled =
                            true;

                        try {
                            await eliminarFotoGaleria(
                                boton.dataset
                                    .eliminarFoto
                            );

                            mostrarNotificacion(
                                "La fotografía se ha eliminado."
                            );
                        } catch (error) {
                            console.error(
                                "No se pudo eliminar la fotografía:",
                                error
                            );

                            mostrarErrorFotosPerfil(
                                "No se ha podido eliminar la fotografía."
                            );

                            boton.disabled =
                                false;
                        }
                    }
                );
            }
        );
}


inputFotosPerfil?.addEventListener(
    "change",
    async () => {
        mostrarErrorFotosPerfil("");

        const archivos =
            Array.from(
                inputFotosPerfil.files ||
                []
            );

        if (archivos.length === 0) {
            return;
        }

        const huecosDisponibles =
            MAXIMO_FOTOS_PERFIL -
            fotosPerfil.length;

        if (huecosDisponibles <= 0) {
            mostrarErrorFotosPerfil(
                "Ya has alcanzado el máximo de seis fotografías."
            );

            inputFotosPerfil.value =
                "";

            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const archivoNoValido =
            archivos.find(
                (archivo) =>
                    !tiposPermitidos.includes(
                        archivo.type
                    )
            );

        if (archivoNoValido) {
            mostrarErrorFotosPerfil(
                "Selecciona únicamente fotografías JPG, PNG o WEBP."
            );

            inputFotosPerfil.value =
                "";

            return;
        }

        const archivoDemasiadoGrande =
            archivos.find(
                (archivo) =>
                    archivo.size >
                    5 * 1024 * 1024
            );

        if (archivoDemasiadoGrande) {
            mostrarErrorFotosPerfil(
                "Cada fotografía debe ocupar como máximo 5 MB."
            );

            inputFotosPerfil.value =
                "";

            return;
        }

        if (
            archivos.length >
            huecosDisponibles
        ) {
            mostrarErrorFotosPerfil(
                `Solo se subirán ${huecosDisponibles} fotografías para completar el máximo de seis.`
            );
        }

        inputFotosPerfil.disabled =
            true;

        botonAnadirFotos?.classList.add(
            "cargando"
        );

        try {
            await subirFotosGaleria(
                archivos
            );

            mostrarNotificacion(
                "Las fotografías se han guardado."
            );
        } catch (error) {
            console.error(
                "No se pudieron subir las fotografías:",
                error
            );

            mostrarErrorFotosPerfil(
                error?.message ||
                "No se han podido subir las fotografías."
            );

            await cargarGaleriaPerfil();
        } finally {
            inputFotosPerfil.value =
                "";

            inputFotosPerfil.disabled =
                false;

            botonAnadirFotos?.classList.remove(
                "cargando"
            );
        }
    }
);


botonAnadirFotos?.addEventListener(
    "click",
    (evento) => {
        if (
            fotosPerfil.length >=
            MAXIMO_FOTOS_PERFIL
        ) {
            evento.preventDefault();

            mostrarErrorFotosPerfil(
                "Ya has alcanzado el máximo de seis fotografías."
            );
        }
    }
);


document.addEventListener(
    "click",
    cerrarMenusFotos
);


/* =========================================
   VERIFICACIÓN DEL PERFIL
========================================= */

const estadoVerificacionPerfil =
    document.querySelector(
        "#estado-verificacion-perfil"
    );

const contenidoVerificacionPerfil =
    document.querySelector(
        "#contenido-verificacion-perfil"
    );

const resultadoVerificacionPerfil =
    document.querySelector(
        "#resultado-verificacion-perfil"
    );

const codigoVerificacionPerfil =
    document.querySelector(
        "#codigo-verificacion-perfil"
    );

const inputSelfieVerificacion =
    document.querySelector(
        "#input-selfie-verificacion"
    );

const previewSelfieVerificacion =
    document.querySelector(
        "#preview-selfie-verificacion"
    );

const botonEnviarVerificacion =
    document.querySelector(
        "#boton-enviar-verificacion"
    );

const errorVerificacionPerfil =
    document.querySelector(
        "#error-verificacion-perfil"
    );

const BUCKET_VERIFICACIONES =
    "verificaciones-perfil";

let archivoSelfieVerificacion =
    null;

let urlPreviewSelfie =
    null;

let codigoActualVerificacion =
    "";


function generarCodigoVerificacion() {
    const numero =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `SURALIA-${numero}`;
}


function actualizarCodigoVerificacion() {
    codigoActualVerificacion =
        generarCodigoVerificacion();

    if (codigoVerificacionPerfil) {
        codigoVerificacionPerfil.textContent =
            codigoActualVerificacion;
    }
}


function mostrarErrorVerificacion(
    mensaje = ""
) {
    if (errorVerificacionPerfil) {
        errorVerificacionPerfil.textContent =
            mensaje;
    }
}


function actualizarEstadoVisualVerificacion(
    estado
) {
    if (!estadoVerificacionPerfil) {
        return;
    }

    const textos = {
        sin_verificar:
            "Sin verificar",

        pendiente:
            "Pendiente de revisión",

        verificado:
            "Perfil verificado",

        rechazado:
            "Verificación rechazada"
    };

    estadoVerificacionPerfil.textContent =
        textos[estado] ||
        textos.sin_verificar;

    estadoVerificacionPerfil.className =
        `verificacion-perfil__estado verificacion-perfil__estado--${estado || "sin-verificar"}`;
}


function mostrarResultadoVerificacion(
    estado,
    motivo = ""
) {
    if (
        !resultadoVerificacionPerfil ||
        !contenidoVerificacionPerfil
    ) {
        return;
    }

    if (estado === "pendiente") {
        contenidoVerificacionPerfil.classList.add(
            "oculto"
        );

        resultadoVerificacionPerfil.classList.remove(
            "oculto"
        );

        resultadoVerificacionPerfil.innerHTML = `
            <span class="verificacion-perfil__resultado-icono">
                <i class="fa-regular fa-clock"></i>
            </span>

            <div>
                <h4>
                    Tu verificación está pendiente
                </h4>

                <p>
                    La selfie se ha enviado correctamente.
                    Recibirás el estado actualizado cuando se revise.
                </p>
            </div>
        `;

        return;
    }

    if (estado === "verificado") {
        contenidoVerificacionPerfil.classList.add(
            "oculto"
        );

        resultadoVerificacionPerfil.classList.remove(
            "oculto"
        );

        resultadoVerificacionPerfil.innerHTML = `
            <span class="verificacion-perfil__resultado-icono">
                <i class="fa-solid fa-circle-check"></i>
            </span>

            <div>
                <h4>
                    Perfil verificado
                </h4>

                <p>
                    Tu perfil mostrará la insignia de verificación
                    junto a tu nombre.
                </p>
            </div>
        `;

        return;
    }

    if (estado === "rechazado") {
        contenidoVerificacionPerfil.classList.remove(
            "oculto"
        );

        resultadoVerificacionPerfil.classList.remove(
            "oculto"
        );

        resultadoVerificacionPerfil.innerHTML = `
            <span class="verificacion-perfil__resultado-icono">
                <i class="fa-solid fa-circle-exclamation"></i>
            </span>

            <div>
                <h4>
                    No se pudo verificar el perfil
                </h4>

                <p>
                    ${
                        escaparHTML(
                            motivo ||
                            "La selfie no permite comprobar correctamente el perfil."
                        )
                    }
                </p>

                <p>
                    Puedes enviar una fotografía nueva siguiendo
                    las instrucciones.
                </p>
            </div>
        `;

        actualizarCodigoVerificacion();
        return;
    }

    contenidoVerificacionPerfil.classList.remove(
        "oculto"
    );

    resultadoVerificacionPerfil.classList.add(
        "oculto"
    );

    resultadoVerificacionPerfil.innerHTML =
        "";

    actualizarCodigoVerificacion();
}


async function cargarEstadoVerificacion() {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return;
    }

    try {
        const usuario =
            await obtenerUsuarioGaleria();

        if (!usuario) {
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from("verificaciones_perfil")
            .select(
                `
                    estado,
                    motivo_rechazo,
                    codigo_verificacion,
                    enviado_en,
                    revisado_en
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        const estado =
            data?.estado ||
            "sin_verificar";

        actualizarEstadoVisualVerificacion(
            estado
        );

        mostrarResultadoVerificacion(
            estado,
            data?.motivo_rechazo || ""
        );
    } catch (error) {
        console.error(
            "No se pudo cargar el estado de verificación:",
            error
        );

        mostrarErrorVerificacion(
            "No se ha podido consultar el estado de verificación."
        );

        actualizarCodigoVerificacion();
    }
}


async function reducirSelfieVerificacion(
    archivo,
    maximo = 1400,
    calidad = 0.88
) {
    return reducirFotoPerfil(
        archivo,
        maximo,
        calidad
    );
}


function limpiarPreviewSelfie() {
    if (urlPreviewSelfie) {
        URL.revokeObjectURL(
            urlPreviewSelfie
        );

        urlPreviewSelfie =
            null;
    }
}


function mostrarPreviewSelfie(
    archivo
) {
    if (!previewSelfieVerificacion) {
        return;
    }

    limpiarPreviewSelfie();

    urlPreviewSelfie =
        URL.createObjectURL(
            archivo
        );

    previewSelfieVerificacion.innerHTML = `
        <img
            src="${urlPreviewSelfie}"
            alt="Vista previa de la selfie de verificación"
        >
    `;
}


inputSelfieVerificacion?.addEventListener(
    "change",
    () => {
        mostrarErrorVerificacion("");

        const archivo =
            inputSelfieVerificacion
                .files?.[0];

        archivoSelfieVerificacion =
            null;

        botonEnviarVerificacion &&
            (
                botonEnviarVerificacion.disabled =
                    true
            );

        if (!archivo) {
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (
            !tiposPermitidos.includes(
                archivo.type
            )
        ) {
            mostrarErrorVerificacion(
                "Selecciona una fotografía JPG, PNG o WEBP."
            );

            inputSelfieVerificacion.value =
                "";

            return;
        }

        if (
            archivo.size >
            5 * 1024 * 1024
        ) {
            mostrarErrorVerificacion(
                "La selfie no puede superar los 5 MB."
            );

            inputSelfieVerificacion.value =
                "";

            return;
        }

        archivoSelfieVerificacion =
            archivo;

        mostrarPreviewSelfie(
            archivo
        );

        botonEnviarVerificacion &&
            (
                botonEnviarVerificacion.disabled =
                    false
            );
    }
);


async function enviarSelfieVerificacion() {
    if (!archivoSelfieVerificacion) {
        mostrarErrorVerificacion(
            "Selecciona una selfie antes de enviarla."
        );

        return;
    }

    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        mostrarErrorVerificacion(
            "No se ha podido conectar con Supabase."
        );

        return;
    }

    botonEnviarVerificacion.disabled =
        true;

    inputSelfieVerificacion &&
        (
            inputSelfieVerificacion.disabled =
                true
        );

    mostrarErrorVerificacion("");

    try {
        const usuario =
            await obtenerUsuarioGaleria();

        if (!usuario) {
            throw new Error(
                "No existe una sesión válida."
            );
        }

        const selfieOptimizada =
            await reducirSelfieVerificacion(
                archivoSelfieVerificacion
            );

        const ruta =
            `${usuario.id}/selfie-verificacion.jpg`;

        const {
            error: errorSubida
        } = await cliente
            .storage
            .from(
                BUCKET_VERIFICACIONES
            )
            .upload(
                ruta,
                selfieOptimizada,
                {
                    cacheControl:
                        "0",

                    contentType:
                        "image/jpeg",

                    upsert:
                        true
                }
            );

        if (errorSubida) {
            throw errorSubida;
        }

        const {
            error: errorSolicitud
        } = await cliente.rpc(
            "enviar_verificacion_perfil",
            {
                ruta_selfie:
                    ruta,

                codigo_solicitado:
                    codigoActualVerificacion
            }
        );

        if (errorSolicitud) {
            throw errorSolicitud;
        }

        archivoSelfieVerificacion =
            null;

        inputSelfieVerificacion.value =
            "";

        limpiarPreviewSelfie();

        actualizarEstadoVisualVerificacion(
            "pendiente"
        );

        mostrarResultadoVerificacion(
            "pendiente"
        );

        mostrarNotificacion(
            "La verificación se ha enviado para revisión."
        );
    } catch (error) {
        console.error(
            "No se pudo enviar la verificación:",
            error
        );

        mostrarErrorVerificacion(
            error?.message ||
            "No se ha podido enviar la verificación."
        );

        botonEnviarVerificacion.disabled =
            false;
    } finally {
        inputSelfieVerificacion &&
            (
                inputSelfieVerificacion.disabled =
                    false
            );
    }
}


botonEnviarVerificacion?.addEventListener(
    "click",
    enviarSelfieVerificacion
);


/* =========================================
   PERFIL SOCIAL
========================================= */

function obtenerClientePerfilSocial() {
    return window.clienteSupabase || null;
}


function obtenerValoresSeleccionados(
    nombre
) {
    return Array.from(
        document.querySelectorAll(
            `input[name="${nombre}"]:checked`
        )
    ).map(
        (input) => input.value
    );
}


function marcarValoresSeleccionados(
    nombre,
    valores = []
) {
    const valoresSeguros =
        Array.isArray(valores)
            ? valores
            : [];

    document
        .querySelectorAll(
            `input[name="${nombre}"]`
        )
        .forEach((input) => {
            input.checked =
                valoresSeguros.includes(
                    input.value
                );
        });
}


function actualizarContadorDescripcion() {
    if (
        !perfilDescripcion ||
        !contadorDescripcionPerfil
    ) {
        return;
    }

    contadorDescripcionPerfil.textContent =
        `${perfilDescripcion.value.length}/500`;
}


perfilDescripcion?.addEventListener(
    "input",
    actualizarContadorDescripcion
);


async function obtenerUsuarioPerfilSocial() {
    const cliente =
        obtenerClientePerfilSocial();

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

    return data.session?.user || null;
}


async function cargarPerfilSocial() {
    const cliente =
        obtenerClientePerfilSocial();

    if (!cliente) {
        console.error(
            "No se ha encontrado el cliente de Supabase para cargar el perfil social."
        );

        return;
    }

    try {
        const usuario =
            await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from("perfiles_sociales")
            .select(
                `
                    nombre_visible,
                    foto_principal_url,
                    fecha_nacimiento,
                    localidad,
                    ocupacion,
                    descripcion,
                    busca,
                    intereses,
                    disponibilidad,
                    perfil_visible,
                    mostrar_edad
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            actualizarContadorDescripcion();
            return;
        }

        if (perfilFechaNacimiento) {
            perfilFechaNacimiento.value =
                data.fecha_nacimiento || "";
        }

        if (perfilLocalidad) {
            perfilLocalidad.value =
                data.localidad || "";
        }

        if (perfilOcupacion) {
            perfilOcupacion.value =
                data.ocupacion || "";
        }

        if (perfilDescripcion) {
            perfilDescripcion.value =
                data.descripcion || "";
        }

        marcarValoresSeleccionados(
            "busca",
            data.busca
        );

        marcarValoresSeleccionados(
            "intereses",
            data.intereses
        );

        marcarValoresSeleccionados(
            "disponibilidad",
            data.disponibilidad
        );

        if (perfilVisible) {
            perfilVisible.checked =
                data.perfil_visible !== false;
        }

        if (mostrarEdad) {
            mostrarEdad.checked =
                data.mostrar_edad !== false;
        }

        actualizarContadorDescripcion();
    } catch (error) {
        console.error(
            "No se pudo cargar el perfil social:",
            error
        );

        mostrarNotificacion(
            "No se ha podido cargar tu perfil social."
        );
    }
}


async function guardarPerfilSocial(
    nombreVisible
) {
    const cliente =
        obtenerClientePerfilSocial();

    if (!cliente) {
        throw new Error(
            "No se ha encontrado el cliente de Supabase."
        );
    }

    const usuario =
        await obtenerUsuarioPerfilSocial();

    if (!usuario) {
        throw new Error(
            "No existe una sesión válida de Supabase."
        );
    }

    const descripcion =
        perfilDescripcion?.value.trim() ||
        "";

    if (descripcion.length > 500) {
        throw new Error(
            "La descripción supera los 500 caracteres."
        );
    }

    const {
        error
    } = await cliente
        .from("perfiles_sociales")
        .upsert(
            {
                usuario_id:
                    usuario.id,

                nombre_visible:
                    nombreVisible,

                fecha_nacimiento:
                    perfilFechaNacimiento?.value ||
                    null,

                localidad:
                    perfilLocalidad?.value.trim() ||
                    null,

                ocupacion:
                    perfilOcupacion?.value.trim() ||
                    null,

                descripcion:
                    descripcion ||
                    null,

                busca:
                    obtenerValoresSeleccionados(
                        "busca"
                    ),

                intereses:
                    obtenerValoresSeleccionados(
                        "intereses"
                    ),

                disponibilidad:
                    obtenerValoresSeleccionados(
                        "disponibilidad"
                    ),

                perfil_visible:
                    Boolean(
                        perfilVisible?.checked
                    ),

                mostrar_edad:
                    Boolean(
                        mostrarEdad?.checked
                    ),

                actualizado_en:
                    new Date().toISOString()
            },
            {
                onConflict:
                    "usuario_id"
            }
        );

    if (error) {
        throw error;
    }
}


/* =========================================
   EDICIÓN DE DATOS DEL USUARIO
========================================= */

if (formularioPerfil) {
    formularioPerfil.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const campoNombre = document.querySelector("#perfil-nombre");
        const campoApellidos = document.querySelector("#perfil-apellidos");
        const campoEmail = document.querySelector("#perfil-email");
        const campoTelefono = document.querySelector("#perfil-telefono");

        const nombre = campoNombre?.value.trim() || "";
        const apellidos = campoApellidos?.value.trim() || "";
        const email = campoEmail?.value.trim() || "";
        const telefono = campoTelefono?.value.trim() || "";

        const errorNombre = document.querySelector(
            "#error-perfil-nombre"
        );

        const errorApellidos = document.querySelector(
            "#error-perfil-apellidos"
        );

        const errorEmail = document.querySelector(
            "#error-perfil-email"
        );

        if (errorNombre) {
            errorNombre.textContent = "";
        }

        if (errorApellidos) {
            errorApellidos.textContent = "";
        }

        if (errorEmail) {
            errorEmail.textContent = "";
        }

        [
            campoNombre,
            campoApellidos,
            campoEmail,
            campoTelefono
        ].forEach((campo) => {
            campo?.setAttribute(
                "aria-invalid",
                "false"
            );
        });

        let formularioValido = true;

        if (nombre.length < 2) {
            if (errorNombre) {
                errorNombre.textContent =
                    "Introduce un nombre válido.";
            }

            formularioValido = false;
        }

        if (apellidos.length < 2) {
            if (errorApellidos) {
                errorApellidos.textContent =
                    "Introduce tus apellidos.";
            }

            formularioValido = false;
        }

        const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!expresionEmail.test(email)) {
            if (errorEmail) {
                errorEmail.textContent =
                    "Introduce un correo electrónico válido.";
            }

            formularioValido = false;
        }

        const camposValidacion = [
            {
                campo: campoNombre,
                invalido:
                    nombre.length < 2
            },
            {
                campo: campoApellidos,
                invalido:
                    apellidos.length < 2
            },
            {
                campo: campoEmail,
                invalido:
                    !expresionEmail.test(
                        email
                    )
            }
        ];

        camposValidacion.forEach(
            ({ campo, invalido }) => {
                campo?.setAttribute(
                    "aria-invalid",
                    String(invalido)
                );
            }
        );

        if (!formularioValido) {
            camposValidacion
                .find(
                    ({ invalido }) =>
                        invalido
                )
                ?.campo
                ?.focus();

            return;
        }

        const emailAnterior = usuarioGuardado.email;

        try {
            await guardarPerfilSocial(
                nombre
            );
        } catch (error) {
            console.error(
                "No se pudo guardar el perfil social:",
                error
            );

            mostrarNotificacion(
                "No se ha podido guardar el perfil social."
            );

            return;
        }

        usuarioGuardado.nombre = nombre;
        usuarioGuardado.apellidos = apellidos;
        usuarioGuardado.email = email;
        usuarioGuardado.telefono = telefono;

        guardarDatoLocal(
            "usuarioSuralia",
            usuarioGuardado
        );

        guardarDatoLocal(
            "sesionSuralia",
            {
                ...sesionGuardada,
                id:
                    sesionGuardada?.id ||
                    usuarioGuardado.id,
                nombre,
                apellidos,
                email,
                conectado: true
            }
        );

        actualizarEmailEnDatosGuardados(emailAnterior, email);
        cargarDatosUsuario();
        mostrarReservasPerfil();
        mostrarFavoritosPerfil();
        cargarAfinidadesPerfil();
        mostrarPublicaciones();

        mostrarNotificacion(
            "Tus datos se han actualizado correctamente."
        );
    });
}

function actualizarEmailEnDatosGuardados(emailAnterior, emailNuevo) {
    const claves = [
        "reservasSuralia",
        "favoritosSuralia",
        "planesPublicadosSuralia",
        "borradoresSuralia"
    ];

    claves.forEach((clave) => {
        const datos = leerDatoLocal(
            clave,
            []
        );

        if (!Array.isArray(datos)) {
            return;
        }

        const datosActualizados = datos.map((elemento) => {
            if (elemento.usuarioEmail === emailAnterior) {
                return {
                    ...elemento,
                    usuarioEmail: emailNuevo
                };
            }

            if (elemento.creadoPor === emailAnterior) {
                return {
                    ...elemento,
                    creadoPor: emailNuevo
                };
            }

            return elemento;
        });

        localStorage.setItem(
            clave,
            JSON.stringify(datosActualizados)
        );
    });
}

function abrirModalAccesible(
    modal,
    elementoFocoInicial,
    elementoOrigen
) {
    if (!modal) {
        return;
    }

    modal.classList.add(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    elementoFocoInicial?.focus();

    return elementoOrigen || null;
}


function cerrarModalAccesible(
    modal,
    elementoOrigen
) {
    if (!modal) {
        return;
    }

    modal.classList.remove(
        "visible"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    elementoOrigen?.focus();
}


function mantenerFocoDentroModal(
    evento,
    modal
) {
    if (
        evento.key !== "Tab" ||
        !modal?.classList.contains(
            "visible"
        )
    ) {
        return;
    }

    const elementosEnfocables =
        Array.from(
            modal.querySelectorAll(
                `
                    button:not([disabled]),
                    a[href],
                    input:not([disabled]),
                    select:not([disabled]),
                    textarea:not([disabled]),
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
            elementosEnfocables.length -
            1
        ];

    if (
        evento.shiftKey &&
        document.activeElement ===
            primero
    ) {
        evento.preventDefault();
        ultimo.focus();
    } else if (
        !evento.shiftKey &&
        document.activeElement ===
            ultimo
    ) {
        evento.preventDefault();
        primero.focus();
    }
}


/* =========================================
   RESERVAS DINÁMICAS
   SUPABASE = FUENTE REAL PARA PLANES UUID
   localStorage = compatibilidad con planes antiguos
========================================= */

const listaReservasPerfil = document.querySelector(
    "#lista-reservas-perfil"
);

const estadoVacioReservas = document.querySelector(
    "#estado-vacio-reservas"
);

const proximaReservaPerfil = document.querySelector(
    "#proxima-reserva-perfil"
);

const contadorReservasPerfil = document.querySelector(
    "#contador-reservas-perfil"
);

let reservasSupabasePerfil = [];
let reservasSupabaseCargadas = false;


function construirCatalogoPlanesPerfil() {
    if (
        typeof window.obtenerTodosPlanesSuralia !==
        "function"
    ) {
        return {};
    }

    return window.obtenerTodosPlanesSuralia()
        .reduce(
            (catalogo, plan) => {
                catalogo[plan.planId] = {
                    ...plan,

                    categoria:
                        plan.categoriaTexto ||
                        plan.categoria ||
                        "Actividad"
                };

                return catalogo;
            },
            {}
        );
}


const catalogoPlanesReservas =
    construirCatalogoPlanesPerfil();


function obtenerIdPlanReserva(reserva) {
    const idDirecto =
        reserva?.planId ||
        reserva?.plan_id ||
        reserva?.idPlan ||
        "";

    if (idDirecto) {
        return String(idDirecto);
    }

    const titulo = String(
        reserva?.titulo ||
        reserva?.nombre ||
        ""
    )
        .trim()
        .toLowerCase();

    const idsPorTitulo = {
        "visita guiada por itálica": "italica",
        "visita guiada por italica": "italica",
        "kayak al atardecer": "kayak-atardecer",
        "poncho k - cartuja center cite": PLAN_PONCHO_K_UUID,
        "ruta por el cerro del hierro": "cerro-hierro",
        "ruta de tapas por triana": "tapas-triana",
        "exposición de arte contemporáneo":
            "exposicion-contemporanea",
        "exposicion de arte contemporaneo":
            "exposicion-contemporanea",
        "ruta por la sierra norte": "sierra-norte",
        "ruta de senderismo por la sierra norte": "sierra-norte"
    };

    return idsPorTitulo[titulo] || "";
}


function normalizarReserva(reserva) {
    const planId =
        obtenerIdPlanReserva(reserva);

    const datosOficiales =
        catalogoPlanesReservas[planId];

    if (!datosOficiales) {
        return {
            ...reserva,

            planId:
                planId ||
                String(
                    reserva?.planId ||
                    reserva?.id ||
                    ""
                ),

            imagen:
                reserva?.imagen ||
                "img/placeholder-plan.jpg",

            enlace:
                reserva?.enlace ||
                (
                    esIdUuidPerfil(planId)
                        ? `detalle-plan.html?id=${encodeURIComponent(
                            planId
                        )}`
                        : "planes.html"
                )
        };
    }

    return {
        ...reserva,
        ...datosOficiales,

        id:
            reserva.id,

        fecha:
            reserva.fecha,

        fechaIso:
            reserva.fechaIso ||
            reserva.fecha,

        fechaTexto:
            reserva.fechaTexto ||
            reserva.fecha ||
            "Fecha pendiente",

        hora:
            reserva.hora ||
            datosOficiales.hora ||
            "",

        personas:
            reserva.personas ||
            reserva.entradas ||
            1,

        precioUnitario:
            Number(
                reserva.precioUnitario ??
                reserva.precio ??
                datosOficiales.precio ??
                0
            ),

        precioTotal:
            Number(
                reserva.precioTotal ??
                (
                    Number(
                        reserva.precioUnitario ??
                        reserva.precio ??
                        datosOficiales.precio ??
                        0
                    ) *
                    Number(
                        reserva.personas ||
                        reserva.entradas ||
                        1
                    )
                )
            ),

        estado:
            reserva.estado ||
            "confirmada",

        usuarioEmail:
            reserva.usuarioEmail ||
            usuarioGuardado.email,

        fechaReserva:
            reserva.fechaReserva ||
            new Date().toISOString()
    };
}


function migrarReservasAntiguas() {
    const reservas =
        leerDatoLocal(
            "reservasSuralia",
            []
        );

    if (!Array.isArray(reservas)) {
        guardarDatoLocal(
            "reservasSuralia",
            []
        );

        return [];
    }

    /*
       Las copias temporales creadas por detalle-plan.js
       para reservas que ya existen en Supabase dejan de
       utilizarse en el perfil.

       Se conservan únicamente reservas antiguas de los
       planes estáticos que todavía no usan Supabase.
    */
    const reservasLegacy =
        reservas.filter(
            (reserva) =>
                reserva?.origen !==
                    "supabase" &&
                !reserva?.reservaSupabaseId
        );

    const reservasActualizadas =
        reservasLegacy.map(
            normalizarReserva
        );

    if (
        reservasActualizadas.length !==
        reservas.length
    ) {
        guardarDatoLocal(
            "reservasSuralia",
            reservasActualizadas
        );
    }

    return reservasActualizadas;
}


function limpiarCopiaLocalReservaSupabase(
    reservaId = ""
) {
    const reservas =
        leerDatoLocal(
            "reservasSuralia",
            []
        );

    if (!Array.isArray(reservas)) {
        return;
    }

    const idSeguro =
        String(
            reservaId ||
            ""
        );

    const reservasLimpias =
        reservas.filter(
            (reserva) => {
                const esCopiaSupabase =
                    reserva?.origen ===
                        "supabase" ||
                    Boolean(
                        reserva?.reservaSupabaseId
                    );

                if (!esCopiaSupabase) {
                    return true;
                }

                if (!idSeguro) {
                    return false;
                }

                return (
                    String(
                        reserva?.reservaSupabaseId ||
                        reserva?.id ||
                        ""
                    ) !==
                    idSeguro
                );
            }
        );

    if (
        reservasLimpias.length !==
        reservas.length
    ) {
        guardarDatoLocal(
            "reservasSuralia",
            reservasLimpias
        );
    }
}


function formatearFechaReservaPerfil(
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
        return String(
            fechaIso
        );
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


function formatearPrecioReservaPerfil(
    precio
) {
    const valor =
        Number(
            precio ||
            0
        );

    if (
        !Number.isFinite(
            valor
        ) ||
        valor <= 0
    ) {
        return "Gratis";
    }

    return `${valor
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function construirUbicacionReservaPlan(
    plan
) {
    if (plan?.ubicacion) {
        return plan.ubicacion;
    }

    const partes =
        [
            plan?.direccion,
            plan?.municipio,
            plan?.provincia
        ]
            .map(
                (valor) =>
                    String(
                        valor ||
                        ""
                    ).trim()
            )
            .filter(Boolean);

    return partes.join(", ") ||
        "Ubicación pendiente";
}


async function cargarReservasSupabasePerfil() {
    const cliente =
        window.clienteSupabase;

    reservasSupabaseCargadas =
        false;

    if (!cliente?.auth) {
        reservasSupabasePerfil =
            [];

        mostrarReservasPerfil();

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
            reservasSupabasePerfil =
                [];

            mostrarReservasPerfil();

            return;
        }

        const {
            data: reservas,
            error: errorReservas
        } = await cliente
            .from(
                "reservas"
            )
            .select(
                `
                    id,
                    plan_id,
                    usuario_id,
                    fecha,
                    hora,
                    personas,
                    precio_unitario,
                    precio_total,
                    estado,
                    created_at
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .eq(
                "estado",
                "confirmada"
            )
            .order(
                "fecha",
                {
                    ascending:
                        true
                }
            )
            .order(
                "hora",
                {
                    ascending:
                        true
                }
            );

        if (errorReservas) {
            throw errorReservas;
        }

        const reservasRecibidas =
            Array.isArray(reservas)
                ? reservas
                : [];

        const idsPlanes =
            [
                ...new Set(
                    reservasRecibidas
                        .map(
                            (reserva) =>
                                String(
                                    reserva.plan_id ||
                                    ""
                                )
                        )
                        .filter(Boolean)
                )
            ];

        let planesPorId =
            new Map();

        if (
            idsPlanes.length >
            0
        ) {
            const {
                data: planes,
                error: errorPlanes
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
                        ubicacion,
                        municipio,
                        direccion,
                        provincia,
                        imagen_url,
                        precio,
                        estado
                    `
                )
                .in(
                    "id",
                    idsPlanes
                );

            if (errorPlanes) {
                throw errorPlanes;
            }

            planesPorId =
                new Map(
                    (
                        Array.isArray(planes)
                            ? planes
                            : []
                    ).map(
                        (plan) => [
                            String(
                                plan.id
                            ),
                            plan
                        ]
                    )
                );
        }

        reservasSupabasePerfil =
            reservasRecibidas.map(
                (reserva) => {
                    const planId =
                        String(
                            reserva.plan_id ||
                            ""
                        );

                    const plan =
                        planesPorId.get(
                            planId
                        ) ||
                        null;

                    const hora =
                        reserva.hora
                            ? String(
                                reserva.hora
                            ).slice(
                                0,
                                5
                            )
                            : "";

                    const personas =
                        Math.max(
                            1,
                            Number(
                                reserva.personas ||
                                1
                            )
                        );

                    const precioUnitario =
                        Number(
                            reserva.precio_unitario ??
                            plan?.precio ??
                            0
                        );

                    const precioTotal =
                        Number(
                            reserva.precio_total ??
                            (
                                precioUnitario *
                                personas
                            )
                        );

                    return {
                        id:
                            String(
                                reserva.id
                            ),

                        reservaSupabaseId:
                            String(
                                reserva.id
                            ),

                        origen:
                            "supabase",

                        planId,

                        titulo:
                            plan?.titulo ||
                            "Plan reservado",

                        categoria:
                            plan?.nombre_categoria ||
                            plan?.categoria ||
                            "Actividad",

                        imagen:
                            plan?.imagen_url ||
                            "img/placeholder-plan.jpg",

                        ubicacion:
                            construirUbicacionReservaPlan(
                                plan
                            ),

                        fecha:
                            reserva.fecha,

                        fechaIso:
                            reserva.fecha,

                        fechaTexto:
                            formatearFechaReservaPerfil(
                                reserva.fecha
                            ),

                        hora,

                        personas,

                        precio:
                            precioUnitario,

                        precioUnitario,

                        precioTotal,

                        estado:
                            reserva.estado ||
                            "confirmada",

                        enlace:
                            `detalle-plan.html?id=${encodeURIComponent(
                                planId
                            )}`,

                        usuarioEmail:
                            usuario.email ||
                            usuarioGuardado.email ||
                            "",

                        fechaReserva:
                            reserva.created_at ||
                            ""
                    };
                }
            );

        reservasSupabaseCargadas =
            true;

        /*
           En cuanto Supabase se carga correctamente,
           eliminamos las copias temporales que pudiera
           haber dejado detalle-plan.js en localStorage.
        */
        limpiarCopiaLocalReservaSupabase();

        mostrarReservasPerfil();
    } catch (error) {
        console.error(
            "No se pudieron cargar las reservas desde Supabase:",
            error
        );

        reservasSupabasePerfil =
            [];

        mostrarReservasPerfil();

        mostrarNotificacion(
            "No se han podido cargar tus reservas."
        );
    }
}


async function cargarReservasPerfil() {
    await cargarReservasSupabasePerfil();
}


/*
   Se mantiene este nombre porque otras partes del archivo
   ya lo llamaban al volver a la pestaña. Ahora simplemente
   refresca la fuente real de reservas.
*/
async function sincronizarReservasDinamicasEliminadas() {
    await cargarReservasPerfil();
}


function obtenerReservasUsuario() {
    const reservasLegacy =
        migrarReservasAntiguas()
            .filter(
                (reserva) => {
                    if (
                        reserva.usuarioEmail !==
                            usuarioGuardado.email ||
                        reserva.estado !==
                            "confirmada"
                    ) {
                        return false;
                    }

                    /*
                       Los UUID pertenecen al nuevo sistema.
                       Supabase es la única fuente válida para ellos.
                    */
                    return !esIdUuidPerfil(
                        obtenerIdPlanReserva(
                            reserva
                        )
                    );
                }
            );

    return [
        ...reservasSupabasePerfil,
        ...reservasLegacy
    ]
        .filter(
            (reserva) =>
                reserva.estado ===
                "confirmada"
        )
        .sort(
            (
                reservaA,
                reservaB
            ) => {
                const fechaA =
                    reservaA.fecha
                        ? new Date(
                            `${reservaA.fecha}T${reservaA.hora || "00:00"}`
                        )
                        : new Date(
                            reservaA.fechaReserva ||
                            0
                        );

                const fechaB =
                    reservaB.fecha
                        ? new Date(
                            `${reservaB.fecha}T${reservaB.hora || "00:00"}`
                        )
                        : new Date(
                            reservaB.fechaReserva ||
                            0
                        );

                return fechaA -
                    fechaB;
            }
        );
}


function obtenerEnlacePlan(plan) {
    if (plan?.enlace) {
        return plan.enlace;
    }

    if (
        esIdUuidPerfil(
            plan?.planId
        )
    ) {
        return `detalle-plan.html?id=${encodeURIComponent(
            plan.planId
        )}`;
    }

    if (
        plan?.planId &&
        typeof window.obtenerPlanSuralia ===
            "function"
    ) {
        const datosCatalogo =
            window.obtenerPlanSuralia(
                plan.planId
            );

        if (datosCatalogo?.enlace) {
            return datosCatalogo.enlace;
        }
    }

    const enlacesPorPlan = {
        italica:
            "detalle-plan.html?id=italica",

        "kayak-atardecer":
            "detalle-kayak.html",

        "poncho-k-cartuja":
            `detalle-plan.html?id=${PLAN_PONCHO_K_UUID}`,

        [PLAN_PONCHO_K_UUID]:
            `detalle-plan.html?id=${PLAN_PONCHO_K_UUID}`,

        "cerro-hierro":
            "detalle-plan.html?id=cerro-hierro",

        "tapas-triana":
            "detalle-plan.html?id=tapas-triana",

        "exposicion-contemporanea":
            "detalle-plan.html?id=exposicion-contemporanea",

        "sierra-norte":
            "detalle-sierra-norte.html"
    };

    return enlacesPorPlan[
        plan?.planId
    ] ||
        "planes.html";
}


function crearProximaReservaHTML(
    reserva
) {
    const titulo =
        escaparHTML(
            reserva.titulo ||
            "Plan reservado"
        );

    const imagen =
        escaparHTML(
            reserva.imagen ||
            "img/placeholder-plan.jpg"
        );

    const fecha =
        escaparHTML(
            reserva.fechaTexto ||
            reserva.fecha ||
            "Fecha pendiente"
        );

    const hora =
        escaparHTML(
            reserva.hora ||
            "Hora pendiente"
        );

    const ubicacion =
        escaparHTML(
            reserva.ubicacion ||
            "Ubicación pendiente"
        );

    const personas =
        Math.max(
            1,
            Number(
                reserva.personas ||
                1
            )
        );

    const precioTotal =
        formatearPrecioReservaPerfil(
            reserva.precioTotal
        );

    const enlace =
        escaparHTML(
            obtenerEnlacePlan(
                reserva
            )
        );

    return `
        <article class="reserva-resumen">

            <div class="reserva-resumen__imagen">
                <img
                    src="${imagen}"
                    alt="${titulo}"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >
            </div>

            <div class="reserva-resumen__contenido">

                <span class="reserva-estado">
                    Confirmada
                </span>

                <h3>${titulo}</h3>

                <p>
                    <i class="fa-regular fa-calendar"></i>
                    ${fecha}
                </p>

                <p>
                    <i class="fa-regular fa-clock"></i>
                    ${hora}
                </p>

                <p>
                    <i class="fa-solid fa-user-group"></i>
                    ${personas}
                    ${
                        personas === 1
                            ? "persona"
                            : "personas"
                    }
                </p>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${ubicacion}
                </p>

                <p>
                    <i class="fa-solid fa-euro-sign"></i>
                    ${precioTotal}
                    ${
                        precioTotal !==
                            "Gratis"
                            ? " total"
                            : ""
                    }
                </p>

                <a
                    href="${enlace}"
                    class="boton-ver-reserva"
                >
                    Ver actividad
                </a>

            </div>

        </article>
    `;
}


function crearReservaHTML(
    reserva
) {
    const idReserva =
        escaparHTML(
            reserva.id ||
            ""
        );

    const titulo =
        escaparHTML(
            reserva.titulo ||
            "Plan reservado"
        );

    const imagen =
        escaparHTML(
            reserva.imagen ||
            "img/placeholder-plan.jpg"
        );

    const fecha =
        escaparHTML(
            reserva.fechaTexto ||
            reserva.fecha ||
            "Fecha pendiente"
        );

    const hora =
        escaparHTML(
            reserva.hora ||
            "Hora pendiente"
        );

    const ubicacion =
        escaparHTML(
            reserva.ubicacion ||
            "Ubicación pendiente"
        );

    const personas =
        Math.max(
            1,
            Number(
                reserva.personas ||
                1
            )
        );

    const precioTotal =
        escaparHTML(
            formatearPrecioReservaPerfil(
                reserva.precioTotal
            )
        );

    const enlace =
        escaparHTML(
            obtenerEnlacePlan(
                reserva
            )
        );

    return `
        <article
            class="reserva-item"
            data-reserva-id="${idReserva}"
        >

            <div class="reserva-item__imagen">
                <img
                    src="${imagen}"
                    alt="${titulo}"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >
            </div>

            <div class="reserva-item__contenido">

                <div class="reserva-item__superior">

                    <div>
                        <span class="reserva-estado">
                            Confirmada
                        </span>

                        <h3>${titulo}</h3>
                    </div>

                </div>

                <div class="reserva-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${fecha}
                    </span>

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${hora}
                    </span>

                    <span>
                        <i class="fa-solid fa-user-group"></i>
                        ${personas}
                        ${
                            personas === 1
                                ? "persona"
                                : "personas"
                        }
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${ubicacion}
                    </span>

                    <span>
                        <i class="fa-solid fa-euro-sign"></i>
                        ${precioTotal}
                        ${
                            precioTotal !==
                                "Gratis"
                                ? " total"
                                : ""
                        }
                    </span>

                </div>

                <div class="reserva-item__acciones">

                    <a
                        href="${enlace}"
                        class="boton-principal-pequeno"
                    >
                        Ver actividad
                    </a>

                    <button
                        type="button"
                        class="boton-cancelar-reserva"
                        data-reserva-id="${idReserva}"
                    >
                        Cancelar reserva
                    </button>

                </div>

            </div>

        </article>
    `;
}


function mostrarReservasPerfil() {
    const reservas =
        obtenerReservasUsuario();

    if (contadorReservasPerfil) {
        contadorReservasPerfil.textContent =
            reservas.length;
    }

    if (
        !listaReservasPerfil ||
        !proximaReservaPerfil
    ) {
        return;
    }

    if (
        reservas.length ===
        0
    ) {
        listaReservasPerfil.innerHTML =
            "";

        proximaReservaPerfil.innerHTML = `
            <div class="estado-vacio estado-vacio--pequeno">

                <span class="estado-vacio__icono">
                    <i class="fa-regular fa-calendar"></i>
                </span>

                <h3>No tienes próximas reservas</h3>

                <p>
                    Encuentra un plan y reserva tu próxima experiencia.
                </p>

                <a
                    href="planes.html"
                    class="boton-principal-pequeno"
                >
                    Explorar planes
                </a>

            </div>
        `;

        if (estadoVacioReservas) {
            estadoVacioReservas.classList.remove(
                "oculto"
            );
        }

        return;
    }

    if (estadoVacioReservas) {
        estadoVacioReservas.classList.add(
            "oculto"
        );
    }

    proximaReservaPerfil.innerHTML =
        crearProximaReservaHTML(
            reservas[0]
        );

    listaReservasPerfil.innerHTML =
        reservas
            .map(
                crearReservaHTML
            )
            .join("");

    activarBotonesCancelarReserva();
}


function activarBotonesCancelarReserva() {
    document
        .querySelectorAll(
            ".boton-cancelar-reserva"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        reservaPendienteCancelar =
                            String(
                                boton.dataset
                                    .reservaId ||
                                ""
                            );

                        tipoCancelacionReservaPendiente =
                            "usuario";

                        elementoQueAbrioModalCancelacion =
                            abrirModalAccesible(
                                modalCancelacion,
                                mantenerReserva,
                                boton
                            );
                    }
                );
            }
        );
}


async function cancelarReservaSupabase(
    reservaId
) {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        throw new Error(
            "No se ha podido conectar con Supabase."
        );
    }

    const {
        data,
        error
    } = await cliente.rpc(
        "cancelar_reserva_plan",
        {
            p_reserva_id:
                reservaId
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
        respuesta.ok !==
            true
    ) {
        throw new Error(
            "No se ha podido cancelar la reserva."
        );
    }

    return respuesta;
}


function cancelarReservaLegacyLocal(
    reservaId
) {
    const reservas =
        leerDatoLocal(
            "reservasSuralia",
            []
        );

    if (!Array.isArray(reservas)) {
        return;
    }

    const reservasActualizadas =
        reservas.filter(
            (reserva) =>
                String(
                    reserva.id
                ) !==
                String(
                    reservaId
                )
        );

    guardarDatoLocal(
        "reservasSuralia",
        reservasActualizadas
    );
}


async function cancelarReservaGuardada() {
    if (!reservaPendienteCancelar) {
        return;
    }

    const reservaId =
        String(
            reservaPendienteCancelar
        );

    if (
        tipoCancelacionReservaPendiente ===
        "organizador"
    ) {
        const textoOriginal =
            confirmarCancelacion?.innerHTML ||
            "Cancelar reserva";

        if (confirmarCancelacion) {
            confirmarCancelacion.disabled =
                true;

            confirmarCancelacion.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Cancelando
            `;
        }

        try {
            await cancelarReservaSupabase(
                reservaId
            );

            await cargarReservasOrganizadorPerfil(
                false
            );

            reservaPendienteCancelar =
                null;

            tipoCancelacionReservaPendiente =
                "usuario";

            cerrarModalAccesible(
                modalCancelacion,
                elementoQueAbrioModalCancelacion
            );

            elementoQueAbrioModalCancelacion =
                null;

            mostrarPublicaciones();

            mostrarNotificacion(
                "La reserva se ha cancelado y las plazas se han liberado."
            );
        } catch (error) {
            console.error(
                "No se pudo cancelar la reserva como organizador:",
                error
            );

            mostrarNotificacion(
                error?.message ||
                "No se ha podido cancelar la reserva."
            );
        } finally {
            if (confirmarCancelacion) {
                confirmarCancelacion.disabled =
                    false;

                confirmarCancelacion.innerHTML =
                    textoOriginal;
            }
        }

        return;
    }

    const reserva =
        obtenerReservasUsuario()
            .find(
                (elemento) =>
                    String(
                        elemento.id
                    ) ===
                    reservaId
            );

    if (!reserva) {
        mostrarNotificacion(
            "La reserva ya no está disponible."
        );

        reservaPendienteCancelar =
            null;

        cerrarModalAccesible(
            modalCancelacion,
            elementoQueAbrioModalCancelacion
        );

        elementoQueAbrioModalCancelacion =
            null;

        await cargarReservasPerfil();

        return;
    }

    const textoOriginal =
        confirmarCancelacion?.innerHTML ||
        "Cancelar reserva";

    if (confirmarCancelacion) {
        confirmarCancelacion.disabled =
            true;

        confirmarCancelacion.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Cancelando
        `;
    }

    try {
        if (
            reserva.origen ===
                "supabase"
        ) {
            await cancelarReservaSupabase(
                reservaId
            );

            limpiarCopiaLocalReservaSupabase(
                reservaId
            );

            await cargarReservasSupabasePerfil();
        } else {
            cancelarReservaLegacyLocal(
                reservaId
            );

            mostrarReservasPerfil();
        }

        reservaPendienteCancelar =
            null;

        cerrarModalAccesible(
            modalCancelacion,
            elementoQueAbrioModalCancelacion
        );

        elementoQueAbrioModalCancelacion =
            null;

        mostrarNotificacion(
            "La reserva se ha cancelado correctamente."
        );
    } catch (error) {
        console.error(
            "No se pudo cancelar la reserva:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido cancelar la reserva."
        );
    } finally {
        if (confirmarCancelacion) {
            confirmarCancelacion.disabled =
                false;

            confirmarCancelacion.innerHTML =
                textoOriginal;
        }
    }
}


if (mantenerReserva) {
    mantenerReserva.addEventListener(
        "click",
        () => {
            reservaPendienteCancelar =
                null;

            tipoCancelacionReservaPendiente =
                "usuario";

            cerrarModalAccesible(
                modalCancelacion,
                elementoQueAbrioModalCancelacion
            );

            elementoQueAbrioModalCancelacion =
                null;
        }
    );
}


if (confirmarCancelacion) {
    confirmarCancelacion.addEventListener(
        "click",
        cancelarReservaGuardada
    );
}


if (modalCancelacion) {
    modalCancelacion.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target ===
                modalCancelacion
            ) {
                cerrarModalAccesible(
                    modalCancelacion,
                    elementoQueAbrioModalCancelacion
                );

                elementoQueAbrioModalCancelacion =
                    null;

                reservaPendienteCancelar =
                    null;

                tipoCancelacionReservaPendiente =
                    "usuario";
            }
        }
    );
}


/* =========================================
   FAVORITOS
========================================= */

const listaFavoritosPerfil =
    document.querySelector(
        "#lista-favoritos-perfil"
    );

const estadoVacioFavoritos =
    document.querySelector(
        "#estado-vacio-favoritos"
    );

const contadorFavoritosPerfil =
    document.querySelector(
        "#contador-favoritos-perfil"
    );

/*
   Reservas y favoritos utilizan el mismo catálogo
   oficial cargado desde js/datos-planes.js.
*/
const catalogoPlanesFavoritos =
    catalogoPlanesReservas;

function obtenerIdPlanFavorito(favorito) {
    const idDirecto =
        favorito?.planId ||
        favorito?.idPlan ||
        "";

    if (idDirecto) {
        return String(idDirecto);
    }

    const titulo =
        String(
            favorito?.titulo ||
            favorito?.nombre ||
            ""
        )
            .trim()
            .toLowerCase();

    const idsPorTitulo = {
        "visita guiada por itálica":
            "italica",

        "visita guiada por italica":
            "italica",

        "kayak al atardecer":
            "kayak-atardecer",

        "poncho k - cartuja center cite":
            PLAN_PONCHO_K_UUID,

        "ruta por el cerro del hierro":
            "cerro-hierro",

        "ruta de tapas por triana":
            "tapas-triana",

        "exposición de arte contemporáneo":
            "exposicion-contemporanea",

        "exposicion de arte contemporaneo":
            "exposicion-contemporanea",

        "ruta por la sierra norte":
            "sierra-norte",

        "ruta de senderismo por la sierra norte":
            "sierra-norte"
    };

    return idsPorTitulo[titulo] || "";
}

function normalizarFavorito(favorito) {
    const planId =
        obtenerIdPlanFavorito(
            favorito
        );

    const datosOficiales =
        catalogoPlanesFavoritos[
            planId
        ];

    if (!datosOficiales) {
        return {
            ...favorito,
            planId:
                planId ||
                String(
                    favorito.planId ||
                    favorito.id ||
                    ""
                ),
            imagen:
                favorito.imagen ||
                "img/placeholder-plan.jpg",
            enlace:
                favorito.enlace ||
                "planes.html"
        };
    }

    /*
       Los datos oficiales se colocan al final
       para sustituir imágenes, precios y enlaces
       antiguos guardados en localStorage.
    */
    return {
        ...favorito,
        ...datosOficiales,
        usuarioEmail:
            favorito.usuarioEmail ||
            usuarioGuardado.email
    };
}

function migrarFavoritosAntiguos() {
    const favoritos =
        leerDatoLocal(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        guardarDatoLocal(
            "favoritosSuralia",
            []
        );

        return [];
    }

    const favoritosActualizados =
        favoritos.map(
            normalizarFavorito
        );

    guardarDatoLocal(
        "favoritosSuralia",
        favoritosActualizados
    );

    return favoritosActualizados;
}


function esIdUuidPerfil(
    valor
) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(
            String(
                valor ||
                ""
            )
        );
}


async function sincronizarFavoritosDinamicosEliminados() {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        return;
    }

    const favoritos =
        leerDatoLocal(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        return;
    }

    const favoritosUsuario =
        favoritos.filter(
            (
                favorito
            ) =>
                favorito.usuarioEmail ===
                usuarioGuardado.email
        );

    const idsDinamicos =
        [
            ...new Set(
                favoritosUsuario
                    .map(
                        obtenerIdPlanFavorito
                    )
                    .filter(
                        esIdUuidPerfil
                    )
            )
        ];

    if (
        idsDinamicos.length ===
        0
    ) {
        return;
    }

    try {
        const {
            data,
            error
        } = await cliente
            .from(
                "planes"
            )
            .select(
                "id"
            )
            .in(
                "id",
                idsDinamicos
            )
            .eq(
                "estado",
                "publicado"
            );

        if (error) {
            throw error;
        }

        const idsDisponibles =
            new Set(
                (
                    Array.isArray(data)
                        ? data
                        : []
                ).map(
                    (
                        plan
                    ) => String(
                        plan.id
                    )
                )
            );

        const favoritosActualizados =
            favoritos.filter(
                (
                    favorito
                ) => {
                    if (
                        favorito.usuarioEmail !==
                        usuarioGuardado.email
                    ) {
                        return true;
                    }

                    const planId =
                        obtenerIdPlanFavorito(
                            favorito
                        );

                    if (
                        !esIdUuidPerfil(
                            planId
                        )
                    ) {
                        return true;
                    }

                    return idsDisponibles.has(
                        String(
                            planId
                        )
                    );
                }
            );

        if (
            favoritosActualizados.length !==
            favoritos.length
        ) {
            guardarDatoLocal(
                "favoritosSuralia",
                favoritosActualizados
            );

            mostrarFavoritosPerfil();
        }
    } catch (error) {
        console.error(
            "No se pudieron sincronizar los favoritos con Supabase:",
            error
        );
    }
}


function obtenerFavoritosUsuario() {
    const favoritos =
        migrarFavoritosAntiguos();

    return favoritos
        .filter((favorito) => {
            return (
                favorito.usuarioEmail ===
                usuarioGuardado.email
            );
        })
        .sort((favoritoA, favoritoB) => {
            const fechaA =
                new Date(
                    favoritoA.fechaGuardado ||
                    0
                );

            const fechaB =
                new Date(
                    favoritoB.fechaGuardado ||
                    0
                );

            return fechaB - fechaA;
        });
}

function formatearPrecioFavorito(precio) {
    const precioNumerico =
        Number(precio || 0);

    if (precioNumerico === 0) {
        return "Gratis";
    }

    return `${precioNumerico
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}

function escaparHTML(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function crearFavoritoHTML(favoritoOriginal) {
    const favorito =
        normalizarFavorito(
            favoritoOriginal
        );

    const planId =
        escaparHTML(
            favorito.planId ||
            favorito.id ||
            ""
        );

    const titulo =
        escaparHTML(
            favorito.titulo ||
            "Plan guardado"
        );

    const categoria =
        escaparHTML(
            favorito.categoria ||
            "Actividad"
        );

    const ubicacion =
        escaparHTML(
            favorito.ubicacion ||
            "Ubicación pendiente"
        );

    const fecha =
        escaparHTML(
            favorito.fechaTexto ||
            favorito.fecha ||
            "Fecha por confirmar"
        );

    const imagen =
        escaparHTML(
            favorito.imagen ||
            "img/placeholder-plan.jpg"
        );

    const enlace =
        escaparHTML(
            favorito.enlace ||
            "planes.html"
        );

    const precio =
        formatearPrecioFavorito(
            favorito.precio
        );

    return `
        <article
            class="tarjeta-plan"
            data-plan-id="${planId}"
        >

            <div class="tarjeta-plan__imagen">

                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >

                <span class="tarjeta-plan__precio">
                    ${precio}
                </span>

                <button
                    type="button"
                    class="
                        tarjeta-plan__favorito
                        favorito-activo
                    "
                    data-eliminar-favorito="${planId}"
                    aria-label="Eliminar ${titulo} de favoritos"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

            <div class="tarjeta-plan__contenido">

                <div class="tarjeta-plan__meta">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${fecha}
                    </span>

                </div>

                <h3>
                    ${titulo}
                </h3>

                <p class="tarjeta-plan__ubicacion">
                    <i class="fa-solid fa-location-dot"></i>
                    ${ubicacion}
                </p>

                <div class="tarjeta-plan__pie">

                    <span>
                        ${categoria}
                    </span>

                    <strong>
                        ${String(
                            favorito.valoracion || 0
                        ).replace(".", ",")}
                        <i class="fa-solid fa-star"></i>
                    </strong>

                </div>

                <a
                    href="${enlace}"
                    class="boton-principal-pequeno"
                >
                    Ver actividad
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}

function eliminarFavoritoGuardado(
    planId
) {
    const favoritos =
        leerDatoLocal(
            "favoritosSuralia",
            []
        );

    if (!Array.isArray(favoritos)) {
        return;
    }

    const favoritosActualizados =
        favoritos.filter(
            (favorito) => {
                const idFavorito =
                    obtenerIdPlanFavorito(
                        favorito
                    ) ||
                    String(
                        favorito.planId ||
                        favorito.id ||
                        ""
                    );

                return !(
                    idFavorito ===
                        String(planId) &&
                    favorito.usuarioEmail ===
                        usuarioGuardado.email
                );
            }
        );

    guardarDatoLocal(
        "favoritosSuralia",
        favoritosActualizados
    );

    mostrarFavoritosPerfil();

    mostrarNotificacion(
        "El plan se ha eliminado de favoritos."
    );
}

function activarBotonesEliminarFavorito() {
    document
        .querySelectorAll(
            "[data-eliminar-favorito]"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                (evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();

                    eliminarFavoritoGuardado(
                        boton.dataset
                            .eliminarFavorito
                    );
                }
            );
        });
}

function mostrarFavoritosPerfil() {
    const favoritos =
        obtenerFavoritosUsuario();

    if (contadorFavoritosPerfil) {
        contadorFavoritosPerfil
            .textContent =
            favoritos.length;
    }

    if (
        !listaFavoritosPerfil ||
        !estadoVacioFavoritos
    ) {
        return;
    }

    if (favoritos.length === 0) {
        listaFavoritosPerfil.innerHTML =
            "";

        listaFavoritosPerfil
            .classList.add(
                "oculta"
            );

        estadoVacioFavoritos
            .classList.remove(
                "oculto"
            );

        return;
    }

    listaFavoritosPerfil
        .classList.remove(
            "oculta"
        );

    estadoVacioFavoritos
        .classList.add(
            "oculto"
        );

    listaFavoritosPerfil.innerHTML =
        favoritos
            .map(
                crearFavoritoHTML
            )
            .join("");

    activarBotonesEliminarFavorito();
}

/* =========================================
   AFINIDADES
========================================= */

const listaAfinidadesPerfil =
    document.querySelector(
        "#lista-afinidades-perfil"
    );

const estadoVacioAfinidades =
    document.querySelector(
        "#estado-vacio-afinidades"
    );

const contadorAfinidadesPerfil =
    document.querySelector(
        "#contador-afinidades-perfil"
    );

let afinidadesPerfil = [];


function obtenerClienteAfinidades() {
    return window.clienteSupabase || null;
}


function obtenerEnlaceAfinidad(planId) {
    if (
        planId &&
        typeof window.obtenerPlanSuralia ===
            "function"
    ) {
        const plan =
            window.obtenerPlanSuralia(
                planId
            );

        if (plan?.enlace) {
            return plan.enlace;
        }
    }

    const enlaces = {
        "sierra-norte":
            "detalle-sierra-norte.html",
        "kayak-atardecer":
            "detalle-kayak.html",
        "poncho-k-cartuja":
            `detalle-plan.html?id=${PLAN_PONCHO_K_UUID}`,
        [PLAN_PONCHO_K_UUID]:
            `detalle-plan.html?id=${PLAN_PONCHO_K_UUID}`
    };

    return enlaces[planId] ||
        `detalle-plan.html?id=${encodeURIComponent(
            planId || ""
        )}`;
}


function formatearFechaAfinidad(fechaIso) {
    if (!fechaIso) {
        return "Fecha por confirmar";
    }

    const fecha =
        new Date(
            `${fechaIso}T00:00:00`
        );

    if (Number.isNaN(fecha.getTime())) {
        return fechaIso;
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(fecha);
}


function crearAfinidadHTML(afinidad) {
    const planId =
        escaparHTML(
            afinidad.plan_id || ""
        );

    const titulo =
        escaparHTML(
            afinidad.plan_titulo ||
            "Plan con afinidad"
        );

    const imagen =
        escaparHTML(
            afinidad.plan_imagen ||
            "img/placeholder-plan.jpg"
        );

    const ubicacion =
        escaparHTML(
            afinidad.plan_ubicacion ||
            "Ubicación pendiente"
        );

    const fecha =
        escaparHTML(
            formatearFechaAfinidad(
                afinidad.plan_fecha
            )
        );

    const enlace =
        escaparHTML(
            obtenerEnlaceAfinidad(
                afinidad.plan_id
            )
        );

    return `
        <article
            class="afinidad-item"
            data-afinidad-plan-id="${planId}"
        >

            <div class="afinidad-item__imagen">

                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >

                <span class="afinidad-item__estado">
                    <i class="fa-solid fa-user-check"></i>
                    Afinidad activa
                </span>

            </div>

            <div class="afinidad-item__contenido">

                <div>

                    <span class="subtitulo">
                        Personas con intereses parecidos
                    </span>

                    <h3>
                        ${titulo}
                    </h3>

                </div>

                <div class="afinidad-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${fecha}
                    </span>

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${ubicacion}
                    </span>

                </div>

                <p>
                    Has indicado que te gustaría conocer gente
                    para realizar este plan.
                </p>

                <div class="afinidad-item__coincidencias">

                    <span class="afinidad-item__coincidencias-icono">
                        <i class="fa-solid fa-people-group"></i>
                    </span>

                    <div>
                        <strong>
                            ${
                                Number(afinidad.total_personas || 0)
                            }
                            ${
                                Number(afinidad.total_personas || 0) === 1
                                    ? "persona interesada"
                                    : "personas interesadas"
                            }
                        </strong>

                        <span>
                            Han activado la afinidad para este plan.
                        </span>
                    </div>

                </div>

                <div class="afinidad-item__acciones">

                    <a
                        href="${enlace}"
                        class="boton-principal-pequeno"
                    >
                        Ver actividad
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                    <button
                        type="button"
                        class="boton-ver-personas-afinidad"
                        data-ver-personas-afinidad="${planId}"
                        aria-expanded="false"
                        aria-controls="personas-afinidad-${planId}"
                    >
                        <i class="fa-solid fa-people-group"></i>
                        Ver personas interesadas
                    </button>

                    <button
                        type="button"
                        class="boton-desactivar-afinidad"
                        data-desactivar-afinidad="${planId}"
                    >
                        <i class="fa-solid fa-user-minus"></i>
                        Desactivar afinidad
                    </button>

                </div>

                <div
                    class="personas-afinidad oculto"
                    id="personas-afinidad-${planId}"
                    data-lista-personas-afinidad="${planId}"
                    aria-live="polite"
                ></div>

            </div>

        </article>
    `;
}


function mostrarAfinidadesPerfil() {
    if (contadorAfinidadesPerfil) {
        contadorAfinidadesPerfil.textContent =
            afinidadesPerfil.length;
    }

    if (
        !listaAfinidadesPerfil ||
        !estadoVacioAfinidades
    ) {
        return;
    }

    if (afinidadesPerfil.length === 0) {
        listaAfinidadesPerfil.innerHTML =
            "";

        listaAfinidadesPerfil.classList.add(
            "oculta"
        );

        estadoVacioAfinidades.classList.remove(
            "oculto"
        );

        return;
    }

    listaAfinidadesPerfil.classList.remove(
        "oculta"
    );

    estadoVacioAfinidades.classList.add(
        "oculto"
    );

    listaAfinidadesPerfil.innerHTML =
        afinidadesPerfil
            .map(crearAfinidadHTML)
            .join("");

    activarBotonesDesactivarAfinidad();
    activarBotonesVerPersonasAfinidad();
}


async function obtenerUsuarioAfinidades() {
    const cliente =
        obtenerClienteAfinidades();

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

    return data.session?.user || null;
}


async function obtenerTotalPersonasAfinidad(
    planId
) {
    const cliente =
        obtenerClienteAfinidades();

    if (
        !cliente ||
        !planId
    ) {
        return 0;
    }

    const {
        data,
        error
    } = await cliente.rpc(
        "contar_afinidades_plan",
        {
            plan_buscado:
                planId
        }
    );

    if (error) {
        console.error(
            `No se pudo contar la afinidad del plan ${planId}:`,
            error
        );

        return 0;
    }

    return Number(data || 0);
}



async function limpiarAfinidadesDePlanesEliminados(
    usuarioId,
    afinidades
) {
    const cliente =
        obtenerClienteAfinidades();

    if (
        !cliente ||
        !usuarioId ||
        !Array.isArray(afinidades) ||
        afinidades.length === 0
    ) {
        return afinidades;
    }

    /*
       Los planes antiguos usan identificadores como
       "sierra-norte", mientras que los planes nuevos
       guardados en public.planes utilizan UUID.

       Solo consultamos en Supabase los UUID para evitar
       errores 400 al comparar una columna uuid con IDs legacy.
    */

    const afinidadesLegacy =
        afinidades.filter(
            (afinidad) =>
                !esIdUuidPerfil(
                    afinidad.plan_id
                )
        );

    const afinidadesSupabase =
        afinidades.filter(
            (afinidad) =>
                esIdUuidPerfil(
                    afinidad.plan_id
                )
        );

    if (
        afinidadesSupabase.length === 0
    ) {
        return afinidadesLegacy;
    }

    const idsPlanes =
        [
            ...new Set(
                afinidadesSupabase
                    .map(
                        (afinidad) =>
                            String(
                                afinidad.plan_id ||
                                ""
                            )
                    )
                    .filter(Boolean)
            )
        ];

    const {
        data,
        error
    } = await cliente
        .from(
            "planes"
        )
        .select(
            "id"
        )
        .in(
            "id",
            idsPlanes
        )
        .eq(
            "estado",
            "publicado"
        );

    if (error) {
        throw error;
    }

    const idsDisponibles =
        new Set(
            (
                Array.isArray(data)
                    ? data
                    : []
            ).map(
                (plan) =>
                    String(
                        plan.id
                    )
            )
        );

    const idsEliminados =
        idsPlanes.filter(
            (planId) =>
                !idsDisponibles.has(
                    String(
                        planId
                    )
                )
        );

    /*
       Eliminamos únicamente afinidades de planes UUID
       que ya no están publicados. Los planes legacy
       se conservan y no se consultan en public.planes.
    */

    if (
        idsEliminados.length > 0
    ) {
        const {
            error: errorLimpieza
        } = await cliente
            .from(
                "afinidades_planes"
            )
            .delete()
            .eq(
                "usuario_id",
                usuarioId
            )
            .in(
                "plan_id",
                idsEliminados
            );

        if (errorLimpieza) {
            console.error(
                "No se pudieron eliminar las afinidades huérfanas:",
                errorLimpieza
            );
        }
    }

    const afinidadesSupabaseValidas =
        afinidadesSupabase.filter(
            (afinidad) =>
                idsDisponibles.has(
                    String(
                        afinidad.plan_id
                    )
                )
        );

    return [
        ...afinidadesLegacy,
        ...afinidadesSupabaseValidas
    ];
}


async function cargarAfinidadesPerfil() {
    const cliente =
        obtenerClienteAfinidades();

    if (!cliente) {
        console.error(
            "No se ha encontrado el cliente de Supabase para cargar las afinidades."
        );

        afinidadesPerfil = [];
        mostrarAfinidadesPerfil();
        return;
    }

    try {
        const usuario =
            await obtenerUsuarioAfinidades();

        if (!usuario) {
            afinidadesPerfil = [];
            mostrarAfinidadesPerfil();
            return;
        }

        const {
            data,
            error
        } = await cliente
            .from("afinidades_planes")
            .select(
                `
                    plan_id,
                    plan_titulo,
                    plan_imagen,
                    plan_fecha,
                    plan_ubicacion,
                    activo,
                    creado_en
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .eq(
                "activo",
                true
            )
            .order(
                "creado_en",
                {
                    ascending: false
                }
            );

        if (error) {
            throw error;
        }

        const afinidadesRecibidas =
            Array.isArray(data)
                ? data
                : [];

        const afinidadesValidas =
            await limpiarAfinidadesDePlanesEliminados(
                usuario.id,
                afinidadesRecibidas
            );

        afinidadesPerfil =
            await Promise.all(
                afinidadesValidas.map(
                    async (afinidad) => {
                        const totalPersonas =
                            await obtenerTotalPersonasAfinidad(
                                afinidad.plan_id
                            );

                        return {
                            ...afinidad,
                            total_personas:
                                totalPersonas
                        };
                    }
                )
            );

        mostrarAfinidadesPerfil();
    } catch (error) {
        console.error(
            "No se pudieron cargar las afinidades:",
            error
        );

        afinidadesPerfil = [];
        mostrarAfinidadesPerfil();

        mostrarNotificacion(
            "No se han podido cargar tus afinidades."
        );
    }
}


async function desactivarAfinidadPerfil(
    planId,
    boton
) {
    const cliente =
        obtenerClienteAfinidades();

    if (!cliente) {
        mostrarNotificacion(
            "No se ha podido conectar con Supabase."
        );

        return;
    }

    boton.disabled = true;

    try {
        const usuario =
            await obtenerUsuarioAfinidades();

        if (!usuario) {
            window.location.href =
                "login.html";

            return;
        }

        const {
            error
        } = await cliente
            .from("afinidades_planes")
            .update({
                activo:
                    false,

                actualizado_en:
                    new Date().toISOString()
            })
            .eq(
                "usuario_id",
                usuario.id
            )
            .eq(
                "plan_id",
                planId
            );

        if (error) {
            throw error;
        }

        afinidadesPerfil =
            afinidadesPerfil.filter(
                (afinidad) =>
                    afinidad.plan_id !==
                    planId
            );

        mostrarAfinidadesPerfil();

        mostrarNotificacion(
            "La afinidad se ha desactivado."
        );
    } catch (error) {
        console.error(
            "No se pudo desactivar la afinidad:",
            error
        );

        mostrarNotificacion(
            "No se ha podido desactivar la afinidad."
        );

        boton.disabled = false;
    }
}


function textoInteresesComunes(
    cantidad
) {
    const total =
        Number(cantidad || 0);

    if (total === 0) {
        return "Sin intereses en común todavía";
    }

    if (total === 1) {
        return "1 interés en común";
    }

    return `${total} intereses en común`;
}


function crearPersonaAfinidadHTML(
    persona
) {
    const perfilId =
        escaparHTML(
            persona.perfil_id || ""
        );

    const nombre =
        escaparHTML(
            persona.nombre ||
            "Usuario de Suralia"
        );

    const localidad =
        escaparHTML(
            persona.localidad ||
            "Localidad no indicada"
        );

    const ocupacion =
        escaparHTML(
            persona.ocupacion ||
            ""
        );

    const foto =
        escaparHTML(
            persona.foto_principal ||
            ""
        );

    const edad =
        Number(persona.edad || 0);

    const verificado =
        Boolean(
            persona.verificado
        );

    const interesesComunes =
        textoInteresesComunes(
            persona.intereses_comunes
        );

    return `
        <article class="persona-afinidad">

            <div class="persona-afinidad__foto">

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
                            <i
                                class="fa-regular fa-user"
                                aria-hidden="true"
                            ></i>
                        `
                }

            </div>

            <div class="persona-afinidad__contenido">

                <div class="persona-afinidad__superior">

                    <div>

                        <h4>
                            ${nombre}
                            ${
                                edad > 0
                                    ? `, ${edad}`
                                    : ""
                            }
                        </h4>

                        ${
                            verificado
                                ? `
                                    <span class="persona-afinidad__verificado">
                                        <i class="fa-solid fa-circle-check"></i>
                                        Perfil verificado
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

                <div class="persona-afinidad__datos">

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${localidad}
                    </span>

                    ${
                        ocupacion
                            ? `
                                <span>
                                    <i class="fa-solid fa-briefcase"></i>
                                    ${ocupacion}
                                </span>
                            `
                            : ""
                    }

                </div>

                <span class="persona-afinidad__coincidencias">
                    <i class="fa-solid fa-link"></i>
                    ${escaparHTML(interesesComunes)}
                </span>

                <a
                    href="perfil-publico.html?id=${encodeURIComponent(
                        perfilId
                    )}"
                    class="boton-principal-pequeno"
                >
                    Ver perfil
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}


async function cargarPersonasAfinidad(
    planId,
    contenedor,
    boton
) {
    const cliente =
        obtenerClienteAfinidades();

    if (
        !cliente ||
        !contenedor
    ) {
        return;
    }

    contenedor.classList.remove(
        "oculto"
    );

    contenedor.innerHTML = `
        <div class="personas-afinidad__cargando">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Cargando personas interesadas...
        </div>
    `;

    boton.disabled =
        true;

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_personas_afinidad",
            {
                plan_buscado:
                    planId
            }
        );

        if (error) {
            throw error;
        }

        const personas =
            Array.isArray(data)
                ? data
                : [];

        if (personas.length === 0) {
            contenedor.innerHTML = `
                <div class="personas-afinidad__vacio">

                    <span>
                        <i class="fa-regular fa-user"></i>
                    </span>

                    <div>
                        <h4>
                            Todavía no hay otras personas visibles
                        </h4>

                        <p>
                            Cuando alguien active esta afinidad y tenga
                            el perfil social visible, aparecerá aquí.
                        </p>
                    </div>

                </div>
            `;

            return;
        }

        contenedor.innerHTML = `
            <div class="personas-afinidad__cabecera">

                <div>
                    <span class="subtitulo">
                        Personas interesadas
                    </span>

                    <h4>
                        ${
                            personas.length === 1
                                ? "1 perfil disponible"
                                : `${personas.length} perfiles disponibles`
                        }
                    </h4>
                </div>

            </div>

            <div class="personas-afinidad__grid">
                ${personas
                    .map(
                        crearPersonaAfinidadHTML
                    )
                    .join("")}
            </div>
        `;
    } catch (error) {
        console.error(
            "No se pudieron cargar las personas interesadas:",
            error
        );

        contenedor.innerHTML = `
            <div class="personas-afinidad__error">
                <i class="fa-solid fa-circle-exclamation"></i>
                No se han podido cargar las personas interesadas.
            </div>
        `;
    } finally {
        boton.disabled =
            false;
    }
}


function activarBotonesVerPersonasAfinidad() {
    document
        .querySelectorAll(
            "[data-ver-personas-afinidad]"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const planId =
                            boton.dataset
                                .verPersonasAfinidad;

                        const contenedor =
                            document.querySelector(
                                `[data-lista-personas-afinidad="${planId}"]`
                            );

                        if (!contenedor) {
                            return;
                        }

                        const estaAbierto =
                            !contenedor.classList.contains(
                                "oculto"
                            );

                        if (estaAbierto) {
                            contenedor.classList.add(
                                "oculto"
                            );

                            boton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            return;
                        }

                        boton.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                        await cargarPersonasAfinidad(
                            planId,
                            contenedor,
                            boton
                        );
                    }
                );
            }
        );
}


function activarBotonesDesactivarAfinidad() {
    document
        .querySelectorAll(
            "[data-desactivar-afinidad]"
        )
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    desactivarAfinidadPerfil(
                        boton.dataset
                            .desactivarAfinidad,
                        boton
                    );
                }
            );
        });
}




/* =========================================
   SONIDO DE NOTIFICACIÓN DE MENSAJES
========================================= */

let contextoAudioNotificaciones =
    null;

let sonidoNotificacionesPreparado =
    false;


function prepararSonidoNotificaciones() {
    if (sonidoNotificacionesPreparado) {
        return;
    }

    const AudioContexto =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContexto) {
        return;
    }

    try {
        contextoAudioNotificaciones =
            contextoAudioNotificaciones ||
            new AudioContexto();

        if (
            contextoAudioNotificaciones.state ===
            "suspended"
        ) {
            contextoAudioNotificaciones.resume();
        }

        sonidoNotificacionesPreparado =
            true;
    } catch (error) {
        console.error(
            "No se pudo preparar el sonido de notificación:",
            error
        );
    }
}


function reproducirSonidoNotificacion() {
    if (
        !contextoAudioNotificaciones ||
        contextoAudioNotificaciones.state !==
            "running"
    ) {
        return;
    }

    try {
        const ahora =
            contextoAudioNotificaciones.currentTime;

        const ganancia =
            contextoAudioNotificaciones.createGain();

        const osciladorUno =
            contextoAudioNotificaciones.createOscillator();

        const osciladorDos =
            contextoAudioNotificaciones.createOscillator();

        ganancia.gain.setValueAtTime(
            0.0001,
            ahora
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.12,
            ahora + 0.015
        );

        ganancia.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.32
        );

        osciladorUno.type =
            "sine";

        osciladorUno.frequency.setValueAtTime(
            740,
            ahora
        );

        osciladorDos.type =
            "sine";

        osciladorDos.frequency.setValueAtTime(
            980,
            ahora + 0.08
        );

        osciladorUno.connect(
            ganancia
        );

        osciladorDos.connect(
            ganancia
        );

        ganancia.connect(
            contextoAudioNotificaciones.destination
        );

        osciladorUno.start(
            ahora
        );

        osciladorUno.stop(
            ahora + 0.18
        );

        osciladorDos.start(
            ahora + 0.08
        );

        osciladorDos.stop(
            ahora + 0.3
        );
    } catch (error) {
        console.error(
            "No se pudo reproducir el sonido de notificación:",
            error
        );
    }
}


[
    "click",
    "keydown",
    "touchstart"
].forEach(
    (
        tipoEvento
    ) => {
        document.addEventListener(
            tipoEvento,
            prepararSonidoNotificaciones,
            {
                once:
                    true,
                passive:
                    true
            }
        );
    }
);



/* =========================================
   NOTIFICACIONES DEL NAVEGADOR
========================================= */

function notificacionesNavegadorDisponibles() {
    return (
        "Notification" in window
    );
}


function notificacionesNavegadorActivas() {
    return (
        notificacionesNavegadorDisponibles() &&
        Notification.permission ===
            "granted"
    );
}


function mostrarNotificacionNavegador(
    titulo,
    cuerpo
) {
    if (
        !notificacionesNavegadorActivas() ||
        document.visibilityState ===
            "visible"
    ) {
        return;
    }

    try {
        const notificacion =
            new Notification(
                titulo,
                {
                    body:
                        cuerpo,

                    icon:
                        "img/suralia-favicon.png?v=10",

                    badge:
                        "img/suralia-favicon.png?v=10",

                    tag:
                        "nuevo-mensaje-suralia"
                }
            );

        notificacion.onclick =
            () => {
                window.focus();

                notificacion.close();
            };
    } catch (error) {
        console.error(
            "No se pudo mostrar la notificación del navegador:",
            error
        );
    }
}


/* =========================================
   NOTIFICACIONES DE MENSAJES PENDIENTES
========================================= */

function actualizarContadorMensajesPendientes(
    total
) {
    totalMensajesPendientes =
        Math.max(
            0,
            Number(total) ||
            0
        );

    if (!contadorMensajesPendientes) {
        return;
    }

    contadorMensajesPendientes.textContent =
        totalMensajesPendientes > 99
            ? "99+"
            : String(
                totalMensajesPendientes
            );

    contadorMensajesPendientes.classList.toggle(
        "oculto",
        totalMensajesPendientes === 0
    );

    contadorMensajesPendientes.setAttribute(
        "aria-label",
        `${totalMensajesPendientes} ${
            totalMensajesPendientes === 1
                ? "mensaje pendiente"
                : "mensajes pendientes"
        }`
    );
}


async function cargarMensajesPendientes() {
    const cliente =
        window.clienteSupabase;

    if (!cliente?.auth) {
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

        const usuarioId =
            datosSesion.session?.user?.id;

        if (!usuarioId) {
            actualizarContadorMensajesPendientes(
                0
            );

            return;
        }

        const {
            count,
            error
        } = await cliente
            .from("mensajes")
            .select(
                "id",
                {
                    count:
                        "exact",

                    head:
                        true
                }
            )
            .eq(
                "leido",
                false
            )
            .neq(
                "remitente_id",
                usuarioId
            );

        if (error) {
            throw error;
        }

        actualizarContadorMensajesPendientes(
            count ||
            0
        );
    } catch (error) {
        console.error(
            "No se pudo cargar el contador de mensajes pendientes:",
            error
        );
    }
}


async function obtenerNombreRemitenteMensaje(
    remitenteId
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !remitenteId
    ) {
        return "";
    }

    try {
        const {
            data,
            error
        } = await cliente
            .from("perfiles_sociales")
            .select(
                "nombre_visible"
            )
            .eq(
                "usuario_id",
                remitenteId
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data?.nombre_visible ||
            "";
    } catch (error) {
        console.error(
            "No se pudo identificar al remitente del mensaje:",
            error
        );

        return "";
    }
}


async function suscribirseANotificacionesMensajes() {
    const cliente =
        window.clienteSupabase;

    if (!cliente?.auth) {
        return;
    }

    const {
        data: datosSesion,
        error: errorSesion
    } = await cliente.auth.getSession();

    if (errorSesion) {
        console.error(
            "No se pudo iniciar la suscripción de mensajes:",
            errorSesion
        );

        return;
    }

    const usuarioId =
        datosSesion.session?.user?.id;

    if (!usuarioId) {
        return;
    }

    if (canalNotificacionesMensajes) {
        cliente.removeChannel(
            canalNotificacionesMensajes
        );
    }

    canalNotificacionesMensajes =
        cliente
            .channel(
                `notificaciones-mensajes-${usuarioId}`
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "mensajes"
                },
                async (
                    cambio
                ) => {
                    const mensaje =
                        cambio.new;

                    if (
                        !mensaje ||
                        mensaje.remitente_id ===
                            usuarioId
                    ) {
                        return;
                    }

                    await cargarMensajesPendientes();

                    const nombre =
                        await obtenerNombreRemitenteMensaje(
                            mensaje.remitente_id
                        );

                    reproducirSonidoNotificacion();

                    mostrarNotificacionNavegador(
                        nombre
                            ? `Nuevo mensaje de ${nombre}`
                            : "Nuevo mensaje en Suralia",
                        "Abre Suralia para leerlo."
                    );

                    mostrarNotificacion(
                        nombre
                            ? `Nuevo mensaje de ${nombre}.`
                            : "Tienes un nuevo mensaje."
                    );
                }
            )
            .subscribe(
                (
                    estado
                ) => {
                    if (
                        estado ===
                        "CHANNEL_ERROR"
                    ) {
                        console.error(
                            "No se pudo activar la notificación de mensajes en tiempo real."
                        );
                    }
                }
            );
}


document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            cargarMensajesPendientes();
        }
    }
);


window.addEventListener(
    "beforeunload",
    () => {
        if (
            canalNotificacionesMensajes &&
            window.clienteSupabase
        ) {
            window.clienteSupabase
                .removeChannel(
                    canalNotificacionesMensajes
                );
        }
    }
);


/* =========================================
   CONEXIONES - CARGA DESDE SUPABASE
========================================= */

const contadorMensajesPendientes = document.querySelector(
    "#contador-mensajes-pendientes"
);

let canalNotificacionesMensajes =
    null;

let totalMensajesPendientes =
    0;


const listaSolicitudesRecibidas = document.querySelector(
    "#lista-solicitudes-recibidas"
);

const listaSolicitudesEnviadas = document.querySelector(
    "#lista-solicitudes-enviadas"
);

const listaConexionesAceptadas = document.querySelector(
    "#lista-conexiones-aceptadas"
);

const estadoVacioSolicitudesRecibidas = document.querySelector(
    "#estado-vacio-solicitudes-recibidas"
);

const estadoVacioSolicitudesEnviadas = document.querySelector(
    "#estado-vacio-solicitudes-enviadas"
);

const estadoVacioConexionesAceptadas = document.querySelector(
    "#estado-vacio-conexiones-aceptadas"
);

const contadorSolicitudesRecibidas = document.querySelector(
    "#contador-solicitudes-recibidas"
);

const contadorSolicitudesEnviadas = document.querySelector(
    "#contador-solicitudes-enviadas"
);

const contadorConexionesAceptadas = document.querySelector(
    "#contador-conexiones-aceptadas"
);

function formatearFechaConexion(fechaIso) {
    if (!fechaIso) {
        return "Fecha no disponible";
    }

    const fecha = new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
        return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(fecha);
}

function obtenerInicialesConexion(nombre = "Usuario") {
    return String(nombre)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte.charAt(0))
        .join("")
        .toUpperCase() || "SU";
}

function crearAvatarConexionHTML(perfil) {
    const nombre = escaparHTML(
        perfil?.nombre_visible || "Usuario de Suralia"
    );

    const foto = escaparHTML(
        perfil?.foto_principal_url || ""
    );

    if (foto) {
        return `
            <span class="conexion-item__avatar">
                <img
                    src="${foto}"
                    alt="Foto de ${nombre}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.parentElement.textContent='${obtenerInicialesConexion(nombre)}';
                    "
                >
            </span>
        `;
    }

    return `
        <span class="conexion-item__avatar" aria-hidden="true">
            ${obtenerInicialesConexion(nombre)}
        </span>
    `;
}

function crearSolicitudRecibidaHTML(solicitud) {
    const perfil = solicitud.perfil || {};
    const nombre = escaparHTML(
        perfil.nombre_visible || "Usuario de Suralia"
    );
    const localidad = escaparHTML(
        perfil.localidad || "Localidad no indicada"
    );
    const perfilPublicoId = escaparHTML(
        perfil.perfil_publico_id || ""
    );
    const fecha = escaparHTML(
        formatearFechaConexion(solicitud.creado_en)
    );

    return `
        <article class="conexion-item" data-solicitud-id="${escaparHTML(solicitud.id)}">
            ${crearAvatarConexionHTML(perfil)}

            <div class="conexion-item__contenido">
                <div class="conexion-item__superior">
                    <h4>${nombre}</h4>
                    <span class="conexion-item__estado conexion-item__estado--pendiente">
                        <i class="fa-regular fa-clock"></i>
                        Pendiente
                    </span>
                </div>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${localidad}
                </p>

                <span class="conexion-item__fecha">
                    Recibida el ${fecha}
                </span>
            </div>

            <div class="conexion-item__acciones">
                ${
                    perfilPublicoId
                        ? `
                            <a
                                href="perfil-publico.html?id=${encodeURIComponent(perfilPublicoId)}"
                                class="boton-conexion boton-conexion--principal"
                                data-ver-perfil-conexion
                            >
                                <i class="fa-regular fa-user"></i>
                                Ver perfil antes de decidir
                            </a>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="boton-conexion boton-conexion--secundario"
                    data-aceptar-solicitud="${escaparHTML(solicitud.id)}"
                >
                    <i class="fa-solid fa-check"></i>
                    Aceptar
                </button>

                <button
                    type="button"
                    class="boton-conexion boton-conexion--peligro"
                    data-rechazar-solicitud="${escaparHTML(solicitud.id)}"
                >
                    <i class="fa-solid fa-xmark"></i>
                    Rechazar
                </button>
            </div>
        </article>
    `;
}

function obtenerClaseEstadoSolicitud(estado) {
    const clases = {
        pendiente: "conexion-item__estado--pendiente",
        aceptada: "conexion-item__estado--aceptada",
        rechazada: "conexion-item__estado--rechazada"
    };

    return clases[estado] || clases.pendiente;
}

function obtenerTextoEstadoSolicitud(estado) {
    const textos = {
        pendiente: "Pendiente",
        aceptada: "Aceptada",
        rechazada: "Rechazada"
    };

    return textos[estado] || "Pendiente";
}

function crearSolicitudEnviadaHTML(solicitud) {
    const perfil = solicitud.perfil || {};
    const nombre = escaparHTML(
        perfil.nombre_visible || "Usuario de Suralia"
    );
    const localidad = escaparHTML(
        perfil.localidad || "Localidad no indicada"
    );
    const perfilPublicoId = escaparHTML(
        perfil.perfil_publico_id || ""
    );
    const estado = String(solicitud.estado || "pendiente").toLowerCase();
    const textoEstado = obtenerTextoEstadoSolicitud(estado);
    const claseEstado = obtenerClaseEstadoSolicitud(estado);
    const fecha = escaparHTML(
        formatearFechaConexion(solicitud.creado_en)
    );

    return `
        <article class="conexion-item" data-solicitud-id="${escaparHTML(solicitud.id)}">
            ${crearAvatarConexionHTML(perfil)}

            <div class="conexion-item__contenido">
                <div class="conexion-item__superior">
                    <h4>${nombre}</h4>
                    <span class="conexion-item__estado ${claseEstado}">
                        ${textoEstado}
                    </span>
                </div>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${localidad}
                </p>

                <span class="conexion-item__fecha">
                    Enviada el ${fecha}
                </span>
            </div>

            <div class="conexion-item__acciones">
                ${
                    perfilPublicoId
                        ? `
                            <a
                                href="perfil-publico.html?id=${encodeURIComponent(perfilPublicoId)}"
                                class="boton-conexion boton-conexion--secundario"
                            >
                                <i class="fa-regular fa-user"></i>
                                Ver perfil
                            </a>
                        `
                        : ""
                }

                ${
                    estado === "pendiente"
                        ? `
                            <button
                                type="button"
                                class="boton-conexion boton-conexion--peligro"
                                data-cancelar-solicitud="${escaparHTML(solicitud.id)}"
                            >
                                <i class="fa-solid fa-ban"></i>
                                Cancelar solicitud
                            </button>
                        `
                        : ""
                }
            </div>
        </article>
    `;
}

function crearConexionAceptadaHTML(conexion) {
    const perfil = conexion.perfil || {};
    const nombre = escaparHTML(
        perfil.nombre_visible || "Usuario de Suralia"
    );
    const localidad = escaparHTML(
        perfil.localidad || "Localidad no indicada"
    );
    const perfilPublicoId = escaparHTML(
        perfil.perfil_publico_id || ""
    );
    const fecha = escaparHTML(
        formatearFechaConexion(
            conexion.actualizado_en || conexion.creado_en
        )
    );

    return `
        <article class="conexion-item" data-conexion-id="${escaparHTML(conexion.id)}">
            ${crearAvatarConexionHTML(perfil)}

            <div class="conexion-item__contenido">
                <div class="conexion-item__superior">
                    <h4>${nombre}</h4>
                    <span class="conexion-item__estado conexion-item__estado--aceptada">
                        <i class="fa-solid fa-user-check"></i>
                        Conexión
                    </span>
                </div>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${localidad}
                </p>

                <span class="conexion-item__fecha">
                    Conectados desde el ${fecha}
                </span>
            </div>

            <div class="conexion-item__acciones">
                ${
                    perfilPublicoId
                        ? `
                            <a
                                href="perfil-publico.html?id=${encodeURIComponent(perfilPublicoId)}"
                                class="boton-conexion boton-conexion--principal"
                                data-ver-perfil-conexion
                            >
                                <i class="fa-regular fa-user"></i>
                                Ver perfil
                            </a>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="boton-conexion boton-conexion--mensaje"
                    data-iniciar-conversacion="${escaparHTML(
                        conexion.otro_usuario_id || ""
                    )}"
                    data-nombre-conversacion="${nombre}"
                >
                    <i class="fa-regular fa-comments"></i>
                    Enviar mensaje
                </button>

                <button
                    type="button"
                    class="boton-conexion boton-conexion--peligro"
                    data-eliminar-conexion="${escaparHTML(conexion.id)}"
                    data-nombre-conexion="${nombre}"
                >
                    <i class="fa-solid fa-user-minus"></i>
                    Eliminar conexión
                </button>
            </div>
        </article>
    `;
}

async function obtenerPerfilesConexion(usuarioIds = []) {
    const cliente = window.clienteSupabase;

    const idsUnicos = [...new Set(
        usuarioIds.filter(Boolean)
    )];

    if (!cliente || idsUnicos.length === 0) {
        return new Map();
    }

    const { data, error } = await cliente
        .from("perfiles_sociales")
        .select(`
            usuario_id,
            perfil_publico_id,
            nombre_visible,
            foto_principal_url,
            localidad,
            intereses,
            perfil_visible
        `)
        .in("usuario_id", idsUnicos);

    if (error) {
        throw error;
    }

    return new Map(
        (Array.isArray(data) ? data : []).map(
            (perfil) => [perfil.usuario_id, perfil]
        )
    );
}

function actualizarBloqueConexiones(
    lista,
    estadoVacio,
    elementos,
    creadorHTML
) {
    if (!lista || !estadoVacio) {
        return;
    }

    if (!Array.isArray(elementos) || elementos.length === 0) {
        lista.innerHTML = "";
        lista.classList.add("oculta");
        estadoVacio.classList.remove("oculto");
        return;
    }

    lista.classList.remove("oculta");
    estadoVacio.classList.add("oculto");
    lista.innerHTML = elementos.map(creadorHTML).join("");
}


async function actualizarEstadoSolicitudConexion(
    solicitudId,
    nuevoEstado,
    boton
) {
    const cliente = window.clienteSupabase;

    if (!cliente) {
        mostrarNotificacion(
            "No se ha podido conectar con Supabase."
        );
        return;
    }

    const idSeguro = String(solicitudId || "").trim();

    if (!idSeguro) {
        return;
    }

    const textoOriginal = boton?.innerHTML || "";

    if (boton) {
        boton.disabled = true;
        boton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Procesando
        `;
    }

    try {
        const usuario = await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            throw new Error(
                "No existe una sesión válida."
            );
        }

        const { data, error } = await cliente
            .from("solicitudes_conexion")
            .update({
                estado: nuevoEstado,
                actualizado_en: new Date().toISOString()
            })
            .eq("id", idSeguro)
            .eq("receptor_id", usuario.id)
            .eq("estado", "pendiente")
            .select("id")
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "La solicitud ya no está pendiente o no tienes permiso para modificarla."
            );
        }

        mostrarNotificacion(
            nuevoEstado === "aceptada"
                ? "La solicitud se ha aceptado."
                : "La solicitud se ha rechazado."
        );

        await cargarConexionesPerfil();
    } catch (error) {
        console.error(
            "No se pudo actualizar la solicitud de conexión:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido actualizar la solicitud."
        );

        if (boton) {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    }
}

async function cancelarSolicitudConexion(
    solicitudId,
    boton
) {
    const cliente = window.clienteSupabase;

    if (!cliente) {
        mostrarNotificacion(
            "No se ha podido conectar con Supabase."
        );
        return;
    }

    const idSeguro = String(solicitudId || "").trim();

    if (!idSeguro) {
        return;
    }

    const textoOriginal = boton?.innerHTML || "";

    if (boton) {
        boton.disabled = true;
        boton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Cancelando
        `;
    }

    try {
        const usuario = await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            throw new Error(
                "No existe una sesión válida."
            );
        }

        const { data, error } = await cliente
            .from("solicitudes_conexion")
            .delete()
            .eq("id", idSeguro)
            .eq("solicitante_id", usuario.id)
            .eq("estado", "pendiente")
            .select("id")
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "La solicitud ya no está pendiente o no tienes permiso para cancelarla."
            );
        }

        mostrarNotificacion(
            "La solicitud se ha cancelado."
        );

        await cargarConexionesPerfil();
    } catch (error) {
        console.error(
            "No se pudo cancelar la solicitud de conexión:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido cancelar la solicitud."
        );

        if (boton) {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    }
}

function abrirConfirmacionEliminarConexion(
    conexionId,
    nombrePersona,
    boton
) {
    const idSeguro = String(
        conexionId || ""
    ).trim();

    if (!idSeguro || !modalEliminarConexion) {
        return;
    }

    conexionPendienteEliminar = idSeguro;
    nombreConexionPendienteEliminar = String(
        nombrePersona || "esta persona"
    ).trim();
    botonConexionPendienteEliminar = boton || null;

    if (descripcionModalEliminarConexion) {
        descripcionModalEliminarConexion.textContent =
            `¿Seguro que quieres eliminar tu conexión con ${nombreConexionPendienteEliminar}? Esta acción no se puede deshacer.`;
    }

    elementoQueAbrioModalEliminarConexion =
        abrirModalAccesible(
            modalEliminarConexion,
            cancelarEliminarConexion,
            boton
        );
}


function cerrarConfirmacionEliminarConexion() {
    cerrarModalAccesible(
        modalEliminarConexion,
        elementoQueAbrioModalEliminarConexion
    );

    conexionPendienteEliminar = null;
    nombreConexionPendienteEliminar = "";
    botonConexionPendienteEliminar = null;
    elementoQueAbrioModalEliminarConexion = null;
}


async function eliminarConexionAceptada() {
    const cliente = window.clienteSupabase;

    if (!cliente) {
        mostrarNotificacion(
            "No se ha podido conectar con Supabase."
        );
        return;
    }

    if (!conexionPendienteEliminar) {
        return;
    }

    const idSeguro = conexionPendienteEliminar;
    const boton = botonConexionPendienteEliminar;
    const textoOriginal = boton?.innerHTML || "";

    if (confirmarEliminarConexion) {
        confirmarEliminarConexion.disabled = true;
        confirmarEliminarConexion.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Eliminando
        `;
    }

    if (boton) {
        boton.disabled = true;
    }

    try {
        const usuario = await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            throw new Error(
                "No existe una sesión válida."
            );
        }

        const { data, error } = await cliente
            .from("solicitudes_conexion")
            .delete()
            .eq("id", idSeguro)
            .eq("estado", "aceptada")
            .or(
                `solicitante_id.eq.${usuario.id},receptor_id.eq.${usuario.id}`
            )
            .select("id")
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "La conexión ya no existe o no tienes permiso para eliminarla."
            );
        }

        cerrarConfirmacionEliminarConexion();

        mostrarNotificacion(
            "La conexión se ha eliminado."
        );

        await cargarConexionesPerfil();
    } catch (error) {
        console.error(
            "No se pudo eliminar la conexión:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido eliminar la conexión."
        );

        if (boton) {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    } finally {
        if (confirmarEliminarConexion) {
            confirmarEliminarConexion.disabled = false;
            confirmarEliminarConexion.innerHTML =
                "Eliminar conexión";
        }
    }
}


cancelarEliminarConexion?.addEventListener(
    "click",
    cerrarConfirmacionEliminarConexion
);


confirmarEliminarConexion?.addEventListener(
    "click",
    eliminarConexionAceptada
);


modalEliminarConexion?.addEventListener(
    "click",
    (evento) => {
        if (evento.target === modalEliminarConexion) {
            cerrarConfirmacionEliminarConexion();
        }
    }
);


function activarEnlacesPerfilConexion() {
    document
        .querySelectorAll("[data-ver-perfil-conexion]")
        .forEach((enlace) => {
            enlace.addEventListener("click", () => {
                sessionStorage.setItem(
                    "volverPerfilPublicoSuralia",
                    "perfil.html#conexiones"
                );
            });
        });
}


async function iniciarConversacionConexion(
    otroUsuarioId,
    nombre,
    boton
) {
    const cliente =
        window.clienteSupabase;

    if (
        !cliente ||
        !otroUsuarioId ||
        !boton
    ) {
        mostrarNotificacion(
            "No se ha podido abrir la conversación."
        );

        return;
    }

    const contenidoOriginal =
        boton.innerHTML;

    boton.disabled =
        true;

    boton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Abriendo chat
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
                "No se ha podido identificar la conversación."
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
            "No se pudo iniciar la conversación:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido abrir el chat."
        );

        boton.disabled =
            false;

        boton.innerHTML =
            contenidoOriginal;
    }
}


function activarAccionesSolicitudesConexion() {
    document
        .querySelectorAll("[data-aceptar-solicitud]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                actualizarEstadoSolicitudConexion(
                    boton.dataset.aceptarSolicitud,
                    "aceptada",
                    boton
                );
            });
        });

    document
        .querySelectorAll("[data-rechazar-solicitud]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                actualizarEstadoSolicitudConexion(
                    boton.dataset.rechazarSolicitud,
                    "rechazada",
                    boton
                );
            });
        });

    document
        .querySelectorAll("[data-cancelar-solicitud]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                cancelarSolicitudConexion(
                    boton.dataset.cancelarSolicitud,
                    boton
                );
            });
        });

    document
        .querySelectorAll("[data-iniciar-conversacion]")
        .forEach((boton) => {
            boton.addEventListener(
                "click",
                () => {
                    iniciarConversacionConexion(
                        boton.dataset
                            .iniciarConversacion,
                        boton.dataset
                            .nombreConversacion,
                        boton
                    );
                }
            );
        });

    document
        .querySelectorAll("[data-eliminar-conexion]")
        .forEach((boton) => {
            boton.addEventListener("click", () => {
                abrirConfirmacionEliminarConexion(
                    boton.dataset.eliminarConexion,
                    boton.dataset.nombreConexion,
                    boton
                );
            });
        });
}

function mostrarErrorCargaConexiones() {
    const mensaje = `
        <div class="estado-vacio estado-vacio--pequeno">
            <span class="estado-vacio__icono">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </span>
            <h3>No se pudieron cargar las conexiones</h3>
            <p>Recarga la página para volver a intentarlo.</p>
        </div>
    `;

    [
        listaSolicitudesRecibidas,
        listaSolicitudesEnviadas,
        listaConexionesAceptadas
    ].forEach((lista) => {
        if (lista) {
            lista.classList.remove("oculta");
            lista.innerHTML = mensaje;
        }
    });

    [
        estadoVacioSolicitudesRecibidas,
        estadoVacioSolicitudesEnviadas,
        estadoVacioConexionesAceptadas
    ].forEach((estado) => estado?.classList.add("oculto"));
}

async function cargarConexionesPerfil() {
    const cliente = window.clienteSupabase;

    if (!cliente) {
        console.error(
            "No se ha encontrado el cliente de Supabase para cargar las conexiones."
        );
        return;
    }

    try {
        const usuario = await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            return;
        }

        const { data, error } = await cliente
            .from("solicitudes_conexion")
            .select(`
                id,
                solicitante_id,
                receptor_id,
                estado,
                creado_en,
                actualizado_en
            `)
            .or(
                `solicitante_id.eq.${usuario.id},receptor_id.eq.${usuario.id}`
            )
            .order("creado_en", {
                ascending: false
            });

        if (error) {
            throw error;
        }

        const solicitudes = Array.isArray(data) ? data : [];

        const recibidas = solicitudes.filter(
            (solicitud) =>
                solicitud.receptor_id === usuario.id &&
                solicitud.estado === "pendiente"
        );

        const enviadas = solicitudes.filter(
            (solicitud) =>
                solicitud.solicitante_id === usuario.id
        );

        const aceptadas = solicitudes.filter(
            (solicitud) =>
                solicitud.estado === "aceptada" &&
                (
                    solicitud.solicitante_id === usuario.id ||
                    solicitud.receptor_id === usuario.id
                )
        );

        const otrosUsuarios = solicitudes.map(
            (solicitud) =>
                solicitud.solicitante_id === usuario.id
                    ? solicitud.receptor_id
                    : solicitud.solicitante_id
        );

        const perfilesPorUsuario = await obtenerPerfilesConexion(
            otrosUsuarios
        );

        const conPerfil = (solicitud) => {
            const otroUsuarioId =
                solicitud.solicitante_id === usuario.id
                    ? solicitud.receptor_id
                    : solicitud.solicitante_id;

            return {
                ...solicitud,
                otro_usuario_id:
                    otroUsuarioId,
                perfil:
                    perfilesPorUsuario.get(otroUsuarioId) ||
                    null
            };
        };

        const recibidasConPerfil = recibidas.map(conPerfil);
        const enviadasConPerfil = enviadas.map(conPerfil);
        const aceptadasConPerfil = aceptadas.map(conPerfil);

        if (contadorSolicitudesRecibidas) {
            contadorSolicitudesRecibidas.textContent =
                String(recibidasConPerfil.length);
        }

        if (contadorSolicitudesEnviadas) {
            contadorSolicitudesEnviadas.textContent =
                String(enviadasConPerfil.length);
        }

        if (contadorConexionesAceptadas) {
            contadorConexionesAceptadas.textContent =
                String(aceptadasConPerfil.length);
        }

        actualizarBloqueConexiones(
            listaSolicitudesRecibidas,
            estadoVacioSolicitudesRecibidas,
            recibidasConPerfil,
            crearSolicitudRecibidaHTML
        );

        actualizarBloqueConexiones(
            listaSolicitudesEnviadas,
            estadoVacioSolicitudesEnviadas,
            enviadasConPerfil,
            crearSolicitudEnviadaHTML
        );

        actualizarBloqueConexiones(
            listaConexionesAceptadas,
            estadoVacioConexionesAceptadas,
            aceptadasConPerfil,
            crearConexionAceptadaHTML
        );

        activarEnlacesPerfilConexion();
    activarAccionesSolicitudesConexion();
    } catch (error) {
        console.error(
            "No se pudieron cargar las conexiones:",
            error
        );

        mostrarErrorCargaConexiones();
        mostrarNotificacion(
            "No se han podido cargar tus conexiones."
        );
    }
}


/* =========================================
   PLANES PUBLICADOS Y BORRADORES
========================================= */

const listaPublicaciones = document.querySelector(
    "#lista-publicaciones"
);

const estadoVacioPublicaciones = document.querySelector(
    "#estado-vacio-publicaciones"
);

const filtrosPublicaciones = document.querySelectorAll(
    "[data-filtro-publicacion]"
);

const contadorPublicaciones = document.querySelector(
    "#contador-publicaciones"
);

const contadorPendientes = document.querySelector(
    "#contador-pendientes"
);

const contadorBorradores = document.querySelector(
    "#contador-borradores"
);

const modalEliminarPlan = document.querySelector(
    "#modal-eliminar-plan"
);

const cancelarEliminarPlan = document.querySelector(
    "#cancelar-eliminar-plan"
);

const confirmarEliminarPlan = document.querySelector(
    "#confirmar-eliminar-plan"
);

const BUCKET_IMAGENES_PLANES =
    "imagenes-planes";

let planesSupabaseUsuario = [];
let reservasOrganizadorPerfil = [];
let reservasOrganizadorCargadas = false;
let planReservasOrganizadorAbierto = null;
let planPendienteEliminar = null;
let filtroPublicacionActual = "todos";
let elementoQueAbrioModalEliminar = null;


function obtenerBorradoresUsuario() {
    const borradores =
        leerDatoLocal(
            "borradoresSuralia",
            []
        );

    if (!Array.isArray(borradores)) {
        return [];
    }

    return borradores
        .filter(
            (plan) =>
                plan.creadoPor ===
                usuarioGuardado.email
        )
        .map(
            (plan) => ({
                ...plan,
                estado:
                    "borrador",
                almacenamiento:
                    "borradoresSuralia"
            })
        );
}


function normalizarPlanSupabase(
    plan
) {
    return {
        id:
            plan.id,

        titulo:
            plan.titulo ||
            "Plan sin título",

        categoria:
            plan.categoria ||
            "",

        nombreCategoria:
            plan.nombre_categoria ||
            plan.categoria ||
            "Sin categoría",

        descripcion:
            plan.descripcion ||
            "",

        fecha:
            plan.fecha ||
            "",

        hora:
            plan.hora
                ? String(plan.hora).slice(0, 5)
                : "",

        fechas:
            Array.isArray(plan.fechas)
                ? plan.fechas
                : [],

        duracion:
            plan.duracion ||
            "",

        plazas:
            Number(
                plan.plazas ||
                0
            ),

        ubicacion:
            plan.ubicacion ||
            "",

        precio:
            Number(
                plan.precio ||
                0
            ),

        dificultad:
            plan.dificultad ||
            "",

        provincia:
            plan.provincia ||
            "",

        imagen:
            plan.imagen_url ||
            "",

        rutaStorage:
            plan.ruta_storage ||
            "",

        estado:
            plan.estado ||
            "pendiente",

        motivoRechazo:
            plan.motivo_rechazo ||
            "",

        fechaCreacion:
            plan.creado_en ||
            "",

        almacenamiento:
            "supabase"
    };
}


function obtenerPlanesUsuario() {
    const borradoresUsuario =
        obtenerBorradoresUsuario();

    return [
        ...planesSupabaseUsuario,
        ...borradoresUsuario
    ].sort(
        (
            planA,
            planB
        ) => {
            return (
                new Date(
                    planB.fechaCreacion ||
                    0
                ) -
                new Date(
                    planA.fechaCreacion ||
                    0
                )
            );
        }
    );
}



function limpiarPublicacionesLocalesEliminadas(
    planesActuales
) {
    const publicacionesLocales =
        leerDatoLocal(
            "planesPublicadosSuralia",
            []
        );

    if (
        !Array.isArray(
            publicacionesLocales
        ) ||
        publicacionesLocales.length ===
            0
    ) {
        return;
    }

    const idsSupabase =
        new Set(
            (
                Array.isArray(
                    planesActuales
                )
                    ? planesActuales
                    : []
            ).map(
                (
                    plan
                ) => String(
                    plan.id ||
                    ""
                )
            )
        );

    const publicacionesLimpias =
        publicacionesLocales.filter(
            (
                plan
            ) => {
                const perteneceUsuario =
                    plan.usuarioEmail ===
                        usuarioGuardado.email ||
                    plan.creadoPor ===
                        usuarioGuardado.email;

                if (!perteneceUsuario) {
                    return true;
                }

                const idPlan =
                    String(
                        plan.id ||
                        plan.planId ||
                        ""
                    );

                return (
                    idPlan &&
                    idsSupabase.has(
                        idPlan
                    )
                );
            }
        );

    if (
        publicacionesLimpias.length !==
        publicacionesLocales.length
    ) {
        guardarDatoLocal(
            "planesPublicadosSuralia",
            publicacionesLimpias
        );
    }
}



function normalizarHoraReservasOrganizador(
    valor
) {
    return String(
        valor ||
        ""
    ).slice(
        0,
        5
    );
}


function formatearPrecioReservasOrganizador(
    valor
) {
    const numero =
        Number(
            valor ||
            0
        );

    if (
        !Number.isFinite(numero) ||
        numero === 0
    ) {
        return "Gratis";
    }

    return `${numero
        .toFixed(2)
        .replace(".00", "")
        .replace(".", ",")} €`;
}


function formatearFechaReservaOrganizador(
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
        return String(fechaIso);
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
    ).format(fecha);
}


function formatearFechaCreacionReservaOrganizador(
    valor
) {
    if (!valor) {
        return "";
    }

    const fecha =
        new Date(valor);

    if (
        Number.isNaN(
            fecha.getTime()
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day:
                "numeric",
            month:
                "short",
            year:
                "numeric",
            hour:
                "2-digit",
            minute:
                "2-digit"
        }
    ).format(fecha);
}


function obtenerReservasOrganizadorPlan(
    planId
) {
    return reservasOrganizadorPerfil.filter(
        (
            reserva
        ) =>
            String(
                reserva.plan_id ||
                ""
            ) ===
            String(
                planId ||
                ""
            )
    );
}


function obtenerPlazasTotalesPaseOrganizador(
    plan,
    fecha,
    hora
) {
    const fechaSegura =
        String(
            fecha ||
            ""
        );

    const horaSegura =
        normalizarHoraReservasOrganizador(
            hora
        );

    const pase =
        (
            Array.isArray(plan?.fechas)
                ? plan.fechas
                : []
        ).find(
            (
                item
            ) =>
                String(
                    item?.fecha ||
                    ""
                ) ===
                    fechaSegura &&
                normalizarHoraReservasOrganizador(
                    item?.hora
                ) ===
                    horaSegura
        );

    const plazasPase =
        Number(
            pase?.plazas
        );

    if (
        Number.isFinite(
            plazasPase
        ) &&
        plazasPase > 0
    ) {
        return Math.floor(
            plazasPase
        );
    }

    if (
        String(
            plan?.fecha ||
            ""
        ) ===
            fechaSegura &&
        normalizarHoraReservasOrganizador(
            plan?.hora
        ) ===
            horaSegura
    ) {
        const plazasPrincipal =
            Number(
                plan?.plazas
            );

        if (
            Number.isFinite(
                plazasPrincipal
            ) &&
            plazasPrincipal > 0
        ) {
            return Math.floor(
                plazasPrincipal
            );
        }
    }

    return null;
}


function agruparReservasOrganizadorPorPase(
    plan
) {
    const reservas =
        obtenerReservasOrganizadorPlan(
            plan?.id
        );

    const grupos =
        new Map();

    reservas.forEach(
        (
            reserva
        ) => {
            const fecha =
                String(
                    reserva.fecha_reserva ||
                    ""
                );

            const hora =
                normalizarHoraReservasOrganizador(
                    reserva.hora_reserva
                );

            const clave =
                `${fecha}|${hora}`;

            if (!grupos.has(clave)) {
                grupos.set(
                    clave,
                    {
                        fecha,
                        hora,
                        reservas:
                            []
                    }
                );
            }

            grupos.get(
                clave
            ).reservas.push(
                reserva
            );
        }
    );

    return Array.from(
        grupos.values()
    ).sort(
        (
            a,
            b
        ) =>
            `${a.fecha}T${a.hora}`.localeCompare(
                `${b.fecha}T${b.hora}`
            )
    );
}


function crearAvatarReservaOrganizadorHTML(
    reserva
) {
    const nombre =
        escaparHTML(
            reserva.usuario_nombre ||
            "Usuario de Suralia"
        );

    const foto =
        escaparHTML(
            reserva.usuario_foto ||
            ""
        );

    if (foto) {
        return `
            <span class="reserva-organizador__avatar">
                <img
                    src="${foto}"
                    alt="Foto de ${nombre}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.parentElement.innerHTML='<i class=&quot;fa-regular fa-user&quot;></i>';
                    "
                >
            </span>
        `;
    }

    return `
        <span class="reserva-organizador__avatar" aria-hidden="true">
            <i class="fa-regular fa-user"></i>
        </span>
    `;
}


function crearReservaOrganizadorHTML(
    reserva
) {
    const reservaId =
        escaparHTML(
            reserva.reserva_id ||
            ""
        );

    const nombre =
        escaparHTML(
            reserva.usuario_nombre ||
            "Usuario de Suralia"
        );

    const perfilPublicoId =
        escaparHTML(
            reserva.usuario_perfil_publico_id ||
            ""
        );

    const estado =
        String(
            reserva.estado ||
            "confirmada"
        ).toLowerCase();

    const confirmada =
        estado ===
        "confirmada";

    const personas =
        Math.max(
            1,
            Number(
                reserva.personas ||
                1
            )
        );

    const reservadoEn =
        formatearFechaCreacionReservaOrganizador(
            reserva.reservado_en
        );

    return `
        <article
            class="reserva-organizador ${
                confirmada
                    ? ""
                    : "reserva-organizador--cancelada"
            }"
            data-reserva-organizador-id="${reservaId}"
        >

            ${crearAvatarReservaOrganizadorHTML(reserva)}

            <div class="reserva-organizador__contenido">

                <div class="reserva-organizador__superior">
                    <div>
                        <strong>${nombre}</strong>

                        <span class="reserva-organizador__estado ${
                            confirmada
                                ? "reserva-organizador__estado--confirmada"
                                : "reserva-organizador__estado--cancelada"
                        }">
                            ${
                                confirmada
                                    ? "Confirmada"
                                    : "Cancelada"
                            }
                        </span>
                    </div>

                    <strong class="reserva-organizador__precio">
                        ${formatearPrecioReservasOrganizador(
                            reserva.precio_total
                        )}
                    </strong>
                </div>

                <div class="reserva-organizador__datos">
                    <span>
                        <i class="fa-solid fa-user-group"></i>
                        ${personas}
                        ${
                            personas === 1
                                ? "persona"
                                : "personas"
                        }
                    </span>

                    ${
                        reservadoEn
                            ? `
                                <span>
                                    <i class="fa-regular fa-clock"></i>
                                    Reservó ${escaparHTML(reservadoEn)}
                                </span>
                            `
                            : ""
                    }
                </div>

                <div class="reserva-organizador__acciones">
                    ${
                        perfilPublicoId
                            ? `
                                <a
                                    href="perfil-publico.html?id=${encodeURIComponent(
                                        perfilPublicoId
                                    )}"
                                    class="boton-reserva-organizador boton-reserva-organizador--perfil"
                                >
                                    <i class="fa-regular fa-user"></i>
                                    Ver perfil
                                </a>
                            `
                            : ""
                    }

                    ${
                        confirmada
                            ? `
                                <button
                                    type="button"
                                    class="boton-reserva-organizador boton-reserva-organizador--cancelar"
                                    data-cancelar-reserva-organizador="${reservaId}"
                                >
                                    <i class="fa-solid fa-ban"></i>
                                    Cancelar reserva
                                </button>
                            `
                            : ""
                    }
                </div>

            </div>

        </article>
    `;
}


function crearPanelReservasOrganizadorHTML(
    plan
) {
    const reservas =
        obtenerReservasOrganizadorPlan(
            plan?.id
        );

    const confirmadas =
        reservas.filter(
            (
                reserva
            ) =>
                reserva.estado ===
                "confirmada"
        );

    const totalPersonas =
        confirmadas.reduce(
            (
                total,
                reserva
            ) =>
                total +
                Math.max(
                    0,
                    Number(
                        reserva.personas ||
                        0
                    )
                ),
            0
        );

    const ingresos =
        confirmadas.reduce(
            (
                total,
                reserva
            ) =>
                total +
                Math.max(
                    0,
                    Number(
                        reserva.precio_total ||
                        0
                    )
                ),
            0
        );

    if (
        !reservasOrganizadorCargadas
    ) {
        return `
            <div class="publicacion-reservas-panel__cargando">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Cargando reservas...
            </div>
        `;
    }

    if (
        reservas.length ===
        0
    ) {
        return `
            <div class="publicacion-reservas-panel__vacio">
                <span>
                    <i class="fa-regular fa-calendar-check"></i>
                </span>

                <div>
                    <strong>Todavía no hay reservas</strong>
                    <p>
                        Cuando alguien reserve este plan aparecerá aquí.
                    </p>
                </div>
            </div>
        `;
    }

    const grupos =
        agruparReservasOrganizadorPorPase(
            plan
        );

    return `
        <div class="publicacion-reservas-panel__resumen">
            <div>
                <span>Reservas activas</span>
                <strong>${confirmadas.length}</strong>
            </div>

            <div>
                <span>Personas</span>
                <strong>${totalPersonas}</strong>
            </div>

            <div>
                <span>Total reservado</span>
                <strong>${formatearPrecioReservasOrganizador(ingresos)}</strong>
            </div>
        </div>

        <div class="publicacion-reservas-panel__pases">
            ${grupos
                .map(
                    (
                        grupo
                    ) => {
                        const activas =
                            grupo.reservas.filter(
                                (
                                    reserva
                                ) =>
                                    reserva.estado ===
                                    "confirmada"
                            );

                        const personasPase =
                            activas.reduce(
                                (
                                    total,
                                    reserva
                                ) =>
                                    total +
                                    Math.max(
                                        0,
                                        Number(
                                            reserva.personas ||
                                            0
                                        )
                                    ),
                                0
                            );

                        const plazasTotales =
                            obtenerPlazasTotalesPaseOrganizador(
                                plan,
                                grupo.fecha,
                                grupo.hora
                            );

                        const plazasDisponibles =
                            plazasTotales ===
                                null
                                ? null
                                : Math.max(
                                    0,
                                    plazasTotales -
                                    personasPase
                                );

                        return `
                            <section class="reservas-pase-organizador">

                                <div class="reservas-pase-organizador__cabecera">
                                    <div>
                                        <strong>
                                            ${escaparHTML(
                                                formatearFechaReservaOrganizador(
                                                    grupo.fecha
                                                )
                                            )}
                                        </strong>

                                        <span>
                                            <i class="fa-regular fa-clock"></i>
                                            ${escaparHTML(
                                                grupo.hora ||
                                                "Hora pendiente"
                                            )}
                                        </span>
                                    </div>

                                    <span class="reservas-pase-organizador__aforo ${
                                        plazasDisponibles === 0
                                            ? "reservas-pase-organizador__aforo--agotado"
                                            : ""
                                    }">
                                        ${
                                            plazasTotales ===
                                                null
                                                ? `${personasPase} reservadas`
                                                : `${personasPase}/${plazasTotales} plazas`
                                        }
                                    </span>
                                </div>

                                ${
                                    plazasDisponibles !==
                                        null
                                        ? `
                                            <div class="reservas-pase-organizador__barra">
                                                <span
                                                    style="width: ${Math.min(
                                                        100,
                                                        plazasTotales > 0
                                                            ? (
                                                                personasPase /
                                                                plazasTotales
                                                            ) * 100
                                                            : 0
                                                    )}%"
                                                ></span>
                                            </div>

                                            <p class="reservas-pase-organizador__disponibles">
                                                ${
                                                    plazasDisponibles === 0
                                                        ? "Pase agotado"
                                                        : `${plazasDisponibles} ${
                                                            plazasDisponibles === 1
                                                                ? "plaza disponible"
                                                                : "plazas disponibles"
                                                        }`
                                                }
                                            </p>
                                        `
                                        : ""
                                }

                                <div class="reservas-pase-organizador__lista">
                                    ${grupo.reservas
                                        .map(
                                            crearReservaOrganizadorHTML
                                        )
                                        .join("")}
                                </div>

                            </section>
                        `;
                    }
                )
                .join("")}
        </div>
    `;
}


async function cargarReservasOrganizadorPerfil(
    repintar = true
) {
    const cliente =
        window.clienteSupabase;

    reservasOrganizadorCargadas =
        false;

    if (!cliente?.auth) {
        reservasOrganizadorPerfil =
            [];

        if (repintar) {
            mostrarPublicaciones();
        }

        return;
    }

    try {
        const {
            data,
            error
        } = await cliente.rpc(
            "obtener_reservas_organizador"
        );

        if (error) {
            throw error;
        }

        reservasOrganizadorPerfil =
            Array.isArray(data)
                ? data
                : [];

        reservasOrganizadorCargadas =
            true;
    } catch (error) {
        console.error(
            "No se pudieron cargar las reservas de tus planes:",
            error
        );

        reservasOrganizadorPerfil =
            [];

        reservasOrganizadorCargadas =
            true;

        if (repintar) {
            mostrarNotificacion(
                "No se han podido cargar las reservas de tus planes."
            );
        }
    }

    if (repintar) {
        mostrarPublicaciones();
    }
}


function activarBotonesReservasOrganizador() {
    document
        .querySelectorAll(
            "[data-ver-reservas-plan]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const planId =
                            String(
                                boton.dataset
                                    .verReservasPlan ||
                                ""
                            );

                        if (!planId) {
                            return;
                        }

                        if (
                            String(
                                planReservasOrganizadorAbierto ||
                                ""
                            ) ===
                            planId
                        ) {
                            planReservasOrganizadorAbierto =
                                null;

                            mostrarPublicaciones();

                            return;
                        }

                        planReservasOrganizadorAbierto =
                            planId;

                        mostrarPublicaciones();

                        await cargarReservasOrganizadorPerfil(
                            true
                        );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            "[data-cancelar-reserva-organizador]"
        )
        .forEach(
            (
                boton
            ) => {
                boton.addEventListener(
                    "click",
                    () => {
                        reservaPendienteCancelar =
                            String(
                                boton.dataset
                                    .cancelarReservaOrganizador ||
                                ""
                            );

                        if (!reservaPendienteCancelar) {
                            return;
                        }

                        tipoCancelacionReservaPendiente =
                            "organizador";

                        elementoQueAbrioModalCancelacion =
                            abrirModalAccesible(
                                modalCancelacion,
                                mantenerReserva,
                                boton
                            );
                    }
                );
            }
        );
}


async function cargarPlanesSupabaseUsuario() {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        planesSupabaseUsuario =
            [];

        mostrarPublicaciones();

        return;
    }

    try {
        const usuario =
            await obtenerUsuarioPerfilSocial();

        if (!usuario) {
            planesSupabaseUsuario =
                [];

            mostrarPublicaciones();

            return;
        }

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
                    descripcion,
                    fecha,
                    hora,
                    fechas,
                    duracion,
                    plazas,
                    ubicacion,
                    precio,
                    dificultad,
                    provincia,
                    imagen_url,
                    ruta_storage,
                    estado,
                    motivo_rechazo,
                    creado_en,
                    actualizado_en
                `
            )
            .eq(
                "usuario_id",
                usuario.id
            )
            .order(
                "creado_en",
                {
                    ascending:
                        false
                }
            );

        if (error) {
            throw error;
        }

        planesSupabaseUsuario =
            (
                Array.isArray(data)
                    ? data
                    : []
            ).map(
                normalizarPlanSupabase
            );

        limpiarPublicacionesLocalesEliminadas(
            planesSupabaseUsuario
        );

        await cargarReservasOrganizadorPerfil(
            false
        );

        mostrarPublicaciones();
    } catch (error) {
        console.error(
            "No se pudieron cargar los planes publicados:",
            error
        );

        planesSupabaseUsuario =
            [];

        mostrarPublicaciones();

        mostrarNotificacion(
            error?.message ||
            "No se han podido cargar tus publicaciones."
        );
    }
}


function formatearFechaPlan(fecha) {
    if (!fecha) {
        return "Fecha pendiente";
    }

    const fechaPlan =
        new Date(
            `${fecha}T00:00:00`
        );

    if (
        Number.isNaN(
            fechaPlan.getTime()
        )
    ) {
        return fecha;
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
        fechaPlan
    );
}


function obtenerTextoEstado(
    estado
) {
    const estados = {
        pendiente:
            "Pendiente de revisión",

        borrador:
            "Borrador",

        publicado:
            "Publicado",

        rechazado:
            "Rechazado"
    };

    return estados[estado] ||
        estado;
}


function crearPublicacionHTML(
    plan
) {
    const precio =
        Number(plan.precio) === 0
            ? "Gratis"
            : `${Number(plan.precio)
                .toFixed(2)
                .replace(".00", "")
                .replace(".", ",")} €`;

    const titulo =
        escaparHTML(
            plan.titulo ||
            "Plan sin título"
        );

    const descripcion =
        escaparHTML(
            plan.descripcion ||
            "Este borrador todavía no tiene descripción."
        );

    const ubicacion =
        escaparHTML(
            plan.ubicacion ||
            "Ubicación pendiente"
        );

    const hora =
        escaparHTML(
            plan.hora ||
            "Hora pendiente"
        );

    const categoria =
        escaparHTML(
            plan.nombreCategoria ||
            plan.categoria ||
            "Sin categoría"
        );

    const estado =
        escaparHTML(
            plan.estado ||
            "pendiente"
        );

    const idPlan =
        escaparHTML(
            plan.id ||
            ""
        );

    const almacenamiento =
        escaparHTML(
            plan.almacenamiento ||
            ""
        );

    const imagen =
        escaparHTML(
            plan.imagen ||
            ""
        );

    const motivoRechazo =
        escaparHTML(
            plan.motivoRechazo ||
            ""
        );

    const imagenPlan =
        imagen
            ? `
                <img
                    src="${imagen}"
                    alt="${titulo}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='img/placeholder-plan.jpg';
                    "
                >
            `
            : `
                <div class="publicacion-item__sin-imagen">
                    <i class="fa-regular fa-image"></i>
                </div>
            `;

    return `
        <article
            class="publicacion-item"
            data-plan-id="${idPlan}"
            data-plan-estado="${estado}"
        >

            <div class="publicacion-item__imagen">
                ${imagenPlan}
            </div>

            <div class="publicacion-item__contenido">

                <div class="publicacion-item__superior">

                    <div>
                        <span
                            class="estado-publicacion estado-publicacion--${estado}"
                        >
                            ${obtenerTextoEstado(plan.estado)}
                        </span>

                        <h3>${titulo}</h3>
                    </div>

                    <strong>${precio}</strong>

                </div>

                <p class="publicacion-item__descripcion">
                    ${descripcion}
                </p>

                ${
                    plan.estado === "rechazado"
                        ? `
                            <div class="publicacion-item__rechazo">
                                <strong>
                                    <i class="fa-solid fa-circle-exclamation"></i>
                                    Motivo del rechazo
                                </strong>

                                <p>
                                    ${
                                        motivoRechazo ||
                                        "No se ha indicado un motivo."
                                    }
                                </p>
                            </div>
                        `
                        : ""
                }

                <div class="publicacion-item__datos">

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatearFechaPlan(plan.fecha)}
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
                        <i class="fa-solid fa-user-group"></i>
                        ${Number(plan.plazas || 0)} plazas
                    </span>

                </div>

                <div class="publicacion-item__pie">

                    <span class="publicacion-item__categoria">
                        ${categoria}
                    </span>

                    <div class="publicacion-item__acciones">

                        ${
                            plan.estado === "borrador"
                                ? `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-editar-plan"
                                        data-plan-id="${idPlan}"
                                    >
                                        <i class="fa-regular fa-pen-to-square"></i>
                                        Continuar
                                    </button>
                                `
                                : `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-ver-plan"
                                        data-plan-id="${idPlan}"
                                    >
                                        <i class="fa-regular fa-eye"></i>
                                        Ver
                                    </button>
                                `
                        }

                        ${
                            plan.estado === "publicado"
                                ? `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-reservas-plan"
                                        data-ver-reservas-plan="${idPlan}"
                                        aria-expanded="${
                                            String(
                                                planReservasOrganizadorAbierto
                                            ) ===
                                            String(plan.id)
                                                ? "true"
                                                : "false"
                                        }"
                                    >
                                        <i class="fa-regular fa-calendar-check"></i>
                                        Ver reservas
                                        <span class="boton-reservas-plan__contador">
                                            ${
                                                obtenerReservasOrganizadorPlan(
                                                    plan.id
                                                ).filter(
                                                    reserva =>
                                                        reserva.estado ===
                                                        "confirmada"
                                                ).length
                                            }
                                        </span>
                                    </button>
                                `
                                : ""
                        }

                        ${
                            plan.estado !== "publicado"
                                ? `
                                    <button
                                        type="button"
                                        class="boton-publicacion boton-publicacion--eliminar boton-eliminar-plan"
                                        data-plan-id="${idPlan}"
                                        data-almacenamiento="${almacenamiento}"
                                    >
                                        <i class="fa-regular fa-trash-can"></i>
                                        Eliminar
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </div>

                ${
                    plan.estado === "publicado" &&
                    String(
                        planReservasOrganizadorAbierto ||
                        ""
                    ) ===
                    String(plan.id)
                        ? `
                            <div
                                class="publicacion-reservas-panel"
                                data-panel-reservas-plan="${idPlan}"
                            >
                                ${crearPanelReservasOrganizadorHTML(plan)}
                            </div>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}


function actualizarContadoresPublicaciones(
    planes
) {
    if (contadorPublicaciones) {
        contadorPublicaciones.textContent =
            planes.length;
    }

    if (contadorPendientes) {
        contadorPendientes.textContent =
            planes.filter(
                (plan) =>
                    plan.estado ===
                    "pendiente"
            ).length;
    }

    if (contadorBorradores) {
        contadorBorradores.textContent =
            planes.filter(
                (plan) =>
                    plan.estado ===
                    "borrador"
            ).length;
    }
}


function mostrarPublicaciones() {
    if (
        !listaPublicaciones ||
        !estadoVacioPublicaciones
    ) {
        return;
    }

    const todosLosPlanes =
        obtenerPlanesUsuario();

    actualizarContadoresPublicaciones(
        todosLosPlanes
    );

    const planesFiltrados =
        todosLosPlanes.filter(
            (plan) => {
                if (
                    filtroPublicacionActual ===
                    "todos"
                ) {
                    return true;
                }

                return (
                    plan.estado ===
                    filtroPublicacionActual
                );
            }
        );

    listaPublicaciones.innerHTML =
        planesFiltrados
            .map(
                crearPublicacionHTML
            )
            .join("");

    const noHayPlanesTotales =
        todosLosPlanes.length ===
        0;

    const noHayResultados =
        planesFiltrados.length ===
        0;

    estadoVacioPublicaciones.classList.toggle(
        "oculto",
        !noHayPlanesTotales
    );

    listaPublicaciones.classList.toggle(
        "oculta",
        noHayPlanesTotales
    );

    if (
        !noHayPlanesTotales &&
        noHayResultados
    ) {
        listaPublicaciones.innerHTML = `
            <div class="estado-vacio">
                <span class="estado-vacio__icono">
                    <i class="fa-solid fa-filter"></i>
                </span>

                <h3>
                    No hay planes en esta categoría
                </h3>

                <p>
                    Cambia el filtro para consultar otras publicaciones.
                </p>
            </div>
        `;
    }

    activarEventosPublicaciones();
}


function activarEventosPublicaciones() {
    document
        .querySelectorAll(
            ".boton-eliminar-plan"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        planPendienteEliminar = {
                            id:
                                boton.dataset
                                    .planId,

                            almacenamiento:
                                boton.dataset
                                    .almacenamiento
                        };

                        elementoQueAbrioModalEliminar =
                            abrirModalAccesible(
                                modalEliminarPlan,
                                cancelarEliminarPlan,
                                boton
                            );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            ".boton-editar-plan"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        const idPlan =
                            Number(
                                boton.dataset
                                    .planId
                            );

                        localStorage.setItem(
                            "borradorEditarSuralia",
                            String(
                                idPlan
                            )
                        );

                        window.location.href =
                            "publicar-plan.html";
                    }
                );
            }
        );

    document
        .querySelectorAll(
            ".boton-ver-plan"
        )
        .forEach(
            (boton) => {
                boton.addEventListener(
                    "click",
                    () => {
                        const planId =
                            String(
                                boton.dataset
                                    .planId ||
                                ""
                            );

                        if (
                            esIdUuidPerfil(
                                planId
                            )
                        ) {
                            window.location.href =
                                `detalle-plan.html?id=${encodeURIComponent(
                                    planId
                                )}`;

                            return;
                        }

                        mostrarNotificacion(
                            "La vista individual de este plan se añadirá más adelante."
                        );
                    }
                );
            }
        );

    activarBotonesReservasOrganizador();
}


async function eliminarPlanSupabase(
    planId
) {
    const cliente =
        window.clienteSupabase;

    if (!cliente) {
        throw new Error(
            "No se ha podido conectar con Supabase."
        );
    }

    const plan =
        planesSupabaseUsuario.find(
            (elemento) =>
                String(elemento.id) ===
                String(planId)
        );

    if (!plan) {
        throw new Error(
            "No se ha encontrado el plan."
        );
    }

    const {
        data,
        error
    } = await cliente
        .from(
            "planes"
        )
        .delete()
        .eq(
            "id",
            planId
        )
        .in(
            "estado",
            [
                "pendiente",
                "rechazado"
            ]
        )
        .select(
            "id"
        )
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(
            "El plan ya no puede eliminarse."
        );
    }

    if (plan.rutaStorage) {
        const {
            error: errorStorage
        } = await cliente
            .storage
            .from(
                BUCKET_IMAGENES_PLANES
            )
            .remove(
                [
                    plan.rutaStorage
                ]
            );

        if (errorStorage) {
            console.error(
                "El plan se eliminó, pero su imagen no pudo borrarse:",
                errorStorage
            );
        }
    }

    planesSupabaseUsuario =
        planesSupabaseUsuario.filter(
            (elemento) =>
                String(elemento.id) !==
                String(planId)
        );
}


function eliminarBorradorLocal(
    planId
) {
    const borradores =
        leerDatoLocal(
            "borradoresSuralia",
            []
        );

    const borradoresActualizados =
        (
            Array.isArray(borradores)
                ? borradores
                : []
        ).filter(
            (plan) =>
                Number(plan.id) !==
                Number(planId)
        );

    guardarDatoLocal(
        "borradoresSuralia",
        borradoresActualizados
    );
}


async function eliminarPlanGuardado() {
    if (!planPendienteEliminar) {
        return;
    }

    if (confirmarEliminarPlan) {
        confirmarEliminarPlan.disabled =
            true;

        confirmarEliminarPlan.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Eliminando
        `;
    }

    try {
        if (
            planPendienteEliminar
                .almacenamiento ===
            "supabase"
        ) {
            await eliminarPlanSupabase(
                planPendienteEliminar.id
            );
        } else {
            eliminarBorradorLocal(
                planPendienteEliminar.id
            );
        }

        cerrarModalAccesible(
            modalEliminarPlan,
            elementoQueAbrioModalEliminar
        );

        elementoQueAbrioModalEliminar =
            null;

        planPendienteEliminar =
            null;

        mostrarPublicaciones();

        mostrarNotificacion(
            "El plan se ha eliminado correctamente."
        );
    } catch (error) {
        console.error(
            "No se pudo eliminar el plan:",
            error
        );

        mostrarNotificacion(
            error?.message ||
            "No se ha podido eliminar el plan."
        );
    } finally {
        if (confirmarEliminarPlan) {
            confirmarEliminarPlan.disabled =
                false;

            confirmarEliminarPlan.innerHTML =
                "Eliminar plan";
        }
    }
}


filtrosPublicaciones.forEach(
    (boton) => {
        boton.addEventListener(
            "click",
            () => {
                filtroPublicacionActual =
                    boton.dataset
                        .filtroPublicacion;

                filtrosPublicaciones.forEach(
                    (filtro) => {
                        const esActivo =
                            filtro ===
                            boton;

                        filtro.classList.toggle(
                            "activo",
                            esActivo
                        );

                        filtro.setAttribute(
                            "aria-pressed",
                            String(
                                esActivo
                            )
                        );
                    }
                );

                mostrarPublicaciones();
            }
        );
    }
);


if (cancelarEliminarPlan) {
    cancelarEliminarPlan.addEventListener(
        "click",
        () => {
            cerrarModalAccesible(
                modalEliminarPlan,
                elementoQueAbrioModalEliminar
            );

            elementoQueAbrioModalEliminar =
                null;

            planPendienteEliminar =
                null;
        }
    );
}


if (confirmarEliminarPlan) {
    confirmarEliminarPlan.addEventListener(
        "click",
        eliminarPlanGuardado
    );
}


if (modalEliminarPlan) {
    modalEliminarPlan.addEventListener(
        "click",
        (evento) => {
            if (
                evento.target ===
                modalEliminarPlan
            ) {
                cerrarModalAccesible(
                    modalEliminarPlan,
                    elementoQueAbrioModalEliminar
                );

                elementoQueAbrioModalEliminar =
                    null;

                planPendienteEliminar =
                    null;
            }
        }
    );
}


document.addEventListener(
    "keydown",
    (evento) => {
        mantenerFocoDentroModal(
            evento,
            modalCancelacion
        );

        mantenerFocoDentroModal(
            evento,
            modalEliminarPlan
        );

        mantenerFocoDentroModal(
            evento,
            modalEliminarConexion
        );

        if (evento.key !== "Escape") {
            return;
        }

        if (
            modalCancelacion?.classList.contains(
                "visible"
            )
        ) {
            reservaPendienteCancelar =
                null;

            tipoCancelacionReservaPendiente =
                "usuario";

            cerrarModalAccesible(
                modalCancelacion,
                elementoQueAbrioModalCancelacion
            );

            elementoQueAbrioModalCancelacion =
                null;

            return;
        }

        if (
            modalEliminarPlan?.classList.contains(
                "visible"
            )
        ) {
            planPendienteEliminar =
                null;

            cerrarModalAccesible(
                modalEliminarPlan,
                elementoQueAbrioModalEliminar
            );

            elementoQueAbrioModalEliminar =
                null;

            return;
        }

        if (
            modalEliminarConexion?.classList.contains(
                "visible"
            )
        ) {
            cerrarConfirmacionEliminarConexion();
        }
    }
);



/* =========================================
   SINCRONIZAR PUBLICACIONES AL VOLVER
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            cargarPlanesSupabaseUsuario();
            cargarReservasPerfil();
            sincronizarFavoritosDinamicosEliminados();
            cargarAfinidadesPerfil();
        }
    }
);


/* =========================================
   CARGA INICIAL
========================================= */

function iniciarPerfil() {
    if (
        typeof window.obtenerTodosPlanesSuralia !==
        "function"
    ) {
        console.warn(
            "No se ha cargado js/datos-planes.js. El perfil usará únicamente los datos guardados."
        );
    }

    cargarDatosUsuario();
    cargarPerfilSocial();
    cargarGaleriaPerfil();
    cargarEstadoVerificacion();
    cargarReservasPerfil();
    mostrarFavoritosPerfil();
    sincronizarFavoritosDinamicosEliminados();
    cargarAfinidadesPerfil();
    cargarConexionesPerfil();
    cargarMensajesPendientes();
    suscribirseANotificacionesMensajes();
    mostrarPublicaciones();
    cargarPlanesSupabaseUsuario();
    cargarSeccionDesdeURL();
}

if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarPerfil
    );
} else {
    iniciarPerfil();
}