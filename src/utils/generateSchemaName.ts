const generateSchemaName = () => {
  const adjectives = [
    'fierce',
    'mystical',
    'whimsical',
    'courageous',
    'brilliant',
    'fantastical',
    'enchanting',
    'majestic',
    'glorious',
    'radiant',
    'spectacular',
    'celestial',
    'magical',
    'dazzling',
    'legendary',
    'mythical',
    'heroic',
    'noble',
    'valiant',
    'daring',
    'mighty',
    'epic',
    'grand',
    'proud',
    'regal',
    'magnificent',
    'splendid',
    'gorgeous',
    'exquisite',
    'charming',
    'delightful',
    'enjoyable',
    'pleasurable',
    'wonderful',
    'amazing',
    'incredible',
    'fantastic',
    'marvelous',
    'extraordinary',
    'remarkable',
    'unforgettable',
    'awesome',
    'spectacular',
    'stunning',
    'mind-blowing',
    'jaw-dropping',
    'astonishing',
    'breathtaking',
    'amazing',
    'miraculous',
    'magical',
    'supernatural',
    'mythical',
    'legendary',
    'fantastical',
    'dreamlike',
    'otherworldly',
    'ethereal',
    'spiritual',
    'transcendent',
    'divine',
    'heavenly',
    'celestial',
    'cosmic',
    'intergalactic',
    'galactic',
    'astral',
    'stellar',
    'planetary',
    'lunar',
    'solar',
    'mystical',
    'enigmatic',
    'mysterious',
    'arcane',
    'cryptic',
    'occult',
    'esoteric',
    'secretive',
    'intriguing',
    'fascinating',
    'captivating',
    'alluring',
    'bewitching',
    'entrancing',
    'mesmerizing',
    'spellbinding',
    'hypnotic',
    'enchanting',
    'charming',
    'seductive',
    'tempting',
    'irresistible',
    'compelling',
    'absorbing',
    'engrossing',
    'stimulating',
    'challenging',
    'rewarding',
    'fulfilling',
    'satisfying',
    'gratifying',
    'exhilarating',
    'invigorating',
    'energizing',
    'inspiring',
    'motivating',
    'encouraging',
    'supportive',
    'positive',
    'optimistic',
    'hopeful',
    'uplifting',
    'cheerful',
    'joyful',
    'delightful',
    'pleasant',
    'enjoyable',
    'entertaining',
    'fun',
    'amusing',
    'humorous',
    'lighthearted',
    'whimsical',
    'playful',
    'quirky',
    'eccentric',
    'offbeat',
    'unconventional',
    'unusual',
    'weird',
    'strange',
    'bizarre',
    'outrageous',
    'absurd',
    'ridiculous',
    'crazy',
  ];

  const randomIndex1 = Math.floor(Math.random() * adjectives.length);
  const randomIndex2 = Math.floor(Math.random() * adjectives.length);
  const adjective1 = adjectives[randomIndex1];
  const adjective2 = adjectives[randomIndex2];
  const randomNumber = Math.floor(Math.random() * 100);
  const schemaName = `${adjective1}_${adjective2}_${randomNumber}`;
  return schemaName;
};

export default generateSchemaName;
