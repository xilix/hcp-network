const test = require('./test.json');
const { faker } = require('@faker-js/faker');
const fs = require('node:fs');

const parseId = (id) => {
  const strToArr = (...args) => {
    return args;
  };
  const params = eval("strToArr" + id);
  return params;
}

const peers = {};
const publications = {};
const publishers = {};
const library = {};
const coworkers = {};
const workHistory = {};

const nodes = [];
const edges = [];

const HCP = "Researcher";
const PUBLICATION = ["BookPublication", "OtherPublication"];
const PUBLISHER = "Publisher";
const types = [];

const recordPublisher = (type, target, source) => {
  publishers[target] = publishers[target] || {publications: [], peers: []};
  publishers[target][type].push(source);
  publishers[target][type] = Array.from(new Set(publishers[target][type]));

  if (type !== 'peers') {
    library[source] = target;
  } else {
    workHistory[source] = workHistory[source] || [];
    workHistory[source].push(parseId(target)[1]);
    workHistory[source] = Array.from(new Set(workHistory[source]));
  }
};

const record = (_arr, target, source) => {
  _arr[target] = _arr[target] || [];
  _arr[target].push(source);
  _arr[target] = Array.from(new Set(_arr[target]));
};

test.edges.forEach((edge, index) => {
  const targetP = parseId(edge.target);
  const sourceP = parseId(edge.source);
  edge.targetP = targetP;
  edge.sourceP = sourceP;
  if (targetP[0] === HCP) {
    if (PUBLICATION.indexOf(sourceP[0]) !== -1) {
      record(peers, edge.source, edge.target);
      record(publications, edge.target, edge.source);
    }
  }
  if (sourceP[0] === HCP) {
    if (PUBLICATION.indexOf(targetP[0]) !== -1) {
      record(peers, edge.target, edge.source);
      record(publications, edge.source, edge.target);
    }
  }
  if (targetP[0] === PUBLISHER) {
    if (sourceP[0] === HCP) {
      recordPublisher('peers', edge.target, edge.source);
    } else if (PUBLICATION.indexOf(sourceP[0]) !== -1) {
      recordPublisher('publications', edge.target, edge.source);
    }
  }
  if (sourceP[0] === PUBLISHER) {
    if (targetP[0] === HCP) {
      recordPublisher('peers', edge.source, edge.target);
    } else if (PUBLICATION.indexOf(targetP[0]) !== -1) {
      recordPublisher('publications', edge.source, edge.target);
    }
  }
});

Object.keys(publications).forEach(researcher => {
  const publcationByHcp = publications[researcher];
  publcationByHcp.forEach(publication => {
    const publisherId = library[publication];
    const publisher = publishers[publisherId];
    if (publisher && publisher.peers.indexOf(researcher) === -1) {
      publisher.peers = publisher.peers.concat(researcher);
      publisher.peers = Array.from(new Set(publisher.peers));
    }
  });
});

const workPlaces = {};
Object.keys(publishers).forEach(publisherId => {
  const publisher = publishers[publisherId];
  publisher.peers.forEach(peer => {
    workPlaces[peer] = publisherId;

    workHistory[peer] = workHistory[peer] || [];
    workHistory[peer].push(parseId(publisherId)[1]);
    workHistory[peer] = Array.from(new Set(workHistory[peer]));

    coworkers[peer] = coworkers[peer] || [];
    coworkers[peer] = Array.from(new Set(coworkers[peer].concat(publisher.peers.filter(p => p !== peer))));
  })
});

Object.keys(test.nodes).forEach((index, mapId) => {
  const node = test.nodes[index];
  const params = parseId(index);
  types.push(params[0]);
  if (params[0] === HCP) {
    node.publications = [];
    node.peers = [];
    node.publications = publications[index] || [];
    node.publications.forEach(publication => {
      if (peers[publication]) {
        node.peers = peers[publication].filter(peerIndex => peerIndex !== index);
      }
    });
    node.publications = node.publications.map(publication => ({id: publication, params: parseId(publication)}))
    faker.seed(index);
    node.name = faker.person.firstName();
    node.lastName = faker.person.lastName();
    node.bio = faker.person.bio();
    node.following = Math.ceil(Math.random() * 100);
    if (Math.random() < 0.7) {
      node.following = 0;
    }
    node.country = faker.location.county();
    node.coordinates = [faker.location.longitude(), faker.location.latitude()];
    node.success = Math.ceil(Math.random() * 50 + 50);
    node.patients = Math.ceil(Math.random() * 2000);
    node.avatar = faker.image.avatar();
    node.job = faker.person.jobType();
    node.workPlace = workPlaces[index];
    node.workHistory = workHistory[index] || [];
    node.age = 25 + Math.floor(41 * Math.random());
    node.index = index;
    node.coworkers = coworkers[index];
    node.type = params[0];
    nodes.push({
      index,
      name: node.name,
      lastName: node.lastName,
      image: node.avatar,
      peers: node.peers,
      type: params[0],
      coworkers: coworkers[index] || [],
    });
  } else if (params[0] === PUBLISHER) {

  }
});

fs.writeFileSync('./functions/network.json', JSON.stringify({nodes, edges}, null, 2));
fs.writeFileSync('./functions/mock.json', JSON.stringify(test));
