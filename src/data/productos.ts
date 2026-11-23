import type { Producto } from '../types/pedido';

export const PRODUCTOS_INICIALES: Producto[] = [
  { id: 'p1', nombre: 'Café con leche', precio: 1.3, categoria: 'cafe' },
  { id: 'p2', nombre: 'Cortado', precio: 1.1, categoria: 'cafe' },
  { id: 'p3', nombre: 'Croissant', precio: 1.5, categoria: 'bolleria' },
  { id: 'p4', nombre: 'Napolitana de chocolate', precio: 1.8, categoria: 'bolleria' },
  { id: 'p5', nombre: 'Bocadillo de tortilla', precio: 3.2, categoria: 'bocadillo' },
  { id: 'p6', nombre: 'Bocadillo vegetal', precio: 3.0, categoria: 'bocadillo' },
];

export const ETIQUETA_CATEGORIA: Record<Producto['categoria'], string> = {
  cafe: 'Café',
  bolleria: 'Bollería',
  bocadillo: 'Bocadillo',
};

export const formatearPrecio = (euros: number): string =>
  euros.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
