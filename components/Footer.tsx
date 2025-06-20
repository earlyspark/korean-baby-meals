export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-sand-300 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-left">
            <p className="text-gray-700 text-sm font-medium">
              Healthy Korean recipes for babies and toddlers
            </p>
            <p className="text-gray-600 text-xs">
              Easy-to-follow instructions, storage tips, and baby-friendly ingredients
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-gray-700 text-xs">
              © {currentYear} Korean Baby Meals
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}