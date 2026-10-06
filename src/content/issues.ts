import type { IssueType, L } from '../lib/types';

/** The "warning signs" from the stewardship training, as pick-a-picture report options. */
export const issues: { type: IssueType; emoji: string; label: L }[] = [
  { type: 'standing_water', emoji: '🦟', label: { en: 'Water not draining', kn: 'ನಿಂತ ನೀರು ಹರಿಯುತ್ತಿಲ್ಲ' } },
  { type: 'blocked_inlet', emoji: '🚯', label: { en: 'Inlet/outlet blocked', kn: 'ಕಸ/ಮಣ್ಣಿನಿಂದ ಒಳಹರಿವು ಮುಚ್ಚಿದೆ' } },
  { type: 'erosion', emoji: '🏚️', label: { en: 'Soil washing away', kn: 'ಮಣ್ಣು ಕೊಚ್ಚಿ ಹೋಗಿದೆ' } },
  { type: 'broken_structure', emoji: '🧱', label: { en: 'Broken or cracked', kn: 'ಮುರಿದಿದೆ ಅಥವಾ ಬಿರುಕು ಬಿಟ್ಟಿದೆ' } },
  { type: 'plants_dying', emoji: '🥀', label: { en: 'Plants dying', kn: 'ಗಿಡಗಳು ಒಣಗುತ್ತಿವೆ' } },
  { type: 'bad_water', emoji: '🤢', label: { en: 'Smelly or green/black water', kn: 'ಕೆಟ್ಟ ವಾಸನೆ / ಹಸಿರು-ಕಪ್ಪು ನೀರು' } },
  { type: 'other', emoji: '❓', label: { en: 'Something else', kn: 'ಬೇರೆ ಏನಾದರೂ' } },
];
