"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { getCalculationExplanation } from '@/app/actions';

interface AiExplanationProps {
  calculationType: string;
  formula: string;
  values: string;
  result: string;
  context: string;
}

export default function AiExplanation(props: AiExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExplanation() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCalculationExplanation(props);
        setExplanation(response.explanation);
      } catch (e) {
        setError('Failed to generate explanation. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExplanation();
  }, [props]);

  return (
    <div className="mt-4">
      {isLoading && (
        <Card className="bg-background/70">
          <CardHeader>
             <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent"/>
                <Skeleton className="h-6 w-48" />
             </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {explanation && !isLoading && (
        <Card className="bg-background/70 border-accent/50">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-accent font-headline">
                <Lightbulb className="h-5 w-5"/>
                Simplified Explanation
             </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 leading-relaxed">{explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
