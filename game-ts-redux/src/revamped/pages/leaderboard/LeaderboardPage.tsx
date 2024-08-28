import ScrollToTop from "../../components/ScrollToTop";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import TableSection from "./TableSection";

export default function LeaderboardPage() {
  return (
    <div className="revamped-wrapper">
      <ScrollToTop />

      <NavigationBar />

      <main className="revamped-leaderboard-page">
        <TableSection />
      </main>

      <Footer />
    </div>
  );
}
