// WelcomePage.js
import React from "react";
import { Welcome } from "../components/Onboarding/Welcome";
import styled from "styled-components";

export const WelcomePage = () => {
  return (
    <StyledWelcomeWrapper>
      <Welcome />
    </StyledWelcomeWrapper>
  );
};

const StyledWelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  width: 630px;
  margin: 0 auto;
`;
