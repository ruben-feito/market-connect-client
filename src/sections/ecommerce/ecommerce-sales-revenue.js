import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import moment from 'moment';
import { Box, Card, CardContent, CardHeader, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../components/chart';
import { reportsApi } from '../../api/reports';
import numeral from 'numeral';

const now = new Date();

const createCategories = () => {
  const categories = [];

  for (let i = 6; i >= 0; i--) {
    categories.push(format(subDays(now, i), 'dd MMM', { locale: es }));
  }

  return categories;
};

const useChartOptions = (sales) => {
  const theme = useTheme();
  // const categories = createCategories();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.success.light],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90],
      },
      type: 'gradient',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.secondary,
      },
      position: 'top',
      show: true,
    },
    markers: {
      hover: {
        size: undefined,
        sizeOffset: 2,
      },
      radius: 2,
      shape: 'circle',
      size: 4,
      strokeWidth: 2,
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 4],
      lineCap: 'butt',
      width: 3,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: sales.map((sale) =>
        format(new Date(sale.interval), 'dd MMM'),
      ),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: [
      {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: (value) => value,
        },
      },
      {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: (value) => numeral(value).format('$0,0.00'),
        },
      },
    ],
  };
};

const useReport = (storeId) => {
  const [state, setState] = useState({
    loading: true,
    sales: [],
  });

  const getReport = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await reportsApi.getSalesReport({
        dateField: 'created_at',
        from: moment().subtract(1, 'week').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        interval: 'daily',
        storeId,
      });

      console.log('Response:', response);
      setState((prevState) => ({
        ...prevState,
        sales: response.data,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [storeId]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  return { ...state, refetch: () => getReport() };
};

export const EcommerceSalesRevenue = forwardRef((props, ref) => {
  const { storeId } = props;
  const { loading, sales, refetch } = useReport(storeId);
  const chartOptions = useChartOptions(sales);

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  return (
    <Card>
      <CardHeader
        title="Reporte de ventas diario"
        subheader="Ventas de los últimos 7 días, en función de la tienda seleccionada"
      />
      {loading ? (
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <Skeleton height={320} sx={{ transform: 'scale(1, 1)' }} />
        </CardContent>
      ) : (
        <CardContent sx={{ pt: 0 }}>
          <Chart
            height={320}
            options={chartOptions}
            series={[
              {
                name: 'Número de pedidos',
                data: sales.map((sale) => sale.orders),
              },
              {
                name: 'Ventas alcanzadas',
                data: sales.map((sale) => sale.sales_total.toFixed(2)),
              },
            ]}
            type="area"
          />
        </CardContent>
      )}
    </Card>
  );
});
