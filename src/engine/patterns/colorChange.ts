/** Renk değiştirme cümlesi (dört dilde, ders bağlantılı) */
import type { Craft, Lang } from '@/types';
import { lk } from './builder';

const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
import { WORDS, colorName } from './common';
import type { YarnSpec } from './types';

export function colorChangeText(lang: Lang, craft: Craft, idx: number, yarn: YarnSpec, link: boolean): string {
  const letter = WORDS[lang].colorLetter(idx);
  const name = colorName(yarn, idx, lang);
  const id = craft === 'crochet' ? 'tig-renk-degistirme' : 'sis-uc-gizleme';
  const L = (t: string) => (link ? lk(id, t) : t);
  if (craft === 'crochet') {
    switch (lang) {
      case 'tr':
        return `${L(`${letter}ne geç`)} (${name}): önceki ilmeğin son çekişini yeni renkle yap.`;
      case 'en':
        return `${L(`Change to ${letter}`)} (${name}) on the last pull-through of the previous stitch.`;
      case 'es':
        return `${L(`Cambiar al ${lowerFirst(letter)}`)} (${name}) en el último cierre del punto anterior.`;
      case 'pt':
        return `${L(`Trocar para a ${lowerFirst(letter)}`)} (${name}) no último fechamento do ponto anterior.`;
    }
  }
  switch (lang) {
    case 'tr':
      return `${L(`${letter}ne geç`)} (${name}): yeni ipi ekleyip örmeye başla, uçları sonra gizle.`;
    case 'en':
      return `${L(`Change to ${letter}`)} (${name}): drop the old yarn and start knitting with the new one; weave in the ends later.`;
    case 'es':
      return `${L(`Cambiar al ${lowerFirst(letter)}`)} (${name}): dejar el hilo anterior y tejer con el nuevo; esconder las hebras al final.`;
    case 'pt':
      return `${L(`Trocar para a ${lowerFirst(letter)}`)} (${name}): deixar o fio anterior e tricotar com o novo; esconder as pontas no final.`;
  }
}

/** Birleştirilen turlarda: turu kapatan kör ilmeği yeni renkle yap */
export function joinWithColorText(lang: Lang, idx: number, yarn: YarnSpec): string {
  const letter = WORDS[lang].colorLetter(idx);
  const name = colorName(yarn, idx, lang);
  switch (lang) {
    case 'tr':
      return `Turu ${lk('tig-renk-degistirme', `${letter}yle`)} (${name}) {slst} yaparak kapat; eski rengi 10 cm uç bırakıp kes.`;
    case 'en':
      return `Work the joining {slst.a} with ${lk('tig-renk-degistirme', letter)} (${name}); cut the old color leaving a 10 cm (4") tail.`;
    case 'es':
      return `Hacer el {slst} de cierre con el ${lk('tig-renk-degistirme', lowerFirst(letter))} (${name}); cortar el color anterior dejando 10 cm.`;
    case 'pt':
      return `Fazer o {slst} de fechamento com a ${lk('tig-renk-degistirme', lowerFirst(letter))} (${name}); cortar a cor anterior deixando 10 cm.`;
  }
}
