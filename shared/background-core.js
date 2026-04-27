function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function getExistingSha(token, repo, path) {
  const url = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(repo.branch)}`;
  const r = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' }
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.sha;
}

async function commitFile({ token, repo, path, content, message }) {
  const sha = await getExistingSha(token, repo, path);
  const url = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const body = {
    message,
    content: utf8ToBase64(content),
    branch: repo.branch
  };
  if (sha) body.sha = sha;

  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`GitHub PUT ${r.status}: ${await r.text()}`);
  return r.json();
}

async function handleCommit(msg) {
  try {
    const result = await commitFile(msg);
    return { ok: true, result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
