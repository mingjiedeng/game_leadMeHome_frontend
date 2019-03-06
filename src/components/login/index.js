import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../actions';
import { namePwdValidation, isEmpty, formatError } from '../../utils';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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
    const { username, password } = this.state;
    const errors = namePwdValidation(username, password);
    if (isEmpty(errors)) {
      const { submitLogin, history } = this.props;
      submitLogin(username, password)
        .then(() => {
          history.push('/');
        })
        .catch(err => toast.error(formatError(err)));
    }
    this.setState({ errors });
  }

  render() {
    const { username, password, errors } = this.state;
    const checkAndShowError = error =>
      error && <div className="text-danger">{error}</div>;

    return (
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-10 col-sm-9 col-md-7 col-lg-5">
            <h1 className="mb-5 d-flex justify-content-center">Login</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  name="username"
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
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                {checkAndShowError(errors.password)}
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-lg btn-primary form-control btn-block"
                >
                  Login
                </button>
              </div>
              <div className="text-center">
                <span>
                  {`Don't have an account? `}
                  <Link to="/register">Register Here</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitLogin: (username, password) => dispatch(login(username, password))
});

const Container = connect(
  null,
  mapDispatchToProps
)(Login);

export default withRouter(Container);
