import { useState } from 'react';
import { TextInput } from './TextInput';
import { VoiceRecorder } from './VoiceRecorder';
import { FileUpload } from './FileUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, FileText, Keyboard, ArrowRight, Loader2, X } from 'lucide-react';
import { UploadedDocument } from '@/types';

interface SearchInputPanelProps {
  onSubmit: (data: { text: string; files: UploadedDocument[] }) => void;
  isLoading?: boolean;
}

export function SearchInputPanel({ onSubmit, isLoading }: SearchInputPanelProps) {
  const [textInput, setTextInput] = useState('');
  const [transcription, setTranscription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState('text');

  const combinedText = [textInput, transcription].filter(Boolean).join('\n\n');
  const hasInput = combinedText.trim().length > 0 || uploadedFiles.length > 0;

  const handleSubmit = () => {
    onSubmit({
      text: combinedText,
      files: uploadedFiles
    });
  };

  const handleTranscription = (text: string) => {
    setTranscription(prev => prev ? `${prev}\n\n${text}` : text);
    setActiveTab('text');
  };

  const clearAll = () => {
    setTextInput('');
    setTranscription('');
    setUploadedFiles([]);
  };

  return (
    <div className="card-elevated p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold mb-2">Nouvelle recherche</h2>
        <p className="text-muted-foreground">
          Décrivez votre cas juridique par texte, dictée vocale ou en uploadant des documents.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Texte</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Dictée</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-0">
          <TextInput
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Décrivez les faits, la question juridique, ou le contexte de votre recherche..."
            disabled={isLoading}
          />
          
          {/* Show transcription if any */}
          {transcription && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary-foreground">Transcription vocale</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTranscription('')}
                  className="h-6 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{transcription}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="voice" className="mt-0">
          <div className="flex flex-col items-center py-8">
            <VoiceRecorder
              onTranscription={handleTranscription}
              disabled={isLoading}
            />
            <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
              Cliquez sur le microphone pour commencer à dicter. 
              La transcription sera ajoutée au champ texte.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <FileUpload
            files={uploadedFiles}
            onFilesChange={setUploadedFiles}
            disabled={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Summary and actions */}
      <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {hasInput ? (
            <span>
              {combinedText.length > 0 && `${combinedText.length} caractères`}
              {combinedText.length > 0 && uploadedFiles.length > 0 && ' • '}
              {uploadedFiles.length > 0 && `${uploadedFiles.length} document(s)`}
            </span>
          ) : (
            <span>Aucune entrée</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {hasInput && (
            <Button
              variant="ghost"
              onClick={clearAll}
              disabled={isLoading}
            >
              Effacer
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!hasInput || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                Confirmer et analyser
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
