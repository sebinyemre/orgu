/**
 * Eser çizimleri: seçilen ip renkleriyle yeniden boyanan el çizimi sahneler.
 *   <WorkIllustration kind="scarf" variant="garter" colors={['#46698a']} />
 */
import type { ReactElement } from 'react';
import type { IllustrationKey } from '@/content/works';
import { BagPiece, BallPiece, BeaniePiece, BlanketPiece, BootiesPiece, CoastersPiece, CowlPiece, DishclothPiece, GrannyPiece, HeadbandPiece, ScarfPiece, type PieceProps } from './pieces';

const PIECES: Record<IllustrationKey, (p: PieceProps) => ReactElement> = {
  scarf: ScarfPiece,
  beanie: BeaniePiece,
  cowl: CowlPiece,
  blanket: BlanketPiece,
  ball: BallPiece,
  coasters: CoastersPiece,
  granny: GrannyPiece,
  dishcloth: DishclothPiece,
  booties: BootiesPiece,
  bag: BagPiece,
  headband: HeadbandPiece,
};

export interface WorkIllustrationProps {
  kind: IllustrationKey;
  variant?: string;
  colors: string[];
  /** erişilebilir ad; verilmezse süs kabul edilir */
  title?: string;
  className?: string;
  width?: number | string;
}

export function WorkIllustration({ kind, variant, colors, title, className, width = '100%' }: WorkIllustrationProps) {
  const Piece = PIECES[kind];
  return (
    <svg viewBox="0 0 200 160" width={width} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <Piece colors={colors.length ? colors : ['#b5523b']} variant={variant} />
    </svg>
  );
}
