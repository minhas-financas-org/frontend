import type { ChartData } from '@greencapital/ui/charts';

import type { BudgetData } from '@greencapital/services/budgets';

export default function getStackedSpends(releases: BudgetData[] = []): ChartData[] {
    const entry = releases
        .filter((release) => release.type === 'entry')
        .reduce((acc, release) => acc + release.value, 0);

    const exit = releases
        .filter((release) => release.type === 'exit')
        .reduce((acc, release) => acc + release.value, 0);

    const available = entry - exit > 0 ? entry - exit : 0;

    const percentAvailable = entry ? Math.floor((available / entry) * 100) : 0;

    if (!entry && !exit) { return []; }

    return [
        { label: 'Valor gasto', value: exit, color: 'error.main' },
        {
            label: 'Valor disponível',
            value: available,
            color: percentAvailable > 60
                ? 'success.main'
                : 'warning.main'
        },
    ];
}