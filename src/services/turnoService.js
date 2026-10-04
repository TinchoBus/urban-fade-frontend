import api from './api';

// ==============================
// CREAR TURNO
// ==============================

export const crearTurno = async (datos) => {

    const respuesta = await api.post(
        '/turnos',
        datos
    );

    return respuesta.data;

};

// ==============================
// MIS TURNOS
// ==============================

export const obtenerMisTurnos = async () => {

    const respuesta = await api.get(
        '/turnos/mis-turnos'
    );

    return respuesta.data;

};

// ==============================
// TODOS LOS TURNOS
// ==============================

export const obtenerTurnos = async () => {

    const respuesta = await api.get(
        '/turnos'
    );

    return respuesta.data;

};

// ==============================
// CANCELAR
// ==============================

export const eliminarTurno = async (id) => {

    const respuesta = await api.delete(
        `/turnos/${id}`
    );

    return respuesta.data;

};

// ==============================
// EDITAR
// ==============================

export const editarTurno = async (
    id,
    datos
) => {

    const respuesta = await api.put(
        `/turnos/${id}`,
        datos
    );

    return respuesta.data;

};