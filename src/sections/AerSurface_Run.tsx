import { useEffect, useState } from 'react';
import { Stack, Button, CircularProgress, Alert, Typography, Paper, LinearProgress, Fade } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios, { isAxiosError } from 'axios';
import { useAersurface } from '../context/AersurfaceContext';

type Status = 'idle' | 'running' | 'done' | 'error';

export default function AerSurfaceRun() {
  const { formData } = useAersurface();
  const [runId,   setRunId]   = useState<string>();
  const [status,  setStatus]  = useState<Status>('idle');
  const [error,   setError]   = useState<string>();
  const [fileUrl, setFileUrl] = useState<string>();

  /* ---------- start run ---------- */
  const handleRun = async () => {
    setStatus('running');
    setError(undefined);

    try {
      /* POST the collected inputs */
      const { data } = await axios.post('https://l47qj.wiremockapi.cloud/aersurface/run/start', {
        model: 'aersurface',   // lets backend know which runner
        inputs: formData
      });

      setRunId(String(data.run_id));
    } catch (e: any) {
      setStatus('error');
      setError(e.message ?? 'Failed to start run');
    }
  };

  /* ---------- poll for completion ---------- */
  useEffect(() => {
    if (!runId) return;

    const int = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `https://l47qj.wiremockapi.cloud/aersurface/run/${runId}/fetch`
        );

        /* finished successfully ? */
        if (data.file_url || data.finished_on) {
          setStatus('done');
          setFileUrl(data.file_url);
          clearInterval(int);
          return;
        }

        /* failed ? */
        if (
          ['error', 'failed'].includes(String(data.status).toLowerCase())
        ) {
          setStatus('error');
          setError(data.message ?? 'Run failed');
          clearInterval(int);
          return;
        }

        /* still running */
        setStatus('running');
      } catch (err: any) {
        setStatus('error');
        setError(isAxiosError(err) ? err.message : 'Could not poll run progress');
        clearInterval(int);
      }
    }, 3000);

    return () => clearInterval(int);
  }, [runId]);

  /* ---------- UI ---------- */
  return (
    <Stack spacing={3} maxWidth={560}>
      {/* IDLE ––––––––––––––––––––––––––––––––––––––––––––– */}
      {status === 'idle' && (
        <Button
          variant="contained"
          size="large"
          onClick={handleRun}
          sx={{ alignSelf: 'flex-start' }}
        >
          Run AERSURFACE
        </Button>
      )}

      {/* RUNNING ––––––––––––––––––––––––––––––––––––––––– */}
      <Fade in={status === 'running'} unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderLeft: t => `6px solid ${t.palette.primary.main}`,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={28} color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Generating surface-characteristics file …
              </Typography>
            </Stack>

            {/* animated strip */}
            <LinearProgress />
          </Stack>
        </Paper>
      </Fade>

      {/* SUCCESS –––––––––––––––––––––––––––––––––––––––– */}
      <Fade in={status === 'done'} unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderLeft: t => `6px solid ${t.palette.success.main}`,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CheckCircleIcon color="success" fontSize="large" />
              <Typography variant="h6" fontWeight={600}>
                File ready
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Your surface-characteristics file has been generated successfully.
            </Typography>

            {fileUrl && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                href={fileUrl}
                download
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                Download file
              </Button>
            )}
          </Stack>
        </Paper>
      </Fade>

      {/* ERROR ––––––––––––––––––––––––––––––––––––––––––– */}
      {status === 'error' && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}