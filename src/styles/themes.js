import styled, { css } from "styled-components";

export const Theme = styled.div`
  ${(props) =>
    props.dark &&
    css`
  background-color: rgb(68, 68, 68);
  h1 {
    color: palevioletred;
  }
  p {
    color: white;
`}
`;