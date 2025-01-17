import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from '@minhas-financas/ui/layout/Page';
import { debounce } from '@minhas-financas/ui/utils';
import Icon from '@minhas-financas/ui/components/Icon';
import Slide from '@minhas-financas/ui/animations/Slide';
import Input from '@minhas-financas/ui/components/Input';
import Stack from '@minhas-financas/ui/components/Stack';
import Button from '@minhas-financas/ui/components/Button';
import useFilter from '@minhas-financas/ui/hooks/useFilter';
import Skeleton from '@minhas-financas/ui/components/Skeleton';
import { useModal } from '@minhas-financas/ui/components/Modal';
import { Tab, Tabs } from '@minhas-financas/ui/components/Tabs';
import ButtonIcon from '@minhas-financas/ui/components/ButtonIcon';
import Typography from '@minhas-financas/ui/components/Typography';
import { Grid, GridItem } from '@minhas-financas/ui/components/Grid';
import Form, { Control, FormControl, useForm } from '@minhas-financas/ui/components/Form';

import { getFilledArray } from '@minhas-financas/toolkit/array';
import { slug } from '@minhas-financas/toolkit/string';

import type { CategoryData } from '@minhas-financas/services/categories';

import { release } from '@/services/core';

import useCategory from './useCategories';
import CardCategory from './CardCategory';
import DeleteCategoryModal from './DeleteCategoryModal';

type SearchForm = { name: string; }

function EmptyContent() {
    return (
        <Stack alignItems="center">
            <Icon name="box" color="text.secondary" style={{ fontSize: 72 }} />
            <Typography noMargin variant="h6" color="text.secondary" style={{ textAlign: 'center' }}>
                Nenhuma categoria encontrada.
            </Typography>
        </Stack>
    );
}

interface ContentProps { categories: CategoryData[]; onRemove: (category: CategoryData) => void; }
function Content({ categories, onRemove }: ContentProps) {
    return (
        categories.length === 0 ? (
            <EmptyContent />
        ) : (
            <Grid lg={4} md={6} sm={12}>
                {
                    categories
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((category, i) => (
                            <GridItem key={category.id}>
                                <Slide enter delay={(i + 1) * 100} direction="top">
                                    <CardCategory onRemove={onRemove} {...category} />
                                </Slide>
                            </GridItem>
                        ))
                }
            </Grid>
        )
    );
}

function SkeletonCards() {
    const arr = getFilledArray(9);

    return (
        <Grid lg={4} md={6} sm={12}>
            {
                arr.map((_, i) => (
                    <GridItem key={i}>
                        <Skeleton width="100%" height={70} />
                    </GridItem>
                ))
            }
        </Grid>
    );
}

export default function Category() {
    const navigate = useNavigate();
    const [isOpen, toggleModal] = useModal();
    const { loading, categories, toggleType } = useCategory();
    const { filter, filtered, reset } = useFilter(categories);

    const [loadingSkeleton, setLoadingSkeleton] = useState(true);

    const [currentCategory, setCurrentCategory] = useState<CategoryData>({ id: '', name: '', type: 'input' });

    const [formGroup] = useForm<SearchForm>({
        form: {
            name: new FormControl({ defaultValue: '' }),
        },
        handle: {
            change: (form) => {
                const { name } = form.values;

                if (name.length < 3) { return; }

                debounce.delay(() => {
                    setLoadingSkeleton(true);

                    if (name.length < 4) {
                        reset();
                    } else {
                        filter((categories) => {
                            return categories.filter((category) => slug(category.name)
                                .includes(slug(name))
                            );
                        });
                    }

                    setTimeout(() => { setLoadingSkeleton(false); }, 500);
                }, 500);
            }
        }
    }, []);

    useEffect(() => { setTimeout(() => { setLoadingSkeleton(false); }, 500); }, []);

    const goToCreateCategory = () => { navigate('/categories/create'); };

    const handleOpenModal = (category: CategoryData) => {
        setCurrentCategory(category);
        toggleModal();
    };

    const handleTab = (index: number) => {
        toggleType(index ? 'output' : 'input');
        formGroup.reset();
    };

    return (
        <Page
            title="Categorias"
            subtitle="Aqui você pode visualizar e gerenciar suas categorias."
            release={release}
            action={
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<Icon name="plus" />}
                    onClick={goToCreateCategory}
                >
                    Adicionar categoria
                </Button>
            }
        >
            <Stack className="page-categories">
                <Tabs onChange={(i) => handleTab(i)}>
                    <Tab label="Entrada" />
                    <Tab label="Saída" />
                </Tabs>
                <Grid lg={4} md={6} sm={12}>
                    <GridItem>
                        <Form formGroup={formGroup}>
                            <Control
                                controlName="name"
                                field={(control) =>
                                    <Input
                                        fullWidth
                                        type="text"
                                        placeholder='Buscar categoria'
                                        startIcon={<Icon name="search" />}
                                        endIcon={
                                            control.value && (
                                                <ButtonIcon onClick={() => formGroup.setValues({ name: '' })}>
                                                    <Icon name="times" />
                                                </ButtonIcon>
                                            )
                                        }
                                        value={control.value}
                                        error={control.isInvalid}
                                        helperText={control.messageError}
                                    />
                                }
                            />
                        </Form>
                    </GridItem>
                </Grid>
                {(loadingSkeleton || loading) && <SkeletonCards />}
                {!(loadingSkeleton || loading) && <Content categories={filtered} onRemove={handleOpenModal} />}
            </Stack>
            <DeleteCategoryModal
                isOpen={isOpen}
                onToggleModal={toggleModal}
                {...currentCategory}
            />
        </Page>
    );
}