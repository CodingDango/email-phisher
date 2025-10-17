import { FiUpload } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { countWords, analyzeEmail } from "../utils/utils";
import EmailFields from "./EmailFields";
import Button from "./Button";

const INITIAL_EMAIL_FIELDS = {
  fromHeader: '',
  replyTo: '',
  bodyText: ''
};

export default function  EmailPhisher ({setResult, setIsAnalyzing, isAnalyzing}) {
  const [emailFields, setEmailFields] = useState(INITIAL_EMAIL_FIELDS);
  const [totalChars, setTotalChars] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const fileInputRef = useRef(null);

  const {fromHeader, replyTo, bodyText} = emailFields;
  
  useEffect(() => {
    setTotalChars(bodyText.length);
    setTotalWords(countWords(bodyText)); 
  }, [bodyText]);

  const handleAnalysis = async () => {
    if (bodyText.trim().length === 0
    || fromHeader.trim().length === 0
    ) return;

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeEmail(fromHeader, replyTo, bodyText);
      setResult(result);
      setIsAnalyzing(false);
    } catch(err) {
      console.log(err); // use react toastify later
      setIsAnalyzing(false);
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 

    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target.result;
        setEmailFields({...emailFields, bodyText: text});
      };
      
      reader.readAsText(file);
    }
  };

  const handleFileInputClick = () => fileInputRef.current.click();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleAnalysis();
      }} 
      className='box flex flex-col gap-8'>
      <EmailFields {...{emailFields, setEmailFields}}/>
      
      <div className='flex justify-between items-center'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button
            btnType="primary"
            type="submit" 
            text={isAnalyzing ? 'Analyzing...' : 'Detect Phishing'}
          />
          <Button
            btnType="ghost" 
            Icon={FiUpload}
            text={'Upload File'}
            onClick={handleFileInputClick}
          />
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".txt"
          />

        </div>
        <div className='text-neutral-400'>
          <div>{totalChars || 0} Characters</div>
          <div>{totalWords || 0} Words</div>
        </div>
      </div>
    </form>
  );
}