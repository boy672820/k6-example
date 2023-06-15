import { check } from 'k6';
import http from 'k6/http';

// 분당 100개의 요청을 1분간 보낸다.
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1m',
      duration: '1m',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
};

// --------------------------------------------------------

const BASE_URL = 'http://localhost:3000';

const getUrl = (path) => `${BASE_URL}${path}`;
const randomId = (min = 4700, max = 5000) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export default function () {
  const [r1, r2, r3] = http.batch([
    ['GET', getUrl(`/user/${randomId()}`)],
    ['GET', getUrl('/user/latest')],
    ['POST', getUrl('/user')],
  ]);

  check(r1, {
    'is status 200': (r) => r.status === 200,
    'is status 404': (r) => r.status === 404,
    'is status 500': (r) => r.status === 500,
    'is duration < 200ms': (r) => r.timings.duration < 200,
  });

  check(r2, {
    'is status 200': (r) => r.status === 200,
    'is status 404': (r) => r.status === 404,
    'is status 500': (r) => r.status === 500,
    'is duration < 200ms': (r) => r.timings.duration < 200,
  });

  check(r3, {
    'is status 500': (r) => r.status === 500,
    'is status 201': (r) => r.status === 201,
    'is duration < 200ms': (r) => r.timings.duration < 200,
  });
}
