import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { rounded, shadows, spacing } from '../theme/spacing';
import { Typography } from './Typography';
import { CalendarIcon, ArrowBackIcon, ArrowRightIcon } from './Icons';

export interface CalendarPickerModalProps {
  visible: boolean;
  value?: string; // DD/MM/YYYY
  onClose: () => void;
  onSelectDate: (formattedDate: string) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  title?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({
  visible,
  value,
  onClose,
  onSelectDate,
  maximumDate = new Date(),
  minimumDate = new Date(1940, 0, 1),
  title = 'Select Date of Birth',
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

  const defaultYear = new Date().getFullYear() - 25;
  const [currentYear, setCurrentYear] = useState<number>(defaultYear);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  // Sync state when opened with initial value
  useEffect(() => {
    if (visible) {
      setViewMode('calendar');
      if (value) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
            setSelectedDate({ day: d, month: m, year: y });
            setCurrentYear(y);
            setCurrentMonth(m);
            return;
          }
        }
      }
      // If no valid value, default viewing year/month
      const dYear = new Date().getFullYear() - 25;
      setCurrentYear(dYear);
      setCurrentMonth(0);
      setSelectedDate(null);
    }
  }, [visible, value]);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const yearsList = useMemo(() => {
    const maxYear = maximumDate.getFullYear();
    const minYear = minimumDate.getFullYear();
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [maximumDate, minimumDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentYear, currentMonth + 1, 1);
    if (nextDate > maximumDate) return;

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const isNextMonthDisabled = useMemo(() => {
    const nextDate = new Date(currentYear, currentMonth + 1, 1);
    return nextDate > maximumDate;
  }, [currentYear, currentMonth, maximumDate]);

  const handleSelectDay = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    if (dateToCheck > maximumDate) return;

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDate = `${formattedDay}/${formattedMonth}/${currentYear}`;

    setSelectedDate({ day, month: currentMonth, year: currentYear });
    onSelectDate(formattedDate);
    onClose();
  };

  const handleSelectYear = (year: number) => {
    setCurrentYear(year);
    // If current viewed month in this new year exceeds maximumDate, reset to Jan
    const testDate = new Date(year, currentMonth, 1);
    if (testDate > maximumDate) {
      setCurrentMonth(0);
    }
    setViewMode('calendar');
  };

  const handleSelectMonth = (monthIdx: number) => {
    const testDate = new Date(currentYear, monthIdx, 1);
    if (testDate > maximumDate) return;
    setCurrentMonth(monthIdx);
    setViewMode('calendar');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>
              {/* Top Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleRow}>
                  <View style={styles.headerIconContainer}>
                    <CalendarIcon size={18} color={colors.secondaryRoyal} />
                  </View>
                  <Typography variant="headlineSm" weight="bold" color={colors.primaryNavy}>
                    {title}
                  </Typography>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Typography variant="bodyLg" weight="bold" color={colors.textMuted}>
                    ✕
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Navigation Bar (Month & Year Selector) */}
              <View style={styles.navBar}>
                <TouchableOpacity
                  style={styles.navArrowBtn}
                  onPress={handlePrevMonth}
                  activeOpacity={0.7}
                >
                  <ArrowBackIcon size={16} color={colors.primaryNavy} />
                </TouchableOpacity>

                <View style={styles.selectorButtons}>
                  <TouchableOpacity
                    style={[styles.selectorBtn, viewMode === 'month' && styles.selectorBtnActive]}
                    onPress={() => setViewMode((m) => (m === 'month' ? 'calendar' : 'month'))}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="labelLg"
                      weight="bold"
                      color={viewMode === 'month' ? colors.primaryNavy : colors.textPrimary}
                    >
                      {MONTH_NAMES[currentMonth]}
                    </Typography>
                    <Typography variant="labelSm" color={colors.textMuted} style={styles.caretText}>
                      ▼
                    </Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.selectorBtn, viewMode === 'year' && styles.selectorBtnActive]}
                    onPress={() => setViewMode((m) => (m === 'year' ? 'calendar' : 'year'))}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="labelLg"
                      weight="bold"
                      color={viewMode === 'year' ? colors.primaryNavy : colors.textPrimary}
                    >
                      {currentYear}
                    </Typography>
                    <Typography variant="labelSm" color={colors.textMuted} style={styles.caretText}>
                      ▼
                    </Typography>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.navArrowBtn, isNextMonthDisabled && styles.navArrowDisabled]}
                  onPress={handleNextMonth}
                  disabled={isNextMonthDisabled}
                  activeOpacity={0.7}
                >
                  <ArrowRightIcon
                    size={16}
                    color={isNextMonthDisabled ? colors.borderField : colors.primaryNavy}
                  />
                </TouchableOpacity>
              </View>

              {/* Content Body Based on View Mode */}
              {viewMode === 'year' ? (
                /* Year Picker Grid */
                <View style={styles.scrollWrapper}>
                  <Typography variant="labelSm" color={colors.textMuted} style={styles.gridSubtitle}>
                    Select Year of Birth
                  </Typography>
                  <ScrollView
                    style={styles.yearScroll}
                    showsVerticalScrollIndicator
                    contentContainerStyle={styles.yearGrid}
                  >
                    {yearsList.map((y) => {
                      const isCurrentYear = y === currentYear;
                      return (
                        <TouchableOpacity
                          key={y}
                          style={[styles.yearItem, isCurrentYear && styles.yearItemActive]}
                          onPress={() => handleSelectYear(y)}
                          activeOpacity={0.7}
                        >
                          <Typography
                            variant="labelMd"
                            weight={isCurrentYear ? 'bold' : 'regular'}
                            color={isCurrentYear ? colors.onPrimary : colors.textPrimary}
                          >
                            {y}
                          </Typography>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : viewMode === 'month' ? (
                /* Month Picker Grid */
                <View style={styles.scrollWrapper}>
                  <Typography variant="labelSm" color={colors.textMuted} style={styles.gridSubtitle}>
                    Select Month
                  </Typography>
                  <View style={styles.monthGrid}>
                    {MONTH_SHORT.map((m, idx) => {
                      const isCur = idx === currentMonth;
                      const isFuture = new Date(currentYear, idx, 1) > maximumDate;
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[
                            styles.monthItem,
                            isCur && styles.monthItemActive,
                            isFuture && styles.monthItemDisabled,
                          ]}
                          onPress={() => handleSelectMonth(idx)}
                          disabled={isFuture}
                          activeOpacity={0.7}
                        >
                          <Typography
                            variant="labelMd"
                            weight={isCur ? 'bold' : 'regular'}
                            color={
                              isCur
                                ? colors.onPrimary
                                : isFuture
                                ? colors.borderField
                                : colors.textPrimary
                            }
                          >
                            {m}
                          </Typography>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : (
                /* Calendar Days Grid */
                <View style={styles.calendarContainer}>
                  {/* Weekday headers */}
                  <View style={styles.weekDaysRow}>
                    {WEEK_DAYS.map((wd) => (
                      <View key={wd} style={styles.weekDayCol}>
                        <Typography variant="labelSm" weight="bold" color={colors.textMuted}>
                          {wd}
                        </Typography>
                      </View>
                    ))}
                  </View>

                  {/* Days Matrix */}
                  <View style={styles.daysMatrix}>
                    {/* Empty placeholder slots for previous month padding */}
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <View key={`empty_${i}`} style={styles.dayCol} />
                    ))}

                    {/* Active days in current month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const isFuture = new Date(currentYear, currentMonth, day) > maximumDate;
                      const isSelected =
                        selectedDate?.day === day &&
                        selectedDate?.month === currentMonth &&
                        selectedDate?.year === currentYear;

                      return (
                        <TouchableOpacity
                          key={`day_${day}`}
                          style={styles.dayCol}
                          onPress={() => handleSelectDay(day)}
                          disabled={isFuture}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.dayCircle,
                              isSelected && styles.dayCircleSelected,
                              isFuture && styles.dayCircleDisabled,
                            ]}
                          >
                            <Typography
                              variant="bodyMd"
                              weight={isSelected ? 'bold' : 'regular'}
                              color={
                                isSelected
                                  ? colors.onPrimary
                                  : isFuture
                                  ? colors.borderField
                                  : colors.textPrimary
                              }
                            >
                              {day}
                            </Typography>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Bottom Footer Actions */}
              <View style={styles.footerRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Typography variant="labelMd" weight="bold" color={colors.textSecondary}>
                    Cancel
                  </Typography>
                </TouchableOpacity>

                {viewMode !== 'calendar' ? (
                  <TouchableOpacity
                    style={styles.viewCalendarBtn}
                    onPress={() => setViewMode('calendar')}
                    activeOpacity={0.7}
                  >
                    <Typography variant="labelMd" weight="bold" color={colors.secondaryRoyal}>
                      Back to Calendar
                    </Typography>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 15, 84, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 18,
    ...shadows.level2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderNeutral,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 6,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  selectorButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  selectorBtnActive: {
    backgroundColor: '#DBEAFE',
  },
  caretText: {
    fontSize: 9,
    marginTop: 2,
  },
  calendarContainer: {
    width: '100%',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  weekDayCol: {
    width: `${100 / 7}%`,
    alignItems: 'center',
  },
  daysMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCol: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.primaryNavy,
  },
  dayCircleDisabled: {
    opacity: 0.3,
  },
  scrollWrapper: {
    height: 240,
  },
  gridSubtitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  yearScroll: {
    flex: 1,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  yearItem: {
    width: '28%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearItemActive: {
    backgroundColor: colors.primaryNavy,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  monthItem: {
    width: '28%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthItemActive: {
    backgroundColor: colors.primaryNavy,
  },
  monthItemDisabled: {
    opacity: 0.3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderNeutral,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewCalendarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
