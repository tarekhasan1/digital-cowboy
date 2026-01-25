// lib/email-va/groq.ts
// FREE AI using Groq (14,400 requests/day)

import { getPrompt } from './firebase';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqAI {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
  }

  /**
   * Classify email intent
   * Returns: { intent: string, priority: string }
   */
  async classifyIntent(emailContent: string): Promise<{
    intent: 'sales' | 'support' | 'hiring' | 'spam' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    confidence: number;
  }> {
    // Try to get prompt from Firestore, fallback to default
    let systemPrompt = await getPrompt('classify');
    
    if (!systemPrompt) {
      systemPrompt = `You are an email classifier for a software agency.
Classify emails into: sales, support, hiring, spam, other
Assign priority: low, medium, high, urgent

Return ONLY valid JSON:
{"intent":"sales","priority":"high","confidence":0.85}`;
    }

    const userPrompt = `Classify this email:\n\n${emailContent}`;

    try {
      const response = await this.complete(systemPrompt, userPrompt, 100);
      const result = JSON.parse(response);
      
      return {
        intent: result.intent || 'other',
        priority: result.priority || 'medium',
        confidence: result.confidence || 0.5,
      };
    } catch (error) {
      console.error('Classification error:', error);
      return {
        intent: 'other',
        priority: 'medium',
        confidence: 0,
      };
    }
  }

  /**
   * Generate email reply
   */
  async generateReply(emailContent: string, intent?: string): Promise<string> {
    // Try to get prompt from Firestore, fallback to default
    let systemPrompt = await getPrompt('reply');
    
    if (!systemPrompt) {
      systemPrompt = `You are a professional email assistant for a software development agency.

RULES:
- Be friendly, professional, and concise (under 150 words)
- Never promise pricing, timelines, or guarantees
- For sales: show interest, ask questions, suggest a call
- For support: acknowledge issue, say team will follow up within 24h
- For hiring: thank them, outline next steps
- Sign off with "Best regards, [Agency Team]"

DO NOT use phrases like "I hope this email finds you well" or other clichés.
Get straight to the point.`;
    }

    const userPrompt = `${intent ? `Intent: ${intent}\n\n` : ''}Email to reply to:\n\n${emailContent}\n\nGenerate reply:`;

    try {
      const response = await this.complete(systemPrompt, userPrompt, 300);
      return response.trim();
    } catch (error) {
      console.error('Reply generation error:', error);
      throw new Error('Failed to generate reply');
    }
  }

  /**
   * Core completion method
   */
  private async complete(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 500
  ): Promise<string> {
    const messages: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // FREE, fast model
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid Groq API response');
    }

    return data.choices[0].message.content;
  }
}

// Export singleton instance
export const groqAI = new GroqAI();