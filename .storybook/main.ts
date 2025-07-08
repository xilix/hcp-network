import type { StorybookConfig } from '@storybook/react-webpack5';
const path = require('path');

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  webpackFinal: async (config) => {
    if (!config.resolve) return config;

    config.resolve.alias = {
      ...config.resolve.alias,
      '@app': path.resolve(__dirname, "../src"),
    };

    return config;
  }
};
export default config;