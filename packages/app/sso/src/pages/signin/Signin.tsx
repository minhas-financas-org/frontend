import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@minhas-financas/ui/components/Box';
import Logo from '@minhas-financas/ui/components/Logo';
import Icon from '@minhas-financas/ui/components/Icon';
import Slide from '@minhas-financas/ui/animations/Slide';
import Input from '@minhas-financas/ui/components/Input';
import Stack from '@minhas-financas/ui/components/Stack';
import Button from '@minhas-financas/ui/components/Button';
import Divider from '@minhas-financas/ui/components/Divider';
import Loading from '@minhas-financas/ui/components/Loading';
import { useAlert } from '@minhas-financas/ui/components/Alert';
import Container from '@minhas-financas/ui/components/Container';
import ButtonIcon from '@minhas-financas/ui/components/ButtonIcon';
import Typography from '@minhas-financas/ui/components/Typography';
import { Card, CardContent } from '@minhas-financas/ui/components/Card';
import Form, { Control, useForm, FormControl } from '@minhas-financas/ui/components/Form';

import logger from '@minhas-financas/toolkit/logger';

import { authServices, release, url } from '@/services/core';

const FIREBASE = {
    'auth/user-not-found': 'Email ou senha inválidos',
    'auth/wrong-password': 'Email ou senha inválidos',
    // eslint-disable-next-line max-len
    'auth/too-many-requests': 'O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login malsucedidas. Você pode restaurá-lo imediatamente redefinindo sua senha ou pode tentar novamente mais tarde.',
};

function EmailAndPasswordForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<'text' | 'password'>('password');

    const { addAlert } = useAlert();

    const iconEye = type === 'text' ? 'eye-slash' : 'eye';

    const [formGroup] = useForm<{ email: string; password: string }>({
        form: {
            email: new FormControl({ defaultValue: '', type: 'email', required: true }),
            password: new FormControl({ defaultValue: '', type: 'password', required: true }),
        },
        handle: {
            submit: (form) => {
                setLoading(true);
                const { email, password } = form.values;

                authServices.loginWithPassword(email, password)
                    .then(() => { redirect(); })
                    .catch((e) => {
                        const { code } = e;

                        addAlert({
                            color: 'error',
                            message: FIREBASE[code] || 'Erro ao fazer login',
                            icon: <Icon name="error" />,
                        });

                        logger.info('Error on login:', { e });
                    })
                    .finally(() => { setLoading(false); });
            }
        }
    }, []);

    const toggleType = () => { setType(prev => prev === 'text' ? 'password' : 'text'); };

    const goToSignup = () => { navigate('/signup'); };

    const redirect = () => {
        const managerUrl = `${url.manager}?token=${authServices.access_token}&email=${formGroup.controls.email.value}`;

        logger.info('Redirecting to manager page:', managerUrl);

        window.open(managerUrl, '_self');
    };

    return (
        <Form formGroup={formGroup}>
            <Stack spacing="small">
                <Control
                    controlName="email"
                    field={(control) => <Input
                        fullWidth
                        gutterBottom
                        placeholder="Email"
                        data-cy="email-input"
                        value={control.value}
                        error={control.isInvalid}
                        helperText={control.messageError}
                    />}
                />
                <Control
                    controlName="password"
                    field={(control) => <Input
                        fullWidth
                        gutterBottom
                        type={type}
                        placeholder="Senha"
                        data-cy="password-input"
                        value={control.value}
                        error={control.isInvalid}
                        helperText={control.messageError}
                        endIcon={
                            <ButtonIcon type="button" onClick={toggleType}>
                                <Icon name={iconEye} />
                            </ButtonIcon>
                        }
                    />}
                />
                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    data-cy="signin-submit"
                    disabled={loading}
                    loading={loading && <Loading />}
                >
                    Entrar
                </Button>
                <Divider />
                <Stack orientation="row" justifyContent="center">
                    <Typography variant="body2" style={{ textAlign: 'center' }}>Não possui conta?</Typography>
                    <Button
                        noHover
                        size="small"
                        type="button"
                        variant="text"
                        data-cy="signup-button"
                        onClick={goToSignup}
                    >
                        Criar conta
                    </Button>
                </Stack>
            </Stack>
        </Form>
    );
}

export default function Signin() {
    return (
        <Slide enter direction="top">
            <Stack
                justifyContent="center"
                style={{ height: '100vh' }}
                sx={{ backgroundColor: ({ background }) => background.paper }}
            >
                <Container sm="100%" md={500} lg={500}>
                    <Box sx={{ mb: 2 }} textAlign="center">
                        <Logo
                            width={200}
                            color="primary.main"
                            style={{ margin: 'auto' }}
                        />
                    </Box>
                    <Card sx={{ backgroundColor: ({ background }) => background.default }}>
                        <CardContent>
                            <Typography variant="subtitle1" noMargin gutterBottom>Login</Typography>

                            <Stack spacing="small">
                                <EmailAndPasswordForm />
                            </Stack>
                        </CardContent>
                    </Card>
                    <Box>
                        <Typography
                            variant="body2"
                            color="primary.contrastText"
                            style={{ textAlign: 'center' }}
                        >
                            Minhas Finanças - Leonardo Gonçalves
                        </Typography>
                        <Typography
                            variant="body2"
                            color="primary.contrastText"
                            style={{ textAlign: 'center' }}
                        >
                            Versão: {release}
                        </Typography>
                    </Box>
                </Container>
            </Stack>
        </Slide>
    );
}