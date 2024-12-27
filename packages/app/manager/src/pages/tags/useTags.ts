import { useContext } from 'react';

import { TagContext } from './TagsProvider';

export default function useTag() {
    return useContext(TagContext);
}