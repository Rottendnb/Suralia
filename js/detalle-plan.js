const botonFavoritoDetalle = document.querySelector(
    "#boton-favorito-detalle"
);

const botonCompartir = document.querySelector("#boton-compartir");

const botonLeerMas = document.querySelector("#boton-leer-mas");

const descripcionAmpliada = document.querySelector(
    "#descripcion-ampliada"
);

const formularioReserva = document.querySelector(
    "#formulario-reserva"
);

const notificacion = document.querySelector("#notificacion");

const botonesGaleria = document.querySelectorAll(
    ".galeria-plan button[data-imagen]"
);

const modalImagen = document.querySelector("#modal-imagen");
const imagenModal = document.querySelector("#imagen-modal");

const cerrarModalImagen = document.querySelector(
    "#cerrar-modal-imagen"
);

let temporizadorNotificacion;

function mostrarNotificacion(mensaje) {
    const textoNotificacion = notificacion.querySelector("span");

    textoNotificacion.textContent = mensaje;

    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);

    temporizadorNotificacion = setTimeout(() => {
        notificacion.classList.remove("visible");
    }, 3000);
}

botonFavoritoDetalle.addEventListener("click", () => {
    const icono = botonFavoritoDetalle.querySelector("i");

    const estaGuardado = icono.classList.contains("fa-solid");

    icono.classList.toggle("fa-solid", !estaGuardado);
    icono.classList.toggle("fa-regular", estaGuardado);

    botonFavoritoDetalle.classList.toggle(
        "favorito-activo",
        !estaGuardado
    );

    botonFavoritoDetalle.lastChild.textContent =
        estaGuardado
            ? " Guardar"
            : " Guardado";

    mostrarNotificacion(
        estaGuardado
            ? "El plan se ha eliminado de favoritos."
            : "El plan se ha guardado en favoritos."
    );
});

botonCompartir.addEventListener("click", async () => {
    const datosCompartir = {
        title: "Visita guiada por Itálica | Suralia",
        text: "Descubre esta experiencia en Suralia.",
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(datosCompartir);
            return;
        }

        await navigator.clipboard.writeText(window.location.href);

        mostrarNotificacion(
            "El enlace se ha copiado al portapapeles."
        );
    } catch (error) {
        console.error("No se pudo compartir:", error);
    }
});

botonLeerMas.addEventListener("click", () => {
    const estaVisible =
        descripcionAmpliada.classList.toggle("visible");

    botonLeerMas.innerHTML = estaVisible
        ? 'Mostrar menos <i class="fa-solid fa-chevron-up"></i>'
        : 'Leer descripción completa <i class="fa-solid fa-chevron-down"></i>';
});

formularioReserva.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const fecha = document.querySelector("#fecha-reserva");
    const personas = document.querySelector("#personas-reserva");

    const textoFecha =
        fecha.options[fecha.selectedIndex].text;

    const numeroPersonas = Number(personas.value);

    mostrarNotificacion(
        `Reserva simulada para ${numeroPersonas} ${
            numeroPersonas === 1 ? "persona" : "personas"
        } el ${textoFecha}.`
    );
});

botonesGaleria.forEach((boton) => {
    boton.addEventListener("click", () => {
        const imagen = boton.dataset.imagen;

        imagenModal.src = imagen;
        modalImagen.classList.add("visible");

        document.body.style.overflow = "hidden";
    });
});

function cerrarModal() {
    modalImagen.classList.remove("visible");
    imagenModal.src = "";

    document.body.style.overflow = "";
}

cerrarModalImagen.addEventListener("click", cerrarModal);

modalImagen.addEventListener("click", (evento) => {
    if (evento.target === modalImagen) {
        cerrarModal();
    }
});

document.addEventListener("keydown", (evento) => {
    if (
        evento.key === "Escape" &&
        modalImagen.classList.contains("visible")
    ) {
        cerrarModal();
    }
});

if (typeof L !== "undefined") {
    const mapa = L.map("mapa-plan", {
        scrollWheelZoom: false
    }).setView([37.4431, -6.0448], 15);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    L.marker([37.4431, -6.0448])
        .addTo(mapa)
        .bindPopup(
            "<strong>Conjunto Arqueológico de Itálica</strong><br>Santiponce, Sevilla"
        )
        .openPopup();
}