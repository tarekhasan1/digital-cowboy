// actions/email-va/settings.ts
'use server';

import { collections, getConfig } from '../../lib/email-va/firebase';

/**
 * Get settings and prompts
 */
export async function getSettings() {
  try {
    const config = await getConfig();

    // Get prompts
    const promptsSnapshot = await collections.prompts.get();
    let classifyPrompt = '';
    let replyPrompt = '';

    promptsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.type === 'classify') {
        classifyPrompt = data.prompt || '';
      } else if (data.type === 'reply') {
        replyPrompt = data.prompt || '';
      }
    });

    return {
      success: true,
      config,
      prompts: {
        classify: classifyPrompt,
        reply: replyPrompt,
      },
    };
  } catch (error: any) {
    console.error('Get settings error:', error);
    return {
      success: false,
      error: error.message,
      config: {
        autoReplyEnabled: false,
        requireApproval: true,
        rateLimitPerHour: 50,
      },
      prompts: {
        classify: '',
        reply: '',
      },
    };
  }
}

/**
 * Save configuration
 */
export async function saveConfig(params: {
  autoReplyEnabled: boolean;
  requireApproval: boolean;
  rateLimitPerHour?: number;
}) {
  try {
    await collections.config.doc('settings').set({
      autoReplyEnabled: params.autoReplyEnabled,
      requireApproval: params.requireApproval,
      rateLimitPerHour: params.rateLimitPerHour || 50,
      updatedAt: new Date(),
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Save config error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save prompts
 */
export async function savePrompts(params: {
  classifyPrompt: string;
  replyPrompt: string;
}) {
  try {
    // Update or create classify prompt
    const classifySnapshot = await collections.prompts
      .where('type', '==', 'classify')
      .limit(1)
      .get();

    if (!classifySnapshot.empty) {
      await classifySnapshot.docs[0].ref.update({
        prompt: params.classifyPrompt,
        active: true,
        updatedAt: new Date(),
      });
    } else {
      await collections.prompts.add({
        type: 'classify',
        prompt: params.classifyPrompt,
        active: true,
        name: 'Intent Classification',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Update or create reply prompt
    const replySnapshot = await collections.prompts
      .where('type', '==', 'reply')
      .limit(1)
      .get();

    if (!replySnapshot.empty) {
      await replySnapshot.docs[0].ref.update({
        prompt: params.replyPrompt,
        active: true,
        updatedAt: new Date(),
      });
    } else {
      await collections.prompts.add({
        type: 'reply',
        prompt: params.replyPrompt,
        active: true,
        name: 'Reply Generation',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Save prompts error:', error);
    return { success: false, error: error.message };
  }
}
