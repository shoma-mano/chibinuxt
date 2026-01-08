//! Renderer trait and utilities.

use ox_content_ast::Document;
use thiserror::Error;

/// Result type for rendering operations.
pub type RenderResult<T> = Result<T, RenderError>;

/// Render error.
#[derive(Debug, Error)]
pub enum RenderError {
    /// IO error during rendering.
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// Custom error.
    #[error("{0}")]
    Custom(String),
}

/// Trait for rendering Markdown AST to various output formats.
pub trait Renderer {
    /// The output type of the renderer.
    type Output;

    /// Renders a document to the output format.
    fn render(&mut self, document: &Document<'_>) -> RenderResult<Self::Output>;
}
