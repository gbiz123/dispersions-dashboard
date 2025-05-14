import api from './api';
import { CancelToken } from 'axios';          // ⬅ make sure we have the type

/* ------------------------------------------------------------------ */
/*  Raw objects delivered by WireMock                                 */
/* ------------------------------------------------------------------ */
export interface FlowSectorConcentration {
  flow_sector_deg: number;
  max_1_hr_conc: number;
  worst_case: boolean;
}

export interface DistanceMaxConcentration {
  dist: number;
  conc: number;
}

export interface FlowSectorAPI {
  flow_sector_deg: number;
  max_1_hr_conc?: number;   // new backend name
  max_1hr_conc?: number;    // old backend name
  worst_case?: boolean;     // <-- add; present in payload
  dist?: number;            // optional; not used in charts
}

/* ------------------------------------------------------------------ */
/*  Normalised shapes consumed by the chart components                */
/* ------------------------------------------------------------------ */
export type NormalisedFlowSector   = {
  sector: number;           // renamed from deg → sector
  conc: number;
  worst: boolean;
};
export type NormalisedDistanceConc = { dist: number;   conc: number };

type MaybeWrapped<T> =
  | T                               // raw array
  | { data: T }                     // { data: [...] }
  | { result: T }                   // { result: [...] }
  | { payload: T };                 // generic fallback

function unwrap<T>(payload: MaybeWrapped<T>): T {
  /* stringified JSON ------------------------------------------------ */
  if (typeof payload === 'string') {
    try {
      return unwrap(JSON.parse(payload) as any);     // first, try normally
    } catch {
      /* fallback ─ remove trailing commas ( ,]  or ,} ) and try again */
      try {
        const sanitised = payload.replace(/,\s*([}\]])/g, '$1');
        return unwrap(JSON.parse(sanitised) as any);
      } catch {
        return [] as unknown as T;                   // still broken → empty
      }
    }
  }

  /* real array ------------------------------------------------------ */
  if (Array.isArray(payload)) return payload as unknown as T;

  /* common wrappers ------------------------------------------------- */
  if (Array.isArray((payload as any).data))    return (payload as any).data;
  if (Array.isArray((payload as any).result))  return (payload as any).result;
  if (Array.isArray((payload as any).payload)) return (payload as any).payload;

  /* array-like object with numeric keys ----------------------------- */
  if (
    payload &&
    typeof payload === 'object' &&
    Object.keys(payload).every(k => !isNaN(+k))
  ) {
    return Object.values(payload) as unknown as T;
  }

  return [] as unknown as T;
}

const normaliseFlowSector = (row: FlowSectorAPI): NormalisedFlowSector => ({
  sector: row.flow_sector_deg,
  conc:   row.max_1_hr_conc ?? row.max_1hr_conc ?? 0,
  worst:  row.worst_case ?? false,
});

export const resultService = {
  /* ----------------------- /flow-sector-conc ---------------------- */
  async getFlowSectorConcentrations(
    runId: string,
    cancelToken?: CancelToken
  ): Promise<NormalisedFlowSector[]> {
    const res = await api.get<MaybeWrapped<FlowSectorAPI[]>>(
      `/run/${runId}/flow-sector-conc`,
      { cancelToken }
    );

    // console.log('⇢ raw response from /flow-sector-conc', res.data);   // ★ NEW

    const raw = unwrap(res.data) ?? [];
    // console.log('⇢ after unwrap(), length =', raw.length);            // ★ NEW

    const normalised = raw.map(normaliseFlowSector);
    // console.log('⇢ after normalise, length =', normalised.length);    // ★ NEW

    return normalised;
  },

  /* ----------------------- /dist-max-conc ------------------------- */
  async getDistanceMaxConcentrations(runId: string): Promise<NormalisedDistanceConc[]> {
    const res = await api.get<MaybeWrapped<DistanceMaxConcentration[]>>(
      `/run/${runId}/dist-max-conc`,
    );

    const raw = unwrap(res.data) ?? [];

    return raw.map((r) => ({ dist: r.dist, conc: r.conc }));
  },
};