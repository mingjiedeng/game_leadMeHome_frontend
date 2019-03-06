import React from 'react';
import { Link } from 'react-router-dom';
import { scoreToString, isEmptyArray } from '../../utils';

const UserPanel = ({ user, scores, levelsAmount, topLists, signOut }) => {
  const userRanking = topLists.map(topList => {
    const position = topList.scores.map(s => s.name).indexOf(user.name);
    return position === -1 ? 'Out of 100' : position + 1;
  });

  const scoresTbody = [...Array(levelsAmount).keys()].map(i => {
    const level = i + 1;
    const userScores = scores.filter(s => s.level === level);
    let score;
    let ranking;
    if (isEmptyArray(userScores)) {
      score = '--';
      ranking = '--';
    } else {
      const { saved, seconds } = userScores[0];
      score = scoreToString(saved, seconds);
      ranking = userRanking[i];
    }
    return (
      <tr key={`userPanel-${i}`}>
        <td className="align-middle text-center">{level}</td>
        <td className="align-middle text-center">{score}</td>
        <td className="align-middle text-center">
          <Link to={`/topLists/${level}`}>{ranking}</Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <span>ID： {user.name}</span>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-success float-right"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="row">
        <table className="table">
          <thead className="thead-light">
            <tr className="text-center">
              <th>Level</th>
              <th>Your Score</th>
              <th>Ranking</th>
            </tr>
          </thead>
          <tbody>{scoresTbody}</tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPanel;
