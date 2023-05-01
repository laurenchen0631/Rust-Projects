pub struct TrieNode {
    children: Vec<Option<Box<TrieNode>>>,
    is_word: bool,
}

impl Clone for TrieNode {
    fn clone(&self) -> Self {
        Self {
            children: self.children.clone(),
            is_word: self.is_word,
        }
    }
}

impl TrieNode {
    pub fn new() -> Self {
        Self {
            children: vec![None; 26],
            is_word: false,
        }
    }

    pub fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            let idx = (c as u8 - b'a') as usize;
            node = node.children[idx].get_or_insert_with(|| Box::new(TrieNode::new()));
        }
        node.is_word = true;
    }
}
