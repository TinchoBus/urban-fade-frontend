import api from './api';


// =====================================
// GUARDAR O CAMBIAR FAVORITO
// =====================================

export const guardarFavorito = async (
    peluqueroId
) => {

    const respuesta = await api.post(
        '/favoritos',
        {
            peluqueroId
        }
    );

    return respuesta.data;

};


// =====================================
// OBTENER FAVORITO DEL CLIENTE
// =====================================

export const obtenerFavorito = async () => {

    const respuesta = await api.get(
        '/favoritos'
    );

    return respuesta.data;

};


// =====================================
// ELIMINAR FAVORITO
// =====================================

export const eliminarFavorito = async () => {

    const respuesta = await api.delete(
        '/favoritos'
    );

    return respuesta.data;

};