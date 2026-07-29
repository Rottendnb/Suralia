/* =====================================================
   CATÁLOGO ÚNICO DE PLANES DE SURALIA
===================================================== */

window.PLANES_SURALIA = {
    italica: {
        planId: "italica",
        titulo: "Visita guiada por Itálica",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.8,
        fechaTexto: "25 de julio",
        fechaIso: "2026-07-25",
        hora: "10:30",
        ubicacion: "Santiponce, Sevilla",
        imagen: "img/italica principal.jpg",
        enlace: "detalle-plan.html?id=italica"
    },

    "kayak-atardecer": {
        planId: "kayak-atardecer",
        titulo: "Kayak al atardecer",
        categoria: "aventura",
        categoriaTexto: "Aventura",
        precio: 18,
        valoracion: 4.9,
        fechaTexto: "27 de julio",
        fechaIso: "2026-07-27",
        hora: "19:00",
        ubicacion: "Río Guadalquivir, Sevilla",
        imagen: "img/kayak principal.jpg",
        enlace: "detalle-kayak.html"
    },

    "poncho-k-cartuja": {
        planId: "poncho-k-cartuja",
        titulo: "PONCHO K - Cartuja Center CITE",
        categoria: "musica",
        categoriaTexto: "Música",
        precio: 25,
        valoracion: 4.8,
        fechaTexto: "21 de noviembre de 2026",
        fechaIso: "2026-11-21",
        hora: "21:00",
        ubicacion: "Cartuja Center CITE, Sevilla",
        imagen: "img/poncho-k.jpg",
        enlace: "detalle-poncho-k.html"
    },

    "cerro-hierro": {
        planId: "cerro-hierro",
        titulo: "Ruta por el Cerro del Hierro",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 8,
        valoracion: 4.9,
        fechaTexto: "2 de agosto",
        fechaIso: "2026-08-02",
        hora: "09:00",
        ubicacion: "San Nicolás del Puerto",
        imagen: "img/cerro1.jpg",
        enlace: "detalle-plan.html?id=cerro-hierro"
    },

    "tapas-triana": {
        planId: "tapas-triana",
        titulo: "Ruta de tapas por Triana",
        categoria: "gastronomia",
        categoriaTexto: "Gastronomía",
        precio: 25,
        valoracion: 4.6,
        fechaTexto: "3 de agosto",
        fechaIso: "2026-08-03",
        hora: "13:00",
        ubicacion: "Triana, Sevilla",
        imagen: "img/triana1.jpg",
        enlace: "detalle-plan.html?id=tapas-triana"
    },

    "exposicion-contemporanea": {
        planId: "exposicion-contemporanea",
        titulo: "Exposición de arte contemporáneo",
        categoria: "cultura",
        categoriaTexto: "Cultura",
        precio: 0,
        valoracion: 4.5,
        fechaTexto: "Hasta el 10 de agosto",
        fechaIso: "2026-08-10",
        hora: "11:00",
        ubicacion: "Centro de Sevilla",
        imagen: "img/andaluz1.jpg",
        enlace: "detalle-plan.html?id=exposicion-contemporanea"
    },

    "sierra-norte": {
        planId: "sierra-norte",
        titulo: "Ruta de senderismo por la Sierra Norte",
        categoria: "naturaleza",
        categoriaTexto: "Naturaleza",
        precio: 12,
        valoracion: 4.9,
        fechaTexto: "8 de agosto de 2026",
        fechaIso: "2026-08-08",
        hora: "09:00",
        ubicacion: "Constantina, Sevilla",
        imagen: "img/sierra-norte-principal.jpg",
        enlace: "detalle-sierra-norte.html"
    }
};


/* =====================================================
   FUNCIONES PARA CONSULTAR EL CATÁLOGO
===================================================== */

window.obtenerPlanSuralia = function obtenerPlanSuralia(
    planId
) {
    if (!planId) {
        return null;
    }

    return (
        window.PLANES_SURALIA[planId] ||
        null
    );
};


window.obtenerTodosPlanesSuralia =
    function obtenerTodosPlanesSuralia() {
        return Object.values(
            window.PLANES_SURALIA
        );
    };
