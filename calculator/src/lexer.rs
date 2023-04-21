#[derive(Debug)]
pub enum Token {
    Number(f64),
    Plus,
    Minus,
    Multiply,
    Divide,
    LeftParen,
    RightParen,
}

impl Token {
    pub fn from(symbol: &str) -> Token {
        match symbol {
            "+" => Token::Plus,
            "-" => Token::Minus,
            "*" => Token::Multiply,
            "/" => Token::Divide,
            "(" => Token::LeftParen,
            ")" => Token::RightParen,
            num => {
                let number = num.parse::<f64>().unwrap();
                Token::Number(number)
            }
        }
    }
}