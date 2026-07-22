import React, { useEffect, useState } from "react";
import { fetchAuth } from "../api";

function Badges() {

  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {

    try {

      const res = await fetchAuth("/badges");

      if (res.ok) {

        const data = await res.json();

        setBadges(data);

      }

    } catch (err) {

      console.log(err);

    }

  };

  const getIcon = (type) => {

    switch (type) {

      case "GOAL":
        return "🎯";

      case "STREAK":
        return "🔥";

      case "REDUCTION":
        return "🌱";

      default:
        return "🏅";

    }

  };

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold text-white">
        🏅 My Badges
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Unlock achievements by reducing your carbon footprint.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {badges.map((badge) => (

          <div
            key={badge.id}
            className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:scale-105 transition"
          >

            <div className="text-5xl">

              {getIcon(badge.triggerType)}

            </div>

            <h2 className="text-2xl text-white font-bold mt-4">

              {badge.name}

            </h2>

            <p className="text-gray-400 mt-3">

              {badge.description}

            </p>

            <div className="mt-6">

              <span className="bg-green-600 text-white px-4 py-2 rounded-full">

                {badge.triggerType}

              </span>

            </div>

            <p className="text-green-400 mt-5">

              Threshold : {badge.threshold}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Badges;