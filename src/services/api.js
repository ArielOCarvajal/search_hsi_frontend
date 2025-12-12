const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function getAllUsers(limit = 50, offset = 0) {
  const response = await fetch(
    `${API_BASE_URL}/users?limit=${limit}&offset=${offset}`
  );
  return handleResponse(response);
}

export async function getUserById(id) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return handleResponse(response);
}

export async function searchUsers(filters, limit = 50, offset = 0) {
  const params = new URLSearchParams({
    ...filters,
    limit: limit.toString(),
    offset: offset.toString()
  });

  const response = await fetch(
    `${API_BASE_URL}/users/search?${params.toString()}`
  );
  return handleResponse(response);
}

export async function login(usuario, contrasena) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, contrasena })
  });
  return handleResponse(response);
}

// Helper para futuras llamadas autenticadas
export function getAuthHeaders() {
  const token = localStorage.getItem('hsi_auth_token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}
