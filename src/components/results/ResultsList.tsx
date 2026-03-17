import { JurisprudenceResult } from '@/types';
import { ResultCard } from './ResultCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FolderPlus } from 'lucide-react';

interface ResultsListProps {
  results: JurisprudenceResult[];
  onBack: () => void;
  onAddToDossier?: (result: JurisprudenceResult) => void;
}

export function ResultsList({ results, onBack, onAddToDossier }: ResultsListProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nouvelle recherche
          </Button>
          <h2 className="font-serif text-2xl font-semibold">
            Résultats de recherche
          </h2>
          <p className="text-muted-foreground mt-1">
            {results.length} jurisprudences pertinentes trouvées
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="w-4 h-4 mr-2" />
            Sauvegarder dans un dossier
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <ResultCard
            key={result.id}
            result={result}
            rank={index + 1}
            onAddToDossier={onAddToDossier}
          />
        ))}
      </div>

      {/* Pagination / Load more could go here */}
      {results.length >= 10 && (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Affichage des 10 jurisprudences les plus pertinentes
          </p>
        </div>
      )}
    </div>
  );
}
