import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const LaborHistoryCard = ({ workRecord }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600" data-testid="labor-history-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-lg">{workRecord.workType}</h4>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">👨‍🌾 Farmer:</span> {workRecord.farmer?.fullName || 'N/A'}
            </div>
            <div>
              <span className="font-medium">📍 Location:</span> {workRecord.village}, {workRecord.mandal}
            </div>
            <div>
              <span className="font-medium">📅 Date:</span> {formatDate(workRecord.workDate)}
            </div>
            <div>
              <span className="font-medium">⏰ Duration:</span>{' '}
              {workRecord.duration === 'full_day' ? 'Full Day' : 'Half Day'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborHistoryCard;
