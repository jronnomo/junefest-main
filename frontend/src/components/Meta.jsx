import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome to Junefest',
  description: 'Looking for Junefest merch? Find it here!',
  keywords: 'junefest, hawaiian, golf, shirts',
};

export default Meta;
