//! High-performance Markdown parser for Ox Content.
//!
//! This crate provides a fast, arena-allocated Markdown parser following
//! the CommonMark specification with GFM extensions.
//!
//! # Features
//!
//! - Arena-based allocation for zero-copy parsing
//! - CommonMark compliant with GFM extensions
//! - Pluggable architecture for custom syntax extensions
//!
//! # Example
//!
//! ```
//! use ox_content_allocator::Allocator;
//! use ox_content_parser::Parser;
//!
//! let allocator = Allocator::new();
//! let source = "# Hello World\n\nThis is a paragraph.";
//! let parser = Parser::new(&allocator, source);
//! let document = parser.parse();
//! ```

mod error;
mod lexer;
mod parser;

pub use error::{ParseError, ParseResult};
pub use parser::{Parser, ParserOptions};

/// Parses Markdown source into an AST.
///
/// This is a convenience function that creates a parser with default options.
pub fn parse<'a>(
    allocator: &'a ox_content_allocator::Allocator,
    source: &'a str,
) -> ParseResult<ox_content_ast::Document<'a>> {
    Parser::new(allocator, source).parse()
}
