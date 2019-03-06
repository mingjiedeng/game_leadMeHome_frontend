import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { namePwdValidation, isEmpty, formatError } from '../../utils';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      pwdConfirm: '',
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password, pwdConfirm } = this.state;
    const errors = namePwdValidation(username, password, pwdConfirm);
    if (isEmpty(errors)) {
      const { submitRegister, history } = this.props;
      submitRegister(username, password)
        .then(() => history.push('/'))
        .catch(err => toast.error(formatError(err)));
    }
    this.setState({ errors });
  }

  render() {
    const { username, password, pwdConfirm, errors } = this.state;
    const checkAndShowError = error =>
      error && <div className="text-danger">{error}</div>;

    return (
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-10 col-sm-9 col-md-7 col-lg-5">
            <h1 className="mb-5 d-flex justify-content-center">Register</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  id="username"
                  placeholder="User Name"
                  value={username}
                  onChange={this.handleChange}
                />
                {checkAndShowError(errors.username)}
              </div>
              <div className="form-group input-group-lg">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                {checkAndShowError(errors.password)}
              </div>
              <div className="form-group input-group-lg">
                <input
                  type="password"
                  className="form-control"
                  name="pwdConfirm"
                  id="pwdConfirm"
                  placeholder="Confirm Password"
                  value={pwdConfirm}
                  onChange={this.handleChange}
                />
                {checkAndShowError(errors.pwdConfirm)}
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-lg btn-primary form-control btn-block"
                >
                  Sign Up
                </button>
              </div>
              <div className="text-center">
                <span>
                  {`Already have an account? `}
                  <Link to="/login">Login Here</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
