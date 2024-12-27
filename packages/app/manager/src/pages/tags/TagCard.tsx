import ButtonIcon from '@minhas-financas/ui/components/ButtonIcon';
import { Card, CardContent } from '@minhas-financas/ui/components/Card';
import Icon from '@minhas-financas/ui/components/Icon';
import Stack from '@minhas-financas/ui/components/Stack';
import Typography from '@minhas-financas/ui/components/Typography';

import type { TagData } from '@minhas-financas/services/tags';

import useTag from './useTags';

export default function TagCard(tag: TagData) {
    const { deleteTag } = useTag();

    const handleDelete = () => {
        deleteTag(tag.id);
    };

    return (
        <Card style={{ position: 'relative' }}>
            <CardContent>
                <Stack
                    orientation="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ flexWrap: 'nowrap' }}
                >
                    <Stack
                        orientation="row"
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <div
                            className="bullet"
                            style={{ backgroundColor: tag.color }}
                        />
                        <Typography noMargin variant="body1" >
                            {tag.name}
                        </Typography>
                    </Stack>

                    <ButtonIcon color="text.secondary" onClick={handleDelete}>
                        <Icon name="trash-alt" />
                    </ButtonIcon>
                </Stack>
            </CardContent>
        </Card>
    );
}