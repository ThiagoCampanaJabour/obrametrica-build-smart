import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpreadsheetBudget } from './SpreadsheetBudget';
import * as storage from '@/lib/finance/budgetSheets';
import React from 'react';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('SpreadsheetBudget Save/Export UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('opens save modal when clicking save button', async () => {
    render(<SpreadsheetBudget />);
    
    const saveBtn = screen.getByTestId('workbook-save-button');
    fireEvent.click(saveBtn);
    
    expect(screen.getByTestId('workbook-save-modal')).toBeDefined();
    expect(screen.getByTestId('workbook-save-name')).toBeDefined();
  });

  it('shows saves history panel', () => {
    render(<SpreadsheetBudget />);
    
    const historyBtn = screen.getByTestId('workbook-history-button');
    fireEvent.click(historyBtn);
    
    expect(screen.getByTestId('workbook-saves-panel')).toBeDefined();
  });

  it('shows export menu options', () => {
    render(<SpreadsheetBudget />);
    
    const exportBtn = screen.getByTestId('workbook-export-button');
    fireEvent.click(exportBtn);
    
    expect(screen.getByTestId('workbook-export-modal')).toBeDefined();
    expect(screen.getByTestId('workbook-export-json')).toBeDefined();
    expect(screen.getByTestId('workbook-export-xlsx')).toBeDefined();
  });
});
