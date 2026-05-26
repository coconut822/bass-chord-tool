import { buildTones, IntervalRole, PITCH_CLASS_BY_NAME, Tone } from './musicTheory';

export type ScaleTypeId = 'ionian' | 'aeolian' | 'dorian' | 'mixolydian' | 'majorPentatonic' | 'minorPentatonic' | 'blues' | 'harmonicMinor';

export interface ScaleTypeDefinition {
  id: ScaleTypeId;
  label: string;
  displayName: string;
  intervals: number[];
  roles: IntervalRole[];
}

export interface ParsedScale {
  root: string;
  rootPitchClass: number;
  type: ScaleTypeDefinition;
  standardName: string;
  chineseName: string;
  notes: string[];
  intervals: IntervalRole[];
  tones: Tone[];
}

export const SCALE_TYPES: ScaleTypeDefinition[] = [
  { id: 'ionian', label: '大调 / Ionian', displayName: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], roles: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'aeolian', label: '自然小调 / Aeolian', displayName: 'Aeolian', intervals: [0, 2, 3, 5, 7, 8, 10], roles: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  { id: 'dorian', label: 'Dorian', displayName: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], roles: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  { id: 'mixolydian', label: 'Mixolydian', displayName: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], roles: ['1', '2', '3', '4', '5', '6', 'b7'] },
  { id: 'majorPentatonic', label: '大调五声音阶', displayName: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9], roles: ['1', '2', '3', '5', '6'] },
  { id: 'minorPentatonic', label: '小调五声音阶', displayName: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], roles: ['1', 'b3', '4', '5', 'b7'] },
  { id: 'blues', label: 'Blues 音阶', displayName: 'Blues', intervals: [0, 3, 5, 6, 7, 10], roles: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  { id: 'harmonicMinor', label: '和声小调 / Harmonic Minor', displayName: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], roles: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
];

export function buildScale(root: string, typeId: ScaleTypeId): ParsedScale {
  const rootPitchClass = PITCH_CLASS_BY_NAME[root];
  const type = SCALE_TYPES.find((scaleType) => scaleType.id === typeId);
  if (rootPitchClass === undefined || !type) {
    throw new Error(`Unsupported scale: ${root} ${typeId}`);
  }

  const tones = buildTones(rootPitchClass, type.intervals, type.roles);

  return {
    root,
    rootPitchClass,
    type,
    standardName: `${root} ${type.displayName}`,
    chineseName: `${root} ${type.displayName} 音阶`,
    notes: tones.map((tone) => tone.note),
    intervals: tones.map((tone) => tone.role),
    tones,
  };
}
