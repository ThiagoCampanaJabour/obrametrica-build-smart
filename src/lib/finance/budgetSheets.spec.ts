import { describe, it, expect } from 'vitest';
import { 
  normalizeAnnualToMonthly, 
  amortizeEventByInterval, 
  amortizeEventByKm, 
  calcRowTotal,
  normalizeRowToMonthly
} from './budgetSheets';
import { SheetRow } from '../types/budget-sheets';

describe('budgetSheets calculations', () => {
  it('should normalize annual to monthly', () => {
    expect(normalizeAnnualToMonthly(1200)).toBe(100);
  });

  it('should amortize event by interval', () => {
    expect(amortizeEventByInterval(600, 6)).toBe(100);
  });

  it('should amortize event by km', () => {
    // 500 reais de custo, troca a cada 5000km, roda 1000km/mês -> 100 reais/mês
    expect(amortizeEventByKm(500, 5000, 1000)).toBe(100);
  });

  it('should calculate row total with quantity, price and discount', () => {
    const row: Partial<SheetRow> = {
      quantity: 10,
      unitPrice: 100,
      discountPct: 10
    };
    expect(calcRowTotal(row)).toBe(900);
  });

  it('should normalize row to monthly based on periodicity', () => {
    const baseRow: SheetRow = {
      id: '1',
      category: 'Test',
      subcategory: 'Test',
      periodicity: 'mensal',
      total: 100,
      rows: [] // not needed for type but satisfies interface if any
    } as any;

    expect(normalizeRowToMonthly({ ...baseRow, periodicity: 'mensal' })).toBe(100);
    expect(normalizeRowToMonthly({ ...baseRow, periodicity: 'anual' })).toBe(100 / 12);
    expect(normalizeRowToMonthly({ 
      ...baseRow, 
      periodicity: 'evento', 
      frequencyMonths: 4 
    })).toBe(25);
  });
});
