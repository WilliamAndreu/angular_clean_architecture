# ![Angular logo][]

![](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) ![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)  ![](	https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
# Angular Clean Architecture

Arquitectura basada en clean y principios de solid.

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu ordenador local para propósitos de desarrollo y pruebas._

### Pre-requisitos 📋

| Herramienta |  Versión                |
| :-------- |  :------------------------- |
| `Node Js` |**20.7.0** |
| `Angular Cli` | **17.3.12** |
| `Pakage Manager (NPM)` |  **10.1.0** |
| `OS` |  **Sonoma 14.5** |

### Puesta en marcha 🔧

Clone the project

```bash
  git clone https://github.com/WilliamAndreu/angular_clean_architecture
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

## Generación automática de dominio 📌

 Para poder generar un dominio junto con sus capas de manera rapida podemos usar el script incluido en este repositorio:

```bash
  npm run domain
```

Después de pedirnos un nombre para crear el dominio, podremos observar que se han generado los archivos necesarios para poder importar, editar y ejecutar nuestros casos de uso. Los archivos que se crean ya son funcionales, por lo que no hace falta editarlos en primera instancia proveyendo un ejemplo de llamadas a una Api así como su guardado en local y el uso de repositorios.

Por último cabe destacar que el propio script nos dará mediante la consola todos los imports necesarios para que los peguemos en el módulo de data.
Ejemplo:

```bash
  To use the domain you must add these imports in the data.module.ts file:

         import {GetProductUseCase} from "@usecases/product/get-product.usecase";
         import {ProductRepository} from "@repositories/product/product.repository";
         import {ProductRemoteDataSource} from "@data/datasource/product/source/product-remote-datasource";
         import {ProductImpRepository} from "@data/repositories/product/product-implementation.repository";
         import {ProductRemoteDataSourceImp} from "@data/datasource/product/remote/product-remote-datasource-imp";
         import {ProductLocalDataSourceImp} from "@data/datasource/product/local/product-local-datasource-imp";
         import {ProductLocalDataSource} from "@data/datasource/product/source/product-local-datasource";


 Module implementation:

          GetProductUseCase,
         { provide: ProductRepository, useClass: ProductImpRepository },
         { provide: ProductRemoteDataSource, useClass: ProductRemoteDataSourceImp },
         { provide: ProductLocalDataSource, useClass: ProductLocalDataSourceImp },

```

## Versionado 📌

Usaremos un versionado manual de la app incrementando el valor de la version con cada subida a producción.

## Ejecutando las pruebas ⚙️

Este proyecto aun no tiene pruebas que se puedan ejecutar

## Despliegue 📦

Aun esta por determinar la forma de despliegue que se usara en este proyecto.

## Construido con 🛠️

* [Angular](https://angular.io/) - El framework web usado
* [VisualStudio](https://visualstudio.microsoft.com/es/) - IDE de desarrollo
* [Node Js](https://nodejs.org/es) - Entorno de ejecución JavaScript

## Contribuidores ✒️

* **William Andres Aveiga**
* **Rafael Perera**
* **Pablo Serna**

⌨️ con ❤️ para la comunidad de Angular 😊

[Angular logo]: https://raw.githubusercontent.com/rudoapps/hybrid-storage/main/angular/images/angular_logo.png
