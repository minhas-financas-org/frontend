import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '@greencapital/ui/components/Input';
import Stack from '@greencapital/ui/components/Stack';
import Button from '@greencapital/ui/components/Button';
import Loading from '@greencapital/ui/components/Loading';
import Typography from '@greencapital/ui/components/Typography';
import ColorPicker from '@greencapital/ui/components/ColorPicker';
import { Drawer, DrawerContent } from '@greencapital/ui/components/Drawer';
import Form, { useForm, FormControl, Control } from '@greencapital/ui/components/Form';

import { slug } from '@greencapital/toolkit/string';
import { formatUrl, getParams } from '@greencapital/toolkit/url';

import type { TagData } from '@greencapital/services/tags';

import useTags from '../useTags';

interface CreateTagProps {
    isOpen: boolean;
    onToggleModal: () => void;
}
export default function CreateTag({ isOpen, onToggleModal }: CreateTagProps) {
    const navigate = useNavigate();

    const { callback, ...form } = getParams<{ callback: string; } & any>();

    const [loading, setLoading] = useState(false);

    const { addTag } = useTags();

    const goBack = () => {
        if (callback === 'true') {
            navigate(formatUrl(
                `/budgets/${form.date}/list`,
                form
            ));
        }
        onToggleModal();
    };

    const handleClose = () => {
        onToggleModal();

        formGroup.reset();
    };

    const [formGroup] = useForm<Omit<TagData, 'id'>>({
        form: {
            name: new FormControl({ type: 'text', defaultValue: '', required: true }),
            color: new FormControl({ type: 'text', defaultValue: '', required: true }),
        },
        handle: {
            submit: (form) => {
                const { name, color } = form.values;

                addTag({
                    name,
                    color,
                    id: slug(name),
                }).then(() => {
                    goBack();
                }).finally(() => { setLoading(false); });
            }
        }
    }, []);

    return (
        <Drawer open={isOpen} onClose={handleClose}>
            <DrawerContent>
                <Form formGroup={formGroup}>
                    <Stack>
                        <Typography variant="h6" noMargin gutterBottom>
                            Adicionar tag
                        </Typography>
                        <Control
                            controlName="name"
                            field={(control) => <Input
                                fullWidth
                                label="Nome"
                                placeholder="ex: Férias"
                                error={control.isInvalid}
                                helperText={control.messageError}
                            />}
                        />
                        <Control
                            controlName="color"
                            field={(control) => <ColorPicker
                                fullWidth
                                label="Cor"
                                error={control.isInvalid}
                                helperText={control.messageError}
                            />}
                        />
                        <Stack justifyContent="flex-end">
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={loading && <Loading />}
                            >
                                Criar
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
            </DrawerContent>
        </Drawer>
    );
}