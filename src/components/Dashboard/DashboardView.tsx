import React from 'react';
import { FileText, Users, TrendingUp, Clock, MapPin, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DashboardView: React.FC = () => {
  const { jobDescriptions, resumes, results } = useApp();

  const stats = [
    {
      label: 'Active Job Postings',
      value: jobDescriptions.filter(j => j.status === 'active').length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Resumes Analyzed',
      value: results.length,
      icon: Users,
      color: 'bg-green-500',
      change: '+18%'
    },
    {
      label: 'High Relevance Matches',
      value: results.filter(r => r.verdict === 'High').length,
      icon: Award,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      label: 'Avg. Processing Time',
      value: '2.3s',
      icon: Clock,
      color: 'bg-orange-500',
      change: '-15%'
    }
  ];

  const locationStats = [
    { location: 'Hyderabad', jobs: 8, resumes: 45 },
    { location: 'Bangalore', jobs: 6, resumes: 38 },
    { location: 'Pune', jobs: 4, resumes: 22 },
    { location: 'Delhi NCR', jobs: 5, resumes: 31 }
  ];

  const recentResults = results.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of resume analysis and job matching performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-1">{stat.change} from last week</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Performance and Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Location Performance</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {locationStats.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{location.location}</p>
                  <p className="text-sm text-gray-600">{location.jobs} active jobs</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{location.resumes}</p>
                  <p className="text-sm text-gray-500">resumes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analysis Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Analysis</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentResults.length > 0 ? recentResults.map((result, index) => {
              const resume = resumes.find(r => r.id === result.resumeId);
              const job = jobDescriptions.find(j => j.id === result.jobId);
              return (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{resume?.studentName}</p>
                    <p className="text-sm text-gray-600 truncate">{job?.title}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      result.verdict === 'High' ? 'bg-green-100 text-green-800' :
                      result.verdict === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.relevanceScore}% {result.verdict}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No analysis results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Upload Job Description</h4>
            <p className="text-sm text-gray-600 mt-1">Add new job requirements for analysis</p>
          </button>
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Bulk Resume Analysis</h4>
            <p className="text-sm text-gray-600 mt-1">Analyze multiple resumes at once</p>
          </button>
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-600 mt-1">Export analysis results</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;