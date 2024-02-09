import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../../components/breadcrumbs-separator';
import { JobDemandProfile } from '../../../sections/rrhh/job-demand-profile';
import { paths } from '../../../paths';
import { jobDemandsAPI } from '../../../api/job-demands';

const useDemand = (jobDemandId) => {
  const [state, setState] = useState({
    candidate: null,
    loading: true,
    error: null,
  });

  const getDemand = async () => {
    try {
      const response = await jobDemandsAPI.getDemand(jobDemandId);

      setState((prevState) => ({
        ...prevState,
        candidate: response,
        loading: false,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    getDemand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDemandId]);

  return {
    candidate: state.candidate,
    loading: state.loading,
    error: state.error,
  };
};

const Page = () => {
  const router = useRouter();
  const { jobDemandId, jobOfferId } = router.query;
  const { candidate, loading, error } = useDemand(jobDemandId);
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Hubo un error</div>;
  }

  if (!candidate && !loading) {
    return <div>No se encontró el candidato</div>;
  }

  return (
    <>
      <Head>
        <title>
          {`Candidato: ${candidate?.demand_name} ${candidate?.demand_surname} | Sitelicon - MiddleWare}`}
        </title>
      </Head>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ pr: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: 'transparent',
                      borderRadius: 1,
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      height: 100,
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 70 }} />
                  </Box>
                </Box>
                <Stack spacing={1}>
                  <Typography variant="h5">
                    {candidate?.demand_name} {candidate?.demand_surname}
                  </Typography>
                  <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.index}
                      variant="subtitle2"
                    >
                      Inicio
                    </Link>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={paths.rrhh.index}
                      variant="subtitle2"
                    >
                      Ofertas de Empleo
                    </Link>
                    <Link
                      color="text.primary"
                      component={NextLink}
                      href={`/rrhh/${jobOfferId}`}
                      variant="subtitle2"
                    >
                      Gestionar oferta de empleo
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Candidato: {candidate?.demand_name}{' '}
                      {candidate?.demand_surname}
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
            </Stack>
            <JobDemandProfile candidate={candidate} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
