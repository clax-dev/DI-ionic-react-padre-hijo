import React from 'react';
import { IonBadge, IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { addOutline, removeOutline } from 'ionicons/icons';
import type { Producto } from '../types/pedido';
import { ETIQUETA_CATEGORIA, formatearPrecio } from '../data/productos';

/**
 * HIJO presentacional.
 *  - Recibe del padre (props ↓): el producto y cuántas unidades lleva en el pedido.
 *  - Avisa al padre (callbacks ↑): onAnadir / onQuitar.
 * No guarda estado propio ni conoce el pedido completo: si mañana el pedido
 * se guarda en un servidor, este componente no cambia.
 */
interface ProductoCardProps {
  producto: Producto;
  cantidad: number;
  onAnadir: (producto: Producto) => void;
  onQuitar: (producto: Producto) => void;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto, cantidad, onAnadir, onQuitar }) => (
  <IonCard className={`producto ${cantidad > 0 ? 'producto--activo' : ''}`}>
    <IonCardContent className="producto__contenido">
      <div className="producto__cabecera">
        <span className={`categoria categoria--${producto.categoria}`}>
          {ETIQUETA_CATEGORIA[producto.categoria]}
        </span>
        {cantidad > 0 && (
          <IonBadge className="producto__badge" aria-label={`${cantidad} en el pedido`}>
            ×{cantidad}
          </IonBadge>
        )}
      </div>

      <h3 className="producto__nombre">{producto.nombre}</h3>
      <p className="producto__precio">{formatearPrecio(producto.precio)}</p>

      <div className="producto__acciones">
        <IonButton
          fill="outline"
          className="btn-cantidad"
          disabled={cantidad === 0}
          aria-label={`Quitar un ${producto.nombre}`}
          onClick={() => onQuitar(producto)}
        >
          <IonIcon slot="icon-only" icon={removeOutline} aria-hidden="true" />
        </IonButton>
        <IonButton
          className="btn-anadir"
          aria-label={`Añadir un ${producto.nombre} al pedido`}
          onClick={() => onAnadir(producto)}
        >
          <IonIcon slot="start" icon={addOutline} aria-hidden="true" />
          Añadir
        </IonButton>
      </div>
    </IonCardContent>
  </IonCard>
);

export default ProductoCard;
