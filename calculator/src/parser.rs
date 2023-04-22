use regex::Regex;
use crate::lexer::{Token, ASTNode};
use std::iter::{Peekable};
use std::slice::{Iter};

pub fn tokenize(expression: &str) -> Vec<Token> {
    let token_pattern = r"(\d+(\.\d*)?|\+|-|\*|/|\(|\))";
    let re = Regex::new(token_pattern).unwrap();
    let mut tokens = Vec::new();

    for cap in re.captures_iter(expression) {
        let token = Token::from(cap.get(1).unwrap().as_str());
        tokens.push(token);
    }

    tokens
}

#[derive(Debug)]
pub enum ParseError {
    UnexpectedToken(String),
    // InvalidNumber(String),
    UnmatchedParenthesis,
    // EmptyExpression,
}

pub fn parse(tokens: &[Token]) -> Result<Box<ASTNode>, ParseError> {
    let mut tokens = tokens.iter().peekable();
    parse_expr(&mut tokens)
}

fn parse_expr(iter: &mut Peekable<Iter<Token>>) -> Result<Box<ASTNode>, ParseError> {
    let mut left = parse_term(iter.by_ref())?;

    while let Some(&token) = iter.peek() {
        match token {
            Token::Plus => {
                iter.next();
                let right = parse_term(iter.by_ref())?;
                left = Box::new(ASTNode::Add(left, right));
            }
            Token::Minus => {
                iter.next();
                let right = parse_term(iter.by_ref())?;
                left = Box::new(ASTNode::Subtract(left, right));
            }
            _ => break,
        }
    }

    Ok(left)
}

fn parse_term(iter: &mut Peekable<Iter<Token>>) -> Result<Box<ASTNode>, ParseError> {
    let mut left = parse_factor(iter.by_ref())?;

    while let Some(&token) = iter.peek() {
        match token {
            Token::Multiply => {
                iter.next();
                let right = parse_factor(iter.by_ref())?;
                left = Box::new(ASTNode::Multiply(left, right));
            }
            Token::Divide => {
                iter.next();
                let right = parse_factor(iter.by_ref())?;
                left = Box::new(ASTNode::Divide(left, right));
            }
            _ => break,
        }
    }
    

    Ok(left)
}

fn parse_factor(iter: &mut Peekable<Iter<Token>>) -> Result<Box<ASTNode>, ParseError> {
    match iter.next() {
        Some(Token::Number(value)) => {
            Ok(Box::new(ASTNode::Number(*value)))
        },
        Some(Token::LeftParen) => {
            let expr = parse_expr(iter)?;
            match iter.next() {
                Some(Token::RightParen) => Ok(expr),
                _ => Err(ParseError::UnmatchedParenthesis),
            }
        }
        _ => {
            Err(ParseError::UnexpectedToken("".to_string()))
        },
    }
}