import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetEventsQuery } from '../slices/eventsApiSlice';
import { FaTimes, FaCheck } from 'react-icons/fa';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetMyOrdersQuery();
  const { data: events } = useGetEventsQuery();

  // Events this user has RSVP'd to
  const myRsvps = events?.filter((e) =>
    e.rsvps?.some((r) => r.user === userInfo._id || r.user?._id === userInfo._id)
  );

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success('Profile updated!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>JUNEFEST | My Profile</title>
      </Helmet>
      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <h1>My Profile</h1>
        </div>
      </div>

      <Container className='py-4'>
        <Row className='g-4'>
          {/* Edit profile */}
          <Col md={4} lg={3}>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5em',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '2px solid var(--jf-green-solid)',
              }}
            >
              <h5 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
                Edit Profile
              </h5>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='email' className='my-2'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='password' className='my-2'>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Leave blank to keep current'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='confirmPassword' className='my-2'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Button type='submit' className='btn-jf-coral w-100 mt-2' disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'Saving…' : 'Save Changes'}
                </Button>
              </Form>
            </div>

            {/* My RSVPs */}
            {myRsvps?.length > 0 && (
              <div
                style={{
                  background: 'var(--jf-green-solid)',
                  borderRadius: '12px',
                  padding: '1.5em',
                  marginTop: '1em',
                }}
              >
                <h5 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
                  My Events
                </h5>
                {myRsvps.map((event) => (
                  <LinkContainer key={event._id} to={`/events/${event._id}`}>
                    <div
                      style={{
                        cursor: 'pointer',
                        padding: '0.5em 0',
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        fontSize: '0.9em',
                      }}
                    >
                      <strong>{event.title}</strong>
                      <br />
                      <span style={{ color: 'var(--jf-muted)' }}>
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <Badge bg='success' style={{ marginLeft: '6px', fontSize: '0.7em' }}>
                        Going ✓
                      </Badge>
                    </div>
                  </LinkContainer>
                ))}
              </div>
            )}
          </Col>

          {/* Orders */}
          <Col md={8} lg={9}>
            <h5 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
              My Orders
            </h5>
            {loadingOrders ? (
              <Loader />
            ) : ordersError ? (
              <Message variant='danger'>{ordersError?.data?.message || ordersError.error}</Message>
            ) : orders?.length === 0 ? (
              <Message variant='info'>No orders yet. <a href='/shop' style={{ color: 'var(--jf-coral)' }}>Visit the shop!</a></Message>
            ) : (
              <Table striped hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          <FaCheck style={{ color: 'var(--jf-forest)' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <FaCheck style={{ color: 'var(--jf-forest)' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/orders/${order._id}`}>
                          <Button size='sm' variant='outline-secondary'>Details</Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileScreen;
