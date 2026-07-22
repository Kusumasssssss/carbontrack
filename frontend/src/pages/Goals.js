import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";

function Goals() {

  const [goal, setGoal] = useState(null);
  const [progress, setProgress] = useState(null);

  const [formData, setFormData] = useState({
    targetReductionPct: "",
    periodDays: ""
  });

  useEffect(() => {
    loadGoal();
    loadProgress();
  }, []);

  const loadGoal = async () => {
    try {

      const res = await fetchAuth("/goals/active");

      if (res.ok) {
        const data = await res.json();
        setGoal(data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const loadProgress = async () => {
    try {

      const res = await fetchAuth("/goals/progress");

      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const createGoal = async () => {

    try {

      const res = await fetchAuth("/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {

        const data = await res.json();

        setGoal(data);

        loadProgress();

        alert("Goal Created Successfully");

      }

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold text-white">
        🎯 Goal Management
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Set your carbon reduction goal and track your progress.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Goal Form */}

        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">

          <h2 className="text-2xl text-green-400 font-bold mb-6">
            Create Goal
          </h2>

          <label className="text-white">
            Target Reduction (%)
          </label>

          <input
            type="number"
            name="targetReductionPct"
            value={formData.targetReductionPct}
            onChange={handleChange}
            className="w-full mt-2 mb-5 p-3 rounded-lg bg-gray-800 text-white"
          />

          <label className="text-white">
            Period (Days)
          </label>

          <input
            type="number"
            name="periodDays"
            value={formData.periodDays}
            onChange={handleChange}
            className="w-full mt-2 mb-6 p-3 rounded-lg bg-gray-800 text-white"
          />

          <button
            onClick={createGoal}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold transition"
          >
            Save Goal
          </button>

        </div>

        {/* Current Goal */}

        {goal && (

          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl text-green-400 font-bold mb-5">
              Current Goal
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Target Reduction
                </span>

                <span className="text-white font-semibold">
                  {goal.targetReductionPct}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Duration
                </span>

                <span className="text-white font-semibold">
                  {goal.periodDays} Days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Status
                </span>

                <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm">
                  {goal.status}
                </span>
              </div>

            </div>

          </div>

        )}

      </div>

      {/* Goal Progress */}

      {progress && (

        <div className="bg-gray-900 rounded-2xl p-6 mt-8 shadow-lg">

          <h2 className="text-2xl text-blue-400 font-bold mb-6">
            📊 Goal Progress
          </h2>

          <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">

            <div
              className="bg-green-500 h-5 transition-all duration-700"
              style={{
                width: `${progress.progressPercentage}%`
              }}
            />

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

            <div>

              <p className="text-gray-400 text-sm">
                Progress
              </p>

              <h3 className="text-white text-2xl font-bold">
                {progress.progressPercentage.toFixed(1)}%
              </h3>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Days Remaining
              </p>

              <h3 className="text-white text-2xl font-bold">
                {progress.daysRemaining}
              </h3>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Days Elapsed
              </p>

              <h3 className="text-white text-2xl font-bold">
                {progress.daysElapsed}
              </h3>

            </div>

            <div>

              <p className="text-gray-400 text-sm">
                Status
              </p>

              <h3
                className={`text-2xl font-bold ${
                  progress.onTrack
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {progress.onTrack ? "🟢 On Track" : "🔴 Behind"}
              </h3>

            </div>

          </div>

          <div className="mt-8 bg-gray-800 rounded-xl p-5">

            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
              💡 Motivation
            </h3>

            <p className="text-gray-300">
              {progress.message}
            </p>

          </div>

        </div>

      )}

    </div>

  );

}

export default Goals;