import Button from '@greencapital/ui/components/Button';
import Typography from '@greencapital/ui/components/Typography';
import { Modal, ModalFooter } from '@greencapital/ui/components/Modal';

import type { CategoryData } from '@greencapital/services/categories';

import useCategory from './useCategories';

interface DeleteCategoryModalProps extends CategoryData {
    isOpen: boolean;
    onToggleModal: () => void;
}
export default function DeleteCategoryModal({ isOpen, onToggleModal, ...category }: DeleteCategoryModalProps) {
    const { deleteCategory } = useCategory();

    const handleDelete = () => {
        deleteCategory(category.id)
            .then(() => onToggleModal());
    };

    return (
        <Modal
            isOpen={isOpen}
            title={
                <Typography variant="h6" noMargin>Deletar categoria</Typography>
            }
            subtitle={
                <Typography variant="subtitle2" noMargin weight="normal">
                    Tem certeza que deseja deletar a categoria <strong>&quot;{category?.name}&quot;</strong>?
                </Typography>
            }
            onClose={onToggleModal}
        >
            <ModalFooter>
                <Button variant="text" color="primary" onClick={onToggleModal}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Deletar
                </Button>
            </ModalFooter>
        </Modal>
    );
}