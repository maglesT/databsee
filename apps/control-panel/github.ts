// The customer config files in the GitHub repository, read and committed through the GitHub REST API.
export interface Repo {
  customers(): Promise<string[]>;
  read(customer: string): Promise<{ text: string; sha: string }>;
  /** Commits the new file; fails if it changed since it was read (sha). Returns the commit id. */
  write(customer: string, text: string, sha: string, message: string): Promise<string>;
  /** Result of the apply run for a commit: success, failure, in_progress, queued, or none. */
  applyResult(commit: string): Promise<string>;
}

export function githubRepo(fullName: string, token: string, branch = 'main'): Repo {
  const api = async (path: string, init: RequestInit = {}) => {
    const r = await fetch(`https://api.github.com/repos/${fullName}/${path}`, {
      ...init,
      headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' },
    });
    if (!r.ok) throw new Error(`GitHub ${init.method ?? 'GET'} ${path}: ${r.status} ${await r.text()}`);
    return r.json();
  };
  return {
    async customers() {
      const files: { name: string }[] = await api(`contents/customers?ref=${branch}`);
      return files.map((f) => f.name).filter((n) => /^[a-z][a-z0-9_]*\.yaml$/.test(n) && n !== 'example.yaml').map((n) => n.slice(0, -5));
    },
    async read(customer) {
      const f = await api(`contents/customers/${customer}.yaml?ref=${branch}`);
      return { text: Buffer.from(f.content, 'base64').toString('utf8'), sha: f.sha };
    },
    async write(customer, text, sha, message) {
      const r = await api(`contents/customers/${customer}.yaml`, {
        method: 'PUT', body: JSON.stringify({ message, content: Buffer.from(text).toString('base64'), sha, branch }),
      });
      return r.commit.sha;
    },
    async applyResult(commit) {
      const r = await api(`actions/workflows/apply.yml/runs?head_sha=${commit}`);
      const run = r.workflow_runs?.[0];
      return run ? (run.status === 'completed' ? run.conclusion : run.status) : 'none';
    },
  };
}
