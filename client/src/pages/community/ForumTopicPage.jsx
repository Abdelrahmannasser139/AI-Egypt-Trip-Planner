import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  ClockIcon, 
  FlagIcon, 
  HeartIcon, 
  PaperAirplaneIcon,
  LockClosedIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const ForumTopicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser, isAuthenticated } = useAuth();
  
  // State for reply form
  const [replyContent, setReplyContent] = useState('');
  
  // Fetch topic details
  const { data: topic, isLoading, error } = useQuery(
    ['forumTopic', id],
    async () => {
      const response = await axios.get(`/api/forum/posts/${id}`);
      return response.data.data;
    }
  );
  
  // Fetch replies
  const { data: replies, isLoading: isLoadingReplies } = useQuery(
    ['forumReplies', id],
    async () => {
      const response = await axios.get(`/api/forum/posts/${id}/replies`);
      return response.data.data;
    },
    {
      enabled: !!id
    }
  );
  
  // Create reply mutation
  const createReply = useMutation(
    async (content) => {
      const response = await axios.post(`/api/forum/posts/${id}/replies`, { content });
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['forumReplies', id]);
        setReplyContent('');
      }
    }
  );
  
  // Like post mutation
  const likePost = useMutation(
    async (postId) => {
      const response = await axios.post(`/api/forum/posts/${postId}/like`);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['forumTopic', id]);
      }
    }
  );
  
  // Like reply mutation
  const likeReply = useMutation(
    async (replyId) => {
      const response = await axios.post(`/api/forum/replies/${replyId}/like`);
      return response.data.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['forumReplies', id]);
      }
    }
  );
  
  // Handle reply submission
  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      createReply.mutate(replyContent);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading || isLoadingReplies) {
    return <LoadingSpinner />;
  }
  
  if (error || !topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading topic</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to load the requested forum topic. Please try again later.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                >
                  Back to Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/forum')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Forum
        </button>
      </div>
      
      {/* Topic header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-nile-blue p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                {topic.category}
              </span>
              <h1 className="mt-2 text-2xl font-bold">{topic.title}</h1>
            </div>
            {topic.isLocked && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <LockClosedIcon className="h-4 w-4 mr-1" />
                Locked
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Original post */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8" id="post-original">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              {topic.author.profileImage ? (
                <img
                  src={topic.author.profileImage}
                  alt={topic.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{topic.author.name}</h3>
                  <p className="text-sm text-gray-500">
                    <ClockIcon className="inline-block h-4 w-4 mr-1" />
                    {formatDate(topic.createdAt)}
                  </p>
                </div>
                {currentUser?.id === topic.author.id && (
                  <Link
                    to={`/forum/edit/${topic.id}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    <PencilIcon className="h-3 w-3 mr-1" />
                    Edit
                  </Link>
                )}
              </div>
              <div className="mt-4 prose prose-nile-blue max-w-none">
                <ReactMarkdown>{topic.content}</ReactMarkdown>
              </div>
              
              {topic.tags && topic.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-desert-sand text-hieroglyph-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => likePost.mutate(topic.id)}
                    disabled={!isAuthenticated || topic.isLikedByUser}
                    className={`inline-flex items-center text-sm font-medium ${
                      topic.isLikedByUser
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    {topic.isLikedByUser ? (
                      <HeartIconSolid className="h-5 w-5 mr-1" />
                    ) : (
                      <HeartIcon className="h-5 w-5 mr-1" />
                    )}
                    {topic.likes} {topic.likes === 1 ? 'Like' : 'Likes'}
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => document.getElementById('reply-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-1" />
                    Reply
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <FlagIcon className="h-5 w-5 mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-nile-blue mb-4">Replies</h2>
        
        {replies && replies.length > 0 ? (
          <div className="space-y-6">
            {replies.map((reply) => (
              <div
                key={reply.id}
                id={`reply-${reply.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {reply.author.profileImage ? (
                        <img
                          src={reply.author.profileImage}
                          alt={reply.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{reply.author.name}</h3>
                          <p className="text-sm text-gray-500">
                            <ClockIcon className="inline-block h-4 w-4 mr-1" />
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                        {currentUser?.id === reply.author.id && (
                          <Link
                            to={`/forum/reply/edit/${reply.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        )}
                      </div>
                      <div className="mt-4 prose prose-nile-blue max-w-none">
                        <ReactMarkdown>{reply.content}</ReactMarkdown>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => likeReply.mutate(reply.id)}
                            disabled={!isAuthenticated || reply.isLikedByUser}
                            className={`inline-flex items-center text-sm font-medium ${
                              reply.isLikedByUser
                                ? 'text-red-500'
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            {reply.isLikedByUser ? (
                              <HeartIconSolid className="h-5 w-5 mr-1" />
                            ) : (
                              <HeartIcon className="h-5 w-5 mr-1" />
                            )}
                            {reply.likes} {reply.likes === 1 ? 'Like' : 'Likes'}
                          </button>
                          
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            <FlagIcon className="h-5 w-5 mr-1" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No replies yet</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to reply to this topic.</p>
          </div>
        )}
      </div>
      
      {/* Reply form */}
      {!topic.isLocked ? (
        <div id="reply-form" className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-nile-blue mb-4">Post a Reply</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReply}>
                <div className="mb-4">
                  <label htmlFor="content" className="sr-only">
                    Reply content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                    placeholder="Write your reply here..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={createReply.isLoading || !replyContent.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createReply.isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                        Post Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  You need to be logged in to reply to this topic.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                >
                  Log In to Reply
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <LockClosedIcon className="mx-auto h-8 w-8 text-red-500" />
          <h3 className="mt-2 text-base font-medium text-red-800">This topic is locked</h3>
          <p className="mt-1 text-sm text-red-600">
            New replies are no longer accepted for this topic.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForumTopicPage;
