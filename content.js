(() => {
  try {
    const docClone = document.cloneNode(true);
    const reader = new Readability(docClone);
    const article = reader.parse();

    const title = (article && article.title) || document.title || 'Untitled';
    const byline = article && article.byline ? article.byline : '';
    const html = article && article.content ? article.content : document.body.innerHTML;
    const url = location.href;

    const td = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });
    const body = td.turndown(html);

    const fm = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `url: ${url}`,
      byline ? `byline: ${JSON.stringify(byline)}` : null,
      `saved: ${new Date().toISOString()}`,
      '---',
      ''
    ].filter(Boolean).join('\n');

    return { markdown: `${fm}\n# ${title}\n\n${body}\n`, title };
  } catch (e) {
    return { error: e.message };
  }
})();
