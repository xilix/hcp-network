import * as d3 from "d3";
import { Link, Node } from '@app/data/types';
import mockData from '@app/data/mock.json';

// https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
/*
    cyrb53a (c) 2023 bryc (github.com/bryc)
    License: Public domain. Attribution appreciated.
    The original cyrb53 has a slight mixing bias in the low bits of h1.
    This shouldn't be a huge problem, but I want to try to improve it.
    This new version should have improved avalanche behavior, but
    it is not quite final, I may still find improvements.
    So don't expect it to always produce the same output.
*/
const cyrb53a = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
  h1 ^= h2 >>> 16; h2 ^= h1 >>> 16;
    return 2097152 * (h2 >>> 0) + (h1 >>> 11);
};

export const processApiToD3 = (dataNodes: Node[], dataLinks: Link[]) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const map: {[k: string]: number} = {};

  const nodes = dataNodes.map((node, index) => {
    map[node.index] = index;

    return {
      ...node,
      name: (mockData as any).nodes[node.index].name + ' ' + (mockData as any).nodes[node.index].lastName,
      image: (mockData as any).nodes[node.index].avatar,
      index: cyrb53a(node.index),
      value: node.index,
      strength: (node.peers?.length || 0) + (node.coworkers?.length || 0) + 1,
      color: color("0"),
      radius: 30,
    };
  });

  const links = dataLinks.map((link, index) => {
    return {
      index,
      source: nodes[map[link.source]!],
      target: nodes[map[link.target]!],
    }
  });

  return {nodes, links};
}