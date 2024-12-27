import type { TagData } from '@/tags';
import type { CategoryData } from '@/categories';

export type Type = 'entry' | 'exit';

export interface BudgetData {
    id: string;
    date: string;
    name: string;
    value: number;
    ownerId: string;
    installments: { dates: string[]; total: number; };
    type: Type;
    tags: TagData[];
    category: CategoryData
}

export interface GetReleases {
    date: string;
    ownerId: string;
}