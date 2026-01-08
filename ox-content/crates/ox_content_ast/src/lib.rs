//! AST definitions for Ox Content Markdown parser.
//!
//! This crate defines the Abstract Syntax Tree (AST) for Markdown documents,
//! designed to be compatible with mdast (Markdown AST) specification while
//! providing efficient arena-based allocation.

mod ast;
mod span;
mod visit;

pub use ast::*;
pub use span::*;
pub use visit::*;
