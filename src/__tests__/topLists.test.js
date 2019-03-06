import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import createThunkStore from '../store';
import TopLists from '../components/topLists';

describe('TopLists', () => {
  it('should show the top lists of players when the user click the best score', () => {
    const state = {
      topLists: [
        {
          level: 1,
          scores: [
            { name: 'Jason', saved: 10, seconds: 6 },
            { name: 'Bob', saved: 10, seconds: 7 }
          ]
        },
        {
          level: 2,
          scores: [
            { name: 'Ryan', saved: 10, seconds: 8 },
            { name: 'Fred', saved: 10, seconds: 9 }
          ]
        }
      ]
    };
    const store = createThunkStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/topLists/1']}>
          <TopLists />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.contains('Saved: 10, Time: 00:09'));

    // const wrapper = mount(<Provider store={store}>{routes}</Provider>);
    // wrapper.find('Link#bestScore-1').simulate('click');
    // wrapper.findWhere(n => n.type() === 'a' && n.contains('Saved: 10, Time: 00:12')).simulate('click');
    // wrapper.find('Link').findWhere(n => n.prop('to') === '/topLists/1').simulate('click');
    // expect(wrapper.find('#bestScore-1').length).toEqual(2);
    // expect(wrapper.find('#topList-1').at(0).props().defaultExpanded).toBe(true);
    // expect(wrapper.find('[defaultExpanded=true]').length).toEqual(1);
  });
});
