export interface Photo {
  small: string;
  large: string;
}

const BASE = '/images/lazio/beyond';

const photo = (name: string): Photo => ({
  small: `${BASE}/${name}-800.webp`,
  large: `${BASE}/${name}-1400.webp`,
});

export const photos = {
  lakes: photo('lazio-volcanic-lakes'),
  coast: photo('lazio-coast'),
  mountains: photo('lazio-mountains'),
  countryside: photo('lazio-countryside'),
  bracciano: photo('lake-bracciano'),
  bolsena: photo('lake-bolsena'),
  albano: photo('lake-albano'),
  vico: photo('lake-vico'),
  sabaudia: photo('sabaudia_circeoNP'),
  gaeta: photo('gaeta'),
  sperlonga: photo('sperlonga'),
  anzio: photo('anzio'),
  simbruini: photo('monti-simbruini'),
  ernici: photo('monti-ernici'),
  lepini: photo('monti-lepini'),
  laga: photo('monti-laga-leonessa'),
  tuscia: photo('tuscia'),
  sabina: photo('sabina'),
  ciociaria: photo('ciociaria'),
  aniene: photo('valle-aniene'),
} satisfies Record<string, Photo>;
