
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDrawer } from '@greencapital/ui/components/Drawer';
import Stack from '@greencapital/ui/components/Stack';
import { Tab, TabContent, Tabs, useTabs } from '@greencapital/ui/components/Tabs';

import { getParams } from '@greencapital/toolkit/url';

import { BudgetData } from '@greencapital/services/budgets';

import useBudget from '../useBudget';
import BudgetTable from '../BudgetTable';
import BudgetValues from '../BudgetValues';
import BudgetAnalytics from '../BudgetAnalytics';
import { BudgetFilter, BudgetFilterButtons } from '../BudgetFilter';
import { BudgetFormDrawer, useBudgetForm, defaultValues, ReleaseForm } from '../BudgetForm';

export default function BudgetDetails() {
    const navigate = useNavigate();
    const { date, tab } = useParams<{ date: string; tab: string; }>();
    const { open, ...form } = getParams<ReleaseForm & { open: string; }>();

    const [data, setData] = useState<BudgetData>();

    const { current, setTab } = useTabs(tab === 'list' ? 0 : 1);

    const [openDrawer, toggleDrawer] = useDrawer();
    const { formDrawer, deleteRelease, loading } = useBudget();
    const { formGroup, loadingForm } = useBudgetForm(data, () => handleClose());

    useEffect(() => {
        if (!loading.table && open === 'true') {
            console.log(open, form);
            formGroup.setValues({ ...form, tags: [] });
            formDrawer.toggle();
        }
    }, [loading.table]);

    const handleClose = () => {
        formGroup.reset();
        formDrawer.toggle();

        navigate(`/budgets/${date}/${tab}`);

        setData(defaultValues);
    };

    const handleOpenDetails = (data: BudgetData) => {
        formDrawer.toggle();

        setData(data);
    };

    const handleDelete = async () => {
        return deleteRelease(data?.id as string)
            .finally(() => formDrawer.toggle());
    };

    const handleTab = (index: number) => {
        setTab(index);

        navigate(index ? `/budgets/${date}/analytics` : `/budgets/${date}/list`);
    };

    return (
        <>
            <BudgetFilterButtons onToggle={toggleDrawer} />

            <Tabs onChange={handleTab} current={current} color="secondary">
                <Tab label="Tabela" color="secondary" />
                <Tab label="Análise" color="secondary" />
            </Tabs>

            <TabContent current={current} value={0}>
                <Stack>
                    <BudgetValues />

                    <BudgetTable onOpenDetails={handleOpenDetails} />
                </Stack>
            </TabContent>

            <TabContent current={current} value={1}>
                <BudgetAnalytics />
            </TabContent>

            <BudgetFormDrawer
                isOpen={formDrawer.open}
                shouldShowDelete={Boolean(data?.id)}
                loading={loadingForm}
                formGroup={formGroup}
                onClose={handleClose}
                onDelete={handleDelete}
            />

            <BudgetFilter onToggle={toggleDrawer} open={openDrawer} />
        </>
    );
}