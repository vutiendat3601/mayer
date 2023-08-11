cls
@echo off
for /F "tokens=* USEBACKQ" %%F in (`wsl wslpath '%~dp0'`) do set wsl_path=%%F
wsl --cd %wsl_path% docker compose -p mayer up
@pause
