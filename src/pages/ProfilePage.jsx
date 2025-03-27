import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import './ProfilePage.css';
import './PaymentIcons.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // Payment method states
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardType: 'visa',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [activeSection, setActiveSection] = useState('personal'); // 'personal', 'address', 'payment'
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Initialize form with user data
      setName(user.name || '');
      setEmail(user.email || '');
      
      // If user has profile info in localStorage, load it
      try {
        const userProfile = JSON.parse(localStorage.getItem('userProfile_' + user.id) || '{}');
        setAddress(userProfile.address || '');
        setCity(userProfile.city || '');
        setState(userProfile.state || '');
        setZipCode(userProfile.zipCode || '');
        setPhone(userProfile.phone || '');
        setBio(userProfile.bio || '');
        setProfileImage(userProfile.profileImage || null);
        
        // Load payment methods
        const savedPaymentMethods = userProfile.paymentMethods || [];
        setPaymentMethods(savedPaymentMethods);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }, [isAuthenticated, navigate, user]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      // In a real app, this would be an API call to update user info
      // For demo purposes, we'll store the updated profile in localStorage
      
      // Update user profile in localStorage
      const updatedProfile = {
        address,
        city,
        state,
        zipCode,
        phone,
        bio,
        profileImage,
        paymentMethods
      };
      
      localStorage.setItem('userProfile_' + user.id, JSON.stringify(updatedProfile));
      
      // Update users array in localStorage to update the name
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].name = name;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        currentUser.name = name;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      setSuccessMessage(t('profilePage.updateSuccess', 'Profile updated successfully!'));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError(t('profilePage.updateError', 'Failed to update profile. Please try again.'));
    }
  };
  
  // Handle adding a new payment method
  const handleAddPayment = () => {
    setShowAddPayment(true);
  };
  
  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save new payment method
  const handleSavePayment = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPayment.cardNumber || !newPayment.cardName || 
        !newPayment.expiryMonth || !newPayment.expiryYear || !newPayment.cvv) {
      setError(t('profilePage.fillAllFields', 'Please fill in all payment fields'));
      return;
    }
    
    // Format card number for display (hide most digits)
    const lastFour = newPayment.cardNumber.slice(-4);
    const displayNumber = `**** **** **** ${lastFour}`;
    
    const paymentMethod = {
      id: Date.now().toString(),
      cardType: newPayment.cardType,
      cardNumber: displayNumber,
      cardName: newPayment.cardName,
      expiry: `${newPayment.expiryMonth}/${newPayment.expiryYear}`
    };
    
    setPaymentMethods([...paymentMethods, paymentMethod]);
    setShowAddPayment(false);
    setNewPayment({
      cardType: 'visa',
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    setSuccessMessage('Payment method added successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Remove payment method
  const handleRemovePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    setSuccessMessage('Payment method removed successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Change active section
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  
  return (
    <div className="profile-container">
      <div className="profile-form-container">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <Avatar name={name} size="large" className="profile-avatar" />
          </div>
          <div className="profile-title">
            <h2>My Profile</h2>
            <p className="profile-subtitle">Manage your account information</p>
          </div>
        </div>
        
        {error && <div className="profile-error">{error}</div>}
        {successMessage && <div className="profile-success">{successMessage}</div>}
        
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeSection === 'personal' ? 'active' : ''}`}
            onClick={() => handleSectionChange('personal')}
          >
            <i className="fas fa-user"></i> Personal Info
          </button>
          <button 
            className={`profile-tab ${activeSection === 'address' ? 'active' : ''}`}
            onClick={() => handleSectionChange('address')}
          >
            <i className="fas fa-home"></i> Address
          </button>
          <button 
            className={`profile-tab ${activeSection === 'payment' ? 'active' : ''}`}
            onClick={() => handleSectionChange('payment')}
          >
            <i className="fas fa-credit-card"></i> Payment Methods
          </button>
        </div>
        
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          {activeSection === 'personal' && (
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="profile-image-upload">
                <div className="current-avatar">
                  <Avatar name={name} image={profileImage} size="large" />
                </div>
                <div className="upload-controls">
                  <h4>Profile Picture</h4>
                  <p className="field-note">Upload a profile picture or use your initials</p>
                  <input 
                    type="file" 
                    id="profile-image" 
                    className="file-input" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="profile-image" className="upload-button">
                    <i className="fas fa-upload"></i> Upload Image
                  </label>
                  {profileImage && (
                    <button 
                      type="button" 
                      className="remove-image-button"
                      onClick={() => setProfileImage(null)}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <span className="field-note">Email cannot be changed</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself"
                  rows="4"
                  className="bio-textarea"
                ></textarea>
              </div>
              
              <button type="submit" className="profile-button">Save Changes</button>
            </div>
          )}
          
          {/* Address Section */}
          {activeSection === 'address' && (
            <div className="form-section">
              <h3>Address Information</h3>
              
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
              
              <button type="submit" className="profile-button">Save Changes</button>
            </div>
          )}
          
          {/* Payment Methods Section */}
          {activeSection === 'payment' && (
            <div className="form-section">
              <h3>Payment Methods</h3>
              
              <div className="payment-methods">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map(method => (
                    <div key={method.id} className="payment-card">
                      <div className="payment-card-info">
                        <div className="payment-card-icon">
                          <i className={`fab fa-${method.cardType.toLowerCase()}`}></i>
                        </div>
                        <div className="payment-card-details">
                          <h4>{method.cardName}</h4>
                          <div className="payment-card-number">{method.cardNumber}</div>
                          <div className="payment-card-expiry">Expires: {method.expiry}</div>
                        </div>
                      </div>
                      <div className="payment-card-actions">
                        <button 
                          type="button" 
                          onClick={() => handleRemovePayment(method.id)}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No payment methods added yet.</p>
                )}
                
                {!showAddPayment && (
                  <button 
                    type="button" 
                    className="add-payment-button" 
                    onClick={handleAddPayment}
                  >
                    <i className="fas fa-plus"></i> Add New Payment Method
                  </button>
                )}
                
                {showAddPayment && (
                  <div className="add-payment-form">
                    <h4>Add New Payment Method</h4>
                    
                    <div className="form-group">
                      <label htmlFor="cardType">Card Type</label>
                      <select
                        id="cardType"
                        name="cardType"
                        value={newPayment.cardType}
                        onChange={handlePaymentChange}
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                        <option value="discover">Discover</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={newPayment.cardName}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={newPayment.cardNumber}
                        onChange={handlePaymentChange}
                        required
                        placeholder="**** **** **** ****"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryMonth">Expiry Month</label>
                        <select
                          id="expiryMonth"
                          name="expiryMonth"
                          value={newPayment.expiryMonth}
                          onChange={handlePaymentChange}
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1;
                            return (
                              <option key={month} value={month < 10 ? `0${month}` : month}>
                                {month < 10 ? `0${month}` : month}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="expiryYear">Expiry Year</label>
                        <select
                          id="expiryYear"
                          name="expiryYear"
                          value={newPayment.expiryYear}
                          onChange={handlePaymentChange}
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={newPayment.cvv}
                          onChange={handlePaymentChange}
                          required
                          maxLength="4"
                          placeholder="***"
                        />
                      </div>
                    </div>
                    
                    <div className="payment-form-actions">
                      <button 
                        type="button" 
                        className="profile-button" 
                        onClick={handleSavePayment}
                      >
                        Save Payment Method
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={() => setShowAddPayment(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;