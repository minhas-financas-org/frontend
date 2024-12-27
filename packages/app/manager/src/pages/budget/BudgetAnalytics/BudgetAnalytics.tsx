import { useMemo } from 'react';

import Donut from '@minhas-financas/ui/charts/Donut';
import Icon from '@minhas-financas/ui/components/Icon';
import Chip from '@minhas-financas/ui/components/Chip';
import Stack from '@minhas-financas/ui/components/Stack';
import StackBar from '@minhas-financas/ui/charts/StackBar';
import Tooltip from '@minhas-financas/ui/components/Tooltip';
import { type MappedColors } from '@minhas-financas/ui/theme';
import Typography from '@minhas-financas/ui/components/Typography';
import { Grid, GridItem } from '@minhas-financas/ui/components/Grid';
import { Card, CardContent } from '@minhas-financas/ui/components/Card';
import { CHART_HOT_COLORS, CHART_COLD_COLORS } from '@minhas-financas/ui/charts';

import { maskCurrency } from '@minhas-financas/toolkit/mask';

import ChartCard from './Charts';
import useBudget from '../useBudget';
import getStackedSpends from './Charts/getStackedSpends';
import getCategoryValues from './Charts/getCategoryValues';
import getHigherExpenses from './Charts/getHigherExpenses';

export default function BudgetAnalytics() {
    const { releases } = useBudget();

    const data = useMemo(() => ({
        exitByCategory: getCategoryValues(releases, 'exit'),
        entryByCategory: getCategoryValues(releases, 'entry'),
        stackedSpends: getStackedSpends(releases),
        higherExpenses: getHigherExpenses(releases)
    }), [releases]);

    return (
        <Grid>
            <GridItem lg={6} md={6} sm={12}>
                <Card>
                    <CardContent>
                        <Stack orientation="row" justifyContent="space-between" spacing="small" alignItems="center">
                            <Stack orientation="row" spacing="small" alignItems="center">
                                <Typography noMargin variant="body2">Compras parceladas</Typography>
                                <Tooltip label="sdsds">
                                    <Icon name="info-circle" color="text.secondary" />
                                </Tooltip>
                            </Stack>

                            <Chip label="30%" color="warning" variant="outlined" />
                        </Stack>
                        <Typography noMargin variant="h5">{maskCurrency(10000)}</Typography>
                    </CardContent>
                </Card>
            </GridItem>
            <GridItem lg={12} md={12} sm={12}>
                <ChartCard label="Gasto x Valor disponível">
                    <>
                        {
                            Boolean(data.stackedSpends.length) && (
                                <Stack orientation="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <div>
                                        <Typography noMargin color="text.secondary">Valor gasto</Typography>
                                        <Typography noMargin variant="h5" color="error.main">
                                            {maskCurrency(data.stackedSpends[0].value * 100)}
                                        </Typography>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Typography noMargin color="text.secondary">Saldo disponível</Typography>
                                        <Typography
                                            noMargin
                                            variant="h5"
                                            color={data.stackedSpends[1].color as MappedColors}
                                        >
                                            {maskCurrency(data.stackedSpends[1].value * 100)}
                                        </Typography>
                                    </div>
                                </Stack>
                            )
                        }
                        <StackBar data={data.stackedSpends} />
                    </>
                </ChartCard>
            </GridItem>
            <GridItem lg={6} md={6} sm={12}>
                <ChartCard label="Ganho por categoria" style={{ display: 'flex' }}>
                    <Donut data={data.entryByCategory} colors={CHART_COLD_COLORS} />
                </ChartCard>
            </GridItem>
            <GridItem lg={6} md={6} sm={12}>
                <ChartCard label="Gasto por categoria" style={{ display: 'flex' }}>
                    <Donut data={data.exitByCategory} tooltipPosition="left" colors={CHART_HOT_COLORS} />
                </ChartCard>
            </GridItem>
            {/* <GridItem lg={12} md={12} sm={12}>
                <Chart label="Gasto por categoria">
                    <BarChart
                        colors={COLORS}
                        height={350}
                        series={data.exitByCategory}
                        borderRadius={shape.radius}
                        slotProps={{
                            legend: {
                                hidden: true
                            }
                        }}
                    />
                </Chart>
            </GridItem>
            <GridItem lg={12} md={12} sm={12}>
                <Chart label="Recebimento por categoria">
                    <BarChart
                        colors={COLORS}
                        series={data.entryByCategory}
                        borderRadius={shape.radius}
                        slotProps={{
                            legend: {
                                hidden: true
                            }
                        }}
                    />
                </Chart>
            </GridItem>
            <GridItem lg={12} md={12} sm={12}>
                <Chart label="Gasto x Valor disponível">
                    <BarChart
                        colors={COLORS}
                        series={data.higherExpenses}
                        borderRadius={shape.radius}
                        slotProps={{
                            legend: {
                                padding: 0,
                                direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'middle' },
                            }
                        }}
                    />
                </Chart>
            </GridItem> */}
        </Grid>
    );
}