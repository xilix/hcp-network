import React from 'react';
import { createRoot } from 'react-dom/client';
import { Page } from './stories/Page';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

const boostrap = () => {
  const container = document.getElementById('app');
  const root = createRoot(container!);

  root.render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  )
}

boostrap();