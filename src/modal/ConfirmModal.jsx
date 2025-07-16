import React from "react";
import usePerson from "../hooks/usePerson";
import CrossSvg from "../svgs/CrossSvg";

const ConfirmModal = ({ onClose, pending, error }) => {
  const { user } = usePerson();
  const name = user.user.name;
  const cardDetails = user.user.cardDetails;

  // Dummy ATM card details
  const dummyCardDetails = {
    ...cardDetails,
    cardHolderName: name.toUpperCase(),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center gradient-soft-natural bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <CrossSvg />
        </button>

        <h3 className="text-2xl text-forest-green uppercase mb-4">
          Order Confirmed
        </h3>
        <div className="space-y-4">
          <p className="text-forest-green">
            Thank you, <span className="font-semibold">{name}</span>, for your
            order!
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-sunset-orange mb-2">
              Payment Details
            </h4>
            <div className="space-y-2">
              <p className="text-forest-green">
                <span className="font-semibold">Card Number:</span>{" "}
                {dummyCardDetails.cardNumber}
              </p>
              <p className="text-forest-green">
                <span className="font-semibold">Card Holder:</span>{" "}
                {dummyCardDetails.cardHolderName}
              </p>
              <p className="text-forest-green">
                <span className="font-semibold">Expiration Date:</span>{" "}
                {dummyCardDetails.expiryDate}
              </p>
              <p className="text-forest-green">
                <span className="font-semibold">CVV:</span>{" "}
                {dummyCardDetails.cvv}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
