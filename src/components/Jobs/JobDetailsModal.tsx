import React from 'react';
import { X, MapPin, Building, Calendar, Clock, Award, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface JobDetailsModalProps {
  jobId: string;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ jobId, onClose }) => {
  const { jobDescriptions } = useApp();
  const job = jobDescriptions.find(j => j.id === jobId);

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
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
          {/* Job Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'active' ? 'bg-green-100 text-green-800' :
              job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                job.status === 'active' ? 'bg-green-500' :
                job.status === 'paused' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </div>
            <span className="text-sm text-gray-500">Uploaded by {job.uploadedBy}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Must Have Skills */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Must Have Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.mustHaveSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Good to Have Skills */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Good to Have Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.goodToHaveSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h3>
            <div className="space-y-2">
              {job.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">{qualification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Edit Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;