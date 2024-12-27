import { createContext, useEffect, useMemo, useState } from 'react';

import { useAlert } from '@greencapital/ui/components/Alert';

import type { TagData } from '@greencapital/services/tags';

import { useUser } from '@greencapital/context/user';

import { tagsServices } from '@/services/core';
import { useGlobal } from '@/global';

interface TagContextConfig {
    loading: boolean;
    tags: TagData[];
    addTag: (category: TagData) => Promise<void>;

    deleteTag: (id: string) => Promise<void>;
}

export const TagContext = createContext<TagContextConfig>({
    loading: false,
    tags: [],
    addTag: () => Promise.resolve(),
    deleteTag: () => Promise.resolve(),
});

interface TagProviderProps { children: React.JSX.Element; }
export default function TagProvider({ children }: TagProviderProps) {
    const { addAlert } = useAlert();
    const { currentUser } = useUser();
    const { tagData, updateTag } = useGlobal();
    const [loading, setLoading] = useState(true);

    const context = useMemo<TagContextConfig>(() => ({
        loading,
        tags: tagData.tags,
        deleteTag: (id) => deleteTag(id),
        addTag: (category: TagData) => addTag(category),
    }), [loading, tagData, currentUser]);

    useEffect(() => {
        if (!currentUser) { return; }

        setTimeout(() => { setLoading(false); }, 500);
    }, [currentUser]);

    const addTag = async (t: TagData) => {
        setLoading(true);

        const newTags = [...tagData.tags, t];

        return tagsServices
            .setTag({ ownerId: currentUser.user_id, tags: newTags })
            .then(() => { updateTag((prev) => ({ ...prev, tags: newTags })); })
            .then(() => { addAlert({ message: 'Tag adicionada com sucesso!', color: 'success' }); })
            .finally(() => { setLoading(false); });
    };

    const deleteTag = async (id: string) => {
        const newTags = tagData.tags.filter(tag => tag.id !== id);

        return tagsServices
            .setTag({ ownerId: currentUser.user_id, tags: newTags })
            .then(() => { updateTag((prev) => ({ ...prev, tags: prev.tags.filter(tag => tag.id !== id) })); })
            .then(() => { addAlert({ message: 'Tag deletada com sucesso!', color: 'success' }); });
    };

    return (
        <TagContext.Provider value={context}>
            {children}
        </TagContext.Provider>
    );
}