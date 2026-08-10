'use server';

import { groqAI } from '@/lib/email-va/groq';
import { getMessagesByConversation } from './messages';
import { getBusinessContext } from '@/lib/email-va/firebase';

export async function generateDraft(conversationId: string, customContext?: string) {
  try {
    const msgsRes = await getMessagesByConversation(conversationId);
    
    if (!msgsRes.success || !msgsRes.messages) {
      return { success: false, error: 'Failed to retrieve conversation history' };
    }

    const history = msgsRes.messages.map((msg: any) => {
      return `From: ${msg.from}\nTo: ${msg.to}\nDate: ${msg.createdAt}\n\n${msg.text || msg.html}`;
    }).join('\n\n---\n\n');

    const businessCtx = await getBusinessContext();

    const promptContext = `AGENCY KNOWLEDGE:\n${businessCtx}\n\n${
      customContext ? `Additional Instructions: ${customContext}\n\n` : ''
    }Thread History:\n${history}`;

    const draft = await groqAI.generateReply(promptContext, 'general_inquiry');

    return { success: true, draft };
  } catch (error: any) {
    console.error('Generate draft error:', error);
    return { success: false, error: error.message };
  }
}

export async function modifyDraft(currentDraft: string, modifier: 'shorter' | 'professional' | 'friendly') {
  try {
    const prompt = `Rewrite the following email draft to be ${modifier}. Keep the same core information, but change the tone/length appropriately.\n\nDRAFT:\n${currentDraft}`;
    const result = await groqAI.generateReply(prompt, 'draft_modifier');
    return { success: true, draft: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
