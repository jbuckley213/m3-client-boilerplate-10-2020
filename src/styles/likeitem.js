import styled, { css } from "styled-components";

export const LikeItem = styled.div`
  ${() =>
    css`
background-color: white;
top:0;
display:flex;
jusifty-content:space-between;
align-items:center; 
width:100%;
margin:0 auto;

img{
  width:25px;
  height:25px;
  border-radius:50%;
  margin:5px 10px;
}

p {
  margin-bottom:5px;
  font-size:0.8rem;
`}
`;
