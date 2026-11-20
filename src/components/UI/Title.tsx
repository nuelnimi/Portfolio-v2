import React, { FC } from "react";
import { Fade } from "react-awesome-reveal";

type TitleProps = {
  text: string;
  topOfPage: boolean;
  subtitle?: string;
  smallSize?: boolean;
  /** heading level; defaults to h1 for the page title, h2 for sections */
  level?: 1 | 2;
};

const Title: FC<TitleProps> = ({
  text,
  topOfPage,
  subtitle,
  smallSize,
  level,
}) => {
  const Heading = (level ?? (topOfPage ? 1 : 2)) === 1 ? "h1" : "h2";
  return (
    <header className={`${topOfPage ? "mb-3" : "mt-10 sm:mt-12 mb-3"}`}>
      <Fade direction="up" cascade={true} triggerOnce={true} damping={0.5}>
        <Heading
          className={`${
            smallSize
              ? `text-[23px] sm:text-[25px] md:text-[30px]`
              : "text-[32px] xs:text-[38px] sm:text-[45px] md:text-[50px] break-words"
          } text-mainDarkColor font-bold leading-[1.3]`}
        >
          {text}
        </Heading>
      </Fade>
      {subtitle && (
        <p className="mt-3 text-[1rem] sm:text-[1.1rem] text-mainDarkColor">
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default Title;
