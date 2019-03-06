import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import createThunkStore from '../store';
import routes from '../routes';

describe('MainPage right side pannel', () => {
  it('should see the sign in button when the player did not sign in', () => {
    const state = {
      user: {
        name: ''
      }
    };
    const store = createThunkStore(state);
    const wrapper = mount(<Provider store={store}>{routes}</Provider>);
    expect(wrapper.contains('Sign in to see your ranking')).toBe(true);
  });

  it('should see the greeting when the player already signed in', () => {
    const state = {
      user: {
        name: 'Jason'
      }
    };
    const store = createThunkStore(state);
    const wrapper = mount(<Provider store={store}>{routes}</Provider>);
    expect(wrapper.contains(<span>Hi Jason</span>)).toBe(true);
  });
});

describe('MainPage level selector', () => {
  it('should show two yellow stars under the level 1 tile when the player only saved 9 emojis', () => {
    const state = {
      name: '',
      scores: [{ level: 1, saved: 9, seconds: 78, star: 2 }]
    };
    const store = createThunkStore(state);
    const wrapper = mount(<Provider store={store}>{routes}</Provider>);
    expect(wrapper.find('img[src="images/starLight.png"]').length).toEqual(2);
  });
});
