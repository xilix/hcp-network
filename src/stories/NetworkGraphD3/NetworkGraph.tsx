import React, { useEffect, useState, useMemo, WheelEvent, useRef } from 'react';
import { NodeDatum, LinkDatum } from './types'
import { useD3ForceSimulation } from '../hooks/useD3ForceSimulation';
import { useDrag } from '../hooks/useDrag';
import styled from 'styled-components';
import { Badge } from '../mixins';

const Container = styled.div`
  position: relative;
  .link-description {
    position: absolute;
    max-width: 50px;
    height: 15px;
    z-index: 10;
    ${Badge};
  }
  line {
    cursor: help;
  }
`

// To only render nodes in view port
interface ViewPort {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface NetworkGraphProps {
  width?: number;
  height?: number;
  onSelect?: (data: string) => void;
  selected?: string | null;
  data: {nodes: NodeDatum[]; links: LinkDatum[];};
}
export const NetworkGraph = ({
  data,
  onSelect,
  selected,
  width = 640,
  height = 400
}: NetworkGraphProps) => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line
  const [_, setSimulation] = useState(null);
  const [hoverNode, setHoverNode] = useState<NodeDatum | null>(null);

  const { pos, dragging, onDragStart, onDrag, onDragEnd, center } = useDrag();
  const [zoom, setZoom] = useState(100);
  const [linkDescription, setLinkDescription] = useState('');
  const [linkPos, setLinkPos] = useState({top: 0, left: 0});

  const selectedNode = useMemo(() => {
    if (!selected) {
      return;
    }

    return nodes.find(n => n.value === selected);
  }, [nodes, selected]);

  useEffect(() => {
    setReady(false);
    const {simulation} = useD3ForceSimulation(
      data.nodes, data.links,
      (nodes, links) => {
        setNodes([...nodes]);
        setLinks([...links]);
        if (selectedNode && !ready) {
          selectedNode.x = 0;
          selectedNode.y = 0;
          selectedNode.fx = 0;
          selectedNode.fy = 0;
        }
      }
    );

    setNodes([...data.nodes]);
    setLinks([...data.links]);
    setSimulation(simulation);

    const tid1 = setTimeout(() => {
      setReady(true);
    }, 500);

    const tid2 = setTimeout(() => {
      simulation.stop();
    }, 5000); 

    return () => {
      clearTimeout(tid1);
      clearTimeout(tid2);
      simulation.stop();
    }
  }, [data.nodes, data.links, selectedNode, width, height]);

  useEffect(() => {
    center(0, 0);
  }, [selectedNode?.value])

  const renderNode = (node: NodeDatum, key: string) => (
    <Node
      datum={node} key={key}
      onHover={() => setHoverNode(node)}
      onSelect={() => onSelect && onSelect(node.value)}
      hoverNode={hoverNode}
      selectedNode={selectedNode}
      viewPort={viewPort}
    />
  )

  const viewPort = {
    left: pos.x - width * 100 / zoom,
    right: pos.x + 2 * width * 100 / zoom,
    top: pos.y + height * 100 / zoom,
    bottom: pos.y - 2 * height * 100 / zoom
  }

  const hangeZoom = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY;

    const prevZoom = zoom;
    let nextZoom = zoom;
    if (delta < 0) {
      nextZoom = Math.min(150, zoom + 10);
      setZoom(nextZoom);
    }
    if (delta > 0) {
      nextZoom = Math.max(20, zoom - 10);
      setZoom(nextZoom);
    }

    center(pos.x * nextZoom / prevZoom, pos.y * nextZoom / prevZoom);
    return false;
  }

  return (
    <Container ref={svgRef}>
      <div className="link-description" style={{...linkPos, display: linkDescription ? 'block' : 'none'}}>{linkDescription}</div>
      <svg
        onMouseDown={onDragStart}
        onMouseMove={(e: React.MouseEvent) => {
          if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            setLinkPos({top: e.clientY - rect.top - 23, left: e.clientX - rect.left -50});
          }
          onDrag(e);
        }}
        onMouseUp={onDragEnd}
        onMouseOver={() => setHoverNode(null)}
        onMouseLeave={() => {setHoverNode(null); onDragEnd(); setLinkDescription('')}}
        onWheel={hangeZoom}
        width={width} height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        style={{maxWidth: "100%", height: "auto", cursor: (dragging ? 'grabbing' : 'default')}}
      >
      {ready && (
      <g transform={`matrix(${zoom / 100} 0 0 ${zoom / 100} ${pos.x} ${pos.y})`} >
        <g stroke="#999" strokeOpacity="0.6">
          {links?.map((link, ind) => <Link
            datum={link} key={ind} hoverNode={hoverNode} selectedNode={selectedNode}
            viewPort={viewPort}
            id={ind}
            onInfo={(s: string) => setLinkDescription(s)}
          />)}
        </g>
        <g stroke="#fff" strokeWidth="1.5" role="listbox">
          {nodes?.filter(node => node.value !== hoverNode?.value &&  node.value !== selectedNode?.value).map((node, ind) => {
            return renderNode(node, ind.toString())
          })}
          {hoverNode && renderNode(hoverNode, 'hoverNode')}
          {selectedNode && renderNode(selectedNode, 'selectedNode') }
        </g>
        </g>
      )}
      </svg>
    </Container>
  );
}

interface NodeProps {
  datum: NodeDatum;
  onHover: () => void;
  onSelect: () => void;
  hoverNode?: NodeDatum;
  selectedNode?: NodeDatum;
  viewPort: ViewPort;
}
const Node = ({datum, onHover, hoverNode, selectedNode, onSelect, viewPort}: NodeProps) => {
  const isHighlited = hoverNode?.index === datum.index;
  const isSelected = selectedNode?.index === datum.index;
  const isHoveringSomeWhereElse = !!hoverNode && !isHighlited;

  if (-datum.x/2 > viewPort.right || -datum.x/2 < viewPort.left) {
    return null;
  }

  if (-datum.y/2 > viewPort.top || -datum.y/2 < viewPort.bottom) {
    return null;
  }

  const imageRadius = datum.radius - 3;

  return (
    <g
      style={{cursor: "pointer"}}
      onMouseOver={(event) => {
        event.stopPropagation();
        onHover();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      role="option"
    >
      <circle
        r={datum.radius}
        cx={datum.x/2}
        cy={datum.y/2}
        fill={"lightgray"}
        fillOpacity={!isSelected && isHoveringSomeWhereElse ? "0.5" : "1"}
        strokeWidth={isSelected ? "3" : isHighlited ? "5" : "0"}
        strokeOpacity={isSelected ? "1" : isHighlited ? "0.5" : "0"}
        stroke={isSelected ? "green" : isHighlited ? "gray" : "none"}
      />

      <defs>
        <pattern
          id={"image" + datum.index}
          x={datum.x/2 - imageRadius} y={datum.y/2 - imageRadius}
          patternUnits="userSpaceOnUse"
          height={2 * imageRadius} width={2 * imageRadius}
        >
          <image
            x="0" y="0" 
            height={2 * imageRadius} width={2 * imageRadius}
            xlinkHref={datum.image}
          ></image>
        </pattern>
      </defs>

      <circle
        r={datum.radius - 3}
        cx={datum.x/2}
        cy={datum.y/2}
        fill={"url(#image" + datum.index + ")"}
        fillOpacity={!isSelected && isHoveringSomeWhereElse ? "0.2" : "1"}
      />

      {(isSelected || isHighlited) && (
        <text
          data-testid={isSelected ? "selected-node" : ""}
          x={datum.x/2} y={datum.y/2 + datum.radius}
          textAnchor="middle"
          strokeOpacity={isSelected ? "1" : isHighlited ? "0.5" : "0"}
          strokeWidth="1" dy=".5em"
          stroke={isSelected || isHighlited ? "black" : "gray"}
          filter="url(#solid)"
        >
          {datum.name}
        </text>
      )}
    </g>
  );
}

interface LinkProps {
  datum: LinkDatum;
  hoverNode?: NodeDatum;
  selectedNode?: NodeDatum;
  id: number;
  viewPort: ViewPort;
  onInfo: (s: string) => void;
}
const Link = ({datum, hoverNode, selectedNode, id, viewPort, onInfo}: LinkProps) => {
  const isHovering = hoverNode?.index === datum.source.index || hoverNode?.index === datum.target.index;
  const isSelected = selectedNode?.index === datum.source.index || selectedNode?.index === datum.target.index;
  const isHoveringSomeWhereElse = !!hoverNode && !isSelected && !isHovering;

  const [isLinkHovering, setIsLinkHovering] = useState(false);

  if (
    (-datum.source.x/2 < viewPort.left && -datum.source.x/2 > viewPort.right) &&
    (-datum.target.x/2 < viewPort.left && -datum.target.x/2 > viewPort.right)
  ) {
    return null;
  }
  if (
    (-datum.source.y/2 < viewPort.bottom && -datum.source.y/2 > viewPort.top) &&
    (-datum.target.y/2 < viewPort.bottom && -datum.target.y/2 > viewPort.top)
  ) {
    return null;
  }

  const colorMap: {[k: string]: string} = {
    peer: "blue",
    coworker: "green"
  }

  return (
    <g>
      <line
        onMouseOver={() => {setIsLinkHovering(true); onInfo(datum.type)}}
        onMouseLeave={() => {setIsLinkHovering(false); onInfo('')}}
        id={`line${id}`}
        strokeOpacity={!!hoverNode && !isHovering ? "0.2" : "1"}
        strokeWidth={2 + (isHovering || isLinkHovering ? 2 : isHoveringSomeWhereElse ? -1 : 0)}
        x1={datum.source.x/2}
        y1={datum.source.y/2}
        x2={datum.target.x/2}
        y2={datum.target.y/2}
        stroke={isSelected ? colorMap[datum.type] : isHovering ? "black" : "gray"}
      />
      {datum.type !== "indirect" && (!hoverNode || isHovering) && (
      <text onClick={() => console.log('bbb')}>
        <textPath xlinkHref={`#line${id}`} startOffset="50%" textAnchor="middle">{datum.name}</textPath>
      </text>
      )}
    </g>
  );
};

export default NetworkGraph;