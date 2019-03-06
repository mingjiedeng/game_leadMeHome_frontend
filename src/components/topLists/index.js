import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopList from './TopList';
import { getTopLists } from '../../actions';

class TopLists extends Component {
  componentDidMount() {
    this.props.setTopLists();
  }

  render() {
    const { topLists, match } = this.props;
    const levelSelected = match ? parseInt(match.params.level, 10) : 1;

    return (
      <div id="topLists">
        <div>
          <Link to="/">
            <i className="material-icons">arrow_back_ios</i>
          </Link>
          <h1>Top Players</h1>
        </div>
        {topLists.map(topList => (
          <TopList
            key={topList.level}
            topList={topList}
            level={levelSelected}
          />
        ))}
      </div>
    );
  }
}

TopLists.propTypes = {
  topLists: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.number,
      ranking: PropTypes.array
    })
  ).isRequired,
  level: PropTypes.number
};

const mapStateToProps = state => ({
  topLists: state.topLists
});

const mapDispatchToProps = dispatch => ({
  setTopLists: () => dispatch(getTopLists())
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopLists);

export default withRouter(Container);
