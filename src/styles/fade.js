import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Fade = styled.div`
  background: transparent;
  border-radius: 3px;
  color: palevioletred;
  margin: 0 1em;

  animation: ${fadeIn} 1s linear;
`;
