import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { returnsApi } from '../../api/returns';
import {
  ArrowLeft,
  Calendar,
  LinkBroken01,
  LinkBroken02,
  Package,
} from '@untitled-ui/icons-react';
import { paths } from '../../paths';
import { usePageView } from '../../hooks/use-page-view';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { order } from '../../api/orders/data';
import { SeverityPill } from '../../components/severity-pill';
import { Scrollbar } from '../../components/scrollbar';
import { ChatMessage } from '../../sections/chat/chat-message';
import { ChatMessageAdd } from '../../sections/chat/chat-message-add';
import { ReturnLines } from '../../sections/return/return-lines';
import { ReturnMessages } from '../../sections/return/return-messages';
import { ReturnSummary } from '../../sections/return/return-summary';

const useReturn = (returnId) => {
  const [state, setState] = useState({
    orderReturn: null,
    loading: true,
  });

  const getReturn = useCallback(async (id) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const response = await returnsApi.getReturn(id);

      setState({
        orderReturn: response,
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

  const handleApprove = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const response = await returnsApi.approveReturn(returnId);

      setState({
        orderReturn: response,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [returnId]);

  const handleUpdateReturn = async (request) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const response = await returnsApi.updateReturn(returnId, request);

      setState({
        orderReturn: response,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (returnId) {
      getReturn(returnId);
    }
  }, [returnId, getReturn]);

  return {
    ...state,
    getReturn,
    handleApprove,
    handleUpdateReturn,
  };
};

const Page = () => {
  const router = useRouter();
  const { returnId } = router.query;
  const { orderReturn, loading, getReturn, handleApprove } =
    useReturn(returnId);
  const optionsAvailable = useMemo(() => {
    return (
      orderReturn?.status === 'pending_approval' ||
      (orderReturn?.status !== 'approved' &&
        orderReturn?.status !== 'pending_approval')
    );
  }, [orderReturn?.status]);

  usePageView();

  if (loading) {
    return null;
  }

  if (!orderReturn) {
    return (
      <>
        <Head>
          <title>RMA no encontrada</title>
        </Head>
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              <Typography variant="h4">RMA no encontrada</Typography>
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  const createdAt = format(
    new Date(orderReturn.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  return (
    <>
      <Head>
        <title>RMA # {orderReturn.id} | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.returns.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeft />
                </SvgIcon>
                <Typography variant="subtitle2">Devoluciones</Typography>
              </Link>
            </div>
            <div>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    Solicitud de devolución # {orderReturn.id}
                  </Typography>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Typography color="text.secondary" variant="body2">
                      Para el pedido
                    </Typography>
                    <SvgIcon color="action">
                      <Package />
                    </SvgIcon>
                    <Link
                      variant="body2"
                      href={`/orders/${orderReturn.order.id}`}
                    >
                      {orderReturn.order.order_number}
                    </Link>
                    <Typography color="text.secondary" variant="body2">
                      , el
                    </Typography>
                    <SvgIcon color="action">
                      <Calendar />
                    </SvgIcon>
                    <Typography color="text.secondary" variant="body2">
                      {createdAt}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={1}>
                  {optionsAvailable && (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleApprove}
                    >
                      Aprobar solicitud
                    </Button>
                  )}
                </Stack>
              </Stack>
            </div>
            <ReturnSummary orderReturn={orderReturn} />
            <ReturnLines orderReturn={orderReturn} />
            <ReturnMessages
              orderReturn={orderReturn}
              refetch={() => {
                getReturn();
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
