"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ 
  children, 
  content, 
  position = "top" 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };
  
  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-xs">
            {content}
          </div>
          <div 
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}

