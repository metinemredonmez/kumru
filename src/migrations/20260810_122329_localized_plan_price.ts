import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`membership_plans_locales\` ADD \`price\` text;`)
  await db.run(sql`ALTER TABLE \`membership_plans\` DROP COLUMN \`price\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`membership_plans\` ADD \`price\` text;`)
  await db.run(sql`ALTER TABLE \`membership_plans_locales\` DROP COLUMN \`price\`;`)
}
