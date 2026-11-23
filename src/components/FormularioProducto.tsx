import React, { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { Categoria, NuevoProducto } from '../types/pedido';

/**
 * HIJO con estado local.
 *  - Props ↓: si el modal está abierto.
 *  - Estado propio: los campos del formulario (el padre no se entera de cada tecla).
 *  - Callbacks ↑: onCrear(datos validados) y onCerrar().
 * El padre solo recibe el resultado final; la validación es responsabilidad del hijo.
 */
interface FormularioProductoProps {
  abierto: boolean;
  onCrear: (datos: NuevoProducto) => void;
  onCerrar: () => void;
}

const FormularioProducto: React.FC<FormularioProductoProps> = ({ abierto, onCrear, onCerrar }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('cafe');
  const [error, setError] = useState('');

  const limpiar = () => {
    setNombre('');
    setPrecio('');
    setCategoria('cafe');
    setError('');
  };

  const cerrar = () => {
    limpiar();
    onCerrar();
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const precioNum = Number(precio.replace(',', '.'));
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setError('El precio debe ser un número mayor que 0.');
      return;
    }
    onCrear({ nombre: nombre.trim(), precio: Math.round(precioNum * 100) / 100, categoria });
    limpiar();
  };

  return (
    <IonModal isOpen={abierto} onDidDismiss={cerrar} className="modal-formulario">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Nuevo producto</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={cerrar}>Cancelar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={enviar} noValidate>
          <IonList lines="full">
            <IonItem>
              <IonInput
                label="Nombre"
                labelPlacement="stacked"
                placeholder="Ej. Zumo de naranja"
                value={nombre}
                onIonInput={(ev) => setNombre(String(ev.detail.value ?? ''))}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Precio (€)"
                labelPlacement="stacked"
                inputmode="decimal"
                placeholder="Ej. 2,10"
                value={precio}
                onIonInput={(ev) => setPrecio(String(ev.detail.value ?? ''))}
              />
            </IonItem>
            <IonItem>
              <IonSelect
                label="Categoría"
                labelPlacement="stacked"
                interface="popover"
                value={categoria}
                onIonChange={(ev) => setCategoria(ev.detail.value as Categoria)}
              >
                <IonSelectOption value="cafe">Café</IonSelectOption>
                <IonSelectOption value="bolleria">Bollería</IonSelectOption>
                <IonSelectOption value="bocadillo">Bocadillo</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          {error && (
            <IonText color="danger">
              <p role="alert" className="form-error">{error}</p>
            </IonText>
          )}

          <IonButton type="submit" expand="block" className="ion-margin-top">
            Añadir a la carta
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default FormularioProducto;
