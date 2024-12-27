import db from '@/db';

import type { TagsData } from './interface';

export default class TagsServices {
    private static PATH = 'tags';

    constructor(private db: db) { }

    async getList(ownerId: string) {
        return this.db.getItem<TagsData>({
            path: TagsServices.PATH,
            pathSegments: [],
            filters: [
                { field: 'ownerId', operator: '==', value: ownerId },
            ],
        });
    }

    async setTag(tags: TagsData) {
        return this.db.setItem<TagsData>({
            data: tags,
            path: TagsServices.PATH,
            pathSegments: [tags.ownerId],
        }).then(() => tags);
    }
}