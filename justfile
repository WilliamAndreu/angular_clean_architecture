default:
    @just --list

setup:
    pnpm install --frozen-lockfile

test:
    pnpm test

coverage:
    pnpm test:coverage

lint:
    pnpm lint

lint-fix:
    pnpm lint --fix

format:
    pnpm format

check:
    pnpm check
