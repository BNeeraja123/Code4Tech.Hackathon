import React, { useState } from 'react';
import { Download, Filter, Search, TrendingUp, Users, FileText, Award, Calendar, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ResultDetailsModal from './ResultDetailsModal';

const ResultsView: React.FC = () => {
  const { results, resumes, jobDescriptions } = useApp();
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('all');
  const [filterJob, setFilterJob] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const filteredResults = results
    .filter(result => {
      const resume = resumes.find(r => r.id === result.resumeId);
      const job = jobDescriptions.find(j => j.id === result.jobId);
      
      const matchesSearch = resume?.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job?.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVerdict = filterVerdict === 'all' || result.verdict === filterVerdict;
      const matchesJob = filterJob === 'all' || result.jobId === filterJob;
      
      return matchesSearch && matchesVerdict && matchesJob;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.relevanceScore - a.relevanceScore;
        case 'date':
          return new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime();
        case 'name':
          const resumeA = resumes.find(r => r.id === a.resumeId);
          const resumeB = resumes.find(r => r.id === b.resumeId);
          return (resumeA?.studentName || '').localeCompare(resumeB?.studentName || '');
        default:
          return 0;
      }
    });

  const stats = [
    {
      label: 'Total Analyses',
      value: results.length,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      label: 'High Match Rate',
      value: `${Math.round((results.filter(r => r.verdict === 'High').length / results.length) * 100) || 0}%`,
      icon: Award,
      color: 'bg-green-500',
      trend: '+5%'
    },
    {
      label: 'Avg Score',
      value: Math.round(results.reduce((acc, r) => acc + r.relevanceScore, 0) / results.length) || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+8%'
    },
    {
      label: 'Unique Candidates',
      value: new Set(results.map(r => r.resumeId)).size,
      icon: Users,
      color: 'bg-orange-500',
      trend: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis results and performance insights</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-1">{stat.trend} this week</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by student name or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Verdicts</option>
              <option value="High">High Match</option>
              <option value="Medium">Medium Match</option>
              <option value="Low">Low Match</option>
            </select>
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Jobs</option>
              {jobDescriptions.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relevance Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verdict
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analyzed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const resume = resumes.find(r => r.id === result.resumeId);
                  const job = jobDescriptions.find(j => j.id === result.jobId);
                  
                  if (!resume || !job) return null;

                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {resume.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{resume.studentName}</div>
                            <div className="text-sm text-gray-500">{resume.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company} • {job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.relevanceScore >= 80 ? 'bg-green-500' :
                                result.relevanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${result.relevanceScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{result.relevanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          result.verdict === 'High' ? 'bg-green-100 text-green-800' :
                          result.verdict === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.verdict}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="text-green-600 font-medium">{result.matchedSkills.length}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-red-600">{result.missingSkills.length}</span>
                        </div>
                        <div className="text-xs text-gray-500">matched / missing</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(result.analyzedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedResult(result.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analysis results found</h3>
            <p className="text-gray-600">Upload resumes and run analysis to see results here.</p>
          </div>
        )}
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <ResultDetailsModal
          resultId={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default ResultsView;