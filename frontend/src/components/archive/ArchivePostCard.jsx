import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const ArchivePostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4" data-testid="archive-post-card">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {post.farmer?.fullName?.charAt(0) || 'F'}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{post.farmer?.fullName || 'Farmer'}</h4>
              <p className="text-sm text-gray-600">
                {post.farmer?.village}, {post.farmer?.mandal}
              </p>
            </div>
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>

          <div className="mt-3">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
            ℹ️ This is a farming experience shared by a farmer. Not advice or recommendation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivePostCard;
