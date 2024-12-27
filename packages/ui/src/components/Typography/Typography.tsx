import type { PropsWithChildren, HTMLAttributes } from 'react';

import joinClass from '@/utils/joinClass';
import createComponent from '@/core/createComponent';
import { useTheme, type MappedColors, convertPathToColor } from '@/theme';

import './Typography.scss';

export type Variant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2';

const MAP: { [x: string]: keyof JSX.IntrinsicElements } = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
};

interface TypographyProps extends PropsWithChildren<HTMLAttributes<HTMLParagraphElement>> {
    variant?: Variant;
    color?: MappedColors;
    weight?: 'bold' | 'normal';
    noMargin?: boolean;
    gutterBottom?: boolean;
}
function Typography({
    children,
    noMargin,
    gutterBottom,
    variant = 'body1',
    color = 'text.primary',
    weight,
    ...props
}: TypographyProps) {
    const { theme: { palette } } = useTheme();

    const CustomTag = MAP[variant];

    const cls = joinClass([
        'ui-typography',
        `ui-typography--${variant}`,
        noMargin && 'ui-typography--no-margin',
        weight && `ui-typography--weight-${weight}`,
        gutterBottom && 'ui-typography--gutter-bottom',
        props.className
    ]);

    const c = convertPathToColor(color, palette);

    return (
        <CustomTag className={cls} style={{ ...props.style, color: c }}>
            {children}
        </CustomTag>
    );
}

export default createComponent(Typography);