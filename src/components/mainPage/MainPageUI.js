import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import LevelSelector from './LevelSelector';
import GuestPanel from './GuestPanel';
import UserPanel from './UserPanel';
import '../../stylesheets/mainPage.css';

class MainPage extends Component {
  constructor(...props) {
    super(...props);

    const token = localStorage.getItem('jwtToken');
    if (token) {
      const { sub: username } = jwtDecode(token);
      this.props.setUserInfo(username);
    }
  }

  componentDidMount() {
    const { setTopLists, setLevelsAmount } = this.props;
    setTopLists();
    setLevelsAmount();
  }

  render() {
    const { user, scores, levelsAmount, topLists, logout } = this.props;
    const bestScores = topLists.map(topList => ({
      level: topList.level,
      score: topList.scores[0]
    }));

    return (
      <div className="main">
        <div className="header">Lead Me Home</div>
        <LevelSelector
          className="levelSelector"
          userScores={scores}
          levelsAmount={levelsAmount}
        />
        <div className="panel">
          {user && user.name ? (
            <UserPanel
              user={user}
              scores={scores}
              levelsAmount={levelsAmount}
              topLists={topLists}
              signOut={logout}
            />
          ) : (
            <GuestPanel bestScores={bestScores} userScores={scores} />
          )}
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  user: PropTypes.object,
  scores: PropTypes.arrayOf(Object),
  topLists: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.number,
      ranking: PropTypes.array
    })
  )
};

export default MainPage;
