// lib/email-va/types.ts - Updated with Resend integration

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  tags: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  recipientTags: string[];
  status: 'draft' | 'sending' | 'sent' | 'paused';
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InboxMessage {
  id: string;
  resendEmailId?: string; // Resend email ID for deduplication
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  intent?: 'sales' | 'support' | 'hiring' | 'spam' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'inbox' | 'spam' | 'archived'; // NEW: Main categorization
  status: 'unread' | 'read' | 'drafted' | 'sent'; // Simplified status
  aiReply?: string;
  aiReplyEdited?: string;
  aiApproved: boolean;
  manualReply?: string;
  replyType?: 'ai' | 'manual';
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationResult<T> {
  items: T[];
  hasMore: boolean;
  cursor?: string;
  total: number;
}

export interface InboxFilters {
  category: 'inbox' | 'spam' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'unread' | 'read' | 'drafted' | 'sent';
  search?: string;
}

export interface SentEmail {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  type: 'manual' | 'campaign' | 'auto_reply';
  campaignId?: string;
  inboxId?: string;
  sentAt: Date;
}

export interface EmailVAConfig {
  autoReplyEnabled: boolean;
  requireApproval: boolean;
  rateLimitPerHour: number;
  updatedAt: Date;
}

export interface AIPrompt {
  id: string;
  name: string;
  type: 'classify' | 'reply';
  prompt: string;
  active: boolean;
  updatedAt: Date;
}