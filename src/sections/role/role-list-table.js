import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { paths } from '../../paths';
import { getInitials } from '../../utils/get-initials';
import { getLangFlag, getLangTitle } from '../../utils/get-lang-flag';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const RoleListTable = (props) => {
  const { loading, roles, ...other } = props;
  const { deselectAll, selectAll, deselectOne, selectOne, selected } =
    useSelectionModel(roles);

  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const selectedAll = selected.length === roles.length;
  const selectedSome = selected.length > 0 && selected.length < roles.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button color="error" size="small">
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha de registro</TableCell>
              <TableCell>Fecha de actualización</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox" />
                  {Array.from(new Array(5)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && roles.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={10}>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                    sx={{ p: 4 }}
                  >
                    No hay roles que coincidan con los criterios de búsqueda
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              roles.map((role) => {
                const isSelected = selected.includes(role.id);
                return (
                  <TableRow hover key={role.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(role.id);
                          } else {
                            deselectOne(role.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>
                      <Link
                        color="primary"
                        component={NextLink}
                        href={`/accounts/roles/${role.id}`}
                        variant="caption"
                      >
                        {role.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(role.created_at),
                        'dd/MM/yyyy HH:mm:ss',
                        { locale: es },
                      )}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(role.updated_at),
                        'dd/MM/yyyy HH:mm:ss',
                        { locale: es },
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={NextLink}
                        href={`/accounts/roles/${role.id}`}
                      >
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

RoleListTable.propTypes = {
  roles: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};
