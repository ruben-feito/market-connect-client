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
import { bannerTextLayoutApi } from '../../../../api/banner-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { BannerTextLayoutItemCard } from '../../../../sections/banner-text-layout-item/banner-text-layout-item-card';
import { BannerTextLayoutItemCreateModal } from '../../../../sections/banner-text-layout-item/banner-text-layout-item-create-modal';
import { bannerTextLayoutItemApi } from '../../../../api/banner-text-layout-item';

const useBannerTextLayout = (bannerTextLayoutId) => {
  const isMounted = useMounted();
  const [bannerTextLayout, setBannerTextLayout] = useState();

  const getBannerTextLayout = useCallback(
    async (id) => {
      try {
        const response = await bannerTextLayoutApi.getBannerTextLayout(id);

        if (isMounted()) {
          setBannerTextLayout(response);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMounted],
  );

  useEffect(
    () => {
      getBannerTextLayout(bannerTextLayoutId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bannerTextLayoutId],
  );

  return bannerTextLayout;
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const bannerTextLayout = useBannerTextLayout(id);
  const [name, setName] = useState();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('text');
  const [bannerTextItems, setBannerTextItems] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  usePageView();

  useEffect(() => {
    setName(bannerTextLayout?.name);
    setTitle(bannerTextLayout?.title);
    setSubtitle(bannerTextLayout?.subtitle);
    setType(bannerTextLayout?.type || '');
  }, [bannerTextLayout]);

  const getBannerTextItems = useCallback(() => {
    bannerTextLayoutItemApi
      .getBannerTextLayoutItems({
        bannerTextLayoutId: id,
      })
      .then((res) => {
        setBannerTextItems(res.items);
      });
  }, [id]);

  useEffect(() => {
    getBannerTextItems();
  }, [id, getBannerTextItems]);

  const openEditDialog = (item) => {
    setOpenCreateModal(true);
    setSelectedItem(item);
  };

  const openCreateDialog = () => {
    setOpenCreateModal(true);
    setSelectedItem(undefined);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      bannerTextItems,
      result.source.index,
      result.destination.index,
    );
    setBannerTextItems(newItems);

    bannerTextLayoutItemApi.orderItems(newItems).then((res) => {
      getBannerTextItems();
    });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onCreateItem = async (data) => {
    event.preventDefault();
    try {
      const response = await bannerTextLayoutItemApi.createBannerTextLayoutItem(
        {
          order: bannerTextItems.length,
          source: data.source,
          id_banner_text_layout: id,
        },
      );
      getBannerTextItems();
      setOpenCreateModal(false);
      toast.success('Banner Text Item creado correctamente');
    } catch (error) {
      console.error(error);
    }
  };

  if (!bannerTextLayout) {
    return null;
  }

  const createdAt = format(
    new Date(bannerTextLayout.created_at),
    'dd/MM/yyyy HH:mm',
  );

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      await bannerTextLayoutApi.updateBannerTextLayout(id, {
        name,
        title,
        subtitle,
        type,
      });
      toast.success('Banner actualizado correctamente');
      router.push(paths.adminContent.home.bannerText);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el banner');
    }
  };

  const typeOptions = ['text', 'images'];

  return (
    <>
      <Head>
        <title>
          Diseño banner # {bannerTextLayout.id} | Sitelicon - MiddleWare
        </title>
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
                href={paths.adminContent.home.bannerText}
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                }}
                underline="hover"
              >
                <SvgIcon sx={{ mr: 1 }}>
                  <ArrowLeftIcon />
                </SvgIcon>
                <Typography variant="subtitle2">
                  Diseño del banner text
                </Typography>
              </Link>
            </div>
            <div>
              <Stack spacing={1}>
                <Typography variant="h4">
                  Diseño del banner text # {bannerTextLayout.id}
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
                    label="Name"
                    variant="filled"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    sx={{ my: 2 }}
                  />
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
                    label="Subtitle"
                    variant="filled"
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
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

              <Stack
                justifyContent="space-between"
                alignItems="center"
                direction="row"
                sx={{ py: 3 }}
              >
                <Typography variant="h5">Banner text layout items</Typography>
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  onClick={openCreateDialog}
                >
                  Create Banner Text Item
                </Button>
              </Stack>

              <DragDropContext onDragEnd={handleDragEnd}>
                {bannerTextItems.map((bannerTextItem, index) => (
                  <Droppable
                    droppableId={bannerTextItem.id.toString()}
                    type="task"
                    key={index}
                  >
                    {(provided) => (
                      <div
                        key={bannerTextItem.id}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <BannerTextLayoutItemCard
                          bannerTextItem={bannerTextItem}
                          index={index}
                          refetch={getBannerTextItems}
                          onEdit={() => openEditDialog(bannerTextItem)}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </DragDropContext>
            </div>
            <BannerTextLayoutItemCreateModal
              open={openCreateModal}
              onClose={() => setOpenCreateModal(false)}
              onCreate={onCreateItem}
              selectedItem={selectedItem}
              refetch={getBannerTextItems}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
