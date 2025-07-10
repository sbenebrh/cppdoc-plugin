use napi_derive::napi;                    
use once_cell::sync::OnceCell;            
use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};


const INDEX_PATH: &str = "../../docs/index.json";

static INDEX: OnceCell<HashMap<String, String>> = OnceCell::new();

fn load_index() -> &'static HashMap<String, String> {
    INDEX.get_or_init(|| {
        let path: PathBuf = Path::new(env!("CARGO_MANIFEST_DIR")).join(INDEX_PATH);

        let txt = fs::read_to_string(&path)
            .unwrap_or_else(|_| panic!("index.json not found at {:?}", path));

        serde_json::from_str(&txt).expect("index.json malformed")
    })
}

#[napi]                                  
pub fn lookup(symbol: String) -> Option<String> {
    load_index().get(&symbol).cloned()
}

#[napi]
pub fn ping() -> String {
    "Rust core ready ✔︎".into()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ping_works() {
        assert_eq!(ping(), "Rust core ready ✔︎");
    }

    #[test]
    fn vector_found() {
        assert!(lookup("std::vector".into()).is_some());
    }
}