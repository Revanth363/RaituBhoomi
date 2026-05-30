// src/pages/farmer/ShareExperience.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import archiveService from '../../services/archiveService';

const ShareExperience = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const MAX_IMAGES = 10;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`You can upload maximum ${MAX_IMAGES} images`);
      return;
    }

    const newPreviews = [];
    const validFiles = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setPreviewImages(prev => [...prev, ...newPreviews]);
          setSelectedImages(prev => [...prev, ...validFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write your experience');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const base64Images = await Promise.all(
        selectedImages.map(file => 
          new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
        )
      );

      await archiveService.createPost({
        content: content.trim(),
        images: base64Images
      });

      setSuccess(true);
      setTimeout(() => navigate('/farmer/dashboard'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700 mb-3">
            Submitted Successfully!
          </h2>
          <p className="text-gray-600 text-base">
            Your experience has been sent for review. It will appear in the Knowledge Archive once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 -mx-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              📝 Share Your Farming Experience
            </h1>
            <p className="text-green-100 mt-3 text-base">
              Help fellow farmers by sharing what you did this season — your real experience.
            </p>
          </div>

          {/* Guidelines */}
          <div className="p-6 sm:p-8 bg-amber-50 border-b border-amber-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Guidelines</h3>
            <ul className="text-sm sm:text-base text-gray-700 space-y-3 list-disc list-inside">
              <li><strong>Share what you did:</strong> "We transplanted in July after rain"</li>
              <li><strong>Describe results:</strong> "Harvest completed in November"</li>
              <li><strong>Avoid giving advice:</strong> No "You should..."</li>
              <li>No promotions or politics</li>
            </ul>
            <p className="text-xs sm:text-sm text-gray-600 mt-5 italic">
              All posts are reviewed before publication.
            </p>
          </div>

          {/* Main Form */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Experience Textarea */}
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Your Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows="10"
                  placeholder="Example:\nThis season we prepared field in June. Used traditional seeds. Transplanted in July after good rain. Applied organic fertilizer twice. Harvest done in November using machine. Got 120 bags from 2 acres."
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 resize-none text-base"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Add Images (Optional • Max 10)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                  />
                  <p className="text-gray-500 text-sm mt-3">
                    Click to select or drag & drop images
                  </p>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewImages.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden shadow-md">
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-700 text-xl font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg"
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/dashboard')}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-bold text-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareExperience;