@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "PYTHON_EXE="
set "PYTHON_PREFIX="
py -3 --version >nul 2>&1
if !errorlevel! equ 0 (
  set "PYTHON_EXE=py"
  set "PYTHON_PREFIX=-3"
)

if not defined PYTHON_EXE (
  for /f "delims=" %%I in ('where python 2^>nul') do (
    if not defined PYTHON_EXE (
      "%%I" --version >nul 2>&1
      if !errorlevel! equ 0 set "PYTHON_EXE=%%I"
    )
  )
)

if not defined PYTHON_EXE (
  python3 --version >nul 2>&1
  if !errorlevel! equ 0 set "PYTHON_EXE=python3"
)

if not defined PYTHON_EXE (
  set "BUNDLED_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
  if exist "!BUNDLED_PYTHON!" (
    "!BUNDLED_PYTHON!" --version >nul 2>&1
    if !errorlevel! equ 0 set "PYTHON_EXE=!BUNDLED_PYTHON!"
  )
)

if not defined PYTHON_EXE (
  echo [求是脉络] 未找到可用的 Python 3。
  echo 请安装 Python 3 后重新运行本脚本。
  pause
  exit /b 1
)

set "PORT="
for /L %%P in (8000,1,8010) do (
  powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort %%P -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }" >nul 2>&1
  if !errorlevel! equ 0 (
    set "PORT=%%P"
    goto port_found
  )
)

:port_found
if not defined PORT (
  echo [求是脉络] 端口 8000 至 8010 均被占用。
  pause
  exit /b 1
)

set "URL=http://127.0.0.1:%PORT%/"
echo [求是脉络] 正在启动本地服务：%URL%
start "求是脉络本地服务" /min "%PYTHON_EXE%" %PYTHON_PREFIX% -m http.server %PORT% --bind 127.0.0.1

powershell -NoProfile -Command "$url='%URL%'; 1..50 | ForEach-Object { try { Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1 | Out-Null; exit 0 } catch { Start-Sleep -Milliseconds 200 } }; exit 1" >nul 2>&1
if errorlevel 1 (
  echo [求是脉络] 服务未能在预期时间内启动。
  pause
  exit /b 1
)

start "" "%URL%"
echo [求是脉络] 已在浏览器中打开。关闭“求是脉络本地服务”窗口即可停止服务。
endlocal
