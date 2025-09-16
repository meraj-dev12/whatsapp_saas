
import React from 'react';
import { Contact } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { LogoutIcon, PaperAirplaneIcon } from './icons';
import ContactManager from './ContactManager';
import MessageComposer from './MessageComposer';

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = { ...contact, id: Date.now().toString() };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const deleteContact = (id: string) => {
    setContacts(prevContacts => prevContacts.filter(c => c.id !== id));
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <ContactManager contacts={contacts} onAddContact={addContact} onDeleteContact={deleteContact} />
          </div>
          <div className="lg:col-span-3">
            <MessageComposer contacts={contacts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
