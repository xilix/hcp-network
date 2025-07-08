import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageStroy: Story = {
  args: {},
  render: () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );
  },
};
