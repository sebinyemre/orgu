/**
 * Başka modüllerin bileşenlerini (PatternView, ChartView) tembel yükler ve hata sınırıyla sarar.
 * Böylece o modüllerden birinde bir sorun olursa yalnızca ilgili sekme etkilenir, proje sayfası açılmaya devam eder.
 */
import { Component, Suspense, lazy, type ReactNode } from 'react';
import type { PatternViewProps } from '@/features/recipe/PatternView';
import type { ChartViewProps } from '@/features/chart/ChartView';
import { YarnBall } from '@/ui/YarnBall';

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const LazyPatternView = lazy(() => import('@/features/recipe/PatternView').then((m) => ({ default: m.PatternView })));
const LazyChartView = lazy(() => import('@/features/chart/ChartView').then((m) => ({ default: m.ChartView })));

const spinner = (
  <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--space-5)' }}>
    <YarnBall color="#b5523b" size={40} tail={false} />
  </div>
);

export function SafePatternView({ fallback, ...props }: PatternViewProps & { fallback: ReactNode }) {
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={spinner}>
        <LazyPatternView {...props} />
      </Suspense>
    </Boundary>
  );
}

export function SafeChartView({ fallback, ...props }: ChartViewProps & { fallback: ReactNode }) {
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={spinner}>
        <LazyChartView {...props} />
      </Suspense>
    </Boundary>
  );
}
