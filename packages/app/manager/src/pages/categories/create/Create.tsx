import { useNavigate } from 'react-router-dom';

import Page from '@greencapital/ui/layout/Page';
import Box from '@greencapital/ui/components/Box';
import Icon from '@greencapital/ui/components/Icon';
import Input from '@greencapital/ui/components/Input';
import Stack from '@greencapital/ui/components/Stack';
import Button from '@greencapital/ui/components/Button';
import { Select, Option } from '@greencapital/ui/components/Select';
import Form, { useForm, FormControl, Control } from '@greencapital/ui/components/Form';

import { slug } from '@greencapital/toolkit/string';

import type { CategoryData } from '@greencapital/services/categories';

import { release } from '@/services/core';

import useCategory from '../useCategories';

export default function Create() {
    const navigate = useNavigate();
    const { addCategory } = useCategory();

    const goBack = () => { navigate('/categories'); };

    const [formGroup] = useForm<Omit<CategoryData, 'id'>>({
        form: {
            name: new FormControl({ type: 'text', defaultValue: '', required: true }),
            type: new FormControl({ type: 'text', defaultValue: 'input', required: true }),
        },
        handle: {
            submit: (form) => {
                const { name, type } = form.values;

                addCategory({ name, id: slug(name), type })
                    .then(() => { goBack(); });
            }
        }
    }, []);

    return (
        <Page
            title="Criar categoria"
            subtitle="Aqui você pode criar uma nova categoria."
            release={release}
            backAction={
                <Button
                    noHover
                    size="small"
                    variant="text"
                    sx={{ p: 0 }}
                    startIcon={<Icon name="arrow-left" color="text.secondary" />}
                    onClick={goBack}
                >
                    Voltar
                </Button>
            }
        >
            <Box style={{ maxWidth: 400 }}>
                <Form formGroup={formGroup}>
                    <Stack>
                        <Control
                            controlName="name"
                            field={(control) => <Input
                                fullWidth
                                label="Nome"
                                placeholder="ex: Alimentação"
                                error={control.isInvalid}
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
                                    <Option value="input">Entrada</Option>
                                    <Option value="output">Saída</Option>
                                </Select>
                            )}
                        />
                        <Stack justifyContent="flex-end">
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Criar
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
            </Box>
        </Page>
    );
}