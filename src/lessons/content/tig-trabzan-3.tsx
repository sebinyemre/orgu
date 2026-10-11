import { tallSteps } from '../tall';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-trabzan-3',
  intro: l(
    '{Dtr} için üç kez ip atılır ve dört kez ikişer geçirilir. Dantel işlerde ve uzun yapraklarda kullanılır.',
    'For a {dtr}, yarn over three times and pull through two at a time, four times. Used in lace and long petals.',
    'Para un {dtr}, tres lazadas y se cierra de dos en dos cuatro veces. Se usa en calados y pétalos largos.',
    'Para um {dtr}, três laçadas e feche de duas em duas quatro vezes. Usado em rendas e pétalas longas.',
  ),
  steps: tallSteps(3, false, 'dtr'),
  summary: [l('3 kez ip at, bat, çek (5), dört kez "ip at, 2’sinden geçir".', 'Yo three times, insert, pull up (5), then "yo, through 2" four times.', '3 lazadas, entra, saca (5), y cuatro veces "lazada, cierra 2".', '3 laçadas, entre, puxe (5), e quatro vezes "laçada, feche 2".')],
};

export default lesson;
