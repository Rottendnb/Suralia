const botonMenu = document.querySelector("#boton-menu");
const navegacion = document.querySelector("#navegacion");
const formularioBuscador = document.querySelector("#formulario-buscador");

const botonesFavorito = document.querySelectorAll(
    ".boton-favorito, .tarjeta-plan__favorito"
);

if (botonMenu && navegacion) {
    botonMenu.addEventListener("click", () => {
        const menuAbierto = navegacion.classList.toggle("activa");

        botonMenu.setAttribute("aria-expanded", menuAbierto);

        botonMenu.innerHTML = menuAbierto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navegacion.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            navegacion.classList.remove("activa");

            botonMenu.setAttribute("aria-expanded", "false");

            botonMenu.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        });
    });
}

if (formularioBuscador) {
    formularioBuscador.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const busqueda = document
            .querySelector("#busqueda")
            .value
            .trim();

        const fecha = document
            .querySelector("#fecha")
            .value;

        if (!busqueda && !fecha) {
            alert("Escribe una búsqueda o selecciona una fecha.");
            return;
        }

        console.log({
            busqueda,
            fecha
        });

        alert(
            `Buscando planes de "${busqueda || "cualquier categoría"}"` +
            `${fecha ? ` para el día ${fecha}` : ""}.`
        );
    });
}

botonesFavorito.forEach((boton) => {
    boton.addEventListener("click", () => {
        const icono = boton.querySelector("i");

        const estaGuardado =
            icono.classList.contains("fa-solid");

        icono.classList.toggle("fa-solid", !estaGuardado);
        icono.classList.toggle("fa-regular", estaGuardado);

        boton.classList.toggle("favorito-activo", !estaGuardado);

        boton.setAttribute(
            "aria-label",
            estaGuardado
                ? "Añadir a favoritos"
                : "Eliminar de favoritos"
        );
    });
});

/* Importante: como dentro tienes un botón de favorito, puede pasar que al pulsarlo también abra detalle-plan.html. 
Para evitarlo, añade esto en tu JavaScript: */


botonesFavorito.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        const icono = boton.querySelector("i");
        const estaGuardado = icono.classList.contains("fa-solid");

        icono.classList.toggle("fa-solid", !estaGuardado);
        icono.classList.toggle("fa-regular", estaGuardado);

        boton.classList.toggle("favorito-activo", !estaGuardado);

        boton.setAttribute(
            "aria-label",
            estaGuardado
                ? "Añadir a favoritos"
                : "Eliminar de favoritos"
        );
    });
});


// mostrar el usuario conectado en la cabecera



const sesionActual = JSON.parse(
    localStorage.getItem("sesionSuralia")
);

const botonLogin = document.querySelector(".boton-login");
const loginMovil = document.querySelector(".login-movil");

if (sesionActual?.conectado) {
    if (botonLogin) {
        botonLogin.href = "perfil.html";
        botonLogin.innerHTML = `
            <i class="fa-regular fa-user"></i>
            ${sesionActual.nombre}
        `;
    }

    if (loginMovil) {
        loginMovil.href = "perfil.html";
        loginMovil.innerHTML = `
            <i class="fa-regular fa-user"></i>
            Mi perfil
        `;
    }
}