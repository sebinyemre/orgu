import { tallSteps } from '../tall';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-trabzan-2',
  intro: l(
    '{Tr} için batmadan önce iki kez ip atılır. Sonra yine ikişer ikişer geçirirsin, bu sefer üç kez. Uzun ve havadar bir ilmektir.',
    'For a {tr}, wrap the yarn twice before inserting, then pull through two at a time, three times. A tall, airy stitch.',
    'Para un {tr} se hacen dos lazadas antes de entrar y luego se cierra de dos en dos, tres veces.',
    'Para um {tr} faça duas laçadas antes de entrar e depois feche de duas em duas, três vezes.',
  ),
  steps: tallSteps(2, false, 'tr'),
  summary: [l('2 kez ip at, bat, çek (4), üç kez "ip at, 2’sinden geçir".', 'Yo twice, insert, pull up (4), then "yo, through 2" three times.', '2 lazadas, entra, saca (4), y tres veces "lazada, cierra 2".', '2 laçadas, entre, puxe (4), e três vezes "laçada, feche 2".')],
};

export default lesson;
