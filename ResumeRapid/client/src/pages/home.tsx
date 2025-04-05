import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { FileText, CheckCircle, Settings, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                Build your professional resume in minutes
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Create an ATS-optimized resume with our easy-to-use builder. Get more interviews and land your dream job.
              </p>
              <Link href="/builder">
                <Button size="lg" className="font-semibold">
                  Create Your Resume
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fill in your details</h3>
                <p className="text-gray-600">Enter your personal information, work experience, education, skills, and projects.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimize for ATS</h3>
                <p className="text-gray-600">Our AI-powered system ensures your resume passes through Applicant Tracking Systems.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Download & Apply</h3>
                <p className="text-gray-600">Get your professional resume in PDF format and start applying for jobs confidently.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Key Features</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Everything you need to create a standout resume that gets results
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ATS-Friendly Templates
                </h3>
                <p className="text-gray-600 text-sm">Professionally designed templates optimized for Applicant Tracking Systems.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Auto-Save Feature
                </h3>
                <p className="text-gray-600 text-sm">Never lose your progress with our automatic saving functionality.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Real-Time Preview
                </h3>
                <p className="text-gray-600 text-sm">See changes to your resume in real-time as you type.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  AI Optimization
                </h3>
                <p className="text-gray-600 text-sm">Use AI to enhance your resume's readability and keyword optimization.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to create your professional resume?</h2>
            <Link href="/builder">
              <Button size="lg" className="font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
