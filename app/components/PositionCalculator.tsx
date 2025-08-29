"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { NumberInput } from "./ui/NumberInput";
import { InputSlider } from "./ui/InputSlider";

interface PositionCalculatorProps {
  sendNotification: (notification: { title: string; body: string; }) => Promise<void>;
}

export function PositionCalculator({ sendNotification }: PositionCalculatorProps) {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLossPrice, setStopLossPrice] = useState<number>(0);
  const [result, setResult] = useState<{
    positionSizeUSD: number;
    positionSizeUnits: number;
    riskAmount: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePosition = async () => {
    if (!entryPrice || !stopLossPrice || entryPrice <= 0 || stopLossPrice <= 0) {
      return;
    }

    setIsCalculating(true);

    try {
      const riskAmount = (accountBalance * riskPercentage) / 100;
      const priceRisk = Math.abs(entryPrice - stopLossPrice);
      const positionSizeUnits = riskAmount / priceRisk;
      const positionSizeUSD = positionSizeUnits * entryPrice;

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
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Position Size Calculator</h2>
        
        <div className="space-y-4">
          <NumberInput
            label="Account Balance"
            value={accountBalance}
            onChange={setAccountBalance}
            currency="USD"
            placeholder="Enter your account balance"
          />

          <InputSlider
            label="Risk Percentage"
            value={riskPercentage}
            onChange={setRiskPercentage}
            min={0.5}
            max={10}
            step={0.5}
            unit="%"
          />

          <NumberInput
            label="Entry Price"
            value={entryPrice}
            onChange={setEntryPrice}
            currency="USD"
            placeholder="Enter entry price"
          />

          <NumberInput
            label="Stop Loss Price"
            value={stopLossPrice}
            onChange={setStopLossPrice}
            currency="USD"
            placeholder="Enter stop loss price"
          />

          <Button
            variant="primary"
            onClick={calculatePosition}
            disabled={isCalculating || !entryPrice || !stopLossPrice}
            className="w-full"
          >
            {isCalculating ? "Calculating..." : "Calculate Position"}
          </Button>
        </div>
      </Card>

      {result && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Calculation Results</h3>
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
