import { useParams } from 'react-router-dom';

import Slide from '@minhas-financas/ui/animations/Slide';
import Loading from '@minhas-financas/ui/components/Loading';
import { Table, TableBody, TableCell, TableHeader } from '@minhas-financas/ui/components/Table';
import Typography from '@minhas-financas/ui/components/Typography';
import Icon from '@minhas-financas/ui/components/Icon';

import type { BudgetData } from '@minhas-financas/services/budgets';

import useBudget from '../useBudget';
import BudgetTableRow from './BudgetTableRow';

interface BudgetTableProps { onOpenDetails: (data: BudgetData) => void }
export default function BudgetTable({ onOpenDetails }: BudgetTableProps) {
    const { releases, loading, sortType } = useBudget();
    const { date } = useParams<{ date: string; }>();

    const sortReleases = (a: BudgetData, b: BudgetData): number => {
        if (sortType === 'highest') { return b.value - a.value; }
        if (sortType === 'lowest') { return a.value - b.value; }
        if (sortType === 'latest') { return new Date(b.date).getTime() - new Date(a.date).getTime(); }
        if (sortType === 'oldest') { return new Date(a.date).getTime() - new Date(b.date).getTime(); }

        return b.value - a.value;
    };

    return (
        <Table>
            <TableHeader>
                <TableCell align="center" style={{ width: 80 }}>Data</TableCell>
                <TableCell align="center" style={{ width: 50 }}>Tipo</TableCell>
                <TableCell align="right" style={{ width: 150 }}>Categorias</TableCell>
                <TableCell align="center">tags</TableCell>
                <TableCell align="right">Nome</TableCell>
                <TableCell align="right">Valor</TableCell>
            </TableHeader>
            {
                loading.table && (
                    <TableBody>
                        <tr style={{ height: 150 }}>
                            <TableCell colSpan={6} align="center">
                                <Loading size={40} />
                            </TableCell>
                        </tr>
                    </TableBody>
                )
            }
            {
                !loading.table && Boolean(releases.length) && (
                    <TableBody>
                        {
                            releases
                                .sort(sortReleases)
                                .map((release, i) => (
                                    <Slide
                                        enter
                                        key={i}
                                        tag="tr"
                                        direction="left"
                                        delay={(i + 1) * 100}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onOpenDetails(release)}
                                    >
                                        <BudgetTableRow key={i} release={release} date={date as string} />
                                    </Slide>
                                ))
                        }
                    </TableBody>
                )
            }
            {
                !loading.table && !releases.length && (
                    <TableBody>
                        <Slide enter tag="tr" direction="bottom">
                            <TableCell colSpan={6} align="center" >
                                <>
                                    <Icon name="folder" color="text.secondary" />
                                    <Typography noMargin color="text.secondary">
                                        Nenhum lançamento encontrado
                                    </Typography>
                                </>
                            </TableCell>
                        </Slide>
                    </TableBody>
                )
            }
        </Table>
    );
}