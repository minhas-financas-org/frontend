
import { createContext, useMemo } from 'react';

import { useAlert } from '@greencapital/ui/components/Alert';
import Icon from '@greencapital/ui/components/Icon';

import logger from '@greencapital/toolkit/logger';

import { defaultCategories } from '@greencapital/services/categories';

import { authServices, userServices, categoriesServices, url } from '@/services/core';

type BasicUser = { name: string; email: string; password: string }

interface GlobalContextConfig {
    createUser: (data: BasicUser) => Promise<void>;
}

const FIREBASE = {
    'auth/email-already-in-use': 'Email já em uso',
};

export const GlobalContext = createContext<GlobalContextConfig>({
    createUser: async () => { },
});

interface GlobalProviderProps { children: React.JSX.Element; }
export default function GlobalProvider({ children }: GlobalProviderProps) {
    const { addAlert } = useAlert();

    const context = useMemo<GlobalContextConfig>(() => ({
        createUser: async (data: BasicUser) => { createUser(data); },
    }), []);

    const redirect = (email: string) => {
        const managerUrl = `${url.manager}?token=${authServices.access_token}&email=${email}`;
        logger.info('Redirecting to manager page:', managerUrl);
        window.open(managerUrl, '_self');
    };

    const createUser = async ({ email, name, password }: BasicUser) => {
        authServices.createUserWithPassword(email, password)
            .then((user) => {
                logger.info('usuario criado no autenticador!', user);
                return user;
            })
            .then((user) => userServices.createUser({
                ...user,
                ...{ name },
                ...{ picture: `https://robohash.org/${email}` }
            }))
            .then(() => logger.info('usuario criado com sucesso!'))
            .then(() => categoriesServices.setCategory({
                ownerId: userServices.currentByToken.user_id,
                categories: defaultCategories,
            }))
            .then(() => logger.info('categorias criadas com sucesso!'))
            .then(() => redirect(email))
            .catch((e) => {
                const { code } = e;

                addAlert({
                    color: 'error',
                    message: FIREBASE[code] || 'Erro ao criar usuário',
                    icon: <Icon name="error" />,
                });

                logger.error('Erro ao criar ususario, ', { e });
            });
    };

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    );
}