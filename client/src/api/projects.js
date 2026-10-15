//async fetch calls to the backend
const BASE = '/api/projects';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message = data.errors
      ? data.errors.join(', ')
      : data.error || 'Something went wrong';
    throw new Error(message);
  }
  return data;
}

export async function fetchProjects(status = '') {
  const url = status ? `${BASE}?status=${encodeURIComponent(status)}` : BASE;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createProject(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateProject(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteProject(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
