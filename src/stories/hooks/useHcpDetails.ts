import mockData from '@app/data/mock.json';
import { HCP } from '@app/data/types';
import { useQuery } from '@tanstack/react-query';

export const useHcpDetails = (id: string) => {

  const query = useQuery<HCP>({ queryKey: ['details', id], queryFn: () => {
    return (mockData as any).nodes[id] as HCP | undefined;
  }});

  return query.data;
}