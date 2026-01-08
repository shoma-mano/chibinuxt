//! Vite Environment API integration for Ox Content.
//!
//! This crate provides integration with Vite's Environment API for building
//! documentation sites with Astro-like SSG rendering.

mod config;
mod plugin;
mod transform;

pub use config::{OgImageConfig, OxContentConfig, SiteConfig, SocialLink, ThemeConfig};
pub use plugin::OxContentPlugin;
pub use transform::TransformContext;
