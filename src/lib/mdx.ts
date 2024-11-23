import { marked } from 'marked';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();

renderer.code = ({ text, lang = 'plaintext' }) => {
  const language = hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
};

marked.setOptions({
  renderer,
  // 移除 langPrefix，因为我们通过 renderer 手动控制类名
});

export async function markdownToHTML(markdown: string): Promise<string> {
  return marked(markdown);
}

