/** Proje fotoğrafları IndexedDB'de saklanır (localStorage kotasını şişirmemek için). */
import { createStore, del, get, set, keys } from 'idb-keyval';
import { uid } from './id';
import { shrinkImage } from './download';

const store = typeof indexedDB !== 'undefined' ? createStore('ilmek-ilmek-foto', 'fotolar') : undefined;

export async function savePhoto(file: Blob): Promise<string> {
  const id = uid('foto');
  const dataUrl = await shrinkImage(file);
  if (store) await set(id, dataUrl, store);
  return id;
}

export async function loadPhoto(id: string): Promise<string | undefined> {
  if (!store) return undefined;
  return get<string>(id, store);
}

export async function deletePhoto(id: string): Promise<void> {
  if (store) await del(id, store);
}

export async function allPhotoIds(): Promise<string[]> {
  if (!store) return [];
  return (await keys(store)).map(String);
}
