import { CrochetScene } from '@/engine/illust/crochet';
import { Arrow } from '@/engine/illust/parts';
import { l, type Lesson } from '../types';

const lesson: Lesson = {
  id: 'tig-donus',
  intro: l(
    'Bir sıra bitince işi çevirir ve yeni sıranın yüksekliğine çıkmak için birkaç zincir çekersin: dönüş zinciri. Kaç zincir çekeceğin ilmeğin boyuna bağlıdır.',
    'At the end of a row you turn the work and chain a few to reach the height of the next row: the turning chain. How many depends on the stitch.',
    'Al final de la vuelta giras la labor y haces cadenetas para subir: la cadeneta de giro. Cuántas depende del punto.',
    'No fim da carreira você vira o trabalho e faz correntinhas para subir: a correntinha de subida. Quantas depende do ponto.',
  ),
  steps: [
    {
      title: l('Sıra sonu', 'End of the row', 'Fin de la vuelta', 'Fim da carreira'),
      text: l('Son ilmeği de ördün. Sıranın kenarındasın.', 'You have worked the last stitch and are at the edge.', 'Has tejido el último punto y estás en el borde.', 'Você fez o último ponto e está na borda.'),
      scene: () => <CrochetScene hook="up" loops={1} done={6} />,
      loopsOnHook: 1,
    },
    {
      title: l('Dönüş zinciri', 'Turning chain', 'Cadeneta de giro', 'Correntinha de subida'),
      text: l('{Sc} için 1, {hdc} için 2, {dc} için 3 zincir çek.', 'Chain 1 for {sc}, 2 for {hdc}, 3 for {dc}.', '1 cadeneta para {sc}, 2 para {hdc}, 3 para {dc}.', '1 correntinha para {sc}, 2 para {hdc}, 3 para {dc}.'),
      scene: () => <CrochetScene hook="chain" work="chain" chainCount={3} loops={1} numberChains />,
      dur: 3,
    },
    {
      title: l('İşi çevir', 'Turn the work', 'Gira la labor', 'Vire o trabalho'),
      text: l('İşi kitap sayfası gibi sağdan sola çevir. Artık arka yüz karşında.', 'Turn the work like a page, right to left. The other side now faces you.', 'Gira la labor como una página. Ahora ves la otra cara.', 'Vire o trabalho como uma página. Agora você vê o outro lado.'),
      scene: () => <CrochetScene hook="up" loops={1} done={6} arrows={<Arrow d="M370 120 C320 60 200 50 120 90" n={1} start={[384, 132]} />} />,
    },
    {
      title: l('İlk ilmeğe bat', 'Into the first stitch', 'Al primer punto', 'No primeiro ponto'),
      text: l('{Sc} sıralarında dönüş zinciri sayılmaz: ilk {sc}’yi sıranın ilk ilmeğine ör. {Dc} sıralarında 3 zincir ilk ilmek sayılır, ilk ilmeği atlarsın.', 'In {sc} rows the turning chain does not count: work the first {sc} into the first stitch. In {dc} rows the 3 chains count as the first stitch, so skip it.', 'En vueltas de {sc} la cadeneta no cuenta: el primer {sc} va en el primer punto. En {dc}, las 3 cadenetas cuentan como primer punto: sáltalo.', 'Em carreiras de {sc} a correntinha não conta: o primeiro {sc} vai no primeiro ponto. Em {dc}, as 3 correntinhas contam como primeiro ponto: pule-o.'),
      scene: () => <CrochetScene hook="up" loops={1} done={0} target />,
      warn: l('Kenarlar daralıyorsa sonu atlıyorsun, genişliyorsa fazladan ilmek ekliyorsun. Her sıra sonunda say.', 'If edges narrow you skip the last stitch; if they widen you add extras. Count at every row end.', 'Si los bordes se estrechan, te saltas el último punto; si se ensanchan, añades. Cuenta en cada vuelta.', 'Se as bordas estreitam, você pula o último ponto; se alargam, acrescenta. Conte em cada carreira.'),
    },
  ],
  summary: [
    l('Dönüş zinciri: {sc} 1, {hdc} 2, {dc} 3.', 'Turning chain: {sc} 1, {hdc} 2, {dc} 3.', 'Cadeneta de giro: {sc} 1, {hdc} 2, {dc} 3.', 'Subida: {sc} 1, {hdc} 2, {dc} 3.'),
    l('Her sıra sonunda ilmek say.', 'Count stitches at every row end.', 'Cuenta en cada vuelta.', 'Conte em cada carreira.'),
  ],
};

export default lesson;
