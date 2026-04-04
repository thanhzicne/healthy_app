#!/bin/sh
set -eu

cat > /app/build/env-config.js <<EOF
window.__APP_CONFIG__ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL:-http://localhost:4000}"
};
EOF

exec serve -s build -l "${PORT:-3000}"
