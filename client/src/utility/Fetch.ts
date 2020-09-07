async function request(url: string, params?: any, method = 'GET') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  };

  const res = await fetch('api/' + url, options);
  const json = await res.json();

  if (res.status !== 200) return new Error(json.message);

  return json;
}

export const get = (url: string) => request(url);
export const create = (url: string, params: any) => request(url, params, 'POST');
export const update = (url: string, params: any) => request(url, params, 'PUT');
export const remove = (url: string) => request(url, undefined, 'DELETE');

