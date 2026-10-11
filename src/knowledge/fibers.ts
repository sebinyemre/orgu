/** Lif rehberi: hangi ip neye uygun? */
import type { FiberId } from '@/types';

export interface FiberInfo {
  id: FiberId;
  name: string;
  /** 1–5 */
  warmth: number;
  /** esneme/hafıza 1–5 */
  elasticity: number;
  /** dikiş belirginliği 1–5 */
  stitchDefinition: number;
  care: string;
  bestFor: string[];
  avoidFor?: string[];
  tip: string;
}

export const FIBERS: FiberInfo[] = [
  { id: 'yun', name: 'Yün', warmth: 5, elasticity: 5, stitchDefinition: 4, care: 'Elde soğuk suda, sıkmadan; düz kurut. Keçeleşebilir.', bestFor: ['Kazak', 'Bere', 'Eldiven', 'Burgu örgü'], tip: 'Esnekliği sayesinde lastik ve burgular en güzel yünde görünür. Islak dinlendirme (blocking) ile ölçü düzelir.' },
  { id: 'merino', name: 'Merino yün', warmth: 5, elasticity: 5, stitchDefinition: 5, care: 'Elde yıka; "superwash" etiketliyse makinede yün programı.', bestFor: ['Bebek giysisi', 'Ten teması olan her şey', 'Şal'], tip: 'Kaşındırmayan yün. Superwash merino yıkanınca biraz uzayabilir — ölçü örneğini yıkayıp ölç.' },
  { id: 'alpaka', name: 'Alpaka', warmth: 5, elasticity: 2, stitchDefinition: 3, care: 'Elde yıka, düz kurut.', bestFor: ['Atkı', 'Şal', 'Bol kazak'], avoidFor: ['Lastikli dar giysi'], tip: 'Koyundan sıcak ama hafızası azdır; ağırlıkla sarkabilir. Yünle karışık olanı daha formlu durur.' },
  { id: 'moher', name: 'Moher', warmth: 4, elasticity: 3, stitchDefinition: 1, care: 'Elde, çok nazik.', bestFor: ['Havlı şal', 'Başka iple çift katlı örme'], tip: 'Söküldüğünde tüyler birbirine girer — sökmeden önce dondurucuda bekletmek işini kolaylaştırır.' },
  { id: 'kasmir', name: 'Kaşmir', warmth: 5, elasticity: 3, stitchDefinition: 3, care: 'Elde, soğuk suda.', bestFor: ['Lüks atkı', 'Bere'], tip: 'Az miktarda bile çok yumuşak bir dokunuş verir.' },
  { id: 'pamuk', name: 'Pamuk', warmth: 2, elasticity: 1, stitchDefinition: 5, care: 'Makinede yıkanabilir; çeker, dikkat.', bestFor: ['Amigurumi', 'Yazlık bluz', 'Mutfak bezi', 'Bebek'], avoidFor: ['Esnek lastik gerektiren yaka'], tip: 'Esnemediği için gergin örülür; ellerin yorulursa bir numara büyük tığ/şiş dene. Amigurumide net, düzgün ilmek verir.' },
  { id: 'keten', name: 'Keten', warmth: 1, elasticity: 1, stitchDefinition: 4, care: 'Yıkadıkça yumuşar.', bestFor: ['Yazlık', 'Çanta', 'Havlu'], tip: 'İlk başta sert gelir; birkaç yıkamadan sonra çok güzel dökülür.' },
  { id: 'bambu', name: 'Bambu', warmth: 2, elasticity: 1, stitchDefinition: 3, care: 'Elde, düz kurut.', bestFor: ['Yazlık şal', 'Bebek'], tip: 'Kaygan ve parlak; şişten kaçabilir — bambu/ahşap şiş tercih et.' },
  { id: 'ipek', name: 'İpek', warmth: 3, elasticity: 1, stitchDefinition: 4, care: 'Elde, çok nazik.', bestFor: ['Şal', 'Dantel'], tip: 'Parlaklığı ajur desenleri öne çıkarır.' },
  { id: 'akrilik', name: 'Akrilik', warmth: 3, elasticity: 3, stitchDefinition: 3, care: 'Makinede yıkanır; ütü buharı ile "öldürülebilir".', bestFor: ['Battaniye', 'Oyuncak', 'Çocuk giysisi', 'Pratik yapmak'], avoidFor: ['Islak dinlendirme gerektiren ajur'], tip: 'Ucuz, renkli, kolay bakım. Islak dinlendirmeye tepki vermez; buharla dinlendirilir (dokunmadan!).' },
  { id: 'polyester', name: 'Polyester', warmth: 3, elasticity: 2, stitchDefinition: 2, care: 'Makinede yıkanır.', bestFor: ['Battaniye', 'Oyuncak'], tip: 'Dayanıklı ve hafif.' },
  { id: 'kadife', name: 'Kadife (şönil)', warmth: 4, elasticity: 1, stitchDefinition: 1, care: 'Makinede hassas.', bestFor: ['Peluş amigurumi', 'Bebek battaniyesi'], tip: 'İlmekler zor görünür — her turun başına mutlaka ilmek işaretleyici tak. Gergin örersen ilmek "solucanlanır" (kayar).' },
  { id: 'penye', name: 'Penye ip', warmth: 2, elasticity: 3, stitchDefinition: 3, care: 'Makinede yıkanır.', bestFor: ['Sepet', 'Çanta', 'Paspas'], tip: 'Kalın tığla (8–12 mm) sık örülür; sert ve şekil tutan sepetler verir.' },
  { id: 'naylon', name: 'Naylon / poliamid', warmth: 2, elasticity: 4, stitchDefinition: 3, care: 'Makinede yıkanır.', bestFor: ['Çorap (yünle karışık)'], tip: 'Çorap iplerinde %20–25 naylon topuk dayanıklılığı verir.' },
  { id: 'viskon', name: 'Viskon', warmth: 2, elasticity: 1, stitchDefinition: 3, care: 'Elde, nazik.', bestFor: ['Yazlık bluz'], tip: 'Ağır ve dökümlüdür; uzayabilir.' },
  { id: 'karisim', name: 'Karışım', warmth: 3, elasticity: 3, stitchDefinition: 3, care: 'Etiketteki en hassas life göre.', bestFor: ['Her şey'], tip: 'Karışımlar liflerin iyi yanlarını birleştirir: yün+akrilik hem sıcak hem kolay bakımlıdır.' },
];

export const FIBER_BY_ID: Record<FiberId, FiberInfo> = Object.fromEntries(FIBERS.map((f) => [f.id, f])) as Record<FiberId, FiberInfo>;
