//! Minimal stub for later expansion.

// pub fn ping() -> &'static str {
//     "Rust core ready ✔︎"
// }

// use std::os::raw::c_char;

// #[unsafe(no_mangle)]                       
// pub extern "C" fn ping_c() -> *const c_char {
//     "Rust core ready ✔︎\0".as_ptr() as *const c_char
// }


pub fn ping_rust() -> &'static str { "Rust core ready ✔︎" }

use napi_derive::napi;
#[napi]
pub fn ping() -> String {
    ping_rust().into()
}


#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn it_works() {
        assert_eq!(ping(), "Rust core ready ✔︎");
    }
}
