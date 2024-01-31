import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useStores } from '../../hooks/use-stores';
import { useUpdateEffect } from '../../hooks/use-update-effect';
import { DatePicker } from '@mui/x-date-pickers';

export const ReturnListSearch = ({ onFiltersChange, open = false }) => {
  const stores = useStores();
  const [chips, setChips] = useState([]);
  const [filters, setFilters] = useState({
    orderNumber: undefined,
    createdAt: undefined,
    statusId: undefined,
    storeId: undefined,
  });

  const handleFiltersUpdate = useCallback(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);

  useUpdateEffect(() => {
    setFilters(
      chips.reduce((acc, chip) => ({ ...acc, [chip.key]: chip.value }), {}),
    );
  }, [chips]);

  const handleChipDelete = useCallback((chipToDelete) => {
    setChips((prev) => prev.filter((chip) => chip.key !== chipToDelete.key));
  }, []);

  const showChips = chips.length > 0;

  return (
    <div>
      <Collapse in={open}>
        <Divider />
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número de pedido"
              onChange={(e) =>
                setChips((prev) => [
                  ...prev.filter((chip) => chip.key !== 'orderNumber'),
                  {
                    key: 'orderNumber',
                    label: 'Número de pedido',
                    displayValue: e.target.value,
                    value: e.target.value,
                  },
                ])
              }
              value={
                chips.find((chip) => chip.key === 'orderNumber')?.value || ''
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              format="dd/MM/yyyy"
              label="Fecha de creación"
              onChange={(date) =>
                setChips((prev) => [
                  ...prev.filter((chip) => chip.key !== 'createdAt'),
                  {
                    key: 'createdAt',
                    label: 'Fecha de creación',
                    displayValue: date?.toLocaleDateString(),
                    value: date,
                  },
                ])
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
              value={
                chips.find((chip) => chip.key === 'createdAt')?.value || null
              }
            />
          </Grid>
        </Grid>
      </Collapse>
      <Divider />
      {showChips ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2 }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    '& span': {
                      fontWeight: 600,
                    },
                  }}
                >
                  <>
                    <span>{chip.label}</span>: {chip.displayValue || chip.value}
                  </>
                </Box>
              }
              onDelete={() => handleChipDelete(chip)}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography color="text.secondary" variant="subtitle2">
            No hay filtros aplicados
          </Typography>
        </Box>
      )}
    </div>
  );
};

ReturnListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  open: PropTypes.bool,
};
