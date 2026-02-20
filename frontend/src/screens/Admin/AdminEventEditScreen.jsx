import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { FaArrowLeft, FaUpload, FaTrash, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useAddEventPhotoMutation,
  useRemoveEventPhotoMutation,
  useGetEventRsvpsQuery,
} from '../../slices/eventsApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';

const AdminEventEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, refetch } = useGetEventByIdQuery(id);
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  const [addPhoto, { isLoading: addingPhoto }] = useAddEventPhotoMutation();
  const [removePhoto] = useRemoveEventPhotoMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadProductImageMutation();
  const { data: rsvps } = useGetEventRsvpsQuery(id);

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('other');
  const [year, setYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setEventType(event.eventType);
      setYear(event.year);
      setDate(event.date ? event.date.substring(0, 16) : '');
      setLocation(event.location || '');
      setDescription(event.description);
      setIsActive(event.isActive);
    }
  }, [event]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateEvent({ id, title, eventType, year: Number(year), date, location, description, isActive }).unwrap();
      toast.success('Event updated!');
      navigate('/admin/events');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const uploadPhotoHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadFile(formData).unwrap();
      setNewPhotoUrl(res.image);
      toast.success('Photo uploaded — add caption and click Add Photo');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const addPhotoHandler = async () => {
    if (!newPhotoUrl) { toast.error('Upload a photo first'); return; }
    try {
      await addPhoto({ id, url: newPhotoUrl, caption: newPhotoCaption }).unwrap();
      toast.success('Photo added');
      setNewPhotoUrl(''); setNewPhotoCaption('');
      refetch();
    } catch (err) {
      toast.error('Could not add photo');
    }
  };

  const removePhotoHandler = async (photoId) => {
    if (!window.confirm('Remove this photo?')) return;
    try {
      await removePhoto({ eventId: id, photoId }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Could not remove photo');
    }
  };

  if (isLoading) return <div className='text-center py-5'><Spinner animation='border' style={{ color: 'var(--jf-coral)' }} /></div>;

  return (
    <>
      <Helmet><title>JUNEFEST Admin | Edit Event</title></Helmet>
      <div className='jf-admin-header'>
        <LinkContainer to='/admin/events'>
          <Button variant='link' style={{ color: 'var(--jf-purple)', padding: 0, marginBottom: '0.5em' }}>
            <FaArrowLeft /> Back to Events
          </Button>
        </LinkContainer>
        <h1>Edit: {event?.title}</h1>
      </div>

      <Container className='pb-5'>
        <Row className='g-4'>
          {/* Event details form */}
          <Col md={7}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5em', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h5 style={{ fontFamily: 'var(--jf-font-serif)' }}>Event Details</h5>
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={8}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Event Title</Form.Label>
                      <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Type</Form.Label>
                      <Form.Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value='bar-crawl'>🍺 Bar Crawl</option>
                        <option value='golf'>⛳ Golf</option>
                        <option value='happy-hour'>🍹 Happy Hour</option>
                        <option value='other'>🌺 Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Date & Time</Form.Label>
                      <Form.Control type='datetime-local' value={date} onChange={(e) => setDate(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Year</Form.Label>
                      <Form.Control type='number' value={year} onChange={(e) => setYear(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3 mt-4'>
                      <Form.Check
                        type='switch'
                        label={isActive ? 'Active' : 'Hidden'}
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className='mb-3'>
                  <Form.Label>Location</Form.Label>
                  <Form.Control placeholder='Venue / Address' value={location} onChange={(e) => setLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control as='textarea' rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>
                <Button type='submit' className='btn-jf-coral' disabled={updating}>
                  {updating ? 'Saving…' : 'Save Event'}
                </Button>
              </Form>
            </div>
          </Col>

          {/* Photos + RSVPs */}
          <Col md={5}>
            {/* Photo upload */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5em', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1em' }}>
              <h5 style={{ fontFamily: 'var(--jf-font-serif)' }}>Event Photos ({event?.photos?.length || 0})</h5>
              <div className='jf-upload-zone mb-2' onClick={() => document.getElementById('event-photo-upload').click()}>
                <FaUpload style={{ color: 'var(--jf-coral)' }} />
                <p style={{ margin: '4px 0 0', fontSize: '0.85em', color: 'var(--jf-muted)' }}>
                  {uploading ? 'Uploading…' : newPhotoUrl ? '✅ Photo ready' : 'Click to upload photo'}
                </p>
              </div>
              <input id='event-photo-upload' type='file' accept='image/*' style={{ display: 'none' }} onChange={uploadPhotoHandler} />
              <Form.Control
                className='mb-2'
                placeholder='Caption (optional)'
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
              />
              <Button className='btn-jf-coral w-100 mb-3' onClick={addPhotoHandler} disabled={addingPhoto}>
                {addingPhoto ? 'Adding…' : 'Add Photo'}
              </Button>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {event?.photos?.map((photo) => (
                  <div key={photo._id} className='jf-img-thumbnail-wrap'>
                    <img src={photo.url} alt={photo.caption || 'Event photo'} />
                    <button className='jf-delete-btn' onClick={() => removePhotoHandler(photo._id)}>
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RSVPs */}
            <div style={{ background: 'var(--jf-green-solid)', borderRadius: '12px', padding: '1.5em' }}>
              <h5 style={{ fontFamily: 'var(--jf-font-serif)' }}>
                <FaUsers style={{ marginRight: '6px' }} />
                RSVPs ({rsvps?.length || 0})
              </h5>
              {rsvps?.length === 0 ? (
                <p style={{ fontSize: '0.85em', color: 'var(--jf-muted)' }}>No RSVPs yet</p>
              ) : (
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {rsvps?.map((r) => (
                    <div key={r._id} style={{ fontSize: '0.85em', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <strong>{r.user?.name || 'User'}</strong>
                      <span style={{ color: 'var(--jf-muted)', marginLeft: '6px' }}>{r.user?.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminEventEditScreen;
