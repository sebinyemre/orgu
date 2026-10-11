/** Uzun tığ ilmekleri (yarım trabzan, trabzanlar) için ortak adım kurucu: tığdaki ilmek sayısını doğru izler */
import { CrochetScene, crochetArrows } from '@/engine/illust/crochet';
import { YARN } from '@/engine/illust/theme';
import { l, type LessonStep } from './types';

const colors = (n: number) => [YARN.second, ...Array.from({ length: n - 1 }, () => YARN.main)];

/**
 * @param yo   ilmeğe batmadan önce kaç kez ip atılır (hdc 1, dc 1, tr 2, dtr 3)
 * @param allAtOnce yarım trabzandaki gibi 3 ilmekten birden geçirilir mi
 * @param basic tığ terimi yer tutucusu ("hdc", "dc", "tr", "dtr")
 */
export function tallSteps(yo: number, allAtOnce: boolean, basic: string): LessonStep[] {
  const steps: LessonStep[] = [];
  const B = `{${basic}}`;
  steps.push({
    title: l(yo > 1 ? `${yo} kez ip at` : 'İp at', yo > 1 ? `Yarn over ${yo} times` : 'Yarn over', yo > 1 ? `${yo} lazadas` : 'Lazada', yo > 1 ? `${yo} laçadas` : 'Laçada'),
    text: l(
      `Batmadan önce ipi tığa ${yo} kez sar. Tığda ${1 + yo} ilmek olur.`,
      `Before inserting, wrap the yarn around the hook ${yo} time${yo > 1 ? 's' : ''}. There are ${1 + yo} loops on the hook.`,
      `Antes de entrar, enrolla la hebra ${yo} ${yo > 1 ? 'veces' : 'vez'}. Hay ${1 + yo} lazos en la aguja.`,
      `Antes de entrar, enrole o fio ${yo} ${yo > 1 ? 'vezes' : 'vez'}. Há ${1 + yo} alças na agulha.`,
    ),
    scene: () => <CrochetScene hook="up" loops={yo} yo yoDraw={[0.1, 0.6]} loopColors={Array.from({ length: yo }, () => YARN.main)} arrows={crochetArrows.yo(1)} />,
    loopsOnHook: 1 + yo,
  });
  steps.push({
    title: l('Bat', 'Insert', 'Entra', 'Entre'),
    text: l('Tığı sonraki ilmeğin iki halkasının altından sok.', 'Insert the hook under both loops of the next stitch.', 'Mete el ganchillo bajo las dos hebras del siguiente punto.', 'Insira a agulha sob as duas alças do ponto seguinte.'),
    scene: () => <CrochetScene hook="inserted" hookFrom="up" loops={1 + yo} loopColors={Array.from({ length: 1 + yo }, () => YARN.main)} target arrows={crochetArrows.insert(2)} />,
    loopsOnHook: 1 + yo,
  });
  steps.push({
    title: l('İp at ve çek', 'Yarn over, pull up', 'Lazada y saca', 'Laçada e puxe'),
    text: l(
      `İpi tığa sar ve ilmeğin içinden öne çek. Tığda ${2 + yo} ilmek var.`,
      `Yarn over and pull up a loop through the stitch. There are ${2 + yo} loops on the hook.`,
      `Lazada y saca un lazo por el punto. Hay ${2 + yo} lazos.`,
      `Laçada e puxe uma alça pelo ponto. Há ${2 + yo} alças.`,
    ),
    scene: () => <CrochetScene hook="pulled" hookFrom="inserted" loops={2 + yo} pulledLoop loopColors={colors(2 + yo)} arrows={crochetArrows.pullUp(3)} />,
    loopsOnHook: 2 + yo,
  });
  if (allAtOnce) {
    steps.push({
      title: l('Üçünden birden geçir', 'Through all three', 'Cierra las tres', 'Feche as três'),
      text: l(`İp at ve tığdaki 3 ilmeğin hepsinden birden çek. Bir ${B} tamam.`, `Yarn over and pull through all 3 loops at once. One ${B} done.`, `Lazada y cierra los 3 lazos de una vez. Un ${B} hecho.`, `Laçada e feche as 3 alças de uma vez. Um ${B} pronto.`),
      scene: () => <CrochetScene hook="pulled" loops={3} pulledLoop loopColors={colors(3)} yo through={{ n: 4, at: [0.2, 0.6] }} arrows={crochetArrows.through(4)} />,
      loopsOnHook: 1,
    });
  } else {
    let loops = 2 + yo;
    let k = 4;
    while (loops > 1) {
      const before = loops;
      const n = k;
      steps.push({
        title: l(`İp at, 2’sinden geçir`, `Yarn over, through 2`, `Lazada, cierra 2`, `Laçada, feche 2`),
        text: l(
          `İp at ve yalnızca ilk 2 ilmekten geçir. Tığda ${before - 1} ilmek kalır.${before - 1 === 1 ? ` Bir ${B} tamam.` : ''}`,
          `Yarn over and pull through the first 2 loops only. ${before - 1} loop${before - 1 > 1 ? 's' : ''} remain${before - 1 > 1 ? '' : 's'}.${before - 1 === 1 ? ` One ${B} done.` : ''}`,
          `Lazada y cierra solo los 2 primeros lazos. Quedan ${before - 1}.${before - 1 === 1 ? ` Un ${B} hecho.` : ''}`,
          `Laçada e feche só as 2 primeiras alças. Ficam ${before - 1}.${before - 1 === 1 ? ` Um ${B} pronto.` : ''}`,
        ),
        scene: () => <CrochetScene hook="pulled" loops={before} pulledLoop={before === 2 + yo} loopColors={colors(before)} yo through={{ n: 2, at: [0.2, 0.6] }} arrows={crochetArrows.through(n)} />,
        loopsOnHook: before - 1,
      });
      loops -= 1;
      k += 1;
    }
  }
  return steps;
}
