import { Container, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetAllBarsQuery, useCreateBarMutation, useDeleteBarMutation } from '../../slices/barsApiSlice';

const AdminBarsScreen = () => {
  const navigate = useNavigate();
  const { data: bars, isLoading, refetch } = useGetAllBarsQuery();
  const [createBar, { isLoading: creating }] = useCreateBarMutation();
  const [deleteBar] = useDeleteBarMutation();

  const createHandler = async () => {
    try {
      const newBar = await createBar({
        name: 'New Bar',
        order: (bars?.length || 0) + 1,
        description: 'Add description here',
      }).unwrap();
      navigate(`/admin/bars/${newBar._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || 'Could not create bar');
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('Delete this bar?')) return;
    try {
      await deleteBar(id).unwrap();
      toast.success('Bar deleted');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not delete bar');
    }
  };

  return (
    <>
      <Helmet><title>JUNEFEST Admin | Bars</title></Helmet>

      <div className='jf-admin-header'>
        <LinkContainer to='/admin'>
          <Button variant='link' style={{ color: 'var(--jf-purple)', padding: 0, marginBottom: '0.5em' }}>
            <FaArrowLeft /> Back to Dashboard
          </Button>
        </LinkContainer>
        <div className='d-flex justify-content-between align-items-center'>
          <h1 style={{ margin: 0 }}>Manage Bars</h1>
          <Button className='btn-jf-coral' onClick={createHandler} disabled={creating}>
            <FaPlus /> {creating ? 'Creating…' : 'Add Bar'}
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
                <th>#</th>
                <th>Name</th>
                <th>Featured Drink</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bars?.map((bar) => (
                <tr key={bar._id}>
                  <td>{bar.order}</td>
                  <td>
                    <strong>{bar.name}</strong>
                    {bar.address && <div style={{ fontSize: '0.8em', color: 'var(--jf-muted)' }}>{bar.address}</div>}
                  </td>
                  <td>{bar.featuredDrink || '—'}</td>
                  <td>
                    <Badge bg={bar.isActive ? 'success' : 'secondary'}>
                      {bar.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/bars/${bar._id}/edit`}>
                      <Button size='sm' variant='outline-secondary' className='me-2'>
                        <FaEdit /> Edit
                      </Button>
                    </LinkContainer>
                    <Button
                      size='sm'
                      variant='outline-danger'
                      onClick={() => deleteHandler(bar._id)}
                    >
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

export default AdminBarsScreen;
