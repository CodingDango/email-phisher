import { AiOutlineSecurityScan } from 'react-icons/ai';
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import EmailPhisher from "./components/EmailPhisher";
import Results from "./components/Results";
import Reasons from "./components/Reasons";

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <>
      {/* <div className="top-0 w-screen absolute h-[10px] header"></div> */}

      <div className='min-h-screen flex justify-center px-4 p-8 sm:pt-12 pb-8 bg-bg'>
        <div className='w-full max-w-4xl flex flex-col gap-8  '>
        
          <header className='grid sm:grid-cols-[1fr_auto] gap-4 '>
            <div className="flex gap-2 justify-center sm:justify-start items-center">
              <AiOutlineSecurityScan size={40} className="text-primary flex-shrink-0"/>
              <h1 className='text-3xl font-medium'>Phishing Detector</h1>
            </div>
            <div className="flex justify-center sm:justify-end items-center">
              <div className="flex gap-2 items-center">
                <img src='/kurt.jpg' className="rounded-full w-[40px]"/>
                <div>
                  <p className="flex gap-1 text-lg">By Kurt Blasurca</p>
                </div>
              </div>
            </div>
          </header>

          <main className='flex-1 flex flex-col gap-8'>
            <EmailPhisher {...{setIsAnalyzing, setResult, isAnalyzing}}/>
            
            <div className="grid md:grid-cols-2 gap-8 grid-rows-[342px]">
              {isAnalyzing 
                ? <div className="col-span-full grid place-items-center">
                    <MoonLoader color="#2b7fff"/>
                  </div>
                : (
                  <>
                    <Results score={result?.score}/>
                    <Reasons reasons={result?.reasons}/>
                  </>
                )
              }
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App
