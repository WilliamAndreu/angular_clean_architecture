set shell := ["zsh", "-i", "-c"]

# Muestra los comandos disponibles
default:
    @just --list

# Instala dependencias y configura el proyecto
setup:
    nvm install
    npm install

# Ejecuta los tests
test:
    npm test

# Ejecuta los tests con coverage
coverage:
    npm test -- --coverage

# Ejecuta el linter
lint:
    npm run lint

# Ejecuta el linter y corrige errores automáticamente
lint-fix:
    npm run lint -- --fix

# Formatea el código
format:
    npm run format
