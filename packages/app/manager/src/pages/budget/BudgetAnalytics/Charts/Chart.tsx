import { CSSProperties } from 'react';

import Stack from '@minhas-financas/ui/components/Stack';
import Loading from '@minhas-financas/ui/components/Loading';
import Typography from '@minhas-financas/ui/components/Typography';
import { Card, CardContent } from '@minhas-financas/ui/components/Card';

import useBudget from '../../useBudget';

const DEFAULT_HEIGHT = 200;

interface ChartProps {
    label: string;
    style?: CSSProperties;
    children: React.JSX.Element;
}
export default function Chart({ label, children, style }: ChartProps) {
    const { loading } = useBudget();

    return (
        <Card
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ flexDirection: 'row', height: '100%' }}
        >
            <CardContent style={{ minHeight: DEFAULT_HEIGHT, height: '100%' }}>
                <Typography color="text.secondary" textAlign="center">
                    {label}
                </Typography>
                <div style={style}>
                    {!loading.table && children}
                </div>
                {
                    loading.table && (
                        <Stack
                            sx={{ my: 2 }}
                            alignItems="center"
                            justifyContent="center"
                            style={{ height: DEFAULT_HEIGHT }}
                        >
                            <Loading size={40} />
                        </Stack>
                    )
                }
            </CardContent>
        </Card>
    );
}