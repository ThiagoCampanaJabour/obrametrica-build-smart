import { test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpreadsheetBudget } from '@/components/Orcamento/SpreadsheetBudget/SpreadsheetBudget';
import React from 'react';

// Mock crypto.randomUUID
if (!global.crypto) {
  (global as any).crypto = { randomUUID: () => Math.random().toString(36).substring(2) };
}

test('permite criar e nomear uma nova aba', async () => {
  render(<SpreadsheetBudget />);
  
  const addButton = screen.getByTestId('sheet-add-button');
  fireEvent.click(addButton);
  
  const input = screen.getByTestId('sheet-new-name-input');
  expect(input).toBeInTheDocument();
  
  fireEvent.change(input, { target: { value: 'Nova Aba Teste' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  
  await waitFor(() => {
    expect(screen.getByTestId('sheet-name-1')).toHaveTextContent('Nova Aba Teste');
  });
});

test('valida nome da aba (não permite vazio)', async () => {
  render(<SpreadsheetBudget />);
  
  const addButton = screen.getByTestId('sheet-add-button');
  fireEvent.click(addButton);
  
  const input = screen.getByTestId('sheet-new-name-input');
  fireEvent.change(input, { target: { value: '   ' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  
  expect(screen.getByText('Nome inválido')).toBeInTheDocument();
});

test('cancela criação de aba ao pressionar Esc', async () => {
  render(<SpreadsheetBudget />);
  
  const addButton = screen.getByTestId('sheet-add-button');
  fireEvent.click(addButton);
  
  expect(screen.getByTestId('sheet-new-name-input')).toBeInTheDocument();
  
  fireEvent.keyDown(screen.getByTestId('sheet-new-name-input'), { key: 'Escape' });
  
  await waitFor(() => {
    expect(screen.queryByTestId('sheet-new-name-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sheet-name-1')).not.toBeInTheDocument();
  });
});

test('permite renomear uma aba existente', async () => {
  render(<SpreadsheetBudget />);
  
  // A primeira aba é "Supermercado"
  const renameBtn = screen.getByTestId('sheet-rename-btn-0');
  fireEvent.click(renameBtn);
  
  const input = screen.getByTestId('sheet-rename-input-0');
  expect(input).toBeInTheDocument();
  
  fireEvent.change(input, { target: { value: 'Alimentação' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  
  await waitFor(() => {
    expect(screen.getByTestId('sheet-name-0')).toHaveTextContent('Alimentação');
  });
});
