import api from './api';

export interface RunInfo {
  user_id: number;
  run_id: number;
  run_type: 'AERMOD' | 'AERSCREEN' | 'AERSURFACE' | 'AERMET' | 'AERMINUTE' | 'BPIPPRM';
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'FAIL';
  created_on: string;
  finished_on?: string | null;
}

export interface DashboardStats {
  runs_in_progress: number;
  runs_completed: number;
  runs_failed: number;
  total_runs: number;
  recent_runs: RunInfo[];
}

class DashboardService {
  async fetchAllRuns(): Promise<RunInfo[]> {
    try {
      // Fetch all runs from different modules in parallel
      const [aermodRuns, aerscreenRuns, aersurfaceRuns] = await Promise.all([
        api.get<RunInfo[]>('/list/aermod/all'),
        api.get<RunInfo[]>('/list/aerscreen/all'),
        api.get<RunInfo[]>('/list/aersurface/all')
      ]);

      // Combine all runs
      const allRuns = [
        ...aermodRuns.data,
        ...aerscreenRuns.data,
        ...aersurfaceRuns.data
      ];

      // Sort by created_on date (most recent first)
      return allRuns.sort((a, b) => 
        new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
      );
    } catch (error) {
      console.error('Error fetching all runs:', error);
      return [];
    }
  }

  async fetchRunsByStatus(): Promise<{
    inProgress: RunInfo[];
    finished: RunInfo[];
    failed: RunInfo[];
  }> {
    try {
      const [inProgress, finished, failed] = await Promise.all([
        api.get<RunInfo[]>('/list/any/in-progress'),
        api.get<RunInfo[]>('/list/any/finished'),
        api.get<RunInfo[]>('/list/any/fail')
      ]);

      return {
        inProgress: inProgress.data,
        finished: finished.data,
        failed: failed.data
      };
    } catch (error) {
      console.error('Error fetching runs by status:', error);
      return {
        inProgress: [],
        finished: [],
        failed: []
      };
    }
  }

  async fetchDashboardStats(): Promise<DashboardStats> {
    try {
      const runsByStatus = await this.fetchRunsByStatus();
      const allRuns = await this.fetchAllRuns();

      return {
        runs_in_progress: runsByStatus.inProgress.length,
        runs_completed: runsByStatus.finished.length,
        runs_failed: runsByStatus.failed.length,
        total_runs: allRuns.length,
        recent_runs: allRuns.slice(0, 10) // Get 10 most recent runs
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async fetchRunDetails(runId: string) {
    try {
      const response = await api.get(`/results/any/run/${runId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching run details for ${runId}:`, error);
      throw error;
    }
  }

  async fetchRunMessages(runId: string) {
    try {
      const response = await api.get(`/results/any/run/${runId}/messages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching run messages for ${runId}:`, error);
      throw error;
    }
  }

  // Helper method to get runs for current month
  getRunsThisMonth(runs: RunInfo[]): RunInfo[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return runs.filter(run => {
      const runDate = new Date(run.created_on);
      return runDate.getMonth() === currentMonth && 
             runDate.getFullYear() === currentYear;
    });
  }
}

const dashboardService = new DashboardService();
export default dashboardService;