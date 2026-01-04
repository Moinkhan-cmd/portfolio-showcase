import { useLocation } from "react-router-dom";

export const ScrollProgress = () => {
  const location = useLocation();
  
  // Hide scroll progress on admin login page
  if (location.pathname === "/admin/login") {
    return null;
  }
  
  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent z-[100]"
      aria-hidden="true"
    />
  );
};
