import styled, { css } from "styled-components";

export const Theme = styled.div`
  ${(props) =>
    props.dark &&
    css`
    width:100%;
  background-color: rgb(0, 0, 0) ;
  ${"" /* height:100%; */}
  height:100%;
  
  h1 {
    color: palevioletred;
  }
  div.post-main{
    background-color:rgb(29, 41, 53);
    color: white;
  }
  div.message-preview{
    background-color:rgb(29, 41, 53);

  }
  div.notifications-menu{
    background-color:rgb(29, 41, 53);

  }
  div#nav-space{
    background-color: rgb(0, 0, 0) ;

  }
  nav.navbar{
    background-color: rgb(0, 0, 0) ;

  }
  button.button{
    background-color:rgb(29, 41, 53);
    color:white;

  }

  input {
    background-color: rgb(0, 0, 0) ;
    color:white;
  }

  textarea{
    background-color: rgb(0, 0, 0) ;
    color:white;
  }
  div{
    color:white;
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
    background-color:rgb(29, 41, 53);
  height:auto;
  
  h1 {
    color: palevioletred;
  }
  .post-main{
    background-color:rgb(80, 80, 80);
    color: white;
  } 
  .admin-message p{
    color:white;
  }
  p {
    color: palevioletred;
`}
`;
