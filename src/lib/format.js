function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMessage(value = '') {
  let html = escapeHtml(value);
  html = html.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>');
  html = html.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>');
  html = html.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<del>$1</del>');
  html = html.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<div class="quoted-message">$1</div>');
  html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" rel="nofollow ugc noopener" target="_blank">$1</a>');
  return html.replace(/\n/g, '<br>');
}

function slugify(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || 'untitled';
}

function pageTitle(siteName, page) {
  return page ? `${page} - ${siteName}` : siteName;
}

function safeHttpUrl(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new URL(raw);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http:// and https:// URLs are allowed.');
  }
  return parsed.toString();
}

module.exports = { escapeHtml, renderMessage, slugify, pageTitle, safeHttpUrl };
