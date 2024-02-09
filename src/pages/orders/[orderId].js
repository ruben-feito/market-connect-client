import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import { ordersApi } from '../../api/orders';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { OrderItems } from '../../sections/order/order-items';
import { OrderLogs } from '../../sections/order/order-logs';
import { OrderSummary } from '../../sections/order/order-summary';
import {
  DotsHorizontal,
  Download02,
  Mail01,
  RefreshCcw02,
} from '@untitled-ui/icons-react';
import { toast } from 'react-hot-toast';
import { OrderExpeditions } from '../../sections/order/order-expeditions';

const useOrder = (orderId) => {
  const isMounted = useMounted();
  const [order, setOrder] = useState(null);

  const getOrder = useCallback(
    async (id) => {
      try {
        const response = await ordersApi.getOrder(id);

        if (isMounted()) {
          setOrder(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getOrder(orderId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId],
  );

  return { order, refetch: () => getOrder(orderId) };
};

const Page = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { order, refetch } = useOrder(orderId);
  const [mailAnchorEl, setMailAnchorEl] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [syncronizing, setSyncronizing] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const openMailMenu = useMemo(() => Boolean(mailAnchorEl), [mailAnchorEl]);

  const getOrderInfo = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setLoadingInvoice(true);
        const response = await ordersApi.getOrderInvoice(order.id);
        const blob = new Blob([Buffer.from(response.data, 'base64')], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `INVOICE-${order.order_number}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Factura descargada');
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo descargar la factura: ${error.message}`);
      } finally {
        setLoadingInvoice(false);
      }
    },
    [order],
  );

  const syncOrder = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setSyncronizing(true);
        await ordersApi.syncOrder(order.id);
        toast.success('ERP ID sincronizado con ICG');
        refetch();
      } catch (error) {
        console.error(error);
        toast.error(`No se pudo obtener el ERP ID: ${error.message}`);
      } finally {
        setSyncronizing(false);
      }
    },
    [order, refetch],
  );

  const sendConfirmationEmail = useCallback(
    async (event) => {
      event.preventDefault();
      if ([1, 2, 9].includes(order.order_status_id)) {
        toast.error(
          'No se puede enviar el email de confirmación con el pedido en el estado actual',
        );
        return;
      }
      if (
        window.confirm(
          '¿Estás seguro de que quieres reenviar el email de confirmación? Le llegará al cliente un email con el pedido y los datos de envío.',
        ) === false
      ) {
        return;
      }
      try {
        setSendingEmail(true);
        await ordersApi.sendConfirmationEmail(order.id);
        toast.success('Email de confirmación enviado');
      } catch (error) {
        console.error(error);
        toast.error(
          `No se pudo enviar el email de confirmación: ${error.message}`,
        );
      } finally {
        setSendingEmail(false);
      }
    },
    [order],
  );

  const sendPickupShippedEmail = useCallback(
    async (event) => {
      event.preventDefault();
      if ([1, 2, 9].includes(order.order_status_id)) {
        toast.error(
          'No se puede enviar el email de en camino a tienda con el pedido en el estado actual',
        );
        return;
      }

      if (
        window.confirm(
          '¿Estás seguro de que quieres reenviar el email de pedido en camino a tienda? Le llegará al cliente un email con el pedido y los datos de envío.',
        ) === false
      ) {
        return;
      }

      try {
        setSendingEmail(true);
        await ordersApi.sendPickupShippedEmail(order.id);
        toast.success('Email de pedido en camino a tienda enviado');
      } catch (error) {
        console.error(error);
        toast.error(
          `No se pudo enviar el email de pedido en camino a tienda: ${error.message}`,
        );
      } finally {
        setSendingEmail(false);
      }
    },
    [order],
  );

  const sendPickupDeliveredEmail = useCallback(
    async (event) => {
      event.preventDefault();
      if ([1, 2, 9].includes(order.order_status_id)) {
        toast.error(
          'No se puede enviar el email de recibido en tienda con el pedido en el estado actual',
        );
        return;
      }

      if (
        window.confirm(
          '¿Estás seguro de que quieres reenviar el email de pedido recibido en tienda? Le llegará al cliente un email con el pedido y los datos de envío.',
        ) === false
      ) {
        return;
      }

      try {
        setSendingEmail(true);
        await ordersApi.sendPickupDeliveredEmail(order.id);
        toast.success('Email de pedido recibido en tienda enviado');
      } catch (error) {
        console.error(error);
        toast.error(
          `No se pudo enviar el email de pedido recibido en tienda: ${error.message}`,
        );
      } finally {
        setSendingEmail(false);
      }
    },
    [order],
  );

  // const sendShippedEmail = useCallback(
  //   async (event) => {
  //     event.preventDefault();
  //     try {
  //       setSendingEmail(true);
  //       await ordersApi.sendShippedEmail(order.id);
  //       toast.success('Email de envío enviado');
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(`No se pudo enviar el email de envío: ${error.message}`);
  //     } finally {
  //       setSendingEmail(false);
  //     }
  //   },
  //   [order],
  // );

  usePageView();

  if (!order) {
    return null;
  }

  const createdAt = format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

  return (
    <>
      <Head>
        <title>Pedido # {order.order_number} | Sitelicon - MiddleWare</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.orders.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Pedidos</Typography>
              </Link>
            </div>
            <div>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Pedido # {order.order_number}
                  </Typography>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Typography color="text.secondary" variant="body2">
                      Realizado el
                    </Typography>
                    <SvgIcon color="action">
                      <CalendarIcon />
                    </SvgIcon>
                    <Typography variant="body2">{createdAt}</Typography>
                  </Stack>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Tooltip
                    arrow
                    placement="top"
                    title={
                      order?.order_status_id < 3
                        ? 'No se puede descargar la factura hasta que el pedido esté en estado "En preparación"'
                        : ''
                    }
                  >
                    <span>
                      <Button
                        variant="contained"
                        startIcon={
                          <SvgIcon fontSize="small">
                            <Download02 />
                          </SvgIcon>
                        }
                        onClick={getOrderInfo}
                        disabled={
                          loadingInvoice || !order || order?.order_status_id < 3
                        }
                      >
                        {loadingInvoice
                          ? 'Descargando factura…'
                          : 'Descargar factura'}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <RefreshCcw02 />
                      </SvgIcon>
                    }
                    onClick={syncOrder}
                    disabled={syncronizing}
                  >
                    {syncronizing ? 'Sincronizando…' : 'Sincronizar ERP ID'}
                  </Button>
                  <IconButton
                    variant="outlined"
                    startIcon={<SvgIcon fontSize="small"></SvgIcon>}
                    onClick={(event) => setMailAnchorEl(event.currentTarget)}
                    disabled={sendingEmail}
                  >
                    <SvgIcon fontSize="small">
                      <DotsHorizontal />
                    </SvgIcon>
                  </IconButton>
                  <Menu
                    anchorEl={mailAnchorEl}
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'bottom',
                    }}
                    getContentAnchorEl={null}
                    onClose={() => setMailAnchorEl(null)}
                    open={openMailMenu}
                    PaperProps={{
                      sx: { width: 240 },
                    }}
                  >
                    <MenuItem
                      onClick={sendConfirmationEmail}
                      disabled={sendingEmail}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SvgIcon color="action" fontSize="small" sx={{ mr: 1 }}>
                          <Mail01 />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          sx={{
                            // Wrap text
                            whiteSpace: 'normal',
                          }}
                        >
                          Reenviar email de confirmación de pedido
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem
                      onClick={sendPickupShippedEmail}
                      disabled={sendingEmail}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SvgIcon color="action" fontSize="small" sx={{ mr: 1 }}>
                          <Mail01 />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          sx={{
                            // Wrap text
                            whiteSpace: 'normal',
                          }}
                        >
                          Reenviar email de pedido en camino a tienda
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem
                      onClick={sendPickupDeliveredEmail}
                      disabled={sendingEmail}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SvgIcon color="action" fontSize="small" sx={{ mr: 1 }}>
                          <Mail01 />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          sx={{
                            // Wrap text
                            whiteSpace: 'normal',
                          }}
                        >
                          Reenviar email de pedido recibido en tienda
                        </Typography>
                      </Stack>
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>
            </div>
            <OrderSummary order={order} refetch={refetch} />
            <OrderExpeditions order={order} />
            <OrderItems order={order} />
            <OrderLogs logs={order.history || []} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
