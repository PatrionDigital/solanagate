// src/pages/honeycomb-admin/HoneycombModules.jsx
import { HoneycombAdminPage } from "./HoneycombAdminPage";
import HoneycombDashboard from "./HoneycombDashboard";
import AdminAuth from "./AdminAuth";
import * as HoneycombUtils from "./honeycombUtils";
import AdminUserDashboard from "@/components/user/AdminUserDashboard";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileEditor from "@/components/profile/ProfileEditor";
import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileDashboard from "@/components/profile/ProfileDashboard";

// Export all Honeycomb components
export {
  HoneycombAdminPage, // Main admin page component
  HoneycombDashboard, // Dashboard component
  AdminAuth, // Authentication component
  HoneycombUtils, // Utility functions
  AdminUserDashboard, // User management dashboard
  ProfileDashboard, // Profile dashboard
  ProfileCard, // Profile card component
  ProfileEditor, // Profile editor component
  ProfileBadges, // Profile badges component
};
