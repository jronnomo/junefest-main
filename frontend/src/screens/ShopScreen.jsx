import { Row, Col, Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Product from '../components/Product';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import SearchBox from '../components/SearchBox';

const ShopScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });

  return (
    <>
      <Helmet>
        <title>JUNEFEST | Shop</title>
      </Helmet>

      <div className='jf-page-header'>
        <div className='jf-header-content'>
          <h1>🛍️ JUNEFEST Shop</h1>
          <p style={{ fontFamily: 'var(--jf-font-sans)', color: 'var(--jf-forest)' }}>
            Official JUNEFEST merchandise
          </p>
        </div>
      </div>

      <Container className='py-4'>
        <Row className='mb-3 align-items-center'>
          <Col>
            {keyword && (
              <Link to='/shop' className='btn btn-outline-secondary btn-sm me-2'>
                ← Clear Search
              </Link>
            )}
          </Col>
          <Col xs='auto'>
            <SearchBox baseRoute='/shop' />
          </Col>
        </Row>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--jf-font-serif)', color: 'var(--jf-purple)' }}>
              {keyword ? `Results for "${keyword}"` : 'All Products'}
            </h2>
            <Row>
              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword || ''}
              basePath='/shop'
            />
          </>
        )}
      </Container>
    </>
  );
};

export default ShopScreen;
