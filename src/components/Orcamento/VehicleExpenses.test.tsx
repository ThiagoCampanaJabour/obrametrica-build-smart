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

describe('VehicleExpenses Component', () => {
  it('should render the add vehicle button', () => {
    render(
      <TooltipProvider>
        <VehicleExpenses input={mockInput} onChange={() => {}} />
      </TooltipProvider>
    );
    expect(screen.getByTestId('vehicle-add')).toBeDefined();
  });

  it('should call onChange when adding a vehicle', () => {
    const onChange = vi.fn();
    render(
      <TooltipProvider>
        <VehicleExpenses input={mockInput} onChange={onChange} />
      </TooltipProvider>
    );
    
    fireEvent.click(screen.getByTestId('vehicle-add'));
    expect(onChange).toHaveBeenCalled();
    const newBudget = onChange.mock.calls[0][0] as BudgetInput;
    expect(newBudget.vehicles.length).toBe(1);
    expect(newBudget.vehicles[0].name).toBe('Novo Veículo');
  });

  it('should update vehicle fields correctly', () => {
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
    const onChange = vi.fn();
    
    render(
      <TooltipProvider>
        <VehicleExpenses input={inputWithVehicle} onChange={onChange} />
      </TooltipProvider>
    );
    
    // Abrir o acordeão pelo data-testid do header
    fireEvent.click(screen.getByTestId('vehicle-0-header'));
    
    const kmInput = screen.getByTestId('vehicle-0-km-per-month');
    fireEvent.change(kmInput, { target: { value: '2000' } });
    
    expect(onChange).toHaveBeenCalled();
    const updatedBudget = onChange.mock.calls[0][0] as BudgetInput;
    expect(updatedBudget.vehicles[0].kmPerMonth).toBe(2000);
  });
});
