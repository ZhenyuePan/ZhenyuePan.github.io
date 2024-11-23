import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked to use highlight.js for code highlighting
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
});

export async function markdownToHTML(markdown: string): Promise<string> {
  return marked(markdown);
}

