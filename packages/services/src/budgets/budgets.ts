import db from '@/db';

import type { BudgetData, GetReleases } from './interface';

export default class BudgetsServices {
    private static PATH = 'budgets';

    constructor(private db: db) { }

    async getReleases({ date, ownerId }: GetReleases) {
        return this.db.getList<BudgetData>({
            path: BudgetsServices.PATH,
            pathSegments: [],
            filters: [
                { field: 'ownerId', operator: '==', value: ownerId },
                { field: 'installments.dates', operator: 'array-contains', value: date },
            ],
        }).then((releases) => {
            return releases;
        });
    }

    async setBudget(budgets: BudgetData) {
        return this.db.setItem<BudgetData>({
            data: budgets,
            path: BudgetsServices.PATH,
            pathSegments: [budgets.id],
        }).then(() => budgets);
    }

    async deleteRelease(id: string) {
        return this.db.deleteItem({
            path: BudgetsServices.PATH,
            pathSegments: [id],
        });
    }
}