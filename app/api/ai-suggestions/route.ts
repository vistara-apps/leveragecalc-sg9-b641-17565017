
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const { tradingPair } = await request.json();

    if (!tradingPair) {
      return NextResponse.json(
        { error: 'Trading pair is required' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert crypto trading risk management advisor. Analyze the trading pair ${tradingPair} and provide risk management suggestions.

Consider:
- Current market volatility patterns
- Historical price movements for this asset
- General crypto market conditions
- Risk management best practices

Provide suggestions for:
1. Stop loss percentage (as a decimal, e.g., 0.05 for 5%)
2. Risk-reward ratio (just the reward multiplier, e.g., 2.5 for 1:2.5)
3. Brief reasoning (2-3 sentences)
4. Volatility assessment (1 sentence)

Respond with a JSON object in this exact format:
{
  "stopLossLevel": 0.05,
  "riskRewardRatio": 2.5,
  "reasoning": "Your reasoning here",
  "volatilityAssessment": "Your assessment here"
}
`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a professional crypto trading risk management advisor. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('No response from AI');
    }

    try {
      const aiSuggestion = JSON.parse(responseText);
      
      const suggestion = {
        tradingPair,
        stopLossLevel: aiSuggestion.stopLossLevel || 0.05,
        riskRewardRatio: aiSuggestion.riskRewardRatio || 2.0,
        reasoning: aiSuggestion.reasoning || "Standard risk management principles applied based on current market conditions.",
        volatilityAssessment: aiSuggestion.volatilityAssessment || "Moderate volatility expected."
      };

      return NextResponse.json({ suggestion });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback suggestion
      const fallbackSuggestion = {
        tradingPair,
        stopLossLevel: 0.05,
        riskRewardRatio: 2.0,
        reasoning: "Conservative risk management approach with standard 5% stop loss and 1:2 risk-reward ratio suitable for current market conditions.",
        volatilityAssessment: "Moderate volatility expected based on historical patterns."
      };

      return NextResponse.json({ suggestion: fallbackSuggestion });
    }
  } catch (error) {
    console.error('AI Suggestions API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}
