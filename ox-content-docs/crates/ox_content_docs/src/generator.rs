//! Documentation site generator.

use std::path::Path;

use crate::config::DocsConfig;
use crate::extractor::{DocExtractor, DocItem, ExtractResult};

use thiserror::Error;

/// Result type for generation operations.
pub type GenerateResult<T> = Result<T, GenerateError>;

/// Errors during documentation generation.
#[derive(Debug, Error)]
pub enum GenerateError {
    /// IO error.
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// Extraction error.
    #[error("Extraction error: {0}")]
    Extract(#[from] crate::extractor::ExtractError),

    /// Template error.
    #[error("Template error: {0}")]
    Template(String),
}

/// Documentation generator.
pub struct DocsGenerator {
    config: DocsConfig,
    extractor: DocExtractor,
}

impl DocsGenerator {
    /// Creates a new documentation generator.
    #[must_use]
    pub fn new(config: DocsConfig) -> Self {
        let extractor = DocExtractor::with_private(config.document_private);
        Self { config, extractor }
    }

    /// Returns the configuration.
    #[must_use]
    pub fn config(&self) -> &DocsConfig {
        &self.config
    }

    /// Generates documentation for all source files.
    pub fn generate(&self) -> GenerateResult<()> {
        let items = self.extract_all()?;
        self.render(&items)?;
        Ok(())
    }

    /// Extracts documentation from all source files.
    pub fn extract_all(&self) -> ExtractResult<Vec<DocItem>> {
        let mut all_items = Vec::new();

        for src_dir in &self.config.src_dirs {
            let items = self.extract_dir(Path::new(src_dir))?;
            all_items.extend(items);
        }

        Ok(all_items)
    }

    /// Extracts documentation from a directory.
    fn extract_dir(&self, dir: &Path) -> ExtractResult<Vec<DocItem>> {
        let mut items = Vec::new();

        if !dir.is_dir() {
            return Ok(items);
        }

        for entry in std::fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_dir() {
                items.extend(self.extract_dir(&path)?);
            } else if self.should_include(&path) {
                if let Ok(file_items) = self.extractor.extract_file(&path) {
                    items.extend(file_items);
                }
            }
        }

        Ok(items)
    }

    /// Checks if a file should be included.
    fn should_include(&self, path: &Path) -> bool {
        let path_str = path.to_string_lossy();

        // Check excludes first
        for pattern in &self.config.exclude {
            if glob_match(pattern, &path_str) {
                return false;
            }
        }

        // Check includes
        for pattern in &self.config.include {
            if glob_match(pattern, &path_str) {
                return true;
            }
        }

        false
    }

    /// Renders documentation items to HTML.
    fn render(&self, items: &[DocItem]) -> GenerateResult<()> {
        let out_dir = Path::new(&self.config.out_dir);
        std::fs::create_dir_all(out_dir)?;

        if self.config.json {
            let json = serde_json::to_string_pretty(items)
                .map_err(|e| GenerateError::Template(e.to_string()))?;
            std::fs::write(out_dir.join("docs.json"), json)?;
        }

        // TODO: Generate HTML pages
        // For now, just create the output directory

        Ok(())
    }
}

/// Simple glob matching (** and * patterns).
fn glob_match(pattern: &str, path: &str) -> bool {
    // Very simplified glob matching
    // TODO: Use a proper glob library
    if pattern.contains("**") {
        let parts: Vec<&str> = pattern.split("**").collect();
        if parts.len() == 2 {
            let prefix = parts[0].trim_end_matches('/');
            let suffix = parts[1].trim_start_matches('/');

            // For **, we just check the suffix pattern
            if !suffix.is_empty() {
                // Handle *.ext suffix
                if let Some(ext) = suffix.strip_prefix('*') {
                    return path.ends_with(ext);
                }
                return path.ends_with(suffix);
            }
            if !prefix.is_empty() && !path.starts_with(prefix) {
                return false;
            }
            return true;
        }
    }

    if pattern.contains('*') {
        let parts: Vec<&str> = pattern.split('*').collect();
        if parts.len() == 2 {
            return path.starts_with(parts[0]) && path.ends_with(parts[1]);
        }
    }

    pattern == path
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_glob_match() {
        // ** with *.ext suffix (matches any path ending with .ts)
        assert!(glob_match("**/*.ts", "src/foo/bar.ts"));
        assert!(glob_match("**/*.ts", "bar.ts"));
        assert!(!glob_match("**/*.ts", "bar.js"));
        // Single * pattern (prefix + suffix matching)
        assert!(glob_match("*.ts", "foo.ts"));
        // Note: our simple glob treats *.ts as "starts with '' and ends with .ts"
        // so src/foo.ts also matches (this is a limitation of the simple implementation)
        assert!(glob_match("*.ts", "src/foo.ts"));
        // Exact match
        assert!(glob_match("foo.ts", "foo.ts"));
        assert!(!glob_match("foo.ts", "bar.ts"));
    }
}
