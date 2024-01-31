import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { paths } from '../../paths';
import { Box } from '@mui/system';
import { DateTimePicker } from '@mui/x-date-pickers';
import { applyTypes, customerGroups, stores } from '../../api/promotions/data';
import { promotionsApi } from '../../api/promotions';
import { Trash01 } from '@untitled-ui/icons-react';
import { categoriesApi } from '../../api/categories';

const validationSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Requerido'),
  description: Yup.string().max(255, 'Máximo 255 caracteres.'),
  active: Yup.bool().required('Requerido'),
  from: Yup.date().nullable(),
  to: Yup.date().nullable(),
  stores: Yup.array().min(1, 'Seleccione al menos una tienda'),
  customerGroups: Yup.array().min(
    1,
    'Seleccione al menos un grupo de clientes',
  ),
  categories: Yup.array(),
  globalUsesLimit: Yup.number()
    .min(0, 'El valor debe ser igual o superior a 0.')
    .required('Requerido'),
  usesPerCustomer: Yup.number()
    .min(0, 'El valor debe ser igual o superior a 0.')
    .required('Requerido'),
  cuponCode: Yup.string().max(20, 'El código debe tener máximo 20 caracteres.'),
  applyTo: Yup.string().required('Requerido'),
  discountValue: Yup.number()
    .min(0, 'El valor debe ser igual o superior a 0.')
    .required('Requerido'),
  excludeOnSale: Yup.bool(),
  freeShipping: Yup.bool(),
});

const generateCouponCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const returnChildrenIds = (acc, category) => {
  return [
    ...acc,
    category.id,
    ...category.children.reduce(returnChildrenIds, []),
  ];
};

const revertCategory = (acc, category, parentNames = []) => {
  const data = category.data.find(({ language_id }) => language_id === 1);

  if (!data) {
    return acc;
  }

  return [
    ...acc,
    {
      label: [...parentNames, data.name].join(' → '),
      name: data.name,
      value: category.id,
      childIds: category.children.reduce(returnChildrenIds, []),
    },
    ...category.children.reduce(
      (childAcc, children) =>
        revertCategory(childAcc, children, [...parentNames, data.name]),
      [],
    ),
  ];
};

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategories();
      setCategories(
        response.reduce((acc, category) => revertCategory(acc, category), []),
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { categories, loading };
};

export const PromotionUpdateForm = ({ promotion, refetch }) => {
  const router = useRouter();
  const { categories, loading: loadingCategories } = useCategories();
  const formik = useFormik({
    initialValues: {
      name: promotion.name || '',
      description: promotion?.description || '',
      active: promotion.active === 1,
      from: promotion.from ? new Date(promotion.from) : null,
      to: promotion.to ? new Date(promotion.to) : null,
      stores: promotion.stores?.map((store) => store.id) || [],
      customerGroups:
        promotion.customer_groups?.map((customerGroup) => customerGroup.id) ||
        [],
      categories:
        promotion.categories?.map((category) => category.category_id) || [],
      globalUsesLimit: promotion.global_uses_limit || 0,
      usesPerCustomer: promotion.uses_per_customer || 0,
      cuponCode: promotion.coupon_code || '',
      applyTo: promotion.type_id || applyTypes[0].id,
      discountValue: promotion.value || 0,
      excludeOnSale: promotion.exclude_on_sale_products === 1,
      freeShipping: promotion.free_shipping === 1,
      submit: null,
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await promotionsApi.updatePromotion({
          id: promotion.id,
          name: values.name.trim().length > 0 ? values.name.trim() : undefined,
          description:
            values.description.trim().length > 0
              ? values.description.trim()
              : undefined,
          active: values.active,
          from: values.from
            ? moment(values.from).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          to: values.to
            ? moment(values.to).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          type_id: values.applyTo,
          value: values.discountValue,
          exclude_on_sale_products: values.excludeOnSale,
          include_all_categories: values.categories.length === 0,
          free_shipping: values.freeShipping,
          global_uses_limit: values.globalUsesLimit,
          uses_per_customer: values.usesPerCustomer,
          coupon_code:
            values.cuponCode.trim().length > 0
              ? values.cuponCode.trim()
              : undefined,
          stores: values.stores,
          customer_groups: values.customerGroups,
          categories: values.categories.map((id) => ({
            category_id: id,
          })),
        });
        toast.success('Promoción actualizada');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('¡Algo ha ido mal!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    try {
      if (window.confirm('¿Está seguro de eliminar esta promoción?')) {
        await promotionsApi.deletePromotion(promotion.id);
        toast.success('Promoción eliminada');
        router.push(paths.promotions.index);
      }
    } catch (err) {
      console.error(err);
      toast.error('¡Algo ha ido mal!');
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Nombre*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nombre de la promoción"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Descripción
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(formik.touched.description && formik.errors.description)
                  }
                  fullWidth
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  label="Descripción breve de la promoción"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Activo
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.active}
                      color="success"
                      name="active"
                      onChange={formik.handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={formik.values.active ? 'Si' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Fecha desde
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <DateTimePicker
                  clearable
                  format="dd/MM/yyyy HH:mm"
                  label="Aplicar a partir de"
                  name="from"
                  onBlur={formik.handleBlur}
                  onChange={(value) => formik.setFieldValue('from', value)}
                  renderInput={(params) => <TextField {...params} />}
                  value={formik.values.from}
                  slotProps={{
                    textField: {
                      error: !!(formik.touched.from && formik.errors.from),
                      helperText: formik.touched.from && formik.errors.from,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Fecha hasta
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <DateTimePicker
                  clearable
                  format="dd/MM/yyyy HH:mm"
                  label="Aplicar hasta"
                  name="to"
                  onBlur={formik.handleBlur}
                  onChange={(value) => formik.setFieldValue('to', value)}
                  renderInput={(params) => <TextField {...params} />}
                  value={formik.values.to}
                  slotProps={{
                    textField: {
                      error: !!(formik.touched.to && formik.errors.to),
                      helperText: formik.touched.to && formik.errors.to,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Tiendas*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.stores && formik.errors.stores)}
                  fullWidth
                  helperText={formik.touched.stores && formik.errors.stores}
                  label="Seleccione las tiendas"
                  name="stores"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ multiple: true }}
                  value={formik.values.stores}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name} ({store.code.toUpperCase()})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Grupos de clientes*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(
                      formik.touched.customerGroups &&
                      formik.errors.customerGroups
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.customerGroups &&
                    formik.errors.customerGroups
                  }
                  label="Seleccione los grupos de clientes"
                  name="customerGroups"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ multiple: true }}
                  value={formik.values.customerGroups}
                >
                  {customerGroups.map((customerGroup) => (
                    <MenuItem key={customerGroup.id} value={customerGroup.id}>
                      {customerGroup.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Aplicar a las categorías
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <Stack spacing={1}>
                  {loadingCategories && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CircularProgress color="black" size={18} />
                      <Typography variant="body2">
                        Cargando las categorías del producto...
                      </Typography>
                    </Stack>
                  )}
                  {!loadingCategories &&
                    formik.values.categories.length > 0 && (
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          marginBottom: '6px !important',
                          marginTop: '0 !important',
                        }}
                      >
                        {formik.values.categories.map((id) => {
                          console.log(id);
                          const category = categories.find(
                            ({ value }) => value === id,
                          );
                          if (!category) return null;
                          return (
                            <Grid item key={id}>
                              <Tooltip
                                title={category.label}
                                placement="top"
                                arrow
                              >
                                <Chip
                                  variant="outlined"
                                  label={category.name}
                                  onDelete={() => {
                                    formik.setFieldValue(
                                      'categories',
                                      formik.values.categories.filter(
                                        (categoryId) => categoryId !== id,
                                      ),
                                    );
                                  }}
                                />
                              </Tooltip>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  <Autocomplete
                    openOnFocus
                    options={categories.filter(
                      (option) =>
                        !formik.values.categories.find(
                          (id) => id === option.value,
                        ),
                    )}
                    groupBy={(option) => option.label.split(' → ')[0]}
                    loading={loadingCategories}
                    noOptionsText="No hay coincidencias con los filtros aplicados."
                    onChange={(_, value) => {
                      if (!!value?.value) {
                        formik.setFieldValue('categories', [
                          ...formik.values.categories.filter(
                            (id) => id !== value.value,
                          ),
                          value.value,
                          ...value.childIds.filter(
                            (id) => !formik.values.categories.includes(id),
                          ),
                        ]);
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ fontSize: 14 }} {...props}>
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Buscar categorías por nombre…"
                        label="Buscador de categorías"
                        helperText="Si no selecciona ninguna categoría, la promoción se aplicará a todas las categorías."
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Límite de uso global*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(
                      formik.touched.globalUsesLimit &&
                      formik.errors.globalUsesLimit
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.globalUsesLimit &&
                    formik.errors.globalUsesLimit
                  }
                  label="Límite de uso global"
                  name="globalUsesLimit"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.globalUsesLimit}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Límite de uso por cliente*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={
                    !!(
                      formik.touched.usesPerCustomer &&
                      formik.errors.usesPerCustomer
                    )
                  }
                  fullWidth
                  helperText={
                    (formik.touched.usesPerCustomer &&
                      formik.errors.usesPerCustomer) ||
                    'El límite de uso se aplica sólo a los clientes registrados.'
                  }
                  label="Límite de uso por cliente"
                  name="usesPerCustomer"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.usesPerCustomer}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Código de cupón
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    error={
                      !!(formik.touched.cuponCode && formik.errors.cuponCode)
                    }
                    fullWidth
                    helperText={
                      (formik.touched.cuponCode && formik.errors.cuponCode) ||
                      'Deje el campo vacío si no desea generar un código de cupón'
                    }
                    // label="Código de cupón"
                    hiddenLabel
                    name="cuponCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.cuponCode}
                  />
                  <div>
                    <Button
                      size="large"
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        formik.setFieldValue(
                          'cuponCode',
                          generateCouponCode(12),
                        );
                      }}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Generar código
                    </Button>
                  </div>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Excluir productos en oferta
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.excludeOnSale}
                      name="excludeOnSale"
                      onChange={formik.handleChange}
                    />
                  }
                  label={formik.values.excludeOnSale ? 'Sí' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Gastos de envío gratis
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.freeShipping}
                      name="freeShipping"
                      onChange={formik.handleChange}
                    />
                  }
                  label={formik.values.freeShipping ? 'Sí' : 'No'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Aplicar a*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  error={!!(formik.touched.applyTo && formik.errors.applyTo)}
                  fullWidth
                  helperText={formik.touched.applyTo && formik.errors.applyTo}
                  label="Aplicar a"
                  name="applyTo"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.applyTo}
                >
                  {applyTypes.map((applyType) => (
                    <MenuItem key={applyType.id} value={applyType.id}>
                      {applyType.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" textAlign="end" noWrap>
                  Valor del descuento*
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  type="number"
                  error={
                    !!(
                      formik.touched.discountValue &&
                      formik.errors.discountValue
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.discountValue && formik.errors.discountValue
                  }
                  label="Valor del descuento"
                  name="discountValue"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.discountValue}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            startIcon={<Trash01 />}
          >
            Eliminar promoción
          </Button>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={1}
          >
            <Button
              color="inherit"
              component={NextLink}
              href={paths.promotions.index}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Actualizar promoción
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};
