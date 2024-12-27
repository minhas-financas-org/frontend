import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { FormControl, useForm } from '@minhas-financas/ui/components/Form';

import type { BudgetData } from '@minhas-financas/services/budgets';

import useBudget from '../useBudget';
import type { ReleaseForm } from './interface';
import { defaultValues } from './defaultBudgetForm';

export default function BudgetForm(data: BudgetData = defaultValues, handleClose: () => void) {
    const { date } = useParams<{ date: string }>();
    const location = useLocation();

    const [loadingForm, setLoadingForm] = useState(false);

    const { createRelease, updateRelease } = useBudget();

    const [formGroup] = useForm<ReleaseForm>({
        form: {
            name: new FormControl({ defaultValue: defaultValues.name, value: data.name, required: true }),
            tags: new FormControl({ defaultValue: defaultValues.tags, value: data.tags, required: false }),
            type: new FormControl({ defaultValue: defaultValues.type, value: data.type, required: true }),
            category: new FormControl({
                required: true,
                value: data.category.id,
                defaultValue: defaultValues.category.id,
            }),
            installments: new FormControl({
                required: true,
                value: data.installments.total,
                defaultValue: defaultValues.installments.total,
            }),
            hasRecurrence: new FormControl({
                required: false,
                defaultValue: false,
                value: data.installments.total > 1,
            }),
            value: new FormControl({
                type: 'money',
                required: true,
                value: data.value * 100,
                defaultValue: defaultValues.value,
            }),
            date: new FormControl({
                required: true,
                value: date,
                defaultValue: defaultValues.date,
            }),
        },
        handle: {
            submit: (form) => {
                setLoadingForm(true);

                if (!data.id) {
                    createRelease(form.values)
                        .then(() => { handleClose(); })
                        .finally(() => { setLoadingForm(false); });
                }

                if (data.id) {
                    updateRelease(form.values, data)
                        .then(() => { handleClose(); })
                        .catch((e) => console.log(e))
                        .finally(() => { setLoadingForm(false); });
                }
            }
        }
    }, [data, location]);

    return {
        formGroup,
        loadingForm
    };
}