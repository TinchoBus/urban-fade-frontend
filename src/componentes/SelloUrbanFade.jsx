
import React from 'react';

function SelloUrbanFade() {
    return (
        <section
            aria-label="Identidad Urban Fade"
            style={{
                backgroundColor: '#0b0b0b',
                padding: '70px 20px 55px',
                textAlign: 'center',
                overflow: 'hidden'
            }}
        >
            <p
                style={{
                    color: '#a68b58',
                    fontSize: '11px',
                    letterSpacing: '4px',
                    marginBottom: '25px'
                }}
            >
                PREMIUM BARBER STUDIO
            </p>

            <h2
                style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(38px, 12vw, 180px)',
                    fontWeight: 400,
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    background:
                        'linear-gradient(180deg, #806a46 0%, #332b20 65%, #15120f 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                URBAN FADE
            </h2>

            <p
                style={{
                    color: '#b99b63',
                    fontSize: '12px',
                    letterSpacing: '3px',
                    marginTop: '30px'
                }}
            >
                TU ESTILO. NUESTRA FIRMA.
            </p>
        </section>
    );
}

export default SelloUrbanFade;
