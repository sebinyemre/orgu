import { CenterPullScene } from '@/engine/illust/scenes';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'haz-yumak',
  intro: l(
    'Yumağı dıştan açarsan örerken yerde yuvarlanır ve ip dolaşır. İçten (ortadan) başlarsan yumak yerinde durur.',
    'Pull from the outside and the ball rolls around and tangles. Pull from the center and it stays put.',
    'Si tiras desde fuera, el ovillo rueda y se enreda. Si tiras desde el centro, se queda quieto.',
    'Se puxar por fora, o novelo rola e embaraça. Se puxar pelo centro, ele fica parado.',
  ),
  steps: [
    {
      title: l('İç ucu bul', 'Find the inner end', 'Encuentra el cabo interior', 'Ache a ponta de dentro'),
      text: l(
        'Yumağın iki ucundaki deliğe parmağını sok ve içteki ucu yakala. Bazen ilk çıkan küçük bir ip yumağıdır; bu normal.',
        'Push a finger into the hole at one end of the skein and find the inner end. A small tangle may come out first; that is normal.',
        'Mete un dedo en el hueco de un extremo y busca el cabo interior. A veces sale primero un pequeño enredo; es normal.',
        'Enfie um dedo no buraco de uma ponta e procure a ponta de dentro. Às vezes sai primeiro um bolinho de fio; é normal.',
      ),
      scene: () => <CenterPullScene phase="find" />,
      dur: 3,
    },
    {
      title: l('Ortadan çek', 'Pull from the center', 'Tira desde el centro', 'Puxe pelo centro'),
      text: l(
        'İpi içten çektikçe yumak yerinde kalır. Bir torbaya ya da kaseye koyarsan daha da düzenli olur.',
        'As you pull from the center, the ball stays still. A bag or bowl keeps it even tidier.',
        'Al tirar desde el centro el ovillo no se mueve. En una bolsa o un cuenco queda aún más ordenado.',
        'Puxando pelo centro o novelo não se mexe. Num saquinho ou numa tigela fica ainda mais organizado.',
      ),
      scene: () => <CenterPullScene phase="pull" />,
      dur: 3,
      tip: l('Çile hâlinde gelen ipi önce bir sandalye arkasına geçirip yumak yap; çileden doğrudan örme.', 'Yarn sold in a hank must be wound into a ball first: never knit straight from a hank.', 'Si el hilo viene en madeja, haz primero un ovillo; nunca tejas directo de la madeja.', 'Se o fio vier em meada, enrole antes um novelo; nunca tricote direto da meada.'),
    },
  ],
  summary: [l('İçten başla, yumak yuvarlanmasın.', 'Pull from the center so the ball stays put.', 'Tira desde el centro y el ovillo no rodará.', 'Puxe pelo centro e o novelo não rola.')],
};

export default lesson;
