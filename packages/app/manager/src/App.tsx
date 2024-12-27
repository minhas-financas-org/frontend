import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import AlertProvider from '@greencapital/ui/components/Alert';
import Favicon from '@greencapital/ui/assets/favicon/favicon.svg';
import { ThemeProvider, createTheme, useTheme } from '@greencapital/ui/theme';

import UserProvider from '@greencapital/context/user';

import Layout from './layout';
import { GlobalProvider } from './global';
import { authServices, userServices } from './services/core';

import '@greencapital/ui/styles';

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
                <UserProvider
                    authServices={authServices}
                    userServices={userServices}
                >
                    <GlobalProvider>
                        {children}
                    </GlobalProvider>
                </UserProvider>
            </AlertProvider>
        </ThemeProvider>
    );
}

function Content() {
    const { theme: { palette } } = useTheme();

    useEffect(() => { setFavicon(palette.primary.main); }, []);

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

export default function App() {
    return (
        <Provider>
            <Content />
        </Provider>
    );
};