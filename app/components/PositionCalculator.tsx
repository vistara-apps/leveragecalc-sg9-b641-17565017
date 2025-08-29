"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { NumberInput } from "./ui/NumberInput";
import { InputSlider } from "./ui/InputSlider";
import { Tooltip } from "./ui/Tooltip";

interface PositionCalculatorProps {
  sendNotification: (notification: { title: string; body: string; }) => Promise<void>;
  entryPrice: number;
  setEntryPrice: (value: number) => void;
  stopLossPrice: number;
  setStopLossPrice: (value: number) => void;
  accountBalance: number;
  setAccountBalance: (value: number) => void;
  riskPercentage: number;
  setRiskPercentage: (value: number) => void;
}

export function PositionCalculator({ 
  sendNotification,
  entryPrice,
  setEntryPrice,
  stopLossPrice,
  setStopLossPrice,
  accountBalance,
  setAccountBalance,
  riskPercentage,
  setRiskPercentage
}: PositionCalculatorProps) {
  const [result, setResult] = useState<{
    positionSizeUSD: number;
    positionSizeUnits: number;
    riskAmount: number;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const savedResult = localStorage.getItem('leveragecalc_result');
      return savedResult ? JSON.parse(savedResult) : null;
    }
    return null;
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Save result to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (result) {
        localStorage.setItem('leveragecalc_result', JSON.stringify(result));
      }
    }
  }, [result]);

  const calculatePosition = async () => {
    // Reset previous error
    setError(null);
    
    // Validate inputs
    if (!accountBalance || accountBalance <= 0) {
      setError("Account balance must be greater than zero");
      return;
    }
    
    if (!entryPrice || entryPrice <= 0) {
      setError("Entry price must be greater than zero");
      return;
    }
    
    if (!stopLossPrice || stopLossPrice <= 0) {
      setError("Stop loss price must be greater than zero");
      return;
    }
    
    if (entryPrice === stopLossPrice) {
      setError("Entry price and stop loss price cannot be the same");
      return;
    }

    setIsCalculating(true);

    try {
      const riskAmount = (accountBalance * riskPercentage) / 100;
      const priceRisk = Math.abs(entryPrice - stopLossPrice);
      
      if (priceRisk === 0) {
        throw new Error("Price risk cannot be zero");
      }
      
      const positionSizeUnits = riskAmount / priceRisk;
      const positionSizeUSD = positionSizeUnits * entryPrice;

      // Validate results
      if (!isFinite(positionSizeUnits) || !isFinite(positionSizeUSD)) {
        throw new Error("Calculation resulted in invalid values");
      }

      const calculationResult = {
        positionSizeUSD,
        positionSizeUnits,
        riskAmount,
      };

      setResult(calculationResult);

      // Send notification
      await sendNotification({
        title: "Position Calculated! 📊",
        body: `Position size: $${positionSizeUSD.toFixed(2)} (${positionSizeUnits.toFixed(4)} units)`,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4 md:hidden">Position Size Calculator</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Tooltip content="Your total trading account balance in USD">
              <div className="flex items-center">
                <NumberInput
                  label="Account Balance"
                  value={accountBalance}
                  onChange={setAccountBalance}
                  currency="USD"
                  placeholder="Enter your account balance"
                />
                <span className="ml-1 text-text-secondary text-xs cursor-help">ⓘ</span>
              </div>
            </Tooltip>
          </div>

          <div className="flex items-center">
            <Tooltip content="The percentage of your account balance you're willing to risk on this trade. Most professional traders risk 1-2% per trade.">
              <div className="flex items-center w-full">
                <InputSlider
                  label="Risk Percentage"
                  value={riskPercentage}
                  onChange={setRiskPercentage}
                  min={0.5}
                  max={10}
                  step={0.5}
                  unit="%"
                />
                <span className="ml-1 text-text-secondary text-xs cursor-help">ⓘ</span>
              </div>
            </Tooltip>
          </div>

          <div className="flex items-center">
            <Tooltip content="The price at which you plan to enter the trade">
              <div className="flex items-center">
                <NumberInput
                  label="Entry Price"
                  value={entryPrice}
                  onChange={setEntryPrice}
                  currency="USD"
                  placeholder="Enter entry price"
                />
                <span className="ml-1 text-text-secondary text-xs cursor-help">ⓘ</span>
              </div>
            </Tooltip>
          </div>

          <div className="flex items-center">
            <Tooltip content="The price at which your stop loss will be triggered, limiting your potential loss">
              <div className="flex items-center">
                <NumberInput
                  label="Stop Loss Price"
                  value={stopLossPrice}
                  onChange={setStopLossPrice}
                  currency="USD"
                  placeholder="Enter stop loss price"
                />
                <span className="ml-1 text-text-secondary text-xs cursor-help">ⓘ</span>
              </div>
            </Tooltip>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <Button
            variant="primary"
            onClick={calculatePosition}
            disabled={isCalculating}
            className="w-full relative"
          >
            {isCalculating ? (
              <>
                <span className="opacity-0">Calculate Position</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Calculating...</span>
                </span>
              </>
            ) : (
              "Calculate Position"
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="animate-slide-up">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Calculation Results</h3>
            <div className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              Updated
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Position Size (USD):</span>
              <span className="font-semibold">${result.positionSizeUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Position Size (Units):</span>
              <span className="font-semibold">{result.positionSizeUnits.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Risk Amount:</span>
              <span className="font-semibold text-red-500">${result.riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Risk Percentage:</span>
              <span className="font-semibold">{riskPercentage}%</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
