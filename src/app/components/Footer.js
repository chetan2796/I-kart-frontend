// Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 px-4 py-2 flex justify-between items-center text-sm">
      <div className="flex items-center gap-4">
        <span>Timeline: 00:00 / 05:00</span>
        <span>FPS: 30</span>
      </div>
      <div className="text-xs text-gray-500">
        ClipPilot Studio v1.0.0 • © 2025
      </div>
    </footer>
  );
};

export default Footer;