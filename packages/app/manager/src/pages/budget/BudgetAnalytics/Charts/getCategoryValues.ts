import type { ChartData } from '@greencapital/ui/charts';

import type { BudgetData, Type } from '@greencapital/services/budgets';

type DataChart = { value: number; label: string; };

export default function categoryValues(releases: BudgetData[] = [], type: Type): ChartData[] {
    const valuesByCategory = releases
        .filter(r => r.type === type)
        .reduce<DataChart[]>((acc, release) => {
            const category = release.category;

            const index = acc.findIndex(a => a.label === category.name);
            const exist = index >= 0;

            if (!exist) {
                acc.push({ label: category.name, value: release.value });
            } else {
                acc[index].value += release.value;
            }

            return acc;
        }, []);

    return valuesByCategory;
}