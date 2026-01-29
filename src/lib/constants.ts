import type { BridgeDesignInput } from './types';

// All units are in standard SI (meters, kN, etc.)

// Densities (kN/m^3) as per IRC:6 Table 2
export const CONCRETE_DENSITY = 24; // Reinforced Cement Concrete
export const WEARING_COAT_DENSITY = 22; // Bituminous or Asphaltic Concrete

// Material Grades
export const CONCRETE_GRADES = ['M25', 'M30', 'M35', 'M40', 'M45', 'M50'];
export const STEEL_GRADES = ['Fe415', 'Fe500', 'Fe550'];

// Bridge Types
export const BRIDGE_TYPES = {
  rcc_slab: 'RCC Slab Bridge',
  t_beam: 'T-Beam Bridge',
  box_girder: 'Box Girder Bridge',
};

// Lane Numbers
export const LANE_OPTIONS = [
  { value: 1, label: 'Single Lane' },
  { value: 2, label: 'Two Lanes' },
  { value: 4, label: 'Four Lanes' },
];

// Load Classes
export const LOAD_CLASSES = {
  class_a: 'IRC Class A',
  class_aa: 'IRC Class AA',
};

export const DEFAULT_INPUTS: BridgeDesignInput = {
  bridgeType: 'rcc_slab',
  spanLength: 15,
  carriagewayWidth: 7.5,
  numLanes: 2,
  concreteGrade: 'M35',
  steelGrade: 'Fe500',
  loadClass: 'class_aa',
};
