'use server';

import { collections } from '@/lib/email-va/firebase';
import { upsertContact } from './contacts';
import { createConversation, getConversations } from './conversations';
import { createMessage } from './messages';

/**
 * Migrate legacy leads to contacts
 */
export async function migrateLeadsToContacts() {
  try {
    const snapshot = await collections.leads.get();
    let migrated = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (!data.email) continue;
      
      await upsertContact({
        email: data.email,
        name: data.name,
        company: data.company,
        phone: data.phone,
        tags: data.tags || [],
        type: 'lead',
        status: data.status || 'new',
        source: data.source || 'legacy_migration',
        customFields: data.customFields || {},
      });
      migrated++;
    }
    
    return { success: true, migrated };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Migrate inbox to conversations/messages
 */
export async function migrateInboxToConversations() {
  try {
    const snapshot = await collections.inbox.get();
    let migrated = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (!data.fromEmail) continue;
      
      // 1. Ensure Contact exists
      const contactRes = await upsertContact({
        email: data.fromEmail,
        name: data.fromName,
        type: 'contact'
      });
      
      if (!contactRes.success || !contactRes.contactId) continue;
      const contactId = contactRes.contactId;

      // 2. Find or create conversation
      const subject = data.subject || '(No Subject)';
      // Simplistic grouping by subject (stripping Re:, Fwd:, etc.)
      const cleanSubject = subject.replace(/^(Re|Fwd):\s*/i, '').trim();
      
      // Temporarily skip getConversations because it times out on missing index
      let conversationId = '';
      /*
      // Check for existing conv with this contact
      const convsRes = await getConversations({ contactId });
      let conversationId = '';
      
      if (convsRes.success && convsRes.conversations.length > 0) {
        // Try to match subject
        const match = convsRes.conversations.find((c: any) => c.subject.includes(cleanSubject) || cleanSubject.includes(c.subject));
        if (match) conversationId = match.id;
      }
      */
      
      if (!conversationId) {
        const createConvRes = await createConversation({
          contactId,
          subject: cleanSubject,
          unreadCount: data.status === 'unread' ? 1 : 0,
          isArchived: data.status === 'archived',
        });
        if (createConvRes.success && createConvRes.conversationId) {
          conversationId = createConvRes.conversationId;
        } else continue;
      }
      
      // 3. Create message
      await createMessage({
        conversationId,
        direction: 'inbound',
        from: data.fromEmail,
        to: process.env.EMAIL_FROM || 'admin@digitalcowboy.com',
        subject: data.subject,
        text: data.body,
        readStatus: data.status === 'unread' ? 'unread' : 'read',
        resendEmailId: data.resendEmailId,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      });
      
      migrated++;
    }
    
    return { success: true, migrated };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
}
