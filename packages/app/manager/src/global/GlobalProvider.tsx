import { createContext, useEffect, useMemo, useState } from 'react';

import type { TagsData } from '@minhas-financas/services/tags';
import type { CategoriesData } from '@minhas-financas/services/categories';

import { useUser } from '@minhas-financas/context/user';

import { categoriesServices, tagsServices } from '@/services/core';

type DataConfig = {
    tagData: TagsData;
    categoryData: CategoriesData;
};

interface GlobalContextConfig extends DataConfig {
    loading: boolean;
    updateTag: (fn: (data: TagsData) => TagsData) => void;
    updateCategory: (fn: (data: CategoriesData) => CategoriesData) => void;
}

export const GlobalContext = createContext<GlobalContextConfig>({
    loading: false,
    tagData: { ownerId: '', tags: [] },
    categoryData: { ownerId: '', categories: [] },
    updateTag: () => { },
    updateCategory: () => { },
});

interface GlobalProviderProps { children: React.JSX.Element; }
export default function GlobalProvider({ children }: GlobalProviderProps) {
    const { currentUser } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DataConfig>({
        tagData: { ownerId: '', tags: [] },
        categoryData: { ownerId: '', categories: [] },
    });

    const context = useMemo<GlobalContextConfig>(() => ({
        loading,
        updateTag: (data) => { updateTag(data); },
        updateCategory: (data) => { updateCategory(data); },
        ...data,
    }), [loading, currentUser, data.tagData, data.categoryData]);

    useEffect(() => {
        if (!currentUser) { return; }

        getData();
    }, [currentUser]);

    const getData = async () => {
        return Promise.all([
            tagsServices.getList(currentUser.user_id),
            categoriesServices.getList(currentUser.user_id),
        ]).then((res) => {
            const tags = res[0] || { ownerId: '', tags: [] };
            const categories = res[1] || { ownerId: '', categories: [] };

            setData({ tagData: tags, categoryData: categories });
        }).finally(() => { setLoading(false); });
    };

    const updateTag = (fn: (data: TagsData) => TagsData) => {
        setData((prev) => ({ ...prev, tagData: fn(prev.tagData) }));
    };

    const updateCategory = (fn: (data: CategoriesData) => CategoriesData) => {
        setData((prev) => ({ ...prev, categoryData: fn(prev.categoryData) }));
    };

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    );
}