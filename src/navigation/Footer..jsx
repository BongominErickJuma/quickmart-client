import React from "react";

const Footer = () => {
  return (
    <footer className="gradient-soft-natural text-pale-lime py-4 mt-10">
      <div className="px-6 mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} QuickMart. All rights reserved.</p>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <a href="#" className="hover:underline text-burnt-sienna">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline text-burnt-sienna">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
