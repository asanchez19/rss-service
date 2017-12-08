const test = require('ava');
const server = require('../src');

test('exposed content', async (t) => {
  t.is(!!server.HTTP, true);
});
