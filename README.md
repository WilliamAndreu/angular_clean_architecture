# ![Angular logo][]

![](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) ![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)  ![](	https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
# Angular Clean Architecture

Architecture based on clean and solid principles.


[Angular Architecture Demo](https://angular-clean-architecture-murex.vercel.app/)

## Beginning 🚀

_These instructions will allow you to get a copy of the project running on your local computer for development and testing purposes.._

### Pre-requisites 📋

| Tool |  Version                |
| :-------- |  :------------------------- |
| `Node Js` |**20.15.1** |
| `Angular Cli` | **19.0.6** |
| `Pakage Manager (NPM)` |  **10.8.3** |
| `OS` |  **Sonoma 14.5** |

### Start-up 🔧

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

## Automatic domain generation 📌

 In order to generate a domain and its layers quickly we can use the script included in this repository:

```bash
  npm run domain
```

After asking for a name to create the domain, we can see that the necessary files have been generated to be able to import, edit and execute our use cases. The files that are created are already functional, so there is no need to edit them in the first instance providing an example of calls to an Api as well as its saving in local and the use of repositories.

Finally it is worth noting that the script itself will give us through the console all the necessary imports for us to paste them in the data module.
Example:

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

## Versioning 📌

We will use manual versioning of the app by increasing the version value with each upload to production.

## Running the tests ⚙️

To run the tests with Jest just execute:
```bash
 npm run test
 ```

## Deployment 📦

This project has a demo deployed using vercel for environment configuration and automatic deployment.

## Built with 🛠️

* [Angular](https://angular.io/) - The web framework used
* [VisualStudio](https://visualstudio.microsoft.com/es/) - Development IDE
* [Node Js](https://nodejs.org/es) - JavaScript execution environment

## Contributors ✒️

* **Rafael Perera**
* **Pablo Serna**
* **Gabriel Puglisi** - [Angular Developer](https://www.linkedin.com/in/gabriel-puglisi-381998159/)
* **Marcel del Toro Sempere**
* **William Andres Aveiga** - [Angular Developer](https://github.com/WilliamAndreu)

⌨️ with ❤️ for the Angular community 😊

[Angular logo]: https://raw.githubusercontent.com/rudoapps/hybrid-storage/main/angular/images/angular_logo.png
