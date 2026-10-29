# Recorridos de los ejemplos

## Catálogo y detalle

`ProductsListView → ProductsViewModel → GetProductsUseCase → ProductsRepository → ProductsImpRepository → datasource local/remoto`.

El caso de uso valida la paginación y normaliza la búsqueda. El repositorio consulta la caché usando todos los parámetros, mapea resultados y persiste la página correcta. El ViewModel retrasa la búsqueda 300 ms y cancela la consulta anterior cuando cambia el filtro. Un error al cargar otra página conserva los productos existentes y el reintento solicita el mismo desplazamiento fallido.

La lista incluye un botón accesible de carga adicional además del sentinel de scroll. El detalle reacciona a cambios de `:id`, limpia la selección de imagen y evita que una respuesta antigua sustituya al producto actual.

Pruebas relevantes: casos de uso de productos, datasources local/remoto, repositorio, ViewModels y `tests/integration/application.spec.ts`.

## Autenticación

`LoginForm → LoginViewModel → LoginUseCase → AuthRepository → AuthImpRepository → datasources`.

Login recibe credenciales del formulario, guarda los tokens y abre el perfil. Los guards restauran la sesión antes de permitir navegación. El interceptor gestiona 401 sin duplicar renovaciones concurrentes ni entrar en bucles de reintentos. Logout utiliza su caso de uso y borra los tokens sin que el ViewModel conozca claves de almacenamiento.

Pruebas relevantes: caso de uso de login, repositorio de autenticación, interceptores HTTP y navegación protegida.

## Carrito con reglas de negocio

`ProductDetailViewModel / CartViewModel → ChangeCartItemUseCase → AuthRepository + CartRepository + ProductsRepository`.

El caso de uso identifica al usuario, obtiene su carrito y consulta el stock actual del producto. Rechaza cantidades fraccionarias, negativas o superiores al stock. Añadir acumula unidades; editar sustituye la cantidad; cero en una edición elimina la línea. Los totales se calculan en el dominio con redondeo a céntimos. Eliminar la última línea vacía el carrito.

El repositorio convierte la entidad a la petición HTTP y solo actualiza el borrador local después de una respuesta correcta. Los cambios de DummyJSON son simulados: recargar la API devolvería el estado original. Por eso el borrador local es la fuente posterior de lectura, separado por usuario, y el vaciado conserva una instantánea vacía para impedir que reaparezca un carrito del servidor.

Pruebas relevantes: reglas de carrito, repositorio con simulación de IDs y aislamiento por usuario, y pruebas de almacenamiento.

El carrito mantiene el mismo patrón de las demás pantallas: una clase `CartState` con signals, un `CartViewModel` que ejecuta casos de uso y actualiza el estado, y una fachada de lectura `ViewState<CartState>`. La exploración de un estado atómico compartido queda aplazada.
