import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Columns03 } from '@untitled-ui/icons-react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Container, Stack } from '@mui/system';
import {
  Typography,
  Link,
  Breadcrumbs,
  Button,
  SvgIcon,
  Divider,
  Card,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { MultiSelect } from '../../components/multi-select';
import { jobsOfferAPI } from '../../api/jobs-offers';
import { JobOffersCreateModal } from '../../sections/rrhh/job-offers-create-modal';
import { JobOffersListTable } from '../../sections/rrhh/job-offers-list-table';
import { paths } from '../../paths';
import { useLocalStorage } from '../../hooks/use-local-storage';

const useJobOffers = () => {
  const [state, setState] = useState({
    jobOffers: [],
    loadingOffers: true,
  });

  const getJobOffers = useCallback(async () => {
    try {
      setState((previousState) => ({
        ...previousState,
        loadingOffers: true,
      }));

      const res = await jobsOfferAPI.getJobOffers();

      setState({
        jobOffers: res,
        loadingOffers: false,
      });
    } catch (error) {
      console.log(error);
      setState((previousState) => ({
        ...previousState,
        loadingOffers: false,
      }));
    }
  }, []);

  useEffect(() => {
    getJobOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteJobOffer = async (id) => {
    try {
      await jobsOfferAPI.deleteJobOffer(id);
      getJobOffers();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    ...state,
    deleteJobOffer,
  };
};

const columnOptions = [
  {
    id: 1,
    label: 'Nombre',
    value: 'position_name',
    align: 'center',
  },
  {
    id: 2,
    label: 'Tienda',
    value: 'store',
    align: 'center',
  },
  {
    id: 3,
    label: 'País',
    value: 'country',
    align: 'center',
  },
  {
    id: 4,
    label: 'Idioma',
    value: 'languages_id',
    align: 'center',
  },
  {
    id: 5,
    label: 'Visibilidad',
    value: 'visibility',
    align: 'center',
  },
];

const Page = () => {
  const { jobOffers, loadingOffers, deleteJobOffer } = useJobOffers();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [columns, setColumns] = useLocalStorage(
    'jobOffersListColumns',
    columnOptions.map((col) => col.value),
  );

  return (
    <>
      <Head>
        <title>RRHH | PACOMARTINEZ</title>
      </Head>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Ofertas de Empleo</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.index}
                    variant="subtitle2"
                  >
                    Inicio
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Ofertas de Empleo
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <MultiSelect
                  label="Columnas"
                  options={columnOptions}
                  value={columns}
                  onChange={setColumns}
                  color="black"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Columns03 />
                    </SvgIcon>
                  }
                  variant="text"
                />
                <Button
                  onClick={() => setOpenCreateModal(true)}
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Crear oferta
                </Button>
                <JobOffersCreateModal
                  open={openCreateModal}
                  onClose={() => setOpenCreateModal(false)}
                />
              </Stack>
            </Stack>

            <Divider />
            <Card>
              <JobOffersListTable
                jobOffers={jobOffers}
                columns={columns}
                loadingOffers={loadingOffers}
                deleteJobOffer={deleteJobOffer}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
