import Page from '@greencapital/ui/layout/Page';
import Box from '@greencapital/ui/components/Box';

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