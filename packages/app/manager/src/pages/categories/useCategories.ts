import { useContext } from 'react';

import { CategoryContext } from './CategoriesProvider';

export default function useCategory() {
    return useContext(CategoryContext);
}