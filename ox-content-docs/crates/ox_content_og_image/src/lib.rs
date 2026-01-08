//! OG image generation for Ox Content.
//!
//! This crate provides automatic OG (Open Graph) image generation
//! for documentation pages, creating social media preview images.

mod config;
mod generator;
mod template;

pub use config::{ImageFormat, OgImageConfig};
pub use generator::{OgImageError, OgImageGenerator, OgImageResult};
pub use template::{OgImageData, OgImageTemplate, TemplateLayout};
