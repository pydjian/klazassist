/* ============================================================================
   PHIL-IRI MATERIALS
   ----------------------------------------------------------------------------
   Reading passages, Group Screening Test items, comprehension questions, and
   scoring references used by the Phil-IRI module.

   IMPORTANT — SOURCE & LICENSING NOTE
   ──────────────────────────────────────────────────────────────────────────
   The OFFICIAL DepEd Phil-IRI graded passages and GST items are published
   separately by the Bureau of Learning Delivery and are NOT redistributed
   with this app.

   The passages below are ORIGINAL COMPOSITIONS written for KlazAssist to
   give teachers a working demo and starting template. They follow the
   Phil-IRI structure (word count band, number of comprehension questions,
   the literal/inferential/critical split) but are NOT the DepEd official
   set.

   Teachers SHOULD replace these with the official passages they receive
   from their Division by using the "Add Passage" button in the Materials
   Library. All custom passages are stored locally in IndexedDB.
   ============================================================================ */

export type PhilIriQuestionType = 'Literal' | 'Inferential' | 'Critical';

export interface PhilIriQuestion {
  number: number;
  type: PhilIriQuestionType;
  question: string;
  answer: string;
}

export interface PhilIriPassage {
  id: string;
  gradeLevel: string;             // e.g. 'Grade 3'
  language: 'English' | 'Filipino';
  form: 'Pre-test' | 'Post-test';
  title: string;
  text: string;
  wordCount: number;
  /** Minimum acceptable reading rate (WPM) for this grade — guidance only. */
  expectedWpm: number;
  questions: PhilIriQuestion[];
  source?: string;
  isSample?: boolean;
}

export interface PhilIriGstItem {
  number: number;
  stem: string;
  choices: string[];
  answer: string;
}

export interface PhilIriGstSet {
  id: string;
  gradeLevel: string;             // e.g. 'Grades 4-6'
  language: 'English' | 'Filipino';
  title: string;
  passage: string;
  wordCount: number;
  timeLimitMin: number;
  items: PhilIriGstItem[];
  source?: string;
  isSample?: boolean;
}

/* ---------------------------------------------------------------------------
   SCORING GUIDE (from the DepEd Phil-IRI Manual)
   ---------------------------------------------------------------------------
   • Word Reading Score (WRS)
       = (Total Words − Miscues) ÷ Total Words × 100
       Independent:  97 – 100 %
       Instructional: 90 – 96 %
       Frustration:   0  – 89 %

   • Comprehension Score (CS)
       = Correct Answers ÷ Total Questions × 100
       Independent:  80 – 100 %
       Instructional: 59 – 79 %
       Frustration:   0  – 58 %

   • OVERALL reading level = the LOWER of the two levels.
       Both Independent  → Independent
       Either Frustration → Frustration
       Otherwise          → Instructional
   --------------------------------------------------------------------------- */
export const PHIL_IRI_SCORING_GUIDE = {
  wordReading: {
    independent:   { min: 97,  max: 100,     label: 'Independent' },
    instructional: { min: 90,  max: 96.99,   label: 'Instructional' },
    frustration:   { min: 0,   max: 89.99,   label: 'Frustration' }
  },
  comprehension: {
    independent:   { min: 80,  max: 100,     label: 'Independent' },
    instructional: { min: 59,  max: 79.99,   label: 'Instructional' },
    frustration:   { min: 0,   max: 58.99,   label: 'Frustration' }
  }
} as const;

export type PhilIriReadingLevel = 'IND' | 'INS' | 'FR' | 'Non-Reader' | '';

export function classifyWordReading(pct: number | null): PhilIriReadingLevel {
  if (pct === null || isNaN(pct)) return '';
  if (pct >= 97) return 'IND';
  if (pct >= 90) return 'INS';
  return 'FR';
}

export function classifyComprehension(pct: number | null): PhilIriReadingLevel {
  if (pct === null || isNaN(pct)) return '';
  if (pct >= 80) return 'IND';
  if (pct >= 59) return 'INS';
  return 'FR';
}

/** Combine WRS and CS levels → overall level. The lower level wins. */
export function combineReadingLevel(
  wrLevel: PhilIriReadingLevel,
  compLevel: PhilIriReadingLevel
): PhilIriReadingLevel {
  if (!wrLevel && !compLevel) return '';
  if (!wrLevel) return compLevel;
  if (!compLevel) return wrLevel;
  const rank = { IND: 3, INS: 2, FR: 1, 'Non-Reader': 0, '': 0 };
  return rank[wrLevel] <= rank[compLevel] ? wrLevel : compLevel;
}

/* ============================================================================
   GROUP SCREENING TEST (GST) SETS
   ----------------------------------------------------------------------------
   Administered to the whole class. Learners scoring 14 or above on the 20-item
   test need no further assessment. Learners scoring below 14 proceed to the
   individual graded passage.
   ============================================================================ */
export const PHIL_IRI_GST_SETS: PhilIriGstSet[] = [
  {
    id: 'gst-en-4-6-sample',
    gradeLevel: 'Grades 4-6',
    language: 'English',
    title: 'The Tricycle of the Santos Family',
    timeLimitMin: 30,
    wordCount: 200,
    isSample: true,
    source: 'Original composition — KlazAssist sample (not the official DepEd GST)',
    passage:
`On the morning of the town fiesta, Lino woke up before the roosters. His job was to help his father decorate the family's tricycle for the parade. The fiesta happened only once a year, and Lino had been looking forward to it for months. He ran to the small garage behind their house, where the tricycle was parked. It looked old and dusty.

His father handed him a bundle of bright crepe paper — red, yellow, and blue — and a small pot of glue. "We will make it the most beautiful tricycle in the parade," his father said with a smile. Lino worked carefully. He cut the paper into long strips, then twisted them into flowers. His mother brought them cold water and boiled eggs.

By noon, the tricycle was covered in so many colorful flowers that it looked like a moving garden. When the parade began, children ran beside it, cheering. An old woman in the crowd said, "Ah, that is the tricycle of the Santos family." Lino felt a warm pride in his chest. He had never felt prouder of anything he had made with his own hands.`,
    items: [
      { number: 1,  stem: 'How often did the town fiesta happen?',              choices: ['Once a month', 'Once a year', 'Every week', 'Every day'],                          answer: 'Once a year' },
      { number: 2,  stem: 'Where was the tricycle parked?',                     choices: ['In the school yard', 'Behind their house', 'At the market', 'Beside the church'],   answer: 'Behind their house' },
      { number: 3,  stem: 'What colors of crepe paper did the father give?',    choices: ['Red, yellow, and blue', 'Green and white', 'Black and gold', 'Pink and orange'],   answer: 'Red, yellow, and blue' },
      { number: 4,  stem: 'What did Lino and his father decorate?',             choices: ['A car', 'A bicycle', 'The family\u2019s tricycle', 'A boat'],                       answer: 'The family\u2019s tricycle' },
      { number: 5,  stem: 'Who brought them cold water and boiled eggs?',       choices: ['His sister', 'His mother', 'His grandmother', 'A neighbor'],                       answer: 'His mother' },
      { number: 6,  stem: 'What did Lino twist the paper strips into?',         choices: ['Stars', 'Birds', 'Flowers', 'Ribbons'],                                            answer: 'Flowers' },
      { number: 7,  stem: 'Who said, "That is the tricycle of the Santos family"?', choices: ['A child', 'An old woman', 'The mayor', 'A teacher'],                            answer: 'An old woman' },
      { number: 8,  stem: 'When did Lino wake up?',                             choices: ['After lunch', 'At noon', 'Before the roosters', 'In the evening'],                 answer: 'Before the roosters' },
      { number: 9,  stem: 'What did the tricycle look like after they finished?', choices: ['A small house', 'A moving garden', 'A big bird', 'A golden carriage'],          answer: 'A moving garden' },
      { number: 10, stem: 'How did Lino feel at the end?',                      choices: ['Angry', 'Sleepy', 'Warm pride', 'Nervous'],                                        answer: 'Warm pride' },

      { number: 11, stem: 'Why did Lino wake up before the roosters?',          choices: ['He was hungry', 'He was excited to help decorate', 'He heard a noise', 'He wanted to play'], answer: 'He was excited to help decorate' },
      { number: 12, stem: 'Why was the fiesta important to Lino?',              choices: ['He would get money', 'He had looked forward to it for months', 'He would miss school', 'His friends would visit'], answer: 'He had looked forward to it for months' },
      { number: 13, stem: 'What does "a warm pride in his chest" mean?',        choices: ['He was tired', 'He felt happy and proud', 'He felt sick', 'He felt cold'],          answer: 'He felt happy and proud' },
      { number: 14, stem: 'Why did the children run beside the tricycle?',      choices: ['They were late', 'They were cheering', 'They were afraid', 'They were selling food'], answer: 'They were cheering' },
      { number: 15, stem: 'Why did the tricycle look like a moving garden?',    choices: ['It was green', 'It had many colorful paper flowers', 'It was very big', 'It had real plants'], answer: 'It had many colorful paper flowers' },
      { number: 16, stem: 'Which words best describe Lino?',                    choices: ['Lazy and shy', 'Hardworking and careful', 'Rude and loud', 'Sad and quiet'],       answer: 'Hardworking and careful' },

      { number: 17, stem: 'What is the main idea of the story?',                choices: ['A boy and his family decorate a tricycle for the fiesta', 'A boy runs away from home', 'A town has a big storm', 'A family moves to a new house'], answer: 'A boy and his family decorate a tricycle for the fiesta' },
      { number: 18, stem: 'What does the story teach about working with family?', choices: ['It is boring', 'Working together creates something beautiful', 'It always causes fights', 'It should be avoided'], answer: 'Working together creates something beautiful' },
      { number: 19, stem: 'Why do you think a town fiesta is important?',       choices: ['It brings the community together', 'It makes people tired', 'It costs too much money', 'It is only for children'], answer: 'It brings the community together' },
      { number: 20, stem: 'Which of these shows Lino took pride in his work?',  choices: ['He hid the tricycle', 'He felt warm pride and made it carefully', 'He threw away the paper', 'He refused to help'], answer: 'He felt warm pride and made it carefully' }
    ]
  }
];

/* ============================================================================
   GRADED PASSAGES
   ============================================================================ */
export const PHIL_IRI_PASSAGES: PhilIriPassage[] = [

  /* ---------- Grade 3 · English ---------- */
  {
    id: 'en-g3-pre-01',
    gradeLevel: 'Grade 3',
    language: 'English',
    form: 'Pre-test',
    title: 'The Clever Crow',
    wordCount: 94,
    expectedWpm: 70,
    isSample: true,
    source: 'Adapted from Aesop\u2019s fable (public domain)',
    text:
`One hot afternoon, a thirsty crow flew over the field. He had been searching for water for a long time.

At last, he saw a tall pitcher near a farmer's hut. He flew down and looked inside. There was only a little water at the bottom, and his beak could not reach it.

The clever crow did not give up. He picked up small stones one by one and dropped them into the pitcher. Slowly, the water rose to the top. The crow drank until he was no longer thirsty, then flew away happily.`,
    questions: [
      { number: 1, type: 'Literal',     question: 'Who was searching for water?',                 answer: 'A thirsty crow' },
      { number: 2, type: 'Literal',     question: 'Where did the crow find the pitcher?',          answer: 'Near a farmer\u2019s hut' },
      { number: 3, type: 'Literal',     question: 'What was inside the pitcher?',                  answer: 'A little water at the bottom' },
      { number: 4, type: 'Literal',     question: 'What did the crow drop into the pitcher?',      answer: 'Small stones' },
      { number: 5, type: 'Inferential', question: 'Why could the crow not drink the water at first?', answer: 'The water was too low and his beak could not reach it' },
      { number: 6, type: 'Inferential', question: 'How did the crow show he was clever?',         answer: 'By dropping stones into the pitcher to make the water rise' },
      { number: 7, type: 'Critical',    question: 'What lesson does the story teach us?',         answer: 'Never give up; think of a way to solve a problem' }
    ]
  },

  /* ---------- Grade 4 · English ---------- */
  {
    id: 'en-g4-pre-01',
    gradeLevel: 'Grade 4',
    language: 'English',
    form: 'Pre-test',
    title: 'The Rainy Day Surprise',
    wordCount: 112,
    expectedWpm: 90,
    isSample: true,
    source: 'Original composition — KlazAssist sample',
    text:
`The sky was dark when Ana woke up on Saturday morning. She had planned to play outside with her friends, but the rain would not stop.

Her mother told her to stay inside and read a book. Ana sighed and sat by the window. Then she noticed something moving in the garden.

A small brown puppy was hiding under the papaya tree, wet and trembling. Ana quickly ran outside with an umbrella. She wrapped the puppy in a towel and brought it inside. Her mother gave it warm milk.

They named the puppy "Lucky" because he was found on a rainy day. Ana smiled. The rain had brought her a new friend.`,
    questions: [
      { number: 1, type: 'Literal',     question: 'When did Ana wake up?',                          answer: 'On Saturday morning' },
      { number: 2, type: 'Literal',     question: 'What was the weather like?',                     answer: 'Rainy' },
      { number: 3, type: 'Literal',     question: 'Where did Ana find the puppy?',                  answer: 'Under the papaya tree in the garden' },
      { number: 4, type: 'Literal',     question: 'What did Ana name the puppy?',                   answer: 'Lucky' },
      { number: 5, type: 'Inferential', question: 'Why did Ana sigh at the beginning?',             answer: 'Because it was raining and she could not play outside' },
      { number: 6, type: 'Inferential', question: 'How did Ana feel when she saw the puppy?',       answer: 'Worried — she rushed out with an umbrella to help it' },
      { number: 7, type: 'Critical',    question: 'What would have happened if Ana had not gone outside?', answer: 'The puppy would have stayed wet and cold in the rain' },
      { number: 8, type: 'Critical',    question: 'What does the story teach us?',                  answer: 'Kindness is rewarded; caring for animals matters' }
    ]
  },

  /* ---------- Grade 5 · English ---------- */
  {
    id: 'en-g5-pre-01',
    gradeLevel: 'Grade 5',
    language: 'English',
    form: 'Pre-test',
    title: 'The Fisherman\u2019s Promise',
    wordCount: 177,
    expectedWpm: 110,
    isSample: true,
    source: 'Original composition — KlazAssist sample',
    text:
`Every morning before sunrise, Mang Isko rowed his small banca out to sea. He was a fisherman from a quiet coastal village in Bicol, and he had been fishing for as long as he could remember.

One morning, his net felt unusually heavy. He pulled with all his strength and was surprised to find not a single fish but a small golden turtle caught in the mesh. The turtle looked at him with clear, round eyes. Mang Isko remembered what his grandfather had told him: "Golden turtles are sacred. Set them free, and the sea will remember your kindness."

Without hesitation, Mang Isko gently untangled the turtle and released it into the water. The turtle swam in a slow circle, then disappeared into the deep.

The next morning, when Mang Isko cast his net, it filled so quickly with fish that he almost fell overboard. From that day on, his catch was always plentiful. The villagers said the sea had kept its promise.`,
    questions: [
      { number: 1, type: 'Literal',     question: 'Who is the main character?',                    answer: 'Mang Isko' },
      { number: 2, type: 'Literal',     question: 'Where did the story take place?',               answer: 'A coastal village in Bicol' },
      { number: 3, type: 'Literal',     question: 'What did Mang Isko find in his net?',           answer: 'A small golden turtle' },
      { number: 4, type: 'Literal',     question: 'What did the villagers say?',                   answer: 'That the sea had kept its promise' },
      { number: 5, type: 'Inferential', question: 'Why did Mang Isko release the turtle?',        answer: 'Because of his grandfather\u2019s warning that golden turtles are sacred' },
      { number: 6, type: 'Inferential', question: 'How did Mang Isko feel when he saw the turtle?', answer: 'Surprised' },
      { number: 7, type: 'Inferential', question: 'Why was his catch plentiful after releasing the turtle?', answer: 'It was a reward for his kindness' },
      { number: 8, type: 'Critical',    question: 'What value is the story trying to teach?',     answer: 'Kindness to nature is rewarded; respect for tradition' }
    ]
  },

  /* ---------- Grade 6 · English ---------- */
  {
    id: 'en-g6-pre-01',
    gradeLevel: 'Grade 6',
    language: 'English',
    form: 'Pre-test',
    title: 'The Weaver\u2019s Gift',
    wordCount: 222,
    expectedWpm: 130,
    isSample: true,
    source: 'Original composition — KlazAssist sample',
    text:
`In the old town of Kalibo, there lived a woman named Lola Sela who wove the finest piña cloth in the province. Her hands were wrinkled and her eyes were not as sharp as they had once been, but her work still sparkled like morning dew.

Every cloth she wove carried a tiny pattern she called her "signature" — a delicate vine that twisted around a single star.

Young girls would come to her house hoping to learn her craft, but most grew impatient after a few weeks. The weaving was slow, the pay was small, and their minds were full of dreams of city life.

Only one girl, a quiet orphan named Nida, stayed. She came every day before sunrise and left after dark. She never complained, never hurried, and always thanked Lola Sela for every lesson.

Years passed. When Lola Sela was too old to weave, she called Nida to her side. "You have my hands now," she said. "And more importantly, you have my patience." She gave Nida her oldest wooden loom, along with a small notebook of patterns.

Nida wept. She promised to teach others exactly as Lola Sela had taught her. Today, the piña cloth of Kalibo still carries that single vine and star. And in every woven piece, Nida says, lives a small piece of Lola Sela.`,
    questions: [
      { number: 1,  type: 'Literal',     question: 'Who was the finest weaver in Kalibo?',         answer: 'Lola Sela' },
      { number: 2,  type: 'Literal',     question: 'What was Lola Sela\u2019s signature pattern?', answer: 'A delicate vine that twisted around a single star' },
      { number: 3,  type: 'Literal',     question: 'Who stayed to learn from Lola Sela?',          answer: 'Nida' },
      { number: 4,  type: 'Literal',     question: 'What did Lola Sela give Nida?',                answer: 'Her oldest wooden loom and a small notebook of patterns' },
      { number: 5,  type: 'Inferential', question: 'Why did most of the girls leave?',             answer: 'They grew impatient — the pay was small and they wanted city life' },
      { number: 6,  type: 'Inferential', question: 'Why do you think Nida never complained?',      answer: 'She valued the craft and was patient and grateful' },
      { number: 7,  type: 'Inferential', question: 'What did Lola Sela mean by "you have my patience"?', answer: 'Nida had proven she had the dedication and calm needed to master the craft' },
      { number: 8,  type: 'Inferential', question: 'How did Nida honor Lola Sela\u2019s gift?',    answer: 'By promising to teach others and keeping the signature pattern alive' },
      { number: 9,  type: 'Critical',    question: 'What makes a truly skilled craftsperson?',     answer: 'Skill, patience, dedication, and respect for tradition' },
      { number: 10, type: 'Critical',    question: 'What is something worth waiting and working patiently for?', answer: 'Open-ended — accept any thoughtful answer' }
    ]
  },

  /* ---------- Grade 3 · Filipino ---------- */
  {
    id: 'fil-g3-pre-01',
    gradeLevel: 'Grade 3',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ang Palaka at ang Kalabaw',
    wordCount: 92,
    expectedWpm: 70,
    isSample: true,
    source: 'Orihinal na akda — KlazAssist sample',
    text:
`Isang mainit na hapon, naglalakad ang maliit na palaka sa tabi ng ilog. Nakita niya ang malaking kalabaw na nagtatrabaho sa bukid.

"Kaibigang kalabaw," sabi ng palaka, "bakit hindi ka magpahinga? Mainit ang araw."

Ngumiti ang kalabaw. "Mahalaga ang aking trabaho. Kung hindi ako mag-aararo, walang pagkain ang mga tao sa nayon."

Naisip ng palaka ang sinabi ng kalabaw. Napagtanto niya na kahit maliit siya, may sarili rin siyang tungkulin. Mula noon, tumulong na siya sa paglilinis ng ilog upang manatiling malinis ang tubig para sa lahat.`,
    questions: [
      { number: 1, type: 'Literal',     question: 'Sino ang naglalakad sa tabi ng ilog?',            answer: 'Ang maliit na palaka' },
      { number: 2, type: 'Literal',     question: 'Ano ang ginagawa ng kalabaw?',                     answer: 'Nagtatrabaho sa bukid (nag-aararo)' },
      { number: 3, type: 'Literal',     question: 'Ano ang naging desisyon ng palaka?',              answer: 'Tumulong sa paglilinis ng ilog' },
      { number: 4, type: 'Inferential', question: 'Bakit hindi magpahinga ang kalabaw?',             answer: 'Dahil mahalaga ang kanyang trabaho para sa pagkain ng mga tao' },
      { number: 5, type: 'Inferential', question: 'Ano ang naramdaman ng palaka matapos makausap ang kalabaw?', answer: 'Naliwanagan at naging inspirasyon' },
      { number: 6, type: 'Critical',    question: 'Ano ang aral ng kwento?',                          answer: 'Bawat isa ay may tungkulin, gaano man kaliit' },
      { number: 7, type: 'Critical',    question: 'Paano mo maipapakita ang katulad na pagmamalasakit sa iyong komunidad?', answer: 'Open-ended' }
    ]
  },

  /* ---------- Grade 4 · Filipino ---------- */
  {
    id: 'fil-g4-pre-01',
    gradeLevel: 'Grade 4',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ang Bayan ng Malinis',
    wordCount: 138,
    expectedWpm: 90,
    isSample: true,
    source: 'Orihinal na akda — KlazAssist sample',
    text:
`Sa isang maliit na bayan sa Quezon, may isang batang nagngangalang Alon. Tuwing umaga, dinadaanan niya ang ilog na puno ng basura.

Isang araw, nagpasya siyang maglinis. Kinuha niya ang lumang sako ng kanyang lolo at nagsimulang magtipon ng mga plastik at papel.

Nakita siya ng kanyang mga kapitbahay at tinanong kung ano ang ginagawa niya. "Nililinis ko ang ilog natin," sagot ni Alon. "Kung malinis ito, babalik ang mga isda at magiging masaya ang lahat."

Natuwa ang mga kapitbahay sa kanyang sinabi. Kinaumagahan, dala-dala ang kanilang sariling sako, sumama na silang lahat kay Alon. Sa loob ng isang linggo, naging malinis ang ilog. Bumalik nga ang maliliit na isda, at ngumiti si Alon. Hindi kailangan ng malaking tao para sa malaking pagbabago.`,
    questions: [
      { number: 1, type: 'Literal',     question: 'Sino ang batang naglinis ng ilog?',                answer: 'Alon' },
      { number: 2, type: 'Literal',     question: 'Ano ang kinuha ni Alon para sa paglilinis?',      answer: 'Ang lumang sako ng kanyang lolo' },
      { number: 3, type: 'Literal',     question: 'Ilang araw bago naging malinis ang ilog?',        answer: 'Isang linggo' },
      { number: 4, type: 'Literal',     question: 'Ano ang bumalik sa ilog?',                        answer: 'Ang maliliit na isda' },
      { number: 5, type: 'Inferential', question: 'Bakit sinabi ni Alon na magiging masaya ang lahat?', answer: 'Dahil ang malinis na ilog ay makakabuti sa lahat' },
      { number: 6, type: 'Inferential', question: 'Bakit sumama ang mga kapitbahay?',                answer: 'Nainspirasyon sila sa halimbawa ni Alon' },
      { number: 7, type: 'Critical',    question: 'Ano ang mensahe ng kwento?',                      answer: 'Kahit bata, kaya mong gumawa ng pagbabago' },
      { number: 8, type: 'Critical',    question: 'Ano ang isang bagay na maaari mong baguhin sa inyong lugar?', answer: 'Open-ended' }
    ]
  },

  /* ---------- Grade 5 · Filipino ---------- */
  {
    id: 'fil-g5-pre-01',
    gradeLevel: 'Grade 5',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ang Mangingisda at ang Dagat',
    wordCount: 158,
    expectedWpm: 110,
    isSample: true,
    source: 'Orihinal na akda — KlazAssist sample',
    text:
`Si Mang Tino ay isang mangingisda sa baybayin ng Catanduanes. Bawat umaga, maaga siyang bumabangon upang maghagis ng lambat sa dagat.

Isang araw, napansin niyang kakaunti ang kanyang huli. Napansin din niya ang mga bote at plastik na lumulutang sa tubig. "Ang dagat ay may sakit," naisip niya.

Sa halip na magreklamo, nagsimula siyang mangolekta ng basura tuwing siya ay naglalayag. Itinuturo niya sa kanyang mga anak na huwag magtapon ng basura sa dagat.

Unti-unti, sumama ang ibang mangingisda sa kanyang gawain. Pagkalipas ng ilang buwan, naging malinaw muli ang tubig. Bumalik ang mga isda, at bumalik ang ngiti sa mga mangingisda. Sinabi ni Mang Tino sa kanyang mga anak, "Ang dagat ay parang ina. Kapag inalagaan natin siya, iaalagaan din niya tayo."`,
    questions: [
      { number: 1, type: 'Literal',     question: 'Sino si Mang Tino?',                              answer: 'Isang mangingisda' },
      { number: 2, type: 'Literal',     question: 'Saan siya nakatira?',                             answer: 'Sa baybayin ng Catanduanes' },
      { number: 3, type: 'Literal',     question: 'Ano ang napansin niya sa dagat?',                 answer: 'Maraming basura at kakaunting huli' },
      { number: 4, type: 'Literal',     question: 'Ano ang naging bunga ng kanilang paglilinis?',    answer: 'Bumalik ang mga isda at ang ngiti sa mga mangingisda' },
      { number: 5, type: 'Inferential', question: 'Bakit sinabi niyang "may sakit ang dagat"?',      answer: 'Dahil marumi ito at kakaunti ang isda' },
      { number: 6, type: 'Inferential', question: 'Bakit sumama ang ibang mangingisda?',             answer: 'Nakita nila ang magandang halimbawa ni Mang Tino' },
      { number: 7, type: 'Inferential', question: 'Ano ang ibig sabihin ng "Ang dagat ay parang ina"?', answer: 'Kung aalagaan natin ang kalikasan, aalagaan din tayo nito' },
      { number: 8, type: 'Critical',    question: 'Bakit mahalaga ang pagtuturo sa mga bata tungkol sa kalikasan?', answer: 'Open-ended' },
      { number: 9, type: 'Critical',    question: 'Ano ang maaari mong gawin upang makatulong sa kalikasan?', answer: 'Open-ended' }
    ]
  },

  /* ---------- Grade 6 · Filipino ---------- */
  {
    id: 'fil-g6-pre-01',
    gradeLevel: 'Grade 6',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ang Alamat ng Bulkang Mayon',
    wordCount: 205,
    expectedWpm: 130,
    isSample: true,
    source: 'Tradisyunal na alamat ng Bicol (public domain)',
    text:
`Noong unang panahon sa lupain ng Ibalon, may isang magandang dalaga na nagngangalang Daragang Magayon. Kilala siya sa buong kaharian dahil sa kanyang kagandahan, kabaitan, at matalinong pag-iisip.

Maraming binata ang naghangad sa kanyang pag-ibig, ngunit ang puso niya ay nakalaan lamang sa isang binatang nagngangalang Panganoron, na dumating mula sa malayong lugar upang manirahan sa kanilang bayan.

Isang araw, dumating ang makapangyarihang mandirigmang si Pagtuga, na gustong mapangasawa si Magayon sa pamamagitan ng lakas. Nang tanggihan siya ni Magayon, kinidnap ni Pagtuga ang kanyang ama. Sa labis na pagmamahal sa kanyang ama, napilitan si Magayon na sumang-ayon sa kasal.

Ngunit nang gabing iyon, dumating si Panganoron upang iligtas sila. Sa gitna ng labanan, isang palaso ang tumama kay Magayon. Namatay siya sa bisig ng kanyang minamahal. Sa tindi ng kalungkutan, namatay rin si Panganoron.

Inilibing sila ng mga tao nang magkasama. Makalipas ang ilang araw, tumubo sa kanilang libingan ang isang magandang bundok na hugis perpektong kono. Tinawag itong Bulkang Mayon, mula sa salitang "magayon," na ang ibig sabihin ay maganda.`,
    questions: [
      { number: 1,  type: 'Literal',     question: 'Sino ang pangunahing tauhan?',                   answer: 'Daragang Magayon' },
      { number: 2,  type: 'Literal',     question: 'Sino ang minamahal ni Magayon?',                 answer: 'Panganoron' },
      { number: 3,  type: 'Literal',     question: 'Sino ang mandirigmang gustong pakasalan si Magayon?', answer: 'Pagtuga' },
      { number: 4,  type: 'Literal',     question: 'Ano ang hugis ng Bulkang Mayon?',                answer: 'Perpektong kono' },
      { number: 5,  type: 'Inferential', question: 'Bakit sumang-ayon si Magayon sa kasal ni Pagtuga?', answer: 'Dahil kinidnap ang kanyang ama' },
      { number: 6,  type: 'Inferential', question: 'Ano ang naramdaman ni Panganoron nang mamatay si Magayon?', answer: 'Labis na kalungkutan' },
      { number: 7,  type: 'Inferential', question: 'Paano naging simbolo ng pag-ibig ang Bulkang Mayon?', answer: 'Ito ay tumubo sa libingan ng magkasintahan' },
      { number: 8,  type: 'Inferential', question: 'Ano ang ibig sabihin ng salitang "magayon"?',    answer: 'Maganda' },
      { number: 9,  type: 'Critical',    question: 'Tama ba ang ginawa ni Magayon na isakripisyo ang sarili para sa ama?', answer: 'Open-ended' },
      { number: 10, type: 'Critical',    question: 'Ano ang aral ng alamat?',                        answer: 'Ang tunay na pag-ibig ay handang magsakripisyo' }
    ]
  },

  {
    id: 'en-g1-pre-01',
    gradeLevel: 'Grade 1',
    language: 'English',
    form: 'Pre-test',
    title: 'Gifts for Father',
    wordCount: 30,
    expectedWpm: 50,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`It’s father’s birthday.
“Happy birthday, father!” said Dan and Rita.
Dan gave him a book. Rita gave him a hat.
Father said, “Thank you, Dan and Rita! I love you!”`,
    questions: [
      { number: 1, type: 'Literal', question: 'What did Dan give Father?', answer: 'book' },
      { number: 2, type: 'Literal', question: 'What did Rita give Father?', answer: 'hat' },
      { number: 3, type: 'Inferential', question: 'Why did they give him a gift?', answer: 'Its father’s birthday.' },
      { number: 4, type: 'Inferential', question: 'How did Father feel on his birthday?', answer: 'happy' },
      { number: 5, type: 'Critical', question: 'Why would you give your father a gift?', answer: 'because I love him; because it is his birthday; because I want him to be happy' },
    ]
  },
  {
    id: 'en-g2-pre-01',
    gradeLevel: 'Grade 2',
    language: 'English',
    form: 'Pre-test',
    title: 'Let Pigs Grow',
    wordCount: 41,
    expectedWpm: 60,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Pigs are good pets. A mother pig can give birth to three to sixteen piglets born alive. Piglets love to eat. Aside from sucking milk, they like eating plants and grass. They also want to eat left-over foods and fruit peelings.`,
    questions: [
      { number: 1, type: 'Literal', question: 'How are piglets born?', answer: 'Piglets are born alive.' },
      { number: 2, type: 'Literal', question: 'What do piglets love to do?', answer: 'They love to eat.' },
      { number: 3, type: 'Literal', question: 'What do they eat?', answer: 'They suck milk.; They eat plants and grass.; They eat leftover foods and fruit peelings.' },
      { number: 4, type: 'Inferential', question: 'What will happen if you do not take care of the piglets?', answer: 'They will not grow.; They will grow thin.; They will die.' },
      { number: 5, type: 'Critical', question: 'How do pigs help people?', answer: 'They give us meat that we call “pork.”; They help us recycle leftovers.; We avoid wasting leftover food by feeding them with it.' },
    ]
  },
  {
    id: 'en-g3-pre-01',
    gradeLevel: 'Grade 3',
    language: 'English',
    form: 'Pre-test',
    title: 'Fiesta Time',
    wordCount: 49,
    expectedWpm: 70,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Paulo and John spent the night at their grandfather’s place to witness the activities for the town fiesta.
“John,” called Paulo. “Hurry up! I don’t want to miss the games.”
“Neither do I!” John replied.
“I like the palo-sebo and pot-hitting contests!” shouted Paulo.
“Those are very exciting games.”`,
    questions: [
      { number: 1, type: 'Literal', question: 'Where did Paulo and John spend their night?', answer: 'At their grandfather’s place' },
      { number: 2, type: 'Literal', question: 'Why were Paulo and John at their grandfather’s place?', answer: 'to attend the fiesta; to witness the activities' },
      { number: 3, type: 'Literal', question: 'What games did John and Paulo watch?', answer: 'the palo-sebo and pot-hitting contests' },
      { number: 4, type: 'Inferential', question: 'What do people feel during fiesta?', answer: 'festive, happy, excited, tired' },
      { number: 5, type: 'Critical', question: 'What other activities could you suggest for a fiesta?', answer: 'Parade, beauty contest, other contests like relays, drum and bugle corps, sack race, singing contest, dance competition, “kadang-kadang”, etc.' },
    ]
  },
  {
    id: 'en-g4-pre-01',
    gradeLevel: 'Grade 4',
    language: 'English',
    form: 'Pre-test',
    title: 'An Invitation Letter',
    wordCount: 59,
    expectedWpm: 80,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Zamboanguita,
Negros Oriental
May 30, 2025
Dear Betty,

Our family will celebrate our grandparents’ golden wedding anniversary at our ancestral home on Saturday, June 21, 2025. We shall have a party in their honor. A special activity for kids is the Children’s Hour at 3:00 o’clock P.M.

Come, let’s have fun! Be one of our child guests.

Sincerely,
Shiela`,
    questions: [
      { number: 1, type: 'Literal', question: 'What is the occasion?', answer: 'Grandparent’s Golden Wedding Anniversary' },
      { number: 2, type: 'Literal', question: 'When will they celebrate the Golden Wedding Anniversary?', answer: 'Saturday, June 21, 2025' },
      { number: 3, type: 'Literal', question: 'What activity in the event is Betty invited to come?', answer: 'Children’s hour' },
      { number: 4, type: 'Inferential', question: 'Who wrote the letter?', answer: 'Shiela' },
      { number: 5, type: 'Inferential', question: 'What is another word for guests?', answer: 'Visitors' },
      { number: 6, type: 'Critical', question: 'What do you think is a golden wedding anniversary celebrated?', answer: 'This happens only once in a lifetime.; It is rare that couples reach 50 years of married life together.; To thank the Lord for having reached 50 years of married life together.' },
      { number: 7, type: 'Critical', question: 'What should you do when you are invited?', answer: 'Thank the one inviting.; Send a thank you note.; Tell the host you accept the invitation.' },
    ]
  },
  {
    id: 'en-g5-pre-01',
    gradeLevel: 'Grade 5',
    language: 'English',
    form: 'Pre-test',
    title: 'The Earth',
    wordCount: 69,
    expectedWpm: 90,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`The Earth is almost 93 million miles away from the sun. It is the only planet with known life forms. Its surface is three-fourths water and one-fourth land mass. It is surrounded by gaseous substance called atmosphere. The Earth takes 24 hours to complete its rotation. Rotation causes night and day. As the Earth rotates, it revolves around the sun every 365 ¼ days. This revolution takes one year.`,
    questions: [
      { number: 1, type: 'Literal', question: 'How far is Earth from the sun?', answer: '93 million miles' },
      { number: 2, type: 'Literal', question: 'Where can we find known life forms?', answer: 'Earth' },
      { number: 3, type: 'Literal', question: 'What is the gaseous substance that surrounds the Earth?', answer: 'atmosphere' },
      { number: 4, type: 'Inferential', question: 'How does the Earth move?', answer: 'The Earth rotates on its axis and revolves around the sun.' },
      { number: 5, type: 'Inferential', question: 'What will happen if the Earth gets very near the sun?', answer: 'People will get burned.; It will be hot on Earth.' },
      { number: 6, type: 'Critical', question: 'If the Earth does not rotate, how will you be affected?', answer: 'I would have difficulty telling when to do things and when to sleep.' },
      { number: 7, type: 'Critical', question: 'Would you like the Earth to stop moving? Why?', answer: 'No, because I wouldn’t know how to count the days and years without the Earth’s movement.' },
    ]
  },
  {
    id: 'en-g6-pre-01',
    gradeLevel: 'Grade 6',
    language: 'English',
    form: 'Pre-test',
    title: 'The Typhoon',
    wordCount: 79,
    expectedWpm: 100,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`A typhoon is a strong tropical storm that brings heavy rain and powerful winds. It usually forms over warm ocean waters. When it reaches land, it can cause floods, landslides, and damage to homes and trees. People are advised to stay indoors and prepare emergency supplies before a typhoon arrives. After the storm, communities work together to clean up and help those affected by the disaster.`,
    questions: [
      { number: 1, type: 'Literal', question: 'What kind of weather does typhoon bring?', answer: 'A typhoon brings heavy rain and powerful winds' },
      { number: 2, type: 'Literal', question: 'Where does a typhoon usually form?', answer: 'It usually forms over warm ocean waters.' },
      { number: 3, type: 'Inferential', question: 'Why are people advised to stay indoors during a typhoon?', answer: 'People are advised to stay indoors to stay safe from strong winds, heavy rain, and flying debris.' },
      { number: 4, type: 'Inferential', question: 'What does the passage suggest about the importance of preparation before a typhoon?', answer: 'It suggests that preparation helps protect people and lessen the damage caused by the storm.' },
      { number: 5, type: 'Critical', question: 'What should you include in an emergency kit before a typhoon?', answer: 'You should include food, water, flashlights, batteries, and first aid supplies.' },
      { number: 6, type: 'Critical', question: 'How can you help your community after a typhoon?', answer: 'You can help by cleaning up debris, donating supplies, assisting affected families.' },
    ]
  },
  {
    id: 'en-g7-pre-01',
    gradeLevel: 'Grade 7',
    language: 'English',
    form: 'Pre-test',
    title: 'The Tale of the Two Birds',
    wordCount: 364,
    expectedWpm: 110,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`In a quiet village by the river stood an old bamboo house surrounded by fruit trees. Inside lived a kind farmer named Mang Dado. He owned two birds—Luna, a colorful parrot that stayed in a golden cage inside the house, and Pido, a brown sparrow who freely flew around the yard.

Luna enjoyed delicious seeds and fresh fruits every day. Her cage was clean and decorated with flowers. Pido, on the other hand, had to search far and wide for food, sometimes braving the heat and rain to find a single grain of rice.

Although Luna often boasted about her beauty and comfort, she secretly admired Pido’s freedom. She would watch him soar across the blue sky, wishing she could stretch her wings beyond the bars of her cage.

One afternoon, a strong storm hit the village. The wind blew fiercely, and rain poured heavily. Mang Dado forgot to bring Luna’s cage inside. When the storm passed, the golden cage lay broken on the ground—Luna was gone.

The next morning, Pido found Luna perched on a mango branch, shivering. He offered her some seeds he had saved. Luna realized that even without her cage, life could be difficult—but it was also beautiful.

Days later, Luna decided not to return to the cage. She joined Pido in exploring the world beyond the bamboo house. From then on, the two birds shared freedom, hardship, and friendship.

Luna finally understood that true happiness is not found in comfort alone but in the freedom to live one’s own life.`,
    questions: [
      { number: 1, type: 'Literal', question: 'What does the farmer own?', answer: 'two birds; a parrot and a sparrow' },
      { number: 2, type: 'Literal', question: 'Where did Pido live?', answer: 'In the yard' },
      { number: 3, type: 'Literal', question: 'What happened to Luna’s cage during the storm?', answer: 'It was broken' },
      { number: 4, type: 'Literal', question: 'What kind of bird was Luna?', answer: 'Parrot' },
      { number: 5, type: 'Inferential', question: 'Why did Luna admire Pido?', answer: 'Because he could fly freely' },
      { number: 6, type: 'Inferential', question: 'What lesson did Luna learn from her experience?', answer: 'Freedom is more valuable than comfort.' },
      { number: 7, type: 'Inferential', question: 'What does the broken cage symbolize?', answer: 'The beginning of freedom' },
      { number: 8, type: 'Critical', question: 'If you were Luna, would you go back to the cage? Why?', answer: 'No, because freedom is worth the struggle.' },
      { number: 9, type: 'Critical', question: 'What real-life situation can this story be compared to?', answer: 'People choose freedom over control.' },
      { number: 10, type: 'Critical', question: 'Which type of text similar to this story?', answer: 'Fable, because it teaches a moral lesson.' },
    ]
  },
  {
    id: 'en-g8-pre-01',
    gradeLevel: 'Grade 8',
    language: 'English',
    form: 'Pre-test',
    title: 'The Fascinating Life of Mangrove Forests',
    wordCount: 301,
    expectedWpm: 120,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Along the edges of tropical coastlines where the land meets the sea, mangrove forests thrive. These unique ecosystems are made up of trees and shrubs that grow in salty, shallow waters. With their tangled roots rising above the mud and water, mangroves create a complex habitat for countless species of fish, birds, crabs, and other marine creatures.

The roots of mangrove trees serve more than one purpose. They anchor the trees firmly in soft, shifting soil and protect the coastline from strong waves and erosion. At the same time, these roots provide shelter and breeding grounds for many young fish and other sea animals. When the tide rises, small creatures hide among the roots; when it falls, birds and crabs feed on the rich nutrients left behind.

Mangroves also play a critical role in keeping our planet healthy. They act as natural filters, trapping sediments and pollutants that would otherwise damage coral reefs and seagrass beds. Moreover, mangroves absorb large amounts of carbon dioxide, helping reduce the impact of climate change.

Despite their importance, mangrove forests are disappearing due to human activities such as cutting trees for charcoal, converting land for shrimp farming, and building coastal resorts. This destruction leads to loss of habitat for marine life and increased vulnerability of coastal communities to floods and storms.

Protecting mangrove forests requires cooperation among governments, local communities, and individuals. Planting mangroves, reducing pollution, and practicing responsible coastal development are just some of the ways we can help. When we care for mangroves, we also protect the countless lives—both human and animal—that depend on them.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Where do the trees and shrubs grow in the text?', answer: 'salty and shallow waters' },
      { number: 2, type: 'Literal', question: 'What do we call those trees and shrubs that grow in the salty and shallow waters?', answer: 'mangroves' },
      { number: 3, type: 'Literal', question: 'What is one function of mangrove roots mentioned in the text?', answer: 'They protect coastlines from erosion.' },
      { number: 4, type: 'Inferential', question: 'Why are mangrove forests described as “unique ecosystems”?', answer: 'Because they are home to both land and sea organisms.' },
      { number: 5, type: 'Inferential', question: 'What can be inferred about the role of mangroves in climate regulation?', answer: 'They help lessen the effects of global warming.' },
      { number: 6, type: 'Inferential', question: 'What is the author’s purpose in writing this passage?', answer: 'To persuade readers to protect mangrove forests.' },
      { number: 7, type: 'Critical', question: 'What statements from the text support the idea that mangroves protect coastal areas?', answer: 'Their roots trap sediments and pollutants, and they anchor the soil and reduce erosion.' },
      { number: 8, type: 'Critical', question: 'What best summarizes paragraph 3 of the passage?', answer: 'Mangroves contribute to a cleaner and more stable environment.' },
      { number: 9, type: 'Critical', question: 'How would you describe the tone of the last paragraph?', answer: 'The tone is serious but encouraging.' },
      { number: 10, type: 'Critical', question: 'What is the author’s point of view about mangroves?', answer: 'The author believes that mangroves are essential and must be preserved.' },
    ]
  },
  {
    id: 'en-g9-pre-01',
    gradeLevel: 'Grade 9',
    language: 'English',
    form: 'Pre-test',
    title: 'The Rise of Smart Drones',
    wordCount: 264,
    expectedWpm: 130,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`In 2023, AeroTech Innovations announced the upcoming release of its latest creation—the “SkyMate” smart drone. Originally planned for launch in July, the company postponed the event to October to allow engineers more time for testing its upgraded navigation system. The delay was meant to ensure that the drone would perform safely and accurately before being introduced to the public.

SkyMate is designed to assist people in various tasks such as delivering packages, monitoring traffic, and capturing aerial photos and videos. It can fly up to 40 kilometers per hour and carry small objects weighing up to 10 kilograms. According to AeroTech, the drone can be controlled remotely or programmed to follow a specific route on its own.

AeroTech is known for its innovative use of artificial intelligence and renewable energy. The company aims to create technology that is both helpful and eco-friendly. What makes SkyMate special is its built-in AI system that allows it to avoid obstacles, adjust to weather changes, and even return to its base automatically when its battery runs low. Other countries, like the United States and Japan, have released similar drones, but SkyMate stands out because of its energy-saving solar panels and advanced safety sensors.

Many people are excited about SkyMate’s release, believing it will make transportation and delivery more efficient. However, some experts are concerned about possible misuse, such as invasion of privacy or accidents caused by system errors. AeroTech, on the other hand, assures the public that the drone’s safety measures have been thoroughly tested and that strict rules will be implemented once SkyMate enters the market.`,
    questions: [
      { number: 1, type: 'Literal', question: 'What is the smart product created?', answer: 'smart drone' },
      { number: 2, type: 'Literal', question: 'What is the name of the smart drone developed by AeroTech Innovations?', answer: 'SkyMate' },
      { number: 3, type: 'Literal', question: 'Why was the release of SkyMate postponed from July to October?', answer: 'To give engineers more time to test the upgraded navigation system for safety and accuracy.' },
      { number: 4, type: 'Literal', question: 'How fast can SkyMate fly?', answer: 'Up to 40 kilometers per hour.' },
      { number: 5, type: 'Inferential', question: 'Why do you think AeroTech included solar panels and safety sensors in SkyMate’s design?', answer: 'To make the drone more energy-efficient and reduce the risk of accidents.' },
      { number: 6, type: 'Inferential', question: 'What can be inferred about AeroTech’s goals as a company?', answer: 'AeroTech aims to develop technology that is innovative, safe, and environmentally friendly.' },
      { number: 7, type: 'Inferential', question: 'How does the author show that public reaction to SkyMate’s release is mixed?', answer: 'The author mentions that while many people are excited, some experts are worried about misuse and privacy issues.' },
      { number: 8, type: 'Critical', question: 'In your opinion, how can drones like SkyMate improve daily life?', answer: 'They can make delivery, monitoring, and photography faster and more convenient.' },
      { number: 9, type: 'Critical', question: 'What possible rules or policies should be created to prevent drones from being misused?', answer: 'Rules could include flight restrictions, privacy protection laws, and licensing for drone operators.' },
      { number: 10, type: 'Critical', question: 'Do you think the benefits of using smart drones outweigh the risks? Explain your answer.', answer: 'Yes, the benefits of using smart drones outweigh the risks because they can make transportation, delivery, and rescue operations faster and more efficient. They can also help monitor traffic, take aerial photos for research, and deliver goods safely. As long as proper rules and safety measures are followed, drones can greatly improve our daily lives.; The benefits and risks of smart drones are both significant. Drones can help save time and energy in many industries, but they also raise concerns about privacy and security. If people use them responsibly and the government enforces clear regulations, the advantages can be greater than the risks.; I think the risks of using smart drones might outweigh the benefits because they can be misused for spying, invading privacy, or causing accidents. Technology can fail, and when it does, it can harm people or property. It’s important to make sure drones are used safely before they are widely allowed.; Yes, smart drones are beneficial because they use renewable energy like solar power and can reduce pollution from delivery vehicles. They also make tasks safer by replacing humans in risky jobs such as inspecting tall buildings or disaster areas.' },
    ]
  },
  {
    id: 'en-g10-pre-01',
    gradeLevel: 'Grade 10',
    language: 'English',
    form: 'Pre-test',
    title: 'The Ancient Treasures of Bolinao',
    wordCount: 281,
    expectedWpm: 140,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`In 1965, during the excavation of a small hill in Balingasay, Bolinao, Pangasinan, construction workers accidentally discovered several ancient burial jars and human remains. Archaeologists were immediately called to investigate and later confirmed that the site contained artifacts dating back to the 14th and 15th centuries. The discovery sparked great interest among historians and archaeologists, who believed that the area was once a thriving coastal settlement engaged in early trade.

Among the most remarkable finds was a skull adorned with gold dental decorations—now known as the Bolinao Skull. The gold pegs were carefully shaped and inserted into the teeth, showing the early Filipinos’ advanced knowledge of dental ornamentation and craftsmanship. This practice reflected wealth, social status, and artistry. Other skeletal remains nearby also showed traces of gold work, further proving that body adornment was an important cultural tradition during that time.

Aside from the gold ornaments, numerous glass beads, earthenware jars, and pieces of Chinese porcelain were unearthed at the site. These discoveries suggest that Bolinao had established trading connections with neighboring Asian countries, particularly China and Thailand. Archaeologists concluded that the people of Bolinao were not isolated but were part of a broader network of trade and cultural exchange.

The Bolinao archaeological site has since become one of the most valuable cultural and historical treasures in the Philippines. Many of the artifacts recovered from the site are now displayed in the National Museum, where they continue to provide insight into the lifestyle, artistry, and international relations of ancient Filipinos. The site stands as evidence that even before the Spanish period, early communities in the Philippines were already highly developed in trade, craftsmanship, and culture.`,
    questions: [
      { number: 1, type: 'Literal', question: 'What did the construction workers discover?', answer: 'ancient burial jars and human remain' },
      { number: 2, type: 'Literal', question: 'When and where were these discovered?', answer: 'It was discovered in 1965 at Balingasay, Bolinao, Pangasinan' },
      { number: 3, type: 'Literal', question: 'What was the most remarkable find mentioned in the passage?', answer: 'The Bolinao Skull, which had gold dental decorations.' },
      { number: 4, type: 'Literal', question: 'Where are the artifacts from Bolinao currently displayed?', answer: 'In the National Museum of the Philippines' },
      { number: 5, type: 'Inferential', question: 'What can be inferred about the people of Bolinao based on the gold dental decorations?', answer: 'They valued beauty and social status and possessed advanced craftsmanship skills.' },
      { number: 6, type: 'Inferential', question: 'How does the discovery of foreign artifacts like Chinese porcelain help historians understand ancient Philippine society?', answer: 'It shows that early Filipinos had trade relationships and cultural exchanges with neighboring countries.' },
      { number: 7, type: 'Inferential', question: 'Why do you think the discovery of the Bolinao site was important to Philippine history?', answer: 'It provided evidence that ancient Filipinos were already civilized and connected to international trade before colonization.' },
      { number: 8, type: 'Critical', question: 'In your opinion, how can archaeological discoveries like the Bolinao site help Filipinos today appreciate their heritage?', answer: 'They remind us of our ancestors’ achievements and inspire pride in our cultural identity.' },
      { number: 9, type: 'Critical', question: 'What do you think should be done to preserve archaeological sites like Bolinao?', answer: 'The government and communities should protect them from destruction, support research, and promote awareness through education.' },
      { number: 10, type: 'Critical', question: 'How do such discoveries change the way we view early Filipino civilization?', answer: 'They show that early Filipinos were intelligent, creative, and globally connected long before colonial influence.' },
    ]
  },
  {
    id: 'fil-g1-pre-01',
    gradeLevel: 'Grade 1',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Mahiwagang Kamay',
    wordCount: 53,
    expectedWpm: 50,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`May sakit si Luis. Mahiwagang kamay ang kailangan niya.
“Hihilutin ko ang ulo mo,” sabi ni Hinlalaki.
“Pupunasan ko ang iyong pawis,” sabi naman ni Palad at Mga Daliri.
“Yayakapin ko siya,” dagdag pa ni Braso.
Idinilat ni Luis ang kanyang mga mata. Nasa tabi niya ang kanyang ina. Magaling na si Luis.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang nagpagaling kay Luis?', answer: 'Ang Mahiwagang Kamay' },
      { number: 2, type: 'Literal', question: 'Ano-ano ang ginawa ng mahiwagang kamay?', answer: 'Hinilot ni Hinalalaki ang ulo ni Luis.; Pinunasan ni Daliri at mga Palad ang kanyang pawis.; Niyakap siya ni Braso.' },
      { number: 3, type: 'Literal', question: 'Sino ang nasa tabi niya paggising?', answer: 'Ang kanyang ina' },
      { number: 4, type: 'Inferential', question: 'Bakit nagging mahiwaga ang kamay ng nanay?', answer: 'Dahil painagaling nito ang sakit ni Luis.; Dahil inalagaan niya si Luis.' },
      { number: 5, type: 'Inferential', question: 'Bakit hindi maaaring si Palad o sina Daliri lamang ang pupunas ng pawis ni Luis?', answer: 'Dahil hindi makakikilos si Palad ng di niya ikikilos sina Daliri.; Dahil lahat ng parte ng kamay ay dapat katulong sa paggalaw.' },
      { number: 6, type: 'Critical', question: 'Naniniwala ka ba na nakapagpapagaling ng sakita ang mga kamay ng iyong ina? Bakit?', answer: 'Opo, dahil inaalagaan ako ng mga kamay ng aking ina.; Opo, dahil hinihilot ng nanay ang aking ulo kapag ako ay maysakit.; Opo, dahil pinupunasan ng nanay ko ang aking pawis.' },
      { number: 7, type: 'Critical', question: 'Bakit kaya ang ina ang laging tinatawag ng mga anak kung maysakit sila?', answer: 'Dahil mula pa man sa pagkasanggol ay karaniwang ang ina ang laging nangangalaga sa mga anak.; Karaniwan nang ang ina ang laging takbuhan ng mga anak.; Ang ina ang nagbibigay ng ginhawa sa anak na maysakit.' },
    ]
  },
  {
    id: 'fil-g2-pre-01',
    gradeLevel: 'Grade 2',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Salamat Kaibigan!',
    wordCount: 68,
    expectedWpm: 60,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Nag-uunahang manghuli ng tipaklong sina Baste, Lean at Makoy. Inilalagay nila sa bote ang kanilang huling tipaklong.
“Lean, lagyan mo nang butas ang takip ng bote,” utos ni Baste.
“Huwag na!” sigaw ni Lean.
“Hindi makahihinga ang mga tipaklong. Alam mo bang kinakain nito ang mga insektong sumisira sa mga pananim? Kaya mamaya, pakakawalan din natin sila,” ani ni Baste.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Sino ang nag-uunahang manghuli ng tipaklong?', answer: 'Baste, Lean, at Makoy' },
      { number: 2, type: 'Literal', question: 'Saan nila nilalagay ang kanilang mga nahuhuli?', answer: 'Sa bote' },
      { number: 3, type: 'Literal', question: 'Bakit pinalagyan ni Baste ng butas ang bote?', answer: 'Para makahinga ang mga tipaklong.' },
      { number: 4, type: 'Inferential', question: 'Ano ang pakinabang ng mga tipaklong?', answer: 'Kinakain ng mga tipaklong ang mga insketong sumisira sa mga pananim.; Ito at nagsisilbing pagkain ng ilang mga Pilipino.' },
      { number: 5, type: 'Inferential', question: 'Bakit kaya pakakawalan din nina Baste ang mga tipaklong?', answer: 'Upang patuloy itong kumain ng mga insketong sumisira ng mga pananim.; Para hindi mamatay ang mga tipaklong.; Upang dumami pa ang mga tipaklong.' },
      { number: 6, type: 'Critical', question: 'Paano mo pinahahalagahan ang mga nilikha ng Diyos na tulad ng tipaklong?', answer: 'Aalagan ko ang mga ito.; Hindi ako papatay ng tipaklong.; Hahayaan ko silang mabuhay sa lugar na nakalaan para sa kanila.' },
      { number: 7, type: 'Critical', question: 'May mga bubuyog na dumadapo sa inyong halamanan. Ano ang gagawin mo?', answer: 'Hahayaan ko sila dahil kumukuha lamang sila ng katas ng bulaklak.; Hindi ako lalapit dahil baka makagat ako.' },
    ]
  },
  {
    id: 'fil-g3-pre-01',
    gradeLevel: 'Grade 3',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Nakakabilib Talaga…',
    wordCount: 83,
    expectedWpm: 70,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`“Naku! Nanay, nagsasayaw ang mga niyog. Ay hindi! Mardigra pala o ang pagsasayaw sa kalsada. Suot ng mga mananayaw ang mga materyales na gawa sa niyog. Ang mga palda at shorts ng mga mananayaw ay yari sa dahon ng punong niyog na ikinapit sa tela. Pati butones ay gawa sa bao. Nakakabilib talaga.”
“Aba! Sunod-sunod ang naggagandahang karosa na yari sa iba’t ibang bahagi ng niyog” sigaw pa niya.
“Darene gising! Napapanaginipan mo na naman ang napanood mong Coco Festival sa San Pablo.”`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang mardigra?', answer: 'pagsasayaw sa kalsada' },
      { number: 2, type: 'Literal', question: 'Saan yari ang mga palda at shorts ng mga mananayaw?', answer: 'Sa isang bahagi ng puning niyog na ikinapit sa tela.' },
      { number: 3, type: 'Literal', question: 'Tungkol saan ang napanaginipan ni Darene?', answer: 'Coco Festival ng San Pablo' },
      { number: 4, type: 'Inferential', question: 'Bakit laging napapanaginipan ni Darene ang Coco Festival?', answer: 'Dahil nakakabilib ang kasuotan gawa sa niyog.; Dahil sa nakakabilib ang karosang gawa sa niyog.' },
      { number: 5, type: 'Inferential', question: 'Bakit tila totoo ang nakikita ni Darene sa kanyang panaginip tungkol sa mardigra?', answer: 'Dahil lubhang makulay ang pagdiriwang na ito.; Dahil natuwa siya sa kanyang napanood.' },
      { number: 6, type: 'Critical', question: 'Nakita mo sa isang grupo ng mga tao na pinuputol an mga puno sa kagubatan. Ano ang gagawin mo?', answer: 'Pipigilan sila sa ginagawang pagputol ng putol.; Ipapaalam sa kanila ang kahulugan ng puno.' },
      { number: 7, type: 'Critical', question: 'Anong iba pang mga kagamitan o ang pagkaing mula sap uno ng niyog na kapaki-pakinabang sa mga tao? Paano mo pahahalagahan ang mga ito?', answer: 'Walis tingting; Iba’t ibang kakanin; Mga gamot; Iba’t ibang palamuti; Pahahalagahan ko ang mga gamit mula sa niyog sa pamamagitan ng paggamit sa mga ito.; Masinop sa mga kagamitang yari sa pamamagitan ng paggamit yar isa puno ng niyog.' },
    ]
  },
  {
    id: 'fil-g4-pre-01',
    gradeLevel: 'Grade 4',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Isang Kagitingan ang Magsilbi sa Iba',
    wordCount: 116,
    expectedWpm: 80,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Sa loob ng apat na taon, nagtapos si Olivia Salamanca ng medesina. Siya ang kauna-unahang Pilipinang doktor. Nagpakadalubhasa siya sa Estados Unidos sa paggagamot ng tuberkulosis o sakit sa baga na karaniwang ikinamamatay ng mga Pilipino noon. Naglibot siya sa mga pagamutan sa Amerika upang mapagbuti ang paggagamot bago nagbalik sa Pilipinas.

Nang umuwi siya sa ating bansa, iniukol niya ang kanyang panahon sa panggagamot nang walang bayad sa mga kababayan nating may tuberkulosis. Bunga na rin ng kanyang gawain, noong 1911, nahirang siyang kalihim ng Anti Tuberculosis Society.

Sa labis na pagod at madalas na pakikisalamuha sa mga maysakit ng TB, siya naman ay nagkasakit din nito. Namatay siya sa murang gulang na dalawampu’t apat.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Sa loob ng ilang taon tinapos ni Olivia Salamanca ang pagdodoktor?', answer: 'apat na taon' },
      { number: 2, type: 'Literal', question: 'Anong sakit ang karaniwang ikinamamatay ng mga Pilipino noon?', answer: 'tuberkolosis, TB o sakit sa baga' },
      { number: 3, type: 'Literal', question: 'Ilang taong gulang si Olivia nang siya ay namatay?', answer: 'dalawampu’t apat (24)' },
      { number: 4, type: 'Inferential', question: 'Bakit kaya iniukol ni Olivia ang kanyang panahon sa panggagamot sa mga kababayan nating may tuberkulosis?', answer: 'Dahil mahal niya ang kanyang mga kababayan.; Dahil naaawa siya sa mga ito.; Dahil gusto niyang mabawasan ang mga namamatay sa sakit na ito.; Dahil gusto niyang iligtas ang mga Pilipino sa sakit na ito.; Dahil naniniwala siyang matutulungan niya ang mga ito.; Dahil may pagmamalasakit siya sa kapwa-Pilipino.' },
      { number: 5, type: 'Inferential', question: 'Paano ipinakita ni Olivia ang pagmamalasakit sa mga kababayan?', answer: 'Ginamot niya sila nang walang bayad.; Iniukol niya ang kanyang panahon sa panggagamot sa kanila.; Nagpakadalubhasa siya sa panggagamot sa sakit na ito.; Naglibot siya sa mga pagamutan sa Amerika upang pag-aralan ang panggagamot sa tuberkolosis.; Tiniis niya ang pagod sa panggagamot.; Nakikisalamuha siya sa mga maysakit kahit na ito ay nakakahawa.' },
      { number: 6, type: 'Critical', question: 'Paano mo mapapangalagaan ang iyong sarili laban sa sakit?', answer: 'Mag-eehersisyo po ako.; Kumain ng masustansiyang mga pagkain.; Matulog ng may sapat na oras.; Iwasang lumapit sa mga taong may nakakahawang sakit.; Panatilihing malinis ang aking kapaligiran.; Maligo araw-araw.; Kumain sa tamang oras.' },
      { number: 7, type: 'Critical', question: 'May naganap na sakuna sa inyong lugar. Paano ka tutulong sa biktima?', answer: 'Bigyan sila ng pagkain.; Mag-ambag ng damit o gamit na kailangan nila.; Patuluyin sila sa aming tahanan' },
      { number: 8, type: 'Critical', question: 'May medical mission sa inyong lugar. Anong tulong ang maibibigay mo sa mga miyembro nito?', answer: 'Sabihin sa mga kapitbahay ang tungkol sa medical mission.; Tumulong sa paglilista ng mga pangalan ng magpapagamot.; Tmulong sa maaring ipagawa ng mga nasa medical mission na kaya kong gawin.' },
    ]
  },
  {
    id: 'fil-g5-pre-01',
    gradeLevel: 'Grade 5',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Jesse Robredo: Huwarang Lingkod-Bayan',
    wordCount: 137,
    expectedWpm: 90,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Bago pa man maging Kalihim ng Department of the Interior and Local Government (DILG), si Jesse Robredo ay kilala na bilang isang tapat at masipag na alkalde ng Naga City. Sa loob ng maraming taon ng kanyang pamumuno, ipinakita niya ang uri ng lider na bukas sa mamamayan, marunong makinig, at handang maglingkod nang walang kapalit.

Isang araw ng Agosto 2012, binigla ang bansa ng balitang bumagsak ang eroplanong sinasakyan ni Secretary Robredo. Ikinabigla ito ng mga Pilipino, lalo na ng mga taga-Naga na labis na nagmamahal sa kanya. Sa kabila ng kanyang pagpanaw, nanatiling buhay ang alaala ng kanyang tapat na pamumuno at “tsinelas leadership” — isang simbolo ng pagiging mapagkumbaba at malapit sa tao.

Hanggang ngayon, si Jesse Robredo ay kinikilalang inspirasyon ng mga lider at kabataang nagnanais maglingkod sa bayan nang may puso at katapatan.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Anong posisyon ang hinawakan ni Jesse Robredo bago siya maging Kalihim ng DILG?', answer: 'Alkalde ng Naga City' },
      { number: 2, type: 'Literal', question: 'Ano ang tawag sa uri ng pamumuno na isinulong ni Jesse Robredo?', answer: 'Tsinelas Leadership' },
      { number: 3, type: 'Literal', question: 'Ano ang nangyari kay Jesse Robredo noong Agosto 2012?', answer: 'Bumagsak ang eroplanong kanyang sinasakyan at siya ay pumanaw.' },
      { number: 4, type: 'Inferential', question: 'Ano ang ipinahihiwatig ng “tsinelas leadership”?', answer: 'Isang pamumunong payak, mapagkumbaba, at malapit sa karaniwang tao.' },
      { number: 5, type: 'Inferential', question: 'Bakit patuloy pa rin hinahangaan si Jesse Robredo kahit siya ay pumanaw na?', answer: 'Dahil iniwan niya ang huwarang halimbawa ng tapat, mababang-loob, at makataong pamumuno.' },
      { number: 6, type: 'Inferential', question: 'Ano ang damdaming nangingibabaw sa mga mamamayan ng Naga matapos ang kanyang pagpanaw?', answer: 'Kalungkutan at labis na paggalang sa isang lider na tunay na naglingkod sa kanila.' },
      { number: 7, type: 'Critical', question: 'Paano mo maipapakita sa iyong sariling paraan ang “tsinelas leadership” sa paaralan o tahanan?', answer: 'Sa pamamagitan ng pagiging masinop, mapagpakumbaba, at handang tumulong sa iba nang walang hinihinging kapalit.' },
      { number: 8, type: 'Critical', question: 'Kung ikaw ay magiging lider, anong aral mula kay Jesse Robredo ang gusto mong isabuhay?', answer: 'Ang pagiging tapat at may malasakit sa mga taong pinaglilingkuran.' },
      { number: 9, type: 'Critical', question: 'Bakit mahalagang maalala at ituro sa kabataan ang mga katangian ni Jesse Robredo?', answer: 'Dahil siya ay magandang huwaran ng lider na inuuna ang kapakanan ng tao bago ang sarili.' },
    ]
  },
  {
    id: 'fil-g6-pre-01',
    gradeLevel: 'Grade 6',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Sa Panahon ng Lindol',
    wordCount: 152,
    expectedWpm: 100,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Ang lindol ay isang likas na kalamidad na maaaring magdulot ng malaking pinsala sa tao at kapaligiran. Walang tiyak na oras o araw kung kailan ito mararanasan, kaya mahalagang laging handa ang bawat mamamayan. Kapag naganap ang lindol, maaaring masira ang mga gusali, tulay, at kalsada. Maaari rin itong magdulot ng sunog, pagguho ng lupa, at pagkawala ng kuryente o tubig.

Upang maiwasan ang labis na pinsala, may mga hakbang na isinasagawa ang pamahalaan at mga mamamayan. Kabilang dito ang pagdaraos ng earthquake drill, pagtatayo ng matibay na istruktura, at pagsasanay sa mga tauhan ng barangay sa pagtugon sa sakuna.

Mahalaga rin ang pagtutulungan ng mga tao sa panahon ng kalamidad. Ang mga kapitbahay ay dapat magtulungan sa pagsagip sa mga nasugatan, paglikas ng mga bata at matatanda, at pagbibigay ng mga pangunahing pangangailangan tulad ng pagkain at tubig. Sa ganitong paraan, napoprotektahan hindi lamang ang sarili kundi pati ang buong komunidad.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang pangunahing paksa ng binasang teksto?', answer: 'Ang paghahanda sa panahon ng lindol' },
      { number: 2, type: 'Literal', question: 'Ano ang mga posibleng epekto ng lindol ayon sa akda?', answer: 'Pagkasira ng gusali, tulay, at kalsada; Pagguho ng lupa; Pagkawala ng kuryente at tubig' },
      { number: 3, type: 'Literal', question: 'Anong hakbang ang ginagawa upang matutunan ng mga mamamayan ang tamang pagtugon sa lindol?', answer: 'Pagdaraos ng earthquake drill' },
      { number: 4, type: 'Literal', question: 'Anong tungkulin ang ginagampanan ng barangay sa paghahanda sa sakuna?', answer: 'Pagsasanays a mga tauhan para tumugon sa oras ng kalamidad.' },
      { number: 5, type: 'Inferential', question: 'Bakit mahalagang magtulungan ang mga mamamayan sa panahon ng kalamidad?', answer: 'Dahil sa pagtutulungan, mas mabilis ang pagresponde at mas maraming buhay ang naliligtas.' },
      { number: 6, type: 'Inferential', question: 'Ano ang ipinahihiwatig ng pahayag na “napoprotektahan hindi lamang ang sarili kundi pati ang buong komunidad”?', answer: 'Na ang kabutihan ng isa ay nakaaapekto sa kaligtasan ng lahat.' },
      { number: 7, type: 'Inferential', question: 'Ano ang damdamin ng may-akda sa mga taong handang tumulong sa kapwa sa oras ng sakuna?', answer: 'Paghanga at papuri sa kanilang kabayanihan at malasakit.' },
      { number: 8, type: 'Critical', question: 'Paano mo maipapakita ang pagiging handa sa ganitong kalamidad sa inyong paaralan o tahanan?', answer: 'Sa pamamagitan ng pagsunod sa mga safety drill at paghahanda ng emergency kit.' },
      { number: 9, type: 'Critical', question: 'Kung ikaw ay lider ng barangay, anong programa ang iyong ipatutupad upang maging handa ang mga mamamayan?', answer: 'Magpapatupad ako ng regular na pagsasanay at seminar tungkol sa kaligtasan sa lindol.' },
      { number: 10, type: 'Critical', question: 'Sa iyong palagay, bakit mahalagang turuan ang kabataan tungkol sa disaster preparedness?', answer: 'Dahil sila ang makatutulong sa kanilang pamilya at komunidad sa panahon ng sakuna at sila ang kinabukasan ng bayan.' },
    ]
  },
  {
    id: 'fil-g7-pre-01',
    gradeLevel: 'Grade 7',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Laban Pa Rin',
    wordCount: 95,
    expectedWpm: 110,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Sa bawat unos na dumarating,
May liwanag pa ring nag-aantabay sa hangin.
Huwag kang bibitaw kahit parang wala nang pag-asa,
Sapagkat ang tagumpay ay nasa mga di sumusuko sa laban ng buhay.

Ang kahinaan ay bahagi lamang ng pagbangon.
Ang pagkatalo ay hakbang tungo sa tagumpay na inaasam.
Tanggapin mo ang mga pagkakamali bilang gabay,
At matutong ngumiti sa gitna ng unos at lumbay.

Hindi madali, ngunit hindi rin imposibleng magtagumpay.
Tiwala sa sarili, pananalig sa Maykapal, at pusong handang lumaban—
Iyan ang sandata ng sinumang gustong magtagumpay.
Kaya laban pa rin—hanggang sa huli.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang ipinapayo ng tula sa taong dumaraan sa pagsubok?', answer: 'Huwag sumuko at magpatuloy sa laban ng buhay.' },
      { number: 2, type: 'Literal', question: 'Ayon sa tula, saan nagmumula ang tagumpay?', answer: 'Sa mga taong hindi sumusuko at patuloy na lumalaban.' },
      { number: 3, type: 'Literal', question: 'Ano ang itinuturing na “sandata” sa huling saknong ng tula?', answer: 'Tiwala sa sarili, pananalig sa Diyos, at pusong handang lumaban.' },
      { number: 4, type: 'Literal', question: 'Ano ang ibig sabihin ng “unos” sa tula?', answer: 'Sumasagisag ito sa mga problema o pagsubok sa buhay.' },
      { number: 5, type: 'Inferential', question: 'Bakit sinasabing ang “kahinaan ay bahagi ng pagbangon”?', answer: 'Dahil sa bawat pagkakamali o pagkatalo, natututo at tumitibay ang tao.' },
      { number: 6, type: 'Inferential', question: 'Ano ang tono o damdaming nangingibabaw sa kabuuan ng tula?', answer: 'Positibo at nagbibigay-inspirasyon upang magpatuloy sa buhay.' },
      { number: 7, type: 'Inferential', question: 'Anong pag-uugali ng persona sa tula ang dapat tularan?', answer: 'Ang pagiging matatag, may pananampalataya, at hindi sumusuko sa hamon.' },
      { number: 8, type: 'Critical', question: 'Paano mo maipapakita sa iyong buhay ang aral ng tula?', answer: 'Sa pamamagitan ng hindi pagsuko sa mga pagsubok at pagpapatuloy sa pag-abot ng pangarap kahit mahirap.' },
      { number: 9, type: 'Critical', question: 'Kung ikaw ang persona sa tula, ano ang iyong magiging hakbang kapag nabigo?', answer: 'Aaminin ang pagkakamali, matututo mula rito, at magsisimula muli nang may lakas ng loob.' },
      { number: 10, type: 'Critical', question: 'Sa iyong palagay, bakit mahalagang magtiwala sa sarili at sa Diyos ayon sa tula?', answer: 'Dahil ang tiwala sa sarili at pananampalataya ay nagbibigay-lakas upang magtagumpay kahit sa gitna ng paghihirap.' },
    ]
  },
  {
    id: 'fil-g8-pre-01',
    gradeLevel: 'Grade 8',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ano ang Iyong Gawa, Tao?',
    wordCount: 92,
    expectedWpm: 120,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Ikaw na nilalang na may isip at damdamin,
Handog ng Maykapal, ikaw ay may hangarin.
Sa mundong ito, ika’y tagapangalaga,
Ng buhay, ng likas na yaman, ng kapwa mong aba.

Binigyan ka ng talino’t kakayahang tumuklas,
Upang paunlarin, hindi upang wasakin ang bukas.
Ngunit sa pag-iral ng pagnanais na maghari,
Nalilimutan mong ikaw din ay may tungkuli’t puri.

Kaya’t ngayo’y tanong ko sa’yo, O tao kong giliw,
Hanggang kailan mo dudungisan ang daigdig na magiliw?
Kung tunay kang marunong, ipakita sa gawa,
Na ang puso mo’y may malasakit sa lahat ng nilikha.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang pangunahing paksa ng tula?', answer: 'Ang tungkulin ng tao na pangalagaan ang kapwa at kalikasan.' },
      { number: 2, type: 'Literal', question: 'Ano ang dalawang katangiang taglay ng tao ayon sa tula?', answer: 'Isip at damdamin.' },
      { number: 3, type: 'Literal', question: 'Ayon sa ikalawang saknong, ano ang layunin ng talinong ibinigay sa tao?', answer: 'Upang paunlarin ang mundo at hindi ito sirain.' },
      { number: 4, type: 'Inferential', question: 'Ano ang ipinahihiwatig ng pahayag na “Nalilimutan mong ikaw din ay may tungkuli’t puri”?', answer: 'Na madalas abusuhin ng tao ang kalikasan at kapangyarihang taglay, imbes na gamitin ito sa kabutihan.' },
      { number: 5, type: 'Inferential', question: 'Ano ang damdamin ng makata sa ikatlong saknong?', answer: 'Pag-aalala at panawagan sa tao na magbago at maging responsable sa kanyang mga gawain.' },
      { number: 6, type: 'Inferential', question: 'Bakit ginamit ng makata ang mga salitang “isip” at “puso” sa paglalarawan sa tao?', answer: 'Dahil ipinakikita nito na ang tao ay dapat gumamit ng talino na may kasamang malasakit at pagmamahal.' },
      { number: 7, type: 'Critical', question: 'Sa anong paraan mo maipapakita ang pagiging “tagapangalaga” ng kalikasan sa araw-araw?', answer: 'Sa pamamagitan ng pagtatanim ng puno, pag-iwas sa pagtatapon ng basura, at paggalang sa lahat ng nilikha.' },
      { number: 8, type: 'Critical', question: 'Kung ikaw ay bibigyan ng pagkakataong baguhin ang mga maling gawi ng tao, ano ang una mong gagawin?', answer: 'Hihikayatin ko ang mga tao na maging disiplinado at responsable sa pangangalaga ng kapaligiran.' },
      { number: 9, type: 'Critical', question: 'Ano ang pinakamahalagang aral na natutuhan mo mula sa tula?', answer: 'Na ang tunay na katalinuhan ay nasusukat sa kabutihan at malasakit na ipinapakita sa kapwa at kalikasan.' },
    ]
  },
  {
    id: 'fil-g9-pre-01',
    gradeLevel: 'Grade 9',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Sigaw ng Mundo',
    wordCount: 221,
    expectedWpm: 130,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Sa panahon ngayon, hindi na mabilang ang mga pagbabago sa ating kapaligiran. Makikita natin ang matatayog na gusali, mga ilaw na walang patid, at mga taong abala sa pag-unlad. Ang mga makabagong teknolohiya ay nagdudulot ng ginhawa at bilis sa ating pamumuhay. Ngunit sa likod ng kaginhawaang ito, may mga ingay na hindi napapansin—ang sigaw ng mundong ating tinitirhan.

Habang tayo ay patuloy na umaasenso, unti-unti namang humihina ang kalikasan. Ang mga punong dating nagbibigay ng lilim, ngayo’y ginagawang daan at gusali. Ang mga ilog na dati’y malinaw ay ngayo’y marumi at amoy kemikal. Ang hangin na dati’y sariwa ay may halong usok at alikabok. Sa pagnanais nating paunlarin ang buhay, nakalilimutan nating may hangganan din ang mundo.

Hindi maikakaila na kasalanan ng tao ang karamihan sa mga pagbabagong ito. Sa pagputol ng puno, sa walang habas na pagmimina, sa pagtatapon ng basura—tila nakalilimutan nating tayo rin ang unang tatamaan ng sariling kapabayaan. Hindi sapat ang mga salitang “ako’y nagmamalasakit sa kalikasan.” Kailangan itong ipakita sa gawa, sa simpleng paraan, araw-araw.

Hindi pa huli ang lahat. Kung magbubukas tayo ng mata at kikilos bilang isang bansa, maibabalik pa natin ang sigla ng kalikasan at pag-asa ng mundo. Sapagkat sa huli, hindi teknolohiya o pera ang magliligtas sa atin—kundi ang ating malasakit at pagkakaisa bilang mga tagapangalaga ng buhay.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang pangunahing paksa ng sanaysay?', answer: 'Ang epekto ng pag-unlad at teknolohiya sa kalikasan at panawagang alagaan ito.' },
      { number: 2, type: 'Literal', question: 'Ano ang ilang halimbawa ng pagkasira ng kalikasan na binanggit sa teksto?', answer: 'Pagputol ng puno, maruming ilog, polusyon sa hangin, at walang habas na pagmimina.' },
      { number: 3, type: 'Literal', question: 'Ayon sa teksto, ano ang tanging paraan upang mapigilan ang pagkasira ng mundo?', answer: 'Pagkakaisa, disiplina, at malasakit ng tao sa kalikasan.' },
      { number: 4, type: 'Inferential', question: 'Ano ang nais ipahiwatig ng linyang “may mga ingay na hindi napapansin—ang sigaw ng mundong ating tinitirhan”?', answer: 'Na hindi pinapansin ng tao ang mga babala ng kalikasan tulad ng pagbaha, polusyon, at pagkasira ng lupa.' },
      { number: 5, type: 'Inferential', question: 'Ano ang saloobin ng may-akda sa labis na paggamit ng teknolohiya at pag-unlad?', answer: 'Nababahala siya sapagkat nagdudulot ito ng kapabayaan at pagkasira ng kalikasan.' },
      { number: 6, type: 'Inferential', question: 'Ano ang ipinahihiwatig ng pahayag na “hindi teknolohiya o pera ang magliligtas sa atin”?', answer: 'Na higit na mahalaga ang pagkakaisa at malasakit kaysa sa materyal na bagay o kaunlaran.' },
      { number: 7, type: 'Critical', question: 'Sa anong paraan mo maipapakita ang malasakit sa kalikasan sa iyong pang-araw-araw na buhay?', answer: 'Sa pamamagitan ng pagtatanim, paggamit ng eco-bag, pag-recycle, at hindi pagtatapon ng basura kung saan-saan.' },
      { number: 8, type: 'Critical', question: 'Kung ikaw ay lider ng komunidad, anong proyekto ang ipatutupad mo upang mapangalagaan ang kalikasan?', answer: 'Magpapatupad ako ng “Basura Mo, Sagot Mo” program at magtuturo ng disiplina sa mga kabataan tungkol sa tamang pangangalaga sa kalikasan.' },
      { number: 9, type: 'Critical', question: 'Ano ang pinakamahalagang aral na natutunan mo mula sa akda?', answer: 'Na ang tunay na pag-unlad ay yaong isinasaalang-alang ang kalikasan at kapakanan ng lahat ng nilalang.' },
    ]
  },
  {
    id: 'fil-g10-pre-01',
    gradeLevel: 'Grade 10',
    language: 'Filipino',
    form: 'Pre-test',
    title: 'Ang Regalo ni Ama',
    wordCount: 268,
    expectedWpm: 140,
    isSample: false,
    source: 'MoSY Phil-IRI 2025-2026',
    text:
`Tahimik ang buong bahay nina Marco nang araw na iyon. Katatapos lang ng ulan, at tila ba kasabay ng pagbuhos nito ang pagod na nararamdaman ng kanyang ama. “Marco, anak, pakisindi nga ng lampara. Medyo madilim,” mahina ngunit banayad na sabi ni Mang Tomas.

Agad na lumapit si Marco. “Ama, hindi pa ba kayo magpapahinga? Maghapon na kayong nagtrabaho sa bukid.” Ngumiti si Mang Tomas, ngunit kapansin-pansin ang pamumutla ng kanyang mukha. “Kaunting tiis na lang, anak. Makakabili rin tayo ng gamot ng iyong ina. ‘Yan ang pinakamagandang regalo ko sa kanya sa kaarawan niya bukas.”

Kinabukasan, maaga pa lamang ay naglakad na si Mang Tomas patungo sa bayan upang ibenta ang kanyang ani. Madilim pa ang paligid at madulas ang daan dahil sa ulan kagabi. Habang tinatahak niya ang kalsada, bigla siyang nadulas sa putikan at tumama ang ulo sa malaking bato sa gilid ng daan. Walang nakakita sa kanya hanggang sa sumapit ang umaga.

Bandang tanghali, nakarating si Marco sa bayan upang hanapin ang ama. Doon niya natagpuan si Mang Tomas, duguan at wala nang malay. Sa kanyang kamay ay mahigpit na nakahawak pa rin sa supot na may pera—pera sanang pambili ng gamot ng kanyang asawa. Lumuhod si Marco at niyakap ang malamig na katawan ng ama.

Sa hapag na dati’y puno ng tawanan, ngayo’y katahimikan ang nangingibabaw. Ang perang iniwan ni Mang Tomas ay ginamit ni Marco upang bilhin ang gamot ng ina. Habang pinapainom niya ito, bumuhos muli ang ulan. Ngunit sa puso ni Marco, alam niyang iyon ay luha ng langit—luha ng isang amang nagmahal nang higit sa sarili.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Saan nagtatrabaho si Mang Tomas?', answer: 'Sa bukid siya nagtatrabaho.' },
      { number: 2, type: 'Literal', question: 'Ano ang dahilan kung bakit nagpunta si Mang Tomas sa bayan?', answer: 'Upang ibenta ang kanyang ani at makabili ng gamot para sa asawa.' },
      { number: 3, type: 'Literal', question: 'Ano ang trahedyang nangyari kay Mang Tomas?', answer: 'Nadulas siya sa putikan, tumama ang ulo sa bato, at namatay.' },
      { number: 4, type: 'Inferential', question: 'Ano ang ipinahihiwatig ng pahayag na “luha ng langit” sa huling talata?', answer: 'Sumasagisag ito sa kalungkutan ng langit at ng pamilya sa pagkamatay ni Mang Tomas, ngunit maaari ring simbolo ng pagmamahal at sakripisyo.' },
      { number: 5, type: 'Inferential', question: 'Bakit itinuring ni Mang Tomas na “regalo” ang gamot para sa asawa?', answer: 'Dahil sa kahirapan, iyon lamang ang makakayanan niyang maibigay, at para sa kanya, ang kalusugan ng asawa ay higit sa anumang materyal na bagay.' },
      { number: 6, type: 'Inferential', question: 'Ano ang ipinakikitang katangian ni Mang Tomas bilang ama?', answer: 'Mapagmahal, masipag, at handang magsakripisyo para sa pamilya.' },
      { number: 7, type: 'Critical', question: 'Kung ikaw si Marco, paano mo ipapakita ang iyong pagmamahal sa ama pagkatapos ng nangyari?', answer: 'Patuloy kong ipagdarasal siya, aalagaan ko si Ina, at ipagpapatuloy ko ang mga pangarap niya.' },
      { number: 8, type: 'Critical', question: 'Ano ang aral na mapupulot mo mula sa kwento ni Mang Tomas?', answer: 'Na ang tunay na pagmamahal ay nasusukat sa sakripisyo at hindi sa halaga ng regalo.' },
      { number: 9, type: 'Critical', question: 'Paano mo maipapakita sa iyong pamilya ang pagpapahalaga sa kanilang mga sakripisyo?', answer: 'Sa pamamagitan ng pagtulong, pakikinig, paggalang, at pagpapasalamat sa bawat araw.' },
    ]
  },
{
    id: 'fil-g7-post-01',
    gradeLevel: 'Grade 7',
    language: 'Filipino',
    form: 'Post-test',
    title: 'Mahalin Natin ang Ating Kapaligiran',
    wordCount: 424,
    expectedWpm: 110,
    isSample: false,
    source: 'Phil-IRI for JHS Manual 2024 — Pananapos na Pagtatasa sa Filipino; Sinulat ni Davis Jr. C. Labawig',
    text:
`Hindi mo ba natanong sa sarili mo kung paano mo namamalayan ang mga nangyayari sa ating kapaligiran? Natanong mo rin ba sa sarili mo kung ano ang magagawa mo para sa Inang Kalikasan? Ang ating kapaligiran parang kapatid na rin natin dahil ito ay parang isang tao na kailangang alaagaan, mahalin, protektahan, at huwag pabayaan kundi ito ay pagmalasakitan.

Ang ating kamalayan sa ating kapaligiran o sa ating Inang Kapaligiran ay mahalaga dahil minsan hindi mo na alam kung ano ang ginagawa mo na sa kanya at minsan hindi mo na talaga napapansin na parang napapatay mo na pala siya na parang isang hayop na kinakatay lamang. Kung napapansin ninyo ngayon ang ginagawa ngayon ng mga tao sa ating mga Likas na Yaman, ito ngayon ay paubos nang paubos hanggang hindi mo namalayan na wala na pala. Ito ay isa lamang sa mga ginagawang kasamaan ng tao sa ating kalikasan. Ang mga ibang tao naman ay gumagawa lamang ng mga kasamaan sa ating kalikasan kung kinakailangan at itong mga gawain naman na ito ay minsan tumutulong sa ating mga pangangailangan sa ating araw-araw na buhay. Kung may inaayunan naman ang kalikasan, meron din itong kinaiinisan. Itong kanyang kinaiinisan ay ang mga taong gumagawa ng mga delikadong mga pamamaraan na kung minsan din ay lumalason sa ating “Kapatid”.

Kung patuloy itong nagaganap sa ating kapaligiran, malamang maidadamay rin ang mga walang kinalaman sa ganti ng kalikasan. Ang mga halimbawa ng mga ganti ng kalikasan ay ang mga patuloy at magkakasunod na pagdating ng mga kalamidad tulad ng nangyari sa Japan na napakalakas na lindol at ang kasunod ay isang dambuhalang tsunami na sumira ng mga gusali, bahay, kalakal, at kumitil ng mga buhay. Ang iba pang kasunod ng mga trahedyang mga iyon ay ang nuclear leak. Ang mga iba pang kalamidad na dumating dito sa ating kapaligiran ay ang mga sunod-sunod na mga bagyo na nagdatingan sa ating bansa.

Ang mga trahedyang nangyayari ay ilan lamang sa sinyales ng pagganti ng kalikasan. Kung ito ay magpapatuloy, pwede ring maubos ang ating lahi sa pagdating ng panahon. Ang mga ginagawa natin ngayon ay pwedeng igganti ng kalikasan sa mga anak, ng anak, ng kanilang mga anak, at ng kanilang anak. Malamang wala na ring maaabutan ang ating mga anak na sariwang hangin, mga hayop na kalaro, o kaya mga malilinis at magagandang mga tanawin, tulad ng mga Seven Wonders of the World, o kaya ang Chocolate Hills, ang Maria Christina Falls, at marami pang iba. Dapat rin nating ituro sa ating mga anak ang kahalagahan ng ating kalikasan, na dapat natin itong alagaan, protektahan, mahalin at huwag pababayaan dahil totoo nga ang wika ng ating Pambansang Bayani na si Dr. Jose Rizal na “Ang kabataan ang pagasa ng ating bayan.”`,
    questions: [
      { number: 1, type: 'Literal', question: 'Batay sa unang bahagi ng binasang teksto, saan tahasang inihahambing ang kalikasan? (literal)', answer: 'D. isang tao' },
      { number: 2, type: 'Literal', question: 'Alin sa sumusunod na pahayag ang tuwirang tumutukoy sa ganti ng kalikasan? (literal)', answer: 'D. pananalasa ng iba’t ibang kalamidad' },
      { number: 3, type: 'Inferential', question: '“Ang ibang tao ay gumagawa lamang ng kasamaan sa ating kalikasan kung kinakailangan dahil ito ang kanilang ikinabubuhay.” Ano ang nais ipabatid ng pahayag? (paghihinuha)', answer: 'A. Labag sa kanilang kalooban ang ginagawang masama.' },
      { number: 4, type: 'Inferential', question: 'Itong kaniyang kinaiinisan ay ang mga taong gumagawa ng mga delikadong mga pamamaraan na kung minsan din ay lumalason sa ating “Kapatid”. Sino ang tinutukoy na kapatid sa akda? (paghihinuha)', answer: 'C. Kapaligiran' },
      { number: 5, type: 'Inferential', question: '“Kung patuloy itong nagaganap sa ating kapaligiran, malamang maidadamay rin ang mga walang kinalaman sa ganti ng kalikasan.” Ano ang nais iparating ng may-akda sa pahayag na ito? (paghihinuha)', answer: 'A. pagbibigay-babala' },
      { number: 6, type: 'Literal', question: 'Alin sa sumusunod ang HINDI pinaninindigan ng may-akda ukol sa isyung tinatalakay? (literal)', answer: 'B. Ang mga kalamidad ay tunay na parusa sa tao dahil sa pagkasira ng kalikasan.' },
      { number: 7, type: 'Critical', question: 'Bakit kailangang matutunan ng mga kabataan ang wastong pagpapahalaga sa ating kalikasan? (kritikal)', answer: 'C. upang mapreserba ang kagandahan ng kapaligiran' },
      { number: 8, type: 'Critical', question: 'Ano ang maaring gawin ng tao upang makatulong at mas lalo pang gumanda ang ating kapaligiran? (kritikal)', answer: 'D. Pagkakaroon ng solid waste management control sa bawat komunidad.' },
      { number: 9, type: 'Critical', question: 'Kung ikaw ang kabataan na tinutukoy ng ating pambansang bayani na si Dr. Jose P. Rizal bilang pag-asa ng bayan, ano ang munting paraan na magagawa mo para sa kalikasan? (kritikal)', answer: 'B. Hikayatin ang buong pamilya na simulan ang maayos na pagtapon ng basura.' },
      { number: 10, type: 'Critical', question: 'Bilang isang mabuting mag-aaral sa Baitang 7, paano mo maipakikita ang pagmamahal sa ating kapaligiran lalo na sa loob ng paaralan? (kritikal)', answer: 'C. Paglilinis sa silid-aralan at pagtapon ng basura sa wastong lalagyan.' }
    ]
  },

  {
    id: 'fil-g8-post-01',
    gradeLevel: 'Grade 8',
    language: 'Filipino',
    form: 'Post-test',
    title: 'PANGUNAHING SENYALES NG DIABETES SA MGA BATA',
    wordCount: 520,
    expectedWpm: 120,
    isSample: false,
    source: 'Phil-IRI for JHS Manual 2024 — Pananapos na Pagtatasa sa Filipino; Hango mula sa https://www.ritemed.com.ph/diabetes/chronic-series-pangunahing-senyales-ng-diabetes-sa-mga-bata; Mga tanong mula kay Adrian Karl L. Cobardo',
    text:
`Ayon sa International Diabetes Foundation, ang Pilipinas ay isa sa mga bansang may mabilis na pagtaas ng bilang ng nagkakaroon ng diabetes. Noong taong 2014, mahigit tatlong milyong Pinoy ang nagkaroon ng diabetes sa buong bansa. Mula sa datos ng Philippine Diabetes Association, apektado na ang mga bata sa elementarya at high school ng sakit ng diabetes habang tinataya ng Philippine Society of Pediatric Metabolism and Endocrinology na nasa 8 percent ng mga batang Pilipino ay diabetic. Isa sa bawat sampung diabetic ay mga bata.

Sobra ang sugar sa dugo ng taong may diabetes. Ang sugar na ito ay nanggagaling sa mga pagkain gaya ng tinapay, cereals, pasta, kanin, prutas, gulay at ibang produktong may dairy.

Ang Type 1 Diabetes ang karaniwang uri ng diabetes na tumatama sa mga bata. Ang lapay o pancreas ng batang may Type 1 diabetes ay hindi kayang mag-produce ng insulin, ang hormone na nagkokontrol ng blood sugar level. Ang mga batang may ganitong kondisyon ay nangangailangang magturok ng sinulin at mag-monitor ng blood sugar habambuhay.

Ang mga batang obese o overweight, may family history ng diabetes, hindi aktibo at hindi kumakain ng maayos ay may malaking tsansang magkaroon ng Type 2 Diabetes. Sa Type 2 Diabaetes, ang lapay ay nakakagawa pa ng insulin, ngunit ang insulin ang syang hindi nagfufunction ng tama.

Paano nga ba malalaman kung ang inyong mga anak ay may diabetes sa murang edad pa lamang? Heto ang mga sintomas ng Type 1 Diabetes.

Madalas na pag-ihi at pag-inom ng tubig.
Inaalis ng katawan ang sobrang blood sugar sa pamamagitan ng ihi. At dahil sa madalas na pag-ihi, napapadalas din ang pag-inom ng tubig.

Pagkain ng madami.
Madalas magutom ang batang may Type 1 Diabetes dahil wala itong nakukuhang sapat na energy dahil sa kakulangan ng sugar.

Pamamayat.
Dahil sa kawalan ng energy na binibigay ng sugar, ang tissue ng muscles at taba ay lumiit na nagreresulta sa pagpayat. Ito ang una sa mga senyales ng diabetes.

Pagkadama ng sobrang pagod.
Ang kakulangan ng sugar sa cells ng katawan ng bata ang nagdudulot ng pakiramdam ng sobrang pagkapagod.

Malabong paningin.
Dahil sa masyadong mataas ang blood sugar ng isang bata, may klase ng fluid na nahahatak mula sa lente ng mata nito na nagdudulot ng pagkalabo ng mata.

Yeast Infection.
Ang mga batang babaeng mayroong type 1 diabetes ay maaaring silang makaranas ng pangangati sa kanilang ari na dulot ng yeast infection.

Mahalagang magpakonsulta agad sa doctor kung napansin ang mga nabanggit dahil maaaring maiwasan ang ibang kumplikasyon kung madedetect ng maaga ang kondisyon. Ayon sa Diabetes UK, karamihan ng mga kaso ng type 1 diabetes ay hindi agad na-diagnose. Ang mga batang may type 1 diabetes na hindi agad na-detect ay maaaring magkaroon ng tinatawag na ‘diabetic ketoacidosis’ (DKA). Ang DKA ang pangunahing sanhi ng pagkamatay ng mga type 1 diabetic. Sa mga bata namang may Type 2 diabetes, ang paglala ng sakit ay mas mabilis kumpara sa matatanda. Mas mataas din ang tsansa nilang magkaroon ng kumplikasyon gaya ng sakit sa kidney at maya kaysa sa mga batang may Type 1 diabetes.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Ano ang sobra sa dugo ng isang tao kaya nagkakaroon siya ng Diabetes? (literal)', answer: 'C. Sugar' },
      { number: 2, type: 'Literal', question: 'Ayon sa Philippine Diabetes Association, ilang milyong Pilipino ang tinatayang may Diabetes noong taong 2014? (literal)', answer: 'C. 3 milyon' },
      { number: 3, type: 'Literal', question: 'Alin sa sumusunod ang ligtas na kainin upang maiwasan ang mataas na lebel asukal sa dugo? (literal)', answer: 'B. isda at seafoods' },
      { number: 4, type: 'Literal', question: 'Paano nagkakaroon ng Type 1 Diabetes ang isang tao na karaniwang tumatama sa mga bata? (literal)', answer: 'A. Ang lapay ay hindi nagpoproduce ng insulin na isang hormone na nagkokontrol sa blood sugar level.' },
      { number: 5, type: 'Inferential', question: 'Anong sitwasyon ang makadaragdag sa tyansang magkaroon ang isang bata ng Type 2 Diabetes? (paghihinuha)', answer: 'B. I at III' },
      { number: 6, type: 'Inferential', question: 'Sino sa mga bata ang nagpapakita ng sintomas ng Type 1 Diabetes? (paghihinuha)', answer: 'D. Danovan at Lixli' },
      { number: 7, type: 'Critical', question: 'Ano ang pangunahing hakbang kung sakaling mapansin ang mga sintomas ng pagkakaroon ng Type 1 Diabetes? (kritikal)', answer: 'D. Magpakonsulta agad sa doktor para maiwasan ang komplikasyon.' },
      { number: 8, type: 'Critical', question: 'Ano ang maaaring mangyari sa batang hindi maagang na-detect na may Type 1 Diabetes? (kritikal)', answer: 'A. Maaaring magkaroon ng tinatawag na “diabetic ketoacidosis” (DKA) na nakamamatay.' },
      { number: 9, type: 'Literal', question: 'Alin sa mga espesyalistang doktor ang maaaring lapitan upang mamonitor ang tamang pagkain para sa batang may Diabetes? (literal)', answer: 'B. Nutritionist' },
      { number: 10, type: 'Critical', question: 'Ano ang panghabang buhay na gamot para sa isang batang may Type 1 Diabetes? (kritikal)', answer: 'B. Pagturok ng insulin injections para sa kanilang insulin deficiency sa mga bata.' }
    ]
  },

  {
    id: 'fil-g9-post-01',
    gradeLevel: 'Grade 9',
    language: 'Filipino',
    form: 'Post-test',
    title: 'Alegorya ng Upuan',
    wordCount: 441,
    expectedWpm: 130,
    isSample: false,
    source: 'Phil-IRI for JHS Manual 2024 — Pananapos na Pagtatasa sa Filipino; Sinulat ni Leo A. Tolentino',
    text:
`Sa mga programa sa eskwelahan, tuwing Buwan ng Wika, Nutrition Month, United Nations, Recognition Day, o kahit na sa Graduation, iyong mga upuang nasa entablado ang sentro ng mga mata ng mga manonood. Iyong mga upuang may ukit na disenyong bulaklakin, makinis dahil sa pagkakabarnis, malambot upuan na sadyang iniayos para sa mga “mahal na tao.” Samantalang ang mga upuan naman sa ibaba ng entablado ay inihanay lamang nang madalian, binagsak nang pabarabara, na animo’y walang pag-aalala kung masira. Kahit na madumi o may sulat, luma at magaspang, at kung may awang man ay tinahi ng alambreng isinuot sa mga butas upang hanggang sa makakaya pa ay magamit at mapagpatungan.

Sa selebrasyon ng misa, ang upuang nakalaan para sa pari ang pinakamarangya. Kung gusto mong makita ang pinakakomportableng mauupuan sa paaralan, makikita mo ito sa opisina ng punongguro. Ang pinakaeleganteng upuan ay nasa tanggapan ng presidente ng kompanya at di naman mawawala ang karingalan at kamahalan ng tronong inuupuan ng hari sa isang kaharian. Samantalang ang mga karaniwang upuan, ay nanduong pagpapatung-patungin lamang upang maisalansan sa bodegang taguan. Saka lang muli ilalabas kung gagamitin para sa ilang oras na programa sa mga okasyong hayag ang pagtatangi sa kanila.

Muli ay sisipatin ko ang upuan sa itaas ng entablado. Ang upuang sentro ng lahat. Nagyayabang sa kanyang lunan. Isang hayag na pedestal na maghihiwalay sa estado ng sinumang doo’y uupo at tiyak na papalakpakan.

Habang ang lahat ay nagnanais na duo’y maluklok, hindi ko kailangang nasain ang gayon. Sapat na para sa isang guro ang manatiling nakatayo sa mga gilid-gilid upang magbantay sa kanyang mga pinaglilingkurang mag-aaral. Sapagkat habang ninanasa ng marami ang maupo sa maringal na upuan, isang bagay ang tiyak na mangyayari sa programa ng buhay. Matapos ang lahat ng mga espesyal na bilang, masigabong hiyawan at palakpakan, maging ang mga perpektong talumpati at pagpaparangal, bababa ang mga nasa entablado, tatayo ang mga nasa karaniwang upuan pati iyong mga nakasalampak sa sahig. Lahat, upang lumabas sa bulwagan. Sapagkat pinatugtog na ang huling musika ng paghihiwalay. At bago patayin ang ilaw, muling isasalansan ang mga upuan, upang magamit na muli ng iba sa mga darating na araw. At ang mahahalagang upuan, ay matutulad din ba sa iba? Maluluma, masisira hanggang sa isalansan ding kasama ng iba sa bodegang taguan.

Kung naniniwala ang iba na ang kaalaman ay nagmumula sa mga nasa pangunahing upuan, magugulat ka kapag nakita mo na ang tunay na nakakakita ay silang mula sa likod, sa mga di napapansing nasa dulo, sa mga nasa hamak na mababa. Doon sa pader na mapusyaw ang kulay kaysa sa pisara o entablado na talagang pininturahang espesyal sa mata.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Batay sa binasa, alin ang hindi kapantay ng iba?', answer: 'B. upuan sa ibaba ng entablado' },
      { number: 2, type: 'Literal', question: 'Sino ang nagsasalita sa teksto?', answer: 'A. guro' },
      { number: 3, type: 'Literal', question: 'Sa unang talata, anong estilo ang ginamit ng manunulat sa pagtalakay sa ideya ng upuan?', answer: 'B. paglalarawan' },
      { number: 4, type: 'Inferential', question: 'Aling sa sumusunod ang HINDI tinalakay sa ikaapat na talata?', answer: 'A. Dapat paniwalaan na may kaalamang matututuhan sa mga espesyal na upuan.' },
      { number: 5, type: 'Inferential', question: 'Saan sa sumusunod mababasa ang paksang pangungusap?', answer: 'D. Ikalimang talata' },
      { number: 6, type: 'Inferential', question: 'Ang isang “alegorya” ay pagpapakita ng kahulugang higit sa literal o konotasyon ng salitang tinatalakay. Ano ang konotatibong kahulugan ng “upuan”?', answer: 'A. kalagayan sa buhay' },
      { number: 7, type: 'Inferential', question: 'Ano ang nangibabaw na damdamin o tono ng teksto?', answer: 'C. Pagpapahalaga sa mga nasa kalagayang mababa' },
      { number: 8, type: 'Inferential', question: 'Anong paraan ang ginamit ng manunulat upang mas mapalinaw ang damdamin ng teksto?', answer: 'C. Paglalarawan sa magkaibang bagay upang maipakita ang kahigitan ng isa sa isa.' },
      { number: 9, type: 'Inferential', question: 'Sa pagtatapos ng akda, papaano inihanay ng manunulat ang mga ideya?', answer: 'D. pagpapakita ng imahe ng mga upuang nakapwesto sa likuran na pag-iisipan' },
      { number: 10, type: 'Inferential', question: 'Anong paraan ang masasabing ginamit ng may-akda upang makalap ang mga impormasyong inilahad niya sa teksto?', answer: 'C. pagmamasid' }
    ]
  },

  {
    id: 'fil-g10-post-01',
    gradeLevel: 'Grade 10',
    language: 'Filipino',
    form: 'Post-test',
    title: 'WHANG-OD: ANG KUWENTO SA LIKOD NG HULING TUNAY NA MAMBABATOK',
    wordCount: 499,
    expectedWpm: 140,
    isSample: false,
    source: 'Phil-IRI for JHS Manual 2024 — Pananapos na Pagtatasa sa Filipino; Sinulat ni Jonell John O. Espalto; Matador Network. Whang-Od: The Last True Tattoo Artist / Short Film (May 10, 2018)',
    text:
`Tanyag ang mga tribo sa Kalinga sa malalaki at detalyadong mga tattoo na makikita sa kanilang katawan. Makikita mo ang patunay na ito sa mga matatanda sa kanilang hanay, kung paanong ang tradisyong ito na tinatawag na pagbabatok ay pinangangambahang tuluyan nang maglaho. Kulturang unti-unti nang namamatay. Mabuti at ang tradisyong ito ay naipagpapatuloy pa ng natitirang orihinal na mambabatok na si Apo Whang-od.

Sa Kalinga matatagpuan ang Buscalan, isang maliit na barangay na makikita sa pinakamataas na bahagi ng kabundukan ng Kalinga. Ayon sa kasaysayan, sa lokasyong ito ay mas madaling makikita ng mga ninuno ang kalaban kung sakali man na sila ay lusubin o sakupin. Kaya naman kung nais na magtungo at makita ang tunay na mambabatok ay kailangang matiyagang akyatin ang matarik na lugar na pinaninirahan niya. Bahagi ito ng hirap na kailangang mapagdaanan makita lang si Whang-od.

“Isang daang taon? Maaaring isang daang taon na ako. Matanda na ako,” ani Whang-od. Ang sining na pambabatok ay kaniya ng kinalakihan. Nagsimula ang kaniyang pambabatok sa edad na 15 na taong gulang, bagay ipinamana ng kaniyang ama. Ang paglalagay ng tattoo sa katawan ay hindi lamang basta palamuti sa kanila, ito ay sumasagisag sa kalakasan at katapangan para sa mga mandirigma sa lugar nila. Ayon kay Whang-od magkaiba ang tattoo ng lalaki sa babae. “Sa kababaihan ang tattoo ay palamuti, sa mga ninuno nila kailangang magpalagay ng tattoo kapag sila ay ikinasal na at kung sila man ay mamatay mananatili na ang tattoo magpakailanman. Ang mga materyal na bagay gaya ng kasuotan o ginto ay maglalaho ngunit ang iyong mga tattoo ay mananatiling nakikita ng mga espiritu ng kanilang mga ninuno. Sa kalalakihan ang tattoo ay inilalagay kapag nakapatay sila ng kalaban. Kapag nagawa nila ito magpapalagay sila ng tattoo dahil isa na silang ganap na maarmot o mandirigma. “Sa kasalukuyan, halos karamihan ay nais ng magpatattoo” dagdag pa niya.

Upang magawa ni Whang-od ang pambabatok gumagamit siya ng sanga ng kalamansi na may tinik at inilalagay sa dulong bahagi ng isang patpat na kahoy. Mula rito ay gagawa siya ng marka gamit ang abo at tubig sabay ang pagbabatok upang magawa ang tanging likhang sining. Para sa mga taong nakaranas ng kaniyang pagbabatok marami ang nagsasabi na kailangang isipin na hindi masakit upang hindi maramdaman ang sakit sa pagbabatok. Ayon sa tradisyon, ang kaniyang pagta-tattoo ay maaari lamang mamana ng kaniyang angkan. Naniniwala si Whang-od na magkakaimpeksyon ang tattoo kapag hindi niya kadugo ang magbabatok.

Ani Whang-od, hihinto siya sa pambabatok kapag tuluyan nang lumabo ang kaniyang mga mata dahil na rin sa kaniyang edad. Kaya naman hinihikayat na niya ang kaniyang dalawang apo sa pamangkin na ipagpatuloy ang tradisyong ito sa sandaling tuluyan na siyang huminto sa gawaing ito. Nais niyang ipagpatuloy ng mga apo niya ang tradisyong namana pa niya sa mga ninuno.

Tunay nga namang kahanga-hanga ang tradisyong ito at isa sa maipagmamalaki na mayamang kultura ng ating bansa. Ito ang katangi-tanging kuwento ni Whang-od, ang itinuturing na huling tunay na mambabatok.`,
    questions: [
      { number: 1, type: 'Literal', question: 'Anong akdang pampanitikan ang naglalayong magpahayag, magpaliwanag, at magsalaysay ng mga pananaw o kaalaman? (literal)', answer: 'D. Sanaysay' },
      { number: 2, type: 'Literal', question: 'Ayon sa teksto paano napanatili sa bayan ng Kalinga ang tradisyong pambabatok na nanganganib nang maglaho? (literal)', answer: 'B. Ipinagpatuloy ni Whang-od ang kultura ng pambabatok upang hindi mawala sa bayan ng Kalinga.' },
      { number: 3, type: 'Literal', question: 'Ano ang pangunahing paksa at binigyang pokus sa tekstong binasa? (literal)', answer: 'B. Pambabatok ni Whang-od.' },
      { number: 4, type: 'Inferential', question: 'Anong damdamin ang maaaring nararamdaman ng mga taga-Kalinga sakaling maglaho ang kultura ng pambabatok? (paghihinuha)', answer: 'D. Pangamba' },
      { number: 5, type: 'Critical', question: '“Ang paglalagay ng tattoo sa mga kalalakihan ay hindi lang basta palamuti sa kanila”. Anong malinaw na dahilan sa paglalagay ng tattoo sa kanila? (kritikal)', answer: 'D. Ang tattoo ay sumasagisag sa kalakasan at katapangan para sa mga mandirigma sa lugar nila.' },
      { number: 6, type: 'Inferential', question: 'Batay sa iyong ebalwasyon, paano naipakita ng tekstong binasa na ang pagta-tattoo ay dapat lamang na mamana ng angkan ni Apo Whang-od? (paghihinuha)', answer: 'C. Ipinakita sa teksto na ang tattoo ay magkakaimpeksyon kung hindi niya kadugo ang magbabatok.' },
      { number: 7, type: 'Critical', question: 'Paano ipinakita sa akda na ang tinalakay na paksa ay isang suliranin partikular sa preserbasyon ng kultura sa Pilipinas? (kritikal)', answer: 'B. Sa pamamagitan ng paglalatag ng mga totoong pangyayari, lokasyon at mga taong nakapanayam.' },
      { number: 8, type: 'Critical', question: 'Sa modernisadong panahon, angkop pa ba na isagawa ang tradisyunal na pambabatok sa Kalinga? (kritikal)', answer: 'D. Oo, dahil sa pamamagitan nito ay naipagpapatuloy ang mga tradisyon namana pa sa mga ninuno.' },
      { number: 9, type: 'Inferential', question: 'Ano ang mensahe na nais ipabatid ng talatang ito sa tekstong binasa? “Ani Whang-od hihinto siya sa pambabatok kapag tuluyan ng lumabo ang kaniyang mga mata dahil na rin sa kaniyang edad. Kaya naman hinihikayat na niya ang kaniyang dalawang apo sa pamangkin na ipagpatuloy ang tradisyong ito sa sandaling huminto na talaga siya. Nais niyang ipagpatuloy ng apo niya ang tradisyong namana pa nya sa kaniyang mga ninuno.” (paghihinuha)', answer: 'C. Nais lamang na ipakita sa bahaging ito na ang pambabatok ay nais niyang maipagtuloy ng kaniyang mga apo.' },
      { number: 10, type: 'Critical', question: 'Ano ang posibleng magiging epekto kung ang tradisyunal na pagtatattoo ay patuloy na susuportahan at yayakapin ng lokal na gobyerno ng Kalinga at ng ating bansa? (kritikal)', answer: 'C. Mas makikilala ang tradisyunal na pambabatok at makakatulong sa turismo ng Kalinga.' }
    ]
  }


];

/** Look up a passage by id, falling back to a custom record if one exists. */
export function findPassage(passages: PhilIriPassage[], id: string): PhilIriPassage | undefined {
  return passages.find(p => p.id === id);
}

/** Look up a GST set by id. */
export function findGstSet(sets: PhilIriGstSet[], id: string): PhilIriGstSet | undefined {
  return sets.find(s => s.id === id);
}