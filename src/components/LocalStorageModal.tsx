import React from 'react';
import './LocalStorageModal.css';

function LocalStorageModal({ characterName, onReturn, onNewCharacter, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome Back!</h2>
        <p>You have an existing character named <strong>{characterName}</strong>.</p>
        <p>Would you like to return to this character or create a new one?</p>
        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={onReturn}>
            Return to {characterName}
          </button>
          <button className="btn btn-outline" onClick={onNewCharacter}>
            Create New Character
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalStorageModal;
