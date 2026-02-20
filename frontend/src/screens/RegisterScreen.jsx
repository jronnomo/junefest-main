import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Welcome to JUNEFEST! 🌺');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>JUNEFEST | Join</title>
      </Helmet>
      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <h1>Join JUNEFEST 🌺</h1>
          <p style={{ fontFamily: 'var(--jf-font-sans)', color: 'var(--jf-forest)' }}>
            Create your account to RSVP for events and shop merchandise
          </p>
        </div>
      </div>
      <Container className='py-5'>
        <Row className='justify-content-center'>
          <Col xs={12} sm={10} md={8} lg={5}>
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2em',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                border: '2px solid var(--jf-green-solid)',
              }}
            >
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-3'>
                  <Form.Label style={{ fontWeight: 600 }}>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='email' className='my-3'>
                  <Form.Label style={{ fontWeight: 600 }}>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='password' className='my-3'>
                  <Form.Label style={{ fontWeight: 600 }}>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Create a password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='confirmPassword' className='my-3'>
                  <Form.Label style={{ fontWeight: 600 }}>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Repeat your password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  type='submit'
                  className='btn-jf-coral w-100 mt-2'
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account…' : 'Create Account'}
                </Button>
                {isLoading && <Loader />}
              </Form>
              <Row className='mt-3 text-center'>
                <Col>
                  <small>
                    Already have an account?{' '}
                    <Link
                      to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
                      style={{ color: 'var(--jf-coral)' }}
                    >
                      Sign In
                    </Link>
                  </small>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterScreen;
