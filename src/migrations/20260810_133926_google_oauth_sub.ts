import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`members\` ADD \`sub\` text;`)
  await db.run(sql`CREATE INDEX \`members_sub_idx\` ON \`members\` (\`sub\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`members_sub_idx\`;`)
  await db.run(sql`ALTER TABLE \`members\` DROP COLUMN \`sub\`;`)
}
