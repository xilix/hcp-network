import React from 'react';
import '@testing-library/jest-dom'

import { NetworkGraph } from './NetworkGraph';
import { screen, render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import { LinkDatum, NodeDatum } from './types';

const mockData: {nodes: NodeDatum[], links: LinkDatum[]} = {
  nodes: [
    {
      index: 0,
      value: "('Researcher', 'eels')",
      name: "Mr Eel",
      image: "https://avatars.githubusercontent.com/u/31012700",
      peers: ["('Researcher', 'hovercraft')"],
      type: "Researcher",
      radius: 20,
      strength: 10,
      x: 0,
      y: 0,
      coworkers: []
    },
    {
      index: 0,
      value: "('Researcher', 'hovercraft')",
      name: "Mr Hovercraft",
      image: "https://avatars.githubusercontent.com/u/31012700",
      peers: ["('Researcher', 'hovercraft')"],
      type: "Researcher",
      radius: 20,
      strength: 10,
      x: 0,
      y: 0,
      coworkers: []
    }
  ],
  links: [] as LinkDatum[]
};

mockData.links.push({
  type: "peer",
  name: "peer",
  source: mockData.nodes[0],
  target: mockData.nodes[1]
})



describe("NetworkGraph", () => {
  afterEach(() => {
    cleanup();
  });

  it("render a network graph", async () => {
    const onSelect = jest.fn();
    render(
      <NetworkGraph
        data={{nodes: mockData.nodes, links: mockData.links}}
        selected="('Researcher', 'eels')"
        onSelect={onSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Mr Eel")).toBeInTheDocument();
    });
  });

  it("interact with a network graph", async () => {
    const onSelect = jest.fn();
    render(
      <NetworkGraph
        data={{nodes: mockData.nodes, links: mockData.links}}
        selected="('Researcher', 'hovercraft')"
        onSelect={onSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Mr Hovercraft")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole("option")[0]);

    expect(onSelect).toHaveBeenCalledWith("('Researcher', 'eels')");
  });
});