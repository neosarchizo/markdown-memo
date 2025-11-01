import * as Clipboard from '@react-native-clipboard/clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';
import { Memo, ExportFormat, ExportMethod } from '../types/memo';
import { format } from 'date-fns';

export class ExportService {
  /**
   * Main export function that routes to appropriate method
   */
  static async export(
    memo: Memo,
    exportFormat: ExportFormat,
    exportMethod: ExportMethod
  ): Promise<void> {
    try {
      switch (exportFormat) {
        case 'markdown':
          await this.exportMarkdown(memo, exportMethod);
          break;
        case 'pdf':
          await this.exportPDF(memo, exportMethod);
          break;
        case 'text':
          await this.exportText(memo, exportMethod);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  /**
   * Export as Markdown format
   */
  private static async exportMarkdown(
    memo: Memo,
    method: ExportMethod
  ): Promise<void> {
    const content = this.formatMarkdown(memo);
    const filename = this.sanitizeFilename(memo.title) + '.md';

    switch (method) {
      case 'clipboard':
        await this.copyToClipboard(content);
        break;
      case 'share':
        await this.shareContent(content, filename, 'text/markdown');
        break;
      case 'save':
        await this.saveToDevice(content, filename, 'text/markdown');
        break;
      case 'email':
        await this.sendEmail(memo.title, content, filename, 'text/markdown');
        break;
    }
  }

  /**
   * Export as plain text format
   */
  private static async exportText(
    memo: Memo,
    method: ExportMethod
  ): Promise<void> {
    const content = this.formatText(memo);
    const filename = this.sanitizeFilename(memo.title) + '.txt';

    switch (method) {
      case 'clipboard':
        await this.copyToClipboard(content);
        break;
      case 'share':
        await this.shareContent(content, filename, 'text/plain');
        break;
      case 'save':
        await this.saveToDevice(content, filename, 'text/plain');
        break;
      case 'email':
        await this.sendEmail(memo.title, content, filename, 'text/plain');
        break;
    }
  }

  /**
   * Export as PDF format
   */
  private static async exportPDF(
    memo: Memo,
    method: ExportMethod
  ): Promise<void> {
    const html = this.formatHTML(memo);
    const filename = this.sanitizeFilename(memo.title) + '.pdf';

    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });

    switch (method) {
      case 'clipboard':
        throw new Error('PDF cannot be copied to clipboard');
      case 'share':
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share PDF',
          UTI: 'com.adobe.pdf',
        });
        break;
      case 'save':
        // Move temporary PDF to permanent location
        const destUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.copyAsync({ from: uri, to: destUri });
        // Share to allow user to save to their chosen location
        await Sharing.shareAsync(destUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save PDF',
          UTI: 'com.adobe.pdf',
        });
        break;
      case 'email':
        // For email, we need to pass the file URI
        await this.sendEmailWithAttachment(memo.title, uri, 'application/pdf');
        break;
    }
  }

  /**
   * Format memo as Markdown with metadata
   */
  private static formatMarkdown(memo: Memo): string {
    const createdDate = format(new Date(memo.createdAt), 'MMM d, yyyy HH:mm');
    const updatedDate = format(new Date(memo.updatedAt), 'MMM d, yyyy HH:mm');

    let markdown = `# ${memo.title}\n\n`;

    if (memo.tags.length > 0) {
      markdown += `**Tags:** ${memo.tags.join(', ')}\n\n`;
    }

    markdown += `**Created:** ${createdDate}\n`;
    markdown += `**Updated:** ${updatedDate}\n\n`;
    markdown += `---\n\n`;
    markdown += memo.content;

    return markdown;
  }

  /**
   * Format memo as plain text
   */
  private static formatText(memo: Memo): string {
    const createdDate = format(new Date(memo.createdAt), 'MMM d, yyyy HH:mm');
    const updatedDate = format(new Date(memo.updatedAt), 'MMM d, yyyy HH:mm');

    let text = `${memo.title}\n\n`;

    if (memo.tags.length > 0) {
      text += `Tags: ${memo.tags.join(', ')}\n\n`;
    }

    text += `Created: ${createdDate}\n`;
    text += `Updated: ${updatedDate}\n\n`;
    text += `---\n\n`;
    text += memo.content;

    return text;
  }

  /**
   * Format memo as HTML for PDF generation
   */
  private static formatHTML(memo: Memo): string {
    const createdDate = format(new Date(memo.createdAt), 'MMM d, yyyy HH:mm');
    const updatedDate = format(new Date(memo.updatedAt), 'MMM d, yyyy HH:mm');

    // Convert markdown to basic HTML (simplified conversion)
    const htmlContent = this.markdownToHTML(memo.content);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${memo.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #1a1a1a;
              border-bottom: 2px solid #6200ee;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .metadata {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .tags {
              display: flex;
              gap: 8px;
              margin-bottom: 10px;
              flex-wrap: wrap;
            }
            .tag {
              background-color: #e8def8;
              color: #6200ee;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 13px;
            }
            hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 20px 0;
            }
            code {
              background-color: #f5f5f5;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              font-size: 14px;
            }
            pre {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
            }
            pre code {
              background-color: transparent;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid #6200ee;
              padding-left: 16px;
              margin-left: 0;
              color: #666;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: 600;
            }
            ul, ol {
              padding-left: 25px;
            }
            li {
              margin-bottom: 5px;
            }
            a {
              color: #6200ee;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>${this.escapeHTML(memo.title)}</h1>

          ${
            memo.tags.length > 0
              ? `
          <div class="tags">
            ${memo.tags.map((tag) => `<span class="tag">${this.escapeHTML(tag)}</span>`).join('')}
          </div>
          `
              : ''
          }

          <div class="metadata">
            <div><strong>Created:</strong> ${createdDate}</div>
            <div><strong>Updated:</strong> ${updatedDate}</div>
          </div>

          <hr>

          <div class="content">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    return html;
  }

  /**
   * Simple Markdown to HTML converter
   * For more complex conversion, consider using a library like marked or remark
   */
  private static markdownToHTML(markdown: string): string {
    let html = markdown;

    // Code blocks (must be before inline code)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code>${this.escapeHTML(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Underline (HTML)
    html = html.replace(/<u>(.+?)<\/u>/g, '<u>$1</u>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Unordered lists
    html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<li>$1</li>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr>');

    // Paragraphs (lines separated by blank line)
    html = html.replace(/\n\n/g, '</p><p>');
    html = `<p>${html}</p>`;

    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    return html;
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Copy content to clipboard
   */
  private static async copyToClipboard(content: string): Promise<void> {
    Clipboard.setString(content);
  }

  /**
   * Share content using native share sheet
   */
  private static async shareContent(
    content: string,
    filename: string,
    mimeType: string
  ): Promise<void> {
    // Write content to temporary file
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: 'Share Memo',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }

  /**
   * Save content to device storage
   */
  private static async saveToDevice(
    content: string,
    filename: string,
    mimeType: string
  ): Promise<void> {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Use share sheet to allow user to save to their chosen location
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: 'Save Memo',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  }

  /**
   * Send email with content or attachment
   */
  private static async sendEmail(
    subject: string,
    content: string,
    filename: string,
    mimeType: string
  ): Promise<void> {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Email is not available on this device');
    }

    // For text content, include in email body
    // For files, attach them
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      await MailComposer.composeAsync({
        subject,
        body: content,
      });
    } else {
      // Create temporary file for attachment
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await MailComposer.composeAsync({
        subject,
        attachments: [fileUri],
      });
    }
  }

  /**
   * Send email with file attachment (for PDF)
   */
  private static async sendEmailWithAttachment(
    subject: string,
    fileUri: string,
    mimeType: string
  ): Promise<void> {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Email is not available on this device');
    }

    await MailComposer.composeAsync({
      subject,
      attachments: [fileUri],
    });
  }

  /**
   * Sanitize filename by removing invalid characters
   */
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9가-힣]/gi, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 100); // Limit length
  }
}
