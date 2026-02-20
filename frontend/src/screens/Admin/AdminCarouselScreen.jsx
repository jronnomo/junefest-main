import { useState } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { FaArrowLeft, FaTrash, FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetAllCarouselImagesQuery,
  useAddCarouselImageMutation,
  useUpdateCarouselImageMutation,
  useDeleteCarouselImageMutation,
} from '../../slices/carouselApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';

const AdminCarouselScreen = () => {
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const { data: images, isLoading, refetch } = useGetAllCarouselImagesQuery();
  const [addImage, { isLoading: adding }] = useAddCarouselImageMutation();
  const [updateImage] = useUpdateCarouselImageMutation();
  const [deleteImage] = useDeleteCarouselImageMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadProductImageMutation();

  const uploadHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadFile(formData).unwrap();
      setUploadedUrl(res.image);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  const addHandler = async (e) => {
    e.preventDefault();
    if (!uploadedUrl) { toast.error('Please upload an image first'); return; }
    try {
      await addImage({ url: uploadedUrl, altText: altText || 'JUNEFEST photo', caption }).unwrap();
      toast.success('Image added to carousel');
      setAltText(''); setCaption(''); setUploadedUrl('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not add image');
    }
  };

  const toggleHandler = async (img) => {
    try {
      await updateImage({ id: img._id, isActive: !img.isActive }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Could not update image');
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm('Remove this image from the carousel?')) return;
    try {
      await deleteImage(id).unwrap();
      toast.success('Image removed');
      refetch();
    } catch (err) {
      toast.error('Could not delete image');
    }
  };

  return (
    <>
      <Helmet><title>JUNEFEST Admin | Carousel</title></Helmet>

      <div className='jf-admin-header'>
        <LinkContainer to='/admin'>
          <Button variant='link' style={{ color: 'var(--jf-purple)', padding: 0, marginBottom: '0.5em' }}>
            <FaArrowLeft /> Back to Dashboard
          </Button>
        </LinkContainer>
        <h1>Carousel Images</h1>
      </div>

      <Container className='pb-5'>
        {/* Upload form */}
        <Row className='mb-5'>
          <Col md={6}>
            <h5 style={{ fontFamily: 'var(--jf-font-serif)' }}>Add New Image</h5>
            <Form onSubmit={addHandler} style={{ background: 'white', padding: '1.5em', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <Form.Group className='mb-3'>
                <Form.Label>Upload Image</Form.Label>
                <div className='jf-upload-zone' onClick={() => document.getElementById('carousel-upload').click()}>
                  <FaUpload size={24} style={{ color: 'var(--jf-coral)', marginBottom: '0.5em' }} />
                  <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--jf-muted)' }}>
                    {uploading ? 'Uploading…' : uploadedUrl ? '✅ Image ready' : 'Click to upload photo'}
                  </p>
                </div>
                <input
                  id='carousel-upload'
                  type='file'
                  accept='image/*'
                  onChange={uploadHandler}
                  style={{ display: 'none' }}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Alt Text</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Describe the photo (accessibility)'
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Caption (optional)</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Caption shown on carousel'
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </Form.Group>
              <Button type='submit' className='btn-jf-coral' disabled={adding || uploading}>
                {adding ? 'Adding…' : 'Add to Carousel'}
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Current images */}
        <h5 style={{ fontFamily: 'var(--jf-font-serif)' }}>Current Images ({images?.length || 0})</h5>
        {isLoading ? (
          <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
        ) : images?.length === 0 ? (
          <Alert variant='info'>No carousel images yet. Upload one above!</Alert>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {images?.map((img) => (
              <div key={img._id} className='jf-img-thumbnail-wrap' style={{ opacity: img.isActive ? 1 : 0.45 }}>
                <img src={img.url} alt={img.altText} />
                {!img.isActive && (
                  <Badge bg='secondary' style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '0.65em' }}>
                    Hidden
                  </Badge>
                )}
                <div style={{ position: 'absolute', top: '4px', left: '4px', display: 'flex', gap: '4px' }}>
                  <button
                    className='jf-delete-btn'
                    onClick={() => toggleHandler(img)}
                    title={img.isActive ? 'Hide' : 'Show'}
                    style={{ background: img.isActive ? 'var(--jf-forest)' : 'var(--jf-muted)' }}
                  >
                    {img.isActive ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                  </button>
                </div>
                <button className='jf-delete-btn' onClick={() => deleteHandler(img._id)} title='Delete'>
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default AdminCarouselScreen;
