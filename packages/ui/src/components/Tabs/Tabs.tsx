import React, { Children, ReactElement, useEffect, cloneElement, useState, useRef, useMemo } from 'react';

import { uuid } from '@minhas-financas/toolkit/uuid';

import { joinClass } from '@/utils';
import type { Colors } from '@/theme';
import { useListenerResized } from '@/hooks';
import createComponent from '@/core/createComponent';

import { Variant } from './interface';
import type { TabProps } from './TabButton';
import { IconProps } from '../Icon';

function validateCurrent(length: number, current: number) {
    if (current > length) {
        throw new Error(`Current tab index (${current}) is greater than the number of tabs (${length})`);
    }
}

interface TabsProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
    current?: number;
    color?: Colors
    variant?: Variant;
    children: React.ReactNode;
    onChange?: (index: number) => void;
}
function Tabs({
    children,
    color = 'primary',
    variant = 'line',
    current = 0,
    onChange,
    ...props
}: TabsProps) {
    const [_current, setCurrent] = useState(current);
    const arrayChildren = Children.toArray(children) as ReactElement<TabProps>[];
    const scrollRef = useRef<HTMLDivElement[] | null>([]);

    const classNameMarker = joinClass([
        'ui-tabs__marker',
        `ui-tabs__marker--${variant}`,
        `ui-tabs__marker--${variant}--${color}`,
    ]);

    const id = useMemo(() => `marker-${uuid()}`, []);

    const currentTab = arrayChildren[_current].props;

    useListenerResized(() => setBorderLine(), [_current]);

    useEffect(() => { validateCurrent(arrayChildren.length - 1, _current); }, []);

    useEffect(() => { setCurrent(current); }, [current]);

    useEffect(() => {
        setBorderLine();
        goToTab(_current);
    }, [_current]);

    const handleClick = (index: number) => {
        if (onChange) { onChange(index); };
        setCurrent(index);
    };

    const goToTab = (index: number) => {
        if (scrollRef.current) {
            scrollRef.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center', });
        }
    };

    const setRef = (index: number, ref: HTMLDivElement | null) => {
        if (scrollRef.current && ref) scrollRef.current[index] = ref;
    };

    const setBorderLine = () => {
        const element = document.querySelector(`#tab-${id}-${_current}`) as HTMLElement;
        const el = document.getElementById(id) as HTMLElement;

        const width = element['offsetWidth'];
        const left = element['offsetLeft'];

        el.style.width = `${width}px`;
        el.style.left = `${left}px`;
    };

    const renderIcon = (icon: React.JSX.Element,) => {
        return icon && cloneElement<IconProps>(icon, {
            className: joinClass(['ui-tabs__marker__icon']),
            color: `${color}-contrastText` as Colors,
        });
    };

    const renderChildren = () => {
        return arrayChildren.map((child, index) => {
            const _id = `tab-${id}-${index}`;
            const isActive = _current === index;

            return (
                <div key={_id} ref={ref => setRef(index, ref)} style={{ width: '100%' }}>
                    {
                        cloneElement(child, {
                            id: _id,
                            variant,
                            'tabIndex': index + 1,
                            'aria-checked': isActive,
                            style: variant === 'rounded' && isActive ? { color: 'transparent' } : {},
                            onClick: () => handleClick(index),
                        })
                    }
                </div>
            );
        });
    };

    return (
        <div className="ui-tabs" {...props}>
            {renderChildren()}
            <div id={id} className={classNameMarker}>
                {
                    variant === 'rounded' && (
                        <>
                            {renderIcon(currentTab.icon as React.JSX.Element)}
                            {currentTab.label}
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default createComponent(Tabs);