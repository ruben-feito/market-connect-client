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
import { CartListTable } from '../../sections/cart/cart-list-table';
import { cartsApi } from '../../api/carts';
import { usePageView } from '../../hooks/use-page-view';

const columnOptions = [
  {
    label: 'ID',
    value: 'id',
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

const useCarts = (search) => {
  const [state, setState] = useState({
    carts: [],
    cartsCount: 0,
    loading: true,
  });

  const getCarts = useCallback(async (request) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await cartsApi.getCarts(request);
      setState({
        carts: response.data,
        cartsCount: response.total,
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
    getCarts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const CartsList = () => {
  const { search, updateSearch } = useSearch();
  const { carts, cartsCount, loading } = useCarts(search);
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
        <title>Carritos abandonados | Sitelicon - MiddleWare</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Carritos abandonados</Typography>
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
                    href={paths.carts.index}
                    variant="subtitle2"
                  >
                    Carritos abandonados
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
            <Divider />
            <Card>
              <CartListTable
                columns={columns}
                loading={loading}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                page={search.page}
                carts={carts}
                cartsCount={cartsCount}
                perPage={search.perPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CartsList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CartsList;
