import React from 'react';
import styled from 'styled-components'
import type { Meta, StoryObj } from '@storybook/react';

import { DynamicImportPlaceholder } from './Placholder';

const meta = {
  title: 'Example/Placholder',
  component: DynamicImportPlaceholder,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DynamicImportPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

const CotainerExample = styled.div`
  width: 800px;
  height: 500px;
`
export const DynamicImportPlaceholderContainer: Story = {
  args: {},
  render: () => {
    return <CotainerExample>
      <DynamicImportPlaceholder />
    </CotainerExample>;
  }
};

const LinesExample = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;

  .line {
    width: 80%;
  }
`
export const DynamicImportPlaceholderLines: Story = {
  args: {},
  render: () => {
    return (<LinesExample>
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
      <DynamicImportPlaceholder className="line" />
    </LinesExample>);
  }
};
