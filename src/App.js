/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';
import { newTimer } from './utils/TimerUtils';

const TAG = 'App.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timers: [{
        title: 'Mow the lawn',
        project: 'House Chores',
        id: uuid(),
        elapsed: 5456099,
        isRunning: true,
      },
      {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuid(),
        elapsed: 1273998,
        isRunning: false,
      },],

    }
  }

  componentDidMount = () => {
    const TIME_INTERVAL = 1000;
    this.intervalId = setInterval(() => {
      const { timers } = this.state;

      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;

          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed
          }
        })
      })
    }, TIME_INTERVAL)
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = timer => {
    const { timers } = this.state;
    this.setState({
      timers: [newTimer(timer), ...timers],
    });
  };

  handleFormSubmit = attrs => {
    const { timers } = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, project } = attrs;

          return {
            ...timer,
            title,
            project,
          }
        } else {
          return timer
        }
      })
    })
  }

  handleRemovePress = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    })
  }

  handleCreateSubmit = timer => {
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers]
    })
  }

  toggleTimer = timerId => {
    this.setState(prevState => {
      const { timers } = this.state;
      // const { timers } = prevState; //or

      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;

          if (id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning,
            };
          }
          return timer;
        })
      }
    })
  }

  renderEditableTimers = () => (
    this.state.timers.map(({ title, project, id, elapsed, isRunning }) => (
      <EditableTimer
        key={id}
        id={id}
        title={title}
        project={project}
        elapsed={elapsed}
        isRunning={isRunning}
        onFormSubmit={this.handleFormSubmit}
        onRemovePress={this.handleRemovePress}
        onStartPress={this.toggleTimer}
        onStopPress={this.toggleTimer}
      />
    ))
  );

  render() {
    const { timers } = this.state;
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer}>
          <ScrollView style={styles.timerList}>
            <ToggleableTimerForm isOpen={false} onFormSubmit={this.handleCreateSubmit} />
            {this.renderEditableTimers()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList: {
    paddingBottom: 15,
  },
  timerListContainer: {
    flex: 1,
  }
});

export default App;
