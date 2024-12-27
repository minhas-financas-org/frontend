import { useState } from 'react';

import joinClass from '@/utils/joinClass';
import useResize from '@/hooks/useResize';
import createComponent from '@/core/createComponent';

import type { GridBaseProps, Size } from './interface';

import './Grid.scss';

export interface GridItemProps extends GridBaseProps { children: React.ReactNode; }
function GridItem({ children, lg = 1, md = lg, sm = md, ...props }: Readonly<GridItemProps>) {
    const [size, setSize] = useState<keyof Size>('md');

    const MAP = { sm, lg, md };

    useResize({
        onXs: () => setSize('sm'),
        onSm: () => setSize('md'),
        onMd: () => setSize('lg'),
        onLg: () => setSize('lg'),
        onXl: () => setSize('lg'),
    });

    return (
        <div
            {...props}
            className={joinClass([
                'grid__item',
                `grid__item-${MAP[size]}`,
                props.className,
            ])}
        >
            {children}
        </div>
    );
}

export default createComponent(GridItem);