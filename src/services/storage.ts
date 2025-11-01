import { randomUUID } from 'expo-crypto';
import { Database } from './database';
import type { Memo, MemoRow, TagRow, MemoTagRow } from '@/types/memo';

export class StorageService {
  /**
   * Initialize database
   */
  static async init(): Promise<void> {
    await Database.initialize();
  }

  /**
   * Load all memos with their tags
   */
  static async loadMemos(): Promise<Memo[]> {
    const memoRows = await Database.executeQuery<MemoRow>(
      `SELECT * FROM memos ORDER BY isPinned DESC, updatedAt DESC`
    );

    // Load tags for each memo
    const memos = await Promise.all(
      memoRows.map(async (row) => {
        const tags = await this.getTagsForMemo(row.id);
        return this.rowToMemo(row, tags);
      })
    );

    return memos;
  }

  /**
   * Get a single memo by ID
   */
  static async getMemo(id: string): Promise<Memo | null> {
    const rows = await Database.executeQuery<MemoRow>(
      'SELECT * FROM memos WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const tags = await this.getTagsForMemo(id);
    return this.rowToMemo(rows[0], tags);
  }

  /**
   * Save a new memo
   */
  static async saveMemo(memo: Memo): Promise<void> {
    const id = memo.id || randomUUID();
    const now = new Date().toISOString();

    await Database.transaction(async () => {
      // Insert memo
      await Database.executeUpdate(
        `INSERT INTO memos (id, title, content, createdAt, updatedAt, isPinned)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, memo.title, memo.content, now, now, memo.isPinned ? 1 : 0]
      );

      // Insert tags
      if (memo.tags && memo.tags.length > 0) {
        await this.setTagsForMemo(id, memo.tags);
      }
    });
  }

  /**
   * Update an existing memo
   */
  static async updateMemo(id: string, updates: Partial<Memo>): Promise<void> {
    const now = new Date().toISOString();

    // Build update query dynamically
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.isPinned !== undefined) {
      fields.push('isPinned = ?');
      values.push(updates.isPinned ? 1 : 0);
    }

    // Always update updatedAt
    fields.push('updatedAt = ?');
    values.push(now);

    if (fields.length > 0) {
      values.push(id);
      await Database.executeUpdate(
        `UPDATE memos SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update tags if provided (in a separate transaction if needed)
    if (updates.tags !== undefined) {
      await Database.transaction(async () => {
        await this.setTagsForMemo(id, updates.tags!);
      });
    }
  }

  /**
   * Delete a memo
   */
  static async deleteMemo(id: string): Promise<void> {
    // Cascade delete will handle memo_tags
    await Database.executeUpdate('DELETE FROM memos WHERE id = ?', [id]);

    // Clean up orphaned tags
    await this.cleanupOrphanedTags();
  }

  /**
   * Search memos by query (title, content, or tags)
   */
  static async searchMemos(query: string): Promise<Memo[]> {
    const searchPattern = `%${query}%`;

    const memoRows = await Database.executeQuery<MemoRow>(
      `SELECT DISTINCT m.*
       FROM memos m
       LEFT JOIN memo_tags mt ON m.id = mt.memoId
       LEFT JOIN tags t ON mt.tagId = t.id
       WHERE m.title LIKE ? OR m.content LIKE ? OR t.name LIKE ?
       ORDER BY m.isPinned DESC, m.updatedAt DESC`,
      [searchPattern, searchPattern, searchPattern]
    );

    const memos = await Promise.all(
      memoRows.map(async (row) => {
        const tags = await this.getTagsForMemo(row.id);
        return this.rowToMemo(row, tags);
      })
    );

    return memos;
  }

  /**
   * Get memos by tag
   */
  static async getMemosByTag(tag: string): Promise<Memo[]> {
    const memoRows = await Database.executeQuery<MemoRow>(
      `SELECT m.*
       FROM memos m
       JOIN memo_tags mt ON m.id = mt.memoId
       JOIN tags t ON mt.tagId = t.id
       WHERE t.name = ?
       ORDER BY m.isPinned DESC, m.updatedAt DESC`,
      [tag]
    );

    const memos = await Promise.all(
      memoRows.map(async (row) => {
        const tags = await this.getTagsForMemo(row.id);
        return this.rowToMemo(row, tags);
      })
    );

    return memos;
  }

  /**
   * Get all unique tags
   */
  static async getAllTags(): Promise<string[]> {
    const rows = await Database.executeQuery<TagRow>(
      'SELECT name FROM tags ORDER BY name ASC'
    );
    return rows.map((row) => row.name);
  }

  /**
   * Get tags for a specific memo
   */
  private static async getTagsForMemo(memoId: string): Promise<string[]> {
    const rows = await Database.executeQuery<TagRow>(
      `SELECT t.name
       FROM tags t
       JOIN memo_tags mt ON t.id = mt.tagId
       WHERE mt.memoId = ?
       ORDER BY t.name ASC`,
      [memoId]
    );
    return rows.map((row) => row.name);
  }

  /**
   * Set tags for a memo (replaces existing tags)
   */
  private static async setTagsForMemo(
    memoId: string,
    tags: string[]
  ): Promise<void> {
    // Remove existing tags for this memo
    await Database.executeUpdate('DELETE FROM memo_tags WHERE memoId = ?', [
      memoId,
    ]);

    // Insert new tags
    for (const tagName of tags) {
      // Get or create tag
      let tagId = await this.getOrCreateTag(tagName);

      // Link tag to memo
      await Database.executeUpdate(
        'INSERT INTO memo_tags (memoId, tagId) VALUES (?, ?)',
        [memoId, tagId]
      );
    }
  }

  /**
   * Get or create a tag
   */
  private static async getOrCreateTag(tagName: string): Promise<number> {
    // Try to find existing tag
    const existing = await Database.executeQuery<TagRow>(
      'SELECT id FROM tags WHERE name = ?',
      [tagName]
    );

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new tag
    const result = await Database.executeUpdate(
      'INSERT INTO tags (name) VALUES (?)',
      [tagName]
    );

    return result.lastInsertRowId;
  }

  /**
   * Remove tags that are not used by any memo
   */
  private static async cleanupOrphanedTags(): Promise<void> {
    await Database.executeUpdate(
      `DELETE FROM tags
       WHERE id NOT IN (SELECT DISTINCT tagId FROM memo_tags)`
    );
  }

  /**
   * Save a setting
   */
  static async saveSetting(key: string, value: string): Promise<void> {
    await Database.executeUpdate(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  /**
   * Load a setting
   */
  static async loadSetting(key: string): Promise<string | null> {
    const rows = await Database.executeQuery<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return rows.length > 0 ? rows[0].value : null;
  }

  /**
   * Save theme preference
   */
  static async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.saveSetting('theme', theme);
  }

  /**
   * Load theme preference
   */
  static async loadTheme(): Promise<'light' | 'dark'> {
    const theme = await this.loadSetting('theme');
    return (theme as 'light' | 'dark') || 'light';
  }

  /**
   * Convert database row to Memo object
   */
  private static rowToMemo(row: MemoRow, tags: string[]): Memo {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      tags,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isPinned: row.isPinned === 1,
    };
  }
}
