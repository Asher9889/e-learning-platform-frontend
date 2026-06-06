// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Button } from './ui/button';

// const Navbar: React.FC = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const { authState, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 100);
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav
//       className={`fixed left-0 right-0 z-50 h-[70px] flex items-center justify-between px-[5%]
//       border-b border-white/10 backdrop-blur-xl transition-all duration-500 ease-out
//       ${
//         scrolled
//           ? 'top-0 translate-y-0 bg-[#12121F]/95 shadow-lg'
//           : ' bg-[#12121F]/80'
//       }`}
//     >
//       {/* Logo */}
//       <Link
//         to="/"
//         className="font-['Sora'] text-[22px] font-extrabold text-white tracking-wide"
//       >
//         E·LEARNING
//       </Link>

//       {/* Desktop Navigation */}
//       <div className="hidden md:flex items-center gap-8">
//         <Link
//           to="/#features"
//           className="text-[#B8B8D0] text-sm font-medium hover:text-white transition-colors"
//         >
//           Features
//         </Link>

//         <Link
//           to="/#courses"
//           className="text-[#B8B8D0] text-sm font-medium hover:text-white transition-colors"
//         >
//           Courses
//         </Link>

//         <Link
//           to="/"
//           className="text-[#B8B8D0] text-sm font-medium hover:text-white transition-colors"
//         >
//           About
//         </Link>
//       </div>

//       {/* Desktop Auth */}
//       <div className="hidden md:flex items-center gap-3">
//         {authState?.isAuthenticated ? (
//           <>
//             <span className="text-sm text-[#B8B8D0]">
//               Hello, {authState.user?.name?.split(' ')[0]} 👋
//             </span>

//             <Button
//               onClick={handleLogout}
//               className="px-4 py-2 border border-white/15 rounded-xl text-sm text-[#B8B8D0]
//               hover:border-white hover:text-white transition-all duration-200"
//             >
//               Sign Out
//             </Button>
//           </>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="px-5 py-2 border border-white/15 rounded-xl text-sm font-medium
//               text-[#B8B8D0] hover:border-white hover:text-white transition-all duration-200"
//             >
//               Sign In
//             </Link>

//             <Link
//               to="/login"
//               className="px-5 py-2 rounded-xl text-sm font-semibold text-white
//               bg-white/10 border border-white/15
//               hover:bg-white/20 transition-all duration-200"
//             >
//               Get Started
//             </Link>
//           </>
//         )}
//       </div>

//       {/* Mobile Menu Button */}
//       <Button
//         className="md:hidden text-white text-2xl"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         {menuOpen ? '✕' : '☰'}
//       </Button>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div
//           className="absolute top-[70px] left-0 right-0 bg-[#12121F]
//           border-b border-white/10 p-4 flex flex-col gap-3 md:hidden"
//         >
//           <Link
//             to="/#features"
//             className="text-[#B8B8D0] text-sm py-2"
//             onClick={() => setMenuOpen(false)}
//           >
//             Features
//           </Link>

//           <Link
//             to="/#courses"
//             className="text-[#B8B8D0] text-sm py-2"
//             onClick={() => setMenuOpen(false)}
//           >
//             Courses
//           </Link>

//           <Link
//             to="/"
//             className="text-[#B8B8D0] text-sm py-2"
//             onClick={() => setMenuOpen(false)}
//           >
//             About
//           </Link>

//           {authState?.isAuthenticated ? (
//             <Button
//               onClick={handleLogout}
//               className="text-left text-[#FF6B6B] text-sm py-2 font-semibold"
//             >
//               Sign Out
//             </Button>
//           ) : (
//             <Link
//               to="/login"
//               className="text-white text-sm py-2 font-semibold"
//               onClick={() => setMenuOpen(false)}
//             >
//               Sign In →
//             </Link>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;