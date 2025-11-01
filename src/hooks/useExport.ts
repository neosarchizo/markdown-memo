import { useState } from 'react';
import { ExportService } from '../services/export';
import { Memo, ExportFormat, ExportMethod } from '../types/memo';

interface UseExportReturn {
  isExporting: boolean;
  error: string | null;
  exportMemo: (
    memo: Memo,
    format: ExportFormat,
    method: ExportMethod
  ) => Promise<void>;
}

export const useExport = (): UseExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportMemo = async (
    memo: Memo,
    format: ExportFormat,
    method: ExportMethod
  ): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);
      await ExportService.export(memo, format, method);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    error,
    exportMemo,
  };
};
