import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { productsApi } from '../../api/products';

export const ProductAddProductModal = ({
  open,
  onClose,
  onConfirm,
  excludeIds = [],
  ...other
}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (debouncedInputValue.trim() === '') return undefined;
    setLoading(true);
    setProducts([]);
    productsApi
      .getProducts({
        page: 0,
        filters: { search: debouncedInputValue },
      })
      .then((response) => {
        if (!active) return;
        setLoading(false);
        setProducts(response.data);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedInputValue]);

  const handleClose = useCallback(() => {
    onClose?.();
    setInputValue('');
  }, [onClose]);

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!value) return;
      onConfirm?.(value.id);
      handleClose();
    },
    [handleClose, onConfirm, value],
  );

  return (
    <Modal
      {...other}
      open={open}
      onClose={handleClose}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...(other.sx || {}),
      }}
    >
      <Box>
        <Container maxWidth="sm">
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={12} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h5">Sleccionar producto</Typography>
                <Typography color="text.secondary" variant="body2">
                  Busque y seleccione un producto para añadirlo a la variante
                  del producto.
                </Typography>
                <Autocomplete
                  id="product-search"
                  disableClearable
                  options={products.filter((p) => !excludeIds.includes(p.id))}
                  filterOptions={(x) => x}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  getOptionLabel={(option) =>
                    option.name?.value || 'Producto descatalogado'
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ '& > img': { mr: 2, width: 32 } }}
                      {...props}
                    >
                      <img
                        alt={option.name?.value || ''}
                        src={option.images[0]?.url}
                        loading="lazy"
                      />
                      <Stack spacing={0}>
                        <Typography variant="body2">
                          {option.name?.value || 'Producto descatalogado'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.sku}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                  loading={loading}
                  loadingText="Buscando productos..."
                  value={value}
                  inputValue={inputValue}
                  onInputChange={(event, value) => setInputValue(value)}
                  onChange={(event, value) => setValue(value)}
                  noOptionsText="No se encontraron coincidencias con el texto ingresado."
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar producto por nombre o SKU"
                      fullWidth
                    />
                  )}
                />
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button color="inherit" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                    Añadir producto
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};
