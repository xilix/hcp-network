const express = require('express');
const serverless = require('serverless-http');
const hcpData = require('./server/mock.json');
const networkData = require('./server/network.json');
const { selectNodeGraph } = require('./server/bfs');

//////////////////////////////////////
const values = networkData.nodes.map(
  (n, ind) => ({name: n.lastName + ' ' + n.name, ind})
);
values.sort((a, b) => a.name > b.name ? 1 : -1);

const app = express();
const router = express.Router();

router.get('/suggest', (req, res) => {
  const str = decodeURIComponent(req.query.s || '');
  const filter = new RegExp(str, 'i');

  res.json(values.filter(value => filter.test(value.name))
                  .slice(0, 100)
                  .map(value => networkData.nodes[value.ind]));
});

//////////////////////////////////////
router.get('/hcp', (req, res) => {
  const filter = decodeURIComponent(req.query.s || '');
  res.json(hcpData[filter] || null);
});

////////////////////////////////////
router.get('/list', (req, res) => {
  const selected = decodeURIComponent(req.query.s || '');
  const data = selectNodeGraph(selected);
  res.json(data);
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

/*
Project Created

Admin URL:  https://app.netlify.com/projects/hcp-network
URL:        https://hcp-network.netlify.app
Project ID: a5aa6850-60e1-4368-8182-5497b8827b19
*/