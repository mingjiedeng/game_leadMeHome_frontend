import React from 'react';

const LevelTile = ({ level, star }) => {
  const stars = [];
  for (let i = 0; i < star; i++) {
    stars.push(
      <img
        key={i}
        className="star"
        src="images/starLight.png"
        alt="yellow star"
      />
    );
  }
  for (let i = star; i < 3; i++) {
    stars.push(
      <img key={i} className="star" src="images/starDark.png" alt="dark star" />
    );
  }

  return (
    <div>
      <div className="tile">{level}</div>
      {stars}
    </div>
  );
};

export default LevelTile;
