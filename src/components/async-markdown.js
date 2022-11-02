import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import Prism from 'prismjs';

export default class AsyncMarkdown extends LitElement {
  static get styles() {
    return css``;
  }

  static get properties() {
    return {
      src: { type: String },
      markdownHtml: { type: String, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });
  }

  async firstUpdated() {
    await fetch(this.src)
      .then((r) => r.text())
      .then(async (data) => {
        this.markdownHtml = marked.parse(data);
      });
  }

  render() {
    return html`
      <div class="marked m-markdown">
        ${this.markdownHtml ? unsafeHTML(this.markdownHtml) : ''}
      </div>
      <slot></slot>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

// Register the element with the browser
customElements.define('async-markdown', AsyncMarkdown);
