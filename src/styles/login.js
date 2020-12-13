import styled, { css } from "styled-components";

export const AuthStyle = styled.div`
  ${() =>
    css`
    width:100%;
  background-color: #f2f2f2;
  height: 100%;
  form{
      display:flex;
      flex-direction:column;
      align-items:center;
      margin:20px 0
  }
  h1 {
    text-align:center;
    padding: 20px 0 10px 0;
    font-size:2rem;
    margin:0 auto;
    width:80%;
    border-bottom: 0.1rem solid  #3b945e;
  }
  button{
      width:50%;
      margin: 20px 0;
  }
  p{
    margin: 0 auto;
   text-align:center;
  }
  input {
    margin: 20px auto;
    width:70%;
`}
`;

export const SignUpStyle = styled.div`
  ${() =>
    css`
    width:100%;
  background-color: #f2f2f2;
  height: auto;
  padding-bottom:200px;
  form{
      display:flex;
      flex-direction:column;
      align-items:center;
      margin:10px 0
  }
  h1 {
    text-align:center;
    padding: 20px 0 10px 0;
    font-size:2rem;
    margin:0 auto;
    width:80%;
    border-bottom: 0.1rem solid  #3b945e;
  }
  button{
      width:50%;
      margin: 20px auto;
  }
  p{
    margin: 0 auto;
   text-align:center;
  }
  div{
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  input {
    margin: 5px auto;
    width:70%;
`}
`;
