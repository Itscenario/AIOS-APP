import React from 'react';
import { MemberDirectory } from '../components/MemberDirectory';
import { GOVERNING_COUNCIL } from '../constants/governingCouncil';

export const GoverningCouncilScreen: React.FC = () => (
  <MemberDirectory title="Governing Council" introduction="Meet the Council" data={GOVERNING_COUNCIL} />
);
