import React from 'react';
import { MemberDirectory } from '../components/MemberDirectory';
import { OFFICE_BEARERS } from '../constants/officeBearers';

export const OfficeBearersScreen: React.FC = () => (
  <MemberDirectory
    title="Office Bearers"
    introduction="Office Bearers of the AIOS"
    data={OFFICE_BEARERS}
  />
);
