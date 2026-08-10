import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`organization\` text,
  	\`year\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_certifications_order_idx\` ON \`about_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_certifications_parent_id_idx\` ON \`about_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_certifications_locale_idx\` ON \`about_certifications\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`about_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_timeline_order_idx\` ON \`about_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_timeline_parent_id_idx\` ON \`about_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_timeline_locale_idx\` ON \`about_timeline\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`about_spiritual_approaches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_spiritual_approaches_order_idx\` ON \`about_spiritual_approaches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_spiritual_approaches_parent_id_idx\` ON \`about_spiritual_approaches\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_spiritual_approaches_locale_idx\` ON \`about_spiritual_approaches\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`about_locales\` (
  	\`subtitle\` text,
  	\`title\` text,
  	\`name\` text,
  	\`hero_description\` text,
  	\`hero_description2\` text,
  	\`appointment\` text,
  	\`media_button\` text,
  	\`story_title\` text,
  	\`story1\` text,
  	\`story2\` text,
  	\`story3\` text,
  	\`story4\` text,
  	\`values_title\` text,
  	\`values_description\` text,
  	\`values_empathy_title\` text,
  	\`values_empathy_description\` text,
  	\`values_honesty_title\` text,
  	\`values_honesty_description\` text,
  	\`values_transformation_title\` text,
  	\`values_transformation_description\` text,
  	\`values_excellence_title\` text,
  	\`values_excellence_description\` text,
  	\`certifications_title\` text,
  	\`journey_title\` text,
  	\`spiritual_title\` text,
  	\`spiritual1\` text,
  	\`spiritual2\` text,
  	\`spiritual3\` text,
  	\`cta_title\` text,
  	\`cta_description\` text,
  	\`cta_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_locales_locale_parent_id_unique\` ON \`about_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_intro_order_idx\` ON \`nova_vera_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_intro_parent_id_idx\` ON \`nova_vera_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_intro_locale_idx\` ON \`nova_vera_intro\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_what\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_what_order_idx\` ON \`nova_vera_what\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_what_parent_id_idx\` ON \`nova_vera_what\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_what_locale_idx\` ON \`nova_vera_what\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_journey\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_journey_order_idx\` ON \`nova_vera_journey\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_journey_parent_id_idx\` ON \`nova_vera_journey\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_journey_locale_idx\` ON \`nova_vera_journey\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_includes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_includes_order_idx\` ON \`nova_vera_includes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_includes_parent_id_idx\` ON \`nova_vera_includes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_includes_locale_idx\` ON \`nova_vera_includes\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_outcomes_order_idx\` ON \`nova_vera_outcomes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_outcomes_parent_id_idx\` ON \`nova_vera_outcomes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_outcomes_locale_idx\` ON \`nova_vera_outcomes\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_not_session\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_not_session_order_idx\` ON \`nova_vera_not_session\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_not_session_parent_id_idx\` ON \`nova_vera_not_session\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_not_session_locale_idx\` ON \`nova_vera_not_session\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_who\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_who_order_idx\` ON \`nova_vera_who\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_who_parent_id_idx\` ON \`nova_vera_who\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_who_locale_idx\` ON \`nova_vera_who\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera_first_step\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`nova_vera_first_step_order_idx\` ON \`nova_vera_first_step\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_first_step_parent_id_idx\` ON \`nova_vera_first_step\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`nova_vera_first_step_locale_idx\` ON \`nova_vera_first_step\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`nova_vera\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`nova_vera_locales\` (
  	\`brand\` text,
  	\`tagline\` text,
  	\`intro_question\` text,
  	\`intro_answer\` text,
  	\`what_title\` text,
  	\`what_question\` text,
  	\`journey_title\` text,
  	\`journey_highlight\` text,
  	\`includes_title\` text,
  	\`includes_intro\` text,
  	\`includes_note\` text,
  	\`outcomes_title\` text,
  	\`outcomes_final\` text,
  	\`outcomes_note\` text,
  	\`not_session_title\` text,
  	\`who_title\` text,
  	\`who_intro\` text,
  	\`who_outro\` text,
  	\`who_note\` text,
  	\`first_step_title\` text,
  	\`quote\` text,
  	\`cta_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`nova_vera\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`nova_vera_locales_locale_parent_id_unique\` ON \`nova_vera_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_certifications\`;`)
  await db.run(sql`DROP TABLE \`about_timeline\`;`)
  await db.run(sql`DROP TABLE \`about_spiritual_approaches\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`DROP TABLE \`about_locales\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_intro\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_what\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_journey\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_includes\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_outcomes\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_not_session\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_who\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_first_step\`;`)
  await db.run(sql`DROP TABLE \`nova_vera\`;`)
  await db.run(sql`DROP TABLE \`nova_vera_locales\`;`)
}
