@echo off
echo 🚀 CertiWeb Frontend - Build de Producción
echo ==========================================
echo.

REM Verificar que node esté instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    exit /b 1
)

echo ✅ Node.js instalado
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

REM Build para producción
echo 🔨 Construyendo para producción...
call npm run build:prod
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en el build
    exit /b 1
)
echo ✅ Build completado exitosamente
echo.

REM Verificar que la carpeta dist existe
if exist "dist" (
    echo ✅ Carpeta dist\ creada
    dir dist /s
) else (
    echo ❌ La carpeta dist\ no se creó
    exit /b 1
)

echo.
echo ✨ Build lista para producción!
echo.
echo 🌐 Para probar localmente:
echo    npm run preview
echo.
echo 🐳 Para desplegar con Docker:
echo    npm run docker:build
echo    npm run docker:run
echo    Luego visita: http://localhost:8080
echo.
echo ☁️  Para desplegar en la nube, consulta DEPLOYMENT.md
pause
