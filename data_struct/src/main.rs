use trie::TrieNode;

mod trie;

fn main() {
    let mut root = TrieNode::new();
    root.insert("hello");
}
