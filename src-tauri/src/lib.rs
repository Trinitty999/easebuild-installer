use std::io::Write;
use std::{env, fs};
use std::process::Command;

#[tauri::command]
fn close(window: tauri::Window) {
    window.close().unwrap();
}

#[tauri::command]
fn minimize(window: tauri::Window) {
    log::info!("minimized");
    window.minimize().unwrap();
}

#[tauri::command]
fn install() -> String {
    log::info!("installed");
    "installed".to_string()
}

#[tauri::command]
fn repair() -> String {
    log::info!("repaired");
    "repaired".to_string()
}


#[tauri::command]
fn init() {
    let zipfile = include_bytes!("../../files.zip");
    let tempdir = if env::consts::OS == "Windows" { "C:\\Windows\\Temp".to_string() } else { "/tmp".to_string() };
    
    let is_admin = if cfg!(target_os = "windows") {
        let output = Command::new("net")
        .args(&["session"])
        .output()
        .expect("failed to execute process");
    output.status.success()
    } else {
        let output = Command::new("id")
            .arg("-u")
            .output()
            .expect("failed to execute process");
        let uid = String::from_utf8_lossy(&output.stdout).trim().to_string();
        uid == "0"
    };
    
    if is_admin {
        fs::create_dir("installer_data").expect("Failed to initialize");
        env::set_current_dir(format!("{}\\installer_data", &tempdir)).expect("Failed to change directory");
        let mut files = fs::File::create("files.zip").expect("Failed to create file");
        files.write_all(zipfile).expect("failed to extract installer files");
    } else {
        println!("Not running as administrator.");
    }
}

#[tauri::command]
fn uninstall() -> String {
    log::info!("uninstalled");
    "uninstalled".to_string()
}

#[tauri::command]
fn toggle_devtools() {
    log::info!("Can't do that :/");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![close, minimize, install, repair, uninstall, toggle_devtools, init])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
