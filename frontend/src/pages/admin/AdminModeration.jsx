import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import ArchivePostCard from '../../components/archive/ArchivePostCard';
import Loader from '../../components/common/Loader';

const AdminModeration = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const data = await adminService.getPendingPosts();
      setPendingPosts(data);
    } catch (error) {
      console.error('Failed to fetch pending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    setProcessingId(postId);
    try {
      await adminService.approvePost(postId);
      setPendingPosts(pendingPosts.filter(p => p._id !== postId));
      alert('Post approved successfully!');
    } catch (error) {
      alert('Failed to approve post');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (postId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessingId(postId);
    try {
      await adminService.rejectPost(postId, reason);
      setPendingPosts(pendingPosts.filter(p => p._id !== postId));
      alert('Post rejected');
    } catch (error) {
      alert('Failed to reject post');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading pending posts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="admin-moderation-title">
              🛡️ Content Moderation
            </h1>
            <p className="text-gray-600">Review and approve farmer experiences for the Knowledge Archive</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-gray-800 mb-2">✅ Approve if post:</h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Describes actual farming experience</li>
              <li>• States facts without advice tone</li>
              <li>• Is respectful and neutral</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mb-2 mt-4">❌ Reject if post:</h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Gives advice or recommendations</li>
              <li>• Contains promotional content</li>
              <li>• Has political or controversial content</li>
              <li>• Uses "you should" or "this is best" language</li>
            </ul>
          </div>

          {pendingPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center" data-testid="no-pending-posts">
              <p className="text-gray-600">No pending posts to review.</p>
            </div>
          ) : (
            <div className="space-y-6" data-testid="pending-posts-list">
              {pendingPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="mb-4">
                    <ArchivePostCard post={post} />
                  </div>
                  <div className="flex space-x-4 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(post._id)}
                      disabled={processingId === post._id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
                      data-testid={`approve-post-${post._id}`}
                    >
                      {processingId === post._id ? 'Processing...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(post._id)}
                      disabled={processingId === post._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition disabled:opacity-50"
                      data-testid={`reject-post-${post._id}`}
                    >
                      {processingId === post._id ? 'Processing...' : '❌ Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModeration;
