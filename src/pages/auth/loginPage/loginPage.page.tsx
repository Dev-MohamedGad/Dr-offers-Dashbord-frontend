import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useLoginMutation } from '@redux/slices/authSlice/authApiSlice';
import { useDispatch } from 'react-redux';
import { setTokens } from '@redux/slices/authSlice/authSlice';
import { Formik, Form, Field } from 'formik';
import { SignInSchema } from '@utils/ValidationSchema';
import TextError from '@components/Forms/TextError';
import { LoginValuesType } from 'types';
import Logo from '@assets/logo.svg';
import './login.css';
import { setCurrentUser } from '@redux/slices/userSlice/userSlice';
import Swal from 'sweetalert2';

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Login = async (values: LoginValuesType) => {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(
        setTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        })
      );
      dispatch(setCurrentUser(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        confirmButtonColor: '#3085d6',
      });
      console.log(err);
    }
  };

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <div className="min-w-[70%]">
      <div className="bg-[#f8f9fa]  min-vh-100 d-flex flex-row align-items-center justify-content-center py-5">
        <CCol md={8}>
          <CCardGroup className="overflow-hidden card-shadow">
            <CCard className="p-5 ">
              <CCardBody>
                <Formik
                  validationSchema={SignInSchema}
                  initialValues={initialValues}
                  onSubmit={Login}
                  validateOnChange={false}
                  validateOnBlur={true}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-[#2d3748] mb-2 hover:text-[#1a202c] transition-colors duration-300">
                          Welcome Back!
                        </h1>
                        <p className="text-[#4a5568] text-md hover:text-[#2d3748] transition-colors duration-300">
                          Sign in to access your admin panel
                        </p>
                      </div>
                      <CInputGroup className="mb-3 hover:opacity-90 transition-opacity duration-300">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <Field
                          name="email"
                          as={CFormInput}
                          placeholder="Enter your email"
                          autoComplete="email"
                          type="text"
                        />
                      </CInputGroup>
                      {errors.email && touched.email ? (
                        <TextError name="email" />
                      ) : null}
                      <CInputGroup className="mb-3 hover:opacity-90 transition-opacity duration-300">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <Field
                          name="password"
                          as={CFormInput}
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                        />
                      </CInputGroup>
                      {errors.password && touched.password ? (
                        <TextError name="password" />
                      ) : null}
                      <CRow className="align-items-center">
                        <CCol xs={6}>
                          <CButton
                            className="primary-btn w-100 hover:shadow-lg transition-all duration-300"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-end">
                          <CButton className="forgot__password  transition-all duration-300 scale-105">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </Form>
                  )}
                </Formik>
              </CCardBody>
            </CCard>
            <CCard className="text-white bg__primary py-5 hover:shadow-xl transition-shadow duration-300">
              <CCardBody className="text-center d-flex flex-column justify-content-center align-items-center">
                <h2 className="mb-4 font-bold text-2xl text-center text-white transition-transform duration-300 transform hover:scale-110 hover:rotate-1 ">
                  PropCut Admin Panel
                </h2>
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-400"
                />
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </div>
    </div>
  );
};

export default Login;
