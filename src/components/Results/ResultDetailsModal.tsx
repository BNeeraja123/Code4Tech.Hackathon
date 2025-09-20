import React from 'react';
import { X, Award, Target, TrendingUp, CheckCircle, AlertCircle, Lightbulb, Download, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ResultDetailsModalProps {
  resultId: string;
  onClose: () => void;
}

const ResultDetailsModal: React.FC<ResultDetailsModalProps> = ({ resultId, onClose }) => {
  const { results, resumes, jobDescriptions } = useApp();
  const result = results.find(r => r.id === resultId);
  const resume = result ? resumes.find(r => r.id === result.resumeId) : null;
  const job = result ? jobDescriptions.find(j => j.id === result.jobId) : null;

  if (!result || !resume || !job) return null;

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              result.verdict === 'High' ? 'bg-green-100' :
              result.verdict === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Award className={`w-6 h-6 ${
                result.verdict === 'High' ? 'text-green-600' :
                result.verdict === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analysis Details</h2>
              <p className="text-gray-600">{resume.studentName} • {job.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Overall Score */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold mb-4 ${
              result.verdict === 'High' ? 'bg-green-500 text-white' :
              result.verdict === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {result.relevanceScore}%
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {result.verdict} Relevance Match
            </h3>
            <p className="text-gray-600">
              Analyzed on {new Date(result.analyzedAt).toLocaleDateString()} at {new Date(result.analyzedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h4 className="text-lg font-semibold text-gray-900">Hard Skills Match</h4>
              </div>
              <ScoreBar 
                label="Keyword & Skills Match" 
                score={result.hardMatchScore} 
                color="bg-blue-500" 
              />
              <p className="text-sm text-gray-600 mt-3">
                Based on exact and fuzzy matching of skills, keywords, and qualifications.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h4 className="text-lg font-semibold text-gray-900">Semantic Match</h4>
              </div>
              <ScoreBar 
                label="Context & Experience Fit" 
                score={result.semanticMatchScore} 
                color="bg-purple-500" 
              />
              <p className="text-sm text-gray-600 mt-3">
                Based on AI analysis of context, experience, and overall profile fit.
              </p>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Matched Skills ({result.matchedSkills.length})
                </h4>
              </div>
              {result.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No matched skills found</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Missing Skills ({result.missingSkills.length})
                </h4>
              </div>
              {result.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-green-600">All required skills are present!</p>
              )}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h4 className="text-lg font-semibold text-gray-900">AI Recommendations</h4>
            </div>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidate Profile Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Candidate Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">{resume.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Experience:</span>
                <p className="font-medium">{resume.experience}</p>
              </div>
              <div>
                <span className="text-gray-600">Education:</span>
                <p className="font-medium">{resume.education}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-gray-600 text-sm">All Skills ({resume.skills.length}):</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Contact candidate:</span>
              <a
                href={`mailto:${resume.email}`}
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>{resume.email}</span>
              </a>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailsModal;