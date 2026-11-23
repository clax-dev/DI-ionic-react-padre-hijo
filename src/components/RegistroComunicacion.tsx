import React from 'react';
import { IonButton } from '@ionic/react';
import type { Direccion, EventoComunicacion } from '../types/pedido';

/**
 * HIJO de solo lectura: el padre le pasa la lista de eventos por props
 * y él los pinta. Sirve para VER en pantalla por dónde viaja cada dato.
 */
interface RegistroComunicacionProps {
  eventos: EventoComunicacion[];
  onLimpiar: () => void;
}

const CLASE: Record<Direccion, string> = {
  'padre→hijo': 'evento--baja',
  'hijo→padre': 'evento--sube',
  'hermano→hermano': 'evento--hermano',
};

const RegistroComunicacion: React.FC<RegistroComunicacionProps> = ({ eventos, onLimpiar }) => (
  <div className="registro">
    <ul className="registro__leyenda" aria-label="Leyenda">
      <li><span className="punto evento--baja" /> Padre → hijo (props)</li>
      <li><span className="punto evento--sube" /> Hijo → padre (callback)</li>
      <li><span className="punto evento--hermano" /> Hermano → hermano (vía padre)</li>
    </ul>

    {eventos.length === 0 ? (
      <p className="registro__vacio">Interactúa con la app y aquí verás cada mensaje entre componentes.</p>
    ) : (
      <ol className="registro__lista" aria-live="polite">
        {eventos.map((ev) => (
          <li key={ev.id} className={`evento ${CLASE[ev.direccion]}`}>
            <span className="evento__hora">{ev.hora}</span>
            <span className="evento__ruta">
              <strong>{ev.origen}</strong> → <strong>{ev.destino}</strong>
            </span>
            <code className="evento__detalle">{ev.detalle}</code>
          </li>
        ))}
      </ol>
    )}

    <IonButton size="small" fill="clear" color="medium" disabled={eventos.length === 0} onClick={onLimpiar}>
      Limpiar registro
    </IonButton>
  </div>
);

export default RegistroComunicacion;
