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
        <title>Error: Página no encontrada | PACOMARTINEZ</title>
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
              alt="Página no encontrada"
              component="img"
              src="/assets/errors/error-404.png"
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 200,
              }}
            />
          </Box>
          <Typography align="center" variant={mdUp ? 'h1' : 'h4'}>
            404
          </Typography>
          <Typography align="center" variant={mdUp ? 'h3' : 'h5'}>
            La página que buscas no existe
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
            Has probado alguna ruta sospechosa, has llegado aquí por error o la
            página se encuentra en desarrollo.
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
            Sea lo que sea, intenta usar la navegación.
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
