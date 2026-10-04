/* ============================================================================
   DEPED PEDAGOGY CARDS — Learning Design Strategy Library
   ──────────────────────────────────────────────────────────────────────────
   Source: Bureau of Learning Delivery, Department of Education
           https://learning.deped.gov.ph/

   Implements the classroom strategies mandated under DepEd Order No. 016,
   s. 2026. Each strategy is tagged with:
     • principle      — which of the 8 Learning Design Principles it serves
     • keyStages      — which DepEd key stages it is suggested for
     • grouping       — individual / pairs / small-group / whole-class
     • duration       — rough classroom time in minutes
     • tags           — search keywords

   Card schema (kept deliberately flat so it survives future UI changes):
     id, title, principle, keyStages, grouping, duration,
     summary (one line), description (paragraph), steps (array),
     tags, example (a short classroom vignette), variants (optional array)
   ============================================================================ */

export type PedagogyPrinciple =
  | 'Clear Goals and Teaching'
  | 'Active Retrieval and Spacing'
  | 'Checks for Understanding'
  | 'Scaffolding'
  | 'Social Learning'
  | 'Inclusion'
  | 'Self-awareness and Metacognition'
  | 'Values and Purpose Integration';

export type KeyStage = 'KS1' | 'KS2' | 'KS3' | 'KS4';
export type Grouping = 'Individual' | 'Pairs' | 'Small Group' | 'Whole Class';

export interface PedagogyCard {
  id: string;
  title: string;
  principle: PedagogyPrinciple;
  keyStages: KeyStage[];
  grouping: Grouping;
  duration: number;          // minutes
  summary: string;
  description: string;
  steps: string[];
  tags: string[];
  example?: string;
}

export const PEDAGOGY_PRINCIPLES: PedagogyPrinciple[] = [
  'Clear Goals and Teaching',
  'Active Retrieval and Spacing',
  'Checks for Understanding',
  'Scaffolding',
  'Social Learning',
  'Inclusion',
  'Self-awareness and Metacognition',
  'Values and Purpose Integration'
];

export const KEY_STAGE_LABELS: Record<KeyStage, string> = {
  'KS1': 'Key Stage 1 · K – Grade 3',
  'KS2': 'Key Stage 2 · Grades 4–6',
  'KS3': 'Key Stage 3 · Grades 7–10',
  'KS4': 'Key Stage 4 · Grades 11–12'
};

export const PEDAGOGY_CARDS: PedagogyCard[] = [
  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 1 · CLEAR GOALS AND TEACHING
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'explicit-instruction',
    title: 'Explicit Instruction',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 15,
    summary: 'Model the skill step by step — I Do, We Do, You Do.',
    description: 'A structured, teacher-led approach where concepts are broken into small, digestible steps and demonstrated before learners try them independently. Especially effective for foundational skills in the early grades.',
    steps: [
      'State the goal in learner-friendly language.',
      'I Do — teacher models the skill while thinking aloud.',
      'We Do — the class works through an example together.',
      'You Do — learners practise independently while teacher monitors.',
      'Close with a brief recap of what was learned.'
    ],
    tags: ['modeling', 'direct-instruction', 'foundational-skills', 'scaffolding']
  },
  {
    id: 'roses-thorns-buds',
    title: 'Roses, Thorns, Buds',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'A reflective check-in: what went well, what was hard, what is next.',
    description: 'Learners share one Rose (something positive), one Thorn (a challenge), and one Bud (something they want to learn next). Builds metacognitive habits while giving the teacher a quick read on the lesson.',
    steps: [
      'Explain the three symbols with simple visuals.',
      'Model with your own Rose, Thorn, and Bud.',
      'Give 30 seconds of thinking time.',
      'Learners share with a partner, then a few with the class.',
      'Note common thorns as the basis for the next lesson.'
    ],
    tags: ['reflection', 'feedback', 'metacognition', 'check-in']
  },
  {
    id: 'claim-evidence-reason',
    title: 'Claim · Evidence · Reason',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 20,
    summary: 'A structured response frame for opinion and argument writing.',
    description: 'Learners make a Claim, support it with Evidence from the text or data, and explain their Reasoning. A powerful frame for building argumentative literacy across subject areas.',
    steps: [
      'Introduce the CER frame and post it prominently.',
      'Model with a familiar example from the class.',
      'Learners draft their own CER on the current topic.',
      'Peer review with the question: "Is the evidence strong enough?"',
      'Revise and share one strong example.'
    ],
    tags: ['writing', 'argumentation', 'critical-thinking', 'evidence']
  },
  {
    id: 'concept-unpacking',
    title: 'Concept Unpacking',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS3'],
    grouping: 'Small Group',
    duration: 20,
    summary: 'Break a big idea into parts learners can name and analyse.',
    description: 'Learners dissect a complex concept — definition, characteristics, examples, non-examples, and related ideas — building a shared understanding before moving to application.',
    steps: [
      'Present the target concept and a simple definition.',
      'In groups, learners produce examples and non-examples.',
      'Groups identify the key attributes that make it what it is.',
      'Whole-class synthesis: build one class definition.',
      'Apply the concept to a new scenario.'
    ],
    tags: ['concept-formation', 'analysis', 'inquiry', 'group-work']
  },
  {
    id: 'different-definitions',
    title: 'Different Definitions',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS4'],
    grouping: 'Small Group',
    duration: 15,
    summary: 'Compare how different sources define the same term.',
    description: 'Learners gather definitions of a key concept from multiple textbooks, journal articles, and primary sources, then negotiate a working definition — building disciplinary literacy and critical reading.',
    steps: [
      'Assign a key term for the unit.',
      'Each group studies one source and extracts its definition.',
      'Groups compare definitions and note what varies.',
      'Draft a composite definition that honours all sources.',
      'Discuss why scholars define things differently.'
    ],
    tags: ['definitions', 'source-analysis', 'critical-reading', 'SHS']
  },
  {
    id: 'guided-inquiry',
    title: 'Guided Inquiry',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS4'],
    grouping: 'Small Group',
    duration: 40,
    summary: 'Teacher frames the question; learners design the investigation.',
    description: 'The teacher narrows the scope with a driving question and success criteria, then learners plan, execute, and communicate their own investigation. Bridges structured instruction and independent research.',
    steps: [
      'Pose a rich, open driving question.',
      'Learners draft a plan with teacher feedback.',
      'Execute the investigation in stages.',
      'Compile findings into a short report or presentation.',
      'Reflect on what the process itself taught them.'
    ],
    tags: ['inquiry', 'research', 'investigation', 'SHS', 'independent-learning']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 2 · ACTIVE RETRIEVAL AND SPACING
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'flashback',
    title: 'Flashback',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 5,
    summary: 'A quick, playful recall of yesterday\'s learning.',
    description: 'A rapid-fire warm-up where learners retrieve a fact or skill from a previous lesson. Keeps prior knowledge warm and gives teachers a real-time pulse on retention.',
    steps: [
      'Ask one simple question about the previous lesson.',
      'Give 10 seconds of think time.',
      'Call on 3–4 learners, or take a choral answer.',
      'Celebrate the correct answer and briefly explain if needed.',
      'State today\'s new goal — link to what was recalled.'
    ],
    tags: ['warm-up', 'retrieval', 'recall', 'KS1']
  },
  {
    id: 'recall-warmup',
    title: 'Recall Warmup',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 7,
    summary: 'A written or spoken sprint through last week\'s key ideas.',
    description: 'A short, timed retrieval exercise at the start of class. Learners write down everything they remember about a topic covered 1–2 weeks ago, then compare with a partner.',
    steps: [
      'Announce the topic from a prior lesson.',
      'Set a 3-minute timer.',
      'Learners write everything they remember.',
      'Compare with a partner and add missing items.',
      'Teacher reveals the class "master list" on the board.'
    ],
    tags: ['retrieval', 'spacing', 'warm-up', 'note-taking']
  },
  {
    id: 'readiness-quiz',
    title: 'Readiness Quiz',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS3'],
    grouping: 'Individual',
    duration: 10,
    summary: 'A low-stakes quiz that tells you where learners are starting from.',
    description: 'A short, ungraded quiz at the start of a new unit. Results guide whether you proceed, revisit, or compact. Normalises retrieval practice as part of the culture of the classroom.',
    steps: [
      'Prepare 5–8 quick questions covering prior knowledge.',
      'Administer individually, no talking, no grading pressure.',
      'Collect and quickly scan patterns of responses.',
      'Adjust the lesson based on what the quiz reveals.',
      'Return feedback in the next session.'
    ],
    tags: ['retrieval', 'diagnostic', 'spacing', 'formative-assessment']
  },
  {
    id: 'retrieval-grid',
    title: 'Retrieval Grid',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS3'],
    grouping: 'Pairs',
    duration: 12,
    summary: 'A 3×3 or 4×4 grid of mixed-topic retrieval questions.',
    description: 'Learners complete a grid of questions drawn from different topics and different weeks. The spacing and interleaving force the brain to discriminate between similar concepts.',
    steps: [
      'Design a grid mixing questions from 3–4 recent topics.',
      'Learners work in pairs to complete as many as possible.',
      'Discuss answers, especially any where the pair disagreed.',
      'Learners self-assess and note one area to revisit.',
      'File the grid for a spaced review in two weeks.'
    ],
    tags: ['retrieval', 'interleaving', 'spacing', 'pairs']
  },
  {
    id: 'spaced-review',
    title: 'Spaced Review',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS4'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Scheduled re-visits of content from two weeks ago and earlier.',
    description: 'Deliberately timetabled review sessions revisit material after one, two, and four weeks. Counteracts the forgetting curve and builds durable long-term memory.',
    steps: [
      'Maintain a rolling two-week content log.',
      'At each scheduled review, pose 3–4 retrieval questions.',
      'Learners respond individually in writing.',
      'Discuss the most-missed question in detail.',
      'Add misses to the next review session.'
    ],
    tags: ['spacing', 'retrieval', 'memory', 'SHS']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 3 · CHECKS FOR UNDERSTANDING
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'quick-poll',
    title: 'Quick Poll',
    principle: 'Checks for Understanding',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 3,
    summary: 'Thumbs up, hands, or coloured cards — one-second feedback.',
    description: 'The fastest way to read a room. Learners signal their confidence or answer choice with a simple gesture or card, giving the teacher an instant snapshot.',
    steps: [
      'Pose a yes/no or A/B/C question.',
      'Learners respond with thumbs, hands, or a coloured card.',
      'Scan the room for the distribution of answers.',
      'Follow up with a specific learner if the split is wide.',
      'Adjust pacing or re-explain as needed.'
    ],
    tags: ['formative', 'whole-class', 'quick-check', 'KS1']
  },
  {
    id: 'show-me',
    title: 'Show Me',
    principle: 'Checks for Understanding',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 5,
    summary: 'All learners display their work at once for a whole-class scan.',
    description: 'Learners write their answer on a mini-whiteboard or hold up their notebook. In one sweep the teacher sees every response simultaneously — no hiding.',
    steps: [
      'Pose a short, unambiguous question.',
      'Give 20 seconds for learners to write an answer.',
      'Say "Show me!" — everyone holds up their board at once.',
      'Scan for the outliers, not the majority.',
      'Praise correct answers; privately address the ones who missed.'
    ],
    tags: ['formative', 'whole-class', 'no-hiding', 'KS1']
  },
  {
    id: 'stoplight',
    title: 'Stoplight',
    principle: 'Checks for Understanding',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 5,
    summary: 'Red / Yellow / Green self-assessment of understanding.',
    description: 'Learners place a coloured marker on their desk to silently signal their confidence: green = confident, yellow = unsure, red = lost. The teacher circulates to the reds first.',
    steps: [
      'Give every learner three coloured cards or a stoplight bookmark.',
      'Midway through the lesson, ask them to display one.',
      'Silently walk to the red desks and offer support.',
      'Pair yellows with greens for peer explanation.',
      'Re-check at the end of the lesson.'
    ],
    tags: ['self-assessment', 'confidence-check', 'differentiation']
  },
  {
    id: 'exit-tickets',
    title: 'Exit Tickets',
    principle: 'Checks for Understanding',
    keyStages: ['KS3'],
    grouping: 'Individual',
    duration: 5,
    summary: 'A short written response collected at the end of every lesson.',
    description: 'One or two questions that capture whether learners grasped the lesson objective. Collected and reviewed by the teacher before the next class to inform planning.',
    steps: [
      'Prepare a single question or a "3-2-1" prompt.',
      'Distribute tickets in the last 5 minutes.',
      'Learners respond in writing.',
      'Collect at the door as learners leave.',
      'Sort into three piles: got it, almost, not yet.'
    ],
    tags: ['formative', 'exit-slip', 'assessment', 'planning']
  },
  {
    id: 'milestone-checkpoints',
    title: 'Milestone Checkpoints',
    principle: 'Checks for Understanding',
    keyStages: ['KS4'],
    grouping: 'Individual',
    duration: 20,
    summary: 'Scheduled check-ins during long projects or research work.',
    description: 'For extended assignments, teachers set pre-announced checkpoints where learners must show progress — a draft, a bibliography, a model. Prevents the end-of-project scramble.',
    steps: [
      'Publish checkpoint dates at the start of the project.',
      'At each checkpoint, learners submit a specific artefact.',
      'Teacher provides targeted written feedback.',
      'Learners revise before moving to the next milestone.',
      'Final checkpoint doubles as the completion signal.'
    ],
    tags: ['project-management', 'formative', 'SHS', 'feedback']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 4 · SCAFFOLDING
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'worked-example',
    title: 'Worked Example',
    principle: 'Scaffolding',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 12,
    summary: 'Walk through a fully solved problem, narrating each decision.',
    description: 'The teacher solves a problem on the board, thinking aloud at each step. Reduces cognitive load and gives learners a mental model before they try solo practice.',
    steps: [
      'Display the problem prominently.',
      'Solve it slowly, narrating your thinking.',
      'Pause to point out common mistakes.',
      'Ask learners to re-explain one step in their own words.',
      'Provide a near-identical problem for paired practice.'
    ],
    tags: ['modeling', 'cognitive-load', 'worked-examples', 'direct-instruction']
  },
  {
    id: 'deliberate-practice',
    title: 'Deliberate Practice',
    principle: 'Scaffolding',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 20,
    summary: 'Focused repetition on one specific sub-skill.',
    description: 'Rather than practising a whole task, learners isolate one sub-skill and repeat it with targeted feedback until they reach fluency. Builds automaticity that frees working memory for higher-order work.',
    steps: [
      'Identify one sub-skill the class struggles with.',
      'Provide 5–10 short, focused practice items.',
      'Circulate and give immediate corrective feedback.',
      'Repeat similar items in the next session.',
      'Celebrate fluency visibly when reached.'
    ],
    tags: ['practice', 'fluency', 'mastery', 'feedback']
  },
  {
    id: 'scaffold-ladder',
    title: 'Scaffold Ladder',
    principle: 'Scaffolding',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 25,
    summary: 'A tiered set of supports a learner climbs — and then discards.',
    description: 'A progressive series of prompts, sentence starters, or worked steps that are gradually removed as the learner gains confidence. The goal is always to fade the scaffold.',
    steps: [
      'Design 3 levels of support for the target task.',
      'Start every learner at the level they need.',
      'Monitor progress and fade the support.',
      'Explicitly celebrate when a learner no longer needs it.',
      'Reflect: "What did you learn to do without help?"'
    ],
    tags: ['scaffolding', 'gradual-release', 'differentiation', 'mastery']
  },
  {
    id: 'rubrics-for-mastery',
    title: 'Rubrics for Mastery',
    principle: 'Scaffolding',
    keyStages: ['KS3'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Give learners the rubric before they start, not after.',
    description: 'When the criteria for success are transparent, learners can self-monitor. A good rubric turns an assessment tool into a teaching tool.',
    steps: [
      'Distribute the rubric at the start of the task.',
      'Read through and clarify each criterion.',
      'Learners self-check their draft against the rubric.',
      'Peer review using the same rubric.',
      'Submit with a self-assessed score and rationale.'
    ],
    tags: ['rubrics', 'self-assessment', 'transparency', 'formative']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 5 · SOCIAL LEARNING
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'team-roles',
    title: 'Team Roles',
    principle: 'Social Learning',
    keyStages: ['KS1'],
    grouping: 'Small Group',
    duration: 20,
    summary: 'Assign each group member a specific job — no passengers.',
    description: 'Every learner in a group has a named role (Leader, Recorder, Presenter, Materials Manager). Rotating roles ensures everyone participates and builds a range of collaborative skills.',
    steps: [
      'Introduce the roles with simple job descriptions.',
      'Assign or let groups choose roles.',
      'Distribute the task.',
      'Circulate and reinforce the roles with specific praise.',
      'Rotate roles for the next activity.'
    ],
    tags: ['collaboration', 'roles', 'accountability', 'KS1']
  },
  {
    id: 'jigsaw',
    title: 'Jigsaw',
    principle: 'Social Learning',
    keyStages: ['KS2', 'KS3'],
    grouping: 'Small Group',
    duration: 40,
    summary: 'Each learner masters one piece and teaches it to the group.',
    description: 'The class is split into home groups. Each member becomes an expert on one section, then returns to teach their home group. Creates interdependence and deepens understanding through teaching.',
    steps: [
      'Divide content into 4–6 expert sections.',
      'Form home groups and assign one section per member.',
      'Experts regroup with peers from other home groups to master their section.',
      'Experts return to their home group and teach their section.',
      'Whole-class synthesis — every learner is quizzed on everything.'
    ],
    tags: ['cooperative-learning', 'peer-teaching', 'interdependence', 'expert-groups']
  },
  {
    id: 'pasa-pasa',
    title: 'Pasa-Pasa',
    principle: 'Social Learning',
    keyStages: ['KS2'],
    grouping: 'Small Group',
    duration: 15,
    summary: 'A Filipino "pass-the-paper" routine for collective writing.',
    description: 'Learners sit in a circle. A paper is passed around with each learner adding one sentence or idea. Produces a collaborative piece while giving every learner a low-stakes contribution.',
    steps: [
      'Each group receives one sheet of paper.',
      'The first learner writes one sentence.',
      'The paper passes clockwise — everyone adds one sentence.',
      'After two rounds, the group reads the full piece aloud.',
      'Groups compare stories or summaries with the class.'
    ],
    tags: ['collaborative-writing', 'Filipino-culture', 'cooperative-learning']
  },
  {
    id: 'prototyping',
    title: 'Prototyping',
    principle: 'Social Learning',
    keyStages: ['KS2'],
    grouping: 'Small Group',
    duration: 35,
    summary: 'Build a rough, testable version — then improve it together.',
    description: 'Groups create a quick, low-fidelity prototype of an idea or product, then give each other feedback. Encourages iteration and normalises failure as part of the design process.',
    steps: [
      'State the design challenge and constraints.',
      'Groups sketch or build a rough prototype in 15 minutes.',
      'Each group presents for 2 minutes.',
      'Peers give "I like / I wonder / What if" feedback.',
      'Groups revise their prototype based on feedback.'
    ],
    tags: ['design-thinking', 'iteration', 'feedback', 'creativity']
  },
  {
    id: 'think-pair-share',
    title: 'Think · Pair · Share',
    principle: 'Social Learning',
    keyStages: ['KS2', 'KS3'],
    grouping: 'Pairs',
    duration: 8,
    summary: 'Think alone, discuss with a partner, then share with the class.',
    description: 'A versatile discussion routine that gives every learner thinking time and a rehearsal partner before public speaking. Boosts participation and quality of answers.',
    steps: [
      'Pose an open-ended question.',
      'Think — 30 seconds of silent thinking time.',
      'Pair — 1 minute of discussion with a partner.',
      'Share — 2–3 pairs share with the whole class.',
      'Synthesise and connect to the lesson goal.'
    ],
    tags: ['discussion', 'participation', 'wait-time', 'pairs']
  },
  {
    id: 'check-in-circles',
    title: 'Check-in Circles',
    principle: 'Social Learning',
    keyStages: ['KS3'],
    grouping: 'Whole Class',
    duration: 12,
    summary: 'Everyone briefly states where they are — no interruptions.',
    description: 'Learners form a circle and take turns answering a simple prompt ("One thing I learned today", "How I am feeling about this project"). Builds emotional safety and community.',
    steps: [
      'Form a circle, or move chairs to face inward.',
      'State the prompt and model a 20-second answer.',
      'Go around the circle — everyone has a turn.',
      'No interrupting, no commenting on others\' responses.',
      'Thank the group and move into the lesson.'
    ],
    tags: ['community', 'wellbeing', 'listening', 'circle']
  },
  {
    id: 'gallery-walk',
    title: 'Gallery Walk',
    principle: 'Social Learning',
    keyStages: ['KS3'],
    grouping: 'Small Group',
    duration: 25,
    summary: 'Walk around, read peers\' work, leave written feedback.',
    description: 'Groups post their work on the walls. Everyone circulates with sticky notes, leaving questions, praise, and suggestions. Gives every group an audience beyond the teacher.',
    steps: [
      'Each group posts their work with a number.',
      'Give each learner 3 sticky notes.',
      'Circulate; leave one comment per work.',
      'Groups return and read their collected feedback.',
      'Discuss the most common comments as a class.'
    ],
    tags: ['peer-feedback', 'gallery', 'critique', 'writing']
  },
  {
    id: 'real-world-team-work',
    title: 'Real-world Team Work',
    principle: 'Social Learning',
    keyStages: ['KS3'],
    grouping: 'Small Group',
    duration: 45,
    summary: 'Groups work on a problem that mirrors an actual workplace.',
    description: 'Frame the task as it would appear in a professional context — a client brief, a research question, a service challenge. Builds relevance and mimics authentic collaboration.',
    steps: [
      'Present the task as a realistic brief with a client.',
      'Assign teams with defined roles.',
      'Provide a timeline with interim deliverables.',
      'Each team presents to the "client" (peers, teacher, or guest).',
      'Debrief on both process and product.'
    ],
    tags: ['authentic', 'relevance', 'team-work', 'project-based']
  },
  {
    id: 'bukas-daloy-sarado',
    title: 'Bukas · Daloy · Sarado',
    principle: 'Social Learning',
    keyStages: ['KS3'],
    grouping: 'Small Group',
    duration: 20,
    summary: 'Open the discussion, let it flow, then close it with a synthesis.',
    description: 'A Filipino classroom ritual for group discussions. A leader "opens" the discussion, members "flow" by contributing in turn, then the leader "closes" with a summary of the group\'s shared understanding.',
    steps: [
      'Assign a leader and a summariser.',
      'Bukas — the leader reads the prompt and gives the frame.',
      'Daloy — each member speaks in turn, one idea each.',
      'Sarado — the summariser captures the shared view.',
      'Groups share their closing statements with the class.'
    ],
    tags: ['discussion', 'Filipino-culture', 'synthesis', 'protocols']
  },
  {
    id: 'structured-feedback',
    title: 'Structured Feedback',
    principle: 'Social Learning',
    keyStages: ['KS4'],
    grouping: 'Pairs',
    duration: 15,
    summary: 'A fixed protocol that makes peer review useful, not polite.',
    description: 'Learners give each other feedback using a rigid structure — two stars and a wish, or the "I noticed / I wonder / Next time" frame. Removes vague praise and forces specificity.',
    steps: [
      'Distribute the feedback frame as a card or slip.',
      'Learners read each other\'s work silently first.',
      'Give feedback only within the frame.',
      'Author asks one clarifying question.',
      'Author thanks and notes the top suggestion.'
    ],
    tags: ['peer-feedback', 'protocols', 'SHS', 'critique']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 6 · INCLUSION
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'multilevel-stations',
    title: 'Multilevel Stations',
    principle: 'Inclusion',
    keyStages: ['KS1'],
    grouping: 'Small Group',
    duration: 30,
    summary: 'Different stations at different difficulty levels — learners choose.',
    description: 'Set up 3–4 stations on the same skill but at different challenge levels. Learners choose where to start, and can move up when ready. Removes the stigma of ability grouping.',
    steps: [
      'Design 3–4 stations at graduated difficulty.',
      'Brief the class on the goal of each station.',
      'Learners self-select a starting station.',
      'Circulate and encourage movement between stations.',
      'Close with a whole-class share of what each station taught.'
    ],
    tags: ['differentiation', 'choice', 'self-pacing', 'inclusion']
  },
  {
    id: 'choice-board',
    title: 'Choice Board',
    principle: 'Inclusion',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 30,
    summary: 'A grid of activities — learners pick their path to the goal.',
    description: 'A 3×3 or 4×4 grid of activities, all leading to the same learning outcome. Offers autonomy, caters to multiple intelligences, and honours different working speeds.',
    steps: [
      'Design 6–9 activities covering different modalities.',
      'Include a "free choice" square if appropriate.',
      'Learners pick 3 in a row (tic-tac-toe) or any 4.',
      'Circulate, offering support where needed.',
      'Close with a gallery share of finished work.'
    ],
    tags: ['choice', 'differentiation', 'multiple-intelligences', 'autonomy']
  },
  {
    id: 'peer-support-loop',
    title: 'Peer Support Loop',
    principle: 'Inclusion',
    keyStages: ['KS3'],
    grouping: 'Pairs',
    duration: 20,
    summary: 'Structured peer tutoring with defined roles and time.',
    description: 'Pair a learner who has mastered a skill with one still working on it. Both roles benefit — the tutor deepens understanding by teaching, the tutee gets personalised help.',
    steps: [
      'Identify a small set of skills for the loop.',
      'Pair learners strategically (not by ability labels).',
      'Explain the tutor and tutee roles.',
      'Run the loop for 8 minutes, then swap.',
      'Both partners write one reflection.'
    ],
    tags: ['peer-tutoring', 'reciprocal-teaching', 'differentiation']
  },
  {
    id: 'inclusive-capstone',
    title: 'Inclusive Capstone',
    principle: 'Inclusion',
    keyStages: ['KS4'],
    grouping: 'Small Group',
    duration: 60,
    summary: 'A final project where every learner contributes in their strength.',
    description: 'The culminating task is designed so that learners can choose their contribution — a written report, an oral presentation, an illustration, a model, a performance. Every learner finds a lane.',
    steps: [
      'Present the capstone goal and outcome criteria.',
      'Publish a menu of contribution formats.',
      'Learners choose their contribution and justify it.',
      'Groups assemble their final product.',
      'Present to an audience beyond the classroom.'
    ],
    tags: ['capstone', 'SHS', 'differentiation', 'universal-design']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 7 · SELF-AWARENESS AND METACOGNITION
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'feelings-check',
    title: 'Feelings Check',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 4,
    summary: 'Point to the face that shows how you feel about today\'s task.',
    description: 'A simple emoji or face-scale check-in at the start or end of a task. Builds emotional vocabulary and gives the teacher an early warning of frustration.',
    steps: [
      'Display 4 faces: worried, unsure, okay, confident.',
      'Ask learners to point to theirs (silently).',
      'Note the distribution at a glance.',
      'Offer a private nudge to the worried ones.',
      'Re-check at the end of the lesson.'
    ],
    tags: ['wellbeing', 'emotion', 'self-awareness', 'KS1']
  },
  {
    id: 'metacognitive-talk',
    title: 'Metacognitive Talk',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 6,
    summary: 'Think aloud so learners hear what thinking sounds like.',
    description: 'The teacher narrates their own thinking while working through a problem: "Hmm, I\'m not sure about this. Let me re-read the question. Oh — I missed the word \'not\'." Makes invisible thinking visible.',
    steps: [
      'Choose a problem you can solve in real time.',
      'Narrate every decision aloud.',
      'Name your strategies explicitly.',
      'Acknowledge mistakes and how you fix them.',
      'Invite learners to narrate their thinking next.'
    ],
    tags: ['metacognition', 'thinking-aloud', 'modeling', 'KS1']
  },
  {
    id: 'learning-log',
    title: 'Learning Log',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 10,
    summary: 'A short weekly reflection: what I learned, how I learned it.',
    description: 'Learners keep a running journal with prompts like "Today I learned…", "I got stuck when…", "Next time I will…". Builds reflective habits that transfer across subjects.',
    steps: [
      'Provide a template with 3–4 prompts.',
      'Set aside 10 minutes at the end of the week.',
      'Learners write in silence.',
      'Collect and respond to one entry per learner.',
      'Return the log and let learners see their growth.'
    ],
    tags: ['reflection', 'journal', 'metacognition', 'habits']
  },
  {
    id: 'mentor-feedback-notes',
    title: 'Mentor Feedback Notes',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 10,
    summary: 'Brief, personalised written feedback in a running notebook.',
    description: 'Each learner has a notebook where the teacher writes a short, specific comment after each major piece of work. Over time, the notebook becomes a dialogue about growth.',
    steps: [
      'Set up a mentor notebook per learner.',
      'After each major task, write two sentences: one strength, one next step.',
      'Learners write a one-line response back.',
      'Refer to previous entries when giving new feedback.',
      'Invite learners to notice their own growth.'
    ],
    tags: ['feedback', 'mentoring', 'personalised', 'dialogue']
  },
  {
    id: 'triangulation',
    title: 'Triangulation',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS3'],
    grouping: 'Individual',
    duration: 12,
    summary: 'Compare three sources of feedback about your own work.',
    description: 'Learners gather feedback from three sources — their own self-assessment, a peer, and the teacher — then look for patterns and disagreements. Builds sophisticated self-awareness.',
    steps: [
      'Learners complete a self-assessment first.',
      'Peer partners assess using the same criteria.',
      'Teacher provides their assessment.',
      'Learners compare all three and note differences.',
      'Reflect in writing: "What surprised me?"'
    ],
    tags: ['self-assessment', 'feedback', 'metacognition', 'analysis']
  },
  {
    id: 'advanced-metacognition',
    title: 'Advanced Metacognition',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS4'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Plan → Monitor → Evaluate, explicitly applied to a complex task.',
    description: 'Learners are taught to plan their approach, monitor their progress mid-task, and evaluate their process after. Turns metacognition from an occasional reflection into a workflow.',
    steps: [
      'Before the task: write a plan and a prediction.',
      'Mid-task: pause and check — "Am I on track?"',
      'After: evaluate what worked and what did not.',
      'Identify one strategy to carry forward.',
      'Use the same frame on the next complex task.'
    ],
    tags: ['metacognition', 'planning', 'self-regulation', 'SHS']
  },
  {
    id: 'post-exam-reflection',
    title: 'Post Exam Reflection',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS4'],
    grouping: 'Individual',
    duration: 20,
    summary: 'After every major exam, learners analyse their own performance.',
    description: 'Instead of just returning the score, teachers guide learners through a structured analysis of where marks were lost, which strategies worked, and what to change for next time.',
    steps: [
      'Return the marked paper and let learners review it.',
      'Learners categorise errors: knowledge, process, or careless.',
      'Identify the two most common error types.',
      'Write a specific action plan for the next exam.',
      'Follow up at the start of the next unit.'
    ],
    tags: ['reflection', 'exam-analysis', 'SHS', 'growth-mindset']
  },

  /* ═══════════════════════════════════════════════════════════════════
     PRINCIPLE 8 · VALUES AND PURPOSE INTEGRATION
     ═══════════════════════════════════════════════════════════════════ */
  {
    id: 'cause-and-effect',
    title: 'Cause and Effect',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'Trace the chain of consequences of a simple action.',
    description: 'A story or scenario where the class traces what happened and why. Builds moral reasoning and gives learners language for discussing consequences.',
    steps: [
      'Read or tell a short story with a clear event.',
      'Ask: "What caused this?" — record answers.',
      'Then: "What happened next because of it?"',
      'Draw the chain on the board.',
      'Ask: "What could have changed the outcome?"'
    ],
    tags: ['values', 'reasoning', 'story', 'KS1']
  },
  {
    id: 'experience-mind-mapping',
    title: 'Experience Mind Mapping',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS1'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Map a personal experience to connect content with real life.',
    description: 'Learners draw a mind map of a personal experience related to the lesson topic — building bridges between school content and lived experience.',
    steps: [
      'Give a simple prompt ("a time you helped someone").',
      'Learners draw their own mind map.',
      'Partner share: talk through your map.',
      'Whole class: what did our maps have in common?',
      'Connect to the lesson\'s value or theme.'
    ],
    tags: ['personal-connection', 'values', 'mind-map', 'KS1']
  },
  {
    id: 'story-feel-act',
    title: 'Story · Feel · Act',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 12,
    summary: 'Read a story, name the feelings, choose the action.',
    description: 'A structured reading routine where learners identify what the character felt and then decide what they would do in the same situation. Builds empathy and ethical reasoning.',
    steps: [
      'Read a short story with a moral dilemma.',
      'Ask: "What did the character do?"',
      'Ask: "How did they feel?" — build a feelings chart.',
      'Ask: "What would YOU do?" — turn and talk.',
      'Act out a chosen response together.'
    ],
    tags: ['empathy', 'values', 'story', 'drama']
  },
  {
    id: 'values-in-action',
    title: 'Values in Action',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS1'],
    grouping: 'Whole Class',
    duration: 20,
    summary: 'Turn a value into a small, concrete classroom action.',
    description: 'Instead of just discussing a value like "kindness", learners choose one specific action to perform during the day and reflect on it at the end.',
    steps: [
      'Name the value for the week.',
      'Brainstorm concrete actions that show it.',
      'Each learner chooses one to try.',
      'Do the action throughout the day.',
      'Close with a sharing circle about what happened.'
    ],
    tags: ['values', 'action', 'character-education', 'KS1']
  },
  {
    id: 'empathy-map',
    title: 'Empathy Map',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS2'],
    grouping: 'Small Group',
    duration: 20,
    summary: 'What does this person say, think, do, and feel?',
    description: 'Groups build a 4-quadrant map (Says / Thinks / Does / Feels) about a person or character they are studying. Builds perspective-taking and emotional vocabulary.',
    steps: [
      'Introduce the four quadrants and their meaning.',
      'Groups fill in the map for the target person.',
      'Groups present their map to the class.',
      'Compare maps: what surprised us?',
      'Reflect: how does this change how we see them?'
    ],
    tags: ['empathy', 'perspective-taking', 'values', 'character-study']
  },
  {
    id: 'perspective-postcards',
    title: 'Perspective Postcards',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS2'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Write a postcard from a character or historical figure\'s point of view.',
    description: 'Learners write a short postcard in the voice of someone whose perspective they are studying — a historical figure, a fictional character, an animal, an object. Builds empathy through writing.',
    steps: [
      'Assign or choose a perspective.',
      'Provide a postcard template with the basic frame.',
      'Learners write 3–5 sentences in that voice.',
      'Exchange and read aloud in pairs.',
      'Discuss: what did writing as them teach you?'
    ],
    tags: ['empathy', 'writing', 'perspective', 'historical-thinking']
  },
  {
    id: 'why-it-matters-wall',
    title: 'Why it Matters Wall',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS2'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'A running wall of sticky notes answering "Why does this matter?"',
    description: 'A permanent classroom display where learners add sticky notes about why the current unit matters — to them, to their community, to the world. Builds purpose and relevance.',
    steps: [
      'Introduce the wall at the start of a unit.',
      'Model one sticky note with your own reason.',
      'Invite learners to add notes any time.',
      'Read a few aloud each week.',
      'Close the unit by reading the wall together.'
    ],
    tags: ['purpose', 'relevance', 'display', 'community']
  },
  {
    id: 'beyond-self-reflection',
    title: 'Beyond Self Reflection',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS3'],
    grouping: 'Individual',
    duration: 15,
    summary: 'Ask not only "how did I do?" but "who did I impact?"',
    description: 'A reflective prompt that moves beyond self-improvement to ethical and community impact. Learners consider how their choices affect others in their class, family, and community.',
    steps: [
      'Pose the prompt: "Who did my work this week help?"',
      'Give 2 minutes of silent writing.',
      'Share in triads.',
      'Identify one action that could increase your positive impact.',
      'Commit to it in writing.'
    ],
    tags: ['values', 'reflection', 'community', 'ethics']
  },
  {
    id: 'empathy-interview',
    title: 'Empathy Interview',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS4'],
    grouping: 'Pairs',
    duration: 30,
    summary: 'Interview someone about a real problem they have faced.',
    description: 'Learners interview a person with lived experience of the issue they are studying — a community member, a family member, a peer. Real voices beat textbook examples every time.',
    steps: [
      'Prepare 5–7 open-ended interview questions.',
      'Practise active listening and follow-up probes.',
      'Conduct the interview (in person or by phone).',
      'Write a reflection on what you learned.',
      'Present findings to the class.'
    ],
    tags: ['empathy', 'interviews', 'field-work', 'SHS', 'authentic']
  },
  {
    id: 'purpose-pitch',
    title: 'Purpose Pitch',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS4'],
    grouping: 'Individual',
    duration: 20,
    summary: 'A 2-minute pitch: what I did, why it matters, what\'s next.',
    description: 'Learners pitch a project, idea, or piece of work by explaining its purpose — not just what it is, but why it should exist and who it serves. Builds conviction and advocacy.',
    steps: [
      'Introduce the structure: What · Why · Next.',
      'Learners draft a 2-minute pitch.',
      'Rehearse with a partner for timing.',
      'Deliver to the class or a small panel.',
      'Peers give one "I would support this because…" note.'
    ],
    tags: ['public-speaking', 'purpose', 'SHS', 'advocacy']
  },
  {
    id: 'four-corners',
    title: 'Four Corners',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS2', 'KS3', 'KS4'],
    grouping: 'Whole Class',
    duration: 15,
    summary: 'Learners physically move to the corner matching their opinion.',
    description: 'The teacher poses a debatable statement. Four corners of the room are labelled (Strongly Agree, Agree, Disagree, Strongly Disagree). Learners walk to their corner, then defend their position to peers with a similar view before the class debates.',
    steps: [
      'Pose a clear, debatable statement.',
      'Label each corner of the room with a position.',
      'Learners walk to their corner silently.',
      'Each corner discusses why they chose it (2 minutes).',
      'One speaker per corner presents their strongest reason.'
    ],
    tags: ['debate', 'movement', 'opinion', 'discussion']
  },
  {
    id: 'think-aloud-pair-problem-solve',
    title: 'Think Aloud Pair Problem Solving',
    principle: 'Clear Goals and Teaching',
    keyStages: ['KS2', 'KS3'],
    grouping: 'Pairs',
    duration: 15,
    summary: 'One solves aloud; the other listens and prompts.',
    description: 'Learners work in pairs on a problem. Partner A verbalises every thought while Partner B listens, asks clarifying questions, and catches errors. Then they swap roles on the next problem. Makes thinking visible and catches misconceptions early.',
    steps: [
      'Assign Partner A (solver) and Partner B (listener).',
      'Partner A solves aloud, narrating every step.',
      'Partner B prompts: "Why did you do that?" and listens for errors.',
      'Swap roles and repeat with a new problem.',
      'Both write a one-line reflection on what they learned.'
    ],
    tags: ['metacognition', 'problem-solving', 'pairs', 'thinking-aloud']
  },

  /* ---- Active Retrieval and Spacing ---- */
  {
    id: 'brain-dump',
    title: 'Brain Dump',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS2', 'KS3', 'KS4'],
    grouping: 'Individual',
    duration: 5,
    summary: 'Write everything you remember about a topic in two minutes.',
    description: 'A timed free-recall exercise. Learners write down every fact, term, or idea they can remember about a topic with no prompts or notes. The gap between what they recall and what they missed is the learning target.',
    steps: [
      'Name the topic and start a 2-minute timer.',
      'Learners write down everything they remember.',
      'Compare with a partner — add what you missed in a different colour.',
      'Teacher reveals a master list on the board.',
      'Learners circle one item to review before next class.'
    ],
    tags: ['retrieval', 'free-recall', 'spacing', 'quick-check']
  },
  {
    id: 'two-minute-recall',
    title: 'Two-Minute Recall',
    principle: 'Active Retrieval and Spacing',
    keyStages: ['KS1', 'KS2'],
    grouping: 'Whole Class',
    duration: 5,
    summary: 'Rapid choral recall of last week\'s key facts.',
    description: 'A fast, whole-class warm-up where the teacher fires rapid-fire questions from memory and the class answers in unison. Builds automaticity and gets every learner engaged from the first minute.',
    steps: [
      'Stand at the front with a list of 10–12 quick questions.',
      'Fire questions one by one; class answers in chorus.',
      'Speed up as the class warms up.',
      'Pause on any question with a weak answer and re-explain.',
      'End with a "challenge question" from a prior unit.'
    ],
    tags: ['retrieval', 'warm-up', 'choral-response', 'KS1']
  },

  /* ---- Checks for Understanding ---- */
  {
    id: 'hinge-question',
    title: 'Hinge Question',
    principle: 'Checks for Understanding',
    keyStages: ['KS2', 'KS3', 'KS4'],
    grouping: 'Individual',
    duration: 4,
    summary: 'One diagnostic question mid-lesson that decides the next move.',
    description: 'A carefully designed question placed at a hinge point in the lesson. Every learner answers simultaneously. The teacher scans the responses and decides whether to move on, re-teach, or differentiate.',
    steps: [
      'Design one question that all learners must answer.',
      'Pose it at the hinge point in the lesson.',
      'All learners answer simultaneously (mini-whiteboards or digital poll).',
      'Scan for the distribution of correct vs incorrect answers.',
      'If >80% correct, move on. If not, re-teach before continuing.'
    ],
    tags: ['formative', 'diagnostic', 'decision-point', 'whole-class']
  },
  {
    id: 'one-sentence-summary',
    title: 'One-Sentence Summary',
    principle: 'Checks for Understanding',
    keyStages: ['KS3', 'KS4'],
    grouping: 'Individual',
    duration: 5,
    summary: 'Summarise today\'s lesson in exactly one sentence.',
    description: 'Learners condense the entire lesson into a single, well-crafted sentence. The constraint forces them to identify the most essential idea — and reveals whether they understand the big picture.',
    steps: [
      'Pose the prompt: "In one sentence, what did you learn today?"',
      'Give 2 minutes of silent writing.',
      'Read a few aloud — no commentary, just listen.',
      'Ask: "Whose sentence captured the main idea best?"',
      'Collect the sentences as a quick formative check.'
    ],
    tags: ['synthesis', 'writing', 'formative', 'summarising']
  },

  /* ---- Scaffolding ---- */
  {
    id: 'peel-paragraph',
    title: 'PEEL Paragraph',
    principle: 'Scaffolding',
    keyStages: ['KS3', 'KS4'],
    grouping: 'Individual',
    duration: 25,
    summary: 'A four-sentence structure for building a paragraph of argument.',
    description: 'Point · Evidence · Explanation · Link. A scaffolded writing frame that turns a jumbled paragraph into a clear, evidence-based argument. Works across every subject that requires structured writing.',
    steps: [
      'Introduce the PEEL frame with a worked example.',
      'Model writing a PEEL paragraph on a familiar topic.',
      'Learners write their own on the current topic.',
      'Peer review: does each sentence do its job?',
      'Revise and submit one polished paragraph.'
    ],
    tags: ['writing', 'argumentation', 'structure', 'evidence']
  },
  {
    id: 'i-do-we-do-you-do',
    title: 'I Do · We Do · You Do',
    principle: 'Scaffolding',
    keyStages: ['KS1', 'KS2', 'KS3'],
    grouping: 'Whole Class',
    duration: 20,
    summary: 'Three-stage release: teacher shows, class tries, learner flies solo.',
    description: 'A gradual-release framework for teaching any new skill. The teacher models first (I Do), the class works through an example together (We Do), and finally learners practise independently (You Do).',
    steps: [
      'I Do — model the skill with a think-aloud.',
      'We Do — solve a similar problem together on the board.',
      'Check — ask one learner to explain a step in their own words.',
      'You Do — learners practise independently while teacher circulates.',
      'Close — review one common error and celebrate success.'
    ],
    tags: ['gradual-release', 'modeling', 'direct-instruction', 'scaffolding']
  },

  /* ---- Social Learning ---- */
  {
    id: 'numbered-heads-together',
    title: 'Numbered Heads Together',
    principle: 'Social Learning',
    keyStages: ['KS2', 'KS3'],
    grouping: 'Small Group',
    duration: 15,
    summary: 'Number off, discuss, then one number is called to answer.',
    description: 'Learners in groups of four number off. After discussion, the teacher calls a number. Only that learner answers for the whole group — no one knows who will be called, so everyone must be ready.',
    steps: [
      'Form groups of four; each learner takes a number 1–4.',
      'Pose the question and give 3 minutes to discuss.',
      'All group members must agree on the answer.',
      'Call a random number — that learner answers for the group.',
      'Score the group, not the individual.'
    ],
    tags: ['accountability', 'cooperative-learning', 'discussion', 'whole-class']
  },
  {
    id: 'circle-of-viewpoints',
    title: 'Circle of Viewpoints',
    principle: 'Social Learning',
    keyStages: ['KS3', 'KS4'],
    grouping: 'Whole Class',
    duration: 20,
    summary: 'Explore an issue from multiple stakeholder perspectives.',
    description: 'After reading a text or studying an event, learners adopt different stakeholder viewpoints and discuss the issue from their assigned perspective. Builds empathy, critical thinking, and civil discourse.',
    steps: [
      'Identify 4–6 different stakeholder viewpoints.',
      'Assign each group one viewpoint.',
      'Groups prepare arguments from that perspective.',
      'Form a circle: each group presents their view.',
      'Discuss: what did each viewpoint miss?'
    ],
    tags: ['perspective-taking', 'discussion', 'empathy', 'critical-thinking']
  },

  /* ---- Inclusion ---- */
  {
    id: 'universal-design-for-learning',
    title: 'Universal Design for Learning',
    principle: 'Inclusion',
    keyStages: ['KS1', 'KS2', 'KS3', 'KS4'],
    grouping: 'Individual',
    duration: 30,
    summary: 'Offer multiple ways to take in, work with, and show learning.',
    description: 'Provide the same content in three formats (text, audio, visual), allow multiple response modes (write, draw, record), and build in choice of tasks. Removes barriers before they appear.',
    steps: [
      'Present the core content in at least two formats.',
      'Offer at least three ways to respond.',
      'Provide choice in how learners demonstrate mastery.',
      'Build in flexible pacing options.',
      'Survey learners on which pathway worked best.'
    ],
    tags: ['UDL', 'accessibility', 'differentiation', 'choice']
  },
  {
    id: 'visual-supports',
    title: 'Visual Supports',
    principle: 'Inclusion',
    keyStages: ['KS1', 'KS2'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'Anchor every spoken instruction with a visual.',
    description: 'Pair every verbal instruction with a picture, icon, or written cue. Simple but powerful for learners with language processing difficulties, hearing loss, or attention challenges.',
    steps: [
      'Prepare visual cards for the day\'s key instructions.',
      'Display each card while giving the verbal instruction.',
      'Leave the cards visible for reference.',
      'Ask a learner to re-explain using the visual.',
      'Store the visuals for future reuse.'
    ],
    tags: ['visuals', 'accessibility', 'KS1', 'language-support']
  },

  /* ---- Self-awareness and Metacognition ---- */
  {
    id: 'traffic-lights',
    title: 'Traffic Lights',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS1', 'KS2'],
    grouping: 'Whole Class',
    duration: 5,
    summary: 'Green, yellow, red — a silent signal of confidence.',
    description: 'Learners show a green, yellow, or red card to indicate their confidence with the current task. Green means "I can do this alone." Yellow means "I need a little help." Red means "I need you now."',
    steps: [
      'Give every learner three coloured cards.',
      'Explain what each colour means.',
      'Learners show a card at the start of independent work.',
      'Teacher prioritises red and yellow learners.',
      'Re-check at the end of the lesson.'
    ],
    tags: ['confidence-check', 'self-assessment', 'silent-signal', 'KS1']
  },
  {
    id: 'wonder-wall',
    title: 'Wonder Wall',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS2', 'KS3'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'A visible wall of learner questions — asked and answered.',
    description: 'A permanent classroom display where learners post questions they want answered about the current unit. Questions are grouped by theme, and answers are added as the unit progresses. Builds curiosity and ownership.',
    steps: [
      'Introduce the Wonder Wall at the start of a unit.',
      'Learners write questions on sticky notes and post them.',
      'Group similar questions into themes.',
      'Return to the wall weekly — which questions can we answer now?',
      'Celebrate the questions that drove the deepest learning.'
    ],
    tags: ['curiosity', 'student-questions', 'display', 'inquiry']
  },
  {
    id: 'reflection-journal',
    title: 'Reflection Journal',
    principle: 'Self-awareness and Metacognition',
    keyStages: ['KS3', 'KS4'],
    grouping: 'Individual',
    duration: 15,
    summary: 'A structured, recurring journal entry after every major task.',
    description: 'Learners keep a running journal with a fixed set of prompts (What did I do well? What was hard? What will I do differently next time?). Over time, the journal becomes a visible record of growth.',
    steps: [
      'Distribute or co-create the journal prompts.',
      'Set aside 10–15 minutes after each major task.',
      'Learners write in silence — no prompts during writing.',
      'Teacher reads entries and responds with a short comment.',
      'At the end of the term, learners read their first entry vs their latest.'
    ],
    tags: ['journal', 'reflection', 'growth-mindset', 'writing']
  },

  /* ---- Values and Purpose Integration ---- */
  {
    id: 'values-auction',
    title: 'Values Auction',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS3', 'KS4'],
    grouping: 'Small Group',
    duration: 20,
    summary: 'Bid on the values you care about most — then explain why.',
    description: 'Groups receive a budget of "value points" and must bid on a list of values (honesty, loyalty, justice, courage, etc.). The debrief explores what the winners truly value and why.',
    steps: [
      'Distribute a list of 10–15 values.',
      'Give each group a budget of 100 points.',
      'Groups bid on the values they want to "win".',
      'Reveal which values each group won.',
      'Discuss: what does this tell us about our priorities?'
    ],
    tags: ['values', 'decision-making', 'discussion', 'ethics']
  },
  {
    id: 'real-world-connection',
    title: 'Real-World Connection',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS2', 'KS3', 'KS4'],
    grouping: 'Whole Class',
    duration: 10,
    summary: 'Link today\'s lesson to a current event or community issue.',
    description: 'A short closing routine where the teacher connects the lesson content to something happening in the world — a news story, a local issue, a community event. Answers the question: "Why does this matter?"',
    steps: [
      'Prepare one relevant real-world connection per lesson.',
      'Share it in the last 5 minutes of class.',
      'Ask: "How does today\'s lesson help us understand this?"',
      'Take 2–3 responses.',
      'End with: "Who in our community would care about this?"'
    ],
    tags: ['relevance', 'current-events', 'purpose', 'community']
  },
  {
    id: 'legacy-project',
    title: 'Legacy Project',
    principle: 'Values and Purpose Integration',
    keyStages: ['KS4'],
    grouping: 'Small Group',
    duration: 60,
    summary: 'A culminating project that leaves the community better.',
    description: 'Groups design and execute a small project that benefits the school or community — a cleanup drive, a tutorial program, a mural, a donation drive. The learning is measured by the impact, not just the process.',
    steps: [
      'Identify a real need in the school or community.',
      'Design a realistic, achievable project.',
      'Execute it — even if small.',
      'Document the impact (photos, testimonials, numbers).',
      'Present the outcomes to the class and the beneficiaries.'
    ],
    tags: ['service-learning', 'community', 'project-based', 'SHS']
  },
];

/* Convenience lookups */
export const PEDAGOGY_CARD_BY_ID = Object.fromEntries(
  PEDAGOGY_CARDS.map(c => [c.id, c])
);

export const PEDAGOGY_COUNT_BY_PRINCIPLE: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  PEDAGOGY_CARDS.forEach(c => {
    counts[c.principle] = (counts[c.principle] || 0) + 1;
  });
  return counts;
})();