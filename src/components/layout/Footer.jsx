import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-base text-gray-500">
              WhisprTales helps you create amazing stories with AI-powered tools for text, image, and audio generation.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/create" className="text-base text-gray-500 hover:text-gray-900">
                  Create Story
                </Link>
              </li>
              <li>
                <Link to="/my-stories" className="text-base text-gray-500 hover:text-gray-900">
                  My Stories
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base text-gray-500 hover:text-gray-900">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-base text-gray-500 hover:text-gray-900">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} WhisprTales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 