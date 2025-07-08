import mockData from '@app/data/network.json';
import { Node } from '@app/data/types';
import { useQuery } from '@tanstack/react-query';

const values: Array<{name: string, ind: number}> = mockData.nodes.map(
  (n, ind) => ({name: n.lastName + ' ' + n.name, ind})
);
values.sort((a, b) => a.name > b.name ? 1 : -1);

export const useSuggestHcp = (str: string): Node[] => {
  const query = useQuery<Node[], Error>({ queryKey: ['suggestions', str], queryFn: () => {
    if (str) {
      const filter = new RegExp(str, 'i');
      return values.filter(value => filter.test(value.name))
                  .slice(0, 100)
                  .map(value => mockData.nodes[value.ind] as Node)
    } else {
      return [];
    }
  }});

  return query?.data || [];
}