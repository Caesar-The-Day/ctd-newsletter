import { Waves, Wheat, Mountain } from 'lucide-react';
import coastImg from '@/assets/friuli/soul-coast.jpg';
import plainImg from '@/assets/friuli/soul-plain.jpg';
import alpsImg from '@/assets/friuli/soul-alps.jpg';

export interface Meter { label: string; value: number; note: string }

export interface TownMatch {
  name: string;
  why: string;
  /** 'urban' | 'town' | 'village' — used by the quiz to fine-tune the match */
  scale: 'urban' | 'town' | 'village';
}

export interface Soul {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Waves;
  image: string;
  imageAlt: string;
  caption: string;
  towns: string;
  climate: string;
  cost: string;
  healthcare: string;
  language: string;
  meters: Meter[];
  townMatches: TownMatch[];
  suits: string[];
  avoid: string[];
  blurb: string;
}

export const souls: Soul[] = [
  {
    id: 'coast',
    name: 'Coast & Karst',
    subtitle: 'Trieste, Muggia, Grado, Duino',
    icon: Waves,
    image: coastImg,
    imageAlt: 'The Adriatic waterfront of Trieste seen from the limestone Karst coastline at dusk',
    caption: 'Trieste from the Karst: Habsburg facades on one side, open Adriatic on the other.',
    towns: 'Trieste, Muggia, Duino, Grado, Sistiana',
    climate: 'Mildest winters in the region; the Bora wind is the price of admission. Humid, busy summers on the lagoon.',
    cost: 'Highest rents in FVG — Trieste city centre commands a premium, but Muggia and the Karst villages run 25–35% cheaper.',
    healthcare: 'Best in the region. Trieste hosts the Cattinara and Maggiore hospitals plus Burlo Garofolo; specialists are local, not a drive away.',
    language: 'Italian with a strong Triestino dialect, plus Slovene as an official minority language in the Karst villages.',
    meters: [
      { label: 'Cost of living', value: 85, note: 'Priciest band' },
      { label: 'Healthcare depth', value: 95, note: 'Teaching hospitals in town' },
      { label: 'Winter mildness', value: 80, note: 'Rarely below freezing' },
      { label: 'Quiet factor', value: 35, note: 'City rhythm, port traffic' }
    ],
    townMatches: [
      { name: 'Trieste', why: 'A full city with hospitals, cafés and trains — the least compromise on services anywhere in FVG.', scale: 'urban' },
      { name: 'Muggia', why: 'Venetian-flavoured harbour town, 20 minutes from Trieste and noticeably cheaper.', scale: 'town' },
      { name: 'Duino', why: 'Clifftop quiet on the Karst edge, sea below and Trieste a short bus ride away.', scale: 'village' }
    ],
    suits: ['You want a real city with cafés, concerts and a hospital in it', 'You like sea air and never want to shovel snow', 'You want Slovenia and Croatia within an hour'],
    avoid: ['Wind bothers you — Bora days are not rare', 'You want a big garden for a small budget', 'You dislike summer crowds around Grado and Barcola'],
    blurb: 'This is the Habsburg Adriatic: coffee houses, Slovene bakeries, limestone plateaus and a port that still faces east rather than west.'
  },
  {
    id: 'plain',
    name: 'Central Plain',
    subtitle: 'Udine, Palmanova, Pordenone, Cividale',
    icon: Wheat,
    image: plainImg,
    imageAlt: 'Vineyards and maize fields on the Friulian plain with a market town bell tower in morning mist',
    caption: 'The plain at harvest: vines, maize and a bell tower marking the next market town.',
    towns: 'Udine, Palmanova, Pordenone, Cividale, San Daniele, Spilimbergo',
    climate: 'Continental — cold, foggy winters and hot, sticky summers. Very heavy autumn rainfall; this is one of Italy\'s wettest zones.',
    cost: 'The value sweet spot. Restored town apartments and small houses cost well under coastal prices, with full services attached.',
    healthcare: 'Strong. Udine\'s Santa Maria della Misericordia is the regional teaching hospital; Pordenone and Palmanova cover the west and south.',
    language: 'Italian plus everyday Friulian (furlan) — you will hear it in markets and bars, and locals notice when you try it.',
    meters: [
      { label: 'Cost of living', value: 55, note: 'Best value in FVG' },
      { label: 'Healthcare depth', value: 85, note: 'Regional teaching hospital' },
      { label: 'Winter mildness', value: 45, note: 'Fog and frost, little snow' },
      { label: 'Quiet factor', value: 65, note: 'Market-town pace' }
    ],
    townMatches: [
      { name: 'Udine', why: 'The region\'s working capital: teaching hospital, real shopping, and Friulian still spoken in the bars.', scale: 'urban' },
      { name: 'Cividale del Friuli', why: 'A UNESCO Lombard town on the Natisone with services and beauty in the same postcode.', scale: 'town' },
      { name: 'San Daniele del Friuli', why: 'Hill-town air, famous food culture and prices that still make sense.', scale: 'village' }
    ],
    suits: ['You want the most house, town and service per euro', 'You like flat terrain for cycling and walking', 'You want to be 45 minutes from everything without living in a tourist town'],
    avoid: ['Grey, foggy winters flatten your mood', 'You need sea views or mountain drama daily', 'You want an established English-speaking expat circle'],
    blurb: 'The plain is where Friuli actually lives: market towns, wine bars pouring the ritual tajut, and a food culture that outclasses the price tag.'
  },
  {
    id: 'alps',
    name: 'Alps & Border',
    subtitle: 'Tarvisio, Gemona, Venzone, Tolmezzo',
    icon: Mountain,
    image: alpsImg,
    imageAlt: 'Snow-dusted Julian Alps above an alpine village near Tarvisio in winter light',
    caption: 'Val Canale in winter: three languages, three borders, and snow you plan your year around.',
    towns: 'Tarvisio, Gemona del Friuli, Venzone, Tolmezzo, Sappada',
    climate: 'Genuine Alpine. Real snow from December, cool nights all summer, and the clearest air in the region.',
    cost: 'Cheapest property in FVG by a wide margin — but heating, winter tyres and a capable car are non-negotiable running costs.',
    healthcare: 'Thinnest coverage. Gemona and Tolmezzo handle the basics; anything serious means Udine, 40–70 minutes down the valley.',
    language: 'Italian, Friulian, and in the Val Canale, German and Slovene — Tarvisio sits where three languages meet.',
    meters: [
      { label: 'Cost of living', value: 35, note: 'Cheapest property' },
      { label: 'Healthcare depth', value: 45, note: 'Basics local, rest in Udine' },
      { label: 'Winter mildness', value: 15, note: 'Snow from December' },
      { label: 'Quiet factor', value: 95, note: 'Villages, not towns' }
    ],
    townMatches: [
      { name: 'Gemona del Friuli', why: 'The most serviced mountain-edge town: hospital, rail link and Udine 30 minutes south.', scale: 'urban' },
      { name: 'Tarvisio', why: 'Three-border living — Austria and Slovenia as your weekly errand radius, skiing out the door.', scale: 'town' },
      { name: 'Venzone', why: 'A rebuilt medieval walled village, tiny and quiet, with the valley\'s best-kept streets.', scale: 'village' }
    ],
    suits: ['You hike, ski or cycle and want it out the front door', 'You want Austria and Slovenia as your weekly errand radius', 'You value quiet and cool summers over convenience'],
    avoid: ['Winter driving worries you', 'You need specialist medical care close by', 'Small villages in February feel isolating to you'],
    blurb: 'The Julian and Carnic Alps: three-border living, tiny communities, and the region\'s most honest test of whether you actually like solitude.'
  }
];
