import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaCog } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <Navbar className='jf-navbar' expand='lg' collapseOnSelect sticky='top'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img
                src='/images/LOGO-2023-without-YEAR-removebg-preview.png'
                alt='JUNEFEST'
                style={{ height: '40px', marginRight: '8px' }}
              />
              JUNEFEST
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='jf-navbar-nav' />
          <Navbar.Collapse id='jf-navbar-nav'>
            <Nav className='ms-auto align-items-center'>
              <LinkContainer to='/'>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/events'>
                <Nav.Link>Events</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/bars'>
                <Nav.Link>Bars</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/shop'>
                <Nav.Link>
                  <FaShoppingCart style={{ marginRight: '4px' }} />
                  Shop
                  {cartItems.length > 0 && (
                    <Badge pill bg='danger' style={{ marginLeft: '5px', fontSize: '0.65em' }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={<><FaUser style={{ marginRight: '4px' }} />{userInfo.name}</>} id='username-dropdown'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>My Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>Sign Out</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser style={{ marginRight: '4px' }} /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={<><FaCog style={{ marginRight: '4px' }} />Admin</>}
                  id='admin-dropdown'
                >
                  <LinkContainer to='/admin'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to='/admin/carousel'>
                    <NavDropdown.Item>Carousel Images</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/bars'>
                    <NavDropdown.Item>Manage Bars</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/events'>
                    <NavDropdown.Item>Manage Events</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
