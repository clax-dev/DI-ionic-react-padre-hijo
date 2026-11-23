/** Modelo de dominio compartido por el padre y todos los hijos. */

export type Categoria = 'cafe' | 'bolleria' | 'bocadillo';

export interface Producto {
  readonly id: string;
  nombre: string;
  precio: number; // euros
  categoria: Categoria;
}

/** Lo que el formulario hijo envía al padre: todo menos el id (lo genera el padre). */
export type NuevoProducto = Omit<Producto, 'id'>;

/** Línea del pedido: un producto y cuántas unidades lleva. */
export interface LineaPedido {
  producto: Producto;
  cantidad: number;
}

/** Dirección de cada mensaje que viaja entre componentes (para el registro visual). */
export type Direccion = 'padre→hijo' | 'hijo→padre' | 'hermano→hermano';

export interface EventoComunicacion {
  readonly id: number;
  direccion: Direccion;
  origen: string;
  destino: string;
  detalle: string;
  hora: string;
}
