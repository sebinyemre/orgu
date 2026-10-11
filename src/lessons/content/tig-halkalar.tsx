import { CLOSEUP_VIEW, LoopsCloseUpScene } from '@/engine/illust/closeup';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-halkalar',
  intro: l(
    'Her ilmeğin tepesinde iki halka vardır: sana yakın ön halka ve arkadaki arka halka. Normalde ikisine birden batarsın; yalnız birine batınca kumaşta çizgiler ve kabartmalar oluşur.',
    'Every stitch has two loops on top: the front loop nearest you and the back loop. Usually you go under both; working into just one creates ridges and texture.',
    'Cada punto tiene dos hebras arriba: la delantera y la trasera. Normalmente entras por las dos; por una sola, aparecen surcos y relieve.',
    'Cada ponto tem duas alças em cima: a da frente e a de trás. Normalmente você entra nas duas; numa só, surgem sulcos e relevo.',
  ),
  steps: [
    {
      title: l('İki halka', 'Both loops', 'Ambas hebras', 'As duas alças'),
      text: l('İlmeğin tepesine bak: önde ve arkada birer halka görürsün. Tığı ikisinin altından sokmak standarttır.', 'Look at the top of the stitch: one loop in front, one behind. Going under both is the standard.', 'Mira la parte de arriba: una hebra delante y otra detrás. Entrar bajo las dos es lo habitual.', 'Olhe o topo do ponto: uma alça na frente e outra atrás. Entrar sob as duas é o padrão.'),
      scene: () => <LoopsCloseUpScene part="both" n={1} />,
      viewBox: CLOSEUP_VIEW,
    },
    {
      title: l('Yalnız arka halka', 'Back loop only', 'Solo hebra trasera', 'Só alça de trás'),
      text: l('Tığı yalnızca arka halkanın altından sok. Ön halka boşta kalır ve kumaşta yatay bir çizgi oluşturur.', 'Insert under the back loop only. The front loop is left free and forms a horizontal line.', 'Entra solo bajo la hebra trasera. La delantera queda libre y forma una línea.', 'Entre só sob a alça de trás. A da frente fica livre e forma uma linha.'),
      scene: () => <LoopsCloseUpScene part="back" n={2} />,
      viewBox: CLOSEUP_VIEW,
      tip: l('Arka halkadan {sc} sıraları şiş lastiğine benzeyen bir doku verir; bere ağızları için harika.', 'Back-loop {sc} rows look like knitted ribbing: great for hat brims.', 'Las vueltas de {sc} por la hebra trasera parecen elástico de punto: ideales para gorros.', 'Carreiras de {sc} na alça de trás parecem ribana de tricô: ótimas para gorros.'),
    },
    {
      title: l('Yalnız ön halka', 'Front loop only', 'Solo hebra delantera', 'Só alça da frente'),
      text: l('Tığı yalnızca ön halkanın altından sok. Boşta kalan arka halkalar sonradan başka bir şey örmek için kullanılabilir.', 'Insert under the front loop only. The free back loops can be used later to work something else.', 'Entra solo bajo la hebra delantera. Las traseras libres sirven después para tejer otra cosa.', 'Entre só sob a alça da frente. As alças de trás livres servem depois para trabalhar outra coisa.'),
      scene: () => <LoopsCloseUpScene part="front" n={3} />,
      viewBox: CLOSEUP_VIEW,
    },
  ],
  summary: [
    l('Normalde iki halkaya birden bat.', 'Normally insert under both loops.', 'Normalmente entra por las dos hebras.', 'Normalmente entre nas duas alças.'),
    l('Tek halka = doku ve çizgi.', 'One loop only = texture and lines.', 'Una sola hebra = textura y líneas.', 'Uma alça só = textura e linhas.'),
  ],
};

export default lesson;
