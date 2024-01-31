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
  FormControlLabel,
  FormLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { layoutHomeWebApi } from '../../api/layout-home-web';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';
import { apiRequest } from '../../utils/api-request';

const useLayoutHomeWeb = (layoutHomeWebId) => {
  const isMounted = useMounted();
  const [layoutHomeWeb, setLayoutHomeWeb] = useState();

  const getLayoutHomeWeb = useCallback(
    async (id) => {
      try {
        const response = await layoutHomeWebApi.getLayoutHomeWeb(id);

        if (isMounted()) {
          setLayoutHomeWeb(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getLayoutHomeWeb(layoutHomeWebId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutHomeWebId],
  );

  return layoutHomeWeb;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const layoutHomeWeb = useLayoutHomeWeb(id);
  const [objectId, setObjectId] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState();
  const [objectType, setObjectType] = useState('');

  const [items, setItems] = useState([]);

  const getItems = async (type) => {
    const res = await apiRequest(`admin/${type}`, {
      method: 'GET',
    });
    setItems(res.items);
  };

  useEffect(() => {
    if (objectType) {
      getItems(objectType);
    }
  }, [objectType]);

  const objectTypes = [
    'slider_layout',
    'banner_text_layout',
    'banner_images_layout',
    'category_layout',
    'blog_layout',
    'instagram_layout',
  ];

  usePageView();

  useEffect(() => {
    if (layoutHomeWeb) {
      setPosition(layoutHomeWeb?.position);
      setObjectId(layoutHomeWeb?.object_id);
      setObjectType(layoutHomeWeb?.object_type);
      setIsActive(layoutHomeWeb?.is_active);
    }
  }, [layoutHomeWeb]);

  if (!layoutHomeWeb) {
    return null;
  }

  const createdAt = format(
    new Date(layoutHomeWeb.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await layoutHomeWebApi.updateLayoutHomeWeb(id, {
        position,
        is_active: isActive,
        object_id: objectId,
        object_type: objectType,
      });
      toast.success('Maquetación Web creado correctamente');
      setError(undefined);
      router.push(`/layout-home-web`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Maquetación Web # {layoutHomeWeb.id} | PACOMARTINEZ</title>
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
                href={paths.layoutHomeWeb.index}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">Maquetación Web</Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Maquetación Web # {layoutHomeWeb.id}
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
                    label="Position"
                    type="number"
                    variant="filled"
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
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
                      Object Type
                    </FormLabel>
                    <Select
                      fullWidth
                      value={objectType || ''}
                      onChange={(e) => setObjectType(e.target.value)}
                    >
                      {objectTypes.map((item, index) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel
                      sx={{
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      Name
                    </FormLabel>
                    <Select
                      fullWidth
                      disabled={!objectType}
                      value={objectId}
                      onChange={(e) => setObjectId(e.target.value)}
                    >
                      {items.map((item, index) => (
                        <MenuItem key={`${item}-${index}`} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(event, checked) => setIsActive(checked)}
                      />
                    }
                    label="Is Active"
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="large" variant="contained" type="submit">
                      Maquetación Web de actualización
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
