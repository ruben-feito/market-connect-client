import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { GuestGuard } from '../../guards/guest-guard';
import { IssuerGuard } from '../../guards/issuer-guard';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as AuthLayout } from '../../layouts/auth/classic-layout';
import { paths } from '../../paths';
import { AuthFooter } from '../../sections/auth/auth-footer';
import { Issuer } from '../../utils/auth';

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;

  return {
    returnTo,
  };
};

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .max(255)
    .required('El correo electrónico es obligatorio'),
  password: Yup.string().max(255).required('La contraseña es obligatoria'),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { issuer, signIn } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email, values.password);

        if (isMounted()) {
          router.push(returnTo || paths.index);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  usePageView();

  return (
    <>
      <Head>
        <title>Iniciar sesión | Market Connect</title>
      </Head>
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Inicio de sesión
              </Typography>
            }
            sx={{
              pb: 0,
              textAlign: 'center',
            }}
            title="Market Connect"
          />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              {formik.errors.submit && (
                <FormHelperText error sx={{ mb: 2 }}>
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <AuthFooter />
        </Stack>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.JWT}>
    <GuestGuard>
      <AuthLayout>{page}</AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
