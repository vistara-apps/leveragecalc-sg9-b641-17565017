
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'hsl(210 40% 96%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            backgroundImage: 'linear-gradient(90deg, hsl(204 70% 53%), hsl(180 70% 53%))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 48,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          LeverageCalc SG9
        </div>
        <div style={{ color: 'hsl(210 40% 40%)', fontSize: 24 }}>
          Optimal Crypto Position Sizing & Risk Management
        </div>
        <div style={{ 
          marginTop: 30,
          padding: '12px 24px',
          backgroundColor: 'hsl(204 70% 53%)',
          color: 'white',
          borderRadius: 10,
          fontSize: 20
        }}>
          Launch App
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
