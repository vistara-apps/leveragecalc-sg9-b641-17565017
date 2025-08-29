
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://localhost:3000";
  return {
    title: "LeverageCalc SG9",
    description: "Optimal Crypto Position Sizing & Risk Management",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/api/og`,
        button: {
          title: "Launch LeverageCalc SG9",
          action: {
            type: "launch_frame",
            name: "LeverageCalc SG9",
            url: URL,
            splashImageUrl: `${URL}/api/splash`,
            splashBackgroundColor: "#f1f5f9",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
