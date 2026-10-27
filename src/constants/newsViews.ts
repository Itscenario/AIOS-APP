export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
}

// Content from the supplied design references. Article URLs will come from the backend.
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'diabetic-donor-cornea',
    category: 'Cornea',
    title: 'A diabetic donor’s cornea is as good as any other a year after transplant',
    description: 'A pre-specified secondary analysis of the Diabetes Endothelial Keratoplasty Study graded how diabetic each donor was in three different ways and tested every grade against one-year outcomes in 1,421 eyes. None of them predicted anything.',
  },
  {
    id: 'trifocal-iols',
    category: 'Cataract',
    title: 'Trifocal IOLs outperformed monofocals in the peripheral visual field',
    description: 'A prospective, non-randomised, same-platform comparison published in the Journal of Cataract & Refractive Surgery measured peripheral static perimetry after implantation of monofocal, bifocal and trifocal IOLs in 102 patients (123 eyes).',
  },
  {
    id: 'optic-nerve-pressure',
    category: 'Glaucoma',
    title: 'The pressure you write in the notes is not the pressure the optic nerve has been living with',
    description: 'A study in Ophthalmology takes a question every glaucoma clinic lives with and puts numbers on it: does a single intraocular pressure, taken in the office at whatever hour the patient was given, represent the pressure the optic nerve is actually exposed to? The authors followed 94 treated patients – 150 eyes with open-angle glaucoma and derived metrics of pressure exposure, from in-office tonometry and from remote self-tonometry, rather than from single readings. The rest of this piece is in the PDF edition of this issue.',
  },
  {
    id: 'eye247-oct11',
    category: 'News & Views',
    title: 'AIOS Eye 24/7, Oct 11 Issue, Ophthalmology News + Views of the Week',
    description: 'This issue discusses ethical advertising and public communication, including the guidelines notified by the National Medical Commission on 6 October.',
  },
  {
    id: 'rp-therapy',
    category: 'Retina',
    title: 'A therapy for RP that does not need to know the gene',
    description: 'The US regulator has accepted a filing for the first optogenetic treatment for retinitis pigmentosa — an approach indifferent to which mutation caused the disease, and given in the clinic rather than in theatre.',
  },
  {
    id: 'fusarium-ulcers',
    category: 'Cornea',
    title: 'The first-line drug is failing in two of every five Fusarium ulcers',
    description: 'A prospective series of 153 culture-positive fungal ulcers at Aravind Eye Hospital, Madurai, measured minimum inhibitory concentrations against four antifungals. No isolate was susceptible to all four, and resistance to the first-line drug tracked with a worse clinical outcome.',
  },
];
