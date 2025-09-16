import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { LogoutIcon, PaperAirplaneIcon, LoadingSpinner } from './icons';
import ContactManager from './ContactManager';
import MessageComposer from './MessageComposer';
import * as api from '../services/apiService';

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await api.getContacts();
        setContacts(fetchedContacts);
      } catch (err) {
        setError('Failed to load contacts. Please refresh the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    const newContact = await api.addContact(contact);
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const deleteContact = async (id: string) => {
    const originalContacts = [...contacts];
    setContacts(prevContacts => prevContacts.filter(c => c.id !== id));
    try {
      await api.deleteContact(id);
    } catch (err) {
      console.error("Failed to delete contact, reverting.", err);
      setContacts(originalContacts);
      // In a real app, you might show a toast notification here
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <PaperAirplaneIcon className="h-8 w-8 text-indigo-400 transform -rotate-45" />
          <h1 className="text-2xl font-bold tracking-tight">Bulk Messenger Dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
        >
          <LogoutIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner className="h-12 w-12 text-indigo-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ContactManager contacts={contacts} onAddContact={addContact} onDeleteContact={deleteContact} />
            </div>
            <div className="lg:col-span-3">
              <MessageComposer contacts={contacts} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
