@echo off
cd /d E:\Nanbase\Dekstop\PLM-Mandarin
rem Use JDK 21 (JBR Android Studio is Java 25 = too new for Gradle Kotlin DSL)
set "JAVA_HOME=C:\Users\ariel\.jdks\jdk-21.0.12.1+1"
set "ANDROID_HOME=E:\Android\Sdk"
set "NDK_HOME=E:\Android\Sdk\ndk\27.2.12479018"
call src-tauri\gen\android\gradlew.bat --stop >nul 2>&1
call npx tauri android build --debug --apk --target aarch64 >> android_build.log 2>&1
echo BUILD_EXIT=%ERRORLEVEL% >> android_build.log