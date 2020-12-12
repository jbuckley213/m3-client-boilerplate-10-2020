import styled, { css } from "styled-components";

export const Theme = styled.div`
  ${(props) =>
    props.dark &&
    css`
    width:100%;
  background-color: rgb(68, 68, 68);
  height:100%;
  
  h1 {
    color: palevioletred;
  }
  p {
    color: white;
`}
`;

export const ThemeConversation = styled.div`
  ${(props) =>
    props.dark &&
    css`
    width:100%;
  background-color: rgb(68, 68, 68);
  height:auto;
  
  h1 {
    color: palevioletred;
  }
  p {
    color: white;
`}
`;
