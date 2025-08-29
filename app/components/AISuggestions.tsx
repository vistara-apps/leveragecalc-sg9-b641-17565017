"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface AISuggestionsProps {
  sendNotification: (notification: { title: string; body: string; }) => Promise<void>;
}

interface AISuggestion {
  tradingPair: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  confidence: number;
  reasoning: string;
}

export function AISuggestions({ sendNotification }: AISuggestionsProps) {
  const [tradingPair, setTradingPair] = useState("ETH/USD");
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tradingPair }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestion");
      }

      const data = await response.json();
      setSuggestion(data.suggestion);

      // Send notification
      await sendNotification({
        title: "AI Suggestion Ready! 🤖",
        body: `${tradingPair} analysis complete with ${data.suggestion.confidence}% confidence`,
      });
    } catch (error) {
      console.error("Error generating suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const popularPairs = ["ETH/USD", "BTC/USD", "SOL/USD", "MATIC/USD"];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">AI Risk Parameter Suggestions</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Trading Pair
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {popularPairs.map((pair) => (
                <Button
                  key={pair}
                  variant={tradingPair === pair ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setTradingPair(pair)}
                >
                  {pair}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={generateSuggestion}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Analyzing..." : "Get AI Suggestions"}
          </Button>
        </div>
      </Card>

      {suggestion && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">AI Analysis for {suggestion.tradingPair}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-text-secondary">Entry Price</span>
                <span className="text-lg font-semibold">${suggestion.entryPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="block text-sm text-text-secondary">Stop Loss</span>
                <span className="text-lg font-semibold text-red-500">${suggestion.stopLoss.toFixed(2)}</span>
              </div>
              <div>
                <span className="block text-sm text-text-secondary">Take Profit</span>
                <span className="text-lg font-semibold text-green-500">${suggestion.takeProfit.toFixed(2)}</span>
              </div>
              <div>
                <span className="block text-sm text-text-secondary">Risk/Reward</span>
                <span className="text-lg font-semibold">1:{suggestion.riskRewardRatio.toFixed(1)}</span>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-3">
              <span className="block text-sm text-text-secondary mb-1">AI Confidence</span>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${suggestion.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{suggestion.confidence}%</span>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-3">
              <span className="block text-sm text-text-secondary mb-2">Reasoning</span>
              <p className="text-sm">{suggestion.reasoning}</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // This would pre-fill the calculator with these values
                console.log("Using AI suggestions in calculator");
              }}
            >
              Use These Parameters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
