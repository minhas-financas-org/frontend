import { useLocation, useParams } from 'react-router-dom';
import { createContext, useEffect, useMemo, useState } from 'react';

import { addMonths, format } from 'date-fns';

import useFilter from '@minhas-financas/ui/hooks/useFilter';
import { useDrawer } from '@minhas-financas/ui/components/Drawer';

import { uuid } from '@minhas-financas/toolkit/uuid';
import { getFilledArray } from '@minhas-financas/toolkit/array';

import { CategoryData } from '@minhas-financas/services/categories';
import type { BudgetData } from '@minhas-financas/services/budgets';

import { useUser } from '@minhas-financas/context/user';

import { useGlobal } from '@/global';
import { budgetsServices } from '@/services/core';

import { Type } from './BudgetFilter';
import type { ReleaseForm } from './BudgetForm';

type BudgetLoading = { page: boolean; table: boolean; };

interface BudgetContextConfig {
    sortType: Type;
    releases: BudgetData[];
    loading: BudgetLoading;
    currentDate: string;
    months: { label: string; value: string }[];
    formDrawer: { toggle: () => void; open: boolean; }

    reset: () => void;
    setSortType: (type: Type) => void;
    deleteRelease: (id: string) => Promise<void>;
    createRelease: (data: ReleaseForm) => Promise<void>;
    filter: (fn: (data: BudgetData[]) => BudgetData[]) => void;
    updateRelease: (formValues: ReleaseForm, data: BudgetData) => Promise<void>;
}

export const BudgetContext = createContext<BudgetContextConfig>({
    months: [],
    releases: [],
    sortType: 'latest',
    currentDate: '',
    loading: { page: true, table: true },
    formDrawer: { open: false, toggle: () => null },

    reset: () => null,
    filter: () => null,
    setSortType: () => null,
    deleteRelease: async () => new Promise((resolve) => resolve()),
    createRelease: async () => new Promise((resolve) => resolve()),
    updateRelease: async () => new Promise((resolve) => resolve()),
});

const getMonths = () => {
    const today = new Date();
    const months = [addMonths(today, -2), addMonths(today, -1), today, addMonths(today, 1), addMonths(today, 2)];

    return months
        .map((date) => {
            return {
                label: format(date, 'MM/yy'),
                value: format(date, 'yyyy-MM'),
            };
        });
};

function getInstallmentsDates(total: number, date: string): string[] {
    return getFilledArray(total)
        .map((_, index) => {
            const newDate = new Date(`${date}-02`);

            const formatted = format(addMonths(newDate, index), 'yyyy-MM');

            return formatted;
        });
}

interface BudgetProviderProps { children: React.ReactNode; }
export default function BudgetProvider({ children }: BudgetProviderProps) {
    const [currentDate, setCurrentDate] = useState<string>('');
    const [releases, setReleases] = useState<BudgetData[]>([]);
    const [sortType, setSortType] = useState<Type>('latest');
    const [loading, setLoading] = useState<BudgetLoading>({ page: true, table: true });

    const location = useLocation();
    const { currentUser } = useUser();
    const { categoryData } = useGlobal();
    const [openDrawer, toggleDrawer] = useDrawer();
    const { date } = useParams<{ date: string; }>();
    const { filter, filtered, reset } = useFilter(releases);

    const context = useMemo<BudgetContextConfig>(() => ({
        reset,
        filter,
        loading,
        sortType,
        currentDate,
        releases: filtered,
        formDrawer: { open: openDrawer, toggle: toggleDrawer },
        months: getMonths(),
        setSortType: (sort) => { setSortType(sort); },
        createRelease: (data) => handleCreateRelease(data),
        deleteRelease: (id) => handleDeleteRelease(id),
        updateRelease: (formValue, data) => handleUpdateRelease(formValue, data),
    }), [openDrawer, location, releases, filtered, loading]);

    useEffect(() => {
        if (!currentUser) { return; };

        setLoading(prev => ({ ...prev, table: true }));

        if (date === currentDate) {
            setTimeout(() => { setLoading(prev => ({ ...prev, table: false })); }, 500);
            return;
        }

        getReleases(date as string)
            .finally(() => {
                setTimeout(() => {
                    setLoading(prev => ({ ...prev, table: false }));
                }, 500);
            });
    }, [currentUser, location]);

    const handleCreateRelease = async (data: ReleaseForm) => {
        const installmens = Number(data.installments);

        const newBudget: BudgetData = {
            ...data,
            id: uuid(),
            value: data.value / 100,
            ownerId: currentUser.user_id,
            installments: {
                dates: getInstallmentsDates(installmens, data.date),
                total: installmens
            },
            category: categoryData.categories.find((c) => c.id === data.category) as CategoryData
        };

        return budgetsServices
            .setBudget(newBudget)
            .then((data) => {
                if (data.installments.dates.includes(date as string)) {
                    setReleases([...releases, data]);
                }
            });
    };

    const handleUpdateRelease = async (formValues: ReleaseForm, data: BudgetData) => {
        const installmens = Number(formValues.installments);

        const newBudget: BudgetData = {
            ...data,
            ...formValues,
            value: formValues.value / 100,
            installments: {
                dates: getInstallmentsDates(installmens, formValues.date),
                total: installmens
            },
            category: categoryData.categories.find((c) => c.id === formValues.category) as CategoryData
        };

        return budgetsServices
            .setBudget(newBudget)
            .then((data) => {
                setReleases(prev => prev.map((item) => (item.id === data.id ? data : item)));
            });
    };

    const handleDeleteRelease = async (id: string) => {
        return budgetsServices.deleteRelease(id)
            .then(() => setReleases(prev => prev.filter(p => p.id !== id)));
    };

    const getReleases = async (date: string) => {
        setCurrentDate(date);
        return budgetsServices.getReleases({
            date,
            ownerId: currentUser.user_id,
        }).then((data) => { setReleases(data); });
    };

    return (
        <BudgetContext.Provider value={context}>
            {children}
        </BudgetContext.Provider>
    );
}