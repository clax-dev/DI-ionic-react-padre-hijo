import React from 'react';
import { IonIcon } from '@ionic/react';

/**
 * HIJO contenedor (composición con `children`).
 * El padre le pasa por props el título y el icono, y además le "mete dentro"
 * cualquier contenido JSX a través de `children`. SeccionPanel no sabe qué pinta:
 * solo pone el marco. Es la tercera forma de comunicación padre → hijo.
 */
interface SeccionPanelProps {
  titulo: string;
  icono: string;
  etiqueta?: string; // texto pequeño opcional (p. ej. "hijo · props + callbacks")
  children: React.ReactNode;
}

const SeccionPanel: React.FC<SeccionPanelProps> = ({ titulo, icono, etiqueta, children }) => {
  const idTitulo = `sec-${titulo.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section className="panel" aria-labelledby={idTitulo}>
      <header className="panel__header">
        <IonIcon icon={icono} aria-hidden="true" className="panel__icono" />
        <h2 id={idTitulo} className="panel__titulo">{titulo}</h2>
        {etiqueta && <span className="panel__etiqueta">{etiqueta}</span>}
      </header>
      {children}
    </section>
  );
};

export default SeccionPanel;
