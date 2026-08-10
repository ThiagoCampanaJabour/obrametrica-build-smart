import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableTabTriggerProps {
  id: string;
  name: string;
  isActive: boolean;
  isRenameable: boolean;
  onRename: (newName: string) => void;
  onCancelNew?: () => void;
  isNew?: boolean;
  index: number;
}

export function EditableTabTrigger({
  id,
  name,
  isActive,
  isRenameable,
  onRename,
  onCancelNew,
  isNew,
  index
}: EditableTabTriggerProps) {
  const [isEditing, setIsEditing] = useState(isNew || false);
  const [editValue, setEditValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!isRenameable) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const validateAndConfirm = () => {
    const trimmed = editValue.trim();
    if (trimmed.length === 0) {
      setError("Nome inválido");
      return;
    }
    if (trimmed.length > 64) {
      setError("Muito longo (máx 64)");
      return;
    }
    
    setError(null);
    setIsEditing(false);
    onRename(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndConfirm();
    } else if (e.key === 'Escape') {
      if (isNew && onCancelNew) {
        onCancelNew();
      } else {
        setIsEditing(false);
        setEditValue(name);
        setError(null);
      }
    }
  };

  const handleBlur = () => {
    // Se for novo e estiver vazio, cancelamos
    if (isNew && editValue.trim().length === 0 && onCancelNew) {
      onCancelNew();
      return;
    }
    validateAndConfirm();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md border border-primary shadow-sm min-w-[120px]">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "h-7 py-0 px-2 text-sm border-none focus-visible:ring-0",
            error && "text-red-500"
          )}
          placeholder="Nome da aba..."
          data-testid={isNew ? "sheet-new-name-input" : `sheet-rename-input-${index}`}
          aria-label="Nome da aba"
          aria-invalid={!!error}
        />
        {error && (
          <span className="absolute -bottom-6 left-0 text-[10px] text-red-500 bg-white px-1 border rounded shadow-sm z-10 whitespace-nowrap">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span 
        className="truncate max-w-[150px]" 
        data-testid={`sheet-name-${index}`}
      >
        {name}
      </span>
      {isRenameable && isActive && (
        <button
          onClick={handleStartEdit}
          className="p-0.5 hover:bg-slate-200 rounded text-slate-400 group-hover:text-slate-600 transition-colors"
          data-testid={`sheet-rename-btn-${index}`}
          aria-label={`Renomear aba ${name}`}
        >
          <Edit2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
