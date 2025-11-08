import React from 'react';

function LocalStorageModal({ characterName, onReturn, onNewCharacter, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-parchment rounded-xl p-6 md:p-8 max-w-[500px] w-full shadow-parchment-lg animate-[modalFadeIn_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-title text-2xl md:text-3xl font-bold text-brown-accent mt-0 mb-4">Welcome Back!</h2>
        <p className="font-body text-lg leading-relaxed mb-4 text-brown-text">
          You have an existing character named <strong className="text-brown-accent font-semibold">{characterName}</strong>.
        </p>
        <p className="font-body text-lg leading-relaxed mb-4 text-brown-text">
          Would you like to return to this character or create a new one?
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            className="flex-1 bg-brown-accent text-parchment-light px-6 py-3 rounded-ornate font-body font-semibold hover:bg-brown-medium transition-all duration-200 hover:-translate-y-0.5 shadow-parchment"
            onClick={onReturn}
          >
            Return to {characterName}
          </button>
          <button
            className="flex-1 bg-transparent border-2 border-brown-accent text-brown-accent px-6 py-3 rounded-ornate font-body font-semibold hover:bg-brown-accent hover:text-parchment-light transition-all duration-200"
            onClick={onNewCharacter}
          >
            Create New Character
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalStorageModal;
