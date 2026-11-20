import React from "react";
import { useGlobalContext } from "../../context";

const FilterButtons = () => {
  const { filterButtons, selectFilterButton, selectedFilterButton } =
    useGlobalContext();
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <header className="flex items-center justify-start sm:justify-center gap-1 min-w-fit">
        {filterButtons.map((button, index: number) => {
          return (
            <button
              key={index}
              className={`px-4 py-3 whitespace-nowrap ${
                button === "All" ? "min-w-[80px]" : "min-w-[130px] sm:min-w-[160px]"
              } rounded-[10px] cursor-pointer transition duration-300 ${
                selectedFilterButton === button && "bg-mainDarkColor text-white"
              }`}
              onClick={() => {
                selectFilterButton(button);
              }}
            >
              {button}
            </button>
          );
        })}
      </header>
    </div>
  );
};

export default FilterButtons;
