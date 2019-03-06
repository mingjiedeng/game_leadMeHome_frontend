import React from 'react';
import { Link } from 'react-router-dom';
import { scoreToString, isEmpty } from '../../utils';

const GuestPanel = ({ bestScores, userScores }) => {
  const scoresTbody = bestScores.map((bestScore, i) => {
    const {
      level,
      score: { saved, seconds }
    } = bestScore;
    const userScore = userScores.filter(score => score.level === level);
    return (
      <tr key={`guestPanel-${level}`}>
        <td className="align-middle text-center">{bestScore.level}</td>
        <td className="align-middle text-center">
          <Link to={`/topLists/${level}`}>{scoreToString(saved, seconds)}</Link>
        </td>
        <td className="align-middle text-center">
          {isEmpty(userScore)
            ? '--'
            : scoreToString(userScore[0].saved, userScore[0].seconds)}
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <small>Sign in to check your ranking</small>
        </div>
        <div className="col-4">
          <Link to="/login">
            <button type="button" className="btn btn-success float-right">
              Sign In
            </button>
          </Link>
        </div>
      </div>
      <div className="row">
        <table className="table">
          <thead className="thead-light">
            <tr className="text-center">
              <th>Level</th>
              <th>Best Score</th>
              <th>Your Score</th>
            </tr>
          </thead>
          <tbody>{scoresTbody}</tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestPanel;
