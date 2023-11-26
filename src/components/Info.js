const Info = ({ account, accountBalance }) => {
  return(
    <div className="my-3">
      <p><strong>Account:</strong> <code>{account}</code>.</p>
      <p><strong>Account Balance:</strong> {accountBalance} Tokens (TOK).</p>
    </div>
  )
}

export default Info;