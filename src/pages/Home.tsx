import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { addOutline, cafeOutline, gitNetworkOutline, receiptOutline, refreshOutline } from 'ionicons/icons';

import ProductoCard from '../components/ProductoCard';
import ResumenPedido from '../components/ResumenPedido';
import FormularioProducto from '../components/FormularioProducto';
import RegistroComunicacion from '../components/RegistroComunicacion';
import SeccionPanel from '../components/SeccionPanel';
import { PRODUCTOS_INICIALES, formatearPrecio } from '../data/productos';
import type { Direccion, EventoComunicacion, LineaPedido, NuevoProducto, Producto } from '../types/pedido';

/**
 * COMPONENTE PADRE.
 * Es el único "dueño" del estado (productos, pedido, registro, modal, toast).
 * - Baja los datos a los hijos por props.
 * - Recibe los avisos de los hijos por callbacks y actualiza su estado.
 * - Al cambiar el estado, React vuelve a pintar a los hijos afectados con props nuevas:
 *   así se comunican dos hermanos (ProductoCard → Home → ResumenPedido).
 */
const Home: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_INICIALES);
  // Pedido como diccionario id → cantidad: una sola fuente de verdad, sin duplicar productos.
  const [pedido, setPedido] = useState<Record<string, number>>({});
  const [eventos, setEventos] = useState<EventoComunicacion[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const contadorEventos = useRef(0);

  /** Añade una entrada al registro visual (máximo 12, la más reciente arriba). */
  const registrar = useCallback((direccion: Direccion, origen: string, destino: string, detalle: string) => {
    contadorEventos.current += 1;
    const evento: EventoComunicacion = {
      id: contadorEventos.current,
      direccion,
      origen,
      destino,
      detalle,
      hora: new Date().toLocaleTimeString('es-ES'),
    };
    setEventos((prev) => [evento, ...prev].slice(0, 12));
  }, []);

  // ---------- Datos derivados (no se guardan: se calculan desde el estado) ----------
  const lineas: LineaPedido[] = useMemo(
    () =>
      productos
        .filter((p) => (pedido[p.id] ?? 0) > 0)
        .map((p) => ({ producto: p, cantidad: pedido[p.id] })),
    [productos, pedido]
  );
  const total = useMemo(() => lineas.reduce((acc, l) => acc + l.producto.precio * l.cantidad, 0), [lineas]);

  // ---------- Callbacks que el padre entrega a los hijos ----------
  const handleAnadir = useCallback(
    (producto: Producto) => {
      setPedido((prev) => ({ ...prev, [producto.id]: (prev[producto.id] ?? 0) + 1 }));
      registrar('hijo→padre', 'ProductoCard', 'Home', `onAnadir("${producto.nombre}")`);
      registrar('hermano→hermano', 'ProductoCard ⇢ Home', 'ResumenPedido', 'nuevas props: lineas y total');
    },
    [registrar]
  );

  const handleQuitar = useCallback(
    (producto: Producto) => {
      setPedido((prev) => {
        const actual = prev[producto.id] ?? 0;
        if (actual <= 1) {
          const { [producto.id]: _eliminado, ...resto } = prev;
          return resto;
        }
        return { ...prev, [producto.id]: actual - 1 };
      });
      registrar('hijo→padre', 'ProductoCard', 'Home', `onQuitar("${producto.nombre}")`);
      registrar('hermano→hermano', 'ProductoCard ⇢ Home', 'ResumenPedido', 'nuevas props: lineas y total');
    },
    [registrar]
  );

  const handleVaciar = useCallback(() => {
    setPedido({});
    registrar('hijo→padre', 'ResumenPedido', 'Home', 'onVaciar()');
    registrar('padre→hijo', 'Home', 'ProductoCard ×' + productos.length, 'props cantidad = 0');
  }, [registrar, productos.length]);

  const handleConfirmar = useCallback(() => {
    registrar('hijo→padre', 'ResumenPedido', 'Home', `onConfirmar() · ${formatearPrecio(total)}`);
    setToast(`Pedido confirmado: ${formatearPrecio(total)}. ¡Marchando!`);
    setPedido({});
  }, [registrar, total]);

  const handleAbrirFormulario = () => {
    setModalAbierto(true);
    registrar('padre→hijo', 'Home', 'FormularioProducto', 'props abierto = true');
  };

  const handleCrear = useCallback(
    (datos: NuevoProducto) => {
      const nuevo: Producto = { ...datos, id: `n-${Date.now()}` };
      setProductos((prev) => [...prev, nuevo]);
      setModalAbierto(false);
      registrar('hijo→padre', 'FormularioProducto', 'Home', `onCrear({ nombre: "${datos.nombre}", precio: ${datos.precio} })`);
      registrar('padre→hijo', 'Home', 'ProductoCard (nueva)', 'props producto');
      setToast(`«${datos.nombre}» añadido a la carta.`);
    },
    [registrar]
  );

  const handleCerrarFormulario = useCallback(() => setModalAbierto(false), []);

  const handleReiniciar = () => {
    setProductos(PRODUCTOS_INICIALES);
    setPedido({});
    setEventos([]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <span className="marca">
              <IonIcon icon={cafeOutline} aria-hidden="true" /> Cafetería DAM
            </span>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="Reiniciar la demostración" onClick={handleReiniciar}>
              <IonIcon slot="icon-only" icon={refreshOutline} aria-hidden="true" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="contenido">
        <div className="contenedor">
          <header className="intro">
            <h1>Componentes padre e hijo</h1>
            <p>
              <strong>Home</strong> es el padre y guarda el estado. Los hijos reciben datos por <em>props</em> y
              avisan con <em>callbacks</em>. El <strong>registro de comunicación</strong> muestra cada mensaje.
            </p>
          </header>

          <div className="layout">
            <SeccionPanel titulo="Carta" icono={cafeOutline} etiqueta="hijos · ProductoCard">
              <div className="rejilla-productos">
                {productos.map((p) => (
                  <ProductoCard
                    key={p.id}
                    producto={p}
                    cantidad={pedido[p.id] ?? 0}
                    onAnadir={handleAnadir}
                    onQuitar={handleQuitar}
                  />
                ))}
              </div>
              <IonButton fill="outline" className="btn-nuevo ion-hide-md-down" onClick={handleAbrirFormulario}>
                <IonIcon slot="start" icon={addOutline} aria-hidden="true" />
                Nuevo producto
              </IonButton>
            </SeccionPanel>

            <div className="columna-lateral">
              <SeccionPanel titulo="Tu pedido" icono={receiptOutline} etiqueta="hijo hermano · ResumenPedido">
                <ResumenPedido lineas={lineas} total={total} onVaciar={handleVaciar} onConfirmar={handleConfirmar} />
              </SeccionPanel>

              <SeccionPanel titulo="Registro de comunicación" icono={gitNetworkOutline} etiqueta="hijo · solo props">
                <RegistroComunicacion eventos={eventos} onLimpiar={() => setEventos([])} />
              </SeccionPanel>
            </div>
          </div>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="ion-hide-md-up">
          <IonFabButton aria-label="Añadir un producto nuevo a la carta" onClick={handleAbrirFormulario}>
            <IonIcon icon={addOutline} aria-hidden="true" />
          </IonFabButton>
        </IonFab>

        <FormularioProducto abierto={modalAbierto} onCrear={handleCrear} onCerrar={handleCerrarFormulario} />

        <IonToast
          isOpen={toast !== null}
          message={toast ?? ''}
          duration={2200}
          position="top"
          color="dark"
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
