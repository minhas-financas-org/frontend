import { addMonths, format } from 'date-fns';

import { uuid } from '@minhas-financas/toolkit/uuid';
import { getFilledArray } from '@minhas-financas/toolkit/array';

import { CategoryData } from '@/categories';

import type { BudgetData } from './interface';

type Budget = {
    category: string;
    installments: number;
} & Omit<BudgetData, 'id' | 'ownerId' | 'category' | 'installments'>

export interface GenerateBudget {
    ownerId: string;
    budget: Budget;
    categories: CategoryData[];
}

export function generateNewBudget({ budget, categories, ownerId }: GenerateBudget): BudgetData {
    console.log('generateNewBudget', budget);

    const installmens = Number(budget.installments);

    return {
        ownerId,
        id: uuid(),
        tags: budget.tags,
        date: budget.date,
        name: budget.name,
        type: budget.type,
        value: budget.value / 100,
        installments: {
            dates: getInstallmentsDates(installmens, budget.date),
            total: installmens
        },
        category: categories.find((c) => c.id === budget.category) as CategoryData
    };
}

export function getInstallmentsDates(total: number, date: string): string[] {
    return getFilledArray(total)
        .map((_, index) => {
            const newDate = new Date(`${date}-02`);

            const formatted = format(addMonths(newDate, index), 'yyyy-MM');

            return formatted;
        });
}