import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { register } from '../../actions';
import RegisterUI from './registerUI';

const mapDispatchToProps = dispatch => ({
  submitRegister: (username, password) => dispatch(register(username, password))
});

const Container = connect(
  null,
  mapDispatchToProps
)(RegisterUI);

export default withRouter(Container);
