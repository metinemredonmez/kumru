import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`media_content_quotes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`source\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`media_content_quotes_order_idx\` ON \`media_content_quotes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`media_content_quotes_parent_id_idx\` ON \`media_content_quotes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_content_quotes_locale_idx\` ON \`media_content_quotes\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`media_content_awards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`organization\` text,
  	\`year\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`media_content_awards_order_idx\` ON \`media_content_awards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`media_content_awards_parent_id_idx\` ON \`media_content_awards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_content_awards_locale_idx\` ON \`media_content_awards\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`media_content\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`media_content_locales\` (
  	\`subtitle\` text,
  	\`title\` text,
  	\`title_highlight\` text,
  	\`description\` text,
  	\`featured_title\` text,
  	\`media_items_magazine_title\` text,
  	\`media_items_magazine_subtitle\` text,
  	\`media_items_magazine_date\` text,
  	\`media_items_magazine_description\` text,
  	\`media_items_award_title\` text,
  	\`media_items_award_subtitle\` text,
  	\`media_items_award_date\` text,
  	\`media_items_award_description\` text,
  	\`quotes_title\` text,
  	\`awards_title\` text,
  	\`instagram_title\` text,
  	\`instagram_description\` text,
  	\`follow_instagram\` text,
  	\`cta_title\` text,
  	\`cta_description\` text,
  	\`cta_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_content_locales_locale_parent_id_unique\` ON \`media_content_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`media_content_quotes\`;`)
  await db.run(sql`DROP TABLE \`media_content_awards\`;`)
  await db.run(sql`DROP TABLE \`media_content\`;`)
  await db.run(sql`DROP TABLE \`media_content_locales\`;`)
}
