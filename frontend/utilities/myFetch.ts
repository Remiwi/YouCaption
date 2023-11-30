export function fetchGet(url: string, options?: any) {
  const headers = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };

  const mergedOptions: RequestInit = { ...headers, ...options };

  return fetch(url, { ...headers, ...options });
}

export function fetchPost(url: string, options?: any) {
  const headers = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  };

  return fetch(url, { ...headers, ...options });
}