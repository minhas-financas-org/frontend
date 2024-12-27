import { serialize } from '@/object';

export function getParams<T>(): T {
    return window.location.search
        .replace('?', '')
        .split('&')
        .reduce<T>((acc, value: string) => {
            const [l, v] = value.split('=') as [keyof T, any];
            acc[l] = v;
            return acc;
        }, {} as T);
}

export function getPage<T>(): T {
    return window.location.pathname
        .split('/')
        .reverse()
        .filter(Boolean)[0] as T;
}

export function getPath<T>(): T {
    return window.location.pathname
        .split('/')
        .filter(Boolean)[0] as T;
}

export function formatUrl(path: string, params = {}) {
    const query = serialize(params);
    const url = [path].filter(i => i).join('/');

    return `${url}${query ? `?${query}` : ''}`;
}