import { motion } from 'framer-motion';

const CelebrityCard = ({ celebrity, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(celebrity)}
      className="cursor-pointer group w-full max-w-sm mx-auto"
    >
      <div className="text-center">
        {/* Celebrity Image */}
        <div className="relative mb-4 sm:mb-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
            <img
              src={celebrity.image}
              alt={celebrity.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/images/placeholder-celebrity.jpg';
              }}
            />
          </div>

          {/* Match Percentage Badge */}
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
            style={{ background: 'linear-gradient(135deg, #B8941F 0%, #D4AF37 100%)' }}>
            {celebrity.match_percentage}%
          </div>
        </div>

        {/* Celebrity Name */}
        <h3
          className="text-base sm:text-lg lg:text-xl font-serif text-black mb-10 sm:mb-3 group-hover:text-yellow-600 transition-colors tracking-wide"
          style={{ marginBottom: "90px" }}
        >
          {celebrity.name}
        </h3>

        {/* Vibe Tags */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {celebrity.vibe_tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 sm:px-3 py-2 bg-gray-100 text-gray-600 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CelebrityCard;