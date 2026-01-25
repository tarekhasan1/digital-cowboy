// actions/email-va/settings.ts
'use server';

import { collections, getConfig } from '../../lib/email-va/firebase';

// Default prompts if none exist
const DEFAULT_CLASSIFY_PROMPT = `Analyze the following email and classify it.

Return a JSON object with:
- intent: one of "inquiry", "support", "complaint", "feedback", "spam", "other"
- priority: one of "urgent", "high", "medium", "low"
- summary: a brief one-line summary

Email:
{{email}}`;

const DEFAULT_REPLY_PROMPT = `You are a professional email assistant. Generate a helpful, polite reply to the following email.

Keep the response:
- Professional and friendly
- Concise but complete
- Helpful and actionable

Original email:
{{email}}

Intent: {{intent}}`;

/**
 * Get settings and prompts
 */
export async function getSettings() {
  try {
    console.log('📋 Loading settings...');
    
    // Get config with error handling
    let config = {
      autoReplyEnabled: false,
      requireApproval: true,
      rateLimitPerHour: 50,
    };
    
    try {
      const loadedConfig = await getConfig();
      if (loadedConfig) {
        config = {
          autoReplyEnabled: loadedConfig.autoReplyEnabled ?? false,
          requireApproval: loadedConfig.requireApproval ?? true,
          rateLimitPerHour: loadedConfig.rateLimitPerHour ?? 50,
        };
      }
    } catch (configError) {
      console.error('Error loading config, using defaults:', configError);
    }

    // Get prompts with error handling
    let classifyPrompt = DEFAULT_CLASSIFY_PROMPT;
    let replyPrompt = DEFAULT_REPLY_PROMPT;

    try {
      const promptsSnapshot = await collections.prompts.get();
      
      promptsSnapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        if (data.type === 'classify' && data.prompt) {
          classifyPrompt = data.prompt;
        } else if (data.type === 'reply' && data.prompt) {
          replyPrompt = data.prompt;
        }
      });
    } catch (promptsError) {
      console.error('Error loading prompts, using defaults:', promptsError);
    }

    console.log('✅ Settings loaded successfully');

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
    
    // 🔥 FIX: Always return a complete structure even on error
    return {
      success: false,
      error: error.message,
      config: {
        autoReplyEnabled: false,
        requireApproval: true,
        rateLimitPerHour: 50,
      },
      prompts: {
        classify: DEFAULT_CLASSIFY_PROMPT,
        reply: DEFAULT_REPLY_PROMPT,
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
    console.log('💾 Saving config:', params);
    
    await collections.config.doc('settings').set({
      autoReplyEnabled: params.autoReplyEnabled,
      requireApproval: params.requireApproval,
      rateLimitPerHour: params.rateLimitPerHour || 50,
      updatedAt: new Date(),
    }, { merge: true });

    console.log('✅ Config saved');
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
    console.log('💾 Saving prompts...');
    
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

    console.log('✅ Prompts saved');
    return { success: true };
  } catch (error: any) {
    console.error('Save prompts error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Initialize default settings if they don't exist
 */
export async function initializeSettings() {
  try {
    // Check if config exists
    const configDoc = await collections.config.doc('settings').get();
    
    if (!configDoc.exists) {
      await collections.config.doc('settings').set({
        autoReplyEnabled: false,
        requireApproval: true,
        rateLimitPerHour: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Default config initialized');
    }

    // Check if prompts exist
    const promptsSnapshot = await collections.prompts.get();
    
    if (promptsSnapshot.empty) {
      // Add default classify prompt
      await collections.prompts.add({
        type: 'classify',
        prompt: DEFAULT_CLASSIFY_PROMPT,
        active: true,
        name: 'Intent Classification',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add default reply prompt
      await collections.prompts.add({
        type: 'reply',
        prompt: DEFAULT_REPLY_PROMPT,
        active: true,
        name: 'Reply Generation',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('✅ Default prompts initialized');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Initialize settings error:', error);
    return { success: false, error: error.message };
  }
}