import api from './api';


// ==============================
// OBTENER TODOS LOS USUARIOS
// ==============================

export const obtenerUsuarios = async () => {

    const respuesta = await api.get(
        '/usuarios'
    );

    return respuesta.data;

};


// ==============================
// OBTENER SOLO PELUQUEROS
// ==============================

export const obtenerPeluqueros = async () => {

    const usuarios =
        await obtenerUsuarios();

    return usuarios.filter(

        usuario =>
            usuario.rol === 'peluquero'

    );

};


// ==============================
// OBTENER MI PERFIL
// ==============================

export const obtenerPerfil = async () => {

    const respuesta = await api.get(
        '/usuarios/perfil'
    );

    return respuesta.data;

};


// ==============================
// EDITAR MI PERFIL
// ==============================

export const editarPerfil = async (
    datos
) => {

    const respuesta = await api.put(
        '/usuarios/perfil',
        datos
    );

    return respuesta.data;

};