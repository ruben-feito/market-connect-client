import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SeverityPill } from '../../components/severity-pill';
import { Clock, PackageCheck } from '@untitled-ui/icons-react';

export const OrderExpeditions = ({ order, ...other }) => {
  return (
    <Card {...other}>
      <CardHeader title="Expediciones" />
      <CardContent sx={{ pt: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Paquetes</TableCell>
              <TableCell>Incidencia</TableCell>
              <TableCell>Fecha entrega</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell>Fecha actualización</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.expeditions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay expediciones para este pedido
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {order.expeditions.map((expedition) => (
              <TableRow key={expedition.id}>
                <TableCell>{expedition.expedition_number}</TableCell>
                <TableCell>
                  <SeverityPill
                    color={
                      expedition.state === 'ENTREGADO' ? 'success' : 'info'
                    }
                  >
                    <SvgIcon fontSize="small" color="inherit" sx={{ mr: 0.5 }}>
                      {expedition.state === 'ENTREGADO' ? (
                        <PackageCheck />
                      ) : (
                        <Clock />
                      )}
                    </SvgIcon>
                    {expedition.state}
                  </SeverityPill>
                </TableCell>
                <TableCell align="center">
                  {parseInt(expedition.packages, 10)}
                </TableCell>
                <TableCell>
                  {expedition.incidence === 'SIN INCIDENCIA' ? (
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      fontStyle="italic"
                    >
                      {expedition.incidence}
                    </Typography>
                  ) : (
                    <Typography color="error" variant="caption">
                      {expedition.incidence}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(expedition.delivered_at),
                    'dd/MM/yyyy HH:mm',
                    { locale: es },
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(expedition.created_at), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(expedition.updated_at), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

OrderExpeditions.propTypes = {
  order: PropTypes.object.isRequired,
};
