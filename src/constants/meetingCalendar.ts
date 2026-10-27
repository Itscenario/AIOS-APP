export interface MeetingEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  category: 'Conference' | 'PrayogShala';
  detailsUrl?: string;
}

// Reference content supplied for the calendar; detailsUrl will come from the backend.
export const MEETING_EVENTS: MeetingEvent[] = [
  { id: 'nzos-2026', title: 'NZOS 2026', startDate: '2026-10-30', endDate: '2026-11-01', location: 'Palampur', category: 'Conference' },
  { id: 'upcon-2026', title: 'UPCON 2026', startDate: '2026-10-30', endDate: '2026-11-02', location: 'AMU, Aligarh', category: 'Conference' },
  { id: 'prayogshala-nzos', title: 'AIOS PrayogShala Connect – NZOS, Palampur', startDate: '2026-10-31', endDate: '2026-10-31', location: 'In collaboration with North Zone Ophthalmological Society, Palampur', category: 'PrayogShala' },
  { id: 'odisha-2026', title: 'Odisha State Ophthalmological Society Conference', startDate: '2026-11-13', endDate: '2026-11-15', location: 'Odisha', category: 'Conference' },
  { id: 'prayogshala-delhi', title: 'AIOS PrayogShala', startDate: '2026-11-22', endDate: '2026-11-22', location: 'AIOS HQ, New Delhi', category: 'PrayogShala' },
  { id: 'ksos-2026', title: 'Annual Conference of Kerala Society of Ophthalmic Surgeons (KSOS)', startDate: '2026-11-27', endDate: '2026-11-29', location: 'Kannur, Kerala', category: 'Conference' },
  { id: 'koscon-2026', title: 'KOSCON 2026', startDate: '2026-11-27', endDate: '2026-11-29', location: 'Mysuru', category: 'Conference' },
  { id: 'prayogshala-hyderabad', title: 'AIOS-TOS PrayogShala Connect – Sankara Eye Hospital, Hyderabad', startDate: '2026-11-29', endDate: '2026-11-29', location: 'In collaboration with Sankara Eye Hospital, Hyderabad', category: 'PrayogShala' },
  { id: 'vrsi-2026', title: 'VRSI 2026', startDate: '2026-12-04', endDate: '2026-12-06', location: 'Chandigarh', category: 'Conference' },
];
