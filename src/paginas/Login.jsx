import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert('Complete todos los campos.');
            return;
        }

        setCargando(true);

        try {

            const respuesta = await axios.post(
                'http://localhost:3000/api/usuarios/login',
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                'token',
                respuesta.data.token
            );

            localStorage.setItem(
                'usuario',
                JSON.stringify(respuesta.data.usuario)
            );

            navigate('/dashboard');

        } catch (error) {

            if (error.response?.status === 401 ||
                error.response?.status === 404) {

                alert('Email o contraseña incorrectos.');

            } else {

                alert('Error al conectar con el servidor.');

            }

        } finally {

            setCargando(false);

        }

    };

    return (

        <div
            style={{
                backgroundColor: '#121212',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >

            <div
                style={{
                    width: '400px',
                    backgroundColor: '#1a1a1a',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid #d4af37',
                    boxShadow: '0 0 25px rgba(212,175,55,0.15)'
                }}
            >

                <div className="text-center mb-4">

                    <div
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            border: '2px solid #d4af37',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                            color: '#d4af37',
                            fontSize: '34px',
                            fontWeight: 'bold',
                            boxShadow: '0 0 20px rgba(212,175,55,0.3)'
                        }}
                    >
                        UF
                    </div>

                    <h1
                        style={{
                            color: '#d4af37',
                            marginTop: '20px',
                            letterSpacing: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        URBAN FADE
                    </h1>

                    <p
                        style={{
                            color: '#888',
                            letterSpacing: '2px'
                        }}
                    >
                        Premium Barber Studio
                    </p>

                </div>

                <form onSubmit={iniciarSesion}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={{
                            ...buttonStyle,
                            opacity: cargando ? 0.7 : 1,
                            cursor: cargando ? 'not-allowed' : 'pointer'
                        }}
                        disabled={cargando}
                    >
                        {
                            cargando
                                ? 'Ingresando...'
                                : 'Iniciar Sesión'
                        }
                    </button>

                </form>

            </div>

        </div>

    );

}

const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    outline: 'none'
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#d4af37',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: '0.3s'
};

export default Login;