use std::{
    fs,
    net::{TcpListener, TcpStream},
    io::{BufReader, prelude::*}, 
    thread, 
    time::Duration,
};

use webserver::ThreadPool;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
    let pool = ThreadPool::new(4);

    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        pool.execute(move || {
            handle_connection(&mut stream);
        });

        // let mut stream = stream.unwrap();
        // handle_connection(&mut stream);
        
        println!("Connection established!");
    }
}


fn handle_connection(mut stream: &TcpStream) {
    let reader = BufReader::new(stream);
    // let request: Vec<_> = reader
    //     .lines()
    //     .map(|line| line.unwrap())
    //     .take_while(|line| !line.is_empty())
    //     .collect();
    let request_line = reader.lines().next().unwrap().unwrap();


    let (status_line, filename) = match &request_line[..] {
        "GET / HTTP/1.1" => ("HTTP/1.1 200 OK", "static/index.html"),
        "GET /sleep HTTP/1.1" => {
            thread::sleep(Duration::from_secs(5));
            ("HTTP/1.1 200 OK", "static/index.html")
        }
        _ => ("HTTP/1.1 404 NOT FOUND", "404.html"),
    };

    let contents = fs::read_to_string(filename).unwrap();
    let length = contents.len();
    let response =
        format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write(response.as_bytes()).unwrap();
}