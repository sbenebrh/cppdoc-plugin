#!/usr/bin/env bash
set -e

echo "Node: $(node -v)"
echo "npm : $(npm -v)"
echo "Rust: $(rustc --version)"
echo "Cargo: $(cargo --version)"
echo "Python: $(python3 -V)"

