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
import { ReturnListTable } from '../../sections/return/return-list-table';
import { returnsApi } from '../../api/returns';
import { usePageView } from '../../hooks/use-page-view';
import { ReturnListSearch } from '../../sections/return/return-list-search';

const columnOptions = [
  {
    label: 'Solicitud',
    value: 'id',
  },
  {
    label: 'Pedido',
    value: 'orderId',
  },
  {
    label: 'Cliente',
    value: 'customer',
  },
  {
    label: 'Productos',
    value: 'products',
  },
  {
    label: 'Última respuesta',
    value: 'lastResponse',
  },
  {
    label: 'Resolución',
    value: 'status',
  },
  {
    label: 'Tienda',
    value: 'store',
  },
  {
    label: 'Última actualización',
    value: 'updatedAt',
  },
  {
    label: 'Fecha de creación',
    value: 'createdAt',
  },
  {
    label: 'Acciones',
    value: 'actions',
  },
];

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      orderId: undefined,
      customerId: undefined,
      status: undefined,
      reason: undefined,
      createdAt: undefined,
      storeId: undefined,
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

const useReturns = (search) => {
  const [state, setState] = useState({
    returns: [],
    returnsCount: 0,
    loading: true,
  });

  const getReturns = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await returnsApi.getReturns(request);
      setState({
        returns: response.data,
        returnsCount: response.total,
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
    getReturns(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const ReturnsList = () => {
  const { search, updateSearch } = useSearch();
  const { returns, returnsCount, loading } = useReturns(search);
  const [columns, setColumns] = useState(
    columnOptions.map((column) => column.value),
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
        <title>Solicitudes RMA | Sitelicon - MiddleWare</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Solicitudes de devolución</Typography>
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
                    href={paths.returns.index}
                    variant="subtitle2"
                  >
                    Devoluciones
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="black"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <FilterFunnel01 />
                    </SvgIcon>
                  }
                  variant="text"
                  onClick={() => setIsFiltersOpen((prevState) => !prevState)}
                >
                  Filtros
                </Button>
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
              </Stack>
            </Stack>
            <ReturnListSearch open={isFiltersOpen} />
            <Card>
              <ReturnListTable
                columns={columns}
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                returns={returns}
                returnsCount={returnsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ReturnsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReturnsList;
