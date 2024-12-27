export type CategoryType = 'input' | 'output';

export interface CategoryData {
    id: string;
    name: string;
    type: CategoryType;
}

export interface CategoriesData {
    ownerId: string;
    categories: CategoryData[];
}