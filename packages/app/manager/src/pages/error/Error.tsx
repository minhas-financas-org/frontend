import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Fade from '@minhas-financas/ui/animations/Fade';
import Stack from '@minhas-financas/ui/components/Stack';
import Button from '@minhas-financas/ui/components/Button';
import Typography from '@minhas-financas/ui/components/Typography';

import { authServices, url } from '@/services/core';

import { IProps, TStatus } from './interface';

export default function Error({ status = '404' }: IProps) {
    const [animate, setAnimate] = useState(false);
    const { status: statusParams } = useParams<{ status: TStatus }>();

    const currentStatus = status || statusParams as TStatus;

    const MAP = {
        404: 'Não conseguimos encontrar a página solicitada.',
        403: 'Você não pode acessar a página solicitada.',
        500: 'Ocorreu um erro inesperado! Por favor, tente novamente mais tarde.'
    };

    useEffect(() => setAnimate(true), []);

    const handleBack = () => {
        authServices.logout(() => window.open(url.sso, '_self'));
    };

    return (
        <Fade enter={animate}>
            <Stack>
                <div>
                    <Typography variant="h3" noMargin>
                        Ooops...
                    </Typography>
                    <Typography variant="h6" noMargin>
                        Algo deu errado
                    </Typography>
                    <Typography variant="body1">
                        ERRO <strong>{currentStatus}</strong> - {MAP[currentStatus]}.
                    </Typography>
                    <Button onClick={handleBack}>Voltar</Button>
                </div>
            </Stack>
        </Fade>
    );
}
