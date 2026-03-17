import { useCallback, useState } from 'react';
import { Upload, File, X, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UploadedDocument } from '@/types';

interface FileUploadProps {
  onFilesChange: (files: UploadedDocument[]) => void;
  files: UploadedDocument[];
  disabled?: boolean;
}

export function FileUpload({ onFilesChange, files, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback(async (fileList: FileList) => {
    setIsProcessing(true);
    const newFiles: UploadedDocument[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      newFiles.push({
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: file.type,
        size: file.size,
        extractedText: `Contenu extrait de ${file.name}...`
      });
    }

    onFilesChange([...files, ...newFiles]);
    setIsProcessing(false);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "file-drop-zone cursor-pointer",
          isDragOver && "drag-over",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={disabled || isProcessing}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isProcessing ? "Traitement en cours..." : "Déposer des fichiers ici"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Word • Max 10 MB
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(file.id)}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
