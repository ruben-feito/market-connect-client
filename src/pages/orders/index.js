import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useDebounce } from '@uidotdev/usehooks';
import { CSVLink } from 'react-csv';
import numeral from 'numeral';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ordersApi } from '../../api/orders';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { OrderDrawer } from '../../sections/order/order-drawer';
import { OrderListContainer } from '../../sections/order/order-list-container';
import { OrderListSearch } from '../../sections/order/order-list-search';
import { OrderListTable } from '../../sections/order/order-list-table';
import { OrderChart } from '../../sections/order/order-chart';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { Download02, FilterFunnel01 } from '@untitled-ui/icons-react';
import { OrderStats } from '../../sections/order/order-stats';
import toast from 'react-hot-toast';

const formatDate = (date) => format(date, 'dd/MM/yyyy', { locale: es });

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      search: undefined,
      statusId: undefined,
      storeId: undefined,
      erpId: undefined,
      customerId: undefined,
      groupId: undefined,
      paymentMethodId: undefined,
      email: undefined,
      pickupStoreId: undefined,
      name: undefined,
      shipmentType: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    },
    page: 0,
    perPage: 25,
    sortBy: 'created_at',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useOrders = (search) => {
  const [state, setState] = useState({
    orders: [],
    ordersCount: 0,
    loading: true,
  });

  const getOrders = useCallback(async (request) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await ordersApi.getOrders(request);
      setState({
        orders: response.data,
        ordersCount: response.total,
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
    getOrders(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return state;
};

const Page = () => {
  const rootRef = useRef(null);
  const csvLinkRef = useRef(null);
  const { search, updateSearch } = useSearch();
  const debouncedSearch = useDebounce(search, 300);
  const { orders, ordersCount, loading } = useOrders(debouncedSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportOrders, setExportOrders] = useState([]);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentOrder = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }

    return orders.find((order) => order.id === drawer.data);
  }, [drawer, orders]);

  usePageView();

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
        page: 0,
      }));
    },
    [updateSearch],
  );

  const handleSortChange = useCallback(
    (sortDir) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortDir,
        page: 0,
      }));
    },
    [updateSearch],
  );

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

  const handleOrderOpen = useCallback(
    (orderId) => {
      // Close drawer if is the same order

      if (drawer.isOpen && drawer.data === orderId) {
        setDrawer({
          isOpen: false,
          data: undefined,
        });
        return;
      }

      setDrawer({
        isOpen: true,
        data: orderId,
      });
    },
    [drawer],
  );

  const handleOrderClose = useCallback(() => {
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, []);

  const handleEsc = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        handleOrderClose();
      }
    },
    [handleOrderClose],
  );

  useEffect(() => {
    if (drawer.isOpen) {
      // Add listener to ESC key to close drawer
      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [drawer.isOpen, handleEsc]);

  const handleCSVExport = useCallback(
    async (event) => {
      try {
        setDownloading(true);
        const response = await ordersApi.getOrders({
          ...search,
          page: 0,
          perPage: ordersCount,
        });
        setExportOrders(response.data);
        setDownloading(false);
        // csvLinkRef.current.link.click();
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo exportar los pedidos: ${error.message}`);
        setDownloading(false);
      }
    },
    [ordersCount, search],
  );

  useEffect(() => {
    if (!downloading && csvLinkRef.current && exportOrders.length > 0) {
      csvLinkRef.current.link.click();
    }
  }, [exportOrders, downloading]);

  return (
    <>
      <Head>
        <title>Pedidos | Sitelicon - MiddleWare</title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <OrderListContainer open={drawer.isOpen}>
            {/* <OrderChart
              chartSeries={[
                {
                  name: 'Periodo actual',
                  data: [
                    3350, 1840, 2254, 5780, 9349, 5241, 2770, 2051, 3764, 2385,
                    5912, 8323,
                  ],
                },
                {
                  name: 'Periodo anterior',
                  data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
                },
              ]}
            /> */}
            {/* <OrderStats totalOrders={ordersCount} newOrders={74} refunds={1} />
            <Divider /> */}
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="end"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h5">Listado de pedidos</Typography>
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
                      Listado
                    </Typography>
                  </Breadcrumbs>
                </Stack>
                <Stack direction="row" spacing={1}>
                  {orders.length > 0 && (
                    <>
                      <Button
                        size="small"
                        color="black"
                        variant="text"
                        startIcon={
                          <SvgIcon>
                            <Download02 />
                          </SvgIcon>
                        }
                        onClick={handleCSVExport}
                        disabled={downloading}
                      >
                        {downloading
                          ? 'Exportando pedidos…'
                          : 'Exportar pedidos'}
                      </Button>
                      <CSVLink
                        ref={csvLinkRef}
                        data={exportOrders.map((order) => ({
                          ...order,
                          created_at: format(
                            new Date(order.created_at),
                            'MMM d, yyyy hh:mm:ss a',
                            {
                              locale: es,
                            },
                          ),
                          status: order.status.name,
                          customer: `${order.customer_firstname}${
                            order.customer_lastname
                              ? ` ${order.customer_lastname}`
                              : ''
                          }`,
                          grand_total: numeral(order.grand_total).format(
                            '$0,0.00',
                          ),
                          subtotal: numeral(order.subtotal).format('0,0.00'),
                          amount: numeral(order.subtotal).format('0,0.00'),
                          amount_to_invoice: numeral(
                            order.subtotal * 0.1,
                          ).format('0,0.00'),
                          shipping_type:
                            order.shipping_type === 'pickup'
                              ? `Recogida en tienda - ${order.shipping_name.replace(
                                  /Sitelicon - MiddleWare - /g,
                                  '',
                                )}`
                              : 'A domicilio',
                        }))}
                        asyncOnClick={true}
                        headers={[
                          { label: 'Num. de pedido', key: 'order_number' },
                          { label: 'Comprado el', key: 'created_at' },
                          { label: 'Enviar a nombre', key: 'customer' },
                          { label: 'Total (comprado)', key: 'grand_total' },
                          { label: 'Estado', key: 'status' },
                          { label: 'Métodos de envío', key: 'shipping_type' },
                          { label: 'SIN IVA', key: 'subtotal' },
                          { label: 'EN VALOR', key: 'amount' },
                          {
                            label: 'IMPORTE A FACTURAR',
                            key: 'amount_to_invoice',
                          },
                        ]}
                        filename={`pedidos-paco-martinez.csv`}
                      />
                    </>
                  )}
                  <Button
                    color={filtersOpen ? 'primary' : 'black'}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <FilterFunnel01 />
                      </SvgIcon>
                    }
                    variant="text"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                  >
                    Filtros
                  </Button>
                </Stack>
              </Stack>
            </Box>
            <Divider />
            <OrderListSearch
              open={filtersOpen}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              initialFilters={search.filters}
              sortBy={search.sortBy}
              sortDir={search.sortDir}
              totalItems={ordersCount}
              loading={loading}
            />
            <Divider />
            <OrderListTable
              currentOrder={currentOrder}
              onOrderSelect={handleOrderOpen}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              orders={orders}
              ordersCount={ordersCount}
              page={search.page}
              perPage={search.perPage}
              loading={loading}
            />
          </OrderListContainer>
          <OrderDrawer
            container={rootRef.current}
            onClose={handleOrderClose}
            open={drawer.isOpen}
            order={currentOrder}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
