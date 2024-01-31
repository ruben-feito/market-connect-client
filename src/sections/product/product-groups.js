import { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { Image01, LayersThree01, Trash01 } from '@untitled-ui/icons-react';
import { ProductAddProductModal } from './product-add-product-modal';
import { Scrollbar } from '../../components/scrollbar';
import toast from 'react-hot-toast';
import { productsApi } from '../../api/products';
import { SeverityPill } from '../../components/severity-pill';

const ProductGroup = ({
  groupId,
  groupType,
  product,
  products,
  refetch,
  title,
  subheader,
  useCheck = false,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addProductToGroup = useCallback(
    async (productId) => {
      try {
        setLoading(true);
        await productsApi.addProductToProductGroup({
          groupId,
          groupType,
          productsIds: [productId, product.id, ...products.map((p) => p.id)],
        });
        toast.success('Producto agregado al grupo');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Ocurrió un error al agregar el producto al grupo');
      } finally {
        setLoading(false);
      }
    },
    [groupId, groupType, product.id, products, refetch],
  );

  const deleteProductFromGroup = useCallback(
    async (productId) => {
      try {
        setLoading(true);
        await productsApi.deleteProductFromProductGroup(groupId, productId);
        toast.success('Producto eliminado del grupo');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Ocurrió un error al eliminar el producto del grupo');
      } finally {
        setLoading(false);
      }
    },
    [groupId, refetch],
  );

  const handleCheck = useCallback(
    async (productId, isDefault) => {
      try {
        setLoading(true);
        await productsApi.switchProductGroupProductDefault(groupId, productId);
        toast.success('Producto actualizado');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Ocurrió un error al actualizar el producto');
      } finally {
        setLoading(false);
      }
    },
    [groupId, refetch],
  );

  return (
    <>
      <Card>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <Button onClick={() => setOpenModal(true)}>Añadir producto</Button>
          }
        />
        {products.length === 0 && (
          <CardContent>
            <Stack alignItems="center" justifyContent="center" spacing={2}>
              <SvgIcon color="action" fontSize="large">
                <LayersThree01 />
              </SvgIcon>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                No hay productos agregados a esta sección
              </Typography>
            </Stack>
          </CardContent>
        )}
        {products.length > 0 && (
          <Scrollbar>
            <Table>
              <TableBody>
                {products.map((product, index) => {
                  const image =
                    product.images.find(({ tag }) => tag === 'PRINCIPAL')
                      ?.url || product.images[0]?.url;
                  const isDisabled =
                    product.draft || product.stores?.length === 0;
                  return (
                    <TableRow hover key={product.id}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          {image ? (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'neutral.50',
                                backgroundImage: `url(${image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: 1,
                                display: 'flex',
                                height: 60,
                                justifyContent: 'center',
                                overflow: 'hidden',
                                width: 60,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: (theme) =>
                                  theme.palette.mode === 'dark'
                                    ? 'neutral.700'
                                    : 'neutral.50',
                                borderRadius: 1,
                                display: 'flex',
                                height: 60,
                                justifyContent: 'center',
                                width: 60,
                              }}
                            >
                              <SvgIcon>
                                <Image01 />
                              </SvgIcon>
                            </Box>
                          )}
                          <div>
                            <Stack direction="row" spacing={1}>
                              <Link
                                component={NextLink}
                                href={`/products/${product.id}`}
                                variant="subtitle2"
                                color="text.primary"
                              >
                                {product.name?.value ||
                                  'Producto descatalogado'}
                              </Link>
                              {isDisabled && (
                                <SeverityPill color="error">
                                  Deshabilitado
                                </SeverityPill>
                              )}
                            </Stack>
                            <Typography color="text.secondary" variant="body2">
                              {product.sku}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'neutral.700'
                                : 'neutral.200',
                            borderRadius: 1.5,
                            px: 1,
                            py: 0.5,
                            display: 'inline-block',
                          }}
                        >
                          <Typography variant="subtitle2">
                            #{product.reference}
                          </Typography>
                        </Box>
                      </TableCell>
                      {useCheck && (
                        <TableCell align="left">
                          <Box
                            sx={{
                              borderColor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'neutral.700'
                                  : 'neutral.200',
                              borderWidth: 1,
                              borderRadius: 1.5,
                              borderStyle: 'solid',
                              px: 0.5,
                              py: 0.2,
                              display: 'inline-block',
                              textAlign: 'center',
                            }}
                          >
                            <FormControlLabel
                              label={
                                <Typography
                                  color="text.secondary"
                                  variant="caption"
                                >
                                  {product.pivot?.is_default
                                    ? 'Producto predeterminado'
                                    : 'Marcar como predeterminado'}
                                </Typography>
                              }
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={product.pivot?.is_default || false}
                                  onChange={(event) =>
                                    handleCheck(
                                      product.id,
                                      event.target.checked,
                                    )
                                  }
                                  disabled={loading}
                                />
                              }
                              sx={{ m: 0, pr: 1 }}
                            />
                          </Box>
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <Button
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Está seguro de eliminar el producto ${product.name?.value} del grupo? Esta acción es irreversible.`,
                              )
                            ) {
                              deleteProductFromGroup(product.id);
                            }
                          }}
                          startIcon={
                            <SvgIcon>
                              <Trash01 />
                            </SvgIcon>
                          }
                          disabled={loading}
                        >
                          Eliminar del grupo
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        )}
      </Card>
      <ProductAddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        excludeIds={[product.id, ...products.map((p) => p.id)]}
        onConfirm={addProductToGroup}
      />
    </>
  );
};

ProductGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupType: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
  useCheck: PropTypes.bool,
};

const groupTitles = {
  look: 'Combínalo con',
  color_variants: 'Colores disponibles',
  size_variants: 'Completa tu kit',
};

const groupSubheaders = {
  look: 'Agrega productos que complementen este producto',
  color_variants: 'Agrega colores disponibles para este producto',
  size_variants: 'Agrega tamaños disponibles para este producto',
};

const defaultGroups = [
  {
    id: undefined,
    type: {
      name: 'look',
    },
    products: [],
  },
  {
    id: undefined,
    type: {
      name: 'color_variants',
    },
    products: [],
  },
  {
    id: undefined,
    type: {
      name: 'size_variants',
    },
    products: [],
  },
];

export const ProductGroups = ({ product, refetch }) => {
  const [groups, setGroups] = useState(defaultGroups);

  useEffect(() => {
    setGroups((prev) => [
      ...prev.filter((defaultGroup) => {
        return !product.groups.find(
          (group) => group.type.name === defaultGroup.type.name,
        );
      }),
      ...product.groups,
    ]);
  }, [product.groups]);

  return (
    <Stack spacing={2}>
      {groups
        .filter((group) =>
          ['look', 'color_variants', 'size_variants'].includes(group.type.name),
        )
        .sort((a, b) => {
          // Order should be color_variants, size_variants, look
          if (a.type.name === 'color_variants') {
            return -1;
          }
          if (b.type.name === 'color_variants') {
            return 1;
          }
          if (a.type.name === 'size_variants') {
            return -1;
          }
          if (b.type.name === 'size_variants') {
            return 1;
          }
          return 0;
        })
        .map((group, index) => (
          <ProductGroup
            key={group.id || `default-group-${index}`}
            groupId={group.id}
            groupType={group.type.name}
            title={groupTitles[group.type.name]}
            subheader={groupSubheaders[group.type.name]}
            product={product}
            products={group.products.filter((p) => p.id !== product.id)}
            refetch={refetch}
            useCheck={group.type.name === 'color_variants'}
          />
        ))}
      {/* <ProductGroup
        groupId={colorProductsGroupId}
        groupType="color_variants"
        title="Colores disponibles"
        subheader="Agrega colores disponibles para este producto"
        product={product}
        products={colorProducts}
        refetch={refetch}
        useCheck
      />
      <ProductGroup
        groupId={sizeProductsGroupId}
        title="Completa tu kit"
        groupType="size_variants"
        subheader="Agrega tamaños disponibles para este producto"
        product={product}
        products={sizeProducts}
        refetch={refetch}
      />
      <ProductGroup
        groupId={lookProductsGroupId}
        groupType="look"
        title="Combínalo con"
        subheader="Agrega productos que complementen este producto"
        product={product}
        products={lookProducts}
        refetch={refetch}
      /> */}
    </Stack>
  );
};
