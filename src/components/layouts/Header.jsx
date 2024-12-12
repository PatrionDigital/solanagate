import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>My dApp</h1>
        <nav>
          <ul style={styles.navList}>
            <li>
              <Link to="/" style={styles.navItem}>
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#282c34",
    color: "white",
    padding: "10px 0",
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
  },
  navItem: {
    color: "white",
    marginLeft: "20px",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default Header;
