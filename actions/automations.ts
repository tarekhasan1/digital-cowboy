'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { collections } from '@/lib/email-va/firebase';
import { resend } from '@/lib/email-va/resend';
import { getSiteSettings } from './settings';

export interface AutomationWorkflow {
  id?: string;
  name: string;
  description?: string;
  trigger: string;
  action: string;
  active: boolean;
  stats: {
    triggered: number;
    success: number;
    failed: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export async function getAutomations() {
  try {
    const snapshot = await collections.automations.orderBy('createdAt', 'desc').get();
    
    const automations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return { success: true, automations };
  } catch (error: any) {
    console.error('Error fetching automations:', error);
    return { success: false, error: error.message, automations: [] };
  }
}

export async function createAutomation(data: Omit<AutomationWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) {
  try {
    const automationData = {
      ...data,
      stats: { triggered: 0, success: 0, failed: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await collections.automations.add(automationData);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating automation:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleAutomation(id: string, active: boolean) {
  try {
    await collections.automations.doc(id).update({ 
      active,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling automation:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAutomation(id: string) {
  try {
    await collections.automations.doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting automation:', error);
    return { success: false, error: error.message };
  }
}

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

interface AutomationContext {
  contactId: string;
  contactEmail: string;
  contactName?: string;
}

/**
 * Checks for active automations matching `trigger` and runs their action.
 * Called from the few places a real domain event occurs: a contact form
 * submission, a lead being created, or an inbound email being ingested.
 */
export async function checkAndFireAutomations(trigger: string, context: AutomationContext) {
  try {
    const snapshot = await collections.automations
      .where('trigger', '==', trigger)
      .where('active', '==', true)
      .get();

    if (snapshot.empty) return { success: true, fired: 0 };

    let fired = 0;
    for (const doc of snapshot.docs) {
      const automation = doc.data() as AutomationWorkflow;
      await collections.automations.doc(doc.id).update({ 'stats.triggered': FieldValue.increment(1) });
      fired++;

      try {
        switch (automation.action) {
          case 'send_welcome_email': {
            await resend.sendEmail({
              to: context.contactEmail,
              subject: `Welcome, ${context.contactName || 'there'}!`,
              html: `<p>Hi ${context.contactName || 'there'},</p><p>Thanks for reaching out — we've got your details and will be in touch shortly.</p>`,
            });
            break;
          }
          case 'notify_admin_email': {
            const settings = await getSiteSettings();
            await resend.sendEmail({
              to: settings.notifyEmail,
              subject: `Automation triggered: ${automation.name}`,
              html: `<p>Trigger: <strong>${trigger}</strong></p><p>Contact: ${context.contactName || context.contactEmail} (${context.contactEmail})</p>`,
            });
            break;
          }
          case 'add_to_campaign': {
            const tag = slugify(automation.name);
            if (tag) {
              await collections.contacts.doc(context.contactId).update({
                tags: FieldValue.arrayUnion(tag),
              });
            }
            break;
          }
        }
        await collections.automations.doc(doc.id).update({ 'stats.success': FieldValue.increment(1) });
      } catch (actionError) {
        console.error(`Automation action failed (${automation.action}):`, actionError);
        await collections.automations.doc(doc.id).update({ 'stats.failed': FieldValue.increment(1) });
      }
    }

    return { success: true, fired };
  } catch (error: any) {
    console.error('Check automations error:', error);
    return { success: false, error: error.message };
  }
}
