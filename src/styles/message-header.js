import styled, { css } from "styled-components";

export const MessageHeader = styled.div`
  ${() =>
    css`
background-color: #f2f2f2;
position:sticky;
top:0;
display:flex;
 jusifty-content:space-evenly;
align-items:center; 
width:100%;
z-index:6;

img{
  width:50px;
  height:50px;
  border-radius:50%;
  margin:5px 10px;
}
h3{
  margin: 0 10px;
  font-size:1.3rem;
}

p {
  margin-bottom:5px;
  font-size:0.8rem;
`}
`;
