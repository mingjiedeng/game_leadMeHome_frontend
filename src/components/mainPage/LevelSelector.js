import React from 'react';
import { Link } from 'react-router-dom';
import LevelTile from './LevelTile';
import { isEmptyArray } from '../../utils';

const calculateStars = (userScores, level) => {
  const scores = userScores.filter(s => s.level === level);
  return isEmptyArray(scores) ? 0 : scores[0].star;
};

const LevelSelector = ({ userScores, levelsAmount }) => {
  const tiles = [...Array(levelsAmount).keys()].map(i => {
    const star = userScores ? calculateStars(userScores, i + 1) : 0;
    return (
      <Link key={i + 1} to={`/game/${i + 1}`}>
        <LevelTile level={i + 1} star={star} />
      </Link>
    );
  });

  return <div className="levelSelector">{tiles}</div>;
};

export default LevelSelector;
