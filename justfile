set shell := ["zsh", "-i", "-c"]

# Muestra los comandos disponibles
default:
    @just --list

# Instala dependencias y configura el proyecto
setup:
    nvm install
    npm install

# Arranca el servidor de desarrollo
start:
    npm start

# Ejecuta los tests
test:
    npm test

# Ejecuta los tests con coverage
coverage:
    npm test -- --coverage

# Ejecuta el linter
lint:
    npm run lint

# Formatea el código
format:
    npm run format
