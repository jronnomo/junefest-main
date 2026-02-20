import { Container, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetAllEventsQuery, useCreateEventMutation, useDeleteEventMutation } from '../../slices/eventsApiSlice';

const AdminEventsScreen = () => {
  const navigate = useNavigate();
  const { data: events, isLoading, refetch } = useGetAllEventsQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const createHandler = async () => {
    try {
      const newEvent = await createEvent({
        title: 'New Event',
        eventType: 'other',
        year: new Date().getFullYear(),
        date: new Date().toISOString(),
        description: 'Add event description here',
        isActive: false,
      }).unwrap();
      navigate(`/admin/events/${newEvent._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || 'Could not create event');
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id).unwrap();
      toast.success('Event deleted');
      refetch();
    } catch (err) {
      toast.error('Could not delete event');
    }
  };

  const eventTypeLabel = { 'bar-crawl': '🍺', 'golf': '⛳', 'happy-hour': '🍹', 'other': '🌺' };

  return (
    <>
      <Helmet><title>JUNEFEST Admin | Events</title></Helmet>
      <div className='jf-admin-header'>
        <LinkContainer to='/admin'>
          <Button variant='link' style={{ color: 'var(--jf-purple)', padding: 0, marginBottom: '0.5em' }}>
            <FaArrowLeft /> Back to Dashboard
          </Button>
        </LinkContainer>
        <div className='d-flex justify-content-between align-items-center'>
          <h1 style={{ margin: 0 }}>Manage Events</h1>
          <Button className='btn-jf-coral' onClick={createHandler} disabled={creating}>
            <FaPlus /> {creating ? 'Creating…' : 'Add Event'}
          </Button>
        </div>
      </div>

      <Container className='pb-5'>
        {isLoading ? (
          <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date</th>
                <th>RSVPs</th>
                <th>Photos</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events?.map((event) => (
                <tr key={event._id}>
                  <td>{eventTypeLabel[event.eventType] || '🌺'}</td>
                  <td><strong>{event.title}</strong></td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <FaUsers style={{ marginRight: '4px', color: 'var(--jf-muted)' }} />
                    {event.rsvps?.length || 0}
                  </td>
                  <td>{event.photos?.length || 0}</td>
                  <td>
                    <Badge bg={event.isActive ? 'success' : 'secondary'}>
                      {event.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/events/${event._id}/edit`}>
                      <Button size='sm' variant='outline-secondary' className='me-2'>
                        <FaEdit /> Edit
                      </Button>
                    </LinkContainer>
                    <Button size='sm' variant='outline-danger' onClick={() => deleteHandler(event._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default AdminEventsScreen;
