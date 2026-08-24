import anzio1400 from './opt/anzio-1400.webp.asset.json';
import anzio800 from './opt/anzio-800.webp.asset.json';
import ciociaria1400 from './opt/ciociaria-1400.webp.asset.json';
import ciociaria800 from './opt/ciociaria-800.webp.asset.json';
import gaeta1400 from './opt/gaeta-1400.webp.asset.json';
import gaeta800 from './opt/gaeta-800.webp.asset.json';
import albano1400 from './opt/lake-albano-1400.webp.asset.json';
import albano800 from './opt/lake-albano-800.webp.asset.json';
import bolsena1400 from './opt/lake-bolsena-1400.webp.asset.json';
import bolsena800 from './opt/lake-bolsena-800.webp.asset.json';
import bracciano1400 from './opt/lake-bracciano-1400.webp.asset.json';
import bracciano800 from './opt/lake-bracciano-800.webp.asset.json';
import vico1400 from './opt/lake-vico-1400.webp.asset.json';
import vico800 from './opt/lake-vico-800.webp.asset.json';
import coast1400 from './opt/lazio-coast-1400.webp.asset.json';
import coast800 from './opt/lazio-coast-800.webp.asset.json';
import countryside1400 from './opt/lazio-countryside-1400.webp.asset.json';
import countryside800 from './opt/lazio-countryside-800.webp.asset.json';
import mountains1400 from './opt/lazio-mountains-1400.webp.asset.json';
import mountains800 from './opt/lazio-mountains-800.webp.asset.json';
import lakes1400 from './opt/lazio-volcanic-lakes-1400.webp.asset.json';
import lakes800 from './opt/lazio-volcanic-lakes-800.webp.asset.json';
import ernici1400 from './opt/monti-ernici-1400.webp.asset.json';
import ernici800 from './opt/monti-ernici-800.webp.asset.json';
import laga1400 from './opt/monti-laga-leonessa-1400.webp.asset.json';
import laga800 from './opt/monti-laga-leonessa-800.webp.asset.json';
import lepini1400 from './opt/monti-lepini-1400.webp.asset.json';
import lepini800 from './opt/monti-lepini-800.webp.asset.json';
import simbruini1400 from './opt/monti-simbruini-1400.webp.asset.json';
import simbruini800 from './opt/monti-simbruini-800.webp.asset.json';
import sabaudia1400 from './opt/sabaudia_circeoNP-1400.webp.asset.json';
import sabaudia800 from './opt/sabaudia_circeoNP-800.webp.asset.json';
import sabina1400 from './opt/sabina-1400.webp.asset.json';
import sabina800 from './opt/sabina-800.webp.asset.json';
import sperlonga1400 from './opt/sperlonga-1400.webp.asset.json';
import sperlonga800 from './opt/sperlonga-800.webp.asset.json';
import tuscia1400 from './opt/tuscia-1400.webp.asset.json';
import tuscia800 from './opt/tuscia-800.webp.asset.json';
import aniene1400 from './opt/valle-aniene-1400.webp.asset.json';
import aniene800 from './opt/valle-aniene-800.webp.asset.json';

export interface Photo {
  small: string;
  large: string;
}

const photo = (s: { url: string }, l: { url: string }): Photo => ({
  small: s.url,
  large: l.url,
});

export const photos = {
  lakes: photo(lakes800, lakes1400),
  coast: photo(coast800, coast1400),
  mountains: photo(mountains800, mountains1400),
  countryside: photo(countryside800, countryside1400),
  bracciano: photo(bracciano800, bracciano1400),
  bolsena: photo(bolsena800, bolsena1400),
  albano: photo(albano800, albano1400),
  vico: photo(vico800, vico1400),
  sabaudia: photo(sabaudia800, sabaudia1400),
  gaeta: photo(gaeta800, gaeta1400),
  sperlonga: photo(sperlonga800, sperlonga1400),
  anzio: photo(anzio800, anzio1400),
  simbruini: photo(simbruini800, simbruini1400),
  ernici: photo(ernici800, ernici1400),
  lepini: photo(lepini800, lepini1400),
  laga: photo(laga800, laga1400),
  tuscia: photo(tuscia800, tuscia1400),
  sabina: photo(sabina800, sabina1400),
  ciociaria: photo(ciociaria800, ciociaria1400),
  aniene: photo(aniene800, aniene1400),
} satisfies Record<string, Photo>;
