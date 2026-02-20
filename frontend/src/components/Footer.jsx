import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='jf-footer'>
      <div className='jf-social-links mb-2'>
        <a
          href='https://www.instagram.com/junefest_barcrawl/'
          target='_blank'
          rel='noreferrer'
          aria-label='Instagram'
        >
          <FaInstagram />
        </a>
        <a
          href='https://www.facebook.com/groups/528679009448685'
          target='_blank'
          rel='noreferrer'
          aria-label='Facebook'
        >
          <FaFacebook />
        </a>
      </div>
      <p style={{ margin: 0, fontSize: '0.9em' }}>
        JUNEFEST &copy; {year} — For the people, by the people, of the people.
      </p>
    </footer>
  );
};

export default Footer;
