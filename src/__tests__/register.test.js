import React from 'react';
import { shallow } from 'enzyme';
import Register from '../components/register/registerUI';

describe('Register Page', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Register />);
  });

  it('should show the name when user input a name', () => {
    wrapper
      .find('#username')
      .simulate('change', { target: { name: 'username', value: 'Jason' } });
    expect(wrapper.state('username')).toEqual('Jason');
  });

  it('given an empty username, when click submit, then show error', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper.contains('Username is required'));
  });

  it('given an unmatched confirm password, when click submit, then show error', () => {
    wrapper
      .find('#password')
      .simulate('change', { target: { name: 'password', value: '123' } });
    wrapper
      .find('#pwdConfirm')
      .simulate('change', { target: { name: 'pwdConfirm', value: '321' } });
    wrapper.find('button').simulate('click');
    expect(wrapper.contains('Passwords do Not match'));
  });
});
