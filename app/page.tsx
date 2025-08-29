"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { PositionCalculator } from "./components/PositionCalculator";
import { AISuggestions } from "./components/AISuggestions";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  
  // Load saved tab from localStorage or default to "calculator"
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leveragecalc_activeTab') || "calculator";
    }
    return "calculator";
  });
  
  // Shared state for calculator parameters with localStorage persistence
  const [entryPrice, setEntryPrice] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('leveragecalc_entryPrice') || '0');
    }
    return 0;
  });
  
  const [stopLossPrice, setStopLossPrice] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('leveragecalc_stopLossPrice') || '0');
    }
    return 0;
  });
  
  const [accountBalance, setAccountBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('leveragecalc_accountBalance') || '10000');
    }
    return 10000;
  });
  
  const [riskPercentage, setRiskPercentage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('leveragecalc_riskPercentage') || '2');
    }
    return 2;
  });

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const sendNotification = useNotification();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);
  
  // Save values to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leveragecalc_activeTab', activeTab);
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leveragecalc_entryPrice', entryPrice.toString());
    }
  }, [entryPrice]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leveragecalc_stopLossPrice', stopLossPrice.toString());
    }
  }, [stopLossPrice]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leveragecalc_accountBalance', accountBalance.toString());
    }
  }, [accountBalance]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leveragecalc_riskPercentage', riskPercentage.toString());
    }
  }, [riskPercentage]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleSendNotification = useCallback(async (notification: { title: string; body: string; }) => {
    try {
      await sendNotification(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [sendNotification]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddFrame}
          className="text-primary border-primary/20 hover:bg-primary/5"
        >
          + Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-primary animate-fade-out">
          <span>✓ Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary">
      <div className="w-full max-w-7xl mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-6 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            LeverageCalc SG9
          </h1>
          <p className="text-text-secondary">
            Optimal Crypto Position Sizing & Risk Management
          </p>
        </div>

        {/* Mobile view (tab-based) */}
        <div className="md:hidden">
          <Card className="mb-6">
            <div className="flex rounded-lg bg-surface p-1">
              <Button
                variant={activeTab === "calculator" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTab("calculator")}
                className="flex-1"
              >
                Calculator
              </Button>
              <Button
                variant={activeTab === "ai" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTab("ai")}
                className="flex-1"
              >
                AI Suggestions
              </Button>
            </div>
          </Card>

          <main className="flex-1">
            {activeTab === "calculator" && (
              <PositionCalculator 
                sendNotification={handleSendNotification}
                entryPrice={entryPrice}
                setEntryPrice={setEntryPrice}
                stopLossPrice={stopLossPrice}
                setStopLossPrice={setStopLossPrice}
                accountBalance={accountBalance}
                setAccountBalance={setAccountBalance}
                riskPercentage={riskPercentage}
                setRiskPercentage={setRiskPercentage}
              />
            )}
            {activeTab === "ai" && (
              <AISuggestions 
                sendNotification={handleSendNotification}
                setEntryPrice={setEntryPrice}
                setStopLossPrice={setStopLossPrice}
                setActiveTab={setActiveTab}
              />
            )}
          </main>
        </div>

        {/* Desktop view (side-by-side) */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Position Calculator</h2>
              <PositionCalculator 
                sendNotification={handleSendNotification}
                entryPrice={entryPrice}
                setEntryPrice={setEntryPrice}
                stopLossPrice={stopLossPrice}
                setStopLossPrice={setStopLossPrice}
                accountBalance={accountBalance}
                setAccountBalance={setAccountBalance}
                riskPercentage={riskPercentage}
                setRiskPercentage={setRiskPercentage}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
              <AISuggestions 
                sendNotification={handleSendNotification}
                setEntryPrice={setEntryPrice}
                setStopLossPrice={setStopLossPrice}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-text-secondary text-xs border-none"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
