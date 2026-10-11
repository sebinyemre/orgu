/**
 * Geri al / yinele yığını. Anlık görüntüler saklanır; toplam boyut (hücre sayısı) sınırlanır
 * ki 200×200'lük grafiklerde bellek şişmesin.
 */
export class History<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  constructor(
    private readonly limit = 100,
    private readonly sizeOf: (s: T) => number = () => 1,
    private readonly budget = Infinity,
  ) {}

  /** Değişiklikten ÖNCEKİ durumu kaydeder; yinele yığını boşalır */
  push(before: T): void {
    this.undoStack.push(before);
    this.redoStack = [];
    this.trim();
  }

  /** current: şu anki durum (yinele için saklanır). Geri alınacak durumu döndürür. */
  undo(current: T): T | undefined {
    const prev = this.undoStack.pop();
    if (prev === undefined) return undefined;
    this.redoStack.push(current);
    return prev;
  }

  redo(current: T): T | undefined {
    const next = this.redoStack.pop();
    if (next === undefined) return undefined;
    this.undoStack.push(current);
    return next;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  get size(): number {
    return this.undoStack.length;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  private trim(): void {
    while (this.undoStack.length > this.limit) this.undoStack.shift();
    if (this.budget === Infinity) return;
    let total = this.undoStack.reduce((n, s) => n + this.sizeOf(s), 0);
    while (this.undoStack.length > 1 && total > this.budget) total -= this.sizeOf(this.undoStack.shift()!);
  }
}
