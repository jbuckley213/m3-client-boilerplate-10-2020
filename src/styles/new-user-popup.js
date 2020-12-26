import styled, { css } from "styled-components";

export const PopUp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  padding: 30px 0;

  background-color: rgb(0, 0, 0, 0.4);
`;

export const PopUpMenu = styled.div`
  ${() =>
    css`
      border-radius: 10px;
      margin-top: 200px;
      border: 1px solid #3b945e;
      padding: 30px;
      background-color: white;
      width: 60%;
      height: 250px;
      overflow: auto;
    `}

  h1 {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.4rem;
  }
`;
