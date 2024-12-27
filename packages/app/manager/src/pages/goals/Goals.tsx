import Page from '@minhas-financas/ui/layout/Page';
import Box from '@minhas-financas/ui/components/Box';

import { release } from '@/services/core';

export default function Goals() {
    return (
        <Page
            title="Metas"
            subtitle="Aqui você pode visualizar e gerenciar suas metas."
            release={release}
        >
            <Box>
                aaa
            </Box>
        </Page>
    );
}