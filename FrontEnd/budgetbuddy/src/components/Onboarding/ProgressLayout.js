import React from "react";
import { Outlet } from "react-router-dom";
import { Progress } from "./Progress";

export const ProgressLayout = () => {
  return (
    <div>
      <Progress />
      <Outlet />
    </div>
  );
};
