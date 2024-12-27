import { useContext } from 'react';

import { BudgetContext } from './BudgetProvider';

export default function useBudget() {
    return useContext(BudgetContext);
}