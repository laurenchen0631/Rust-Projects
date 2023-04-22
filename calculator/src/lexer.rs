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

#[derive(Debug)]
pub enum ASTNode {
    Add(Box<ASTNode>, Box<ASTNode>),
    Subtract(Box<ASTNode>, Box<ASTNode>),
    Multiply(Box<ASTNode>, Box<ASTNode>),
    Divide(Box<ASTNode>, Box<ASTNode>),
    Number(f64),
}

impl ASTNode {
    pub fn evaluate(&self) -> f64 {
        match self {
            ASTNode::Add(left, right) => left.evaluate() + right.evaluate(),
            ASTNode::Subtract(left, right) => left.evaluate() - right.evaluate(),
            ASTNode::Multiply(left, right) => left.evaluate() * right.evaluate(),
            ASTNode::Divide(left, right) => left.evaluate() / right.evaluate(),
            ASTNode::Number(value) => *value,
        }
    }
}