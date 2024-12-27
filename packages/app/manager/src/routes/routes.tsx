import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import { formatDate } from 'date-fns';

import App from '@/App';
import Error from '@/pages/error';
// import Goals from '@/pages/goals';
import Dashboard from '@/pages/dashboard';
import { Tags, TagsProvider } from '@/pages/tags';
import { Budget, BudgetDetails, BudgetProvider } from '@/pages/budget';
import { Categories, CreateCategory, CategoriesProvider } from '@/pages/categories';

import { UserLoggedOutGuard } from './LoggedGuard';

export const router = createBrowserRouter([
    {
        path: '',
        element: (
            <UserLoggedOutGuard>
                <App />
            </UserLoggedOutGuard>
        ),
        errorElement: <Error />,
        children: [
            {
                path: '/',
                element: <Navigate to={`/budgets/${formatDate(new Date(), 'yyyy-MM')}/list`} />,
            },
            {
                path: '/dashboard',
                loader: () => document.title = 'Minhas Finanças - Dashboard',
                element: <Dashboard />,
            },
            {
                path: '/budgets',
                loader: () => document.title = 'Minhas Finanças - Contas',
                element: (
                    <BudgetProvider>
                        <Budget />
                    </BudgetProvider>
                ),
                children: [
                    {
                        path: ':date/:tab',
                        element: (
                            <BudgetDetails />
                        )
                    }
                ]
            },
            // {
            //     path: '/goals',
            //     loader: () => document.title = 'Minhas Finanças - Metas',
            //     element: <Goals />,
            // },
            {
                path: '/categories',
                loader: () => document.title = 'Minhas Finanças - Categorias',
                element: (
                    <CategoriesProvider>
                        <Outlet />
                    </CategoriesProvider>
                ),
                children: [
                    {
                        path: '',
                        element: <Categories />,
                    },
                    {
                        path: 'create',
                        element: <CreateCategory />,
                    }
                ]
            },
            {
                path: '/tags',
                loader: () => document.title = 'Minhas Finanças - Tags',
                element: (
                    <TagsProvider>
                        <Outlet />
                    </TagsProvider>
                ),
                children: [
                    {
                        path: '',
                        element: <Tags />,
                    }
                ]
            },
            {
                path: '*',
                element: <Navigate to='/dashboard' />,
            }
        ],
    }
]);
