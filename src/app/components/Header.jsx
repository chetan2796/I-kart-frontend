import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm flex p-5"
      >
        <div className="container">
          <Link
            href="/dashboardSeller"
            className="btn btn-outline-primary btn-sm me-2 navbar-bra nd fw-bold text-black"
          >
            i-kart
          </Link>
        </div>

        <div className="d-flex align-items-center ms-auto">
          <ul
            className="dropdown-menu dropdown-menu-end flex"
            aria-labelledby="userDropdown"
          >
            <li>
              <Link
                href="/profile_path"
                className="btn btn-outline-primary btn-sm me-2 dropdown-item text-black"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/profile_path"
                className="btn btn-outline-primary btn-sm me-2 dropdown-item text-black"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/users_sign_out_path"
                className="btn btn-outline-primary btn-sm me-2 dropdown-item text-black"
              >
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
