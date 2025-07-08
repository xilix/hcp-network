import React, { useEffect, useState, Suspense } from 'react';

import './page.css';
import mockData from '@app/data/network.json';
import { NodeDatum, LinkDatum, NetworkGraph } from './NetworkGraphD3';

import { processApiToD3 } from './hooks/processApiToD3';
import { bfs } from './utils/bfs';
import styled from 'styled-components';
import { DynamicImportPlaceholder } from '@app/stories/Placholder';
import { Filter } from './Filter';
import { Overview } from './Overview';
import { Details } from './Details';
import { MainBackground, TopLevelSection, DefaultFont } from './mixins';

import "@fontsource/montserrat";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/400-italic.css";

const Layout = styled.article`
  ${DefaultFont};
  background-color: ${MainBackground};
  padding: 16px;

  display: grid; 
  grid-template-columns: 1fr 1fr; 
  grid-template-rows: 44px 20px 375px 1fr; 
  gap: 16px;
  grid-template-areas:
    "search search"
    "title title"
    "overview network"
    "details network";

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr; 
    grid-template-rows: 44px 20px 375px 1fr 1fr; 
    gap: 16px;
    grid-template-areas:
      "search"
      "title"
      "overview"
      "details"
      "network";
  }

  .overview {
    grid-area: overview;
  }
  .details {
    grid-area: details;
  }
  .search {
    grid-area: search;
    display: flex;
    align-items: center;
    overflow: visible;
    justify-content: stretch;
    align-items: center;
    padding: 8px;
  }
  .network {
    grid-area: network;

  }
  .everyone {
    grid-area: everyone;
  }

  .title {
    margin: 0px;
    padding: 0px;
  }
`

const PeerSpaceItem = styled.section`
  ${TopLevelSection}
  overflow: auto;
  position: relative;
`

export const Page: React.FC = () => {
  const [selected, setSelected] = useState<string>("('Researcher', '0009-0004-7701-8513')");
  const [nodes, setNodes] = useState<NodeDatum[]>([]);
  const [links, setLinks] = useState<LinkDatum[]>([]);

  useEffect(() => {
    const data = processApiToD3(mockData.nodes, mockData.edges);
  
    const first = data.nodes.find(n => n.value === selected);
    const nodes: NodeDatum[] = [first];
    const links: LinkDatum[] = [];

    if (first) {
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
      );
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
      );

      setNodes(nodes);
      setLinks(links);
    }
  }, [selected])

  return (
    <Layout className={!selected ? 'noSelection' : ''}>
      <PeerSpaceItem className="search" aria-live="polite">
        <Filter onSelect={(nodeId: string) => {
          console.log('a', nodeId);
          setSelected(nodeId);
        }} />
      </PeerSpaceItem>

      <h3 className="title">PeerSpace</h3>

      <PeerSpaceItem className="overview" aria-live="assertive">
        <Suspense fallback={<DynamicImportPlaceholder />}>
          <Overview selected={selected} />
        </Suspense>
      </PeerSpaceItem>

      <PeerSpaceItem className="details" aria-live="polite">
        <Suspense fallback={<DynamicImportPlaceholder />}>
          <Details selected={selected} />
        </Suspense>
      </PeerSpaceItem>

      <PeerSpaceItem className="network" aria-live="off">
        <Suspense fallback={<DynamicImportPlaceholder />}>
          <NetworkGraph width={600} height={800} data={{nodes, links}} selected={selected} onSelect={(nodeId: string) => setSelected(nodeId)} />
        </Suspense>
      </PeerSpaceItem>
    </Layout>
  );
};
