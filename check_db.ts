import { collections } from './lib/email-va/firebase';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function check() {
  const c = await collections.conversations.get();
  console.log('Conversations:', c.docs.length);
  const m = await collections.emailMessages.get();
  console.log('Messages:', m.docs.length);
  process.exit(0);
}
check();
