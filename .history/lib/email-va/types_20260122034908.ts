// lib/email-va/types.ts

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
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  intent?: 'sales' | 'support' | 'hiring' | 'spam' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'drafted' | 'sent' | 'archived';
  aiReply?: string;
  aiApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
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