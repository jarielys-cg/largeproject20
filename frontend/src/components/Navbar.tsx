import {
  BriefcaseBusinessIcon,
  ChevronDown,
  LayoutDashboard,
  LogInIcon,
  LogOut,
  Search,
  UserCircle2,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import BusinessSignUpModal from "./forms/BusinessSignUpModal";
import LoginModal from "./forms/loginModal";

interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const username = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string).username
    : null;

  const navigate = useNavigate();
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [bizModalOpen, setBizModalOpen] = useState(false);
  const [bizLoginOpen, setBizLoginOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const syncAuthFromStorage = () => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    setUserDropdownOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleLogoClick = () => {
    navigate(isLoggedIn ? "/dashboard" : "/");
  };

  useEffect(() => {
    syncAuthFromStorage();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        businessDropdownRef.current &&
        !businessDropdownRef.current.contains(e.target as Node)
      ) {
        setBizDropdownOpen(false);
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    const handleAuthChanged = () => syncAuthFromStorage();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", handleAuthChanged);
    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleAuthChanged);
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-4 relative z-10">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={handleLogoClick}
        >
          <img src={logo} alt="BizMart logo" className="w-10 h-10" />
          <span className="text-lg font-bold text-bm-dark">
            Biz<span className="text-bm-coral">Mart</span>
          </span>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="order-3 basis-full md:order-none md:flex md:flex-1 md:max-w-2xl md:mx-4"
        >
          <div className="w-full flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-bm-coral transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses, categories, or services"
              className="w-full px-4 py-2 text-sm text-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 text-gray-500 hover:text-bm-coral transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          {!isLoggedIn && (
            <div className="relative" ref={businessDropdownRef}>
              <button
                onClick={() => setBizDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap transition-colors"
              >
                For Business
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`transition-transform ${bizDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {bizDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setBizModalOpen(true);
                      setBizDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
                  >
                    <BriefcaseBusinessIcon size={16} color="currentColor" />
                    Add Business Account
                  </button>
                  <div className="h-px bg-gray-100"></div>
                  <button
                    onClick={() => {
                      setBizLoginOpen(true);
                      setBizDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
                  >
                    <LogInIcon size={16} color="currentColor" />
                    Login to Business Account
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <button
              onClick={() => navigate("/write-review")}
              className="text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap"
            >
              Write a Review
            </button>
          )}

          {!isLoggedIn ? (
            <>
              <button
                onClick={onLoginClick}
                className="text-sm font-medium border border-gray-400 text-gray-700 hover:border-bm-coral hover:text-bm-coral px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Log In
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="text-m font-medium bg-bm-coral hover:bg-bm-coral-dark text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-bm-coral whitespace-nowrap transition-colors"
              >
                <UserCircle2 size={18} />
                {username}
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
                  >
                    <LayoutDashboard size={16} color="currentColor" />
                    Dashboard
                  </button>
                  <div className="h-px bg-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-bm-gray hover:text-bm-coral transition-colors text-left"
                  >
                    <LogOut size={16} color="currentColor" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <BusinessSignUpModal
        isOpen={bizModalOpen}
        onClose={() => setBizModalOpen(false)}
        skipAccountStep={false}
      />

      <LoginModal
        isOpen={bizLoginOpen}
        onClose={() => setBizLoginOpen(false)}
        defaultBusinessOwner={true}
        onBusinessSignUp={() => {
          setBizLoginOpen(false);
          setBizModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
