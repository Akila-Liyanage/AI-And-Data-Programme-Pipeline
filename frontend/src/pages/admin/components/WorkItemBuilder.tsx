/**
 * WorkItemBuilder.tsx
 *
 * STEP 5 WORK ITEM BUILDER component.
 * Allows administrative creation and allocation of work breakdown tasks.
 *
 * Role options:
 * - Business Analyst
 * - Frontend Developer
 * - Backend Developer
 * - QA
 * - AI/ML
 *
 * Status options:
 * - Not Started
 * - In Progress
 * - Completed
 */
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button, Badge } from '../../../components/common';

export interface WorkItem {
  id: string;
  task: string;
  requiredRole: string;
  percentage: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

interface WorkItemBuilderProps {
  workItems: WorkItem[];
  onChange: (items: WorkItem[]) => void;
  errors?: { [key: string]: string | undefined };
}

const REQUIRED_ROLES = [
  'Business Analyst',
  'Frontend Developer',
  'Backend Developer',
  'QA',
  'AI/ML',
];

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

export default function WorkItemBuilder({
  workItems,
  onChange,
  errors = {},
}: WorkItemBuilderProps) {
  // Add item
  const handleAddItem = () => {
    const newItem: WorkItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      task: '',
      requiredRole: '',
      percentage: 0,
      status: 'Not Started',
    };
    onChange([...workItems, newItem]);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    onChange(workItems.filter((item) => item.id !== id));
  };

  // Change specific field
  const handleFieldChange = (
    id: string,
    field: keyof WorkItem,
    value: string | number
  ) => {
    const updated = workItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  // Totals calculations
  const totalAllocated = workItems.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
  const remaining = 100 - totalAllocated;

  return (
    <div className="space-y-4">
      {/* Percentage Allocation Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="block text-[10px] font-bold text-[var(--color-brand-navy)] uppercase tracking-wider">
            Percentage Allocation Summary
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <p className="text-slate-700">
              Allocated: <span className="text-[var(--color-brand-blue)] font-bold text-sm">{totalAllocated}%</span>
            </p>
            <p className="text-slate-700">
              Remaining:{' '}
              <span
                className={`font-bold text-sm ${
                  remaining < 0 ? 'text-rose-600' : remaining === 0 ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {remaining}%
              </span>
            </p>
          </div>
        </div>

        {/* Validation status badge */}
        <div>
          {totalAllocated < 100 ? (
            <Badge variant="warning" size="sm">
              Work item allocation is incomplete
            </Badge>
          ) : totalAllocated > 100 ? (
            <Badge variant="neutral" className="bg-rose-100 text-rose-700" size="sm">
              Work item allocation exceeds 100%
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              Work item allocation is complete
            </Badge>
          )}
        </div>
      </div>

      {/* Table Header for Desktop */}
      {workItems.length > 0 && (
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
          <div className="col-span-5">Work / Task *</div>
          <div className="col-span-3">Required Role *</div>
          <div className="col-span-2">Weight (%) *</div>
          <div className="col-span-1.5">Status</div>
          <div className="col-span-0.5"></div>
        </div>
      )}

      {/* Rows Container */}
      <div className="space-y-3">
        {workItems.map((item, index) => (
          <div
            key={item.id}
            className="p-4 md:p-2 rounded-xl md:rounded-none border md:border-0 border-slate-200 bg-white md:bg-transparent grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Mobile Column Label Helpers */}
            
            {/* Task Field */}
            <div className="col-span-1 sm:col-span-1 md:col-span-5 space-y-1 md:space-y-0">
              <label htmlFor={`task-${item.id}`} className="block md:hidden text-[10px] font-bold text-slate-500 uppercase">
                Work / Task *
              </label>
              <input
                id={`task-${item.id}`}
                type="text"
                required
                placeholder="e.g. Prepare System Architecture"
                value={item.task}
                onChange={(e) => handleFieldChange(item.id, 'task', e.target.value)}
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/20 transition-all bg-white"
              />
              {errors[`task-${index}`] && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`task-${index}`]}
                </p>
              )}
            </div>

            {/* Role Selector */}
            <div className="col-span-1 md:col-span-3 space-y-1 md:space-y-0">
              <label htmlFor={`role-${item.id}`} className="block md:hidden text-[10px] font-bold text-slate-500 uppercase">
                Required Role *
              </label>
              <select
                id={`role-${item.id}`}
                required
                value={item.requiredRole}
                onChange={(e) => handleFieldChange(item.id, 'requiredRole', e.target.value)}
                className="w-full h-9 px-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/20 transition-all bg-white"
              >
                <option value="">-- Select Role --</option>
                {REQUIRED_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors[`role-${index}`] && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`role-${index}`]}
                </p>
              )}
            </div>

            {/* Percentage Weight */}
            <div className="col-span-1 md:col-span-2 space-y-1 md:space-y-0">
              <label htmlFor={`weight-${item.id}`} className="block md:hidden text-[10px] font-bold text-slate-500 uppercase">
                Weight (%) *
              </label>
              <input
                id={`weight-${item.id}`}
                type="number"
                min={1}
                max={100}
                required
                placeholder="e.g. 20"
                value={item.percentage || ''}
                onChange={(e) => handleFieldChange(item.id, 'percentage', parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/20 transition-all bg-white"
              />
              {errors[`weight-${index}`] && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`weight-${index}`]}
                </p>
              )}
            </div>

            {/* Status Select */}
            <div className="col-span-1 md:col-span-1.5 space-y-1 md:space-y-0">
              <label htmlFor={`status-${item.id}`} className="block md:hidden text-[10px] font-bold text-slate-500 uppercase">
                Status
              </label>
              <select
                id={`status-${item.id}`}
                value={item.status}
                onChange={(e) => handleFieldChange(item.id, 'status', e.target.value as 'Not Started' | 'In Progress' | 'Completed')}
                className="w-full h-9 px-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/20 transition-all bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Trash button */}
            <div className="flex justify-end pt-2 md:pt-0 md:col-span-0.5">
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none cursor-pointer"
                aria-label={`Remove work item number ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {workItems.length === 0 && (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
            <p className="text-xs text-slate-500">No work items have been added to this breakdown yet.</p>
            <p className="text-[10px] text-slate-400">At least one work item is required to total 100%.</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleAddItem}
          variant="outline"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          aria-label="Add new work item breakdown task"
        >
          Add Work Item
        </Button>
      </div>
    </div>
  );
}
