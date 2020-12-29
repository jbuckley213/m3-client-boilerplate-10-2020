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
    
    font-size:1.2rem;
  }
 
  p {
    margin-bottom:5px;
    font-size:0.8rem;
`}
`;

export const MessagePreviewSelected = styled.div`
  ${(props) =>
    props.isSelected &&
    css`
  background-color: #57ba98;

  h3{
    color:white;
  }
 
  p {
    color:white
`}
`;
