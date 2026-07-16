import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GoalProgressCard() {

  // Temporary value (we'll make this dynamic later)
  const progress = 60;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-600 to-green-800 p-6 shadow-xl">

      <h2 className="text-2xl font-bold text-white mb-6">
        Goal Progress
      </h2>

      <div className="w-40 h-40 mx-auto">

        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: "#ffffff",
            trailColor: "#15803d",
            textColor: "#ffffff",
            textSize: "18px"
          })}
        />

      </div>

      <p className="text-center text-green-100 mt-6 text-lg">
        You are on track to achieve your goal.
      </p>

      <div className="mt-6 text-center">

        <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm text-white">
          Target: Reduce carbon emissions by 40%
        </span>

      </div>

    </div>
  );
}