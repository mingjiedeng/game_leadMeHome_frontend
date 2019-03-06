import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MainPage from './MainPageUI';
import {
  getTopLists,
  getLevelsAmount,
  signOut,
  getUserInfo
} from '../../actions';

const mapStateToProps = state => ({
  user: state.user,
  scores: state.scores,
  levelsAmount: state.levelsAmount,
  topLists: state.topLists
});

const mapDispatchToProps = dispatch => ({
  setUserInfo: username => dispatch(getUserInfo(username)),
  setTopLists: () => dispatch(getTopLists()),
  setLevelsAmount: () => dispatch(getLevelsAmount()),
  logout: () => dispatch(signOut())
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);

export default withRouter(Container);
