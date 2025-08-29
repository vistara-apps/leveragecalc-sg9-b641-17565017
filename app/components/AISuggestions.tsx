"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface AISuggestionsProps {
  sendNotification: (notification: { title: string; body: string; }) => Promise<void>;
  setEntryPrice: (value: number) => void;
  setStopLossPrice: (value: number) => void;
  setActiveTab: (tab: string) => void;
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

export function AISuggestions({ 
  sendNotification,
  setEntryPrice,
  setStopLossPrice,
  setActiveTab
}: AISuggestionsProps) {
  const [tradingPair, setTradingPair] = useState("ETH/USD");
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async () => {
    // Reset previous error
    setError(null);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to generate suggestion (${response.status})`
        );
      }

      const data = await response.json();
      
      if (!data.suggestion) {
        throw new Error("Invalid response from AI service");
      }
      
      setSuggestion(data.suggestion);

      // Send notification
      await sendNotification({
        title: "AI Suggestion Ready! 🤖",
        body: `${tradingPair} analysis complete with ${data.suggestion.confidence}% confidence`,
      });
    } catch (error) {
      console.error("Error generating suggestion:", error);
      setError(error instanceof Error ? error.message : "Failed to generate AI suggestions");
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const popularPairs = ["ETH/USD", "BTC/USD", "SOL/USD", "MATIC/USD"];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4 md:hidden">AI Risk Parameter Suggestions</h2>
        
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <Button
            variant="primary"
            onClick={generateSuggestion}
            disabled={isLoading}
            className="w-full relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Get AI Suggestions</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Analyzing...</span>
                </span>
              </>
            ) : (
              "Get AI Suggestions"
            )}
          </Button>
        </div>
      </Card>

      {suggestion && (
        <Card className="animate-slide-up">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">AI Analysis for {suggestion.tradingPair}</h3>
            <div className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              AI Generated
            </div>
          </div>
          
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
                if (suggestion) {
                  // Transfer AI suggestions to calculator
                  setEntryPrice(suggestion.entryPrice);
                  setStopLossPrice(suggestion.stopLoss);
                  
                  // Switch to calculator tab
                  setActiveTab("calculator");
                  
                  // Send notification
                  sendNotification({
                    title: "Parameters Applied! 🔄",
                    body: `AI suggestions have been applied to the calculator`,
                  });
                }
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
