import styled, { css } from "styled-components";

export const ProfileButton = styled.div`
  ${(props) =>
    props.highlight &&
    css`
      ${"" /* border: 0.1rem solid #3b945e; */}
      border-radius: 5px;
    `}
`;
