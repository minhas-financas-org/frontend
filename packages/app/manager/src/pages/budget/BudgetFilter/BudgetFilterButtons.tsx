import Icon from '@minhas-financas/ui/components/Icon';
import Stack from '@minhas-financas/ui/components/Stack';
import Button from '@minhas-financas/ui/components/Button';
import { Menu, MenuButton, useMenu } from '@minhas-financas/ui/components/Menu';

import type { Type } from './interface';
import useBudget from '../useBudget';

const MAP_SORT: { type: Type; label: string }[] = [
    { type: 'latest', label: 'Mais recente' },
    { type: 'oldest', label: 'Mais antigo' },
    { type: 'highest', label: 'Maior preço' },
    { type: 'lowest', label: 'Menor preço' },
];

interface BudgetFilterButtonsProps { onToggle: () => void; }
export default function BudgetFilterButtons({ onToggle }: BudgetFilterButtonsProps) {
    const [openMenu, el, ref, toggleMenu] = useMenu();

    const { setSortType, sortType } = useBudget();

    const handleChangeType = (t: Type) => {
        setSortType(t);
        toggleMenu();
    };

    return (
        <Stack orientation="row" justifyContent="flex-end" className="filter">
            <div>
                <Button
                    size="small"
                    variant="text"
                    color="secondary"
                    startIcon={<Icon name="filter" />}
                    onClick={onToggle}
                >
                    Filtros
                </Button>
            </div>

            <div ref={ref}>
                <Button
                    size="small"
                    variant="text"
                    color="secondary"
                    startIcon={<Icon name="sort" />}
                    onClick={toggleMenu}
                >
                    Ordenar
                </Button>
                <Menu
                    direction="right"
                    width="fit-content"
                    anchorEl={el}
                    open={openMenu}
                    onClose={toggleMenu}
                >
                    {
                        MAP_SORT.map(({ type: t, label }) => (
                            <MenuButton
                                key={label}
                                label={label}
                                onClick={() => handleChangeType(t)}
                                sx={{
                                    backgroundColor: ({ primary }) => t === sortType ? primary.opacity : 'transparent',
                                    color: ({ primary, text }) => t === sortType ? primary.dark : text.primary,
                                }}
                            />
                        ))
                    }
                </Menu>
            </div>
        </Stack>
    );
}