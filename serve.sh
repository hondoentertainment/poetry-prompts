#!/bin/sh
# Optional: serve locally at http://localhost:8000
cd "$(dirname "$0")" && python3 -m http.server "${1:-8000}"
