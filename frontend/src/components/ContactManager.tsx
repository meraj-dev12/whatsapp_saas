import React, { useState } from 'react';
import { Contact } from '../types';
import { UserPlusIcon, TrashIcon, LoadingSpinner } from './icons';

interface ContactManagerProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
  onDeleteContact: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ 
  contacts, 
  onAddContact, 
  onDeleteContact,
  isLoading,
  error,
  onRetry
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const E164_REGEX = /^\+[1-9]\d{1,14}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError('Name and phone number cannot be empty.');
      return;
    }
    if (!E164_REGEX.test(phone)) {
      setFormError('Phone number must be in E.164 format (e.g., +12125551234).');
      return;
    }
    setFormError('');
    setIsAdding(true);
    try {
      await onAddContact({ name, phone });
      setName('');
      setPhone('');
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlusIcon className="h-6 w-6 mr-3 text-indigo-400" />
          Add New Contact
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number (E.164)</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="+14155552671"
            />
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <button 
            type="submit" 
            disabled={isAdding}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding && <LoadingSpinner className="h-5 w-5 mr-2" />}
            {isAdding ? 'Adding...' : 'Add Contact'}
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Contact List ({contacts.length})</h2>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner className="h-8 w-8 text-indigo-400" />
            </div>
          ) : error ? (
            <div className="text-center bg-red-900/30 p-4 rounded-lg">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={onRetry}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : contacts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{contact.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onDeleteContact(contact.id)} className="text-red-400 hover:text-red-600">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-400 py-4">No contacts yet. Add one above to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;