"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator } from 'lucide-react';

import type { BridgeDesignInput } from '@/lib/types';
import { BRIDGE_TYPES, CONCRETE_GRADES, STEEL_GRADES, LOAD_CLASSES, LANE_OPTIONS, DEFAULT_INPUTS } from '@/lib/constants';

const formSchema = z.object({
  bridgeType: z.enum(['rcc_slab', 't_beam', 'box_girder']),
  spanLength: z.coerce.number().min(5, "Min span is 5m").max(200, "Max span is 200m"),
  carriagewayWidth: z.coerce.number().min(3, "Min width is 3m").max(30, "Max width is 30m"),
  numLanes: z.coerce.number().refine(val => [1, 2, 4].includes(val)),
  concreteGrade: z.string(),
  steelGrade: z.string(),
  loadClass: z.enum(['class_a', 'class_aa']),
  highFloodLevel: z.coerce.number(),
  riverBedLevel: z.coerce.number(),
  foundationLevel: z.coerce.number(),
  catchmentArea: z.coerce.number().min(1, 'Min area is 1 sq.km'),
  siltFactor: z.coerce.number().min(0.5, 'Min silt factor is 0.5').max(2.5, 'Max silt factor is 2.5'),
});

interface InputFormProps {
  onCalculate: (data: BridgeDesignInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onCalculate, isLoading }: InputFormProps) {
  const form = useForm<BridgeDesignInput>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_INPUTS,
  });

  const onSubmit = (data: BridgeDesignInput) => {
    onCalculate(data);
  };

  return (
    <Card className="sticky top-8 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Input Parameters</CardTitle>
        <CardDescription>Define the properties of your bridge.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="bridgeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bridge Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(BRIDGE_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <h3 className="text-lg font-semibold font-headline -mb-2">Geometry</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="spanLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Span Length (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="carriagewayWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="numLanes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Lanes</FormLabel>
                     <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANE_OPTIONS.map(opt => (
                           <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <Separator />
            <h3 className="text-lg font-semibold font-headline -mb-2">Hydraulic Particulars</h3>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="highFloodLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HFL (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riverBedLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Level (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foundationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Found. Level (m)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="catchmentArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catchment Area (km²)</FormLabel>
                    <FormControl><Input type="number" step="1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="siltFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Silt Factor (f)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            <h3 className="text-lg font-semibold font-headline -mb-2">Materials & Loading</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="concreteGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concrete</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CONCRETE_GRADES.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="steelGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {STEEL_GRADES.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="loadClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IRC Load Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(LOAD_CLASSES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Calculator className="mr-2 h-4 w-4" />
              {isLoading ? 'Calculating...' : 'Calculate'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
