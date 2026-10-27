export interface AIOSUpdate {
  id: string;
  title: string;
  category: string;
  description: string;
  action: string;
  url?: string;
}
export const AIOS_UPDATES: AIOSUpdate[] = [
  { id: 'election', title: 'VP Election 2027', category: 'Elections', description: 'Notification', action: 'View Details' },
  { id: 'trade', title: 'AIOC 2027, Trade Booking Open', category: 'Conference', description: 'Trade booking guidelines', action: 'View Details' },
  { id: 'reform', title: 'AIOS Reform', category: 'Society', description: 'For more details', action: 'View Details' },
  { id: 'prayogshala', title: 'Apply for AIOS Prayogshala Connect', category: 'Education', description: 'AIOS Prayogshala Connect', action: 'View Details' },
  { id: 'jobs', title: 'Jobs in Ophthalmology', category: 'Careers', description: 'Opportunities in ophthalmology', action: 'View Details' },
  { id: 'pcpndt', title: 'Update on PCPNDT & TPA', category: 'Updates', description: 'PCPNDT & TPA', action: 'View Details' },
  { id: 'profile', title: 'How to update your profile?', category: 'Member support', description: 'Stay Updated', action: 'View Details' },
];
