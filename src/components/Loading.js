import Spinner from 'react-bootstrap/Spinner';

const loading = () => {
  return (
    <div className='text-center my-5'>
      <Spinner animation='grow' />
      <p className='my-2'>Loading...</p>
    </div>
  )
}

export default loading;