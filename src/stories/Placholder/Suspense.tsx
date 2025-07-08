import styled, { css } from 'styled-components'

const GentleBlink = css`
  @keyframes fadeInOutAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation-timing-function: ease-in-out;
  animation: fadeInOutAnimation 1.5s infinite;
  animation-direction: alternate-reverse;
`

// TODO: use themes
export const DynamicImportPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #999;

  border-radius: 8px;

  &.line {
    border-radius: 4px;
    height: 24px;
  }

  ${GentleBlink}
`
