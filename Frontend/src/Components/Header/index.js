import React from "react";
import logo from "../../Assets/mmcoe.png";

function Header() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              className="img-fluid me-2"
              src={logo}
              alt="Logo MMCOE"
              style={{ width: "3rem" }}
            />
            <span style={{ fontSize: "1.5rem", fontWeight: "normal" }}>Student Result Analysis</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
