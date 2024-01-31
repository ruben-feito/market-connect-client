import { useEffect, useState, useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Box,
  Stack,
  Checkbox,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Typography,
  Link,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Scrollbar } from '../../components/scrollbar';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { jobDemandsAPI } from '../../api/job-demands';

const useJobDemands = (jobOfferId) => {
  const [state, setState] = useState({
    loading: true,
    jobDemands: [],
    error: null,
  });

  const getJobOffers = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const res = await jobDemandsAPI.getJobOffer(jobOfferId);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        jobDemands: res,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false, error: err }));
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await jobDemandsAPI.deleteDemand(id);
      setState((prevState) => ({
        ...prevState,
        jobDemands: prevState.jobDemands.filter((jobDemand) => {
          return jobDemand.id !== id;
        }),
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err }));
    }
  };

  useEffect(() => {
    getJobOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOfferId]);

  return {
    jobDemands: state.jobDemands,
    deleteCandidate,
    loading: state.loading,
    error: state.error,
  };
};

export const JobOffersCandidates = () => {
  const router = useRouter();
  const { jobOfferId } = router.query;
  const { loading, jobDemands, error, deleteCandidate } =
    useJobDemands(jobOfferId);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(jobDemands);
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

  const selectedAll = selected.length === jobDemands?.length;
  const selectedSome =
    selected.length > 0 && selected.length < jobDemands?.length;
  const enableBulkActions = selected.length > 0;

  const isDescartableDemand = (jobDemand) => {
    const parseResponses = JSON.parse(jobDemand.answers_form);
    const isDiscartable = parseResponses.some((response) => {
      return (
        response.question?.is_discartable &&
        response.question.content.some((content) => {
          return content.isDiscartable && content.value === response.answer;
        })
      );
    });
    return !isDiscartable;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {enableBulkActions && (
        <Stack
          direction={'row'}
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
            px: 2.0,
            py: 2.0,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button
            color="error"
            size="small"
            onClick={() => {
              selected.forEach((id) => deleteCandidate(id));
              deselectAll();
            }}
          >
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Valorable</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Currículum</TableCell>
              <TableCell>Formulario</TableCell>
              <TableCell>Arch. Adjunto</TableCell>
              <TableCell>
                <TableSortLabel>Fecha Solicitud</TableSortLabel>
              </TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 3 }} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Buscando...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {jobDemands?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 3 }} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay candidatos para esta oferta de empleo.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {jobDemands &&
              !loading &&
              !error &&
              jobDemands?.map((jobCandidate) => {
                return (
                  <TableRow key={jobCandidate.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(jobCandidate.id)}
                        onChange={(event) => {
                          const { checked } = event.target;

                          if (checked) {
                            selectOne(jobCandidate.id);
                          } else {
                            deselectOne(jobCandidate.id);
                          }
                        }}
                        value={selected.includes(jobCandidate.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', margin: 'auto' }}>
                      {isDescartableDemand(jobCandidate) ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>{jobCandidate.demand_name}</TableCell>
                    <TableCell>{jobCandidate.demand_surname}</TableCell>
                    <TableCell>{jobCandidate.demand_email}</TableCell>
                    <TableCell>{jobCandidate.demand_phone}</TableCell>
                    <TableCell sx={{ textAlign: 'center', margin: 'auto' }}>
                      {jobCandidate.demand_cv_source ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="warning" />
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', margin: 'auto' }}>
                      {jobCandidate.answers_form ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="warning" />
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', margin: 'auto' }}>
                      {jobCandidate.demand_additional_archive ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(jobCandidate.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/rrhh/${jobOfferId}/${jobCandidate.id}`}
                      >
                        Ver Perfil
                      </Link>
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
