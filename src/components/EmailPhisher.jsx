import { FiUpload } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { countWords, analyzeEmail } from "../utils/utils";
import EmailTextArea from "./EmailTextArea";
import Button from "./Button";

export default function EmailPhisher ({setResult, setIsAnalyzing, isAnalyzing}) {
  const [emailText, setEmailText] = useState('');
  const [totalChars, setTotalChars] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    setTotalChars(emailText.length);
    setTotalWords(countWords(emailText)); 
  }, [emailText]);

  const handleAnalysis = async () => {
    if (emailText.trim().length === 0) return;

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeEmail(emailText);
      setResult(result);
      setIsAnalyzing(false);
    } catch(err) {
      console.log(err); // use react toastify later
      setIsAnalyzing(false);
    }
  }

  const handleFileChange = (event) => {
    debugger;
    const file = event.target.files[0]; // Get the first selected file

    if (file) {
      const reader = new FileReader();

      // Define what happens when the file is successfully read
      reader.onload = (e) => {
        const text = e.target.result;
        setEmailText(text); // Update the state, which populates the textarea
      };
      
      // Tell the reader to read the file as plain text
      reader.readAsText(file);
    }
  };

  const handleFileInputClick = () => fileInputRef.current.click();

  return (
    <div className='box flex flex-col gap-6'>
      <EmailTextArea {...{setEmailText, emailText}}/>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4'>
          <Button
            onClick={handleAnalysis} 
            text={isAnalyzing ? 'Analyzing...' : 'Detect Phishing'}
          />
          <Button
            type="ghost" 
            Icon={FiUpload}
            text={'Upload File'}
            onClick={handleFileInputClick}
          />
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide it visually
            accept=".txt" // Only allow .txt files to be selected
          />

        </div>
        <div className='text-neutral-400'>
          <div>{totalChars || 0} Characters</div>
          <div>{totalWords || 0} Words</div>
        </div>
      </div>
    </div>
  );
}