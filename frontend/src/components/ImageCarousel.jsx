import { Carousel, Spinner } from 'react-bootstrap';
import { useGetCarouselImagesQuery } from '../slices/carouselApiSlice';

const ImageCarousel = () => {
  const { data: images, isLoading, isError } = useGetCarouselImagesQuery();

  if (isLoading) {
    return (
      <div className='text-center py-4'>
        <Spinner animation='border' style={{ color: 'var(--jf-coral)' }} />
      </div>
    );
  }

  // Graceful fallback — show static images from public folder if no DB images
  if (isError || !images || images.length === 0) {
    const fallback = Array.from({ length: 15 }, (_, i) => ({
      _id: i,
      url: `/images/tempCarousel/AllPics/IMG_00${33 + i}.JPG`,
      altText: 'JUNEFEST photo',
      caption: '',
    }));
    return <CarouselDisplay images={fallback} />;
  }

  return <CarouselDisplay images={images} />;
};

const CarouselDisplay = ({ images }) => (
  <section className='jf-carousel-section'>
    <Carousel className='jf-carousel' interval={3500} fade>
      {images.map((img) => (
        <Carousel.Item key={img._id}>
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
          <img
            className='d-block w-100'
            src={img.url}
            alt={img.altText || 'JUNEFEST photo'}
            style={{ height: '500px', objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          </div>
          {img.caption && (
            <Carousel.Caption>
              <p>{img.caption}</p>
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  </section>
);

export default ImageCarousel;
