import ProfileEditor from "@/components/ProfileEditor";

export const metadata = {
  robots: { index: false, follow: false },
  title: "You — OnlyTravelers",
  description: "How you travel, so the app can plan like you would.",
};

export default function ProfilePage() {
  return <ProfileEditor />;
}
