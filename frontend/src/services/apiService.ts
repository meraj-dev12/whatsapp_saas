import { Contact } from '../types';

const API_BASE_URL = '/api';

interface SendMessagePayload {
  heading: string;
  content: string;
  mediaFile: File | null;
  contacts: Contact[];
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${API_BASE_URL}/contacts`);
  return handleResponse(response);
};

export const addContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });
  return handleResponse(response);
};

export const deleteContact = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const sendBulkMessage = async (payload: SendMessagePayload): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('heading', payload.heading);
  formData.append('content', payload.content);
  formData.append('contacts', JSON.stringify(payload.contacts));
  if (payload.mediaFile) {
    formData.append('media', payload.mediaFile);
  }

  const response = await fetch(`${API_BASE_URL}/send-bulk`, {
    method: 'POST',
    body: formData,
    // Note: Don't set 'Content-Type' header manually for FormData,
    // the browser will do it automatically with the correct boundary.
  });

  return handleResponse(response);
};

export const generateAiContent = async (heading: string): Promise<{ content: string }> => {
  const response = await fetch(`${API_BASE_URL}/generate-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ heading }),
  });
  return handleResponse(response);
};