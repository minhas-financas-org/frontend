import { format } from 'date-fns';

import { BudgetData } from '@minhas-financas/services/budgets';

const date = format(new Date(), 'yyyy-MM');

export const defaultValues: BudgetData = {
    id: '',
    name: '',
    ownerId: '',
    type: 'exit',
    date,
    value: 0,
    tags: [],
    category: { id: '', name: '', type: 'input' },
    installments: { total: 1, dates: [date], },
};
