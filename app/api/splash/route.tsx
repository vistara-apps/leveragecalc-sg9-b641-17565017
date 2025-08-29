
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
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(90deg, hsl(204 70% 53%), hsl(180 70% 53%))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          📊
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: 'hsl(210 40% 15%)',
            marginBottom: 10,
          }}
        >
          LeverageCalc SG9
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'hsl(210 40% 40%)',
          }}
        >
          Loading your risk management tools...
        </div>
      </div>
    ),
    {
      width: 800,
      height: 600,
    }
  );
}
