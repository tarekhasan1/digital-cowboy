'use client';

import { useState } from 'react';
import { sendEmail } from '../../../actions/email-va/send-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export function EmailComposer() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const recipients = to.split(',').map(email => email.trim());
    
    const result = await sendEmail({
      to: recipients,
      subject,
      bodyHtml: body.replace(/\n/g, '<br>'),
      bodyPlain: body,
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Email sent!' });
      setTo('');
      setSubject('');
      setBody('');
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to send' });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Compose Email</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            To (comma-separated)
          </label>
          <Input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email@example.com, another@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            rows={10}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          onClick={handleSend}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </Card>
  );
}