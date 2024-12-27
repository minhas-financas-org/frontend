import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@minhas-financas/ui/components/Box';
import { joinClass } from '@minhas-financas/ui/utils';
import Icon from '@minhas-financas/ui/components/Icon';
import Chip from '@minhas-financas/ui/components/Chip';
import Stack from '@minhas-financas/ui/components/Stack';
import Input from '@minhas-financas/ui/components/Input';
import Button from '@minhas-financas/ui/components/Button';
import Switch from '@minhas-financas/ui/components/Switch';
import Loading from '@minhas-financas/ui/components/Loading';
import Typography from '@minhas-financas/ui/components/Typography';
import { Checkbox } from '@minhas-financas/ui/components/Checkbox';
import MultiSelect from '@minhas-financas/ui/components/MultiSelect';
import { Select, Option } from '@minhas-financas/ui/components/Select';
import { Tab, Tabs, useTabs } from '@minhas-financas/ui/components/Tabs';
import { Drawer, DrawerContent } from '@minhas-financas/ui/components/Drawer';
import Form, { Control, FormGroup } from '@minhas-financas/ui/components/Form';

import { formatUrl } from '@minhas-financas/toolkit/url';

import { useGlobal } from '@/global';

import { ReleaseForm } from './interface';

import './BudgetForm.scss';

interface BudgetFormProps {
    isOpen: boolean;
    loading: boolean;
    shouldShowDelete: boolean;
    formGroup: FormGroup<ReleaseForm>;
    onClose: () => void;
    onDelete: () => Promise<void>;
}
export default function BudgetForm({
    isOpen,
    loading,
    formGroup,
    shouldShowDelete,
    onClose,
    onDelete
}: BudgetFormProps) {
    const navigate = useNavigate();

    const [loadingDelete, setLoadingDelete] = useState(false);

    const { categoryData, tagData } = useGlobal();
    const { current, setTab } = useTabs(formGroup.values.type === 'entry' ? 1 : 0);

    const classComponent = joinClass([
        'installments-container',
        formGroup.controls.hasRecurrence.value && 'installments-container--visible'
    ]);

    const goToCreateTag = () => {
        navigate(formatUrl('/tags', {
            open: true,
            callback: true,
            ...formGroup.values
        }));
    };

    const handleTab = (index: number) => {
        setTab(index);
        formGroup.setValues({ type: index ? 'entry' : 'exit' });
    };

    const handleDelete = () => {
        setLoadingDelete(true);

        onDelete()
            .finally(() => setLoadingDelete(false));
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <Typography variant="h6" noMargin gutterBottom>
                    Adicionar lançamento
                </Typography>
                <Tabs onChange={handleTab} sx={{ mb: 2 }} current={current}>
                    <Tab label="Saída" icon={<Icon name="arrow-up" />} />
                    <Tab label="Entrada" icon={<Icon name="arrow-down" />} />
                </Tabs>
                <Form formGroup={formGroup}>
                    <Stack spacing="medium">
                        <Control
                            controlName="name"
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
                            controlName="value"
                            field={(control) => <Input
                                fullWidth
                                label="Valor"
                                placeholder="R$ 0,00"
                                value={control.masked}
                                error={control.isInvalid}
                                required={control.required}
                                helperText={control.messageError}
                            />}
                        />
                        <Control
                            controlName="date"
                            field={(control) => <Input
                                fullWidth
                                // Mes em que sera feito o lancamento do valor
                                type="month"
                                label="Data"
                                value={control.value}
                                error={control.isInvalid}
                                required={control.required}
                                helperText={control.messageError}
                            />}
                        />
                        <Control
                            controlName="category"
                            action="onChange"
                            field={(control) => (
                                <Select
                                    fullWidth
                                    label="Categoria"
                                    value={control.value}
                                    error={control.isInvalid}
                                    helperText={control.messageError}
                                >
                                    {
                                        categoryData.categories
                                            .filter(i => {
                                                const type = formGroup.values.type === 'entry'
                                                    ? 'input'
                                                    : 'output';

                                                return i.type === type;
                                            })
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((category) => (
                                                <Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Option>
                                            ))
                                    }
                                </Select>
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
                                    emptyMessage={
                                        <Stack alignItems="center" sx={{ py: 2 }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <Typography noMargin color="text.secondary">
                                                    Nenhuma tag cadastrada
                                                </Typography>
                                                <Typography noMargin variant="body2" color="text.secondary">
                                                    Clique em criar para adiconar novas tags
                                                </Typography>
                                            </div>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={goToCreateTag}
                                            >
                                                Criar
                                            </Button>
                                        </Stack>
                                    }
                                />
                            )}
                        />
                        {
                            !current && (
                                <>
                                    <Control
                                        type="checkbox"
                                        action="onChange"
                                        controlName="hasRecurrence"
                                        field={(control) => (<Switch
                                            color="primary"
                                            label="Deseja replicar essa compra nos próximos meses?"
                                            checked={control.value}
                                            error={control.isInvalid}
                                            helperText={control.messageError}
                                        />)}
                                    />
                                    <Box className={classComponent}>
                                        <Control
                                            controlName="installments"
                                            field={(control) => <Input
                                                fullWidth
                                                type="number"
                                                label="Quantidade de parcelas"
                                                value={control.value}
                                                error={control.isInvalid}
                                                required={control.required}
                                                helperText={control.messageError}
                                            />}
                                        />
                                    </Box>
                                </>
                            )
                        }
                        <Button loading={loading && <Loading />}>
                            Salvar
                        </Button>
                        {
                            shouldShowDelete && (
                                <Button
                                    type="button"
                                    color="error"
                                    variant="outlined"
                                    loading={loadingDelete && <Loading />}
                                    onClick={handleDelete}
                                >
                                    Deletar
                                </Button>
                            )
                        }
                    </Stack>
                </Form>
            </DrawerContent>
        </Drawer>
    );
}