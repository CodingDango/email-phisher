import { AiOutlineWarning } from 'react-icons/ai';
import { MdErrorOutline } from "react-icons/md";
import { AiFillLike } from 'react-icons/ai';

export default function Reasons({reasons}) {
  if (reasons === null || reasons === undefined) return;

  return (
    <div className="box flex flex-col gap-6 min-h-[342px]">
      <h2 className="text-xl flex items-center gap-2">
        <AiOutlineWarning/>
        Suspicious Indicators
      </h2>
      <div className="overflow-y-auto">
        <ul className="flex flex-col gap-4">
          
          {
            reasons.length === 0
            ? (
              <li className="text-green-400 flex gap-2">
                <span className="text-lg">No suspicious content found!</span>
                <AiFillLike size={20} className="flex-shrink-0"/>
              </li>
            )
            : (
              reasons.map((reason, idx) => (
                <li key={idx} className="text-red-400 flex gap-2">
                  <MdErrorOutline size={20} className="flex-shrink-0 mt-1"/>
                  <span>{reason}</span> 
                </li>
              ))
            )
          }
        </ul>
      </div>
    </div>
  );
}