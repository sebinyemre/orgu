import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Star, Trash2 } from 'lucide-react';
import type { Project } from '@/types';
import { EmptyState } from '@/ui/EmptyState';
import { Modal } from '@/ui/Modal';
import { Tape } from '@/ui/Tape';
import { confirmDialog } from '@/ui/Confirm';
import { useMsgs } from '@/i18n';
import { COMMON } from '@/i18n/common';
import { useProjects } from '@/store/projects';
import { toast } from '@/store/toast';
import { deletePhoto, savePhoto } from '@/lib/photos';
import { PRJ } from '../i18n';
import { PhotoImg } from '../ProjectCard';
import { forgetPhoto } from '../hooks';

export function PhotosTab({ project: p }: { project: Project }) {
  const t = useMsgs(PRJ);
  const tc = useMsgs(COMMON);
  const update = useProjects((s) => s.update);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<number | null>(null);
  const n = p.photoIds.length;
  // Modal'a kararlı kapatma işlevi verilmeli; yoksa her çizimde odak sıfırlanır
  const closeViewer = useCallback(() => setView(null), []);

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    try {
      for (const f of files) {
        const id = await savePhoto(f);
        const cur = useProjects.getState().projects.find((x) => x.id === p.id);
        if (cur) update(p.id, { photoIds: [...cur.photoIds, id] });
      }
    } catch {
      toast(t.uploadError, { tone: 'warn' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!(await confirmDialog(t.deletePhotoConfirm, { confirmLabel: tc.delete, danger: true }))) return;
    const ids = p.photoIds.filter((x) => x !== id);
    update(p.id, { photoIds: ids });
    forgetPhoto(id);
    void deletePhoto(id);
    setView((v) => (v === null || ids.length === 0 ? null : Math.min(v, ids.length - 1)));
  };
  const makeCover = (id: string) => {
    update(p.id, { photoIds: [id, ...p.photoIds.filter((x) => x !== id)] });
    setView(0);
  };

  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setView((v) => (v === null ? v : (v - 1 + n) % n));
      if (e.key === 'ArrowRight') setView((v) => (v === null ? v : (v + 1) % n));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, n]);

  const current = view !== null ? p.photoIds[view] : undefined;

  const addBtn = (
    <button type="button" className="btn btn-primary" onClick={() => input.current?.click()} disabled={busy} aria-busy={busy}>
      <ImagePlus />
      {busy ? tc.loading : t.addPhoto}
    </button>
  );

  return (
    <div className="stack">
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={onFiles} />
      <div className="spread">
        <p className="xsmall faint" style={{ margin: 0 }}>
          {t.photosNote}
        </p>
        {n > 0 && addBtn}
      </div>
      {n === 0 ? (
        <EmptyState title={t.emptyPhotos} color={p.color} action={addBtn}>
          {t.emptyPhotosText}
        </EmptyState>
      ) : (
        <div className="prj-photos">
          {p.photoIds.map((id, i) => (
            <button key={id} type="button" className="prj-photo" onClick={() => setView(i)} aria-label={t.photoAlt(p.name, i + 1)}>
              <PhotoImg id={id} alt="" />
              {i === 0 && (
                <Tape tone="mustard" className="prj-photo-tape">
                  {t.cover}
                </Tape>
              )}
            </button>
          ))}
        </div>
      )}

      <Modal
        open={current !== undefined}
        onClose={closeViewer}
        wide
        title={view !== null ? t.photoN(view + 1, n) : undefined}
        footer={
          current && (
            <>
              <button type="button" className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => void remove(current)}>
                <Trash2 />
                {t.deletePhoto}
              </button>
              {view !== 0 && (
                <button type="button" className="btn btn-soft" onClick={() => makeCover(current)}>
                  <Star />
                  {t.makeCover}
                </button>
              )}
              {n > 1 && (
                <>
                  <button type="button" className="btn btn-icon" onClick={() => setView((v) => (v === null ? v : (v - 1 + n) % n))} aria-label={t.prev}>
                    <ChevronLeft />
                  </button>
                  <button type="button" className="btn btn-icon" onClick={() => setView((v) => (v === null ? v : (v + 1) % n))} aria-label={t.next}>
                    <ChevronRight />
                  </button>
                </>
              )}
            </>
          )
        }
      >
        {current && (
          <div className="prj-lightbox">
            <PhotoImg id={current} alt={t.photoAlt(p.name, (view ?? 0) + 1)} />
          </div>
        )}
      </Modal>
    </div>
  );
}
