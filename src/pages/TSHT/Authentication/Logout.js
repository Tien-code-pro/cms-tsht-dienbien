import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { logoutUser } from '../../../store/actions';

//redux
import { useSelector, useDispatch } from 'react-redux';

import withRouter from '../../../Components/Common/withRouter';
import { logoutApi } from '../../../helpers/fakebackend_helper';

const Logout = (props) => {
  const dispatch = useDispatch();

  const { isUserLogout } = useSelector((state) => ({
    isUserLogout: state.Login.isUserLogout,
  }));

  const actionLogout = () => {
    const AT =
      JSON.parse(localStorage.getItem('authUser'))['data']['accessToken'] || '';
    const RT =
      JSON.parse(localStorage.getItem('authUser'))['data']['refreshToken'] ||
      '';
    logoutApi({
      accessToken: AT,
      refreshToken: RT,
    }).then((res) => {
      if (res.data.status > 0) {
        localStorage.removeItem('authUser');
      }
    });
  };
  useEffect(() => {
    dispatch(logoutUser());
    actionLogout();
  }, [dispatch]);

  if (isUserLogout) {
    return <Navigate to="/login" />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
