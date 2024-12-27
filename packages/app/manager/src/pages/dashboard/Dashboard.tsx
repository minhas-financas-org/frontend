import Page from '@minhas-financas/ui/layout/Page';
import Box from '@minhas-financas/ui/components/Box';

import { release } from '@/services/core';

export default function Dashboard() {
    return (
        <Page
            title="Dashboard"
            subtitle="Veja um resumo de suas atividades."
            release={release}
        >
            <Box>
                A
            </Box>
        </Page>
    );
}