 // src/services/api.ts
 // API service for SKANDAMIS Legal Research Application
 // Connects Lovable frontend with FastAPI backend
 
 import { SearchRequest, JurisprudenceResult, ClarificationQuestion } from '@/types';
 
 // API Base URL - use environment variable or fallback to localhost
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
 
 export interface SearchResponse {
   needsClarification: boolean;
   clarificationQuestions?: ClarificationQuestion[];
   results?: JurisprudenceResult[];
 }
 
 export interface ClarificationAnswers {
   answers: Record<string, string>;
 }
 
 /**
  * API Service for jurisprudence search
  */
 export const api = {
   /**
    * Check API health status
    */
   async health(): Promise<{ status: string; service: string; version: string }> {
     const response = await fetch(`${API_BASE_URL}/api/health`);
 
     if (!response.ok) {
       throw new Error('API health check failed');
     }
 
     return response.json();
   },
 
   /**
    * Initial search - analyzes input and returns clarification questions
    */
   async search(request: SearchRequest): Promise<SearchResponse> {
     const response = await fetch(`${API_BASE_URL}/api/search`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(request),
     });
 
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.detail || 'Search request failed');
     }
 
     return response.json();
   },
 
   /**
    * Execute search with clarification answers - returns jurisprudence results
    */
   async executeSearch(
     request: SearchRequest,
     clarifications: ClarificationAnswers
   ): Promise<JurisprudenceResult[]> {
     const response = await fetch(`${API_BASE_URL}/api/search/execute`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         ...request,
         clarifications,
       }),
     });
 
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.detail || 'Search execution failed');
     }
 
     return response.json();
   },
 
   /**
    * Create a new dossier for organizing searches
    */
   async createDossier(name: string) {
     const response = await fetch(`${API_BASE_URL}/api/dossiers?name=${encodeURIComponent(name)}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
     });
 
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.detail || 'Failed to create dossier');
     }
 
     return response.json();
   },
 
   /**
    * Add a jurisprudence result to a dossier
    */
   async addResultToDossier(dossierId: string, resultId: string) {
     const response = await fetch(
       `${API_BASE_URL}/api/dossiers/${dossierId}/results?result_id=${resultId}`,
       {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
       }
     );
 
     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.detail || 'Failed to add result to dossier');
     }
 
     return response.json();
   },
 };