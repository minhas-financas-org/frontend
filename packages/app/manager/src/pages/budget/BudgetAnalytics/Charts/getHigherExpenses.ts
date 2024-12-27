import { maskCurrency } from '@greencapital/toolkit/mask';

import type { BudgetData } from '@greencapital/services/budgets';

export default function getHigherExpenses(releases: BudgetData[] = []) {
    return releases
        .filter(d => d.type === 'exit')
        .sort((a, b) => b.value - a.value)
        .splice(0, 5)
        .map(i => ({
            type: 'bar',
            label: i.name,
            data: [i.value],
            valueFormatter: (a) => {
                const value = a as number;
                return maskCurrency(value * 100);
            }
        }));
};