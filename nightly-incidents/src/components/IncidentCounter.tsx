import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import Counter from "./counter";
import LangflowLogo from "./LangflowLogo";
import {
  fetchBuildStatus,
  fetchRecentBuilds,
  getTimeUntilNextUpdate,
} from "../services/buildStatusService";
import type {
  IncidentStats,
  BuildStatus,
} from "../services/buildStatusService";

export default function IncidentCounter() {
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [recentBuilds, setRecentBuilds] = useState<BuildStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUpdateIn, setNextUpdateIn] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, buildsData] = await Promise.all([
          fetchBuildStatus(),
          fetchRecentBuilds(),
        ]);
        setStats(statsData);
        setRecentBuilds(buildsData);
        setNextUpdateIn(getTimeUntilNextUpdate());
      } catch (err) {
        setError("Failed to load build status");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update countdown timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNextUpdateIn(getTimeUntilNextUpdate());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LangflowLogo size={60} className="mb-4 justify-center" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-purple-200 mt-4">Loading build status...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LangflowLogo size={60} className="mb-4 justify-center" />
          <p className="text-red-400 text-lg">
            ⚠️ {error || "Failed to load data"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <LangflowLogo size={50} />
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Days Without{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Incident
            </span>
          </h1>
          <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
            Tracking the reliability of Langflow's nightly build pipeline
          </p>
        </motion.div>

        {/* Counter Display */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            <Counter
              value={stats.daysWithoutIncident}
              fontSize={120}
              padding={10}
              places={[100, 10, 1]}
              gap={15}
              borderRadius={12}
              horizontalPadding={20}
              textColor="#ffffff"
              fontWeight={800}
              gradientHeight={20}
              gradientFrom="rgba(0,0,0,0.8)"
              gradientTo="transparent"
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10"></div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl"
        >
          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/10 text-center">
            <h3 className="text-purple-200 text-sm font-medium uppercase tracking-wide mb-2">
              Success Rate
            </h3>
            <p className="text-3xl font-bold text-white">
              {stats.successRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/10 text-center">
            <h3 className="text-purple-200 text-sm font-medium uppercase tracking-wide mb-2">
              Total Builds
            </h3>
            <p className="text-3xl font-bold text-white">{stats.totalBuilds}</p>
          </div>

          <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/10 text-center">
            <h3 className="text-purple-200 text-sm font-medium uppercase tracking-wide mb-2">
              Last Incident
            </h3>
            <p className="text-lg font-medium text-white">
              {stats.lastIncidentDate
                ? formatDate(stats.lastIncidentDate)
                : "Never"}
            </p>
          </div>
        </motion.div>

        {/* Recent Builds */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 w-full"
        >
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Recent Builds
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 px-4 max-w-6xl mx-auto justify-center">
            {recentBuilds.map((build, index) => (
              <motion.div
                key={build.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`p-3 rounded-lg border text-center flex justify-center items-center ${
                  build.status === "success"
                    ? "bg-green-500/20 border-green-500/30 text-green-300"
                    : "bg-red-500/20 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center mb-2">
                    {build.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <p className="text-xs font-medium">
                    {new Date(build.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    - #{build.runNumber}
                  </p>
                  <p className="text-xs opacity-70 mt-1 capitalize">
                    {build.status}
                  </p>
                  {build.version && (
                    <p className="text-xs opacity-70 mt-1">{build.version}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 mb-8 text-center"
        >
          <p className="text-purple-300/60 text-sm">
            Monitoring{" "}
            <a
              href="https://github.com/langflow-ai/langflow/actions/workflows/nightly_build.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              langflow-ai/langflow
            </a>{" "}
            nightly builds
          </p>
          <p className="text-purple-300/40 text-xs mt-2">
            Data updates at 6am, 1pm, 7pm & 11pm • Next update in:{" "}
            {nextUpdateIn}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
