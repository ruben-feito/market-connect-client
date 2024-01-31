import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import {
  Building02,
  CheckCircleBroken,
  Clock,
  CreditCardCheck,
  CreditCardX,
  FlipBackward,
  HeartHand,
  Package,
  PackageCheck,
  PackageX,
  ReceiptCheck,
  ShoppingBag01,
  Truck01,
  XCircle,
  XClose,
} from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';

const statusMap = {
  pending: 'info',
  payment_failed: 'error',
  under_packaging: 'warning',
  packaged: 'info',
  customer_shipped: 'info',
  shop_shipped: 'info',
  shop_received: 'info',
  delivered: 'success',
  canceled: 'error',
  refund_request: 'warning',
  refunded: 'success',
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendiente', icon: <Clock /> };
    case 'payment_failed':
      return { label: 'Pago fallido', icon: <CreditCardX /> };
    case 'under_packaging':
      return { label: 'En preparación', icon: <ShoppingBag01 /> };
    case 'packaged':
      return { label: 'Preparado', icon: <Package /> };
    case 'customer_shipped':
      return { label: 'Enviado', icon: <Truck01 /> };
    case 'shop_shipped':
      return { label: 'En camino', icon: <Truck01 /> };
    case 'shop_received':
      return { label: 'En tienda', icon: <Building02 /> };
    case 'delivered':
      return { label: 'Entregado', icon: <PackageCheck /> };
    case 'canceled':
      return { label: 'Cancelado', icon: <PackageX /> };
    case 'refund_request':
      return { label: 'Devolución', icon: <FlipBackward /> };
    case 'refunded':
      return { label: 'Abonado', icon: <CreditCardCheck /> };
    default:
      return status;
  }
};

export const OrderListTable = (props) => {
  const {
    currentOrder,
    onOrderSelect,
    onPageChange,
    onPerPageChange,
    orders,
    ordersCount,
    page,
    perPage,
    loading,
    ...other
  } = props;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {/* <Scrollbar style={{ maxHeight: 'calc(100vh - 347px)' }}> */}
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox disabled />
              </TableCell>
              <TableCell>Pedido #</TableCell>
              <TableCell>ERP ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tienda</TableCell>
              {/* <TableCell>Facturar a</TableCell> */}
              <TableCell>Enviar a</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Merchant Reference</TableCell>
              {/* <TableCell>Mailchimp</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow hover key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={40}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={12}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                    }}
                  >
                    <Typography color="textPrimary" variant="body2">
                      No se encontraron pedidos que coincidan con los filtros
                      seleccionados, por favor intente nuevamente.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              orders.map((order) => {
                const isSelected = currentOrder?.id === order.id;
                const status = getStatusLabel(order.status.code);
                const statusColor = statusMap[order.status.code] || 'warning';

                return (
                  <TableRow
                    hover
                    key={order.id}
                    onClick={() => onOrderSelect?.(order.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} value={isSelected} />
                    </TableCell>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>
                      {order.manager_order_id || (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        placement="top"
                        title={format(
                          new Date(order.created_at),
                          'P HH:mm:ss',
                          {
                            locale: es,
                          },
                        )}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="body2" whiteSpace="nowrap">
                            {format(
                              new Date(order.created_at),
                              'dd MMMM, yyyy',
                              {
                                locale: es,
                              },
                            )}
                          </Typography>
                          <Typography variant="body2">
                            a las{' '}
                            {format(new Date(order.created_at), 'HH:mm', {
                              locale: es,
                            })}
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusColor}>
                        <SvgIcon
                          fontSize="small"
                          color="inherit"
                          sx={{ mr: 0.5 }}
                        >
                          {status.icon}
                        </SvgIcon>{' '}
                        {status.label}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {order.store ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">
                            {order.store.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.store.code.toUpperCase()}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.shipping_name ? (
                        `${order.shipping_name} ${
                          order.shipping_last_name || ''
                        }`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.customer?.name ? (
                        `${order.customer.name}${
                          order.customer?.last_name
                            ? ` ${order.customer.last_name}`
                            : ''
                        }`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.customer_is_guest ? (
                        <Typography color="text.secondary" variant="body2">
                          Invitado
                        </Typography>
                      ) : (
                        order.customer.group.name
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {order.lines.length === 0 && (
                        <Typography color="text.secondary" variant="caption">
                          Ninguno
                        </Typography>
                      )}
                      {order.lines.length > 0 && (
                        <AvatarGroup
                          max={3}
                          spacing="small"
                          total={order.lines.length}
                          variant="rounded"
                          component={({ children, ...rest }) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'start',
                              }}
                              {...rest}
                            >
                              {children}
                            </Box>
                          )}
                        >
                          {order.lines.slice(0, 3).map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                              }}
                            >
                              <Tooltip
                                arrow
                                title={item.product.name?.value}
                                placement="top"
                              >
                                <Box
                                  key={item.id}
                                  sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'neutral.50',
                                    backgroundImage: `url(${
                                      item.product.images.find(
                                        ({ tag }) => tag === 'PRINCIPAL',
                                      )?.url
                                    })`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    borderRadius: 1,
                                    display: 'flex',
                                    height: 40,
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    width: 40,
                                    border: '2px solid #fff',
                                    boxSizing: 'content-box',
                                    // marginLeft: '-8px',
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          ))}
                        </AvatarGroup>
                      )}
                    </TableCell>
                    <TableCell>
                      {numeral(order.grand_total).format('$0,0.00')}
                    </TableCell>
                    <TableCell>{order.payment_reference}</TableCell>
                    {/* <TableCell>
                      <Stack direction="column" alignItems="center" spacing={1}>
                        <SvgIcon fontSize="small" color="success">
                          <CheckCircleBroken />
                        </SvgIcon>
                        <Typography color="text.secondary" variant="caption">
                          Sincronizado
                        </Typography>
                      </Stack>
                    </TableCell> */}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={ordersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Pedidos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  );
};

OrderListTable.propTypes = {
  onOrderSelect: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  orders: PropTypes.array.isRequired,
  ordersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};
