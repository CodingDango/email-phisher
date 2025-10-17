export default function EmailTextArea({setEmailText, emailText}) {
  return (
    <textarea
      value={emailText}
      onChange={(e) => setEmailText(e.target.value)} 
      placeholder="Enter the email body here..."
      className='resize-none w-full h-[300px]  outline-none overflow-y-auto'
    ></textarea>
  );
}