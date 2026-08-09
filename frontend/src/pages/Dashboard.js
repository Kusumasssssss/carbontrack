import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Leaf,
  MessageSquare,
  Target,
  Trophy,
  User,
  Users,
  Zap,
  Car,
  ShoppingBag,
  Utensils,
} from "lucide-react";

import { isAuthenticated, fetchAuth } from "../api";
import LottieAnimation from "../components/LottieAnimation";

// Lazy-load the 3D chart
const ThreeCarbonChart = React.lazy(() =>
  import("../components/ThreeCarbonChart")
);


// =====================================================
// LOTTIE ANIMATIONS
// =====================================================

const LOTTIE = {
  today:
    "https://assets9.lottiefiles.com/packages/lf20_hg7zdf8w.json",

  week:
    "https://assets7.lottiefiles.com/packages/lf20_m6cu980y.json",

  month:
    "https://assets1.lottiefiles.com/packages/lf20_vnik4lq6.json",

  goal:
    "https://assets4.lottiefiles.com/packages/lf20_touohxv0.json",

  leaderboard:
    "https://assets4.lottiefiles.com/packages/lf20_9m3q8j7k.json",

  benchmark:
    "https://assets7.lottiefiles.com/packages/lf20_w8n5p0yq.json",

  chatbot:
    "https://assets4.lottiefiles.com/packages/lf20_3k_d5q0x.json",

  profile:
    "https://assets2.lottiefiles.com/packages/lf20_6f_0w07x.json",
};


// =====================================================
// MAIN DASHBOARD
// =====================================================

function Dashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [dailyCarbon, setDailyCarbon] = useState(0);
  const [weeklyCarbon, setWeeklyCarbon] = useState(0);
  const [monthlyCarbon, setMonthlyCarbon] = useState(0);

  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const [goalProgress, setGoalProgress] = useState(null);


  // ===================================================
  // FETCH DATA
  // ===================================================

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchData = () => {

      // -----------------------------------------------
      // Activities
      // -----------------------------------------------

      fetchAuth("/activity")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setActivities(data);
          }
        })
        .catch(console.error);


      // -----------------------------------------------
      // Daily footprint
      // -----------------------------------------------

      fetchAuth("/footprint/daily")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDailyCarbon(
              data.reduce(
                (total, item) =>
                  total +
                  Number(item.totalCo2e || 0),
                0
              )
            );
          }
        })
        .catch(console.error);


      // -----------------------------------------------
      // Weekly footprint
      // -----------------------------------------------

      fetchAuth("/footprint/weekly")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setWeeklyCarbon(
              data.reduce(
                (total, item) =>
                  total +
                  Number(item.totalCo2e || 0),
                0
              )
            );
          }
        })
        .catch(console.error);


      // -----------------------------------------------
      // Monthly footprint
      // -----------------------------------------------

      fetchAuth("/footprint/monthly")
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMonthlyCarbon(
              data.reduce(
                (total, item) =>
                  total +
                  Number(item.totalCo2e || 0),
                0
              )
            );
          }
        })
        .catch(console.error);


      // -----------------------------------------------
      // Goal progress
      // -----------------------------------------------

      fetchAuth("/goals/progress")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Goal request failed");
          }

          return response.json();
        })
        .then((data) => {
          setGoalProgress(data);
        })
        .catch(() => {
          setGoalProgress(null);
        });


      // -----------------------------------------------
      // AI recommendations
      // -----------------------------------------------

      fetchAuth("/recommendations")
        .then((response) => response.json())
        .then((data) => {

          if (data?.recommendations) {
            setRecommendations(
              data.recommendations
            );
          }

          setLoadingRecs(false);
        })
        .catch(() => {
          setLoadingRecs(false);
        });
    };


    fetchData();

    // Keep existing automatic refresh
    const intervalId = setInterval(
      fetchData,
      10000
    );

    return () => clearInterval(intervalId);

  }, [navigate]);


  // ===================================================
  // ANIMATION
  // ===================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };


  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 22,
      },
    },
  };


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                <Leaf
                  size={19}
                  className="text-green-700"
                />
              </div>

              <span className="text-sm font-semibold text-green-700">
                CarbonTrack
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Your sustainability overview
            </h1>

            <p className="mt-2 text-slate-500">
              Track your carbon impact and make
              more sustainable choices.
            </p>
          </div>


          <button
            onClick={() =>
              navigate("/logactivity")
            }
            className="
              inline-flex items-center justify-center gap-2
              px-5 py-3
              rounded-xl
              bg-green-600
              hover:bg-green-700
              text-white
              font-semibold
              shadow-sm
              hover:shadow-md
              transition-all
              duration-200
            "
          >
            <span className="text-xl leading-none">
              +
            </span>

            Log Activity
          </button>

        </div>
      </motion.div>


      {/* =================================================
          SUMMARY BANNER
      ================================================= */}

      <motion.div variants={itemVariants}>

        <div className="
          relative
          overflow-hidden
          rounded-3xl
          border border-green-100
          bg-gradient-to-r
          from-green-50
          via-white
          to-emerald-50
          p-6 sm:p-8
        ">

          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-green-100/60 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="
                hidden sm:flex
                w-16 h-16
                rounded-2xl
                bg-white
                border border-green-100
                items-center justify-center
                shadow-sm
              ">
                <Leaf
                  size={30}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Keep going 🌱
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Every activity makes an impact.
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Log your daily activities to understand
                  your environmental footprint.
                </p>
              </div>

            </div>


            <div className="flex items-center gap-8">

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {dailyCarbon.toFixed(1)}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Today's kg CO₂e
                </p>
              </div>


              <div className="h-10 w-px bg-slate-200" />


              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activities.length}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Activities logged
                </p>
              </div>

            </div>

          </div>
        </div>

      </motion.div>


      {/* =================================================
          METRIC CARDS
      ================================================= */}

      <motion.div
        variants={itemVariants}
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        <MetricCard
          icon={CalendarDays}
          iconBackground="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Today's Impact"
          value={dailyCarbon.toFixed(1)}
          unit="kg CO₂e"
        />


        <MetricCard
          icon={Zap}
          iconBackground="bg-blue-50"
          iconColor="text-blue-600"
          label="This Week"
          value={weeklyCarbon.toFixed(1)}
          unit="kg CO₂e"
        />


        <MetricCard
          icon={BarChart3}
          iconBackground="bg-green-50"
          iconColor="text-green-600"
          label="This Month"
          value={monthlyCarbon.toFixed(1)}
          unit="kg CO₂e"
        />


        <GoalMetricCard
          goalProgress={goalProgress}
        />

      </motion.div>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <motion.div variants={itemVariants}>

        <SectionHeader
          title="Quick Actions"
          subtitle="Access your most useful CarbonTrack tools"
        />

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
        ">

          <QuickActionCard
            icon={Trophy}
            iconBackground="bg-amber-50"
            iconColor="text-amber-600"
            title="Leaderboard"
            description="See how you rank"
            onClick={() =>
              navigate("/leaderboard")
            }
          />


          <QuickActionCard
            icon={Users}
            iconBackground="bg-blue-50"
            iconColor="text-blue-600"
            title="Benchmarking"
            description="Compare with the community"
            onClick={() =>
              navigate("/benchmarking")
            }
          />


          <QuickActionCard
            icon={User}
            iconBackground="bg-purple-50"
            iconColor="text-purple-600"
            title="Profile"
            description="View your sustainability stats"
            onClick={() =>
              navigate("/profile")
            }
          />


          <QuickActionCard
            icon={MessageSquare}
            iconBackground="bg-green-50"
            iconColor="text-green-600"
            title="AI Coach"
            description="Get personalized tips"
            onClick={() =>
              navigate("/chatbot")
            }
          />

        </div>

      </motion.div>


        {/* ---------------------------------------------
            CHART
        --------------------------------------------- */}

       {/* =================================================
           CHART + RECENT ACTIVITIES
       ================================================= */}

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

         <motion.div
           variants={itemVariants}
           className="xl:col-span-2"
         >

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">

             <div className="px-6 pt-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

               <div>

                 <div className="flex items-center gap-2">

                   <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                     <BarChart3
                       size={19}
                       className="text-green-600"
                     />
                   </div>

                   <h2 className="text-lg font-bold text-slate-900">
                     Emission Trends
                   </h2>

                 </div>

                 <p className="text-sm text-slate-500 mt-2">
                   Your carbon emissions over the most recent activity dates.
                 </p>

               </div>

               <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                 CO₂e (kg)
               </div>

             </div>

             <div className="mx-4 mb-4 rounded-xl overflow-hidden bg-white border border-slate-100">

               <Suspense
                 fallback={
                   <div className="h-[380px] flex items-center justify-center text-sm text-slate-400">
                     Loading emission chart...
                   </div>
                 }
               >
                 <ThreeCarbonChart activities={activities} />
               </Suspense>

             </div>

           </div>

         </motion.div>


        {/* ---------------------------------------------
            RECENT ACTIVITIES
        --------------------------------------------- */}

        <motion.div
          variants={itemVariants}
          className="xl:col-span-1"
        >

          <div className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            h-full
            flex
            flex-col
          ">

            <div className="
              p-6
              flex
              items-center
              justify-between
              border-b border-slate-100
            ">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Recent Activities
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Your latest logged activities
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/activities")
                }
                className="
                  text-sm
                  font-semibold
                  text-green-600
                  hover:text-green-700
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
              >
                View all
                <ArrowRight size={15} />
              </button>

            </div>


            <div className="
              flex-1
              p-4
              space-y-3
              overflow-y-auto
              max-h-[430px]
            ">

              {activities.length === 0 ? (

                <EmptyActivities
                  onClick={() =>
                    navigate("/logactivity")
                  }
                />

              ) : (

                activities
                  .slice()
                  .reverse()
                  .slice(0, 6)
                  .map((item) => (

                    <ActivityItem
                      key={item.id}
                      activity={item}
                    />

                  ))

              )}

            </div>

          </div>

        </motion.div>

      </div>


      {/* =================================================
          GOAL + INSIGHTS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        {/* ---------------------------------------------
            GOAL PROGRESS
        --------------------------------------------- */}

        <motion.div variants={itemVariants}>

          <div className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            p-6
            h-full
          ">

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="
                    w-10 h-10
                    rounded-xl
                    bg-green-50
                    flex items-center justify-center
                  ">
                    <Target
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Sustainability Goal
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Track your progress
                    </p>
                  </div>

                </div>

              </div>


              <button
                onClick={() =>
                  navigate("/goals")
                }
                className="
                  text-sm
                  font-semibold
                  text-green-600
                  hover:text-green-700
                "
              >
                View goals
              </button>

            </div>


            <div className="mt-7">

              {goalProgress ? (

                <>
                  <div className="
                    flex
                    items-end
                    justify-between
                    mb-3
                  ">

                    <div>

                      <p className="text-4xl font-bold text-slate-900">
                        {Number(
                          goalProgress.progressPercentage || 0
                        ).toFixed(0)}
                        %
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Goal progress
                      </p>

                    </div>


                    <div className="
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      font-semibold
                    "
                    >

                      <CheckCircle2
                        size={17}
                        className={
                          goalProgress.onTrack
                            ? "text-green-600"
                            : "text-amber-500"
                        }
                      />

                      <span
                        className={
                          goalProgress.onTrack
                            ? "text-green-600"
                            : "text-amber-600"
                        }
                      >
                        {goalProgress.onTrack
                          ? "On Track"
                          : "Behind"}
                      </span>

                    </div>

                  </div>


                  <div className="
                    h-3
                    w-full
                    bg-slate-100
                    rounded-full
                    overflow-hidden
                  ">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.min(
                          Math.max(
                            Number(
                              goalProgress.progressPercentage || 0
                            ),
                            0
                          ),
                          100
                        )}%`,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-green-500
                        to-emerald-400
                      "
                    />

                  </div>


                  <div className="
                    flex
                    justify-between
                    mt-3
                    text-xs
                    text-slate-500
                  ">

                    <span>
                      Progress
                    </span>

                    <span>
                      {goalProgress.daysRemaining != null
                        ? `${goalProgress.daysRemaining} days remaining`
                        : "Keep going"}
                    </span>

                  </div>

                </>

              ) : (

                <div className="
                  rounded-xl
                  border border-dashed
                  border-slate-200
                  bg-slate-50
                  p-8
                  text-center
                ">

                  <Target
                    size={28}
                    className="
                      mx-auto
                      text-slate-400
                      mb-3
                    "
                  />

                  <p className="font-semibold text-slate-700">
                    No active goal
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Create a sustainability goal
                    to start tracking your progress.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/goals")
                    }
                    className="
                      mt-4
                      px-4
                      py-2
                      rounded-lg
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    Create Goal
                  </button>

                </div>

              )}

            </div>

          </div>

        </motion.div>


        {/* ---------------------------------------------
            AI INSIGHTS
        --------------------------------------------- */}

        <motion.div variants={itemVariants}>

          <div className="
            relative
            overflow-hidden
            rounded-2xl
            border border-green-100
            bg-gradient-to-br
            from-green-50
            to-white
            shadow-sm
            p-6
            h-full
          ">

            <div className="
              absolute
              -right-10
              -top-10
              w-32
              h-32
              bg-green-100
              rounded-full
              blur-3xl
            " />


            <div className="
              relative
              flex
              items-start
              gap-4
            ">

              <div className="
                w-11 h-11
                rounded-xl
                bg-green-600
                flex
                items-center
                justify-center
                flex-shrink-0
              ">
                <Leaf
                  size={21}
                  className="text-white"
                />
              </div>


              <div className="flex-1">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                ">

                  <div>
                    <h2 className="font-bold text-slate-900">
                      AI Sustainability Coach
                    </h2>

                    <p className="text-xs text-green-700 mt-1">
                      Personalized insight
                    </p>
                  </div>


                  <button
                    onClick={() =>
                      navigate("/chatbot")
                    }
                    className="
                      p-2
                      rounded-lg
                      bg-white
                      border border-green-100
                      text-green-600
                      hover:bg-green-50
                    "
                    title="Open AI Coach"
                  >
                    <ArrowRight size={17} />
                  </button>

                </div>


                <div className="mt-5">
                {loadingRecs ? (
                  <div>
                    <div className="h-3 bg-green-100 rounded-full animate-pulse w-5/6"></div>
                    <div className="h-3 bg-green-100 rounded-full animate-pulse w-full"></div>
                    <div className="h-3 bg-green-100 rounded-full animate-pulse w-4/6"></div>
                  </div>
                ) : (
                  <div>
                    {recommendations}
                  </div>
                )}




                <button
                  onClick={() =>
                    navigate("/chatbot")
                  }
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-green-700
                    hover:text-green-800
                  "
                >
                  Open AI Coach
                  <ArrowRight size={15} />
                </button>

              </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>


      {/* =================================================
          FOOTER / QUICK LOG CATEGORIES
      ================================================= */}

      <motion.div variants={itemVariants}>

        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          shadow-sm
          p-6
        ">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-slate-900">
              Log an Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Record your daily activities to calculate
              your carbon footprint.
            </p>

          </div>


          <div className="
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-3
          ">

            <CategoryButton
              icon={Car}
              title="Transport"
              onClick={() =>
                navigate("/logactivity")
              }
            />

            <CategoryButton
              icon={Zap}
              title="Electricity"
              onClick={() =>
                navigate("/logactivity")
              }
            />

            <CategoryButton
              icon={Utensils}
              title="Food"
              onClick={() =>
                navigate("/logactivity")
              }
            />

            <CategoryButton
              icon={ShoppingBag}
              title="Shopping"
              onClick={() =>
                navigate("/logactivity")
              }
            />

          </div>

        </div>

      </motion.div>

    </motion.div>
  );
}


// =====================================================
// METRIC CARD
// =====================================================

function MetricCard({
  icon: Icon,
  iconBackground,
  iconColor,
  label,
  value,
  unit,
}) {

  return (
    <div className="
      group
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-sm
      p-5
      hover:shadow-md
      hover:-translate-y-0.5
      transition-all
      duration-200
    ">

      <div className="
        flex
        items-start
        justify-between
      ">

        <div className={`
          w-11 h-11
          rounded-xl
          ${iconBackground}
          flex
          items-center
          justify-center
        `}>

          <Icon
            size={21}
            className={iconColor}
          />

        </div>

      </div>


      <div className="mt-5">

        <p className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        ">
          {label}
        </p>


        <div className="
          flex
          items-baseline
          gap-1.5
          mt-1
        ">

          <span className="
            text-3xl
            font-bold
            text-slate-900
          ">
            {value}
          </span>

          <span className="
            text-sm
            font-medium
            text-slate-400
          ">
            {unit}
          </span>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// GOAL METRIC CARD
// =====================================================

function GoalMetricCard({
  goalProgress,
}) {

  const percentage = goalProgress
    ? Number(
        goalProgress.progressPercentage || 0
      )
    : 0;


  return (
    <div className="
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-sm
      p-5
    ">

      <div className="
        flex
        items-start
        justify-between
      ">

        <div className="
          w-11 h-11
          rounded-xl
          bg-green-50
          flex
          items-center
          justify-center
        ">

          <Target
            size={21}
            className="text-green-600"
          />

        </div>


        <span className="
          text-2xl
          font-bold
          text-green-600
        ">
          {goalProgress
            ? `${percentage.toFixed(0)}%`
            : "—"}
        </span>

      </div>


      <div className="mt-5">

        <p className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        ">
          Goal Progress
        </p>


        {goalProgress ? (

          <div className="mt-3">

            <div className="
              h-2
              bg-slate-100
              rounded-full
              overflow-hidden
            ">

              <div
                className="
                  h-full
                  bg-green-500
                  rounded-full
                  transition-all
                "
                style={{
                  width: `${Math.min(
                    Math.max(
                      percentage,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

            <p className="
              text-xs
              text-slate-500
              mt-2
            ">
              {goalProgress.onTrack
                ? "On track"
                : "Needs attention"}
            </p>

          </div>

        ) : (

          <p className="
            text-sm
            text-slate-400
            mt-2
          ">
            No active goal
          </p>

        )}

      </div>

    </div>
  );
}


// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  title,
  subtitle,
}) {

  return (
    <div className="mb-4">

      <h2 className="
        text-lg
        font-bold
        text-slate-900
      ">
        {title}
      </h2>

      <p className="
        text-sm
        text-slate-500
        mt-1
      ">
        {subtitle}
      </p>

    </div>
  );
}


// =====================================================
// QUICK ACTION CARD
// =====================================================

function QuickActionCard({
  icon: Icon,
  iconBackground,
  iconColor,
  title,
  description,
  onClick,
}) {

  return (
    <motion.button
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="
        w-full
        text-left
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        hover:shadow-md
        hover:border-green-200
        transition-all
        duration-200
      "
    >

      <div className={`
        w-12 h-12
        rounded-xl
        ${iconBackground}
        flex
        items-center
        justify-center
        flex-shrink-0
      `}>

        <Icon
          size={22}
          className={iconColor}
        />

      </div>


      <div className="min-w-0 flex-1">

        <h3 className="
          font-semibold
          text-slate-900
        ">
          {title}
        </h3>

        <p className="
          text-xs
          text-slate-500
          mt-1
        ">
          {description}
        </p>

      </div>


      <ArrowRight
        size={17}
        className="
          text-slate-300
          group-hover:text-green-500
        "
      />

    </motion.button>
  );
}


// =====================================================
// ACTIVITY ITEM
// =====================================================

function ActivityItem({
  activity,
}) {

  const category =
    String(
      activity.category || ""
    ).toLowerCase();


  let Icon = Leaf;

  let iconBackground =
    "bg-green-50";

  let iconColor =
    "text-green-600";


  if (
    category.includes("transport")
  ) {
    Icon = Car;
    iconBackground = "bg-blue-50";
    iconColor = "text-blue-600";
  }

  else if (
    category.includes("electric")
  ) {
    Icon = Zap;
    iconBackground = "bg-amber-50";
    iconColor = "text-amber-600";
  }

  else if (
    category.includes("food")
  ) {
    Icon = Utensils;
    iconBackground = "bg-orange-50";
    iconColor = "text-orange-600";
  }

  else if (
    category.includes("shopping")
  ) {
    Icon = ShoppingBag;
    iconBackground = "bg-purple-50";
    iconColor = "text-purple-600";
  }


  return (
    <div className="
      p-3
      rounded-xl
      border border-slate-100
      hover:border-green-100
      hover:bg-green-50/30
      transition-colors
    ">

      <div className="
        flex
        items-center
        gap-3
      ">

        <div className={`
          w-10 h-10
          rounded-lg
          ${iconBackground}
          flex
          items-center
          justify-center
          flex-shrink-0
        `}>

          <Icon
            size={18}
            className={iconColor}
          />

        </div>


        <div className="min-w-0 flex-1">

          <p className="
            text-sm
            font-semibold
            text-slate-800
            truncate
          ">
            {activity.activity ||
              "Activity"}
          </p>

          <div className="
            flex
            items-center
            gap-2
            mt-1
          ">

            <span className="
              text-xs
              text-slate-500
            ">
              {activity.category ||
                "General"}
            </span>

            {activity.date && (
              <>
                <span className="
                  text-slate-300
                ">
                  •
                </span>

                <span className="
                  text-xs
                  text-slate-400
                ">
                  {activity.date}
                </span>
              </>
            )}

          </div>

        </div>


        <div className="text-right">

          <p className="
            text-sm
            font-bold
            text-green-600
            whitespace-nowrap
          ">
            {Number(
              activity.carbonEmission || 0
            ).toFixed(2)}
          </p>

          <p className="
            text-[10px]
            text-slate-400
          ">
            kg CO₂e
          </p>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// EMPTY ACTIVITIES
// =====================================================

function EmptyActivities({
  onClick,
}) {

  return (
    <div className="
      h-full
      min-h-[300px]
      flex
      flex-col
      items-center
      justify-center
      text-center
      p-6
    ">

      <div className="
        w-16 h-16
        rounded-2xl
        bg-green-50
        flex
        items-center
        justify-center
        mb-4
      ">

        <Leaf
          size={28}
          className="text-green-500"
        />

      </div>


      <h3 className="
        font-semibold
        text-slate-800
      ">
        No activities yet
      </h3>


      <p className="
        text-sm
        text-slate-500
        mt-1
        max-w-[220px]
      ">
        Start logging your activities
        to see your carbon footprint.
      </p>


      <button
        onClick={onClick}
        className="
          mt-4
          text-sm
          font-semibold
          text-green-600
          hover:text-green-700
        "
      >
        Log your first activity →
      </button>

    </div>
  );
}


// =====================================================
// CATEGORY BUTTON
// =====================================================

function CategoryButton({
  icon: Icon,
  title,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className="
        flex
        items-center
        justify-center
        gap-2
        px-4
        py-3
        rounded-xl
        border border-slate-200
        bg-slate-50
        hover:bg-green-50
        hover:border-green-200
        text-sm
        font-semibold
        text-slate-700
        hover:text-green-700
        transition-all
      "
    >

      <Icon size={18} />

      {title}

    </button>
  );
}


export default Dashboard;
