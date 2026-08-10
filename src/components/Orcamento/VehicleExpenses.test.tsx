import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleExpenses } from './VehicleExpenses';
import { BudgetInput } from '@/lib/types/budget';
import { VehicleInput } from '@/lib/types/vehicle';

describe('Componente VehicleExpenses', () => {
  const sampleVehicle: VehicleInput = {
    id: 'v1',
    name: 'Carro Teste',
    type: 'gasolina',
    kmPerMonth: 1000,
    consumptionKmPerL: 10,
    fuelPricePerL: 5,
    maintenanceMonthly: 100,
    maintenanceAnnual: 0,
    insuranceAnnual: 0,
    ipvaAnnual: 0,
    licensingAnnual: 0,
    vehicleValue: 50000,
    depreciationRateAnnualPct: 10,
    chargingEfficiencyPct: 95,
    parkingMonthly: 0,
    tollsMonthly: 0,
    carWashMonthly: 0,
    otherMonthly: 0,
    financing: {
      financedAmount: 0,
      downPayment: 0,
      annualRatePct: 0,
      termYears: 0,
      amortizationType: 'PRICE'
    },
    finiteItems: {
      tires: { costPerSet: 0, replacementIntervalKm: 40000, numberOfTires: 4 },
      oilChange: { costPerChange: 0, intervalKm: 10000 }
    }
  };

  const mockInput: BudgetInput = {
    consumptionMode: 'direct',
    tariff: 0.85,
    taxPct: 25,
    vehicles: [sampleVehicle]
  };

  const mockOnChange = vi.fn();

  it('deve renderizar o componente e listar veículos', () => {
    render(<VehicleExpenses input={mockInput} onChange={mockOnChange} />);
    expect(screen.getByTestId('vehicle-0-label')).toBeDefined();
    expect(screen.getByDisplayValue('Carro Teste')).toBeDefined();
  });

  it('deve alternar a visibilidade dos detalhes ao clicar no header', () => {
    render(<VehicleExpenses input={mockInput} onChange={mockOnChange} />);
    const header = screen.getByTestId('vehicle-0-header');
    
    fireEvent.click(header);
    expect(screen.getByTestId('vehicle-0-km-per-month')).toBeDefined();
  });

  it('deve chamar onChange ao atualizar campos', () => {
    render(<VehicleExpenses input={mockInput} onChange={mockOnChange} />);
    const header = screen.getByTestId('vehicle-0-header');
    fireEvent.click(header);
    
    const kmInput = screen.getByTestId('vehicle-0-km-per-month');
    fireEvent.change(kmInput, { target: { value: '2000' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });
});
