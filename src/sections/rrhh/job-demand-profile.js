import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Stack,
  Box,
  Button,
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  TextField,
  CardActionArea,
  CardMedia,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/material';
import { JobDemandModal } from './job-demand-modal';

export const JobDemandProfile = ({ candidate }) => {
  const [openCVModal, setOpenCVModal] = useState(false);
  const [openOtherFilesModal, setOpenOtherFilesModal] = useState(false);

  const parseAnswers = useMemo(() => {
    const parsed = JSON.parse(candidate?.answers_form);
    const filtered = parsed.filter(
      (object) =>
        object.answer !== '' &&
        object.answer !== null &&
        object.answer !== undefined &&
        object.answer.length !== 0,
    );
    return filtered;
  }, [candidate]);

  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader
                  title="Detalles del solicitante"
                  subheader="Principal información del candidato a la oferta."
                />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Nombre completo"
                      name="demand_name"
                      value={`${candidate?.demand_name || ''} ${
                        candidate?.demand_surname || ''
                      }`}
                      variant="outlined"
                    />
                    <TextField
                      label="Email"
                      name="demand_email"
                      value={candidate?.demand_email || ''}
                      variant="outlined"
                    />
                    <TextField
                      label="Localidad"
                      name="locality"
                      value={`${candidate?.demand_locality || ''}`}
                      variant="outlined"
                    />
                    <TextField
                      label="Teléfono"
                      name="demand_phone"
                      value={candidate?.demand_phone || ''}
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardHeader title="Respuestas del Formulario" />
                <Divider />
                <CardContent>
                  <Stack spacing={2}>
                    {parseAnswers.map((answer, index) => {
                      switch (answer.question.type) {
                        case 'text':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'long_text':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'select':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Typography
                                key={answer.answer}
                                variant="body2"
                                sx={{ ml: 2 }}
                              >
                                {answer.answer}
                              </Typography>
                            </FormControl>
                          );
                        case 'select_multiple':
                          return (
                            <FormControl key={index}>
                              <FormLabel id="demo-radio-buttons-group-label">
                                {answer.question.question_text}
                              </FormLabel>
                              <Stack direction={'column'} sx={{ my: 1 }}>
                                {answer.answer.map((option) => {
                                  return (
                                    <Typography
                                      key={option}
                                      variant="body2"
                                      sx={{ ml: 2 }}
                                    >
                                      {option}
                                    </Typography>
                                  );
                                })}
                              </Stack>
                            </FormControl>
                          );
                      }
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card>
                <CardHeader
                  title="Currículum Vitae"
                  subheader="Click para ver el documento completo"
                />
                <Divider />
                <CardContent>
                  {candidate?.demand_cv_source ? (
                    <CardActionArea>
                      {candidate?.demand_cv_source
                        .substring()
                        .includes('.pdf') ? (
                        <Stack direction={'column'} gap={2}>
                          <Typography>
                            El candidato ha subido un archivo PDF como CV, y no
                            se puede previsualizar.
                          </Typography>
                          <Link
                            href={candidate?.demand_cv_source}
                            target="_blank"
                            rel="noopener"
                          >
                            <Button variant="contained" color="primary">
                              Ver PDF
                            </Button>
                          </Link>
                        </Stack>
                      ) : (
                        <CardMedia
                          sx={{ objectFit: 'cover', objectPosition: 'top' }}
                          onClick={() => setOpenCVModal(true)}
                          height="450"
                          image={candidate?.demand_cv_source}
                          src="img"
                          alt="Curriculum Vitae"
                        />
                      )}
                      <JobDemandModal
                        src={candidate.demand_cv_source}
                        open={openCVModal}
                        onClose={() => setOpenCVModal(false)}
                      />
                    </CardActionArea>
                  ) : (
                    <Typography>El candidato no ha subido su CV</Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title="Archivo Adicional"
                  subheader="Click para ver el documento completo"
                />
                <Divider />
                <CardContent>
                  {candidate?.demand_additional_archive ? (
                    <CardActionArea>
                      {candidate?.demand_additional_archive
                        .substring()
                        .includes('.pdf') ? (
                        <Stack direction={'column'} gap={2}>
                          <Typography>
                            El candidato ha subido un archivo PDF como archivo
                            adicional, y no se puede previsualizar.
                          </Typography>
                          <Link
                            href={candidate?.demand_additional_archive}
                            target="_blank"
                            rel="noopener"
                          >
                            <Button variant="contained" color="primary">
                              Ver archivo
                            </Button>
                          </Link>
                        </Stack>
                      ) : (
                        <CardMedia
                          sx={{ objectFit: 'cover', objectPosition: 'top' }}
                          onClick={() => setOpenCVModal(true)}
                          height="450"
                          image={candidate?.demand_additional_archive}
                          src="img"
                          alt="Curriculum Vitae"
                        />
                      )}
                      <JobDemandModal
                        src={candidate.demand_additional_archive}
                        open={openOtherFilesModal}
                        onClose={() => setOpenOtherFilesModal(false)}
                      />
                    </CardActionArea>
                  ) : (
                    <Typography>
                      El candidato no ha subido ningún archivo adicional.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
};
