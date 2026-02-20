import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = ({ baseRoute = '/shop' }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`${baseRoute}/search/${keyword}`);
      setKeyword('');
    } else {
      navigate(baseRoute);
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        value={keyword}
        placeholder='Search products…'
        className='me-2'
        onChange={(e) => setKeyword(e.target.value)}
        style={{ borderColor: 'var(--jf-coral)', maxWidth: '220px' }}
      />
      <Button type='submit' className='btn-jf-coral p-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
