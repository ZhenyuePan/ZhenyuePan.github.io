import { motion } from 'framer-motion';
import Image from 'next/image';

interface BlogCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export function BlogCard({ imageSrc, title, description }: BlogCardProps) {
  return (
    <motion.div
      className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="relative h-48 overflow-hidden"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          className="object-cover transition-transform duration-300 ease-in-out"
          src={imageSrc}
          alt={`${title} image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <motion.button 
          className="w-full bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          了解更多
        </motion.button>
      </div>
    </motion.div>
  )
}
