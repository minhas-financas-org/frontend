import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';

import Box from '@minhas-financas/ui/components/Box';
import Header from '@minhas-financas/ui/layout/Header';
import Icon from '@minhas-financas/ui/components/Icon';
import Slide from '@minhas-financas/ui/animations/Slide';
import Stack from '@minhas-financas/ui/components/Stack';
import Content from '@minhas-financas/ui/layout/Content';
import Loading from '@minhas-financas/ui/components/Loading';
import { Sidebar, SidebarButton } from '@minhas-financas/ui/layout/Sidebar';
import { createTheme, useTheme, themeDefaultLight, themeDefaultDark } from '@minhas-financas/ui/theme';

import { useUser } from '@minhas-financas/context/user';

import { useGlobal } from '@/global';
import { authServices } from '@/services/core';

interface LayoutProps { children: React.JSX.Element; }
export default function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
    const navigate = useNavigate();
    const { loading } = useGlobal();
    const { currentUser } = useUser();
    const { theme, updateTheme } = useTheme();

    const themes = {
        light: themeDefaultLight,
        dark: themeDefaultDark,
    };

    const handleLogout = () => { authServices.logout(() => window.open(authServices.url, '_self')); };

    const toggleTheme = () => {
        updateTheme(createTheme(theme.palette.mode === 'dark'
            ? themes.light
            : themes.dark
        ));
    };

    return (
        <Box sx={{ backgroundColor: ({ background }) => background.default }}>
            <Slide enter direction="top" timeout={.3}>
                <Header
                    user={{
                        name: currentUser?.name,
                        email: currentUser?.email,
                        picture: currentUser?.picture,
                    }}
                    onUpdateMode={toggleTheme}
                    onProfile={() => console.log('Profile')}
                    onStartGuide={() => console.log('Start guide')}
                />
            </Slide>
            <Stack orientation="row" nogap>
                <Slide enter direction="left" timeout={.3}>
                    <Sidebar
                        upButtons={
                            <>
                                {/* <SidebarButton
                                    path="dashboard"
                                    icon={<Icon name="graph-bar" />}
                                    onClick={() => navigate('/dashboard')}
                                /> */}
                                <SidebarButton
                                    path="budgets"
                                    icon={<Icon name="schedule" />}
                                    onClick={() => navigate(`/budgets/${format(new Date(), 'yyyy-MM')}/list`)}
                                />
                                {/* <SidebarButton
                                    path="goals"
                                    icon={<Icon name="file-check" />}
                                    onClick={() => navigate('/goals')}
                                /> */}
                                <SidebarButton
                                    path="categories"
                                    icon={<Icon name="folder" />}
                                    onClick={() => navigate('/categories')}
                                />
                                <SidebarButton
                                    path="tags"
                                    icon={<Icon name="tag-alt" />}
                                    onClick={() => navigate('/tags')}
                                />
                            </>
                        }
                        downButtons={
                            <>
                                <SidebarButton
                                    icon={<Icon name="setting" />}
                                />
                                <SidebarButton
                                    icon={<Icon name="signout" />}
                                    onClick={handleLogout}
                                />
                            </>
                        }
                    />
                </Slide>
                <Content>
                    {
                        loading
                            ? (
                                <Stack
                                    alignItems="center"
                                    justifyContent="center"
                                    style={{ height: 300 }}
                                >
                                    <Loading size={70} />
                                </Stack>
                            )
                            : children
                    }
                </Content>
            </Stack>
        </Box>
    );
}