import { Container, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import {
  FaImages,
  FaBeer,
  FaCalendarAlt,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
} from 'react-icons/fa';

const adminSections = [
  {
    title: 'Carousel Images',
    description: 'Upload and manage homepage carousel photos',
    icon: <FaImages size={32} />,
    link: '/admin/carousel',
    color: 'var(--jf-coral)',
  },
  {
    title: 'Manage Bars',
    description: 'Edit bar listings, descriptions, and images',
    icon: <FaBeer size={32} />,
    link: '/admin/bars',
    color: 'var(--jf-forest)',
  },
  {
    title: 'Manage Events',
    description: 'Create events, upload photos, view RSVPs',
    icon: <FaCalendarAlt size={32} />,
    link: '/admin/events',
    color: 'var(--jf-orange)',
  },
  {
    title: 'Products',
    description: 'Manage shop products and inventory',
    icon: <FaBoxOpen size={32} />,
    link: '/admin/productlist',
    color: '#6c757d',
  },
  {
    title: 'Orders',
    description: 'View and fulfill customer orders',
    icon: <FaClipboardList size={32} />,
    link: '/admin/orderlist',
    color: 'var(--jf-purple)',
  },
  {
    title: 'Users',
    description: 'View and manage registered users',
    icon: <FaUsers size={32} />,
    link: '/admin/userlist',
    color: 'var(--jf-coral-dark)',
  },
];

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>JUNEFEST | Admin</title>
      </Helmet>

      <div className='jf-admin-header'>
        <h1>Admin Dashboard</h1>
        <p style={{ margin: 0, color: 'var(--jf-muted)' }}>
          Manage all JUNEFEST content from one place
        </p>
      </div>

      <Container className='pb-5'>
        <Row className='g-4'>
          {adminSections.map((section) => (
            <Col key={section.title} xs={12} sm={6} lg={4}>
              <LinkContainer to={section.link} style={{ cursor: 'pointer' }}>
                <Card
                  className='h-100'
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    transition: 'transform 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <Card.Body className='d-flex align-items-center gap-3 p-3'>
                    <div
                      style={{
                        color: section.color,
                        background: `${section.color}18`,
                        borderRadius: '10px',
                        padding: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <Card.Title style={{ marginBottom: '0.2em', fontFamily: 'var(--jf-font-serif)', fontSize: '1.1em' }}>
                        {section.title}
                      </Card.Title>
                      <Card.Text style={{ margin: 0, fontSize: '0.85em', color: 'var(--jf-muted)' }}>
                        {section.description}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </LinkContainer>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
