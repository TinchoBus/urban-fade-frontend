
import React, { useEffect, useRef, useState } from 'react';

function BotonVolverArriba() {
  const [visible, setVisible] = useState(false);
  const animacionRef = useRef(null);

  useEffect(() => {
    const comprobarScroll = () => {
      const documento = document.documentElement;
      const recorrido = window.scrollY;

      const desplazamientoMaximo =
        documento.scrollHeight - window.innerHeight;

      const porcentaje =
        desplazamientoMaximo > 0
          ? recorrido / desplazamientoMaximo
          : 0;

      setVisible(porcentaje >= 0.4);
    };

    window.addEventListener('scroll', comprobarScroll, {
      passive: true
    });

    comprobarScroll();

    return () => {
      window.removeEventListener('scroll', comprobarScroll);

      if (animacionRef.current !== null) {
        cancelAnimationFrame(animacionRef.current);
      }
    };
  }, []);

  const volverArriba = () => {
    
    // Evitar animaciones simultáneas
    if (animacionRef.current !== null) {
      cancelAnimationFrame(animacionRef.current);
      animacionRef.current = null;
    }

    // Respetar la preferencia de movimiento reducido
    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      window.scrollTo(0, 0);
      return;
    }

    const posicionInicial = window.scrollY;
    const duracion = 6000;
    let inicio = null;

    const animarScroll = (tiempoActual) => {
      if (inicio === null) {
        inicio = tiempoActual;
      }

      const tiempoTranscurrido = tiempoActual - inicio;

      const progreso = Math.min(
        tiempoTranscurrido / duracion,
        1
      );

      // Aceleración y desaceleración suaves
      const suavizado =
        progreso < 0.5
          ? 4 * Math.pow(progreso, 3)
          : 1 - Math.pow(-2 * progreso + 2, 3) / 2;

      const nuevaPosicion =
        posicionInicial * (1 - suavizado);
        document.documentElement.scrollTop = nuevaPosicion;

    //   window.scrollTo({
    //     top: nuevaPosicion,
    //     behavior: 'instant'
    //   });

      if (progreso < 1) {
        animacionRef.current =
          requestAnimationFrame(animarScroll);
      } else {
        window.scrollTo(0, 0);
        animacionRef.current = null;
      }
    };

    animacionRef.current =
      requestAnimationFrame(animarScroll);
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={volverArriba}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid #d4af37',
        backgroundColor: '#101010',
        color: '#d4af37',
        fontSize: '25px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition:
          'background-color 0.3s ease, transform 0.3s ease'
      }}
    >
      ↑
    </button>
  );
}

export default BotonVolverArriba;

