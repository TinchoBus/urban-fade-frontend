
import React from 'react';
import axiomLogo from './imagenes/axiom-logo.png';

function Footer() {
  return (
    <footer style={footerStyle}>

      <p style={copyrightStyle}>
        © 2026 Urban Fade · Todos los derechos reservados
      </p>

      <div style={firmaContenedorStyle}>
        <div style={firmaStyle}>

          <img
            src={axiomLogo}
            alt="Isotipo AXIOM LABS STUDIOS"
            style={logoStyle}
          />

          <div style={identidadStyle}>
            <p style={empresaStyle}>
              AXIOM LABS STUDIOS
            </p>

            <p style={textoStyle}>
              Diseño y desarrollo de software
            </p>
          </div>

        </div>
      </div>

    </footer>
  );
}

const footerStyle = {
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '50px',
  padding: '25px 20px 20px',
  backgroundColor: '#101010',
  borderTop: '1px solid rgba(212, 175, 55, 0.25)',
  textAlign: 'center'
};

const copyrightStyle = {
  color: '#999',
  fontSize: '12px',
  margin: '0 0 20px'
};

const firmaContenedorStyle = {
  width: '100%',
  boxSizing: 'border-box',
  borderTop: '1px solid rgba(212, 175, 55, 0.25)',
  paddingTop: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const firmaStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  maxWidth: '100%'
};

const logoStyle = {
  width: '54px',
  height: '54px',
  objectFit: 'contain',
  flexShrink: 0,
  display: 'block'
};

const identidadStyle = {
  textAlign: 'left'
};

const empresaStyle = {
  color: '#d4af37',
  fontSize: '13px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  margin: 0
};

const textoStyle = {
  color: '#888',
  fontSize: '11px',
  margin: '4px 0 0'
};

export default Footer;

