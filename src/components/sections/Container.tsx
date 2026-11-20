import React, { FC, ReactElement } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
type ContainerProps = {
  children: ReactElement;
  nextPageLink: string;
  nextPageText: string;
};
const Container: FC<ContainerProps> = ({
  children,
  nextPageLink,
  nextPageText,
}) => {
  return (
    <main className="w-full bg-mainGrayColor">
      <div className="container min-h-[100vh] min-h-[100svh] pt-[100px] sm:pt-[140px] pb-[48px] sm:pb-[80px] relative flex flex-col">
        <div className="flex-1 w-full">
          {children}
        </div>
        <Link to={nextPageLink} className="block w-fit mt-8">
          <button className="py-3 text-[1rem] md:text-[18px] text-mainDarkColor font-bold hover:text-black hover:scale-[1.08] transition-all duration-300 flex items-center gap-2 text-left">
            {nextPageText} <BsArrowRight />
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Container;
