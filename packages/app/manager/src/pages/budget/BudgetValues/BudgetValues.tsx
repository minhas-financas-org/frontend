import { CSSProperties, useMemo, useState } from 'react';

import Icon from '@greencapital/ui/components/Icon';
import Stack from '@greencapital/ui/components/Stack';
import useResize from '@greencapital/ui/hooks/useResize';
import type { MappedColors } from '@greencapital/ui/theme';
import Skeleton from '@greencapital/ui/components/Skeleton';
import Typography from '@greencapital/ui/components/Typography';
import { Grid, GridItem } from '@greencapital/ui/components/Grid';

import { maskCurrency } from '@greencapital/toolkit/mask';

import useBudget from '../useBudget';

function SkeletonValues() {
    return (
        <Grid lg={4} md={4} sm={12}>
            <GridItem>
                <Skeleton variant="rounded" width="100%" height={56} />
            </GridItem>
            <GridItem>
                <Skeleton variant="rounded" width="100%" height={56} />
            </GridItem>
            <GridItem>
                <Skeleton variant="rounded" width="100%" height={56} />
            </GridItem>
        </Grid>
    );
}

interface ItemProps {
    icon: string;
    value: string;
    label: string;
    color: MappedColors
    justify: CSSProperties['justifyContent'];
}
function Item({ value, label, icon, justify, color }: ItemProps) {
    return (
        <Stack orientation="row" alignItems="center" justifyContent={justify}>
            <Icon name={icon} color="text.secondary" />
            <div>
                <Typography noMargin variant="h5" color={color}>
                    {value}
                </Typography>
                <Typography
                    noMargin
                    variant="body2"
                    color="text.secondary"
                    style={{ fontSize: '.875rem' }}
                >
                    {label}
                </Typography>
            </div>
        </Stack>
    );
}

export default function BudgetValues() {
    const [isMobile, setIsMobile] = useState(false);

    const { releases, loading } = useBudget();

    const { entries, exits } = useMemo(() => ({
        entries: releases
            .filter((release) => release.type === 'entry'),
        exits: releases
            .filter((release) => release.type === 'exit'),
    }), [releases]);

    const entryValue = entries
        .reduce((acc, release) => acc + release.value, 0);

    const exitValue = exits
        .reduce((acc, release) => acc + release.value, 0);

    const balance = entryValue - exitValue;

    useResize({
        onXs: () => setIsMobile(true),
        onSm: () => setIsMobile(true),
        onMd: () => setIsMobile(false),
        onLg: () => setIsMobile(false),
        onXl: () => setIsMobile(false),
    }, []);

    return (
        <>
            {loading.table && <SkeletonValues />}
            {
                !loading.table && (
                    <Grid lg={4} md={4} sm={12}>
                        <GridItem>
                            <Item
                                justify="flex-start"
                                color="success.main"
                                icon="money-withdraw"
                                label={`${entries.length} ${entries.length > 1 ? 'entradas' : 'entrada'}`}
                                value={maskCurrency(entryValue * 100)}
                            />
                        </GridItem>
                        <GridItem>
                            <Item
                                justify={isMobile ? 'flex-start' : 'center'}
                                color="error.main"
                                icon="money-insert"
                                label={`${exits.length} ${exits.length > 1 ? 'saídas' : 'saída'}`}
                                value={maskCurrency(exitValue * 100)}
                            />
                        </GridItem>
                        <GridItem>
                            <Item
                                justify={isMobile ? 'flex-start' : 'flex-end'}
                                color="info.main"
                                icon="money-bill"
                                label="Saldo disponível"
                                value={maskCurrency(balance * 100)}
                            />
                        </GridItem>
                    </Grid>
                )
            }
        </>
    );
}