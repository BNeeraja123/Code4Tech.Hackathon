import React, { useState, useEffect } from 'react';
import { X, Play, FileText, Target, TrendingUp, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobDescription } from '../../types';

interface ResumeAnalysisModalProps {
  resumeId: string;
  onClose: () => void;
}

const ResumeAnalysisModal: React.FC<ResumeAnalysisModalProps> = ({ resumeId, onClose }) => {
  const { resumes, jobDescriptions, analyzeResume, results } = useApp();
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const resume = resumes.find(r => r.id === resumeId);
  const activeJobs = jobDescriptions.filter(j => j.status === 'active');
  const resumeResults = results.filter(r => r.resumeId === resumeId);

  useEffect(() => {
    if (activeJobs.length > 0 && selectedJobs.length === 0) {
      setSelectedJobs([activeJobs[0].id]);
    }
  }, [activeJobs]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    
    // Simulate analysis time
    for (const jobId of selectedJobs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      analyzeResume(resumeId, jobId);
    }
    
    setAnalyzing(false);
    setAnalysisComplete(true);
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  if (!resume) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resume Analysis</h2>
              <p className="text-gray-600">{resume.studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!analysisComplete ? (
            <>
              {/* Resume Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  <div>
                    <span className="text-gray-600">Skills Count:</span>
                    <p className="font-medium">{resume.skills.length}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600 text-sm">Key Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resume.skills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {resume.skills.length > 8 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{resume.skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Job Descriptions to Analyze Against</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => toggleJobSelection(job.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedJobs.includes(job.id)
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedJobs.includes(job.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedJobs.includes(job.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                          <div className="flex flex-wrap gap-1">
                            {job.mustHaveSkills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {job.mustHaveSkills.length > 3 && (
                              <span className="text-xs text-gray-500">+{job.mustHaveSkills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={selectedJobs.length === 0 || analyzing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg flex items-center space-x-2 text-lg font-medium transition-colors"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Start Analysis ({selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            // Analysis Results
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900">Analysis Complete!</h3>
                <p className="text-gray-600">Resume analyzed against {selectedJobs.length} job description{selectedJobs.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resumeResults.slice(-selectedJobs.length).map((result) => {
                  const job = jobDescriptions.find(j => j.id === result.jobId);
                  if (!job) return null;

                  return (
                    <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.verdict === 'High' ? 'bg-green-100 text-green-800' :
                          result.verdict === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.relevanceScore}% {result.verdict}
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Hard Match</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${result.hardMatchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{result.hardMatchScore}%</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">Semantic Match</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${result.semanticMatchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{result.semanticMatchScore}%</span>
                        </div>
                      </div>

                      {/* Matched Skills */}
                      {result.matchedSkills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Matched Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {result.matchedSkills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {result.missingSkills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Missing Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {result.missingSkills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {result.suggestions.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">Suggestions</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span>•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {analysisComplete ? 'Close' : 'Cancel'}
            </button>
            {analysisComplete && (
              <button
                onClick={() => setAnalysisComplete(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Analyze Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisModal;