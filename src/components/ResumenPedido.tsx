import React from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { checkmarkCircleOutline, trashOutline } from 'ionicons/icons';
import type { LineaPedido } from '../types/pedido';
import { formatearPrecio } from '../data/productos';

/**
 * HIJO "hermano" de las ProductoCard.
 * Nunca habla directamente con ellas: cuando una tarjeta añade un producto,
 * avisa al padre (Home), Home actualiza su estado y vuelve a pintar a este
 * componente con las nuevas props. Es el patrón "elevar el estado" (lifting state up).
 */
interface ResumenPedidoProps {
  lineas: LineaPedido[];
  total: number;
  onVaciar: () => void;
  onConfirmar: () => void;
}

const ResumenPedido: React.FC<ResumenPedidoProps> = ({ lineas, total, onVaciar, onConfirmar }) => {
  const unidades = lineas.reduce((acc, l) => acc + l.cantidad, 0);

  return (
    <div className="resumen">
      {lineas.length === 0 ? (
        <p className="resumen__vacio">Todavía no hay nada en el pedido. Pulsa «Añadir» en un producto.</p>
      ) : (
        <IonList lines="full" className="resumen__lista">
          {lineas.map(({ producto, cantidad }) => (
            <IonItem key={producto.id}>
              <IonLabel>
                {cantidad} × {producto.nombre}
              </IonLabel>
              <IonNote slot="end">{formatearPrecio(producto.precio * cantidad)}</IonNote>
            </IonItem>
          ))}
        </IonList>
      )}

      <p className="resumen__total" aria-live="polite">
        <span>{unidades} {unidades === 1 ? 'unidad' : 'unidades'}</span>
        <strong>{formatearPrecio(total)}</strong>
      </p>

      <div className="resumen__acciones">
        <IonButton fill="outline" color="medium" disabled={lineas.length === 0} onClick={onVaciar}>
          <IonIcon slot="start" icon={trashOutline} aria-hidden="true" />
          Vaciar
        </IonButton>
        <IonButton disabled={lineas.length === 0} onClick={onConfirmar}>
          <IonIcon slot="start" icon={checkmarkCircleOutline} aria-hidden="true" />
          Confirmar
        </IonButton>
      </div>
    </div>
  );
};

export default ResumenPedido;
