use parser::{tokenize,parse};

mod parser;
mod lexer;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let expression = &args[1];

    let tokens = tokenize(expression);
    let root = parse(&tokens).unwrap();
    println!("{:?}", root.evaluate());
}
