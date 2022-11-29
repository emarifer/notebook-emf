#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod files_manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn write_file(file_path: &str, content: &str) -> String {
    files_manager::write_file(file_path, content);
    String::from("OK")
}

#[tauri::command]
fn get_file_content(file_path: &str) -> String {
    let content = files_manager::read_file(file_path);
    content
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            write_file,
            get_file_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
