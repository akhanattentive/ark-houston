import { Reveal } from './Reveal';
import type { Verse as VerseType } from '../data/content';

interface VerseProps {
  verse: VerseType;
  align?: 'start' | 'center' | 'end';
}

/** A floating verse: Arabic crown, transliteration, translation, attribution. */
export function Verse({ verse, align = 'start' }: VerseProps) {
  const alignStyle =
    align === 'center'
      ? { textAlign: 'center' as const, alignSelf: 'center' as const }
      : align === 'end'
        ? { textAlign: 'right' as const, alignSelf: 'flex-end' as const }
        : { textAlign: 'left' as const, alignSelf: 'flex-start' as const };

  return (
    <Reveal className="verse" stagger>
      <div className="arabic" style={alignStyle}>
        {verse.arabic}
      </div>
      <div className="translit" style={alignStyle}>
        {verse.translit}
      </div>
      <div className="translation" style={alignStyle}>
        {verse.translation}
      </div>
      <div className="source" style={alignStyle}>
        {verse.source}
      </div>
    </Reveal>
  );
}
