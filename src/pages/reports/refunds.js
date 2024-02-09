import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { Download02 } from '@untitled-ui/icons-react';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { useStores } from '../../hooks/use-stores';
import { useLocalStorage } from '../../hooks/use-local-storage';

const intervalOptions = [
  {
    label: 'Diario',
    value: 'daily',
  },
  {
    label: 'Mensual',
    value: 'monthly',
  },
  {
    label: 'Anual',
    value: 'yearly',
  },
];

const dateUsedOptions = [
  {
    label: 'Fecha de creación',
    value: 'created_at',
  },
  {
    label: 'Fecha de actualización',
    value: 'updated_at',
  },
];

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const stores = useStores();
  const [filtersOpen, setFiltersOpen] = useLocalStorage(
    'refundsReportFiltersOpen',
    true,
  );
  const [filters, setFilters] = useLocalStorage('refundsReportFilters', {
    dateField: 'created_at',
    from: undefined,
    to: undefined,
    interval: 'daily',
    storeId: undefined,
  });

  const handleStoreIdChange = (event) => {
    const { value } = event.target;

    setFilters((filters) => ({
      ...filters,
      storeId: value.length > 0 ? value : undefined,
    }));
  };

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <>
      <Head>
        <title>Reporte de devoluciones | Sitelicon - MiddleWare</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Reporte de devoluciones</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.index}
                    variant="subtitle2"
                  >
                    Inicio
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Reportes
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    Devoluciones
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={
                    <SvgIcon>
                      <Download02 />
                    </SvgIcon>
                  }
                >
                  Exportar CSV
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <CardHeader
                title="Generar reporte"
                subheader="Ajuste los filtros antes de generar el reporte"
              />
              <PropertyList>
                <PropertyListItem align={align} divider label="Fecha usada">
                  <TextField
                    hiddenLabel
                    select
                    SelectProps={{ native: true }}
                    value={filters.dateField}
                    onChange={(event) => {
                      setFilters((filters) => ({
                        ...filters,
                        dateField: event.target.value,
                      }));
                    }}
                  >
                    {dateUsedOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </PropertyListItem>
                <PropertyListItem align={align} divider label="Intervalo">
                  <TextField
                    hiddenLabel
                    select
                    SelectProps={{ native: true }}
                    value={filters.interval}
                    onChange={(event) => {
                      setFilters((filters) => ({
                        ...filters,
                        interval: event.target.value,
                      }));
                    }}
                  >
                    {intervalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </PropertyListItem>
                <PropertyListItem
                  align={align}
                  divider
                  label="Fecha de inicio*"
                >
                  <DatePicker
                    clearable
                    format="dd/MM/yyyy"
                    value={filters.form ? new Date(filters.form) : null}
                    onChange={(date) =>
                      setFilters((filters) => ({
                        ...filters,
                        from: date,
                      }))
                    }
                    label="Fecha de inicio"
                    renderInput={(params) => <TextField {...params} />}
                    slotProps={{
                      textField: { InputLabelProps: { required: true } },
                    }}
                  />
                </PropertyListItem>
                <PropertyListItem align={align} divider label="Fecha de fin*">
                  <DatePicker
                    clearable
                    format="dd/MM/yyyy"
                    value={filters.to ? new Date(filters.to) : null}
                    onChange={(date) =>
                      setFilters((filters) => ({
                        ...filters,
                        to: date,
                      }))
                    }
                    label="Fecha de fin"
                    renderInput={(params) => <TextField {...params} />}
                    slotProps={{
                      textField: { InputLabelProps: { required: true } },
                    }}
                  />
                </PropertyListItem>
                <PropertyListItem align={align} divider label="Tienda">
                  <TextField
                    hiddenLabel
                    select
                    SelectProps={{ native: true }}
                    value={filters.storeId || ''}
                    onChange={handleStoreIdChange}
                  >
                    <option value="">Todas</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </TextField>
                </PropertyListItem>
              </PropertyList>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                padding={3}
              >
                <Button color="primary" variant="contained">
                  Generar reporte
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
