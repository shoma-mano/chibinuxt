//! Configuration for Ox Content Vite plugin.

use serde::{Deserialize, Serialize};

/// Configuration for the Ox Content Vite plugin.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OxContentConfig {
    /// Source directory for Markdown files.
    #[serde(default = "default_src_dir")]
    pub src_dir: String,

    /// Output directory for generated files.
    #[serde(default = "default_out_dir")]
    pub out_dir: String,

    /// Base path for the site.
    #[serde(default)]
    pub base: String,

    /// Enable GFM extensions.
    #[serde(default = "default_true")]
    pub gfm: bool,

    /// Theme configuration.
    #[serde(default)]
    pub theme: ThemeConfig,

    /// Site metadata.
    #[serde(default)]
    pub site: SiteConfig,

    /// OG image generation configuration.
    #[serde(default)]
    pub og_image: OgImageConfig,
}

impl Default for OxContentConfig {
    fn default() -> Self {
        Self {
            src_dir: default_src_dir(),
            out_dir: default_out_dir(),
            base: String::new(),
            gfm: true,
            theme: ThemeConfig::default(),
            site: SiteConfig::default(),
            og_image: OgImageConfig::default(),
        }
    }
}

fn default_src_dir() -> String {
    "docs".to_string()
}

fn default_out_dir() -> String {
    "dist".to_string()
}

fn default_true() -> bool {
    true
}

/// Theme configuration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeConfig {
    /// Theme name or path.
    #[serde(default)]
    pub name: Option<String>,

    /// Custom CSS path.
    #[serde(default)]
    pub custom_css: Option<String>,

    /// Enable dark mode.
    #[serde(default = "default_true")]
    pub dark_mode: bool,

    /// Primary color.
    #[serde(default)]
    pub primary_color: Option<String>,
}

/// Site metadata configuration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SiteConfig {
    /// Site title.
    #[serde(default)]
    pub title: Option<String>,

    /// Site description.
    #[serde(default)]
    pub description: Option<String>,

    /// Site URL.
    #[serde(default)]
    pub url: Option<String>,

    /// Site logo.
    #[serde(default)]
    pub logo: Option<String>,

    /// Social links.
    #[serde(default)]
    pub social: Vec<SocialLink>,
}

/// Social link configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SocialLink {
    /// Platform name (e.g., "github", "twitter").
    pub platform: String,
    /// URL to the social profile.
    pub url: String,
}

/// OG image generation configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OgImageConfig {
    /// Enable OG image generation.
    #[serde(default)]
    pub enabled: bool,

    /// Background color.
    #[serde(default = "default_og_bg")]
    pub background: String,

    /// Text color.
    #[serde(default = "default_og_text")]
    pub text_color: String,

    /// Font family.
    #[serde(default)]
    pub font_family: Option<String>,
}

impl Default for OgImageConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            background: default_og_bg(),
            text_color: default_og_text(),
            font_family: None,
        }
    }
}

fn default_og_bg() -> String {
    "#1a1a1a".to_string()
}

fn default_og_text() -> String {
    "#ffffff".to_string()
}
