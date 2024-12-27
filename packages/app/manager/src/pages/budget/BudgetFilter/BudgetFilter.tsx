import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Chip from '@greencapital/ui/components/Chip';
import Stack from '@greencapital/ui/components/Stack';
import Input from '@greencapital/ui/components/Input';
import Button from '@greencapital/ui/components/Button';
import Typography from '@greencapital/ui/components/Typography';
import { Checkbox } from '@greencapital/ui/components/Checkbox';
import MultiSelect from '@greencapital/ui/components/MultiSelect';
import { Select, Option } from '@greencapital/ui/components/Select';
import { Drawer, DrawerContent } from '@greencapital/ui/components/Drawer';
import Form, { Control, FormControl, useForm } from '@greencapital/ui/components/Form';

import type { CategoryData } from '@greencapital/services/categories';
import type { BudgetData, Type } from '@greencapital/services/budgets';

import { useGlobal } from '@/global';

import useBudget from '../useBudget';

interface FilterForm extends Pick<BudgetData, 'tags'> {
    type: Type | 'all';
    search: string;
    categories: CategoryData[];
};

interface BudgetFilterProps { open: boolean; onToggle: () => void; }
export default function BudgetFilter({ open, onToggle }: BudgetFilterProps) {
    const location = useLocation();
    const { date } = useParams<{ date: string; }>();

    const { categoryData, tagData } = useGlobal();

    const { filter, reset, currentDate } = useBudget();

    const [formGroup] = useForm<FilterForm>({
        form: {
            search: new FormControl({ defaultValue: '' }),
            type: new FormControl({ defaultValue: 'all', }),
            tags: new FormControl({ defaultValue: tagData.tags }),
            categories: new FormControl({ defaultValue: categoryData.categories }),
        },
        handle: {
            submit: (form) => {
                const { tags, type, categories } = form.values;

                const tagsFilter = (data: BudgetData) => {
                    return tags.some(t => data.tags.some(current => t.id === current.id));
                };

                const categoriesFilter = (data: BudgetData) => {
                    return categories.some(c => c.id === data.category.id);
                };

                const typeFilter = (data: BudgetData) => {
                    if (type === 'all') { return true; }

                    return data.type === type;
                };

                filter((data) => data
                    .filter(tagsFilter)
                    .filter(typeFilter)
                    .filter(categoriesFilter)
                );

                onToggle();
            }
        }
    }, []);

    useEffect(() => {
        if (currentDate !== date) {
            reset();
            formGroup.reset();
        }
    }, [location]);

    const handleReset = () => {
        onToggle();
        reset();
        formGroup.reset();
    };

    return (
        <Drawer orientation="bottom" open={open} onClose={onToggle}>
            <DrawerContent>
                <Form formGroup={formGroup} debug>
                    <Stack>
                        <Typography noMargin>Filtro</Typography>
                        <Control
                            controlName="search"
                            field={(control) => <Input
                                fullWidth
                                label="Nome"
                                value={control.value}
                                error={control.isInvalid}
                                required={control.required}
                                helperText={control.messageError}
                            />}
                        />
                        <Control
                            controlName="type"
                            action="onChange"
                            field={(control) => (
                                <Select
                                    fullWidth
                                    label="Categoria"
                                    value={control.value}
                                    error={control.isInvalid}
                                    helperText={control.messageError}
                                >
                                    <Option value="all">Todos</Option>
                                    <Option value="entry">Entrada</Option>
                                    <Option value="exit">Saída</Option>
                                </Select>
                            )}
                        />
                        <Control
                            type="object"
                            action="onChange"
                            controlName="categories"
                            field={(control) => (
                                <MultiSelect
                                    fullWidth
                                    label="Categorias"
                                    identifier="id"
                                    data={categoryData.categories}
                                    selecteds={control.value}
                                    error={control.isInvalid}
                                    helperText={control.error}
                                    required={control.required}
                                    renderOption={(data) => (
                                        <Checkbox name={data.id} label={data.name} value={data.id} />
                                    )}
                                    renderValue={(data) => (
                                        <Chip label={data.name} variant="contained" />
                                    )}
                                />
                            )}
                        />
                        <Control
                            type="object"
                            action="onChange"
                            controlName="tags"
                            field={(control) => (
                                <MultiSelect
                                    fullWidth
                                    label="Tags"
                                    identifier="id"
                                    data={tagData.tags}
                                    selecteds={control.value}
                                    error={control.isInvalid}
                                    helperText={control.error}
                                    required={control.required}
                                    renderOption={(data) => (
                                        <Checkbox name={data.id} label={data.name} value={data.id} />
                                    )}
                                    renderValue={(data) => (
                                        <Chip
                                            label={data.name}
                                            variant="contained"
                                            icon={
                                                <div style={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: data.color
                                                }} />
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                        <Button fullWidth variant="contained">
                            Aplicar
                        </Button>
                        <Button fullWidth variant="text" type="button" onClick={handleReset}>
                            Limpar filtros
                        </Button>
                    </Stack>
                </Form>
            </DrawerContent>
        </Drawer>
    );
}