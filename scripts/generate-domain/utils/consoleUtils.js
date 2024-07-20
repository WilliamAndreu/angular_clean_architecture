

    function showImportsDomainModule(domain) {
        const titleImports = `\x1b[5m To use the domain you must add these imports in the data.module.ts file:`;
        const titleModuleImp = `\x1b[5m Module implementation:`;

        const consoleImports = `
        \x1b[33m import {Get${domain.className}UseCase} from "@usecases/${domain.name}/get-${domain.name}.usecase";
         import {${domain.className}Repository} from "@repositories/${domain.name}/${domain.name}.repository";
         import {${domain.className}RemoteDataSource} from "@data/datasource/${domain.name}/source/${domain.name}-remote-datasource";
         import {${domain.className}ImpRepository} from "@data/repositories/${domain.name}/${domain.name}-implementation.repository";
         import {${domain.className}RemoteDataSourceImp} from "@data/datasource/${domain.name}/remote/${domain.name}-remote-datasource-imp";
         import {${domain.className}LocalDataSourceImp} from "@data/datasource/${domain.name}/local/${domain.name}-local-datasource-imp";
         import {${domain.className}LocalDataSource} from "@data/datasource/${domain.name}/source/${domain.name}-local-datasource";
         \x1b[0m
        `;

        const moduleImp = `
         \x1b[33m Get${domain.className}UseCase,
         { provide: ${domain.className}Repository, useClass: ${domain.className}ImpRepository },
         { provide: ${domain.className}RemoteDataSource, useClass: ${domain.className}RemoteDataSourceImp },
         { provide: ${domain.className}LocalDataSource, useClass: ${domain.className}LocalDataSourceImp },
         \x1b[0m`
        console.log(titleImports)
        console.log(consoleImports)
        console.log(titleModuleImp)
        console.log(moduleImp)

    }

    module.exports = {
        showImportsDomainModule
    };
