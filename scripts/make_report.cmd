@echo off
cd /d e:\Nanbase\PLM
(
echo ===REPORT at %DATE% %TIME%===
powershell -NoProfile -Command "$l = Get-Content 'android_build.log'; Write-Output ('TOTAL_LINES=' + $l.Count); $hits = Select-String -Path 'android_build.log' -Pattern 'BUILD_EXIT|BUILD SUCCESSFUL|failed to build|Compiling omnilife|Finished .dev.'; foreach ($h in $hits) { Write-Output ('L' + $h.LineNumber + ': ' + $h.Line.Substring(0, [Math]::Min(120, $h.Line.Length))) } "
echo ===APK FILES===
dir /s /b src-tauri\gen\android\app\build\outputs\apk\*.apk 2>nul
) > build_report.txt 2>&1
