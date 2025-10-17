export default function EmailFields({emailFields, setEmailFields}) {
  const handleInputChange = (e) => {
    // e.target.name will be "fromHeader", "replyTo", or "body"
    // e.target.value will be the text the user typed
    const { name, value } = e.target;
    
    setEmailFields(prevFields => ({
      ...prevFields,
      [name]: value // [name] is a "computed property name" - very powerful!
    }));
  };


  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="flex gap-2 flex-col">
        <label for='email-header' className="text-neutral-400">From Header</label>
        <input
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
          for='email-reply-to' 
          className="text-neutral-400"
        >Reply-To Header (Optional)</label>
        <input 
          id="email-reply-to"
          name="replyTo" 
          className="bg-neutral-950 rounded-lg px-4 py-2 input-outline" 
          placeholder="Sender Name <sender@example.com>"
          onChange={handleInputChange} 
        />
      </div>

      <div className="col-span-full flex gap-2 flex-col">
        <label 
          for='email-body'
          className="text-neutral-400"
        >Body Text:</label>
        <textarea
          required 
          id="email-body"
          name="bodyText"
          value={emailFields.body}
          onChange={handleInputChange} 
          placeholder="Enter the email body here..."
          className='bg-neutral-950 rounded-lg p-4 resize-none w-full h-[300px] outline-none overflow-y-auto input-outline'
        ></textarea>
      </div>  
    </div>
  );
}