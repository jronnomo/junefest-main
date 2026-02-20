import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useGetSettingsQuery } from '../slices/settingsApiSlice';
import CountdownTimer from '../components/CountdownTimer';
import ImageCarousel from '../components/ImageCarousel';

const team = [
  { name: 'Josh Simmons', title: 'Co-founder, COO', img: '/images/JoshSimmons.jpeg' },
  { name: 'Jake Murphy', title: 'Co-founder, CCO', img: '/images/JakeMurphyEdit.jpeg' },
  { name: 'Jerry Ronnau', title: 'VP of Web Development', img: '/images/webdev.jpg' },
  { name: 'Haley Barbour', title: 'VP of Merchandise', img: '/images/0E175FC2-8EAC-4C7B-9D9E-F81A9549F406.jpg' },
  { name: 'Janice Levenson', title: 'VP of Graphic Design', img: '/images/Janice-PICx500.jpg' },
];

const HomeScreen = () => {
  const { data: settings } = useGetSettingsQuery();
  const countdownDate = settings?.junefestDate || null;
  const countdownLabel = settings?.junefestLabel || 'JUNEFEST';

  return (
    <>
      <Helmet>
        <title>JUNEFEST</title>
      </Helmet>

      {/* Hero */}
      <div className='jf-hero'>
        <div className='jf-hero-content'>
          <img
            src='/images/LOGO-2023-without-YEAR-removebg-preview.png'
            alt='JUNEFEST Logo'
            className='jf-hero-logo'
          />
          <hr style={{ borderColor: 'rgba(12,79,0,0.3)', width: '60%', margin: '1em auto' }} />
          {countdownDate ? (
            <>
              <h2 style={{ color: 'var(--jf-forest)', fontFamily: 'var(--jf-font-serif)' }}>
                {countdownLabel} —{' '}
                {new Date(countdownDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </h2>
              <CountdownTimer targetDate={countdownDate} />
            </>
          ) : (
            <p style={{ color: 'var(--jf-forest)', fontSize: '1.1em' }}>
              Stay tuned for the next JUNEFEST date announcement!
            </p>
          )}
          <div className='mt-3'>
            <LinkContainer to='/register'>
              <Button className='btn-jf-coral me-2'>Join JUNEFEST</Button>
            </LinkContainer>
            <LinkContainer to='/events'>
              <Button variant='outline-success'>View Events</Button>
            </LinkContainer>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <ImageCarousel />

      {/* About */}
      <Container className='py-5'>
        <Row className='justify-content-center text-center mb-5'>
          <Col md={8}>
            <h2 className='jf-section-title'>Welcome to JUNEFEST</h2>
            <p style={{ fontSize: '1.1em', color: 'var(--jf-muted)' }}>
              The only bar crawl for the people, by the people, of the people. Born in 2019 in
              Northern Virginia, JUNEFEST is an annual summer tradition that brings together great
              people, great bars, and unforgettable memories. Grab your Hawaiian shirt and join us.
            </p>
          </Col>
        </Row>

        <hr className='jf-divider' />

        {/* Bar map */}
        <Row className='align-items-center my-5'>
          <Col md={6} className='text-center mb-4 mb-md-0'>
            <img
              src='/images/barcrawlmap2.PNG'
              alt='JUNEFEST Bar Crawl Map'
              style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            />
          </Col>
          <Col md={6}>
            <h2 className='jf-section-title'>The Route</h2>
            <p style={{ color: 'var(--jf-muted)' }}>
              Five legendary bars in Clarendon, Arlington, VA. Start at Arlington Rooftop, wind
              through the best spots in Northern Virginia, and finish at The Lot. One afternoon, one
              legendary bar crawl.
            </p>
            <LinkContainer to='/bars'>
              <Button className='btn-jf-coral mt-2'>View All Bars →</Button>
            </LinkContainer>
          </Col>
        </Row>

        <hr className='jf-divider' />

        {/* Team */}
        <Row className='text-center mt-5'>
          <Col>
            <h2 className='jf-section-title'>Shoutouts!</h2>
            <p style={{ color: 'var(--jf-muted)', marginBottom: '2em' }}>
              The crew that makes JUNEFEST happen every year.
            </p>
          </Col>
        </Row>
        <Row className='justify-content-center g-4 pb-4'>
          {team.map((member) => (
            <Col key={member.name} xs={6} sm={4} md={3} lg={2} className='text-center'>
              <img
                src={member.img}
                alt={member.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '3px solid var(--jf-coral)',
                  marginBottom: '0.5em',
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p style={{ margin: 0, fontWeight: 600, fontFamily: 'var(--jf-font-serif)', fontSize: '0.95em' }}>
                {member.name}
              </p>
              <p style={{ margin: 0, fontSize: '0.78em', color: 'var(--jf-muted)' }}>{member.title}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
