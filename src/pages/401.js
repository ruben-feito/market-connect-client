import NextLink from 'next/link';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePageView } from '../hooks/use-page-view';
import { paths } from '../paths';

const Page = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  usePageView();

  return (
    <>
      <Head>
        <title>Error: Autorización requerida | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6,
            }}
          >
            <Box
              alt="No autorizado"
              component="img"
              src="/assets/errors/error-401.png"
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 200,
              }}
            />
          </Box>
          <Typography align="center" variant={mdUp ? 'h1' : 'h4'}>
            401
          </Typography>
          <Typography align="center" variant={mdUp ? 'h3' : 'h5'}>
            Autorización requerida
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
            Has intentado acceder a una página que requiere autorización para su
            visualización.
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
            Solicita acceso a tu administrador.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Button component={NextLink} href={paths.index}>
              Volver a la página de inicio
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
