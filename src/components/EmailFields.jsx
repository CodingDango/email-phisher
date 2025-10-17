export default function EmailFields({emailFields, setEmailFields}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setEmailFields(prevFields => ({
      ...prevFields,
      [name]: value 
    }));
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="flex gap-2 flex-col">
        <label htmlFor='email-header' className="text-neutral-400">From Header</label>
        <input
          value={emailFields.fromHeader}
          required 
          id="email-header" 
          name="fromHeader"
          className="bg-neutral-950 rounded-lg px-4 py-2 input-outline" 
          placeholder="Sender Name <sender@example.com>"
          onChange={handleInputChange} 
        />
      </div>
      <div className="flex gap-2 flex-col">
        <label 
          htmlFor='email-reply-to' 
          className="text-neutral-400"
        >Reply-To Header (Optional)</label>
        <input
          value={emailFields.replyTo} 
          id="email-reply-to"
          name="replyTo" 
          className="bg-neutral-950 rounded-lg px-4 py-2 input-outline" 
          placeholder="Sender Name <sender@example.com>"
          onChange={handleInputChange} 
        />
      </div>

      <div className="col-span-full flex gap-2 flex-col">
        <label 
          htmlFor='email-body'
          className="text-neutral-400"
        >Body HTML:</label>
        <textarea
          required 
          id="email-body"
          name="body"
          value={emailFields.body}
          onChange={handleInputChange} 
          placeholder="Enter the email body here..."
          className='bg-neutral-950 rounded-lg p-4 resize-none w-full h-[300px] outline-none overflow-y-auto input-outline'
        ></textarea>
      </div>  
    </div>
  );
}