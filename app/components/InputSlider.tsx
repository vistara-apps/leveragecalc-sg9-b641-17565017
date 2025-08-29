
"use client";

import { type InputHTMLAttributes } from "react";

interface InputSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InputSlider({
  label,
  unit,
  min = 0,
  max = 100,
  step = 1,
  value,
  className = "",
  ...props
}: InputSliderProps) {
  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-caption font-semibold text-text-primary">
            {label}
          </label>
          <span className="text-caption text-text-secondary">
            {value}{unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={`w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider ${className}`}
        {...props}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(204 70% 53%);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(204 70% 53%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
