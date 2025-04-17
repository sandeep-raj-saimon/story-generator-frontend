import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">SG</span>
      </div>
      <span className="text-xl font-bold text-gray-900">Story Generator</span>
    </Link>
  )
}

export default Logo 