"use client";

import { useState } from "react";

const panels = [
  "Discovery",
  "Architecture",
  "Models",
  "Data",
  "Evaluation",
  "Integration",
  "Launch",
  "Support",
  "Handover",
];

const ExpandOnHover = () => {
  const [expandedImage, setExpandedImage] = useState(3);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  return (
    <div className="w-full h-screen bg-[#f5f4f3]">
      <div className="relative grid min-h-screen grid-cols-1 items-center justify-center p-2 transition-all duration-300 ease-in-out lg:flex w-full">
        <div className="w-full h-full overflow-hidden rounded-3xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
            <div className="relative w-full max-w-6xl px-5">
              <div className="flex w-full items-center justify-center gap-1">
                {panels.map((label, idx) => (
                  <div
                    key={label}
                    className="relative flex cursor-pointer items-end overflow-hidden rounded-3xl bg-neutral-900 p-4 text-white transition-all duration-500 ease-in-out"
                    style={{
                      width: getImageWidth(idx + 1),
                      height: "24rem",
                    }}
                    onMouseEnter={() => setExpandedImage(idx + 1)}
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandOnHover;
