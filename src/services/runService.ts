import api from './api';
import { AerscreenRequest, RunInfo } from '../types/api';
import { CancelToken } from 'axios';

export const runService = {
  startRun: async (request: AerscreenRequest, cancelToken?: CancelToken): Promise<{ run_id: string }> => {
    const response = await api.post('/run/start', request, { cancelToken });
    return response.data;
  },
  
  getRunInfo: async (runId: string, cancelToken?: CancelToken): Promise<RunInfo> => {
    const response = await api.get(`/run/${runId}/info`, { cancelToken });
    return response.data;
  },

  listRuns: async (cancelToken?: any): Promise<string[]> => {
    const res = await api.get<string[]>('/run/list', { cancelToken });
    return res.data;
  }
};