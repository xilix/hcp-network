export interface Node {
  index: string;
  name: string,
  lastName: string,
  image: string,
  type: string;
  peers: string[];
  coworkers: string[];
}

export interface HCP {
  index: string;
  publications: Array<{id: string; params: string[];}>;
  peers: Array<{id: string; params: string[];}>;
  coworkers: string[];
  name: string;
  lastName: string;
  bio: string;
  following: number;
  country: string;
  coordinates: [number, number];
  success: number;
  patients: number;
  avatar: string;
  age: number;
  job: string;
  workPlace: string;
  workHistory: string[];
  label: string;
}

export interface Link {
  source: string;
  target: string;
}

export interface Data {
  nodes: Node[];
  links: Link[];
}