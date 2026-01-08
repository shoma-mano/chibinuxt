/// <reference types="vite/client" />

declare module '*.md' {
  const content: {
    html: string;
    frontmatter: Record<string, any>;
    toc: Array<{
      text: string;
      slug: string;
      depth: number;
      children: Array<{
        text: string;
        slug: string;
        depth: number;
      }>;
    }>;
  };
  export default content;
}
