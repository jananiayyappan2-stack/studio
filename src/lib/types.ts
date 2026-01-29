export interface BridgeDesignInput {
  bridgeType: 'rcc_slab' | 't_beam' | 'box_girder';
  spanLength: number;
  carriagewayWidth: number;
  numLanes: 1 | 2 | 4;
  concreteGrade: string;
  steelGrade: string;
  loadClass: 'class_a' | 'class_aa';
  highFloodLevel: number;
  riverBedLevel: number;
  foundationLevel: number;
}

export interface CalculationStep {
  title: string;
  formula: string;
  values: string;
  result: string;
  unit: string;
  clause: string;
  aiContext: string;
}

export interface CalculationSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: CalculationStep[];
  summary?: {
    title: string;
    value: string;
    unit: string;
  };
}

export interface CalculationSummary {
  [key: string]: {
    title: string;
    value: string;
    unit: string;
  }
}

export interface CalculationOutput {
  sections: CalculationSection[];
  summary: CalculationSummary;
}
