const hcpData = require('./mock.json');
const networkData = require('./network.json');

const bfs = (first, type, find, save) => {
  let dequeue  = [first];
  let enqueue  = [];
  const registred = [first.index];
  while (dequeue.length > 0) {
    enqueue = [];
    dequeue.forEach(levelNode => {
      levelNode[type].forEach(peer => {
        if (registred.indexOf(peer) === -1) {
          const node = find(peer);
          save(levelNode, node);
          registred.push(node.index);
          enqueue.push(node);
        }
      });
    });
    dequeue = enqueue;
  }
}

const selectNodeGraph = (selected) => {

  const first = networkData.nodes.find(n => n.index === selected);
  const nodes = [first];
  const links = [];

  if (first) {
    const isSelectedLink = (source, target) => {
      return  target.index === first.index || source.index === first.index;
    };
    bfs(
      first, "peers",
      (peer) => networkData.nodes.find(n => n.index === peer),
      (source, target) => {
        nodes.push(target);
        links.push({source, target, name: "peer", type: isSelectedLink(source, target) ? "peer" : "indirect"});
      }
    );
    bfs(
      first, "coworkers",
      (peer) => networkData.nodes.find(n => n.index === peer),
      (source, target) => {
        if (isSelectedLink(source, target) && links.find(l => l.source.index === source.index && l.target.index === target.index)) {
          return;
        }
        nodes.push(target);
        links.push({source, target, name: "coworker", type: isSelectedLink(source, target) ? "coworker" : "indirect"});
      }
    );
    return {nodes, links};
  } else {
    return {nodes: [], links: []};
  }
}

module.exports = {
  bfs,
  selectNodeGraph
}