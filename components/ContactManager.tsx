
import React, { useState } from 'react';
import { Contact } from '../types';
import { UserPlusIcon, TrashIcon } from './icons';

interface ContactManagerProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ contacts, onAddContact, onDeleteContact }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const E164_REGEX = /^\+[1-9]\d{1,14}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone number cannot be empty.');
      return;
    }
    if (!E164_REGEX.test(phone)) {
      setError('Phone number must be in E.164 format (e.g., +12125551234).');
      return;
    }
    setError('');
    onAddContact({ name, phone });
    setName('');
    setPhone('');
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
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900">
            Add Contact
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Contact List ({contacts.length})</h2>
        <div className="max-h-96 overflow-y-auto">
          {contacts.length > 0 ? (
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
            <p className="text-center text-gray-400 py-4">No contacts found. Add one above to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
