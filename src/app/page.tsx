"use client";

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import InputForm from '@/components/setu-calc/input-form';
import ResultsDisplay from '@/components/setu-calc/results-display';
import type { BridgeDesignInput, CalculationOutput } from '@/lib/types';
import { performCalculations } from '@/lib/calculations';

export default function Home() {
  const [results, setResults] = useState<CalculationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const handleCalculate = (data: BridgeDesignInput) => {
    setIsLoading(true);
    // Simulate calculation time to show loading state
    setTimeout(() => {
      const output = performCalculations(data);
      setResults(output);
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setResults(null);
    setFormKey(Date.now()); // Re-mounts the form to reset its state
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1 xl:col-span-1">
            <InputForm key={formKey} onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2 xl:col-span-3">
            <ResultsDisplay results={results} isLoading={isLoading} onReset={handleReset} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
