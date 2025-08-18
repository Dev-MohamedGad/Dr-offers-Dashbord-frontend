import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import DrOffersLogo from '@assets/dr-offer-logo.png';
import './login.css';
import { setCurrentUser } from '@redux/slices/userSlice/userSlice';
import Swal from 'sweetalert2';

const Login = () => {
  const { t } = useTranslation();
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
        title: t('auth.loginFailed'),
        text: t('auth.invalidCredentials'),
        confirmButtonColor: '#B44C43',
      });
      console.log(err);
    }
  };

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container">
        <CRow className="justify-content-center">
          <CCol lg={10} xl={8}>
            <CCardGroup className="shadow-lg rounded-lg overflow-hidden">
              {/* Login Form Card */}
              <CCard className="p-4 border-0">
                <CCardBody className="px-5 py-4">
                  <Formik
                    validationSchema={SignInSchema}
                    initialValues={initialValues}
                    onSubmit={Login}
                    validateOnChange={false}
                    validateOnBlur={true}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="mb-4">
                          <p className="text-muted mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                            {t('auth.welcome')}
                          </p>
                          <h1 
                            className="mb-4" 
                            style={{ 
                              fontSize: '32px', 
                              fontWeight: 'bold', 
                              color: '#2d3748',
                              marginBottom: '2rem'
                            }}
                          >
                            {t('auth.signIn')}
                          </h1>
                        </div>

                        <div className="mb-3">
                          <label className="form-label text-muted mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                            {t('auth.email')}
                          </label>
                          <Field
                            name="email"
                            as={CFormInput}
                            placeholder="test@gmail.com"
                            autoComplete="email"
                            type="email"
                            className="form-control-lg border-0 shadow-sm"
                            style={{
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '16px'
                            }}
                          />
                          {errors.email && touched.email && <TextError name="email" />}
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label text-muted mb-0" style={{ fontSize: '14px', fontWeight: '500' }}>
                              {t('auth.password')}
                            </label>
                            <a 
                              href="#" 
                              className="text-decoration-none"
                              style={{ 
                                color: '#B44C43', 
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                            >
                              {t('auth.forgotPassword')}
                            </a>
                          </div>
                          <Field
                            name="password"
                            as={CFormInput}
                            type="password"
                            placeholder="••••••••••"
                            autoComplete="current-password"
                            className="form-control-lg border-0 shadow-sm"
                            style={{
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '16px'
                            }}
                          />
                          {errors.password && touched.password && <TextError name="password" />}
                        </div>

                        <CButton
                          type="submit"
                          disabled={isLoading}
                          className="w-100 border-0 text-white fw-bold py-3 mb-4"
                          style={{
                            backgroundColor: '#B44C43',
                            borderRadius: '8px',
                            fontSize: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 4px 15px rgba(180, 76, 67, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#9d3e36';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(180, 76, 67, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#B44C43';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(180, 76, 67, 0.3)';
                          }}
                        >
                          {isLoading ? t('auth.signingIn') : t('auth.signIn').toUpperCase()}
                        </CButton>

                      
                      </Form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>

              {/* Logo/Branding Card */}
              <CCard 
                className="text-white py-5 border-0 d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'linear-gradient(135deg, #B44C43 0%, #8B3A33 100%)',
                  minHeight: '500px'
                }}
              >
                <CCardBody className="text-center d-flex flex-column justify-content-center align-items-center h-100">
                  <div className="mb-4 dr-offers-logo">
                    <img
                      src={DrOffersLogo}
                      alt="Dr.Offers Logo"
                      className="img-fluid"
                      style={{
                        maxWidth: '320px',
                        width: '100%',
                        height: 'auto',
                        filter: 'brightness(1.1) contrast(1.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.filter = 'brightness(1.2) contrast(1.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.filter = 'brightness(1.1) contrast(1.1)';
                      }}
                    />
                  </div>
                  <div 
                    className="text-center mt-3"
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.85)',
                      direction: 'rtl',
                      fontFamily: 'Arial, Tahoma, sans-serif',
                      letterSpacing: '1px',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                    }}
                  >
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default Login;
