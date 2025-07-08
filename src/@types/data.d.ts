import { HCP, Data, Link } from '@app/data/types';

declare module "*mock.json" {
   interface HcpData {
      nodes: {
         [k: string]: HCP
      },
      links: Link[]
   }
   const data: HcpData;

   export = data
}

declare module "*network.json" {
   const data: Data;

   export = data
}