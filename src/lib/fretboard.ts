import { IntervalRole, normalizePitchClass, pitchClassToNote } from './musicTheory';

export type BassStringName = 'G' | 'D' | 'A' | 'E';
export type FretboardMarkerKind = 'chord' | 'scale' | 'overlap';

export interface FretboardMarker {
  pitchClass: number;
  note: string;
  role: IntervalRole;
  kind: FretboardMarkerKind;
  isRoot?: boolean;
}

export interface FretPosition {
  stringName: BassStringName;
  fret: number;
  note: string;
  pitchClass: number;
  marker?: FretboardMarker;
}

const BASS_STRINGS: Array<{ name: BassStringName; pitchClass: number }> = [
  { name: 'G', pitchClass: 7 },
  { name: 'D', pitchClass: 2 },
  { name: 'A', pitchClass: 9 },
  { name: 'E', pitchClass: 4 },
];

export function createMarkers(
  tones: Array<{ pitchClass: number; note: string; role: IntervalRole }>,
  kind: FretboardMarkerKind,
  rootPitchClass: number,
): FretboardMarker[] {
  return tones.map((tone) => ({
    pitchClass: tone.pitchClass,
    note: tone.note,
    role: tone.role,
    kind,
    isRoot: tone.pitchClass === rootPitchClass,
  }));
}

export function generateFretboard(markers: FretboardMarker[], maxFret = 12): FretPosition[] {
  const markerMap = new Map<number, FretboardMarker>();
  markers.forEach((marker) => {
    const existing = markerMap.get(marker.pitchClass);
    if (!existing || marker.kind === 'overlap' || marker.isRoot) {
      markerMap.set(marker.pitchClass, marker);
    }
  });

  return BASS_STRINGS.flatMap((bassString) =>
    Array.from({ length: maxFret + 1 }, (_, fret) => {
      const pitchClass = normalizePitchClass(bassString.pitchClass + fret);

      return {
        stringName: bassString.name,
        fret,
        note: pitchClassToNote(pitchClass),
        pitchClass,
        marker: markerMap.get(pitchClass),
      };
    }),
  );
}
