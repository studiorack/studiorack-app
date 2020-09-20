const fetch = require('node-fetch');

async function get(url: string) {
  console.log('api.get', url);
  return fetch(url)
    .then((res: any) => res.text());
};

async function getJSON(url: string) {
  return fetch(url)
    .then((res: any) => res.json());
};

async function getRaw(url: string) {
  console.log('api.getRaw', url);
  return fetch(url)
    .then((res: any) => res.buffer());
};

export { get, getJSON, getRaw }
