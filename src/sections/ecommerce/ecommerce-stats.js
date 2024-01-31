import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Skeleton,
  Tooltip,
} from '@mui/material';
import numeral from 'numeral';
import PropTypes from 'prop-types';

export const EcommerceStats = ({
  loading = false,
  sales,
  revenue,
  saleUnits,
}) => {
  const formattedSales = numeral(sales).format('$0,0.00a');
  const formattedRevenue = numeral(revenue).format('$0,0.00a');
  const formattedSaleUnits = numeral(saleUnits).format('0,0.00a');

  return (
    <Card>
      <Grid
        container
        sx={{
          '& > *:not(:last-of-type)': {
            borderRight: (theme) => ({
              md: `1px solid ${theme.palette.divider}`,
            }),
            borderBottom: (theme) => ({
              xs: `1px solid ${theme.palette.divider}`,
              md: 'none',
            }),
          },
        }}
      >
        <Grid xs={12} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography color="text.secondary" variant="overline">
              Ventas
            </Typography>
            {loading ? (
              <Skeleton width="50%" />
            ) : (
              <Tooltip title={numeral(sales).format('$0,0.00')}>
                <Typography variant="h5">{formattedSales}</Typography>
              </Tooltip>
            )}
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography color="text.secondary" variant="overline">
              Unidades vendidas
            </Typography>
            {loading ? (
              <Skeleton width="50%" />
            ) : (
              <Tooltip title={parseInt(saleUnits, 10).toLocaleString('es-ES')}>
                <Typography variant="h5">{formattedSaleUnits}</Typography>
              </Tooltip>
            )}
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Typography color="text.secondary" variant="overline">
              Gananacias
            </Typography>
            {loading ? (
              <Skeleton width="50%" />
            ) : (
              <Tooltip title={numeral(revenue).format('$0,0.00')}>
                <Typography variant="h5">{formattedRevenue}</Typography>
              </Tooltip>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

EcommerceStats.propTypes = {
  loading: PropTypes.bool,
  sales: PropTypes.number,
  revenue: PropTypes.number,
  saleUnits: PropTypes.number,
};
