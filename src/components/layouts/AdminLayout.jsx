import Header from "./Header";
import Footer from "./Footer";
import PropTypes from "prop-types";

/**
 * AdminLayout: Wraps admin pages with the main app header and footer, keeping consistent layout.
 * Usage: Place your admin content inside <AdminLayout>...</AdminLayout>
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-mainBg">
      <Header />
      <main className="flex-1 pt-16 pb-16 max-w-7xl mx-auto w-full px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;
