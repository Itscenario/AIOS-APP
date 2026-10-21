import { GOVERNING_COUNCIL } from './governingCouncil';

// Source: https://aios.org/article-42-office-bearers.php
export const OFFICE_BEARERS = [
  ...GOVERNING_COUNCIL.slice(0, 5),
  {
    id: 'joint-secretary',
    name: 'Dr. Mohita Sharma',
    role: 'Joint Secretary',
    address: 'Tirupati Eye Centre, C-53c, Sector-33, Noida, Uttar Pradesh 201301',
    email: 'jtsecretary@aios.org',
    photo: require('../assets/images/council/joint-secretary.jpg'),
  },
  {
    id: 'joint-treasurer',
    name: 'Dr. Elankumaran Pasupathi',
    role: 'Joint Treasurer',
    address: 'Navashakthi Nethralaya, 1803, 14th Main, Outer Ring Road, Hbr Lay Out 5th Block, Bangalore, Karnataka 560043',
    email: 'jttreasurer@aios.org',
    photo: require('../assets/images/council/joint-treasurer.jpg'),
  },
  ...GOVERNING_COUNCIL.slice(5),
];
