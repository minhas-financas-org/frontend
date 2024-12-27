import { useEffect } from 'react';

export default function useOutsideClick(
    ref: React.RefObject<HTMLElement>,
    callback: () => void,
    deps: any[] = []
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mouseup', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [ref, callback, ...deps]);
}
