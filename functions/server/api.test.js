const test = require('node:test');
const assert = require('node:assert');
const { selectNodeGraph } = require('./bfs');

test('extract the sub graph where the node belongs', (t, done) => {

  const {nodes, links} = selectNodeGraph("('Researcher', '0009-0004-7701-8513')");

  assert.strictEqual(1333, nodes.length);
  assert.strictEqual(1332, links.length);
  done();
});