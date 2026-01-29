"use client";

import { useState } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AiExplanation from './ai-explanation';
import type { CalculationStep as CalculationStepType } from '@/lib/types';

export default function CalculationStep(props: CalculationStepType) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="p-4 border rounded-lg bg-secondary/50">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg mb-2">{props.title}</h4>
        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
          <BookOpen className="w-4 h-4" />
          <span>{props.clause}</span>
        </div>
      </div>
      <Separator className="my-2 bg-border" />
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-x-6 gap-y-2 text-sm md:text-base">
        <span className="font-semibold text-muted-foreground">Formula:</span>
        <code className="font-mono bg-muted px-2 py-1 rounded-md break-all">{props.formula}</code>

        <span className="font-semibold text-muted-foreground">Substitution:</span>
        <code className="font-mono bg-muted px-2 py-1 rounded-md break-all">{props.values}</code>

        <span className="font-semibold text-muted-foreground">Result:</span>
        <p className="font-bold text-lg text-primary">
          {props.result} <span className="font-normal text-foreground text-base">{props.unit}</span>
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setShowExplanation(!showExplanation)}>
          <Lightbulb className={`mr-2 h-4 w-4 ${showExplanation ? 'text-accent' : ''}`} />
          {showExplanation ? 'Hide Explanation' : 'Learning Mode'}
        </Button>
      </div>
      {showExplanation && (
        <AiExplanation
          calculationType={props.title}
          formula={props.formula}
          values={props.values}
          result={`${props.result} ${props.unit}`}
          context={props.aiContext}
        />
      )}
    </div>
  );
}
