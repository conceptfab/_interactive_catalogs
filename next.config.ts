import type { NextConfig } from 'next';
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from 'next/constants';

const PROD_DIST_DIR = '.next-build';
const DEV_DIST_DIR = '.next';

export default function nextConfig(phase: string): NextConfig {
  const isProdPhase =
    phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER;

  return {
    // Keep dev output in `.next`, but isolate production build/start output
    // so concurrent dev/build processes cannot race on the same manifests.
    distDir: isProdPhase ? PROD_DIST_DIR : DEV_DIST_DIR,
  };
}
