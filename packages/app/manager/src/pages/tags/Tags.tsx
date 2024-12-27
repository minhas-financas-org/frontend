import { useEffect } from 'react';

import Page from '@greencapital/ui/layout/Page';
import Icon from '@greencapital/ui/components/Icon';
import Slide from '@greencapital/ui/animations/Slide';
import Stack from '@greencapital/ui/components/Stack';
import Button from '@greencapital/ui/components/Button';
import Skeleton from '@greencapital/ui/components/Skeleton';
import { useDrawer } from '@greencapital/ui/components/Drawer';
import Typography from '@greencapital/ui/components/Typography';
import { Grid, GridItem } from '@greencapital/ui/components/Grid';

import { getParams } from '@greencapital/toolkit/url';
import { getFilledArray } from '@greencapital/toolkit/array';

import type { TagData } from '@greencapital/services/tags';

import { release } from '@/services/core';

import useTag from './useTags';
import TagCard from './TagCard';
import CreateTagDrawer from './create';

import './Tags.scss';

interface EmptyContentProps { ontToggleDrawer: () => void; }
function EmptyContent({ ontToggleDrawer }: EmptyContentProps) {
    return (
        <Slide enter direction="top">
            <Stack alignItems="center">
                <Icon name="box" color="text.secondary" style={{ fontSize: 72 }} />
                <Typography noMargin variant="h6" color="text.secondary" style={{ textAlign: 'center' }}>
                    Nenhuma tag encontrada.
                </Typography>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<Icon name="plus" />}
                    onClick={ontToggleDrawer}
                >
                    Adicionar tag
                </Button>
            </Stack>
        </Slide>
    );
}

interface ContentProps { tags: TagData[]; ontToggleDrawer: () => void; }
function Content({ tags, ontToggleDrawer }: ContentProps) {
    return (
        tags.length === 0 ? (
            <EmptyContent ontToggleDrawer={ontToggleDrawer} />
        ) : (
            <Grid lg={4} md={6} sm={12}>
                {
                    tags
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tag, i) => (
                            <GridItem key={tag.id}>
                                <Slide enter delay={(i + 1) * 100} direction="top">
                                    <TagCard {...tag} />
                                </Slide>
                            </GridItem>
                        ))}
            </Grid>
        )
    );
}

function SkeletonCards() {
    const arr = getFilledArray(9);

    return (
        <Grid lg={4} md={6} sm={12}>
            {
                arr.map((_, i) => (
                    <GridItem key={i}>
                        <Skeleton width="100%" height={70} />
                    </GridItem>
                ))
            }
        </Grid>
    );
}

export default function Tags() {
    const { open } = getParams<{ open: string }>();

    const { loading, tags } = useTag();
    const [openDrawer, toggleDrawer] = useDrawer();

    useEffect(() => {
        if (loading === false && open === 'true') { toggleDrawer(); }
    }, [loading]);

    return (
        <Page
            title="Tags"
            subtitle="Aqui você pode visualizar e gerenciar suas tags."
            release={release}
            action={
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<Icon name="plus" />}
                    onClick={toggleDrawer}
                >
                    Adicionar tag
                </Button>
            }
        >
            <div className="page-tags">
                {loading && <SkeletonCards />}
                {!loading && <Content tags={tags} ontToggleDrawer={toggleDrawer} />}
            </div>
            <CreateTagDrawer isOpen={openDrawer} onToggleModal={toggleDrawer} />
        </Page>
    );
}