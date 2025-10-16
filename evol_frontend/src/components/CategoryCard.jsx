import { motion } from 'framer-motion';

const CategoryCard = ({ category, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-square"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/images/placeholder-category.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      {/* Category Label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-xl font-serif font-bold tracking-wider">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-600 rounded-2xl transition-colors duration-300" />
    </motion.div>
  );
};

export default CategoryCard;