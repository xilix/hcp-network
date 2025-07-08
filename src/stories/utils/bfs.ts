export const bfs = <NodeDatum extends {peers: string[], coworkers: string[], value: string}>(first: NodeDatum, type: 'peers' | 'coworkers', find: (id: string) => NodeDatum, save: (source: NodeDatum, target: NodeDatum) => void) => {
  let dequeue: NodeDatum[]  = [first];
  let enqueue: NodeDatum[]  = [];
  const registred: string[] = [first.value];
  while (dequeue.length > 0) {
    enqueue = [];
    dequeue.forEach(levelNode => {
      levelNode[type].forEach(peer => {
        if (registred.indexOf(peer) === -1) {
          const node = find(peer);
          save(levelNode, node);
          registred.push(node.value);
          enqueue.push(node);
        }
      });
    });
    dequeue = enqueue;
  }
}
