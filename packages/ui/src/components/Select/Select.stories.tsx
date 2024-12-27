import { Meta, StoryObj } from '@storybook/react';

import Form, { Control, FormControl, useForm } from '@/components/Form';

import Select from './Select';
import Option from './Option';

const meta: Meta<typeof Select> = {
    title: 'components/Select',
    component: Select,
};

export const size: StoryObj<typeof Select> = {
    render: () => {
        return (
            <Select placeholder="Selecione um valor" value="1">
                <Option value="1">Option 1</Option>
                <Option value="2">Option 2</Option>
                <Option value="3">Option 3</Option>
            </Select>
        );
    }
};

export const Controlled: StoryObj<typeof Select> = {
    render: () => {
        const [formGroup] = useForm<{ foods: string; }>({
            form: {
                foods: new FormControl({ defaultValue: 'pizza', required: true }),
            }
        }, []);

        return (
            <Form formGroup={formGroup}>
                <Control controlName="foods"
                    field={(control) => (
                        <Select placeholder="Selecione um valor" value={control.value}>
                            <Option value="pizza">Pizza</Option>
                            <Option value="hamburguer">Hamburguer</Option>
                            <Option value="hotdog">Hotdog</Option>
                        </Select>
                    )} />
            </Form>
        );
    }
};

export default meta;