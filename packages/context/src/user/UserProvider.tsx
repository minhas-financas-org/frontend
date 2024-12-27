import { useEffect, useState, createContext, useMemo } from 'react';

import logger from '@greencapital/toolkit/logger';
import { getParams } from '@greencapital/toolkit/url';

import Auth from '@greencapital/services/auth';
import User, { type UserData } from '@greencapital/services/user';

export interface UserContext {
    currentUser: UserData;
    update: (user: UserData) => void;
}

export const UserContext = createContext({} as UserContext);

interface IProps {
    userServices: User;
    authServices: Auth;
    children: React.ReactNode;
}
export default function UserProvider({ children, userServices, authServices }: IProps) {
    const [user, setUser] = useState<UserData>();

    const context = useMemo(() => ({
        currentUser: user as UserData,
        update: (user: UserData) => { setUser(user); },
    }), [user]);

    useEffect(() => { getUser(); }, []);

    const getUser = () => {
        const params = getParams<{ email: string; }>();

        if (window.location.href.includes('error')) { return; }

        const email = params.email || userServices.currentByToken.email;

        return userServices.getUserByEmail(email)
            .then((user) => { setUser(user); })
            .catch(() => {
                authServices.logout(() => window.open(authServices.url, '_self'));
                logger.info('Usuário não encontrado');
            });
    };

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    );
}
