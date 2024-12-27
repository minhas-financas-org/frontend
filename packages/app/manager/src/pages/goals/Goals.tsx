import Page from '@greencapital/ui/layout/Page';
import Box from '@greencapital/ui/components/Box';

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