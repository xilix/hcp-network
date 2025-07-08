import React from 'react';
import { useHcpDetails } from '../hooks/useHcpDetails';
import styled from 'styled-components';
import { BodyText, TopLevelSection, MainBackground, TitleText } from '../mixins';

const Container = styled.section`
  ${BodyText};
  text-align: left;

  h3 {
    ${TitleText};
  }

  .metrics {
    display: flex;
    list-style: none;
    gap: 8px;
    width: 100%;
    justify-content: stretch;
    padding: 0px;
    margin: 0px;

    li {
      ${TopLevelSection};
      background-color: ${MainBackground};
      flex-grow: 1;

      p {
        font-weight: 600;
        ${TitleText};
      }
    }
  }
`

export interface DetailsProps {
  selected: string;
}
export const Details = ({selected}: DetailsProps) => {
  const node = useHcpDetails(selected);

  if (!node) {
    return null;
  }

  return (
    <Container>
      <ul className="metrics">
        <li>
          <header>Patients served</header>
          <p>{node.patients}</p>
        </li>
        <li>
          <header>Success rate</header>
          <p>{node.success} %</p>
        </li>
      </ul>
      <h3>About</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
      </p>
      <h3>Publications</h3>
      <ul>
        {node.publications.map(
          (publication, id) => <li key={id}>{publication.params[1]}</li>
        )}
      </ul>
      <h3>Work experience</h3>
      <ul>
        {node.workHistory.map(
          (workPlace, id) => <li key={id}>{workPlace}</li>
        )}
      </ul>
    </Container>
  )
};

export default Details;