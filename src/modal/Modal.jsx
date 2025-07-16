import React from "react";
import { useNavigate } from "react-router-dom";

const Modal = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center gradient-soft-natural  bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
        <h3 className="text-2xl text-forest-green uppercase ">Session Expired</h3>
        <p className="text-forest-green  mt-2">Your session has expired. Please log in again.</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/login")}
            className="gradient-warm-sunset text-pale-lime px-5 py-2 rounded-lg  transition cursor-pointer w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
