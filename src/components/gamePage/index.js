import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GamePage from './GamePageUI';
import {
  updateRunningLevel,
  updateSaved,
  updateRunningTime,
  updateScore
} from '../../actions';

const mapStateToProps = state => ({
  user: state.user,
  level: state.gameStats.level,
  saved: state.gameStats.saved,
  seconds: state.gameStats.seconds
});

const mapDispatchToProps = dispatch => ({
  setLevel(level) {
    dispatch(updateRunningLevel(level));
  },
  setSaved(number) {
    dispatch(updateSaved(number));
  },
  setTimeRunning(time) {
    dispatch(updateRunningTime(time));
  },
  uploadScore(user, level, saved, seconds) {
    dispatch(updateScore(user, level, saved, seconds));
  },
  setGameData(gameData) {
    const { level, balls } = gameData;
    dispatch(updateRunningLevel(level));
    dispatch(updateRunningTime(0));
    dispatch(updateSaved(balls.length));
  }
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage);

export default withRouter(Container);
