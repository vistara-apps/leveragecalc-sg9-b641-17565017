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
  const [activeTab, setActiveTab] = useState("calculator");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const sendNotification = useNotification();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

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
      <div className="w-full max-w-md mx-auto px-4 py-3">
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
            <PositionCalculator sendNotification={handleSendNotification} />
          )}
          {activeTab === "ai" && (
            <AISuggestions sendNotification={handleSendNotification} />
          )}
        </main>

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
