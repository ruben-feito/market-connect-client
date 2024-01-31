import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  AvatarGroup,
  Box,
  Checkbox,
  Link,
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
import { format } from 'date-fns';
import { SeverityPill } from '../../components/severity-pill';
import {
  AnnotationQuestion,
  MessageChatSquare,
  MessageDotsSquare,
  MessageSquare01,
  Package,
} from '@untitled-ui/icons-react';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

const fillWithZeros = (number) => {
  // If number length is less than 9, fill with zeros
  return number.toString().padStart(9, '0');
};

const messageFrom = {
  auto: 'Automática',
  manager: 'Administrador',
  customer: 'Cliente',
};

const returnStatus = {
  approved: 'Aprobado',
  canceled: 'Cancelado',
  closed: 'Cerrado',
  issue_refund: 'Reembolso emitido',
  package_received: 'Paquete recibido',
  package_sent: 'Paquete enviado',
  pending_approval: 'Pendiente de aprobación',
};

const returnStatusColor = {
  approved: 'success',
  canceled: 'error',
  closed: 'success',
  issue_refund: 'success',
  package_received: 'success',
  package_sent: 'success',
  pending_approval: 'warning',
};

export const TaxFreeListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  requests,
  requestsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(requests);

  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const selectedAll = selected.length === requests.length;
  const selectedSome = selected.length > 0 && selected.length < requests.length;

  return (
    <div {...other}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Pedido</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Nombre y apellidos</TableCell>
              <TableCell>Pasaporte</TableCell>
              <TableCell>Dirección de facturación</TableCell>
              <TableCell>Fecha de creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  {Array.from(Array(6)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 1 && (
                        <Skeleton
                          variant="text"
                          width={100}
                          sx={{
                            marginTop: 1,
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(request.id)}
                      onChange={(event) => {
                        const { checked } = event.target;

                        if (checked) {
                          selectOne(request.id);
                        } else {
                          deselectOne(request.id);
                        }
                      }}
                      value={selected.includes(request.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <SvgIcon color="action" fontSize="small">
                        <Package />
                      </SvgIcon>
                      <Link
                        color="primary"
                        component={NextLink}
                        href={`/orders/${request.id}`}
                      >
                        {request.order_number}
                      </Link>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Link
                        color="inherit"
                        component={NextLink}
                        href={`/customers/${request.customer.id}`}
                        variant="subtitle2"
                      >
                        {request.customer.name} {request.customer.last_name}
                      </Link>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: '0 !important' }}
                      >
                        {request.customer.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{request.tax_free_name}</TableCell>
                  <TableCell>{request.passport}</TableCell>
                  <TableCell>{request.tax_free_billing_address}</TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={requestsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Solicitudes por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};
