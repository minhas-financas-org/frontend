import { createContext, useEffect, useMemo, useState } from 'react';

import { useAlert } from '@minhas-financas/ui/components/Alert';

import type { CategoryData, CategoryType } from '@minhas-financas/services/categories';

import { useUser } from '@minhas-financas/context/user';

import { useGlobal } from '@/global';
import { categoriesServices } from '@/services/core';

interface CategoryContextConfig {
    loading: boolean;
    categories: CategoryData[];
    toggleType: (type: CategoryType) => void;
    deleteCategory: (id: string) => Promise<void>;
    addCategory: (category: CategoryData) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextConfig>({
    loading: false,
    categories: [],
    toggleType: () => '',
    addCategory: () => Promise.resolve(),
    deleteCategory: () => Promise.resolve(),
});

interface CategoryProviderProps { children: React.JSX.Element; }
export default function CategoryProvider({ children }: CategoryProviderProps) {
    const { addAlert } = useAlert();
    const { currentUser } = useUser();
    const { categoryData, updateCategory } = useGlobal();

    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<CategoryType>('input');

    const context = useMemo<CategoryContextConfig>(() => ({
        loading,
        categories: categoryData.categories.filter(i => i.type === type),
        deleteCategory: (id: string) => deleteCategory(id),
        toggleType: (type: CategoryType) => toggleType(type),
        addCategory: (category: CategoryData) => addCategory(category),
    }), [loading, categoryData, currentUser, type]);

    useEffect(() => {
        if (!currentUser) { return; }

        setTimeout(() => { setLoading(false); }, 500);
    }, [currentUser]);

    const toggleType = (type: CategoryType) => {
        setLoading(true);

        setType(type);

        setTimeout(() => { setLoading(false); }, 500);
    };

    const addCategory = async (category: CategoryData) => {
        setLoading(true);

        const newCategories = [...categoryData.categories, category]
            .sort((a, b) => a.name.localeCompare(b.name));

        return categoriesServices
            .setCategory({ ownerId: currentUser.user_id, categories: newCategories })
            .then(() => { updateCategory(prev => ({ ...prev, categories: newCategories })); })
            .then(() => { addAlert({ message: 'Categoria adicionada com sucesso!', color: 'success' }); })
            .finally(() => { setLoading(false); });
    };

    const deleteCategory = async (id: string) => {
        const newCategories = categoryData.categories
            .filter(data => data.id !== id);

        return categoriesServices
            .setCategory({ ownerId: currentUser.user_id, categories: newCategories })
            .then(() => { updateCategory(prev => ({ ...prev, categories: newCategories })); })
            .then(() => { addAlert({ message: 'Categoria removida com sucesso!', color: 'success' }); })
            .finally(() => { setLoading(false); });
    };

    return (
        <CategoryContext.Provider value={context}>
            {children}
        </CategoryContext.Provider>
    );
}