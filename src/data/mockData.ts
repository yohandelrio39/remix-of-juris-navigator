import { JurisprudenceResult, ClarificationQuestion } from '@/types';

// Mock jurisprudence results for demonstration
export const mockResults: JurisprudenceResult[] = [
  {
    id: '1',
    title: 'ATF 147 IV 73 - Vol avec effraction, circonstances atténuantes',
    jurisdiction: 'Tribunal fédéral',
    date: '15.03.2023',
    relevanceScore: 94,
    summary: 'Le Tribunal fédéral a confirmé que les circonstances atténuantes peuvent être retenues lorsque l\'auteur démontre des regrets sincères et une situation personnelle difficile. Dans ce cas, la peine a été réduite de 30% en tenant compte de la collaboration de l\'accusé.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/clir/http/index.php?highlight_docid=atf%3A%2F%2F147-IV-73%3Afr'
  },
  {
    id: '2',
    title: 'ATF 145 IV 154 - Qualification du vol avec effraction',
    jurisdiction: 'Tribunal fédéral',
    date: '22.11.2022',
    relevanceScore: 89,
    summary: 'Arrêt de principe concernant la qualification du vol avec effraction selon l\'art. 139 ch. 2 CP. Le tribunal précise les critères de distinction entre vol simple et vol aggravé.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/clir/http/index.php?highlight_docid=atf%3A%2F%2F145-IV-154%3Afr'
  },
  {
    id: '3',
    title: '6B_234/2023 - Fixation de la peine, récidive',
    jurisdiction: 'Tribunal fédéral',
    date: '08.06.2023',
    relevanceScore: 85,
    summary: 'Examen des critères de fixation de la peine en cas de récidive. Le tribunal rappelle que la récidive ne constitue pas automatiquement une circonstance aggravante.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/aza/http/index.php?highlight_docid=aza%3A%2F%2Faza://08-06-2023-6B_234-2023'
  },
  {
    id: '4',
    title: 'ACPR/2023/156 - Détention provisoire, proportionnalité',
    jurisdiction: 'Cour de justice Genève',
    date: '12.04.2023',
    relevanceScore: 78,
    summary: 'La Cour de justice examine les conditions de la détention provisoire et rappelle le principe de proportionnalité. Mise en liberté ordonnée avec mesures de substitution.',
    sourceUrl: 'https://justice.ge.ch/fr/jurisprudence'
  },
  {
    id: '5',
    title: 'ATF 144 IV 313 - Sursis, pronostic favorable',
    jurisdiction: 'Tribunal fédéral',
    date: '05.09.2022',
    relevanceScore: 76,
    summary: 'Critères d\'octroi du sursis. Le tribunal précise les éléments à prendre en compte pour établir un pronostic favorable concernant le comportement futur de l\'accusé.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/clir/http/index.php?highlight_docid=atf%3A%2F%2F144-IV-313%3Afr'
  },
  {
    id: '6',
    title: '6B_567/2023 - Travail d\'intérêt général',
    jurisdiction: 'Tribunal fédéral',
    date: '18.08.2023',
    relevanceScore: 72,
    summary: 'Conditions d\'application de la peine de travail d\'intérêt général comme alternative à la peine privative de liberté.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/aza/http/index.php'
  },
  {
    id: '7',
    title: 'JTCO/2023/89 - Vol en bande organisée',
    jurisdiction: 'Tribunal correctionnel Genève',
    date: '03.05.2023',
    relevanceScore: 68,
    summary: 'Jugement concernant un vol en bande organisée. Application de l\'art. 139 ch. 3 CP et examen de la notion de bande.',
    sourceUrl: 'https://justice.ge.ch/fr/jurisprudence'
  },
  {
    id: '8',
    title: 'ATF 146 IV 88 - Dommages-intérêts partie civile',
    jurisdiction: 'Tribunal fédéral',
    date: '28.02.2022',
    relevanceScore: 65,
    summary: 'Fixation des dommages-intérêts en faveur de la partie civile dans le cadre d\'une procédure pénale pour vol.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/clir/http/index.php?highlight_docid=atf%3A%2F%2F146-IV-88%3Afr'
  },
  {
    id: '9',
    title: '6B_890/2022 - Prescription de l\'action pénale',
    jurisdiction: 'Tribunal fédéral',
    date: '14.12.2022',
    relevanceScore: 61,
    summary: 'Examen de la prescription de l\'action pénale pour les infractions contre le patrimoine.',
    sourceUrl: 'https://www.bger.ch/ext/eurospider/live/fr/php/aza/http/index.php'
  },
  {
    id: '10',
    title: 'ACPR/2022/445 - Classement, principe in dubio pro duriore',
    jurisdiction: 'Cour de justice Genève',
    date: '20.10.2022',
    relevanceScore: 58,
    summary: 'Application du principe in dubio pro duriore dans le cadre d\'un recours contre un classement. La cour rappelle que le classement n\'est possible que si l\'acquittement est certain.',
    sourceUrl: 'https://justice.ge.ch/fr/jurisprudence'
  }
];

// Mock clarification questions
export const mockClarificationQuestions: ClarificationQuestion[] = [
  {
    id: 'q1',
    question: 'Quel est le stade de la procédure ?',
    type: 'select',
    options: ['Instruction', 'Première instance', 'Appel', 'Tribunal fédéral']
  },
  {
    id: 'q2',
    question: 'Quelle est la juridiction concernée ?',
    type: 'select',
    options: ['Canton de Genève', 'Canton de Vaud', 'Tribunal fédéral', 'Autre']
  },
  {
    id: 'q3',
    question: 'Y a-t-il des antécédents judiciaires ?',
    type: 'select',
    options: ['Oui, condamnations antérieures', 'Non, casier vierge', 'Non précisé']
  }
];
