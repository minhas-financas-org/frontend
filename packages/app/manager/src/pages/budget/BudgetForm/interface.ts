import { BudgetData } from '@minhas-financas/services/budgets';

export interface ReleaseForm extends Pick<BudgetData, 'value' | 'tags' | 'date' | 'name' | 'type'> {
    category: string;
    installments: number;
    hasRecurrence: boolean;
}
