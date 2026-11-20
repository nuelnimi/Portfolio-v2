import React, { FC, ReactElement } from "react";
import HScroll from "../UI/HScroll";

type scrollContainerProps = {
  children: ReactElement[];
  width: number;
  displayWidgets: boolean;
};

const ScrollContainers: FC<scrollContainerProps> = ({ children }) => {
  return (
    <HScroll className="flex items-center gap-x-4 flex-nowrap pb-2">
      {children}
    </HScroll>
  );
};

export default ScrollContainers;
