# Cafetería DAM: componentes padre e hijo en Ionic React

Práctica de **Desarrollo de Interfaces (0488)**, 2.º DAM.
Enunciado: *Ionic React con componente padre e hijo y su comunicación.*

- **Producción:** <https://ionic-react-padre-hijo.vercel.app>
- **Stack:** Ionic React 8, React 18, TypeScript estricto y Vite 5.
- **Memoria:** `docs/Memoria_Ionic_React_Padre_Hijo.pdf`

## 1. Arquitectura

```
App.tsx (IonApp + router "/" → "/home")
└─ pages/Home.tsx                    ← PADRE: único dueño del estado
     ├─ SeccionPanel                 ← hijo contenedor (props + children)
     ├─ ProductoCard ×N              ← hijo: props ↓ producto, cantidad · callbacks ↑ onAnadir, onQuitar
     ├─ ResumenPedido                ← hijo hermano: props ↓ lineas, total · callbacks ↑ onVaciar, onConfirmar
     ├─ FormularioProducto (modal)   ← hijo con estado local: props ↓ abierto · callbacks ↑ onCrear, onCerrar
     └─ RegistroComunicacion         ← hijo de solo lectura: props ↓ eventos
types/pedido.ts   → contrato tipado compartido (Producto, LineaPedido, NuevoProducto…)
data/productos.ts → datos iniciales y utilidades de formato
```

## 2. Formas de comunicación implementadas

| Patrón | Dirección | Dónde se ve |
|---|---|---|
| **Props** | padre → hijo | `Home` pasa `producto` y `cantidad` a cada `ProductoCard`. La insignia «×2» la decide el padre |
| **Callbacks** (funciones pasadas como props) | hijo → padre | `ProductoCard` llama a `onAnadir(producto)`; el hijo no modifica nada, solo avisa |
| **Estado elevado** (*lifting state up*) | hermano → hermano | `ProductoCard` → `Home` (actualiza `pedido`) → `ResumenPedido` recibe `lineas` y `total` nuevos |
| **`children`** (composición) | padre → hijo | `SeccionPanel` pinta el marco y el padre decide qué va dentro |
| **Estado local + callback con resultado** | hijo → padre | `FormularioProducto` valida sus campos y solo envía `onCrear(datos)` cuando son correctos |

El **registro de comunicación** muestra en pantalla cada mensaje con su dirección: azul para padre → hijo, verde para hijo → padre y morado para hermano → hermano.

## 3. Decisiones

- **Un solo dueño del estado (`Home`).** Hay una única fuente de verdad: el total del resumen y la insignia de la tarjeta no se pueden desincronizar.
- **Datos derivados con `useMemo`.** `lineas` y `total` se calculan a partir de `productos` y `pedido` y no se guardan en otro estado, para no duplicar información.
- **Callbacks estables con `useCallback`.** El hijo recibe siempre la misma función entre renders, lo que permite optimizarlo con `React.memo` si hiciera falta.
- **El formulario guarda su propio estado.** Cada tecla no vuelve a pintar al padre, que solo recibe datos ya validados.
- **Descartado: Context API o Redux.** Con un solo nivel de profundidad, las props bastan y el flujo de datos queda explícito. Context compensaría si los datos tuvieran que bajar varios niveles (*prop drilling*).

## 4. Responsive

- **Móvil:** 1 columna, botón flotante (FAB) para crear producto y modal a pantalla completa.
- **Tablet (≥ 768 px):** carta en 3 columnas y modal centrado.
- **Escritorio (≥ 992 px):** dos columnas, la carta a la izquierda y el pedido y el registro fijos a la derecha. El FAB se sustituye por un botón.

## 5. Uso

```powershell
npm install
npm run dev       # http://localhost:5173
npm run build     # producción en dist/ (lo mismo que ejecuta Vercel)
```

`vercel.json` declara el framework (Vite), la salida `dist` y una regla *rewrite* a `index.html`. Esa regla evita el 404 al recargar `/home`.
