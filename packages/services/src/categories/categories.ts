import db from '@/db';

import type { CategoriesData } from './interface';

export default class CategoriesServices {
    private static PATH = 'categories';

    constructor(private db: db) { }

    async getList(ownerId: string) {
        return this.db.getItem<CategoriesData>({
            path: CategoriesServices.PATH,
            pathSegments: [],
            filters: [
                { field: 'ownerId', operator: '==', value: ownerId },
            ],
        });
    }

    async setCategory(categories: CategoriesData) {
        return this.db.setItem<CategoriesData>({
            data: categories,
            path: CategoriesServices.PATH,
            pathSegments: [categories.ownerId],
        }).then(() => categories);
    }
}