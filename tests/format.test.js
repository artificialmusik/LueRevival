const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, renderMessage, slugify, pageTitle, safeHttpUrl } = require('../src/lib/format');

test('escapeHtml blocks script injection', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});

test('renderMessage supports classic board markup safely', () => {
  const html = renderMessage('[b]bold[/b]\n[quote]<bad>[/quote]\nhttps://example.com');
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /&lt;bad&gt;/);
  assert.match(html, /quoted-message/);
  assert.match(html, /rel="nofollow ugc noopener"/);
});

test('slugify and pageTitle helpers are stable', () => {
  assert.equal(slugify('LUE Revival!!!'), 'lue-revival');
  assert.equal(pageTitle('LueRevival', 'Search'), 'Search - LueRevival');
});

test('safeHttpUrl rejects non-http schemes', () => {
  assert.equal(safeHttpUrl('https://example.com/path'), 'https://example.com/path');
  assert.equal(safeHttpUrl(''), null);
  assert.throws(() => safeHttpUrl('javascript:alert(1)'), /Only http/);
});
