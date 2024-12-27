import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Favicon from '@minhas-financas/ui/assets/favicon/favicon.svg';
import AlertProvider, { useAlert } from '@minhas-financas/ui/components/Alert';
import { ThemeProvider, createTheme, useTheme } from '@minhas-financas/ui/theme';

import { getParams } from '@minhas-financas/toolkit/url';

import { GlobalProvider } from './global';

import '@minhas-financas/ui/styles';

function setFavicon(color: string) {

    let link = document.querySelector<HTMLLinkElement>('link[rel~=\'icon\']');

    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    fetch(Favicon)
        .then((response) => response.text())
        .then((svgText) => {
            const updatedSVG = svgText.replace(/fill="[^"]*"/, `color="${color}"`);

            const blob = new Blob([updatedSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            link.href = url;
        });
}

interface ProviderProps { children: React.JSX.Element; }
function Provider({ children }: ProviderProps) {
    return (
        <ThemeProvider theme={createTheme()}>
            <AlertProvider>
                <GlobalProvider>
                    {children}
                </GlobalProvider>
            </AlertProvider>
        </ThemeProvider>
    );
}

function StatusListener() {
    const location = useLocation();
    const { addAlert } = useAlert();

    const params = getParams<{ status: string }>();

    useEffect(() => {
        if (!params.status) { return; }

        const { status } = params;

        if (status === '401') {
            addAlert({ message: 'Sessão expirada, faça login novamente.', color: 'info' });
        }

        if (status === '403') {
            addAlert({ message: 'Você não tem permissão para acessar esta página.', color: 'warning' });
        }
    }, [location]);

    return <></>;
}

function Content() {
    const { theme: { palette } } = useTheme();

    useEffect(() => { setFavicon(palette.primary.main); }, []);

    return (
        <>
            <StatusListener />
            <Outlet />
        </>
    );
}

export default function App() {
    return (
        <Provider>
            <Content />
        </Provider>
    );
};