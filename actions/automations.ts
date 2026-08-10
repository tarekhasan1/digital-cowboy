'use server';

import { collections } from '@/lib/email-va/firebase';

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
