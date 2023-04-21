use regex::Regex;
use crate::lexer::Token;

pub fn tokenize(expression: &str) -> Vec<Token> {
    let token_pattern = r"(\d+(\.\d*)?|\+|-|\*|/|\(|\))";
    let re = Regex::new(token_pattern).unwrap();
    let mut tokens = Vec::new();

    for cap in re.captures_iter(expression) {
        println!("{:?}", cap.get(1).unwrap());

        let token = Token::from(cap.get(1).unwrap().as_str());
        tokens.push(token);
    }

    tokens
}