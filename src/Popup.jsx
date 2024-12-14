import React from 'react';

function Popup({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-5 text-center rounded-lg shadow-md w-96">
                <p>{message}</p>
                <button
                    className="mt-3 bg-red-500 text-white p-2 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Popup;
