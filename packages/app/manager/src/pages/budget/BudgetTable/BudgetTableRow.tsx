import { format, formatISO, addDays } from 'date-fns';

import Chip from '@greencapital/ui/components/Chip';
import Icon from '@greencapital/ui/components/Icon';
import Stack from '@greencapital/ui/components/Stack';
import type { Colors } from '@greencapital/ui/theme';
import { TableCell } from '@greencapital/ui/components/Table';

import { maskCurrency } from '@greencapital/toolkit/mask';

import type { BudgetData } from '@greencapital/services/budgets';

interface RowDetailProps { release: BudgetData; date: string; }
export default function RowDetails({ release, date }: RowDetailProps) {
    const dateDayAndMonth = format(formatISO(addDays(release.date, 1)), 'dd/MM');

    const typeIcon: { icon: string; color: Colors } = {
        icon: release.type === 'entry' ? 'arrow-up' : 'arrow-down',
        color: release.type === 'entry' ? 'success' : 'error'
    };

    const currentInstallment = release.installments.dates.findIndex((installment) => installment === date) + 1;

    const formattedValue = maskCurrency(release.value * 100);
    const formatterInstallments = release.installments.total > 1
        ? `${currentInstallment}/${release.installments.total}`
        : '';

    return (
        <>
            <TableCell align="center">{dateDayAndMonth}</TableCell>
            <TableCell align="center">
                {<Icon name={typeIcon.icon} color={`${typeIcon.color}.main`} />}
            </TableCell>
            <TableCell align="right">{release.category.name}</TableCell>
            <TableCell align="right" style={{ maxWidth: 200, overflow: 'auto' }}>
                <Stack orientation="row">
                    {
                        release.tags.map((tag, i) => (
                            <Chip key={i} label={tag.name} icon={
                                <div style={{
                                    backgroundColor: tag.color,
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%'
                                }} />
                            } />
                        ))
                    }
                </Stack>
            </TableCell>
            <TableCell align="right">{release.name}</TableCell>
            <TableCell align="right">
                <Stack orientation="row" justifyContent="space-between" alignItems="center">
                    <span>{formatterInstallments}</span>
                    <span>{formattedValue}</span>
                </Stack>
            </TableCell>
        </>
    );
}