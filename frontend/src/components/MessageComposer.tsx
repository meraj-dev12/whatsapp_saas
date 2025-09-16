import React, { useState, useCallback } from 'react';
import { Contact } from '../types';
import { generateMessageContent } from '../services/geminiService';
import * as api from '../services/apiService';
import { PaperAirplaneIcon, SparklesIcon, LoadingSpinner } from './icons';

interface MessageComposerProps {
  contacts: Contact[];
}

const MessageComposer: React.FC<MessageComposerProps> = ({ contacts }) => {
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setMediaFile(null);
        setMediaPreview(null);
    }
  };

  const handleGenerateContent = useCallback(async () => {
    if (!heading) {
      setAiError("Please enter a heading to generate content.");
      return;
    }
    setAiError(null);
    setIsGenerating(true);
    try {
      const generatedContent = await generateMessageContent(heading);
      setContent(generatedContent);
    } catch (error: any) {
      setAiError(error.message || "An unknown error occurred.");
    } finally {
      setIsGenerating(false);
    }
  }, [heading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.length === 0) {
      setSendStatus({ type: 'error', message: 'No contacts to send to. Please add contacts first.' });
      return;
    }
    if (!content.trim() && !mediaFile) {
        setSendStatus({ type: 'error', message: 'A message must contain either text content or a media file.' });
        return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await api.sendBulkMessage({
        heading,
        content,
        mediaFile,
        contacts
      });
      setSendStatus({ type: 'success', message: response.message });
      // Reset form on success
      setHeading('');
      setContent('');
      setMediaFile(null);
      setMediaPreview(null);
    } catch (err: any) {
      setSendStatus({ type: 'error', message: err.message || 'Failed to send message.' });
    } finally {
      setIsSending(false);
      // Clear status after a while
      setTimeout(() => setSendStatus(null), 5000);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Compose & Send Message</h2>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label htmlFor="heading" className="block text-sm font-medium text-gray-300">Heading</label>
          <input
            type="text"
            id="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Summer Sale Announcement"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="flex items-center text-xs px-2 py-1 rounded-md text-indigo-300 bg-indigo-900/50 hover:bg-indigo-900/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <LoadingSpinner className="h-4 w-4 mr-1" /> : <SparklesIcon className="h-4 w-4 mr-1" />}
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Write your message here..."
          />
           {aiError && <p className="text-xs text-red-400 mt-1">{aiError}</p>}
        </div>

        <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-300">Media (Image/Video)</label>
            <input 
                type="file" 
                id="media" 
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            {mediaPreview && (
                <div className="mt-4 border border-gray-700 rounded-lg p-2 max-w-xs">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    {mediaFile?.type.startsWith('image/') && <img src={mediaPreview} alt="Media preview" className="rounded-md max-h-40 w-auto" />}
                    {mediaFile?.type.startsWith('video/') && <video src={mediaPreview} controls className="rounded-md max-h-40 w-auto" />}
                </div>
            )}
        </div>
        
        {sendStatus && (
          <div className={`p-3 rounded-md text-sm ${sendStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            {sendStatus.message}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSending || contacts.length === 0}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isSending ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <PaperAirplaneIcon className="h-5 w-5 mr-2" />}
          {isSending ? 'Sending...' : `Send to All (${contacts.length}) Contacts`}
        </button>
      </form>
    </div>
  );
};

export default MessageComposer;
