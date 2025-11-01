import * as SQLite from 'expo-sqlite';

export class Database {
  private static instance: SQLite.SQLiteDatabase | null = null;
  private static readonly DB_NAME = 'markdown_memo.db';
  private static readonly DB_VERSION = 1;

  /**
   * Open database connection
   */
  static async open(): Promise<SQLite.SQLiteDatabase> {
    if (!this.instance) {
      this.instance = await SQLite.openDatabaseAsync(this.DB_NAME);

      // Enable WAL mode for better concurrency
      await this.instance.execAsync('PRAGMA journal_mode = WAL;');

      // Enable foreign keys
      await this.instance.execAsync('PRAGMA foreign_keys = ON;');
    }
    return this.instance;
  }

  /**
   * Create database tables and indexes
   */
  static async createTables(): Promise<void> {
    const db = await this.open();

    await db.execAsync(`
      -- Memos table
      CREATE TABLE IF NOT EXISTS memos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isPinned INTEGER DEFAULT 0
      );

      -- Tags table
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      -- MemoTags junction table (many-to-many)
      CREATE TABLE IF NOT EXISTS memo_tags (
        memoId TEXT NOT NULL,
        tagId INTEGER NOT NULL,
        PRIMARY KEY (memoId, tagId),
        FOREIGN KEY (memoId) REFERENCES memos(id) ON DELETE CASCADE,
        FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
      );

      -- Settings table
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_memos_created ON memos(createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_memos_updated ON memos(updatedAt DESC);
      CREATE INDEX IF NOT EXISTS idx_memos_pinned ON memos(isPinned DESC, updatedAt DESC);
      CREATE INDEX IF NOT EXISTS idx_memo_tags_memo ON memo_tags(memoId);
      CREATE INDEX IF NOT EXISTS idx_memo_tags_tag ON memo_tags(tagId);
    `);

    // Store database version
    await this.setSetting('db_version', this.DB_VERSION.toString());
  }

  /**
   * Execute a query and return results
   */
  static async executeQuery<T>(
    sql: string,
    params: (string | number | boolean | null)[] = []
  ): Promise<T[]> {
    const db = await this.open();
    const result = await db.getAllAsync<T>(sql, params);
    return result;
  }

  /**
   * Execute an update/insert/delete query
   */
  static async executeUpdate(
    sql: string,
    params: (string | number | boolean | null)[] = []
  ): Promise<SQLite.SQLiteRunResult> {
    const db = await this.open();
    const result = await db.runAsync(sql, params);
    return result;
  }

  /**
   * Execute multiple statements in a transaction
   */
  static async transaction(callback: () => Promise<void>): Promise<void> {
    const db = await this.open();

    try {
      await db.execAsync('BEGIN TRANSACTION;');
      await callback();
      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }

  /**
   * Get database version
   */
  static async getVersion(): Promise<number> {
    try {
      const result = await this.getSetting('db_version');
      return result ? parseInt(result, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Set a setting value
   */
  private static async setSetting(key: string, value: string): Promise<void> {
    await this.executeUpdate(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  /**
   * Get a setting value
   */
  private static async getSetting(key: string): Promise<string | null> {
    const results = await this.executeQuery<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return results.length > 0 ? results[0].value : null;
  }

  /**
   * Migrate database to a new version
   */
  static async migrate(fromVersion: number, toVersion: number): Promise<void> {
    // Currently no migrations, but this is where they would go
    // Example:
    // if (fromVersion < 2) {
    //   await this.executeUpdate('ALTER TABLE memos ADD COLUMN newField TEXT');
    // }
    console.log(`Migrating database from version ${fromVersion} to ${toVersion}`);
  }

  /**
   * Initialize database (create tables and run migrations if needed)
   */
  static async initialize(): Promise<void> {
    console.log('[Database] Initializing database...');
    try {
      await this.createTables();
      console.log('[Database] Tables created successfully');

      const currentVersion = await this.getVersion();
      console.log('[Database] Current version:', currentVersion);

      if (currentVersion < this.DB_VERSION) {
        console.log('[Database] Running migration...');
        await this.migrate(currentVersion, this.DB_VERSION);
      }

      console.log('[Database] Initialization complete');
    } catch (error) {
      console.error('[Database] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.closeAsync();
      this.instance = null;
    }
  }
}
