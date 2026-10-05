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