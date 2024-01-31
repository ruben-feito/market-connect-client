import { Fragment, useCallback, useState, useMemo } from 'react';
import numeral from 'numeral';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  MenuItem,
  Skeleton,
  Stack,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import {
  ArrowNarrowRight,
  ChevronDown,
  ChevronRight,
  Pencil01,
  Pencil02,
  Trash01,
} from '@untitled-ui/icons-react';
import { SeverityPill } from '../../components/severity-pill';
import { useLanguageId } from '../../hooks/use-language-id';
import { categoriesApi } from '../../api/categories';

const CategoryListRow = ({
  category,
  refetch,
  isChild = false,
  parentNames = [],
}) => {
  const languageId = useLanguageId();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasChildren = useMemo(() => category.children.length > 0, [category]);
  const data = useMemo(
    () => category.data.find(({ language_id }) => language_id === languageId),
    [category.data, languageId],
  );

  const handleDelete = useCallback(
    async (event) => {
      event.preventDefault();
      if (category.children.length > 0) {
        toast.error(
          'No se puede eliminar una categoría con subcategorías. Primero elimine las subcategorías.',
        );
        return;
      }
      if (
        window.confirm(
          `¿Está seguro que desea eliminar la categoría ${data?.name}? Esta acción es irreversible.`,
        )
      ) {
        // TODO: Delete category from API
        try {
          setDeleting(true);
          await categoriesApi.deleteCategory(category.id);
          toast.success('Categoría eliminada con éxito.');
          refetch();
        } catch (error) {
          console.error(error.message);
          toast.error('Ocurrió un error al eliminar la categoría.');
        } finally {
          setDeleting(false);
        }
      }
    },
    [category, data?.name, refetch],
  );

  return (
    <>
      <TableRow
        hover
        slected={open}
        sx={{
          ...(open && {
            backgroundColor: 'rgba(17, 25, 39, 0.04)',
          }),
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            position: 'relative',
            paddingLeft: `${category.level * 30}px !important`,
            ...((open || isChild) && {
              '&:after': {
                position: 'absolute',
                content: '" "',
                top: 0,
                left: `${(category.level - (isChild ? 1 : 2)) * 30}px`,
                backgroundColor: 'warning.light',
                width: 3,
                bottom: 0,
              },
            }),
          }}
        >
          {hasChildren && (
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              <SvgIcon fontSize="small">
                {open ? <ChevronDown /> : <ChevronRight />}
              </SvgIcon>
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Box
            sx={{ cursor: 'pointer', ml: 2, userSelect: 'none' }}
            onClick={() => setOpen((prev) => !prev)}
          >
            {parentNames.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize={11}
              >
                {parentNames.join(' → ')}
              </Typography>
            )}
            {data?.name ? (
              <Typography variant="subtitle2">{data?.name}</Typography>
            ) : (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontStyle="italic"
              >
                Nombre sin definir
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell align="center">
          {category.erp_id || (
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
              N/A
            </Typography>
          )}
        </TableCell>
        <TableCell align="center">{category.position}</TableCell>
        <TableCell align="center">{category.children.length}</TableCell>
        <TableCell align="center">
          <SeverityPill
            color={category.stores?.length > 0 ? 'success' : 'error'}
          >
            {category.stores?.length > 0 ? 'Habilitado' : 'Deshabilitado'}
          </SeverityPill>
        </TableCell>
        <TableCell align="right">
          <Button
            size="small"
            LinkComponent={NextLink}
            href={`/categories/${category.id}`}
            sx={{ whiteSpace: 'nowrap' }}
            startIcon={
              <SvgIcon fontSize="inherit">
                <Pencil02 />
              </SvgIcon>
            }
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={
              <SvgIcon fontSize="inherit">
                <Trash01 />
              </SvgIcon>
            }
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </TableCell>
      </TableRow>
      {open &&
        category.children.map((child) => (
          <CategoryListRow
            key={child.id}
            category={child}
            isChild={true}
            refetch={refetch}
            parentNames={[...parentNames, data?.name]}
          />
        ))}
    </>
  );
};

export const CategoryListTable = (props) => {
  const { categories, refetch, loading, ...other } = props;

  return (
    <div {...other}>
      <Scrollbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Categoría</TableCell>
              <TableCell align="center">ERP ID</TableCell>
              <TableCell align="center">Posición</TableCell>
              <TableCell align="center">Categorías hijas</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10).keys()).map((i) => (
                <TableRow key={i}>
                  <TableCell padding="checkbox" />
                  {Array.from(Array(6).keys()).map((i) => (
                    <TableCell key={i}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              categories.map((category) => (
                <CategoryListRow
                  key={category.id}
                  category={category}
                  refetch={refetch}
                />
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </div>
  );
};

CategoryListTable.propTypes = {
  categories: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};
