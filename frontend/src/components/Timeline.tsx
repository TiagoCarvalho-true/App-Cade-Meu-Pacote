import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../constants/theme';

interface TimelineEvent {
  location: string;
  timestamp: string;
  status: string;
  color: string | string[];
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <View>
      {events.map((event, index) => (
        <View key={index} style={styles.eventContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.locationText}>{event.location}</Text>
            <Text style={styles.timestampText}>{event.timestamp}</Text>
          </View>

          <View style={styles.middleColumn}>
            {Array.isArray(event.color) ? (
              <LinearGradient colors={event.color} style={styles.circle} />
            ) : (
              <View style={[styles.circle, { backgroundColor: event.color }]} />
            )}
            {index < events.length - 1 && (
              <View style={[styles.line, { backgroundColor: Array.isArray(events[index + 1].color) ? event.color[1] : event.color }]} />
            )}
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    minHeight: 90,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  middleColumn: {
    alignItems: 'center',
    width: 30,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 15,
  },
  locationText: {
    fontFamily: Fonts.regular,
    color: Colors.lightGray,
    textAlign: 'right',
    fontSize: 13,
  },
  timestampText: {
    fontFamily: Fonts.regular,
    color: Colors.gray,
    textAlign: 'right',
    fontSize: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  line: {
    flex: 1,
    width: 4,
  },
  statusText: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    fontSize: 15,
  },
});

export default Timeline;