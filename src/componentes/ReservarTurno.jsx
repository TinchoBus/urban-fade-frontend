import { useEffect, useState } from 'react';
import api from '../services/api';

function ReservarTurno() {

    const [peluqueros, setPeluqueros] =
        useState([]);

    const [fecha, setFecha] =
        useState('');

    const [hora, setHora] =
        useState('');

    const [servicio, setServicio] =
        useState('');

    const [peluqueroId, setPeluqueroId] =
        useState('');

    useEffect(() => {

        cargarPeluqueros();

    }, []);

    const cargarPeluqueros = async () => {

        try {

            const res =
                await api.get('/usuarios');

            const filtrados =
                res.data.filter(
                    usuario =>
                        usuario.rol === 'peluquero'
                );

            setPeluqueros(filtrados);

        } catch (error) {

            console.log(error);
        }
    };

    const reservar = async () => {

        try {

            await api.post('/turnos', {

                fecha,
                hora,
                servicio,
                peluqueroId

            });

            alert(
                'Turno reservado correctamente'
            );

            setFecha('');
            setHora('');
            setServicio('');
            setPeluqueroId('');

        } catch (error) {

            console.log(error);

            alert(
                'Error al reservar'
            );
        }
    };

    return (

        <div style={container}>

            <h2 style={titulo}>
                Reservar Turno
            </h2>

            <select
                style={input}
                value={servicio}
                onChange={(e) =>
                    setServicio(e.target.value)
                }
            >

                <option value="">
                    Seleccionar servicio
                </option>

                <option value="Corte Clásico">
                    Corte Clásico
                </option>

                <option value="Fade">
                    Fade
                </option>

                <option value="Corte + Barba">
                    Corte + Barba
                </option>

            </select>

            <select
                style={input}
                value={peluqueroId}
                onChange={(e) =>
                    setPeluqueroId(
                        e.target.value
                    )
                }
            >

                <option value="">
                    Seleccionar peluquero
                </option>

                {
                    peluqueros.map((p) => (

                        <option
                            key={p.id}
                            value={p.id}
                        >
                            {p.nombre} {p.apellido}
                        </option>

                    ))
                }

            </select>

            <input
                type="date"
                style={input}
                value={fecha}
                onChange={(e) =>
                    setFecha(e.target.value)
                }
            />

            <input
                type="time"
                style={input}
                value={hora}
                onChange={(e) =>
                    setHora(e.target.value)
                }
            />

            <button
                style={boton}
                onClick={reservar}
            >
                Reservar
            </button>

        </div>
    );
}

const container = {
    backgroundColor:'#111',
    border:'1px solid #d4af37',
    borderRadius:'20px',
    padding:'30px',
    marginTop:'30px'
};

const titulo = {
    color:'#d4af37',
    marginBottom:'20px'
};

const input = {
    width:'100%',
    padding:'12px',
    marginBottom:'15px',
    borderRadius:'10px'
};

const boton = {
    backgroundColor:'#d4af37',
    color:'#000',
    border:'none',
    padding:'12px 20px',
    borderRadius:'10px',
    cursor:'pointer',
    fontWeight:'bold'
};

export default ReservarTurno;