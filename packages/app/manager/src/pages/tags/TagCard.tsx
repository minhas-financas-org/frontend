import ButtonIcon from '@greencapital/ui/components/ButtonIcon';
import { Card, CardContent } from '@greencapital/ui/components/Card';
import Icon from '@greencapital/ui/components/Icon';
import Stack from '@greencapital/ui/components/Stack';
import Typography from '@greencapital/ui/components/Typography';

import type { TagData } from '@greencapital/services/tags';

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