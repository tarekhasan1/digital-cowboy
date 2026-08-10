'use server';

import { collections } from '@/lib/email-va/firebase';

export interface InsightPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  coverImage?: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export async function createInsight(data: Omit<InsightPost, 'id' | 'createdAt'>) {
  try {
    const postData = {
      ...data,
      createdAt: new Date(),
      publishedAt: data.published ? new Date() : null,
    };

    const docRef = await collections.insights.add(postData);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Create insight error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateInsight(id: string, data: Partial<InsightPost>) {
  try {
    const updateData = { ...data };
    if (data.published && !data.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }
    
    await collections.insights.doc(id).update(updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Update insight error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteInsight(id: string) {
  try {
    await collections.insights.doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Delete insight error:', error);
    return { success: false, error: error.message };
  }
}

export async function getInsights(publishedOnly = false) {
  try {
    let query: any = collections.insights;
    
    if (publishedOnly) {
      query = query.where('published', '==', true);
    }
    
    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
      };
    });

    return { success: true, posts };
  } catch (error: any) {
    console.error('Get insights error:', error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function getInsightBySlug(slug: string) {
  try {
    const snapshot = await collections.insights.where('slug', '==', slug).limit(1).get();
    
    if (snapshot.empty) {
      return { success: false, error: 'Post not found' };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return { 
      success: true, 
      post: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        publishedAt: data.publishedAt?.toDate?.() ? data.publishedAt.toDate().toISOString() : data.publishedAt,
      } as InsightPost 
    };
  } catch (error: any) {
    console.error('Get insight error:', error);
    return { success: false, error: error.message };
  }
}
