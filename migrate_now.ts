import { migrateLeadsToContacts, migrateInboxToConversations } from './actions/crm/migrate';

async function run() {
  console.log('Starting migration...');
  const res1 = await migrateLeadsToContacts();
  console.log('Leads:', res1);
  const res2 = await migrateInboxToConversations();
  console.log('Inbox:', res2);
  console.log('Done!');
}
run();
