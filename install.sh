#!/bin/bash
# ============================================================
#  OrkestaPay - Script de instalación automática
#  Ejecuta: bash install.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         OrkestaPay Installer          ║${NC}"
echo -e "${BLUE}║      Payment Orchestrator v1.0        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

# 1. Check Node.js
echo -e "${YELLOW}[1/5] Comprobando Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js no encontrado. Instálalo desde https://nodejs.org (v18+)${NC}"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VER encontrado${NC}"

# 2. Install backend
echo ""
echo -e "${YELLOW}[2/5] Instalando dependencias del backend...${NC}"
cd backend
npm install --silent
echo -e "${GREEN}✓ Backend listo${NC}"

# 3. Set up .env
echo ""
echo -e "${YELLOW}[3/5] Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Archivo .env creado. IMPORTANTE: edítalo con tus claves de API.${NC}"
else
  echo -e "${GREEN}✓ .env ya existe, se mantiene sin cambios.${NC}"
fi

# 4. Create data directory
mkdir -p data
echo -e "${GREEN}✓ Directorio de datos creado${NC}"

# 5. Install frontend
echo ""
echo -e "${YELLOW}[4/5] Instalando dependencias del frontend...${NC}"
cd ../frontend
npm install --silent
echo -e "${GREEN}✓ Frontend listo${NC}"

cd ..

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ OrkestaPay instalado correctamente!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}PRÓXIMOS PASOS:${NC}"
echo ""
echo -e "  1. Edita ${BLUE}backend/.env${NC} con tus claves de Stripe / Square / TailoredPayments"
echo ""
echo -e "  2. Abre ${YELLOW}2 terminales${NC} y ejecuta:"
echo -e "     Terminal 1 → ${BLUE}cd backend && npm run dev${NC}"
echo -e "     Terminal 2 → ${BLUE}cd frontend && npm start${NC}"
echo ""
echo -e "  3. Abre ${BLUE}http://localhost:3000${NC} en tu navegador"
echo ""
echo -e "${YELLOW}Claves necesarias:${NC}"
echo -e "  Stripe:           ${BLUE}https://dashboard.stripe.com/apikeys${NC}"
echo -e "  Square:           ${BLUE}https://developer.squareup.com/apps${NC}"
echo -e "  TailoredPayments: ${BLUE}Tu dashboard de TailoredPayments${NC}"
echo ""
