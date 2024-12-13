import Header from "@/components/layouts/Header"; // Reusing the Header component
import Footer from "@/components/layouts/Footer"; // Reusing the Footer component

// Style
import "@/styles/AboutLayout.css";

const AboutLayout = () => {
  return (
    <>
      <Header />
      <div className="about-layout-content">
        <h1>About Us</h1>
        <p>
          Welcome to the About page! Here&apos;s some information about our app
          and mission.
        </p>
        <p>We provide an amazing platform for users to engage and explore!</p>
      </div>
      <Footer />
    </>
  );
};

export default AboutLayout;
