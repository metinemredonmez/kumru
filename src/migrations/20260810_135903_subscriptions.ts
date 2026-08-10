import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`subscriptions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`member_id\` integer NOT NULL,
  	\`plan_id\` integer,
  	\`tier\` text DEFAULT 'premium' NOT NULL,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`provider\` text DEFAULT 'manual',
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'TRY',
  	\`started_at\` text,
  	\`expires_at\` text,
  	\`reference\` text,
  	\`note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`plan_id\`) REFERENCES \`membership_plans\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`subscriptions_member_idx\` ON \`subscriptions\` (\`member_id\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_plan_idx\` ON \`subscriptions\` (\`plan_id\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_updated_at_idx\` ON \`subscriptions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`subscriptions_created_at_idx\` ON \`subscriptions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`subscriptions_id\` integer REFERENCES subscriptions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscriptions_id_idx\` ON \`payload_locked_documents_rels\` (\`subscriptions_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`subscriptions\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`videos_id\` integer,
  	\`spiritual_sessions_id\` integer,
  	\`coaching_services_id\` integer,
  	\`programs_id\` integer,
  	\`events_id\` integer,
  	\`faqs_id\` integer,
  	\`contact_messages_id\` integer,
  	\`resource_items_id\` integer,
  	\`blog_posts_id\` integer,
  	\`tips_id\` integer,
  	\`testimonials_id\` integer,
  	\`membership_plans_id\` integer,
  	\`courses_id\` integer,
  	\`program_stages_id\` integer,
  	\`enrollments_id\` integer,
  	\`members_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`videos_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`spiritual_sessions_id\`) REFERENCES \`spiritual_sessions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`coaching_services_id\`) REFERENCES \`coaching_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`programs_id\`) REFERENCES \`programs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contact_messages_id\`) REFERENCES \`contact_messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`resource_items_id\`) REFERENCES \`resource_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tips_id\`) REFERENCES \`tips\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`membership_plans_id\`) REFERENCES \`membership_plans\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`courses_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`program_stages_id\`) REFERENCES \`program_stages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`enrollments_id\`) REFERENCES \`enrollments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`members_id\`) REFERENCES \`members\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "videos_id", "spiritual_sessions_id", "coaching_services_id", "programs_id", "events_id", "faqs_id", "contact_messages_id", "resource_items_id", "blog_posts_id", "tips_id", "testimonials_id", "membership_plans_id", "courses_id", "program_stages_id", "enrollments_id", "members_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "videos_id", "spiritual_sessions_id", "coaching_services_id", "programs_id", "events_id", "faqs_id", "contact_messages_id", "resource_items_id", "blog_posts_id", "tips_id", "testimonials_id", "membership_plans_id", "courses_id", "program_stages_id", "enrollments_id", "members_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_videos_id_idx\` ON \`payload_locked_documents_rels\` (\`videos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_spiritual_sessions_id_idx\` ON \`payload_locked_documents_rels\` (\`spiritual_sessions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_coaching_services_id_idx\` ON \`payload_locked_documents_rels\` (\`coaching_services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_programs_id_idx\` ON \`payload_locked_documents_rels\` (\`programs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contact_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_messages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_resource_items_id_idx\` ON \`payload_locked_documents_rels\` (\`resource_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tips_id_idx\` ON \`payload_locked_documents_rels\` (\`tips_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_membership_plans_id_idx\` ON \`payload_locked_documents_rels\` (\`membership_plans_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_courses_id_idx\` ON \`payload_locked_documents_rels\` (\`courses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_program_stages_id_idx\` ON \`payload_locked_documents_rels\` (\`program_stages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enrollments_id_idx\` ON \`payload_locked_documents_rels\` (\`enrollments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_members_id_idx\` ON \`payload_locked_documents_rels\` (\`members_id\`);`)
}
