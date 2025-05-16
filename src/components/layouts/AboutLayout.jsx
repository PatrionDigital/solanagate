import MainLayout from "@/components/layouts/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";

// Style
import "@/styles/AboutLayout.css";

const AboutLayout = () => {
  return (
    <MainLayout>
      <main className="flex flex-col items-center px-4 py-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-3">About This Project</h2>
        <div className="mb-6 w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="italic mb-2">
            This is a placeholder About page. You can use this space to describe your application, its mission, or any information you want to share with users.
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Welcome</h3>
        <div className="mb-6 w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="mb-2">
            Welcome to our generic web application! This About page is intended as a template for your own content. Replace this text with information about your team, your goals, or anything else relevant to your project.
          </p>
          <p className="mb-2">
            No details provided yet. Stay tuned for updates!
          </p>
          <p className="mb-2">
            This project is under active development. All information here is for demonstration purposes only.
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Community Notice</h3>
        <div className="mb-6 w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="mb-1">This application is open for community feedback and collaboration.</p>
          <p className="italic">
            Placeholder text: Replace with your own community story or announcement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
          <div className="flex flex-col items-center">
            <Button tag={Link} to="#" layout="outline" className="mb-2 text-3xl p-4">
              🌐
            </Button>
            <span className="text-sm">Website</span>
          </div>
          <div className="flex flex-col items-center">
            <Button tag={Link} to="#" layout="outline" className="mb-2 text-3xl p-4">
              💬
            </Button>
            <span className="text-sm">Community</span>
          </div>
          <div className="flex flex-col items-center">
            <Button tag={Link} to="#" layout="outline" className="mb-2 text-3xl p-4">
              📢
            </Button>
            <span className="text-sm">Announcements</span>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default AboutLayout;
