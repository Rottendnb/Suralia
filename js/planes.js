const filtroTexto = document.querySelector("#filtro-texto");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroPrecio = document.querySelector("#filtro-precio");
const filtroOrden = document.querySelector("#filtro-orden");

const botonLimpiar = document.querySelector("#boton-limpiar");
const botonRestablecer = document.querySelector("#boton-restablecer");

const listaPlanes = document.querySelector("#lista-planes");
const planes = Array.from(
    document.querySelectorAll("#lista-planes .tarjeta-plan")
);

const numeroResultados = document.querySelector("#numero-resultados");
const sinResultados = document.querySelector("#sin-resultados");

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function cumpleFiltroPrecio(precio, filtro) {
    if (filtro === "gratis") {
        return precio === 0;
    }

    if (filtro === "menos-20") {
        return precio > 0 && precio < 20;
    }

    if (filtro === "mas-20") {
        return precio >= 20;
    }

    return true;
}

function ordenarPlanes(planesVisibles) {
    const orden = filtroOrden.value;

    return planesVisibles.sort((planA, planB) => {
        const precioA = Number(planA.dataset.precio);
        const precioB = Number(planB.dataset.precio);

        const valoracionA = Number(planA.dataset.valoracion);
        const valoracionB = Number(planB.dataset.valoracion);

        if (orden === "precio-menor") {
            return precioA - precioB;
        }

        if (orden === "precio-mayor") {
            return precioB - precioA;
        }

        if (orden === "valoracion") {
            return valoracionB - valoracionA;
        }

        return 0;
    });
}

function aplicarFiltros() {
    const textoBuscado = normalizarTexto(filtroTexto.value.trim());
    const categoriaSeleccionada = filtroCategoria.value;
    const precioSeleccionado = filtroPrecio.value;

    let planesVisibles = planes.filter((plan) => {
        const nombre = normalizarTexto(plan.dataset.nombre);
        const categoria = plan.dataset.categoria;
        const precio = Number(plan.dataset.precio);

        const coincideTexto =
            !textoBuscado || nombre.includes(textoBuscado);

        const coincideCategoria =
            categoriaSeleccionada === "todas" ||
            categoria === categoriaSeleccionada;

        const coincidePrecio =
            cumpleFiltroPrecio(precio, precioSeleccionado);

        return (
            coincideTexto &&
            coincideCategoria &&
            coincidePrecio
        );
    });

    planes.forEach((plan) => {
        plan.style.display = "none";
    });

    planesVisibles = ordenarPlanes(planesVisibles);

    planesVisibles.forEach((plan) => {
        plan.style.display = "block";
        listaPlanes.appendChild(plan);
    });

    numeroResultados.textContent = planesVisibles.length;

    sinResultados.classList.toggle(
        "visible",
        planesVisibles.length === 0
    );
}

function limpiarFiltros() {
    filtroTexto.value = "";
    filtroCategoria.value = "todas";
    filtroPrecio.value = "todos";
    filtroOrden.value = "recomendados";

    aplicarFiltros();
}

filtroTexto.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
filtroPrecio.addEventListener("change", aplicarFiltros);
filtroOrden.addEventListener("change", aplicarFiltros);

botonLimpiar.addEventListener("click", limpiarFiltros);
botonRestablecer.addEventListener("click", limpiarFiltros);

document
    .querySelectorAll(".tarjeta-plan__favorito")
    .forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            const icono = boton.querySelector("i");
            const guardado = icono.classList.contains("fa-solid");

            icono.classList.toggle("fa-solid", !guardado);
            icono.classList.toggle("fa-regular", guardado);

            boton.classList.toggle("favorito-activo", !guardado);
        });
    });

aplicarFiltros();

