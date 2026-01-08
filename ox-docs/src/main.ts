import content from './content/index.md';

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <header class="header">
      <div class="logo">
        <img src="/public/image.png" alt="chibinuxt" />
        <span>chibinuxt</span>
      </div>
      <nav class="header-nav">
        <a href="/">Home</a>
        <a href="/010-min-ssr">Get Started</a>
        <a href="https://github.com/shoma-mano/chibinuxt" target="_blank">GitHub</a>
      </nav>
    </header>
    <div class="container">
      <nav class="sidebar">
        <h2>Contents</h2>
        <ul>
          ${content.toc.map((entry: any) => `
            <li>
              <a href="#${entry.slug}">${entry.text}</a>
              ${entry.children?.length > 0 ? `
                <ul>
                  ${entry.children.map((child: any) => `
                    <li><a href="#${child.slug}">${child.text}</a></li>
                  `).join('')}
                </ul>
              ` : ''}
            </li>
          `).join('')}
        </ul>
      </nav>
      <main class="content">
        ${content.html}
      </main>
    </div>
  `;
}

if (import.meta.hot) {
  import.meta.hot.on('ox-content:update', () => {
    import.meta.hot?.invalidate();
  });
}
