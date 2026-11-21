import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTelegramPlane, FaTiktok, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './landing.css';

import logo from './imagenes/logo.jpg';
import hero from './imagenes/hero.jpg';
import corteClasico from './imagenes/uf-corte-clasico.jpg';
import fade from './imagenes/uf-fade.jpg';
import corteBarba from './imagenes/uf-corte-barba.jpg';
import corteInfantil from './imagenes/uf-corte-infantil.jpg';

// Los nombres coinciden con los servicios del dashboard.
const servicios = [
  { nombre: 'Corte clásico', detalle: 'Corte tradicional, prolijo y personalizado.', imagen: corteClasico },
  { nombre: 'Fade', detalle: 'Degradado con transiciones precisas y terminación cuidada.', imagen: fade },
  { nombre: 'Corte y barba', detalle: 'Corte de cabello y perfilado de barba en un mismo servicio.', imagen: corteBarba },
  { nombre: 'Corte infantil', detalle: 'Un corte cómodo y adaptado a los más pequeños.', imagen: corteInfantil },
];

// Sin enlaces hasta recibir los datos oficiales de cada canal.
const canalesContacto = [
  { nombre: 'WhatsApp', descripcion: 'Consultas y mensajes', Icono: FaWhatsapp, clase: 'whatsapp' },
  { nombre: 'Teléfono', descripcion: 'Llamadas al local', Icono: FaPhoneAlt, clase: 'telefono' },
  { nombre: 'Instagram', descripcion: 'Fotos y novedades', Icono: FaInstagram, clase: 'instagram' },
  { nombre: 'Telegram', descripcion: 'Mensajería', Icono: FaTelegramPlane, clase: 'telegram' },
  { nombre: 'TikTok', descripcion: 'Videos y estilos', Icono: FaTiktok, clase: 'tiktok' },
  { nombre: 'Ubicación', descripcion: 'Dirección del local', Icono: FaMapMarkerAlt, clase: 'ubicacion' },
];

function LandingHome() {
  return (
    <main className="uf-landing">
      <header className="uf-landing__nav">
        <a className="uf-landing__brand" href="#inicio" aria-label="Urban Fade, inicio">
          <img src={logo} alt="UF Urban Fade - Premium Barber Studio" />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contacto</a>
          <Link className="uf-landing__login" to="/login">Ingresar</Link>
        </nav>
      </header>

      <section id="inicio" className="uf-landing__hero">
        <img className="uf-landing__hero-photo" src={hero} alt="Cabello entrecano y barba blanca en barbería clásica" />
        <div className="uf-landing__hero-content">
          <p className="uf-landing__eyebrow">URBAN FADE · PREMIUM BARBER STUDIO</p>
          <h1>TU ESTILO.<br /><span>NUESTRA FIRMA.</span></h1>
          <p>Más que un corte, una experiencia. Precisión, personalidad y estilo en cada detalle.</p>
          <div className="uf-landing__actions">
            <Link className="uf-landing__button" to="/login">Reservar turno</Link>
            <a className="uf-landing__button uf-landing__button--outline" href="#servicios">Conocer servicios</a>
          </div>
        </div>
      </section>

      <section id="servicios" className="uf-landing__section">
        <p className="uf-landing__eyebrow">URBAN FADE</p>
        <h2>Servicios con identidad</h2>
        <p>Tradición, precisión y atención a los detalles.</p>
        <div className="uf-landing__services">
          {servicios.map((servicio) => (
            <article className="uf-landing__service" key={servicio.nombre}>
              <img src={servicio.imagen} alt={servicio.nombre} loading="lazy" />
              <div className="uf-landing__service-info">
                <h3>{servicio.nombre}</h3>
                <p>{servicio.detalle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="uf-landing__section uf-landing__section--alt uf-landing__contacto">
        <p className="uf-landing__eyebrow">CONTACTO · URBAN FADE</p>
        <h2>Hablemos de tu próximo estilo</h2>
        <p>Próximamente vas a poder comunicarte con nosotros a través de estos canales.</p>
        <div className="uf-landing__contact-grid">
          {canalesContacto.map(({ nombre, descripcion, Icono, clase }) => (
            <article className="uf-landing__contact-card" key={nombre}>
              <span className={`uf-landing__contact-icon uf-landing__contact-icon--${clase}`} aria-hidden="true">
                <Icono />
              </span>
              <h3>{nombre}</h3>
              <p>{descripcion}</p>
              <span className="uf-landing__contact-pending">Próximamente</span>
            </article>
          ))}
        </div>
        <div className="uf-landing__contact-booking">
          <h3>Tu próximo corte empieza acá</h3>
          <p>Mientras habilitamos nuestros canales de contacto, podés gestionar tus turnos online.</p>
          <Link className="uf-landing__button" to="/login">Ingresar y reservar</Link>
        </div>
      </section>

      <footer className="uf-landing__footer">
        <img src={logo} alt="Urban Fade - Premium Barber Studio" />
        <p>© Urban Fade · Premium Barber Studio</p>
      </footer>
    </main>
  );
}

export default LandingHome;

