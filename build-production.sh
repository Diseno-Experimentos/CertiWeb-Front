#!/bin/bash

echo "🚀 CertiWeb Frontend - Build de Producción"
echo "=========================================="
echo ""

# Verificar que node esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi
echo "✅ Dependencias instaladas"
echo ""

# Build para producción
echo "🔨 Construyendo para producción..."
npm run build:prod
if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi
echo "✅ Build completado exitosamente"
echo ""

# Verificar que la carpeta dist existe
if [ -d "dist" ]; then
    echo "✅ Carpeta dist/ creada"
    echo "📊 Tamaño de la build:"
    du -sh dist/
    echo ""
    echo "📁 Contenido de dist/:"
    ls -lh dist/
else
    echo "❌ La carpeta dist/ no se creó"
    exit 1
fi

echo ""
echo "✨ Build lista para producción!"
echo ""
echo "🌐 Para probar localmente:"
echo "   npm run preview"
echo ""
echo "🐳 Para desplegar con Docker:"
echo "   npm run docker:build"
echo "   npm run docker:run"
echo "   Luego visita: http://localhost:8080"
echo ""
echo "☁️  Para desplegar en la nube, consulta DEPLOYMENT.md"
