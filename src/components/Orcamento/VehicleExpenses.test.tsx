import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleExpenses } from './VehicleExpenses';
import { BudgetInput } from '@/lib/types/budget';
import { TooltipProvider } from '@/components/ui/tooltip';

const mockInput: BudgetInput = {
  consumptionMode: 'direct',
  tariff: 0.85,
  taxPct: 25,
  vehicles: [],
  appliances: []
};

describe('VehicleExpenses Component (Full Fields)', () => {
  it('should render all technical fields when expanded', () => {
    const vehicle = {
      id: '1',
      name: 'Carro 1',
      type: 'gasolina' as const,
      kmPerMonth: 1000,
      consumptionKmPerL: 10,
      fuelPricePerL: 5,
      maintenanceMonthly: 100,
      maintenanceAnnual: 0,
      insuranceAnnual: 1200,
      ipvaAnnual: 1000,
      licensingAnnual: 200,
      vehicleValue: 50000,
      depreciationRateAnnualPct: 10,
      chargingEfficiencyPct: 95,
      financing: {
        financedAmount: 0,
        downPayment: 0,
        annualRatePct: 0,
        termYears: 0,
        amortizationType: 'PRICE' as const
      },
      finiteItems: {
        tires: { costPerSet: 0, replacementIntervalKm: 40000, numberOfTires: 4 },
        oilChange: { costPerChange: 0, intervalKm: 10000 }
      },
      parkingMonthly: 0,
      tollsMonthly: 0,
      carWashMonthly: 0,
      otherMonthly: 0
    };
    
    const inputWithVehicle = { ...mockInput, vehicles: [vehicle] };
    
    render(
      <TooltipProvider>
        <VehicleExpenses input={inputWithVehicle} onChange={() => {}} />
      </TooltipProvider>
    );
    
    // Expand vehicle
    fireEvent.click(screen.getByTestId('vehicle-0-header'));
    
    // Check key data-testids from the request
    expect(screen.getByTestId('vehicle-0-km-per-month')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-type')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-consumption-km-per-l')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-fuel-price-per-l')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-financed-amount')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-annual-rate-pct')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-term-years')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-value')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-depreciation-rate')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-parking')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-tolls')).toBeDefined();
  });

  it('should toggle EV fields based on type', async () => {
    const vehicle = {
      id: '1',
      name: 'Carro EV',
      type: 'eletrico' as const,
      kmPerMonth: 1000,
      consumptionKwhPer100Km: 15,
      electricityPricePerKwh: 0.9,
      chargingEfficiencyPct: 95,
      maintenanceMonthly: 0,
      maintenanceAnnual: 0,
      insuranceAnnual: 0,
      ipvaAnnual: 0,
      licensingAnnual: 0,
      vehicleValue: 100000,
      depreciationRateAnnualPct: 10
    };
    
    const inputWithVehicle = { ...mockInput, vehicles: [vehicle as any] };
    
    render(
      <TooltipProvider>
        <VehicleExpenses input={inputWithVehicle} onChange={() => {}} />
      </TooltipProvider>
    );
    
    fireEvent.click(screen.getByTestId('vehicle-0-header'));
    
    expect(screen.getByTestId('vehicle-0-consumption-kwh-per-100km')).toBeDefined();
    expect(screen.getByTestId('vehicle-0-electricity-price-per-kwh')).toBeDefined();
    expect(screen.queryByTestId('vehicle-0-consumption-km-per-l')).toBeNull();
  });
});