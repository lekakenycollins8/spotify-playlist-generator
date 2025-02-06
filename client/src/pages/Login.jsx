import { motion } from "framer-motion"

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Your Spotify Top Tracks</h1>
        <p className="text-xl text-gray-300">Discover and create playlists from your most-played songs</p>
      </motion.div>
      <motion.a
        href="https://spotify-playlist-generator-server.vercel.app/auth/login"
        className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-full hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Login with Spotify
      </motion.a>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-gray-400 text-sm"
      >
        By logging in, you agree to Spotify's Terms of Service and Privacy Policy
      </motion.p>
    </div>
  )
}

export default Login