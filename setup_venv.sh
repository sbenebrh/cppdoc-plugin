#!/usr/bin/env bash
set -e                               


if [ ! -d ".venv" ]; then
  echo "Creating Python venv..."
  python3 -m venv .venv
fi

source .venv/bin/activate

python -m pip install --upgrade pip

pip install beautifulsoup4 requests tqdm

echo "✅  Virtual env ready. To activate later, run: source .venv/bin/activate"
