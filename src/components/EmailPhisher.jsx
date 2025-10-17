import { FiUpload } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { countWords, analyzeEmail } from "../utils/utils";
import PostalMime from 'postal-mime';
import EmailFields from "./EmailFields";
import Button from "./Button";

const INITIAL_EMAIL_FIELDS = {
  fromHeader: "",
  replyTo: "",
  body: "",
};

export default function EmailPhisher({
  setResult,
  setIsAnalyzing,
  isAnalyzing,
}) {
  const [emailFields, setEmailFields] = useState(INITIAL_EMAIL_FIELDS);
  const [totalChars, setTotalChars] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const fileInputRef = useRef(null);

  const { fromHeader, replyTo, body } = emailFields;

  useEffect(() => {
    if (body.trim().length === 0);

    setTotalChars(body.length);
    setTotalWords(countWords(body));
  }, [body]);

  const handleAnalysis = async () => {
    if (body.trim().length === 0 || fromHeader.trim().length === 0) return;

    setIsAnalyzing(true);

    try {
      const result = await analyzeEmail(fromHeader, replyTo, body);
      setResult(result);
      setIsAnalyzing(false);
    } catch (err) {
      console.log(err); // use react toastify later
      setIsAnalyzing(false);
    }
  };

const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  try {
    const parser = new PostalMime();
    const {html, text, replyTo, from} = await parser.parse(file);

    setEmailFields({
      fromHeader: from ? `${from.name} <${from.address}>` : '',
      replyTo: replyTo ? (replyTo.name ? `${replyTo.name} <${replyTo.address}>` : replyTo.address) : '',
      body: html || text || ''
    });

  } catch (error) {
    console.error("Error parsing EML file:", error);
    alert("Could not read the EML file. It may be corrupted.");
  }
  
  // Clear the input so the same file can be re-uploaded
  event.target.value = null;
};

  const handleFileInputClick = () => fileInputRef.current.click();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAnalysis();
      }}
      className="box flex flex-col gap-8"
    >
      <EmailFields {...{ emailFields, setEmailFields }} />

      <div className="flex justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            btnType="primary"
            type="submit"
            text={isAnalyzing ? "Analyzing..." : "Detect Phishing"}
          />
          <Button
            type="button"
            btnType="ghost"
            Icon={FiUpload}
            text={"Upload .eml File"}
            onClick={handleFileInputClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".eml"
          />
        </div>
        <div className="text-neutral-400">
          <div>{totalChars || 0} Characters</div>
          <div>{totalWords || 0} Words</div>
        </div>
      </div>
    </form>
  );
}
