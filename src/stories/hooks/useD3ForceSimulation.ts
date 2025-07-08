import * as d3 from "d3";
import { NodeDatum, LinkDatum } from '../NetworkGraphD3/types';

export const useD3ForceSimulation = (
  nodes: NodeDatum[], links: LinkDatum[],
  onTick: (nodes: NodeDatum[], link: LinkDatum[]) => undefined
) => {
  const simulation = d3.forceSimulation(nodes);
  simulation.force(
      "link",
      d3.forceLink(links)
        .id((d) => d.index)
        .distance(200)
    )
    .force("charge", d3.forceManyBody().strength(n => -(n as any).strength * 50))
    // .force("link", d3.forceLink(links).strength(10).distance(100).iterations(10))
    .force("collide", d3.forceCollide((d) => 2 * d.radius))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  simulation.on('tick', () => {
    onTick([...simulation.nodes()], [...links]);
  });

  return { simulation };
}