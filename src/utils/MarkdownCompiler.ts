import { JSDOM } from 'jsdom';
import showdown from 'showdown';

export class MarkdownCompiler {
  public static compile(markdown: string, options?: { length?: number }): string {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(markdown);
    const dom = JSDOM.fragment(html);
    let text = dom.textContent;
    if (text) {
      text = text.replace(/\s{1,}/g, ' ');
      if (options) {
        if (options.length) {
          text = text.slice(0, options.length);
        }
      }
    }
    return text || '';
  }
}
