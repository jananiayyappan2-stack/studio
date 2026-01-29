"use client";

import type { CalculationOutput } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, DraftingCompass } from 'lucide-react';
import CalculationStep from './calculation-step';
import { useToast } from "@/hooks/use-toast"

interface ResultsDisplayProps {
  results: CalculationOutput | null;
  isLoading: boolean;
  onReset: () => void;
}

const SummaryCard = ({ summary }: { summary: CalculationOutput['summary'] }) => (
  <Card className="mb-8 bg-secondary">
    <CardHeader>
      <CardTitle className="font-headline text-xl">Design Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.values(summary).map((item) => (
          <div key={item.title}>
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <p className="text-2xl font-bold font-headline text-primary">
              {item.value} <span className="text-lg font-normal text-foreground">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
    <DraftingCompass className="w-16 h-16 text-muted-foreground mb-4" />
    <CardTitle className="font-headline text-2xl">Ready to Calculate</CardTitle>
    <CardDescription className="mt-2 max-w-md">
      Fill in the parameters on the left and click "Calculate" to start the design process. The results will be displayed here.
    </CardDescription>
  </Card>
);

export default function ResultsDisplay({ results, isLoading, onReset }: ResultsDisplayProps) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The option to export results as a PDF will be available in a future update.",
    })
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) {
    return <EmptyState />;
  }

  const defaultAccordionValue = results.sections.map(s => s.title);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold font-headline">Calculation Results</h2>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
            <Button variant="destructive" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
            </Button>
        </div>
      </div>

      <SummaryCard summary={results.summary} />

      <Accordion type="multiple" defaultValue={defaultAccordionValue} className="w-full space-y-4">
        {results.sections.map((section) => (
          <AccordionItem key={section.title} value={section.title} className="border-none">
             <Card className="shadow-sm">
                <AccordionTrigger className="p-6 text-xl font-semibold font-headline hover:no-underline">
                  <div className="flex items-center gap-3">
                    <section.icon className="w-6 h-6 text-primary" />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <div className="space-y-6">
                    {section.steps.map((step, index) => (
                      <CalculationStep key={index} {...step} />
                    ))}
                  </div>
                </AccordionContent>
              </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
