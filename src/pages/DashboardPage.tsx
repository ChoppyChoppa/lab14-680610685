import UserRegisterCard from "../components/UserRegisterCard";
import { useOutletContext } from "react-router";
import type { MainLayoutContext } from "../layout/MainLayout";

export default function DashboardPage() {
  const { registrants } = useOutletContext<MainLayoutContext>();

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {registrants.length === 0 ? (
        <p>ยังไม่มีผู้ลงทะเบียน</p>
      ) : (
        <>
          <p>ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</p>
          <div className="row g-3">
            {registrants.map((reg) => (
              <div className="col-12" key={reg.id}>
                <UserRegisterCard registrant={reg} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
