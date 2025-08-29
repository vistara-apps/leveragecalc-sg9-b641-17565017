
"use client";

import { type InputHTMLAttributes } from "react";

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  currency?: string;
  unit?: string;
}

export function NumberInput({
  label,
  currency,
  unit,
  className = "",
  ...props
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-caption font-semibold text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          className={`input-field w-full ${currency ? 'pr-16' : unit ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {currency && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-caption">
            {currency}
          </div>
        )}
        {unit && !currency && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-caption">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
