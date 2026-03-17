import { useState } from 'react';
import { ClarificationQuestion as ClarificationQuestionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface ClarificationQuestionsProps {
  questions: ClarificationQuestionType[];
  onSubmit: (answers: Record<string, string>) => void;
  isLoading?: boolean;
}

export function ClarificationQuestions({
  questions,
  onSubmit,
  isLoading
}: ClarificationQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const allAnswered = questions.every(q => answers[q.id]?.trim());

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-warning-light flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">Questions de clarification</h3>
          <p className="text-sm text-muted-foreground">
            Précisez votre recherche pour des résultats plus pertinents
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              {question.question}
            </label>

            {question.type === 'select' && question.options ? (
              <Select
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Votre réponse..."
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || isLoading}
          className="w-full sm:w-auto"
        >
          Lancer la recherche
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
