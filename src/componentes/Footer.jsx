function Footer() {

    return (

        <footer style={footerStyle}>

            <div style={contenidoStyle}>

                {/* LOGO DEL DESARROLLADOR */}

                <div style={logoStyle}>
                    MB
                </div>

                {/* IDENTIDAD */}

                <div>

                    <p style={empresaStyle}>
                        MB Solutions Tech
                    </p>

                    <p style={textoStyle}>
                        Diseño y desarrollo de software
                    </p>

                    <p style={copyrightStyle}>
                        © 2026 - Todos los derechos reservados
                    </p>

                </div>

            </div>

        </footer>

    );
}

const footerStyle = {

    marginTop: '50px',

    padding: '25px 0 10px 0',

    borderTop: '1px solid #d4af37',

    backgroundColor: 'transparent',

    width: '100%'

};

const contenidoStyle = {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    gap: '15px',

    flexWrap: 'wrap',

    textAlign: 'left'

};

const logoStyle = {

    width: '44px',

    height: '44px',

    borderRadius: '50%',

    border: '1px solid #d4af37',

    color: '#d4af37',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    fontWeight: 'bold',

    fontSize: '15px',

    letterSpacing: '1px',

    boxShadow:
        '0 0 10px rgba(212, 175, 55, 0.15)'

};

const empresaStyle = {

    color: '#d4af37',

    fontWeight: 'bold',

    margin: 0,

    fontSize: '14px',

    letterSpacing: '1px'

};

const textoStyle = {

    color: '#aaa',

    margin: '4px 0 0 0',

    fontSize: '12px'

};

const copyrightStyle = {

    color: '#666',

    margin: '3px 0 0 0',

    fontSize: '11px'

};

export default Footer;