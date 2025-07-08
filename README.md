# 🚀 Welcome to your new awesome project!

This project has been created using **create-webpack-app**, you can now run

## Install ##

```bash
npm ci
```

It is designed to be deployed in netlify. 
If you want to deploy it using cli, install netlify-cli and run

```bash
netlify sites:create
```

## Build ##

To create the forntend artifact

```bash
npm run build:frontend
```

## Deploy ##

To deploy it you will need to link it to an account. See Install section.

Then you will need to build the frontend artifact. See Build section.

Then you can deploy it using 

```bash
npm run deploy
```

Initally it was using a node js server to transfer the data to the frontend. But I got problems on the size
of the responses. Even if it only transfer a subrgaph with the nodes related to a HCP the response size can
get over the maximum allowed response size for the free subscription.

Some extra egnineering need to be done in order to optimize it. There are some potential solutions to that.
The data format can be compressed quite a lot, the graph can be streamed, group the graph nodes, limit
the levels of the graph so it will show the nodes up to some fixed distance, etc...

For the sake of demo I have rolled the data as a mock data inside the frontend files.