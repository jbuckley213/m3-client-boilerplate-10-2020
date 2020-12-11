import styled, { css } from "styled-components";

export const MessagePreview = styled.div`
  ${() =>
    css`
  background-color: #f2f2f2;
img{
    width:30px;
    height:30px;
    border-radius:50%;
    margin:5px 10px;
}
  h3{
    margin:0 10px;
    font-size:1.2rem;
  }
 
  p {
    margin-left:10px;
    font-size:0.8rem;
`}
`;
