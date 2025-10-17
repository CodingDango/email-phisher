import { getVerdictDetails } from "../utils/utils";

export default function Results({score}) {
  if (score === null || score === undefined) return;  

  const {
    text,
    textColor,
    bgColor,
    scoreText,
    paragraph
  } = getVerdictDetails(score)
  
  return (
    <div className="box flex">
      <div className="h-full flex flex-col items-center justify-center gap-5">

        <div className="text-center">
          <h2 className="text-xl">This email...</h2>
          <span className={`${textColor} text-3xl font-medium`}>{text}</span>
        </div>

        <div className={`w-[100px] h-[100px] text-4xl ${bgColor} rounded-full p-4 text-white text-center grid place-items-center`}>{scoreText}</div>
        <p className="text-neutral-400 text-center">{paragraph}</p>
      </div>
    </div>
  );
}

