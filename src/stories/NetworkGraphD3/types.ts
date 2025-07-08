
export interface NodeDatum {
  index: number;
  value: string;
  name: string;
  image: string;
  type: string;
  peers: string[];
  coworkers: string[];
  radius: number;
  strength: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface LinkDatum {
  type: string;
  name: string;
  source: NodeDatum;
  target: NodeDatum;
}