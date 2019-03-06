import React from 'react';
import { scoreToString } from '../../utils';

const TopList = ({ topList, level }) => {
  const { level: lv } = topList;
  return (
    <div className="card">
      <div
        className="card-header"
        id={`heading${lv}`}
        data-toggle="collapse"
        data-target={`#collapse${lv}`}
        aria-expanded="true"
        aria-controls={`collapse${lv}`}
      >
        Level {lv}
      </div>
      <div
        id={`collapse${lv}`}
        className={`collapse ${level === lv && 'show'}`}
        aria-labelledby={`heading${lv}`}
        data-parent="#topLists"
      >
        <div className="card-body">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topList.scores.map((n, i) => (
                <tr key={i + 1}>
                  <td className="align-middle">{i + 1}</td>
                  <td>{n.name}</td>
                  <td>{scoreToString(n.saved, n.seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopList;
