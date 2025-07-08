import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { NetworkGraph, NodeDatum, LinkDatum } from './NetworkGraphD3';
import mockData from '../data/network.json';

import { processApiToD3 } from './hooks/processApiToD3';
import { bfs } from './utils/bfs';

const meta = {
  title: 'Example/NetworkGraph',
  component: NetworkGraph,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NetworkGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NetworkDisplay: Story = {
  args: {data: {nodes: [], links: []}, width: 800, height: 600},
  render: (args) => {
    const data = processApiToD3(mockData.nodes, mockData.edges);

    const first = data.nodes.find(n => n.value === "('Researcher', '0009-0004-7701-8513')");
    const nodes: NodeDatum[] = [first];
    const links: LinkDatum[] = [];

    const isSelectedLink = (source: NodeDatum, target: NodeDatum) => {
      return  target.value === first.value || source.value === first.value;
    };
    bfs<NodeDatum>(
      first, "peers",
      (peer: string) => data.nodes.find(n => n.value === peer),
      (source: NodeDatum, target: NodeDatum) => {
        nodes.push(target);
        links.push({source, target, name: "peer", type: isSelectedLink(source, target) ? "peer" : "indirect"});
      }
    )
    bfs<NodeDatum>(
      first, "coworkers",
      (peer: string) => data.nodes.find(n => n.value === peer),
      (source: NodeDatum, target: NodeDatum) => {
        if (isSelectedLink(source, target) && links.find(l => l.source.value === source.value && l.target.value === target.value)) {
          return;
        }
        nodes.push(target);
        links.push({source, target, name: "coworker", type: isSelectedLink(source, target) ? "coworker" : "indirect"});
      }
    )

    return (<NetworkGraph {...args} data={{nodes, links}} selected={first.value} />);
  }
};