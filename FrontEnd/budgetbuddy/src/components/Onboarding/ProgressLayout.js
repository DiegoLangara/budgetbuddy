import React from "react";
import { Outlet } from "react-router-dom";
import { Progress } from "./Progress";
import styled from "styled-components";

export const ProgressLayout = () => {
  return (
    <StyledProgressLayout>
      <Progress />
      <Outlet />
    </StyledProgressLayout>
  );
};

const StyledProgressLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  width: 630px;
  margin: 0 auto;
`;
