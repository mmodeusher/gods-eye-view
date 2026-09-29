import {
  epoch,
  httpError,
  readResponse,
  admitRecords,
} from '../live/contract.js';

const defaultFetch = (...args) => globalThis.fetch(...args);

/** Normalizes a single SparrowMap sighting into the project's standard record format. */
function normalizeSighting(s) {
  // SparrowMap uses seconds for 'ts'; project uses milliseconds.
  // We use epoch() to ensure we handle the conversion safely.
  const ms = epoch(s.ts, 1000);
  if (ms == null) return null;

  return {
    id: String(s.id),
    lat: s.lat,
    lon: s.lon,
    ts: ms,
    vclass: s.vclass,
    heading: s.heading ?? null,
    speed_mph: s.speed_mph ?? null,
    // We can add more metadata here if needed
    metadata: {
      tier: s.tier,
      color: s.color,
      make: s.make,
      model: s.model,
    },
  };
}

/** 
 * SparrowMap live source.
 * Polling the /api/sightings endpoint.
 */
export function createSparrowSource({
  fetchImpl = defaultFetch,
  now = () => Date.now(),
  baseUrl = 'https://map.sparrowmap.com',
} = {}) {
  return {
    label: 'SparrowMap',
    async getSnapshot(query = {}, { signal } = {}) {
      const params = new URLSearchParams();
      
      // Support 'since' filtering
      if (query.since) {
        // SparrowMap expects unix seconds.
        params.set('since', Math.floor(query.since / 1000));
      }
      
      // Support 'limit'
      if (query.limit) {
        params.set('limit', String(query.limit));
      }

      // Support 'vclass'
      if (query.vclass) {
        params.set('vclass', query.vclass);
      }

      // Support 'bbox' (S,W,N,E)
      if (query.bbox) {
        params.set('bbox', query.bbox);
      }

      const url = `${baseUrl}/api/sightings${params.toString() ? '?' + params : ''}`;
      
      const { response, payload } = await readResponse(
        fetchImpl,
        url,
        { signal },
        'SparrowMap',
      );

      if (!response.ok) {
        throw httpError(response, 'SparrowMap');
      }

      // admitRecords handles the normalization and duplicate removal
      return {
        ...admitRecords(payload, normalizeSighting, 'SparrowMap sighting'),
        status: response.status,
        now: now(),
      };
    },
  };
}
