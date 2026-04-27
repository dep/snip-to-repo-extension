const reposEl = document.getElementById('repos');
const tpl = document.getElementById('repo-template');

function addRepoRow(repo = {}) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.querySelector('.label').value = repo.label || '';
  node.querySelector('.owner').value = repo.owner || '';
  node.querySelector('.repo-name').value = repo.repo || '';
  node.querySelector('.branch').value = repo.branch || 'main';
  node.querySelector('.folder').value = repo.folder || '';
  node.querySelector('.remove').addEventListener('click', () => node.remove());
  reposEl.appendChild(node);
}

function collect() {
  const repos = [...reposEl.querySelectorAll('.repo')].map(n => ({
    label: n.querySelector('.label').value.trim(),
    owner: n.querySelector('.owner').value.trim(),
    repo: n.querySelector('.repo-name').value.trim(),
    branch: n.querySelector('.branch').value.trim() || 'main',
    folder: n.querySelector('.folder').value.trim().replace(/^\/+|\/+$/g, '')
  })).filter(r => r.owner && r.repo);
  return { token: document.getElementById('token').value.trim(), repos };
}

async function load() {
  const { token = '', repos = [] } = await browser.storage.local.get(['token', 'repos']);
  document.getElementById('token').value = token;
  if (repos.length === 0) addRepoRow();
  else repos.forEach(addRepoRow);
}

document.getElementById('add').addEventListener('click', () => addRepoRow());
document.getElementById('save').addEventListener('click', async () => {
  const data = collect();
  await browser.storage.local.set(data);
  const s = document.getElementById('status');
  s.textContent = 'Saved.';
  setTimeout(() => s.textContent = '', 2000);
});

load();
