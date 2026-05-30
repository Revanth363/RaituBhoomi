// src/pages/archive/KnowledgeArchive.jsx
import React, { useState, useEffect, useRef } from 'react';
import archiveService from '../../services/archiveService';
import ArchiveFilter from '../../components/archive/ArchiveFilter';
import Loader from '../../components/common/Loader';

const KnowledgeArchive = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false); // Mobile filter toggle

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await archiveService.getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...posts];

    if (filters.crop?.trim()) {
      filtered = filtered.filter((post) =>
        post.content.toLowerCase().includes(filters.crop.trim().toLowerCase())
      );
    }

    if (filters.village?.trim()) {
      filtered = filtered.filter((post) =>
        post.farmer?.village?.toLowerCase().includes(filters.village.trim().toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const formatContent = (text) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-3 text-gray-800 leading-relaxed">
        {line || <br />}
      </p>
    ));
  };

  if (loading) {
    return <Loader text="Loading farming experiences..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="fixed left-4 top-20 z-50 md:hidden bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-2xl text-gray-700 border border-gray-300"
      >
        🔍
      </button>

      {/* Filter Panel - Slide-in on Mobile, Fixed on Desktop */}
      <div className={`
        fixed z-40 bg-white rounded-2xl shadow-xl border border-gray-200 
        transition-all duration-300 ease-in-out overflow-hidden
        ${filterOpen 
          ? 'left-4 top-32 w-80 opacity-100 visible' 
          : 'left-[-100%] opacity-0 invisible'
        }
        md:left-8 md:top-[42%] md:-translate-y-1/2 md:opacity-100 md:visible
      `}>
        <div className="p-6 w-80">
          {/* Close button on mobile */}
          <button
            onClick={() => setFilterOpen(false)}
            className="absolute top-3 right-3 md:hidden text-2xl text-gray-600"
          >
            ×
          </button>

          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            🔍 Filters
          </h2>
          <ArchiveFilter onFilter={handleFilter} />
        </div>
      </div>

      {/* Overlay for mobile when filter is open */}
      {filterOpen && (
        <div
          onClick={() => setFilterOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🌾 Knowledge Archive
          </h1>
          <p className="text-lg text-gray-600">
            Real experiences shared by farmers from the field
          </p>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8 pb-20">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <p className="text-xl text-gray-500">
                No experiences found matching your filters.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting the filters.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* USER INFO */}
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
                      {post.farmer?.fullName?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">
                        {post.farmer?.fullName || 'Anonymous Farmer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.farmer?.village && `${post.farmer.village}, `}
                        {post.farmer?.mandal} •{' '}
                        {new Date(post.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.images?.length || 0} photo
                      {post.images?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* IMAGE CAROUSEL */}
                {post.images && post.images.length > 0 && (
                  <div className="relative">
                    <ImageCarousel images={post.images} />
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-5 pt-4">
                  <div className="text-base text-gray-800 whitespace-pre-line">
                    {formatContent(post.content)}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- IMAGE CAROUSEL ---------------- */
const ImageCarousel = ({ images }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) ref.addEventListener('scroll', checkScroll);
    return () => ref?.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkScroll}
      >
        {images.map((img, idx) => (
          <div key={idx} className="flex-shrink-0 snap-start w-full">
            <img
              src={img}
              alt={`Experience ${idx + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ‹
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ›
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 bg-white/60 rounded-full hover:bg-white/90 transition"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeArchive;