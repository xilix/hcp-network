/*
import { useState, useEffect } from 'react';
import { Link, Node } from '@app/data/types';
import { NodeDatum, LinkDatum } from '../NetworkGraphD3/types';

export const processApiToD3 = (nodesRaw: Node[], linksRaw: Link[]) => {
  const [nodes, setNodes] = useState<NodeDatum[]>([])
  const [links, setLinks] = useState<LinkDatum[]>([])

  useEffect(() => {
    import('./processApiToD3').then(module => {
      const obj = module.processApiToD3(nodesRaw, linksRaw);
      setNodes(obj.nodes);
      setLinks(obj.links);
    });
  }, [ nodesRaw, linksRaw ])

  return { nodes, links };
}*/