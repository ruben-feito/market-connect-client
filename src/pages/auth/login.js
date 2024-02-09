import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormHelperText,
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
import { Logo } from '../../components/logo';
import { Box, padding } from '@mui/system';

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
  remember: false,
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('El correo electrónico no es válido')
    .max(255)
    .required('El correo electrónico es obligatorio'),
  password: Yup.string().max(255).required('La contraseña es obligatoria'),
  remember: Yup.boolean(),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { issuer, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        console.log(values);
        await signIn(values.email, values.password, values.remember);

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
        <title>Iniciar sesión | Middleware</title>
      </Head>
      <div>
        <Card elevation={16}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              flex: '1 1 auto',
              pt: 7,
              pb: 6,
              mx: 15,
            }}
          >
            <Logo fillColor1="#000000" fillColor2="orange" />
          </Box>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Inicio de sesión
              </Typography>
            }
            sx={{
              pb: 0,
              pt: 0,
              textAlign: 'center',
            }}
            title="Middleware"
            titleTypographyProps={{
              variant: 'h4',
              pb: 1,
            }}
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
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  sx={{
                    '& .MuiFilledInput-root': {
                      borderTopRightRadius: '0',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </Stack>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 3, py: 2 }}
                type="submit"
                variant="contained"
              >
                {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
              <Box
                sx={{
                  pt: 3,
                  display: 'flex', // Añadido para usar flexbox
                  alignItems: 'center',
                }}
              >
                <Typography variant="body3">
                  <Checkbox
                    {...formik.getFieldProps('remember')}
                    checked={formik.values.remember}
                    sx={{
                      marginTop: 0.75,
                      paddingTop: 0,
                    }}
                  />
                  Recordarme
                </Typography>
              </Box>
            </form>
          </CardContent>
          <AuthFooter />
        </Card>
        {/* <Stack spacing={3} sx={{ mt: 3 }}></Stack> */}
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
