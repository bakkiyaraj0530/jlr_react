const CRinfo = {
  'CRqeustion': [
    {
      'Qid': 'CR1',
      'qeution': 'Supplier does not employ any form of forced or prison labour',
      'answer': ' ',
      'comments': ' '
    },
    {
      'Qid': 'CR2',
      'qeution': 'All workers have been verified to be at least 16 years of age',
      'answer': ' ',
      'comments': ' '
    },
    {
      'Qid': 'CR3',
      'qeution': 'Supplier has a policy regarding discrimination and discipline',
      'answer': ' ',
      'comments': ' '
    },
    {
      'Qid': 'CR4',
      'qeution': 'Supplier provides employees wages, benefits, and overtime compensation in accordance with local law',
      'answer': ' ',
      'comments': ' '
    },
    {
      'Qid': 'CR5',
      'qeution': 'Supplier enforces local law regarding work hours and overtime',
      'answer': ' ',
      'comments': ' '
    },
    {
      'Qid': 'CR6',
      'qeution': 'Supplier has a clearly defined Health & Safety Policy - Note JLR will end the Assessment where any Health & Safety requirements are not met during site visit',
      'answer': ' ',
      'comments': ' '
    }
  ]
};
export default function CRinfoReducer(state = CRinfo, action) {
  switch (action.type) {
    default: return state;
  }
}
