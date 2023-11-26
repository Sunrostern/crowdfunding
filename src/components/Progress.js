import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ maxTokens, tokensSold }) => {
  return (
    <div className='my-3'>
      <ProgressBar now={((tokensSold / maxTokens) * 100)} label={`${(tokensSold / maxTokens) * 100}%`}/>
      <p className='text-center my-3'>{tokensSold.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} of {maxTokens.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Tokens (TOK)</p>
    </div>
  )
}

export default Progress;