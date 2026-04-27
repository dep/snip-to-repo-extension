function slugify(s) {
  return (s || 'untitled')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'untitled';
}

function todayIso() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function getActiveTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function setStatus(msg, cls = '') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = cls;
}

async function init() {
  const { token, repos = [] } = await browser.storage.local.get(['token', 'repos']);
  if (!token || repos.length === 0) {
    document.getElementById('no-config').style.display = 'block';
    return;
  }
  document.getElementById('main').style.display = 'block';

  const sel = document.getElementById('repo');
  repos.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.label || `${r.owner}/${r.repo}`;
    sel.appendChild(opt);
  });

  const tab = await getActiveTab();
  document.getElementById('filename').value = `${todayIso()}-${slugify(tab.title)}.md`;

  const updateFolder = () => {
    document.getElementById('folder').value = repos[sel.value].folder || '';
  };
  sel.addEventListener('change', updateFolder);
  updateFolder();

  document.getElementById('save').addEventListener('click', onSave);
}

async function onSave() {
  const saveBtn = document.getElementById('save');
  saveBtn.disabled = true;
  setStatus('Extracting…');

  try {
    const { token, repos } = await browser.storage.local.get(['token', 'repos']);
    const repo = repos[document.getElementById('repo').value];
    const folder = document.getElementById('folder').value.trim().replace(/^\/+|\/+$/g, '');
    let filename = document.getElementById('filename').value.trim();
    if (!filename) throw new Error('Filename required');
    if (!filename.endsWith('.md')) filename += '.md';

    const tab = await getActiveTab();

    const [result] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['lib/Readability.js', 'lib/turndown.js', 'content.js']
    });
    const extracted = result.result;
    if (!extracted || !extracted.markdown) throw new Error('Failed to extract page content');

    setStatus('Committing to GitHub…');
    const path = folder ? `${folder}/${filename}` : filename;
    const resp = await browser.runtime.sendMessage({
      type: 'commit',
      token, repo, path,
      content: extracted.markdown,
      message: `Add ${filename}`
    });

    if (!resp.ok) throw new Error(resp.error);
    setStatus(`Saved: ${path}`, 'ok');
  } catch (e) {
    setStatus(`Error: ${e.message}`, 'err');
  } finally {
    saveBtn.disabled = false;
  }
}

document.getElementById('open-options')?.addEventListener('click', e => {
  e.preventDefault(); browser.runtime.openOptionsPage();
});
document.getElementById('open-options2')?.addEventListener('click', e => {
  e.preventDefault(); browser.runtime.openOptionsPage();
});

init();
