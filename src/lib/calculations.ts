import { Scale, Truck, Waves, Sigma, Scissors, Droplets } from 'lucide-react';
import type { BridgeDesignInput, CalculationOutput, CalculationSection, CalculationSummary } from './types';
import { CONCRETE_DENSITY, WEARING_COAT_DENSITY } from './constants';

// This file contains simplified, illustrative calculations for demonstration purposes.
// It does not represent a complete or accurate engineering analysis.

function calculateDeadLoad(input: BridgeDesignInput): CalculationSection {
  // Simplified assumptions
  const slabThickness = input.spanLength / 25; // A common rule of thumb for starting point
  const slabWeight = slabThickness * input.spanLength * input.carriagewayWidth * CONCRETE_DENSITY;
  
  const wcThickness = 0.08; // 80mm wearing coat
  const wcWeight = wcThickness * input.spanLength * input.carriagewayWidth * WEARING_COAT_DENSITY;

  const totalDeadLoad = slabWeight + wcWeight;
  const deadLoadUDL = totalDeadLoad / input.spanLength;

  return {
    title: 'Dead Load (DL)',
    icon: Scale,
    steps: [
      {
        title: 'Self-weight of RCC Slab',
        formula: 'Volume × Density (V × γ)',
        values: `(${slabThickness.toFixed(2)}m × ${input.spanLength}m × ${input.carriagewayWidth}m) × ${CONCRETE_DENSITY} kN/m³`,
        result: slabWeight.toFixed(2),
        unit: 'kN',
        clause: 'IRC:6 - Cl. 204',
        aiContext: `The dead load of a concrete bridge deck slab is its own weight. This is a permanent, static load that the bridge must support throughout its life.`
      },
      {
        title: 'Weight of Wearing Coat',
        formula: 'Volume × Density (V × γ)',
        values: `(${wcThickness}m × ${input.spanLength}m × ${input.carriagewayWidth}m) × ${WEARING_COAT_DENSITY} kN/m³`,
        result: wcWeight.toFixed(2),
        unit: 'kN',
        clause: 'IRC:6 - Cl. 204',
        aiContext: `The wearing coat is the road surface on top of the bridge deck. Its weight is also a permanent dead load that needs to be accounted for in the design.`
      },
       {
        title: 'Total Dead Load (DL)',
        formula: 'Slab Weight + Wearing Coat Weight',
        values: `${slabWeight.toFixed(2)} kN + ${wcWeight.toFixed(2)} kN`,
        result: totalDeadLoad.toFixed(2),
        unit: 'kN',
        clause: 'IRC:6 - Cl. 204',
        aiContext: `The total dead load is the sum of all permanent, non-moving parts of the bridge structure.`
      },
      {
        title: 'Dead Load UDL (w_DL)',
        formula: 'Total DL / Span Length',
        values: `${totalDeadLoad.toFixed(2)} kN / ${input.spanLength} m`,
        result: deadLoadUDL.toFixed(2),
        unit: 'kN/m',
        clause: 'IRC:6 - Cl. 204',
        aiContext: `The dead load is converted to a Uniformly Distributed Load (UDL) to simplify bending moment and shear force calculations.`
      }
    ],
    summary: {
      title: 'Total Dead Load UDL',
      value: deadLoadUDL.toFixed(2),
      unit: 'kN/m',
    },
  };
}

function calculateLiveLoad(input: BridgeDesignInput): CalculationSection {
  const llUdl = 9.0; // Simplified UDL in kN/m for Class A loading
  const knifeEdgeLoad = 100; // Simplified knife edge load in kN

  const liveLoadValue = (input.loadClass === 'class_aa') ? 700 : llUdl * input.spanLength + knifeEdgeLoad;
  const liveLoadUDL = liveLoadValue / input.spanLength;

  return {
    title: 'Live Load (LL)',
    icon: Truck,
    steps: [
      {
        title: 'Vehicle Load Type',
        formula: 'Based on Selected IRC Class',
        values: `Class selected: ${input.loadClass === 'class_aa' ? 'IRC Class AA Tracked' : 'IRC Class A'}`,
        result: input.loadClass === 'class_aa' ? '700' : `${llUdl} kN/m + ${knifeEdgeLoad}`,
        unit: 'kN',
        clause: 'IRC:6 - Cl. 207',
        aiContext: `Live loads are temporary loads from vehicles and pedestrians. IRC:6 specifies different classes of vehicles for design, like Class A for typical highway traffic and Class AA for heavy military vehicles.`
      },
      {
        title: 'Equivalent Live Load UDL (w_LL)',
        formula: 'Total LL / Span Length',
        values: `${liveLoadValue.toFixed(2)} kN / ${input.spanLength} m`,
        result: liveLoadUDL.toFixed(2),
        unit: 'kN/m',
        clause: 'IRC:6 - Cl. 208',
        aiContext: `For simpler analysis, the complex vehicle load is often converted into an equivalent Uniformly Distributed Load (UDL) that produces a similar maximum bending moment or shear force.`
      }
    ],
    summary: {
      title: 'Equivalent Live Load UDL',
      value: liveLoadUDL.toFixed(2),
      unit: 'kN/m',
    },
  };
}

function calculateHydraulicDesign(input: BridgeDesignInput): CalculationSection {
  const waterDepth = input.highFloodLevel - input.riverBedLevel;
  if (waterDepth <= 0) {
    return {
      title: 'Hydraulic Design',
      icon: Droplets,
      steps: [{ title: 'Error', formula: '-', values: 'HFL must be greater than River Bed Level.', result: 'N/A', unit: '', clause: '', aiContext: 'High Flood Level must be above the River Bed Level to calculate hydraulic properties.' }],
      summary: { title: 'Design Discharge', value: 'N/A', unit: 'm³/s' }
    };
  }

  // 1. Discharge (Q) using Dicken's formula: Q = C * A^(3/4)
  const dickensConstant = 11.5; // For a region with 25-50cm annual rainfall
  const discharge = dickensConstant * Math.pow(input.catchmentArea, 0.75);

  // 2. Linear Waterway (W) using Lacey's formula: W = 4.75 * sqrt(Q)
  const waterwayWidth = 4.75 * Math.sqrt(discharge);

  // 3. Velocity (V) = Q / Area = Q / (W * d)
  const velocity = discharge / (waterwayWidth * waterDepth);

  // 4. Scour Depth (R) using Lacey's formula R = 1.35 * (q^2 / f)^(1/3)
  const dischargePerMeter = discharge / waterwayWidth;
  const scourDepthNormal = 1.35 * Math.pow(Math.pow(dischargePerMeter, 2) / input.siltFactor, 1/3);
  const designScourDepth = scourDepthNormal * 2.0; // At piers/abutments

  const foundationDepth = input.riverBedLevel - input.foundationLevel;
  const minimumFreeboard = 1.2;

  return {
    title: 'Hydraulic Design',
    icon: Droplets,
    steps: [
      {
        title: 'Maximum Flood Discharge (Q)',
        formula: 'Q = C × A^(3/4)',
        values: `Q = ${dickensConstant} × ${input.catchmentArea}^(3/4)`,
        result: discharge.toFixed(2),
        unit: 'm³/s',
        clause: "Dicken's Formula",
        aiContext: 'Maximum flood discharge is the highest rate of water flow a river is expected to carry. Dicken\'s formula is a common empirical method to estimate this based on the catchment area.'
      },
      {
        title: 'Linear Waterway Width (W)',
        formula: 'W = 4.75 × √Q',
        values: `W = 4.75 × √${discharge.toFixed(2)}`,
        result: waterwayWidth.toFixed(2),
        unit: 'm',
        clause: "Lacey's Regime Width",
        aiContext: 'This is the stable width of the river required to pass the design flood without significant erosion. It is a crucial input for determining the overall bridge length and span arrangement.'
      },
      {
        title: 'Maximum Velocity (V)',
        formula: 'V = Q / (W × d)',
        values: `V = ${discharge.toFixed(2)} / (${waterwayWidth.toFixed(2)} × ${waterDepth.toFixed(2)})`,
        result: velocity.toFixed(2),
        unit: 'm/s',
        clause: 'Continuity Equation',
        aiContext: 'The velocity of water during a flood determines the force on bridge piers and the potential for scour. It is calculated from the discharge and the flow\'s cross-sectional area.'
      },
      {
        title: 'Design Scour Depth',
        formula: 'R_design = 2.0 × 1.35 × (q² / f)^(1/3)',
        values: `R_design = 2.0 × 1.35 × ((${dischargePerMeter.toFixed(2)})² / ${input.siltFactor})^(1/3)`,
        result: designScourDepth.toFixed(2),
        unit: 'm',
        clause: 'IRC:78 - Cl. 703',
        aiContext: 'Scour is the erosion of the riverbed by flowing water, which is amplified around piers. The foundation must be placed safely below this design scour depth to prevent bridge failure.'
      },
      {
        title: 'Minimum Vertical Clearance (Freeboard)',
        formula: 'As per IRC:78-2014',
        values: 'A minimum clearance above HFL is required.',
        result: minimumFreeboard.toFixed(2),
        unit: 'm',
        clause: 'IRC:78 - Cl. 705.3',
        aiContext: 'Freeboard is the clear space between the High Flood Level and the bridge\'s underside. It prevents floating debris from hitting the bridge and accommodates wave action.'
      },
      {
        title: 'Provided Foundation Depth',
        formula: 'River Bed Level - Foundation Level',
        values: `${input.riverBedLevel.toFixed(2)}m - ${input.foundationLevel.toFixed(2)}m`,
        result: foundationDepth.toFixed(2),
        unit: 'm',
        clause: 'Design Data',
        aiContext: 'This is the actual depth of the foundation as specified in the inputs. It should be compared against the calculated Design Scour Depth to ensure safety.'
      },
    ],
    summary: {
      title: 'Design Discharge',
      value: discharge.toFixed(2),
      unit: 'm³/s',
    },
  };
}


function calculateImpactFactor(input: BridgeDesignInput): CalculationSection {
  let impactFactor;
  // Formula for RCC Bridges as per IRC:6 Cl. 209.2
  // I = 4.5 / (6 + L) for RCC
  impactFactor = 4.5 / (6 + input.spanLength);

  return {
    title: 'Impact Factor (I)',
    icon: Waves,
    steps: [
      {
        title: 'Impact Factor Calculation',
        formula: 'I = 4.5 / (6 + L)',
        values: `4.5 / (6 + ${input.spanLength}m)`,
        result: impactFactor.toFixed(3),
        unit: '',
        clause: 'IRC:6 - Cl. 209.2',
        aiContext: `The Impact Factor accounts for the dynamic effects of moving vehicles, like bouncing and vibrations. It's a multiplier applied to the live load to simulate these extra stresses, ensuring the bridge is designed for real-world conditions.`
      }
    ],
    summary: {
      title: 'Impact Factor',
      value: impactFactor.toFixed(3),
      unit: '',
    },
  };
}

function calculateDesignForces(dlUdl: number, llUdl: number, impact: number, span: number): { bmSection: CalculationSection; sfSection: CalculationSection } {
  const liveLoadWithImpact = llUdl * (1 + impact);
  const totalDesignUdl = dlUdl + liveLoadWithImpact;

  // Max Bending Moment for a simply supported beam: (w * L^2) / 8
  const maxBM = (totalDesignUdl * Math.pow(span, 2)) / 8;
  
  // Max Shear Force for a simply supported beam: (w * L) / 2
  const maxSF = (totalDesignUdl * span) / 2;

  const bmSection: CalculationSection = {
    title: 'Design Bending Moment (BM)',
    icon: Sigma,
    steps: [
      {
        title: 'Total Design UDL (w)',
        formula: 'w_DL + w_LL × (1 + I)',
        values: `${dlUdl.toFixed(2)} + ${llUdl.toFixed(2)} × (1 + ${impact.toFixed(3)})`,
        result: totalDesignUdl.toFixed(2),
        unit: 'kN/m',
        clause: 'IRC:6 - Load Combinations',
        aiContext: 'This is the total combined load the bridge must withstand, including the dead load, live load, and the dynamic impact of traffic.'
      },
      {
        title: 'Max Bending Moment (M_max)',
        formula: '(w × L²) / 8',
        values: `(${totalDesignUdl.toFixed(2)} kN/m × ${span}m²) / 8`,
        result: maxBM.toFixed(2),
        unit: 'kN-m',
        clause: 'Structural Analysis Principles',
        aiContext: 'Bending moment is the rotational force that causes a beam to bend. The maximum bending moment, typically at the center of a simple span, is a critical value for designing the beam\'s thickness and reinforcement.'
      },
    ],
    summary: {
      title: 'Max Bending Moment',
      value: maxBM.toFixed(2),
      unit: 'kN-m',
    },
  };

  const sfSection: CalculationSection = {
    title: 'Design Shear Force (SF)',
    icon: Scissors,
    steps: [
       {
        title: 'Max Shear Force (V_max)',
        formula: '(w × L) / 2',
        values: `(${totalDesignUdl.toFixed(2)} kN/m × ${span}m) / 2`,
        result: maxSF.toFixed(2),
        unit: 'kN',
        clause: 'Structural Analysis Principles',
        aiContext: 'Shear force is the force that causes parts of a beam to slide past each other. The maximum shear force occurs at the supports and is critical for designing against shear failure.'
      },
    ],
    summary: {
      title: 'Max Shear Force',
      value: maxSF.toFixed(2),
      unit: 'kN',
    },
  };
  
  return { bmSection, sfSection };
}

export function performCalculations(input: BridgeDesignInput): CalculationOutput {
  const dlSection = calculateDeadLoad(input);
  const llSection = calculateLiveLoad(input);
  const hydraulicSection = calculateHydraulicDesign(input);
  const impactSection = calculateImpactFactor(input);

  const dlUdl = parseFloat(dlSection.summary!.value);
  const llUdl = parseFloat(llSection.summary!.value);
  const impact = parseFloat(impactSection.summary!.value);

  const { bmSection, sfSection } = calculateDesignForces(dlUdl, llUdl, impact, input.spanLength);
  
  const sections = [dlSection, llSection, hydraulicSection, impactSection, bmSection, sfSection];

  const summary: CalculationSummary = {};
  sections.forEach(sec => {
    if (sec.summary) {
       summary[sec.title] = sec.summary;
    }
  });

  return {
    sections,
    summary,
  };
}
