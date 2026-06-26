// Qur'anic verses and supplications that drift through the experience.
// Arabic is authoritative; transliteration + translation are companions.

export interface Verse {
  id: string;
  arabic: string;
  translit: string;
  translation: string;
  source: string;
}

export const verses: Record<string, Verse> = {
  bismillah: {
    id: 'bismillah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translit: 'Bismi-llāhi r-raḥmāni r-raḥīm',
    translation: 'In the name of God, the Most Gracious, the Most Merciful.',
    source: 'al-Fātiḥah · 1:1',
  },
  // The Ark of salvation — Nuh (ʿa) bids his people embark.
  ark: {
    id: 'ark',
    arabic: 'وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا',
    translit: 'Wa-qāla rkabū fīhā bismi-llāhi majrāhā wa-mursāhā',
    translation:
      '“Embark therein — in the name of God is its sailing and its anchoring.”',
    source: 'Hūd · 11:41',
  },
  // Peace upon Ibrāhīm (ʿa).
  abraham: {
    id: 'abraham',
    arabic: 'سَلَامٌ عَلَىٰ إِبْرَاهِيمَ',
    translit: 'Salāmun ʿalā Ibrāhīm',
    translation: 'Peace be upon Abraham.',
    source: 'aṣ-Ṣāffāt · 37:109',
  },
  // Salawāt upon the Prophet (ṣ) and his Family (ʿa).
  muhammad: {
    id: 'muhammad',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
    translit: 'Allāhumma ṣalli ʿalā Muḥammadin wa-āli Muḥammad',
    translation: 'O God, send blessings upon Muḥammad and the Family of Muḥammad.',
    source: 'Ṣalawāt',
  },
  // Returning — the verse of consolation and origin.
  returning: {
    id: 'returning',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    translit: 'Innā li-llāhi wa-innā ilayhi rājiʿūn',
    translation: 'Indeed we belong to God, and to Him we shall return.',
    source: 'al-Baqarah · 2:156',
  },
};

export const mission = `To nourish a community of Muslims rooted in the teachings of the Prophet (ṣ) and his Family (ʿa). We connect people of various backgrounds and experiences together to explore the spiritual and intellectual heritage of Islam through art, expression, and devotion.`;

export const story = [
  `We aim to contribute to the rich tradition and tapestry of the Houston Muslim community by offering a space that endeavors to translate our tradition into a language of the culture we live in.`,
  `We believe this can be achieved through art — art that nurtures remembrance of our origins, and elevates us through knowledge. We imagine and aspire towards a just future, and we see the remembrance of our origins as a reminder for our future.`,
  `Remembrance necessitates resistance. Through collective memory and artistic expression, devotion becomes a meaningful site for resisting and building towards a just future.`,
];

export const pillars = [
  {
    n: '01',
    title: 'Art',
    arabic: 'فَنّ',
    body: 'The language of the culture we live in — a vessel for tradition, expression, and devotion.',
  },
  {
    n: '02',
    title: 'Remembrance',
    arabic: 'ذِكْر',
    body: 'Remembrance of our origins as a reminder for our future. Remembrance necessitates resistance.',
  },
  {
    n: '03',
    title: 'Knowledge',
    arabic: 'عِلْم',
    body: 'The spiritual and intellectual heritage of Islam — that elevates us, and roots us.',
  },
];
