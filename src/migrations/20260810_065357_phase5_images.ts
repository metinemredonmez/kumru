import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`page_images\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`services_bg_id\` integer,
  	\`media_bg_id\` integer,
  	\`programs_bg_id\` integer,
  	\`resources_bg_id\` integer,
  	\`contact_bg_id\` integer,
  	\`nova_vera_bg_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`services_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`media_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`programs_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`resources_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`contact_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`nova_vera_bg_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`page_images_services_bg_idx\` ON \`page_images\` (\`services_bg_id\`);`)
  await db.run(sql`CREATE INDEX \`page_images_media_bg_idx\` ON \`page_images\` (\`media_bg_id\`);`)
  await db.run(sql`CREATE INDEX \`page_images_programs_bg_idx\` ON \`page_images\` (\`programs_bg_id\`);`)
  await db.run(sql`CREATE INDEX \`page_images_resources_bg_idx\` ON \`page_images\` (\`resources_bg_id\`);`)
  await db.run(sql`CREATE INDEX \`page_images_contact_bg_idx\` ON \`page_images\` (\`contact_bg_id\`);`)
  await db.run(sql`CREATE INDEX \`page_images_nova_vera_bg_idx\` ON \`page_images\` (\`nova_vera_bg_id\`);`)
  await db.run(sql`CREATE TABLE \`media_content_instagram_posts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`link\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`media_content_instagram_posts_order_idx\` ON \`media_content_instagram_posts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`media_content_instagram_posts_parent_id_idx\` ON \`media_content_instagram_posts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_content_instagram_posts_image_idx\` ON \`media_content_instagram_posts\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`logo_white_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`favicon_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_white_idx\` ON \`site_settings\` (\`logo_white_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_favicon_idx\` ON \`site_settings\` (\`favicon_id\`);`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`profile_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`about_profile_image_idx\` ON \`about\` (\`profile_image_id\`);`)
  await db.run(sql`ALTER TABLE \`media_content\` ADD \`media_items_magazine_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`media_content\` ADD \`media_items_award_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`media_content_media_items_magazine_media_items_magazine__idx\` ON \`media_content\` (\`media_items_magazine_image_id\`);`)
  await db.run(sql`CREATE INDEX \`media_content_media_items_award_media_items_award_image_idx\` ON \`media_content\` (\`media_items_award_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`page_images\`;`)
  await db.run(sql`DROP TABLE \`media_content_instagram_posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text DEFAULT 'kumrukoseler@gmail.com',
  	\`phone\` text DEFAULT '+90 534 367 56 69',
  	\`whatsapp\` text DEFAULT '905343675669',
  	\`instagram\` text DEFAULT 'https://www.instagram.com/kumrukoseler/',
  	\`youtube\` text DEFAULT 'https://www.youtube.com/@kumrukoseler9055',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "email", "phone", "whatsapp", "instagram", "youtube", "updated_at", "created_at") SELECT "id", "email", "phone", "whatsapp", "instagram", "youtube", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE TABLE \`__new_about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about\`("id", "updated_at", "created_at") SELECT "id", "updated_at", "created_at" FROM \`about\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`ALTER TABLE \`__new_about\` RENAME TO \`about\`;`)
  await db.run(sql`CREATE TABLE \`__new_media_content\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media_content\`("id", "updated_at", "created_at") SELECT "id", "updated_at", "created_at" FROM \`media_content\`;`)
  await db.run(sql`DROP TABLE \`media_content\`;`)
  await db.run(sql`ALTER TABLE \`__new_media_content\` RENAME TO \`media_content\`;`)
}
