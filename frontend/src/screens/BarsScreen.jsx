import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useGetBarsQuery } from '../slices/barsApiSlice';

const BarCard = ({ bar }) => (
  <Col md={6} lg={4} className='mb-4'>
    <Card className='jf-bar-card h-100'>
      {bar.image && (
        <Card.Img
          variant='top'
          src={bar.image}
          alt={bar.name}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <Card.Body className='d-flex flex-column'>
        <Card.Title style={{ fontFamily: 'var(--jf-font-serif)' }}>
          <span className='jf-bar-order'>{bar.order}</span>
          {bar.name}
        </Card.Title>
        {bar.featuredDrink && (
          <p className='mb-2'>
            <span className='jf-featured-drink'>🍹 {bar.featuredDrink}</span>
          </p>
        )}
        <Card.Text style={{ color: 'var(--jf-muted)', flexGrow: 1 }}>
          {bar.description}
        </Card.Text>
        {bar.website && (
          <Button
            href={bar.website}
            target='_blank'
            rel='noreferrer'
            className='btn-jf-coral mt-2 align-self-start'
            size='sm'
          >
            Visit Website →
          </Button>
        )}
      </Card.Body>
    </Card>
  </Col>
);

const BarsScreen = () => {
  const { data: bars, isLoading, isError } = useGetBarsQuery();

  return (
    <>
      <Helmet>
        <title>JUNEFEST | Bars</title>
      </Helmet>

      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <h1>The Bars 🍺</h1>
          <p style={{ fontFamily: 'var(--jf-font-sans)', color: 'var(--jf-forest)' }}>
            Five legendary stops. One unforgettable crawl.
          </p>
        </div>
      </div>

      <Container className='py-5'>
        {isLoading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
          </div>
        ) : isError ? (
          <Alert variant='warning'>Could not load bars. Please try again later.</Alert>
        ) : (
          <>
            <Row className='mb-4 text-center'>
              <Col>
                <p style={{ color: 'var(--jf-muted)', fontSize: '1.1em' }}>
                  Follow the route in order for the full JUNEFEST experience. Numbers indicate the
                  recommended stop order.
                </p>
              </Col>
            </Row>
            <Row>
              {bars?.map((bar) => (
                <BarCard key={bar._id} bar={bar} />
              ))}
            </Row>

            <hr className='jf-divider' />

            <Row className='text-center'>
              <Col>
                <h4 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
                  The Map
                </h4>
                <img
                  src='/images/barcrawlmap2.PNG'
                  alt='JUNEFEST Bar Crawl Map'
                  style={{
                    maxWidth: '600px',
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    marginTop: '1em',
                  }}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default BarsScreen;
