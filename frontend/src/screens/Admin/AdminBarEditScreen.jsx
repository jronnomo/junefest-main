import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetBarByIdQuery, useUpdateBarMutation } from '../../slices/barsApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';

const AdminBarEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bar, isLoading } = useGetBarByIdQuery(id);
  const [updateBar, { isLoading: updating }] = useUpdateBarMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadProductImageMutation();

  const [name, setName] = useState('');
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [featuredDrink, setFeaturedDrink] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (bar) {
      setName(bar.name);
      setOrder(bar.order);
      setImage(bar.image);
      setDescription(bar.description);
      setWebsite(bar.website || '');
      setFeaturedDrink(bar.featuredDrink || '');
      setAddress(bar.address || '');
      setIsActive(bar.isActive);
    }
  }, [bar]);

  const uploadHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadFile(formData).unwrap();
      setImage(res.image);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateBar({ id, name, order: Number(order), image, description, website, featuredDrink, address, isActive }).unwrap();
      toast.success('Bar updated!');
      navigate('/admin/bars');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) return <div className='text-center py-5'><Spinner animation='border' style={{ color: 'var(--jf-coral)' }} /></div>;

  return (
    <>
      <Helmet><title>JUNEFEST Admin | Edit Bar</title></Helmet>
      <div className='jf-admin-header'>
        <LinkContainer to='/admin/bars'>
          <Button variant='link' style={{ color: 'var(--jf-purple)', padding: 0, marginBottom: '0.5em' }}>
            <FaArrowLeft /> Back to Bars
          </Button>
        </LinkContainer>
        <h1>Edit Bar: {bar?.name}</h1>
      </div>

      <Container className='pb-5'>
        <Row className='justify-content-center'>
          <Col md={8}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2em', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Bar Name</Form.Label>
                      <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Stop Order</Form.Label>
                      <Form.Control type='number' min={1} value={order} onChange={(e) => setOrder(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3 mt-4'>
                      <Form.Check
                        type='switch'
                        label={isActive ? 'Active (visible)' : 'Hidden'}
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className='mb-3'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control as='textarea' rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Website URL</Form.Label>
                      <Form.Control type='url' placeholder='https://…' value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Featured Drink</Form.Label>
                      <Form.Control placeholder='e.g. Electric Shark' value={featuredDrink} onChange={(e) => setFeaturedDrink(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className='mb-3'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control placeholder='Street, City, State' value={address} onChange={(e) => setAddress(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Bar Image</Form.Label>
                  {image && (
                    <div className='mb-2'>
                      <img src={image} alt='Bar' style={{ height: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className='jf-upload-zone' onClick={() => document.getElementById('bar-img-upload').click()}>
                    <FaUpload style={{ color: 'var(--jf-coral)' }} />
                    <p style={{ margin: '4px 0 0', fontSize: '0.9em', color: 'var(--jf-muted)' }}>
                      {uploading ? 'Uploading…' : 'Click to change image'}
                    </p>
                  </div>
                  <input id='bar-img-upload' type='file' accept='image/*' style={{ display: 'none' }} onChange={uploadHandler} />
                </Form.Group>
                <Button type='submit' className='btn-jf-coral' disabled={updating}>
                  {updating ? 'Saving…' : 'Save Bar'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminBarEditScreen;
