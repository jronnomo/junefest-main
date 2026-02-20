import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { useGetEventByIdQuery, useRsvpEventMutation, useCancelRsvpMutation } from '../slices/eventsApiSlice';
import { toast } from 'react-toastify';

const eventTypeLabel = {
  'bar-crawl': '🍺 Bar Crawl',
  'golf': '⛳ Golf',
  'happy-hour': '🍹 Happy Hour',
  'other': '🌺 Event',
};

const EventDetailScreen = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: event, isLoading, isError, refetch } = useGetEventByIdQuery(id);
  const [rsvpEvent, { isLoading: rsvping }] = useRsvpEventMutation();
  const [cancelRsvp, { isLoading: cancelling }] = useCancelRsvpMutation();

  const hasRsvpd = userInfo
    ? event?.rsvps?.some((r) => r.user === userInfo._id || r.user?._id === userInfo._id)
    : false;

  const handleRsvp = async () => {
    if (!userInfo) return;
    try {
      await rsvpEvent(id).unwrap();
      toast.success('RSVP confirmed! See you there 🌺');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not RSVP');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRsvp(id).unwrap();
      toast.info('RSVP cancelled');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not cancel RSVP');
    }
  };

  if (isLoading) {
    return (
      <div className='text-center py-5'>
        <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Container className='py-5'>
        <Alert variant='warning'>Event not found.</Alert>
      </Container>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <>
      <Helmet>
        <title>JUNEFEST | {event.title}</title>
      </Helmet>

      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <Badge style={{ background: 'var(--jf-coral)', fontSize: '0.9em', marginBottom: '0.5em' }}>
            {eventTypeLabel[event.eventType]}
          </Badge>
          <h1>{event.title}</h1>
          <p style={{ color: 'var(--jf-forest)', fontFamily: 'var(--jf-font-sans)' }}>
            📅 {formattedDate}
            {event.location && <span> &nbsp;·&nbsp; 📍 {event.location}</span>}
          </p>
        </div>
      </div>

      <Container className='py-5'>
        <Row>
          <Col md={8}>
            <h2 className='jf-section-title'>About This Event</h2>
            <p style={{ color: 'var(--jf-muted)', lineHeight: 1.8 }}>{event.description}</p>

            {event.photos?.length > 0 && (
              <>
                <h4 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)', marginTop: '2em' }}>
                  Photos
                </h4>
                <Row className='g-2'>
                  {event.photos.map((photo) => (
                    <Col xs={6} md={4} key={photo._id}>
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Event photo'}
                        style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      {photo.caption && (
                        <p style={{ fontSize: '0.8em', color: 'var(--jf-muted)', marginTop: '4px' }}>
                          {photo.caption}
                        </p>
                      )}
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>

          <Col md={4}>
            <div
              style={{
                background: 'var(--jf-green-solid)',
                borderRadius: '12px',
                padding: '1.5em',
                border: '2px solid rgba(189,242,212,0.8)',
              }}
            >
              <h5 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
                Event Details
              </h5>
              <p style={{ fontSize: '0.9em' }}>
                <strong>Date:</strong> {formattedDate}
              </p>
              {event.location && (
                <p style={{ fontSize: '0.9em' }}>
                  <strong>Location:</strong> {event.location}
                </p>
              )}
              <p style={{ fontSize: '0.9em' }}>
                <strong>Going:</strong> {event.rsvps?.length || 0} people
              </p>

              <hr />

              {userInfo ? (
                hasRsvpd ? (
                  <>
                    <p style={{ color: 'var(--jf-forest)', fontWeight: 600 }}>✅ You&apos;re going!</p>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? 'Cancelling…' : 'Cancel RSVP'}
                    </Button>
                  </>
                ) : (
                  <Button
                    className='btn-jf-coral w-100'
                    onClick={handleRsvp}
                    disabled={rsvping}
                  >
                    {rsvping ? 'Sending RSVP…' : "RSVP — I'm Going! 🌺"}
                  </Button>
                )
              ) : (
                <>
                  <p style={{ fontSize: '0.9em', color: 'var(--jf-muted)' }}>
                    Sign in to RSVP for this event.
                  </p>
                  <LinkContainer to='/login'>
                    <Button className='btn-jf-coral w-100'>Sign In to RSVP</Button>
                  </LinkContainer>
                </>
              )}
            </div>
          </Col>
        </Row>

        <LinkContainer to='/events'>
          <Button variant='link' style={{ color: 'var(--jf-coral)', marginTop: '2em' }}>
            ← Back to Events
          </Button>
        </LinkContainer>
      </Container>
    </>
  );
};

export default EventDetailScreen;
