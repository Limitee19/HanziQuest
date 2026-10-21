use std::fs;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Unduh file audio TTS lewat core Rust (tanpa keterbatasan CORS WebView)
/// lalu simpan ke disk app agar bisa diputar offline dari cache.
/// Frontend membaca kembali byte-nya via tts_read_cached_audio.
#[tauri::command]
async fn tts_fetch_bytes(app: tauri::AppHandle, url: String, key: String) -> Result<String, String> {
    let dir = dirs_for_key(&app, &key)?;
    let path = dir.join("audio.mp3");

    // Sudah tercache? Tidak perlu unduh ulang (hemat kuota).
    if tokio::fs::metadata(&path).await.map(|m| m.len() > 0).unwrap_or(false) {
        return Ok(path.to_string_lossy().into_owned());
    }

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;
    let res = client
        .get(&url)
        .header("Accept", "*/*")
        .header("Referer", "https://soundoftext.com/")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        return Err(format!("HTTP {}", res.status()));
    }
    let bytes = res.bytes().await.map_err(|e| e.to_string())?;
    if bytes.is_empty() {
        return Err("empty response".into());
    }
    // Tulis atomik: file sementara dulu, baru rename, agar tidak ada cache setengah jadi.
    let tmp = dir.join("audio.mp3.part");
    tokio::fs::write(&tmp, &bytes).await.map_err(|e| e.to_string())?;
    tokio::fs::rename(&tmp, &path).await.map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().into_owned())
}

/// Baca byte audio tercache dari disk (diputar via object URL di frontend).
#[tauri::command]
async fn tts_read_cached_audio(app: tauri::AppHandle, key: String) -> Result<Vec<u8>, String> {
    let dir = dirs_for_key(&app, &key)?;
    let path = dir.join("audio.mp3");
    match tokio::fs::read(&path).await {
        Ok(bytes) if !bytes.is_empty() => Ok(bytes),
        Ok(_) => Err("empty cache".into()),
        Err(_) => Err("not cached".into()),
    }
}


/// FIX-E: baca satu file media Anki dari {app_data}/anki_media/<file_name>.
/// Frontend memakainya sebagai jalur utama (file-first) untuk memutar /
/// menampilkan media kartu; DB base64 (imported_media_assets) tetap fallback
/// bila file tidak ada — mis. di perangkat lain yang belum diekspor.
#[tauri::command]
async fn anki_media_read(app: tauri::AppHandle, file_name: String) -> Result<Vec<u8>, String> {
    // Sanitasi ketat: hanya [A-Za-z0-9._-]; '/' dan '\\' terfilter sehingga
    // traversal path mustahil. Tolak bila tersisa kosong.
    let safe: String = file_name
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_' || *c == '.')
        .collect();
    if safe.is_empty() {
        return Err("invalid media file name".into());
    }
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("anki_media");
    match tokio::fs::read(dir.join(&safe)).await {
        Ok(bytes) if !bytes.is_empty() => Ok(bytes),
        Ok(_) => Err("empty media".into()),
        Err(_) => Err("not found".into()),
    }
}

/// Direktori cache TTS: {app_data}/tts_cache/
fn tts_cache_base(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let base = app
        .path()
        .app_data_dir()
        .map_err(|_| "app data dir unavailable".to_string())?;
    Ok(base.join("tts_cache"))
}

/// Direktori cache per-key: {app_data}/tts_cache/<sha-ish key sanitized>/
fn dirs_for_key(app: &tauri::AppHandle, key: &str) -> Result<std::path::PathBuf, String> {
    // Sanitasi sederhana: key dari frontend sudah berupa hash-able string,
    // buang karakter yang tidak aman untuk nama file.
    let safe: String = key
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.' {
                c
            } else {
                '_'
            }
        })
        .collect();
    // Batasi panjang nama folder (Windows MAX_PATH friendly).
    let safe: String = safe.chars().take(180).collect();
    let base = app
        .path()
        .app_data_dir()
        .map_err(|_| "app data dir unavailable".to_string())?;
    Ok(base.join("tts_cache").join(safe))
}

/// Informasi cache disk TTS untuk halaman Settings (jumlah file + total byte).
#[tauri::command]
async fn tts_cache_info(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let base = tts_cache_base(&app)?;
    let mut entries: u64 = 0;
    let mut bytes: u64 = 0;
    if let Ok(mut rd) = tokio::fs::read_dir(&base).await {
        loop {
            match rd.next_entry().await {
                Ok(Some(entry)) => {
                    let p = entry.path();
                    if p.is_dir() {
                        if let Ok(audio) = tokio::fs::metadata(p.join("audio.mp3")).await {
                            if audio.is_file() && audio.len() > 0 {
                                entries += 1;
                                bytes += audio.len();
                            }
                        }
                    }
                }
                Ok(None) => break,
                Err(_) => break,
            }
        }
    }
    Ok(serde_json::json!({ "entries": entries, "bytes": bytes }))
}

/// Hapus seluruh cache disk TTS (dipanggil tombol "Hapus Cache" di Settings).
#[tauri::command]
async fn tts_clear_cache(app: tauri::AppHandle) -> Result<(), String> {
    let base = tts_cache_base(&app)?;
    match tokio::fs::remove_dir_all(&base).await {
        Ok(_) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn save_widget_schedule(app: tauri::AppHandle, schedule_json: String) -> Result<(), String> {
    if let Ok(dir) = app.path().app_data_dir() {
        let _ = fs::create_dir_all(&dir);
        let _ = fs::write(dir.join("today_classes.json"), &schedule_json);
        let _ = fs::write(dir.join("schedule_cache.json"), &schedule_json);
        if let Some(parent) = dir.parent() {
            let _ = fs::write(parent.join("today_classes.json"), &schedule_json);
            let _ = fs::write(parent.join("schedule_cache.json"), &schedule_json);
        }
    }

    #[cfg(target_os = "android")]
    {
        for base in &[
            "/data/data/com.ariel.omnilife.mandarin/files",
            "/data/user/0/com.ariel.omnilife.mandarin/files",
        ] {
            let p = std::path::Path::new(base);
            if p.exists() {
                let _ = fs::write(p.join("today_classes.json"), &schedule_json);
                let _ = fs::write(p.join("schedule_cache.json"), &schedule_json);
            }
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Desktop (WebView2): auto-grant mic/camera capture inside the WebView so the
    // AI Assistant's speech-to-text works on Windows too. Without this flag,
    // WebView2 denies getUserMedia because wry has no PermissionRequested bridge.
    // Must be set before the WebView2 environment is created.
    #[cfg(all(windows, not(mobile)))]
    {
        let flag = "--use-fake-ui-for-media-stream";
        match std::env::var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS") {
            Ok(existing) if !existing.contains(flag) => {
                std::env::set_var(
                    "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
                    format!("{existing} {flag}"),
                );
            }
            Ok(_) => {} // flag already present
            Err(_) => {
                std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", flag);
            }
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            save_widget_schedule,
            tts_fetch_bytes,
            tts_read_cached_audio,
            anki_media_read,
            tts_cache_info,
            tts_clear_cache
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
