import { NextResponse } from 'next/server';
import { upsertContact } from '@/actions/crm/contacts';
import { createEnquiry } from '@/actions/crm/enquiries';
import { resend } from '@/lib/email-va/resend';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, service, message, source = 'Website' } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create or Update Contact (Canonical deduplication)
    const contactRes = await upsertContact({
      name,
      email,
      company,
      type: 'lead',
    });
    
    if (!contactRes.success || !contactRes.contactId) {
      throw new Error('Failed to create/update contact');
    }

    const contactId = contactRes.contactId;

    // 2. Create Enquiry Record
    await createEnquiry({
      contactId,
      name,
      email,
      company,
      service: service || 'General',
      message,
      source
    });

    const { logActivity } = await import('@/actions/crm/activity');
    await logActivity({
      contactId,
      type: 'enquiry_submitted',
      title: 'Enquiry Submitted',
      description: `Service: ${service || 'General'}`
    });

    // 3. Send Admin Notification Email
    await resend.sendEmail({
      to: 'admin@digitalcowboy.com', // Would normally be process.env.ADMIN_EMAIL
      subject: `New Website Enquiry from ${name}`,
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service:</strong> ${service || 'General'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <p><a href="https://digitalcowboy.com/admin/crm">View in CRM</a></p>
      `,
    });

    // 4. Send User Confirmation Email
    await resend.sendEmail({
      to: email,
      subject: `Thanks for reaching out to DigitalCowboy`,
      html: `
        <p>Hi ${name.split(' ')[0]},</p>
        <p>Thanks for getting in touch with DigitalCowboy. We've received your enquiry regarding ${service || 'our services'} and will get back to you shortly.</p>
        <p>Best regards,<br>The DigitalCowboy Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
