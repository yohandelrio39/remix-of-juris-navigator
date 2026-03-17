import { JurisprudenceResult } from '@/types';
import { ExternalLink, BookOpen, Calendar, Building2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ResultCardProps {
  result: JurisprudenceResult;
  rank: number;
  onAddToDossier?: (result: JurisprudenceResult) => void;
  isInDossier?: boolean;
}

export function ResultCard({ result, rank, onAddToDossier, isInDossier }: ResultCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [added, setAdded] = useState(isInDossier);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success-light text-success';
    if (score >= 60) return 'bg-warning-light text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  const handleAddToDossier = () => {
    setAdded(true);
    onAddToDossier?.(result);
  };

  return (
    <div className="card-elevated p-5 animate-fade-in" style={{ animationDelay: `${rank * 50}ms` }}>
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-secondary-foreground">
            {rank}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-medium text-foreground leading-tight">
              {result.title}
            </h3>
            <span
              className={cn(
                "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold",
                getScoreColor(result.relevanceScore)
              )}
            >
              {result.relevanceScore}%
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{result.jurisdiction}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{result.date}</span>
            </div>
          </div>

          {/* Summary (expandable) */}
          {showSummary && (
            <div className="mb-4 p-4 bg-secondary rounded-lg animate-fade-in">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {result.summary}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(!showSummary)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showSummary ? 'Masquer' : 'Voir le résumé'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Source officielle
              </a>
            </Button>

            <Button
              variant={added ? "secondary" : "ghost"}
              size="sm"
              onClick={handleAddToDossier}
              disabled={added}
              className={cn(added && "text-success")}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Ajouté
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Dossier
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
