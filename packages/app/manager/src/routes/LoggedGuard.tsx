import { useEffect, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import logger from '@minhas-financas/toolkit/logger';
import { getParams } from '@minhas-financas/toolkit/url';

import { authServices, url } from '@/services/core';

export const UserLoggedOutGuard = ({ children }: PropsWithChildren) => {
    const location = useLocation();
    const params = getParams<{ token: string }>();

    const saveToken = () => {
        logger.info('Saving token');
        authServices.access_token = params.token;
    };

    useEffect(() => {
        if (params.token) { saveToken(); }

        if (!params.token && !authServices.access_token) {
            logger.info('User is not logged in. Redirecting to SSO page.');
            window.open(url.sso, '_self');
            return;
        }
    }, [location]);

    return children;
};