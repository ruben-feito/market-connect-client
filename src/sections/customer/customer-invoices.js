import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Card,
  CardHeader,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { MoreMenu } from '../../components/more-menu';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { paths } from '../../paths';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';

export const CustomerInvoices = (props) => {
  const { invoices = [], ...other } = props;

  return (
    <Card {...other}>
      <CardHeader action={<MoreMenu />} title="Facturas recientes" />
      <Scrollbar>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => {
              const issueDate = format(invoice.issueDate, 'MMM dd,yyyy', {
                locale: es,
              });
              const statusColor =
                invoice.status === 'paid' ? 'success' : 'error';

              return (
                <TableRow key={invoice.id}>
                  <TableCell>#{invoice.id}</TableCell>
                  <TableCell>{issueDate}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <SeverityPill color={statusColor}>
                      {invoice.status}
                    </SeverityPill>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={NextLink}
                      href={paths.invoices.details}
                    >
                      <SvgIcon>
                        <ArrowRightIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={invoices.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Card>
  );
};

CustomerInvoices.propTypes = {
  invoices: PropTypes.array,
};
