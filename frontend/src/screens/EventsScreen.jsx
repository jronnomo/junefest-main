import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetEventsQuery } from '../slices/eventsApiSlice';

const eventTypeLabel = {
  'bar-crawl': '🍺 Bar Crawl',
  'golf': '⛳ Golf',
  'happy-hour': '🍹 Happy Hour',
  'other': '🌺 Event',
};

const EventCard = ({ event }) => {
  const coverPhoto = event.photos?.[0];
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Col md={6} lg={4} className='mb-4'>
      <Card className='jf-event-card h-100'>
        {coverPhoto ? (
          <Card.Img
            variant='top'
            src={coverPhoto.url}
            alt={event.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              height: '200px',
              background: 'linear-gradient(135deg, var(--jf-green-solid), var(--jf-coral) 200%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3em',
            }}
          >
            🌺
          </div>
        )}
        <Card.Body className='d-flex flex-column'>
          <div className='mb-2'>
            <span className='jf-event-badge'>
              {eventTypeLabel[event.eventType] || '🌺 Event'}
            </span>
          </div>
          <Card.Title style={{ fontFamily: 'var(--jf-font-serif)' }}>{event.title}</Card.Title>
          <p style={{ fontSize: '0.85em', color: 'var(--jf-coral-dark)', fontWeight: 600 }}>
            📅 {formattedDate}
          </p>
          {event.location && (
            <p style={{ fontSize: '0.85em', color: 'var(--jf-muted)' }}>📍 {event.location}</p>
          )}
          <p style={{ color: 'var(--jf-muted)', flexGrow: 1, fontSize: '0.9em' }}>
            {event.description?.slice(0, 120)}
            {event.description?.length > 120 ? '…' : ''}
          </p>
          <div className='d-flex justify-content-between align-items-center mt-2'>
            <span className='jf-rsvp-count'>
              👥 {event.rsvps?.length || 0} going
            </span>
            <LinkContainer to={`/events/${event._id}`}>
              <Button className='btn-jf-coral' size='sm'>Details & RSVP</Button>
            </LinkContainer>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const EventsScreen = () => {
  const { data: events, isLoading, isError } = useGetEventsQuery();

  return (
    <>
      <Helmet>
        <title>JUNEFEST | Events</title>
      </Helmet>

      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <h1>Events 🌺</h1>
          <p style={{ fontFamily: 'var(--jf-font-sans)', color: 'var(--jf-forest)' }}>
            Bar crawls, golf tournaments, happy hours — all the JUNEFEST gatherings.
          </p>
        </div>
      </div>

      <Container className='py-5'>
        {isLoading ? (
          <div className='text-center py-5'>
            <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
          </div>
        ) : isError ? (
          <Alert variant='warning'>Could not load events. Please try again later.</Alert>
        ) : events?.length === 0 ? (
          <Alert variant='info' className='text-center'>
            No events posted yet — check back soon! 🌺
          </Alert>
        ) : (
          <Row>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default EventsScreen;
