import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      {/* <nav>
        <ul>
          
          
          <li>
            <Link to="/contact">Contact</Link>
          </li> 
        </ul>
      </nav> */}

      <Outlet />
    </>
  )
};

export default Layout;