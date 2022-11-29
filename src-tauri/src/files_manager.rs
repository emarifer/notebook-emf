use std::{fs, path::Path};

// update file and create new file
pub fn write_file(path: &str, content: &str) -> String {
    let file_path = Path::new(path);
    let result = match fs::write(file_path, content) {
        Ok(()) => String::from("OK"),
        Err(_err) => String::from("ERROR"),
    };

    result
}

// open and read file
pub fn read_file(path: &str) -> String {
    let contents = fs::read_to_string(path).expect("ERROR");
    contents
}
