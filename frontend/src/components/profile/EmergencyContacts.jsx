import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Input from '../common/Input';

const EmergencyContacts = () => {
  const { user, updateEmergencyContacts } = useAuth();
  const [contacts, setContacts] = useState(user?.emergencyContacts || []);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relation: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedContacts = [...contacts, formData];
      await updateEmergencyContacts(user.userId, updatedContacts);
      setContacts(updatedContacts);
      setIsAddingContact(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        relation: ''
      });
    } catch (error) {
      console.error('Failed to add contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedContacts = contacts.map((contact, index) => 
        index === isEditing ? formData : contact
      );
      await updateEmergencyContacts(user.userId, updatedContacts);
      setContacts(updatedContacts);
      setIsEditing(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        relation: ''
      });
    } catch (error) {
      console.error('Failed to update contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (index) => {
    try {
      const updatedContacts = contacts.filter((_, i) => i !== index);
      await updateEmergencyContacts(user.userId, updatedContacts);
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const startEditing = (index) => {
    setFormData(contacts[index]);
    setIsEditing(index);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Trusted Emergency Contacts</h2>
          <p className="text-gray-500 text-sm">These contacts will receive alerts when you trigger an SOS.</p>
        </div>
      </div>
      
      {contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {contact.phone} • {contact.relation}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => startEditing(index)}
                    className="text-gray-500 hover:text-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteContact(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No emergency contacts added yet.</p>
      )}
      
      <button
        onClick={() => setIsAddingContact(true)}
        className="flex items-center text-primary-600 mt-4 hover:text-primary-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add New Contact
      </button>
      
      <Modal
        isOpen={isAddingContact}
        onClose={() => setIsAddingContact(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleAddContact}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contact name"
            required
          />
          
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
          
          <Input
            label="Relationship"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            placeholder="Family, Friend, etc."
            required
          />
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsAddingContact(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </Modal>
      
      <Modal
        isOpen={isEditing !== null}
        onClose={() => setIsEditing(null)}
        title="Edit Emergency Contact"
      >
        <form onSubmit={handleEditContact}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contact name"
            required
          />
          
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
          
          <Input
            label="Relationship"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            placeholder="Family, Friend, etc."
            required
          />
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsEditing(null)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default EmergencyContacts;
