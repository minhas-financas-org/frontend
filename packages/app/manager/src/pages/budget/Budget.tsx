import { Outlet, useNavigate, useParams } from 'react-router-dom';

import Page from '@greencapital/ui/layout/Page';
import Icon from '@greencapital/ui/components/Icon';
import Button from '@greencapital/ui/components/Button';
import { Tab, Tabs } from '@greencapital/ui/components/Tabs';
import Stack from '@greencapital/ui/components/Stack';

import { release } from '@/services/core';

import useBudget from './useBudget';

export default function Budget() {
    const navigate = useNavigate();
    const { months, formDrawer } = useBudget();
    const { date } = useParams<{ date: string; }>();

    const index = months.findIndex((month) => month.value === date);

    const handleTabsChange = (index: number) => { navigate(`${months[index].value}/list`); };

    return (
        <Page
            title="Orçamento mensal"
            subtitle="Aqui você pode visualizar e gerenciar seus orçamentos."
            release={release}
            action={
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<Icon name="plus" />}
                    onClick={formDrawer.toggle}
                >
                    Adicionar lançamento
                </Button>
            }
        >
            <Stack className="budget">
                <Tabs
                    variant="rounded"
                    color="secondary"
                    current={index}
                    onChange={handleTabsChange}
                >
                    {
                        months.map((month) => (
                            <Tab key={month.value} label={month.label} />
                        ))
                    }
                </Tabs>
                <Outlet />
            </Stack>
        </Page>
    );
}