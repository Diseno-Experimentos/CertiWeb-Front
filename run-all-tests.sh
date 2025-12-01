#!/bin/bash

echo "🧪 CertiWeb Frontend - Test Suite"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificando tests...${NC}"
echo ""

# 1. Unit Tests
echo -e "${YELLOW}1️⃣  Ejecutando Tests Unitarios${NC}"
npm run test:unit
UNIT_EXIT=$?

if [ $UNIT_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Tests unitarios pasaron${NC}"
else
    echo -e "${RED}❌ Tests unitarios fallaron${NC}"
fi

echo ""
echo "=================================="
echo ""

# 2. Integration Tests
echo -e "${YELLOW}2️⃣  Ejecutando Tests de Integración${NC}"
echo -e "${BLUE}Nota: El backend puede tardar en despertar...${NC}"
npm run test:integration
INTEGRATION_EXIT=$?

if [ $INTEGRATION_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Tests de integración pasaron${NC}"
else
    echo -e "${YELLOW}⚠️  Algunos tests de integración pueden haber fallado (normal si el backend está dormido)${NC}"
fi

echo ""
echo "=================================="
echo ""

# 3. Linting
echo -e "${YELLOW}3️⃣  Verificando Code Quality (ESLint)${NC}"
npm run lint
LINT_EXIT=$?

if [ $LINT_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Linting pasó${NC}"
else
    echo -e "${YELLOW}⚠️  Se encontraron problemas de linting${NC}"
fi

echo ""
echo "=================================="
echo ""

# 4. Coverage
echo -e "${YELLOW}4️⃣  Generando Coverage Report${NC}"
npm run test:coverage
COVERAGE_EXIT=$?

echo ""
echo "=================================="
echo ""

# Summary
echo -e "${BLUE}📊 RESUMEN DE TESTS${NC}"
echo ""

if [ $UNIT_EXIT -eq 0 ] && [ $LINT_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS TESTS CRÍTICOS PASARON${NC}"
    echo ""
    echo "Tu código está listo para:"
    echo "  • Push a main (deploy a producción)"
    echo "  • Pull Request"
    echo "  • Despliegue en Vercel"
else
    echo -e "${RED}❌ ALGUNOS TESTS FALLARON${NC}"
    echo ""
    echo "Revisa los errores arriba antes de:"
    echo "  • Push a main"
    echo "  • Crear Pull Request"
fi

echo ""
echo "=================================="
echo ""

# Open coverage report
if [ -f "coverage/lcov-report/index.html" ]; then
    echo "📈 Coverage report generado en: coverage/lcov-report/index.html"
    read -p "¿Quieres abrir el reporte de coverage? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Detectar el comando para abrir archivos según el OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open coverage/lcov-report/index.html
        elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            start coverage/lcov-report/index.html
        else
            xdg-open coverage/lcov-report/index.html 2>/dev/null || echo "Abre manualmente: coverage/lcov-report/index.html"
        fi
    fi
fi

echo ""
echo "Tests completados"

# Exit with appropriate code
if [ $UNIT_EXIT -eq 0 ] && [ $LINT_EXIT -eq 0 ]; then
    exit 0
else
    exit 1
fi
