import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { helpCenterApi } from '../../api/help-center';
import { HelpCenterList } from '../../sections/help/help-center-list';
import { useLanguages } from '../../hooks/use-languages';
import { useLocalStorage } from '@uidotdev/usehooks';
import { CreateEditHelpCenterModal } from '../../sections/help/create-modal.js';

const columnOptions = [
  {
    id: 1,
    label: 'Order',
    value: 'order',
    align: 'center',
  },
  {
    id: 2,
    label: 'Título',
    value: 'title',
    align: 'left',
  },
  {
    id: 3,
    label: 'Idioma',
    value: 'language',
    align: 'left',
  },
  {
    id: 4,
    label: 'Activo',
    value: 'active',
    align: 'left',
  },
  {
    id: 5,
    label: 'Path',
    value: 'path',
    align: 'left',
  },
  {
    id: 6,
    label: 'Contenido',
    value: 'contain',
    align: 'left',
  },
  {
    id: 7,
    label: 'Acciones',
    value: 'actions',
    align: 'center',
  },
];

const useHelpCenter = (lang) => {
  const [state, setState] = useState({
    loading: true,
    items: [],
    itemsCount: 0,
    error: undefined,
  });

  const getHelpCenter = useCallback(async (lang) => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        items: [],
      }));
      const response = await helpCenterApi.getHelpCenter(lang);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        items: response,
        itemsCount: response.length,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      getHelpCenter(lang);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );

  return {
    loading: state.loading,
    items: state.items,
    itemsCount: state.itemsCount,
    error: state.error,
    refetch: getHelpCenter,
  };
};

const HelpCenter = () => {
  const languages = useLanguages();
  const [lang, setLang] = useLocalStorage('helpCenterLang', languages[0]?.id);
  const { loading, items, itemsCount, refetch } = useHelpCenter(lang);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  return (
    <>
      <Head>
        <title>Centro de ayuda | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h5">Centro de ayuda</Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.help.index}
                  variant="subtitle2"
                >
                  Inicio · Centro de ayuda · Listado
                </Link>
              </Breadcrumbs>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Select
                value={lang}
                label="Tienda"
                onChange={(event) => {
                  setLang(event.target.value);
                }}
              >
                {languages.map((language) => (
                  <MenuItem value={language.id} key={language.id}>
                    {language.language}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenCreateModal(true);
                }}
              >
                Añadir item
              </Button>
              <CreateEditHelpCenterModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
              />
            </Stack>
          </Stack>
        </Box>
        <HelpCenterList
          columns={columnOptions}
          items={items}
          itemsCount={itemsCount}
          loading={loading}
          refetch={refetch}
        />
      </Box>
    </>
  );
};

HelpCenter.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HelpCenter;
