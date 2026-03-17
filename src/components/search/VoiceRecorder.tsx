import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        // Simulate transcription processing
        // In production, this would send audio to backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock transcription result
        const mockTranscription = "Mon client a été arrêté pour vol avec effraction. Il conteste les faits et souhaite connaître les jurisprudences récentes du Tribunal fédéral concernant les cas similaires avec circonstances atténuantes.";
        onTranscription(mockTranscription);
        
        setIsProcessing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className={cn(
          "w-16 h-16 rounded-full relative",
          isRecording && "animate-pulse-soft"
        )}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isRecording ? (
          <>
            <div className="absolute inset-0 rounded-full bg-destructive/20 recording-pulse" />
            <Square className="w-5 h-5 relative z-10" />
          </>
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>
      <p className="text-sm text-muted-foreground">
        {isProcessing
          ? "Transcription en cours..."
          : isRecording
          ? "Cliquez pour arrêter"
          : "Dictée vocale"}
      </p>
    </div>
  );
}
