 import { useState } from 'react';
 import { AppLayout } from '@/components/layout/AppLayout';
 import { SearchInputPanel } from '@/components/search/SearchInputPanel';
 import { ClarificationQuestions } from '@/components/search/ClarificationQuestions';
 import { ResultsList } from '@/components/results/ResultsList';
 import { api } from '@/services/api';
 import { AppStep, UploadedDocument, JurisprudenceResult, ClarificationQuestion } from '@/types';
 import { useToast } from '@/hooks/use-toast';
 
 const Index = () => {
   const [step, setStep] = useState<AppStep>('search');
   const [isLoading, setIsLoading] = useState(false);
   const [showClarification, setShowClarification] = useState(false);
   const [results, setResults] = useState<JurisprudenceResult[]>([]);
   const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
 
   // Store original search request for execute step
   const [originalSearchRequest, setOriginalSearchRequest] = useState<{
     text: string;
     files: UploadedDocument[];
   } | null>(null);
 
   const { toast } = useToast();
 
   const handleSearchSubmit = async (data: { text: string; files: UploadedDocument[] }) => {
     setIsLoading(true);
     setOriginalSearchRequest(data);
 
     try {
       // Call real API
       const response = await api.search({
         textInput: data.text,
         uploadedDocuments: data.files
       });
 
       if (response.needsClarification && response.clarificationQuestions) {
         // Show clarification questions from backend
         setClarificationQuestions(response.clarificationQuestions);
         setShowClarification(true);
         setStep('clarification');
       } else if (response.results) {
         // Direct results without clarification
         setResults(response.results);
         setStep('results');
       }
     } catch (error) {
       console.error('Search failed:', error);
       toast({
         title: "Erreur de recherche",
         description: error instanceof Error ? error.message : "Une erreur s'est produite",
         variant: "destructive"
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleClarificationSubmit = async (answers: Record<string, string>) => {
     if (!originalSearchRequest) {
       toast({
         title: "Erreur",
         description: "Données de recherche manquantes",
         variant: "destructive"
       });
       return;
     }
 
     setIsLoading(true);
 
     try {
       // Execute search with clarifications
       const results = await api.executeSearch(
         {
           textInput: originalSearchRequest.text,
           uploadedDocuments: originalSearchRequest.files
         },
         { answers }
       );
 
       setResults(results);
       setShowClarification(false);
       setStep('results');
 
       toast({
         title: "Recherche terminée",
         description: `${results.length} décisions trouvées`,
       });
     } catch (error) {
       console.error('Search execution failed:', error);
       toast({
         title: "Erreur d'exécution",
         description: error instanceof Error ? error.message : "Une erreur s'est produite",
         variant: "destructive"
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleNewSearch = () => {
     setStep('search');
     setShowClarification(false);
     setResults([]);
     setClarificationQuestions([]);
     setOriginalSearchRequest(null);
   };
 
   const handleAddToDossier = async (result: JurisprudenceResult) => {
     try {
       // Create a new dossier
       const dossier = await api.createDossier("Nouveau dossier");
       await api.addResultToDossier(dossier.id, result.id);
 
       toast({
         title: "Ajouté au dossier",
         description: `La décision ${result.title} a été ajoutée`,
       });
     } catch (error) {
       console.error('Failed to add to dossier:', error);
       toast({
         title: "Erreur",
         description: "Impossible d'ajouter au dossier",
         variant: "destructive"
       });
     }
   };
 
   return (
     <AppLayout>
       {step === 'search' && !showClarification && (
         <SearchInputPanel
           onSubmit={handleSearchSubmit}
           isLoading={isLoading}
         />
       )}
 
       {step === 'clarification' && showClarification && (
         <div className="space-y-6">
           <div className="card-elevated p-5 bg-secondary/30">
             <p className="text-sm text-muted-foreground">
               <span className="font-medium text-foreground">Analyse en cours...</span> Le système a identifié votre cas.
               Répondez à quelques questions pour affiner la recherche.
             </p>
           </div>
           <ClarificationQuestions
             questions={clarificationQuestions}
             onSubmit={handleClarificationSubmit}
             isLoading={isLoading}
           />
         </div>
       )}
 
       {step === 'results' && (
         <ResultsList
           results={results}
           onBack={handleNewSearch}
           onAddToDossier={handleAddToDossier}
         />
       )}
     </AppLayout>
   );
 };
 
 export default Index;
