import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Send01Icon from '@untitled-ui/icons-react/build/esm/Send01';
import {
  Box,
  IconButton,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Eye, EyeOff } from '@untitled-ui/icons-react';
import { returnsApi } from '../../api/returns';

export const ChatMessageAdd = (props) => {
  const { disabled, placeholder, onSend, orderReturn, refetch, ...other } =
    props;
  const fileInputRef = useRef(null);
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChange = useCallback((event) => {
    setBody(event.target.value);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = useCallback(async () => {
    setLoading(true);
    if (!body) return;
    await returnsApi
      .postMessage(orderReturn.id, {
        body,
        file,
        visible: visible ? 1 : 0,
      })
      .then((response) => {
        if (response.status == 200) {
          setBody('');
          setFile(null);
          setVisible(false);
        }
        refetch();
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, file, visible]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!event.shiftKey && event.code === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return (
    <Box>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        sx={{
          px: 3,
          py: 1,
        }}
        {...other}
      >
        <TextField
          disabled={disabled}
          fullWidth
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Deja un mensaje'}
          size="medium"
          value={body}
          hiddenLabel
          multiline
          maxRows={2}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            ml: 2,
          }}
        >
          <Tooltip title="Enviar">
            <Box sx={{ m: 1 }}>
              <IconButton
                color="primary"
                edge="end"
                disabled={!body || disabled || loading}
                onClick={sendMessage}
              >
                <SvgIcon>
                  <Send01Icon />
                </SvgIcon>
              </IconButton>
            </Box>
          </Tooltip>

          <Tooltip
            title={
              !visible
                ? 'Mensaje invisible para el cliente'
                : 'Mensaje visible para el cliente'
            }
          >
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'inline-flex',
                },
                m: 1,
              }}
            >
              <IconButton
                disabled={disabled}
                edge="end"
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                <SvgIcon>{!visible ? <EyeOff /> : <Eye />}</SvgIcon>
              </IconButton>
            </Box>
          </Tooltip>
          <Tooltip title="Adjuntar archivo">
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'inline-flex',
                },
                m: 1,
              }}
            >
              <IconButton disabled={disabled} edge="end" onClick={handleAttach}>
                <SvgIcon>
                  <Attachment01Icon />
                </SvgIcon>
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
        <input
          hidden
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
        />
      </Stack>
      {file && (
        <Box
          sx={{
            px: 3,
            pb: 1,
          }}
        >
          <Stack direction={'row'} spacing={2}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              spacing={1}
              style={{
                position: 'relative',
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file?.name}
                style={{
                  width: '150px',
                  height: '200px',
                  border: '1px solid #ccc',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '33px',
                  height: '33px',
                  display: 'flex',
                  zIndex: 99,
                  top: '10px',
                  right: '5px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  borderRadius: '50%',
                }}
              >
                <IconButton
                  onClick={() => {
                    setFile(null);
                  }}
                  size={'small'}
                >
                  <SvgIcon>
                    <CloseIcon />
                  </SvgIcon>
                </IconButton>
              </Box>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

ChatMessageAdd.propTypes = {
  disabled: PropTypes.bool,
  refetch: PropTypes.func,
  placeholder: PropTypes.string,
  orderReturn: PropTypes.object,
};

ChatMessageAdd.defaultProps = {
  disabled: false,
};
