//! Configuration for documentation generation.

use serde::{Deserialize, Serialize};

/// Configuration for documentation generation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocsConfig {
    /// Source directories to scan.
    pub src_dirs: Vec<String>,

    /// Output directory.
    pub out_dir: String,

    /// File patterns to include.
    pub include: Vec<String>,

    /// File patterns to exclude.
    pub exclude: Vec<String>,

    /// Whether to generate JSON output.
    pub json: bool,

    /// Whether to include private items.
    pub document_private: bool,

    /// Theme for the generated docs.
    pub theme: Option<String>,
}

impl Default for DocsConfig {
    fn default() -> Self {
        Self {
            src_dirs: vec!["src".to_string()],
            out_dir: "docs".to_string(),
            include: vec![
                "**/*.ts".to_string(),
                "**/*.tsx".to_string(),
                "**/*.js".to_string(),
                "**/*.jsx".to_string(),
            ],
            exclude: vec![
                "**/node_modules/**".to_string(),
                "**/dist/**".to_string(),
                "**/*.test.*".to_string(),
                "**/*.spec.*".to_string(),
            ],
            json: false,
            document_private: false,
            theme: None,
        }
    }
}
