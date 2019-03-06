import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import createThunkStore from '../store';
import GamePage from '../components/gamePage';
import Game from '../game/game';

describe('GamePage', () => {
  it('should show the alive and run time on the game page header', () => {
    const state = {
      gameStats: {
        level: 1,
        saved: 5,
        seconds: 200
      }
    };

    // jest.mock('../game/game.js');

    const store = createThunkStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/game/1']}>
          <GamePage />
        </MemoryRouter>
      </Provider>
    );
    // const gameStartSpy = jest.spyOn(GamePage.prototype, 'runGame');

    // wrapper.instance().gameStart = jest.fn();
    // wrapper.update();
    // wrapper.instance().forceUpdate();
    expect(wrapper.contains('Alive: 5'));
    // expect(gameStartSpy).toHaveBeenCalled();
    // gameStartSpy.mockRestore();

    // const wrapper = mount(<Provider store={store}>{routes}</Provider>);
    // wrapper.find('Link').findWhere(n => n.prop('to') === '/topLists/1').simulate('click');
    // expect(wrapper.find('#bestScore-1').length).toEqual(2);
    // wrapper.find('Link#bestScore-1').simulate('click');
    // wrapper.findWhere(n => n.type() === 'a' && n.contains('Saved: 10, Time: 00:12')).simulate('click');
    // expect(wrapper.contains('Saved: 10, Time: 00:09'));
    // expect(wrapper.find('#topList-1').length).toEqual(1);
    // expect(wrapper.find('[defaultExpanded=true]').length).toEqual(1);
  });
});
