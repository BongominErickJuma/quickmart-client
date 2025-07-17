import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Number from "../assets/Number";
import usePerson from "../hooks/usePerson";
import CartSvg from "../svgs/CartSvg";
import { authService } from "../services/api";

const Navbar = () => {
  const { user, setUser } = usePerson(); // Ensure setUser is available in usePerson
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 👇 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="gradient-soft-natural shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <CartSvg />
            <h1 className="gradient-word text-2xl font-semibold">
              <NavLink to="/">QuickMart</NavLink>
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden text-burnt-sienna text-2xl">
            <Link to="/cart" className="text-burnt-sienna text-lg transition-colors">
              Cart [ <Number /> ]
            </Link>
            <button className="focus:outline-none ml-3 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Navbar Links */}
          <ul
            className={`absolute sm:static right-0 top-16 w-full sm:w-auto sm:flex sm:items-center sm:justify-center space-y-4 sm:space-y-0 sm:space-x-6 p-5 sm:p-0 shadow-md sm:shadow-none transition-all duration-300 ease-in-out ${
              menuOpen ? "block gradient-soft-natural" : "hidden"
            }`}
          >
            <li>
              <Link to="/cart" className="hidden sm:block text-burnt-sienna text-lg transition-colors">
                Cart [ <Number /> ]
              </Link>
            </li>

            <li>
              <Link to="/" className="text-burnt-sienna text-lg transition-colors">
                Products
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/my-orders" className="text-burnt-sienna text-lg transition-colors">
                  My Orders
                </Link>
              </li>
            )}

            {!user ? (
              <li>
                <Link to="/login" className="text-burnt-sienna text-lg transition-colors">
                  Login
                </Link>
              </li>
            ) : (
              <li className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img src={user?.photo} alt={user?.username} className="w-8 h-8 rounded-full border-2 border-white" />
                  <span className="text-burnt-sienna font-semibold">{user.username}</span>
                  <svg className="w-4 h-4 text-burnt-sienna" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md py-2 z-50">
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
