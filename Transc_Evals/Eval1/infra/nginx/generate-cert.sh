#!/bin/sh
set -eu

CERT_DIR="${CRED_PATH}"
CERT="${CERT_DIR}/${CRED_CERT}"
KEY="${CERT_DIR}/${CRED_KEY}"

mkdir -p "$CERT_DIR"

cert_valid() {
  [ -f "$CERT" ] && [ -f "$KEY" ] && openssl x509 -checkend 0 -noout -in "$CERT" 2>/dev/null
}

if ! cert_valid; then
  rm -f "$CERT" "$KEY"
  openssl req -x509 -noenc -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -subj "/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORGANIZATION}/OU=${ORG_UNIT}/CN=${COMMON_NAME}"
  chmod 600 "$KEY"
fi
