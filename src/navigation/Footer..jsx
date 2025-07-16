import React from "react";

const Footer = () => {
  return (
    <footer className="gradient-soft-natural text-pale-lime py-4 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} QuickMart. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
