export function fetchGet(url: string, options?: any) {
  const headers = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };

  const mergedOptions: RequestInit = { ...headers, ...options };
  return fetch(url, { ...headers, ...options });
}

export function fetchGetWithBody(url: string, options?: any) {
  const headers = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions: RequestInit = { ...headers, ...options };
  return fetch(url, mergedOptions);
}

export function fetchPost(url: string, options?: any) {
  const headers = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  };

  return fetch(url, { ...headers, ...options })
  .then(response => {
    if (!response.ok) {
      if (response.status == 401) {
        throw new Error('Please log in');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    return response.json();
  });
}

export function fetchPostJSON(url: string, options?: any) {
  const headers = {
    'Content-Type': 'application/json' 
  };

  return fetch(url, { 
    method: 'POST', 
    mode: 'cors',
    credentials: 'include',
    headers: { ...headers, ...options?.headers },
    ...options
  })
  .then(response => {
    if (!response.ok) {
      if (response.status == 401) {
        throw new Error('Please log in');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    return response.json();
  });
}
