/* =====================================================
   CATÁLOGO DE PLANES FIJOS DE SURALIA
===================================================== */

/*
    Los planes actuales ya se cargan desde Supabase.

    Este objeto se mantiene vacío únicamente para conservar
    compatibilidad con las páginas y funciones que todavía
    consultan window.obtenerPlanSuralia().
*/

window.PLANES_SURALIA = {};


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