import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Columns03, FilterFunnel01 } from '@untitled-ui/icons-react';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { MultiSelect } from '../../components/multi-select';
import { paths } from '../../paths';
import { usePageView } from '../../hooks/use-page-view';
import { ordersApi } from '../../api/orders';
import { TaxFreeListTable } from '../../sections/tax-free/tax-free-list-table';

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      orderId: undefined,
      customerId: undefined,
      status: undefined,
      reason: undefined,
      packageStatus: undefined,
    },
    page: 0,
    perPage: 25,
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useTaxFreeRequests = (search) => {
  const [state, setState] = useState({
    requests: [],
    requestsCount: 0,
    loading: true,
  });

  const getRequests = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await ordersApi.getTaxFreeRequests(request);
      setState({
        requests: response.data,
        requestsCount: response.total,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    getRequests(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const TaxFreeRequestsList = () => {
  const { search, updateSearch } = useSearch();
  const { requests, requestsCount, loading } = useTaxFreeRequests(search);

  usePageView();

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch],
  );

  const handlePerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        perPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch],
  );

  return (
    <>
      <Head>
        <title>Solicitudes TAX FREE | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">
                  Pedidos libres de impuestos
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
                    href={paths.orders.index}
                    variant="subtitle2"
                  >
                    Pedidos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Tax free
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <TaxFreeListTable
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                requests={requests}
                requestsCount={requestsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

TaxFreeRequestsList.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default TaxFreeRequestsList;
