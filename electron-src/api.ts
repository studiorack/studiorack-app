import request from 'sync-request'

async function get(url: string) {
  console.log('api.get', url);
  return await request('GET', url).getBody('utf8');
};

async function getJSON(url: string) {
  return JSON.parse(await get(url));
};

async function getRaw(url: string) {
  console.log('api.getRaw', url);
  return await request('GET', url).body;
};

export { get, getJSON, getRaw }
