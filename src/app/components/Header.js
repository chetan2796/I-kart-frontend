// Header.jsx
const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold tracking-wide">ClipPilot Studio</h1>
      </div>
      <nav className="flex gap-6 text-sm font-medium">
        <button className="hover:text-purple-400 transition">Import</button>
        <button className="hover:text-purple-400 transition">Export</button>
        <button className="hover:text-purple-400 transition">Templates</button>
        <button className="hover:text-purple-400 transition">Help</button>
      </nav>
    </header>
  );
};

export default Header;