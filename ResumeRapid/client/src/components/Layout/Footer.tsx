export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
