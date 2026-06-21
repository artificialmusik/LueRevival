const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool, query, tx } = require('./pool');
const { config, validateConfig } = require('../config');

const SOURCE_REPO = 'https://github.com/acjordan2/AlpacaBoards';
const SOURCE_COMMIT = process.env.SOURCE_COMMIT || '7d2cfe1';

async function migrate() {
  const warnings = validateConfig();
  warnings.forEach(w => console.warn(`[config] ${w}`));
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(schema);
  await seedCore();
}

async function seedCore() {
  await tx(async (client) => {
    await client.query(`
      INSERT INTO staff_positions (id, title, title_color, permissions)
      VALUES (1, 'Administrator', 'red', '{"all": true}'::jsonb)
      ON CONFLICT (id) DO UPDATE SET permissions = EXCLUDED.permissions
    `);

    await client.query(`
      INSERT INTO site_options (id, site_name, tagline, registration_mode, invites_enabled, source_repo, source_commit)
      VALUES (true, $1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET source_repo = EXCLUDED.source_repo, source_commit = EXCLUDED.source_commit
    `, [config.siteName, config.siteTagline, config.registrationMode, config.invitesEnabled, SOURCE_REPO, SOURCE_COMMIT]);

    await client.query(`
      INSERT INTO item_classes (id, type) VALUES (1, 'topic'), (2, 'invite')
      ON CONFLICT (id) DO NOTHING
    `);
    await client.query(`
      INSERT INTO shop_items (id, name, price, description, active, class_id) VALUES
      (1, 'Invite', 50, 'Buy an invite to give to another user.', true, 2),
      (2, 'Pin Topic', 10, 'Pin one of your topics for 24 hours.', true, 1)
      ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description, active = EXCLUDED.active
    `);

    await client.query(`
      INSERT INTO boards (id, title, description, sort_order) VALUES
      (1, 'LUE', 'Main social board, seeded from the original AlpacaBoards schema.', 1),
      (2, 'Gaming', 'Games, streams, Steam nonsense, and coordination.', 2),
      (3, 'Food', 'Recipes, snacks, awful cravings, and kitchen crimes.', 3),
      (4, 'Music', 'Songs, albums, shows, and industry plants.', 4),
      (5, 'Links', 'Shared links and link discussion.', 5),
      (6, 'Meta', 'Site options, feedback, and feature talk.', 6)
      ON CONFLICT (title) DO NOTHING
    `);

    const count = await client.query('SELECT count(*)::int AS n FROM users');
    let adminId;
    if (count.rows[0].n === 0) {
      const passwordHash = await bcrypt.hash(config.admin.password, 12);
      const user = await client.query(`
        INSERT INTO users (username, email, password_hash, staff_position_id, access_level, status, karma, signature, quote)
        VALUES ($1, $2, $3, 1, 100, 'active', 100, 'seed admin', 'welcome to the revival')
        RETURNING id
      `, [config.admin.username, config.admin.email, passwordHash]);
      adminId = user.rows[0].id;
      const topic = await client.query(`
        INSERT INTO topics (board_id, user_id, title, updated_at)
        VALUES (1, $1, 'Welcome to LueRevival', now()) RETURNING id
      `, [adminId]);
      await client.query(`
        INSERT INTO messages (topic_id, user_id, body)
        VALUES ($1, $2, $3)
      `, [topic.rows[0].id, adminId, 'This board is a modern rebuild of AlpacaBoards. Source material: https://github.com/acjordan2/AlpacaBoards @ 7d2cfe1. The UI intentionally keeps the classic gray/blue table-board feel.']);
      await client.query(`INSERT INTO tagged (data_id, tag_id, type) VALUES ($1, 1, 'topic') ON CONFLICT DO NOTHING`, [topic.rows[0].id]);
    } else {
      const admin = await client.query(`SELECT id FROM users WHERE access_level >= 50 ORDER BY access_level DESC, id LIMIT 1`);
      const fallback = await client.query(`SELECT id FROM users ORDER BY id LIMIT 1`);
      adminId = admin.rows[0]?.id || fallback.rows[0]?.id;
    }

    if (adminId) {
      await client.query(`
        INSERT INTO topical_tags (id, title, description, type, access, participation, permanent, user_id, parent_tags, moderators, administrators)
          VALUES
            (1, 'LUE', 'Main Social Board', 1, 'public', 'open', true, $1, '', 'Global', $2),
            (2, 'Frogs', 'Everything regarding frogs, toads and amphibians in general.', 1, 'public', 'open', false, $1, 'Reptiles and Amphibians', 'Global', $2)
          ON CONFLICT (title) DO UPDATE SET
            description=EXCLUDED.description,
            parent_tags=EXCLUDED.parent_tags,
            moderators=EXCLUDED.moderators,
            administrators=EXCLUDED.administrators
      `, [adminId, config.admin.username]);
    }
  });
}

if (require.main === module) {
  migrate()
    .then(() => { console.log('migration complete'); return pool.end(); })
    .catch(async (err) => { console.error(err); await pool.end(); process.exit(1); });
}

module.exports = { migrate };
