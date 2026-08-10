import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`integrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`payment_provider\` text DEFAULT 'iyzico',
  	\`iyzico_test_mode\` integer DEFAULT true,
  	\`iyzico_api_key\` text,
  	\`iyzico_secret_key\` text,
  	\`stripe_test_mode\` integer DEFAULT true,
  	\`stripe_publishable_key\` text,
  	\`stripe_secret_key\` text,
  	\`stripe_webhook_secret\` text,
  	\`openai_api_key\` text,
  	\`email_provider\` text DEFAULT 'resend',
  	\`email_from\` text,
  	\`email_api_key\` text,
  	\`netgsm_user\` text,
  	\`netgsm_password\` text,
  	\`netgsm_header\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`integrations\`;`)
}
