import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import CalendarIcon from '@untitled-ui/icons-react/build/esm/Calendar';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { buttonApi } from '../../../../api/button';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';

const useButton = (buttonId) => {
  const isMounted = useMounted();
  const [button, setButton] = useState();

  const getButton = useCallback(
    async (id) => {
      try {
        const response = await buttonApi.getButton(id);

        if (isMounted()) {
          setButton(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(() => {
    getButton(buttonId);
  }, [buttonId, getButton]);

  return button;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const button = useButton(id);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const typeOptions = ['button', 'link'];

  usePageView();

  useEffect(() => {
    setTitle(button?.title || '');
    setUrl(button?.url || '');
    setType(button?.type || 'button');
  }, [button]);

  if (!button) {
    return null;
  }

  const createdAt = format(new Date(button.created_at), 'dd/MM/yyyy HH:mm', {
    locale: es,
  });

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await buttonApi.updateButton(id, {
        title,
        url,
        type,
      });
      toast.success('Button actualizado correctamente');
      router.push(paths.adminContent.home.buttons);
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>Diseño button # {button.id} | Sitelicon - MiddleWare</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div>
              <Link
                color="text.primary"
                component={NextLink}
                href={paths.adminContent.home.buttons}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Diseño del button</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del button # {button.id}
                </Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography color="text.secondary" variant="body2">
                    Realizado el
                  </Typography>
                  <SvgIcon color="action">
                    <CalendarIcon />
                  </SvgIcon>
                  <Typography variant="body2">{createdAt}</Typography>
                </Stack>

                <form onSubmit={handleUpdateProduct}>
                  <TextField
                    fullWidth
                    label="Title"
                    variant="filled"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Url"
                    variant="filled"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
                  <FormControl fullWidth>
                    <FormLabel
                      sx={{
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      Tipo
                    </FormLabel>
                    <Select
                      fullWidth
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {typeOptions.map((item, index) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}
                  >
                    <Button size="large" variant="contained" type="submit">
                      Actualizar
                    </Button>
                  </Box>
                </form>
              </Stack>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
