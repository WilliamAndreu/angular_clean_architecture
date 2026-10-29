# GUI Git clients may not inherit the interactive shell's Node/pnpm PATH.
if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh" --no-use
    nvm use --silent || return 1
  fi
fi

if ! command -v pnpm >/dev/null 2>&1; then
  husky_pnpm_home="${PNPM_HOME:-${XDG_DATA_HOME:-$HOME/.local/share}/pnpm}"
  PATH="$husky_pnpm_home/bin:$husky_pnpm_home:$PATH"
  export PATH
  unset husky_pnpm_home
fi

if ! command -v node >/dev/null 2>&1; then
  echo 'pre-commit: Node.js is unavailable. Install the version in .nvmrc or configure PATH in ~/.config/husky/init.sh.' >&2
  return 127
fi
if ! command -v pnpm >/dev/null 2>&1; then
  echo 'pre-commit: pnpm is unavailable. Install the packageManager version from package.json or configure PNPM_HOME in ~/.config/husky/init.sh.' >&2
  return 127
fi
