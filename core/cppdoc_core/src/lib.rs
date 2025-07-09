//! Minimal stub for later expansion.

pub fn ping() -> &'static str {
    "Rust core ready ✔︎"
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn it_works() {
        assert_eq!(ping(), "Rust core ready ✔︎");
    }
}
