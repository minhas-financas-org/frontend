import { slug } from '@minhas-financas/toolkit/string';

import type { CategoryData } from './interface';

const outputCategories = [
    'Pet',
    'Saúde',
    'Outros',
    'Moradia',
    'Educação',
    'Vestuário',
    'Automóvel',
    'Transporte',
    'Gasto Fixo',
    'Alimentação',
];

const inputCategories = [
    'Renda extra',
    'Décimo terceiro',
    'Salários'
];

export default [
    ...inputCategories.map<CategoryData>((name) => ({
        name,
        type: 'input',
        id: slug(name),
    })),
    ...outputCategories.map<CategoryData>((name) => ({
        name,
        type: 'output',
        id: slug(name),
    })),
] satisfies CategoryData[];