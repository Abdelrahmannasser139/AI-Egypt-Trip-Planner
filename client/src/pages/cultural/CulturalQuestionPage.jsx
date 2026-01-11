import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { ArrowLeftIcon, QuestionMarkCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

// Import real service with mock fallback
import { answerCulturalQuestion } from '../../services/culturalService';

const CulturalQuestionPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);

  // Popular questions
  const popularQuestions = [
    "What are the appropriate dress codes when visiting religious sites in Egypt?",
    "How do Egyptians typically greet each other?",
    "What are some common Egyptian customs I should be aware of as a tourist?",
    "What is the significance of the Nile River in Egyptian culture?",
    "What are some traditional Egyptian dishes I should try?",
    "How do I tip in Egypt? What's the appropriate amount?",
    "What are some common Arabic phrases I should learn before visiting Egypt?",
    "What is Ramadan and how might it affect my travel plans in Egypt?"
  ];

  // Ask question mutation using mock service
  const askQuestion = useMutation(
    async (questionText) => {
      const response = await answerCulturalQuestion(questionText);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setAnswer(data);
        // Scroll to answer
        setTimeout(() => {
          document.getElementById('answer-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      askQuestion.mutate(question);
    }
  };

  // Handle popular question click
  const handlePopularQuestionClick = (q) => {
    setQuestion(q);
    askQuestion.mutate(q);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/cultural-insights')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Cultural Insights
        </button>
      </div>

      {/* Question form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-nile-blue p-8 text-white">
          <h1 className="text-3xl font-bold">Ask About Egyptian Culture</h1>
          <p className="mt-2 text-white/80">
            Get answers to your questions about Egyptian history, customs, traditions, and more.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-nile-blue focus:ring-nile-blue"
                  placeholder="e.g., What is the significance of the scarab in Egyptian culture?"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!question.trim() || askQuestion.isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {askQuestion.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </>
                ) : (
                  'Ask Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular questions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-nile-blue mb-4">Popular Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => handlePopularQuestionClick(q)}
              className="text-left p-3 rounded-md border border-gray-200 hover:border-nile-blue hover:bg-nile-blue/5 transition-colors"
            >
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="h-5 w-5 text-nile-blue mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{q}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Answer section */}
      {answer && (
        <div id="answer-section" className="bg-white rounded-lg shadow-md p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-nile-blue">Answer</h2>
            <p className="mt-1 text-gray-500">{answer.question}</p>
          </div>

          <div className="prose prose-nile-blue max-w-none">
            <ReactMarkdown>{answer.answer}</ReactMarkdown>
          </div>

          {answer.additionalContext && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Context</h3>
              <div className="prose prose-nile-blue max-w-none">
                <ReactMarkdown>{answer.additionalContext}</ReactMarkdown>
              </div>
            </div>
          )}

          {answer.tipsForTravelers && answer.tipsForTravelers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tips for Travelers</h3>
              <ul className="space-y-3">
                {answer.tipsForTravelers.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <LightBulbIcon className="h-5 w-5 text-pharaoh-gold mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {answer.relatedTopics && answer.relatedTopics.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {answer.relatedTopics.map((topic, index) => (
                  <Link
                    key={index}
                    to={`/cultural-insights/search?q=${encodeURIComponent(topic)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-nile-blue hover:text-white transition-colors"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setQuestion('');
                setAnswer(null);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              Ask Another Question
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: answer.question,
                      text: answer.answer.substring(0, 100) + '...',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                Share Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalQuestionPage;
