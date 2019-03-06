import React, { Component } from 'react';
import { toast } from 'react-toastify';
import GameHeader from './GameHeader';
import { Game, config } from '../../game';
import { getGameData } from '../../actions';

class GamePage extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      screen: {
        width: 800,
        height: 600,
        ratio: window.devicePixelRatio || 1
      }
    };

    this.images = [];
    this.stopTimer = this.stopTimer.bind(this);
    this.runGame = this.runGame.bind(this);
    this.windowSizeOnChange = this.windowSizeOnChange.bind(this);
  }

  componentWillMount() {
    this.loadImages(config.imgSources);
    this.windowSizeOnChange();
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeOnChange);

    this.canvas = document.getElementById('canvas');
    const { match } = this.props;
    const level = match ? parseInt(match.params.level, 10) : 1;
    this.gameStart(level);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeOnChange);
  }

  async gameStart(level) {
    try {
      await this.loadImages(config.imgSources);
      const res = await getGameData(level);
      this.runGame(res.data);
      this.startTimer();
    } catch (err) {
      toast.err(JSON.stringify(err));
    }
  }

  loadImages(imgSources) {
    const imgs = Object.keys(imgSources).map(async imgName => {
      await this.loadImg(imgName, imgSources[imgName]);
    });
    return Promise.all(imgs);
  }

  loadImg(imgName, imgSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      this.images[imgName] = image;
      image.onload = img => resolve(img);
      image.onerror = err => reject(err);
      image.src = imgSrc;
    });
  }

  runGame(gameData) {
    const { setGameData } = this.props;
    this.gameData = gameData;
    setGameData(gameData);
    const game = new Game(this);
    game.run();
  }

  startTimer() {
    this.timer = setInterval(() => {
      const { setTimeRunning, seconds } = this.props;
      setTimeRunning(seconds + 1);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  gameStop(gamePageComponent) {
    const {
      user,
      level,
      saved,
      seconds,
      uploadScore
    } = gamePageComponent.props;
    gamePageComponent.stopTimer();
    uploadScore(user, level, saved, seconds);
  }

  windowSizeOnChange() {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight - 25;
    if (newHeight / newWidth < 3 / 4) {
      newWidth = (newHeight * 4) / 3;
    } else {
      newHeight = (newWidth * 3) / 4;
    }
    this.setState({
      screen: {
        width: newWidth,
        height: newHeight,
        ratio: newWidth / 800
      }
    });
  }

  render() {
    const { level, saved, seconds } = this.props;
    const {
      screen: { width, height }
    } = this.state;

    return (
      <div style={{ width: `${width}px` }}>
        <GameHeader level={level} saved={saved} seconds={seconds} />
        <canvas id="canvas" width={width} height={height}>
          Can not run the game as your browser does not support HTML5 canvas.
          You can play the game in google chrome as alternative.
        </canvas>
      </div>
    );
  }
}

// GamePage.propTypes = {};

export default GamePage;
