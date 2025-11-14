"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface ConnectionHandleProps {
  position: "left" | "right";
  visible?: boolean;
}

export const ConnectionHandle: React.FC<ConnectionHandleProps> = ({
  position,
  visible = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Visual line indicator */}
      <div
        className={`
          pointer-events-none absolute top-44 -translate-y-12 z-0
          flex h-24 w-px items-center
          bg-gradient-to-b from-transparent via-white to-transparent
          transition-opacity duration-300
          ${visible ? "opacity-100" : "opacity-0"}
          ${position === "right" ? "-right-px" : "-left-px"}
        `}
      />
      
      {/* Visual handle button - indicates draggable handle position */}
      <div
        className={`
          absolute top-44 -translate-y-12 z-20 pointer-events-none
          flex h-24 items-center
          transition-opacity duration-300
          ${visible || isHovered ? "opacity-100" : "opacity-0"}
          ${position === "right" ? "-right-8 left-80" : "-left-8 right-80"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`p-5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isHovered ? "scale-110 bg-white/10" : "scale-100 bg-white/5"}`}
        >
          <Plus
            className={`h-6 w-6 transition-colors duration-200 ${
              isHovered ? "text-white" : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </>
  );
};
