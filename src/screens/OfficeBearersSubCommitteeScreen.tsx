import React from 'react';
import { MemberDirectory } from '../components/MemberDirectory';
import { GOVERNING_COUNCIL } from '../constants/governingCouncil';

// Membership verified against the official Office Bearers Sub-Committee page.
const SUB_COMMITTEE = GOVERNING_COUNCIL.filter(member =>
  ['1', '2', '3', '4', '5', '10'].includes(member.id),
);

export const OfficeBearersSubCommitteeScreen: React.FC = () => (
  <MemberDirectory
    title="Office Bearers Sub-Committee"
    introduction="Meet the Sub-Committee"
    data={SUB_COMMITTEE}
  />
);
