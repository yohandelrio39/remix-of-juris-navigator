// Types for the SKANDAMIS Legal Research Application

export interface Dossier {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  searchCount: number;
}

export interface JurisprudenceResult {
  id: string;
  title: string;
  jurisdiction: string;
  date: string;
  relevanceScore: number;
  summary: string;
  sourceUrl: string;
  dossierId?: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type: 'select' | 'text';
  options?: string[];
  answer?: string;
}

export interface SearchRequest {
  textInput?: string;
  audioTranscription?: string;
  uploadedDocuments?: UploadedDocument[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  extractedText?: string;
}

export type AppStep = 'search' | 'clarification' | 'results';

export interface SearchState {
  step: AppStep;
  textInput: string;
  audioTranscription: string;
  uploadedDocuments: UploadedDocument[];
  clarificationQuestions: ClarificationQuestion[];
  results: JurisprudenceResult[];
  isLoading: boolean;
  error: string | null;
  activeDossierId: string | null;
}
