import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DocumentIcon } from './Icons';
import { useAppSelector } from '../store';

type Conference = {
  id: string;
  title: string;
  location: string;
  year: string;
  dates: string;
  theme: string;
};
type Participant = {
  name: string;
  registrationNo: string;
  memberType: 'Faculty' | 'Delegate';
};
export const CertificateArchive: React.FC<{
  modern?: boolean;
  conferences: Conference[];
  onOpen: (conference: Conference, person: Participant) => void;
}> = ({ conferences, onOpen, modern = false }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const profile = useAppSelector(state => state.auth.profile);
  if (modern) return (
    <View style={styles.modernContainer}>
      <View style={styles.modernTitleRow}><View style={styles.modernEmblem}><DocumentIcon size={24} color="#6251B7" /></View><View style={styles.modernTitleCopy}><Text style={styles.modernTitle}>Certificate archive</Text><Text style={styles.modernHint}>Your participation, recognised.</Text></View></View>
      {conferences.map(conference => {
        const open = expanded === conference.id;
        const rows = (profile?.archiveCertificates || []).filter(item => item.conferenceId === conference.id);
        return <View key={conference.id} style={[styles.modernCard, open && styles.modernCardOpen]}>
          <TouchableOpacity style={styles.modernHeading} onPress={() => setExpanded(open ? null : conference.id)} accessibilityRole="button" accessibilityState={{ expanded: open }}>
            <View style={styles.modernYear}><Text style={styles.modernYearText}>{conference.year}</Text><Text style={styles.modernYearCaption}>ARCHIVE</Text></View>
            <View style={styles.modernTitleCopy}><Text style={styles.modernConference}>{conference.title}</Text><Text style={styles.modernLocation}>{conference.location}</Text></View>
            <Text style={styles.modernChevron}>{open ? '−' : '+'}</Text>
          </TouchableOpacity>
          {open && <View style={styles.modernBody}>
            <Text style={styles.modernDates}>{conference.dates}</Text>
            {rows.length ? rows.map(person => <View key={person.registrationNo} style={styles.modernCertificate}>
              <Text style={styles.modernConference}>{person.name}</Text><Text style={styles.modernLocation}>{person.registrationNo} · {person.memberType}</Text>
              <TouchableOpacity style={styles.modernDownload} onPress={() => onOpen(conference, person)} accessibilityRole="button"><DocumentIcon size={17} color="#6251B7" /><Text style={styles.modernDownloadText}>View certificate</Text></TouchableOpacity>
            </View>) : <View style={styles.modernEmpty}><DocumentIcon size={26} color="#A7B2C8" /><Text style={styles.modernEmptyTitle}>No certificate available</Text><Text style={styles.modernEmptyCopy}>Certificates linked to your account for this conference will appear here.</Text></View>}
          </View>}
        </View>;
      })}
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archive Participation Certificate</Text>
      <Text style={styles.hint}>
        Your participation certificates from past conferences.
      </Text>
      <FlatList
        data={conferences}
        keyExtractor={conference => conference.id}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        extraData={{ expanded, profile }}
        renderItem={({ item: conference }) => {
          const open = expanded === conference.id;
          const rows = (profile?.archiveCertificates || []).filter(
            certificate => certificate.conferenceId === conference.id,
          );
          return (
            <View key={conference.id} style={styles.archive}>
              <TouchableOpacity
                style={styles.heading}
                activeOpacity={0.85}
                onPress={() => setExpanded(open ? null : conference.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={`${conference.title}, ${conference.location}`}
              >
                <Text style={styles.info}>ℹ</Text>
                <View style={styles.headingText}>
                  <Text style={styles.conference}>{conference.title}</Text>
                  <Text style={styles.location}>{conference.location}</Text>
                </View>
                <Text style={styles.chevron}>{open ? '−' : '+'}</Text>
              </TouchableOpacity>
              {open && (
                <View style={styles.body}>
                  <ScrollView
                    horizontal
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    <View>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.columnName, styles.headerText]}>
                          Name
                        </Text>
                        <Text
                          style={[styles.columnRegistration, styles.headerText]}
                        >
                          Registration No.
                        </Text>
                        <Text style={[styles.columnType, styles.headerText]}>
                          Member Type
                        </Text>
                        <Text
                          style={[styles.columnDownload, styles.headerText]}
                        >
                          Download
                        </Text>
                      </View>
                      <FlatList
                        data={rows}
                        keyExtractor={person => person.registrationNo}
                        scrollEnabled={false}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item: person, index }) => (
                          <View
                            key={person.registrationNo}
                            style={[
                              styles.row,
                              index % 2 === 1 && styles.alternate,
                            ]}
                          >
                            <Text style={[styles.columnName, styles.cell]}>
                              {person.name}
                            </Text>
                            <Text
                              style={[styles.columnRegistration, styles.cell]}
                            >
                              {person.registrationNo}
                            </Text>
                            <Text style={[styles.columnType, styles.cell]}>
                              {person.memberType}
                            </Text>
                            <TouchableOpacity
                              style={styles.download}
                              onPress={() => onOpen(conference, person)}
                              accessibilityRole="button"
                              accessibilityLabel={`Preview and download ${person.name}'s certificate`}
                            >
                              <DocumentIcon size={20} color="#0067B9" />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </View>
                  </ScrollView>
                  {!rows.length && (
                    <Text style={styles.empty}>
                      No certificate is available for your account for this conference.
                    </Text>
                  )}
                  <Text style={styles.hint}>
                    Swipe the table sideways to view all columns.
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  modernContainer: { marginTop: 8, marginBottom: 20 },
  modernTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  modernEmblem: { backgroundColor: '#ECE8FC', width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modernTitleCopy: { flex: 1 },
  modernTitle: { color: '#25314F', fontSize: 21, fontWeight: '700' },
  modernHint: { color: '#8B97AC', fontSize: 11, marginTop: 5 },
  modernCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E3E7F1', marginBottom: 12, overflow: 'hidden' },
  modernCardOpen: { borderColor: '#B9ADE3' },
  modernHeading: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  modernYear: { backgroundColor: '#F0EDFA', borderRadius: 13, width: 58, paddingVertical: 12, alignItems: 'center' },
  modernYearText: { color: '#6251A1', fontSize: 17, fontWeight: '800' },
  modernYearCaption: { color: '#9A8BBE', fontSize: 6, letterSpacing: 1, fontWeight: '700', marginTop: 4 },
  modernConference: { color: '#33415E', fontSize: 14, fontWeight: '700', lineHeight: 21 },
  modernLocation: { color: '#8794AB', fontSize: 11, lineHeight: 18, marginTop: 4 },
  modernChevron: { color: '#8273B2', fontSize: 23, paddingLeft: 4 },
  modernBody: { padding: 16, paddingTop: 0 },
  modernDates: { color: '#8794AB', fontSize: 11, lineHeight: 18, marginBottom: 12 },
  modernCertificate: { backgroundColor: '#F7F8FC', padding: 14, borderRadius: 14, marginBottom: 8 },
  modernDownload: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, marginTop: 6 },
  modernDownloadText: { color: '#6251B7', fontSize: 12, fontWeight: '700' },
  modernEmpty: { alignItems: 'center', backgroundColor: '#F7F8FC', borderRadius: 14, padding: 20 },
  modernEmptyTitle: { color: '#67758F', fontSize: 13, fontWeight: '600', marginTop: 12 },
  modernEmptyCopy: { color: '#97A2B6', fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 7 },

  container: {
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
    color: '#034278',
    marginBottom: 6,
  },
  hint: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    marginTop: 4,
  },
  archive: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heading: {
    backgroundColor: '#192A46',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    minHeight: 84,
  },
  info: {
    color: '#F59E0B',
    fontSize: 30,
    fontWeight: '800',
  },
  headingText: {
    flex: 1,
  },
  conference: {
    fontSize: 17,
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  location: {
    fontSize: 15,
    lineHeight: 22,
    color: '#DFE7F3',
  },
  chevron: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  body: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    color: '#0F172A',
    fontSize: 14,
  },
  sample: {
    fontSize: 11,
    color: '#64748B',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F58A39',
    paddingVertical: 14,
  },
  headerText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 14,
  },
  columnName: {
    width: 210,
    paddingHorizontal: 12,
  },
  columnRegistration: {
    width: 160,
    paddingHorizontal: 12,
  },
  columnType: {
    width: 130,
    paddingHorizontal: 12,
  },
  columnDownload: {
    width: 100,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  alternate: {
    backgroundColor: '#F8FAFC',
  },
  cell: {
    fontSize: 14,
    lineHeight: 21,
    color: '#0F172A',
  },
  download: {
    width: 100,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  empty: {
    paddingVertical: 18,
    color: '#64748B',
    fontSize: 14,
  },
});
