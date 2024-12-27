import Icon from '@greencapital/ui/components/Icon';
import Stack from '@greencapital/ui/components/Stack';
import ButtonIcon from '@greencapital/ui/components/ButtonIcon';
import Typography from '@greencapital/ui/components/Typography';
import { Card, CardContent } from '@greencapital/ui/components/Card';
import { joinClass } from '@greencapital/ui/utils';

import type { CategoryData } from '@greencapital/services/categories';

import './Categories.scss';

interface CardCategoryProps extends CategoryData { onRemove: (category: CategoryData) => void; }
export default function CardCategory({ id, name, type, onRemove }: CardCategoryProps) {

    const className = joinClass([
        'category-card',
        `category-card--${type}`,
    ]);

    const handleRemove = () => { onRemove({ id, name, type }); };

    return (
        <Card className={className} style={{ position: 'relative' }}>
            <CardContent>
                <Stack
                    orientation="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ flexWrap: 'nowrap' }}
                >
                    <Typography noMargin variant="subtitle1">
                        {name}
                    </Typography>
                    <ButtonIcon color="text.secondary" onClick={handleRemove}>
                        <Icon name="trash-alt" />
                    </ButtonIcon>
                </Stack>
            </CardContent>
        </Card>
    );
}