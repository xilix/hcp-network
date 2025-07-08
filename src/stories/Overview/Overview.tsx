import React from 'react';
import { HcpMap } from '../HcpMap';
import styled from "styled-components";
import { useHcpDetails } from '../hooks/useHcpDetails';
import { BodyText, Badge, TitleText } from '../mixins';


const Summary = styled.header`
  text-align: center;
  ${BodyText};

  .avatar {
    margin-top: -70px;
    margin-left: -50px;
    width: 100px;
    height: 100px;
    border: 5px solid white;
    border-radius: 100px;
    overflow: hidden;
    display: inline-block;
    position: absolute;
    z-index: 9;
    img {
      width: 100px;
      height: 100px;
    }
  }

  .name {
    margin-top: 50px;
    ${TitleText};
  }

  .overview-line {
    display: flex;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
  }
  .keyword {
    ${Badge};
  }

  .social-metric {
    border-left: 1px solid #979797;
    padding-left: 8px;
    display: inline-block;
  }
  .social-metric:first-child {
    paddin-left: 8px;
    border: none;
  }
`

export interface OverviewPros {
  selected: string;
}
export const Overview = ({selected}: OverviewPros) => {
  const node = useHcpDetails(selected);

  if (!node) {
    return selected ;
  }

  return (
    <Summary>
      <HcpMap coordinates={node?.coordinates} />
      <div className="avatar">
        <img src={node.avatar}  />
      </div>
      <h3 className="name">{`${node.lastName}, ${node.name}`}</h3>
      <p className="overview-line">
        <span className="keyword">{node.job}</span>
        <span className="keyword">{`${node.age}, ${node.country}`}</span>
      </p>
      <p className="overview-line">{node.bio}</p>
      <p className="overview-line">
        <span className="social-metric">Peers<br />{node.peers.length}</span>
        <span className="social-metric">Following<br />{node.following}</span>
      </p>
    </Summary>
  );
};

export default Overview;