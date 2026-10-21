import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DocumentIcon, SearchIcon } from './Icons';

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
// Sample archive rows until a certificate search API is connected.
const SAMPLE_PARTICIPANTS: Participant[] = [
  {
    name: 'Dr. Mohan Rajan',
    registrationNo: 'APAO2500025',
    memberType: 'Faculty',
  },
  {
    name: 'Dr. A. Balraj',
    registrationNo: 'APAO2500084',
    memberType: 'Delegate',
  },
  {
    name: 'Dr. Chimanlal Devraj Malavia',
    registrationNo: 'APAO2500109',
    memberType: 'Delegate',
  },
];

export const CertificateArchive: React.FC<{
  conferences: Conference[];
  onOpen: (conference: Conference, person: Participant) => void;
}> = ({ conferences, onOpen }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [queries, setQueries] = useState<Record<string, string>>({});
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archive Participation Certificate</Text>
      <Text style={styles.hint}>
        Choose a conference to find your certificate.
      </Text>
      <FlatList
        data={conferences}
        keyExtractor={conference => conference.id}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        extraData={{ expanded, queries }}
        renderItem={({ item: conference }) => {
          const open = expanded === conference.id;
          const query = (queries[conference.id] || '').trim().toLowerCase();
          const rows = SAMPLE_PARTICIPANTS.filter(person =>
            `${person.name} ${person.registrationNo} ${person.memberType}`
              .toLowerCase()
              .includes(query),
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
                  <View style={styles.search}>
                    <SearchIcon size={18} color="#64748B" />
                    <TextInput
                      style={styles.searchInput}
                      value={queries[conference.id] || ''}
                      onChangeText={value =>
                        setQueries(current => ({
                          ...current,
                          [conference.id]: value,
                        }))
                      }
                      placeholder="Search name or registration no."
                      placeholderTextColor="#94A3B8"
                      autoCorrect={false}
                      accessibilityLabel={`Search ${conference.title} certificates`}
                    />
                  </View>
                  <Text style={styles.sample}>
                    Sample data · {rows.length} results
                  </Text>
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
                      No certificates found. Try another name or registration
                      number.
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
