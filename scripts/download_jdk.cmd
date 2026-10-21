@echo off
if not exist "C:\Users\ariel\.jdks" mkdir "C:\Users\ariel\.jdks"
echo DOWNLOADING_JDK21 > "C:\Users\ariel\.jdks\_status.txt"
curl.exe -L -o "C:\Users\ariel\.jdks\jdk21.zip" "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse"
if errorlevel 1 goto fail
echo EXTRACTING >> "C:\Users\ariel\.jdks\_status.txt"
powershell -NoProfile -Command "Expand-Archive -Force 'C:\Users\ariel\.jdks\jdk21.zip' 'C:\Users\ariel\.jdks'"
del "C:\Users\ariel\.jdks\jdk21.zip"
echo DONE > "C:\Users\ariel\.jdks\_status.txt"
goto end
:fail
echo FAILED > "C:\Users\ariel\.jdks\_status.txt"
:end
