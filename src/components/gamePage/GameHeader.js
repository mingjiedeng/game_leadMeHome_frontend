import React from 'react';
import PropTypes from 'prop-types';
import { numberToTime } from '../../utils';

const GameHeader = ({ level = 1, saved = 10, seconds = 0 }) => (
  <div className="d-flex justify-content-between">
    <span>
      Alive: <span className="text-primary">{saved}</span>
    </span>
    <strong>LEVEL {level}</strong>
    <span>
      Running Time:{' '}
      <span className="text-primary">{numberToTime(seconds)}</span>
    </span>
  </div>
);

GameHeader.propTypes = {
  level: PropTypes.number.isRequired,
  saved: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired
};

export default GameHeader;
