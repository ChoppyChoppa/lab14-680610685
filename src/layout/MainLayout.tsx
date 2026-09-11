import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import type { Registrant } from "../libs/Registrant";

const STORAGE_KEY = "registrants";

export type MainLayoutContext = {
  registrants: Registrant[];
  addRegistrant: (registrant: Registrant) => void;
};

export default function MainLayout() {
  const [registrants, setRegistants] = useState<Registrant[]>(() => {
    const savedRegistrants = localStorage.getItem(STORAGE_KEY);

    if (!savedRegistrants) return [];

    try {
      return JSON.parse(savedRegistrants) as Registrant[];
    } catch {
      return [];
    }
  });

  const addRegistrant = (registrants: Registrant) => {
    setRegistants((current) => {
      const updateRegistrants = [...current, registrants];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updateRegistrants));
      return updateRegistrants;
    });
  };
  return (
    <div className="container-fluid min-vh-100">
      <div className="row h-100">
        <div className="col-2 col-md-2 p-0">
          {/* Sidebar ซ้าย */}
          <Sidebar />
        </div>
        <div className="col-10 col-md-10 p-0">
          {/* Header ด้านบน */}
          <Header />

          {/* เนื้อหาหลัก */}
          <main className="flex-grow-1 p-4 min-vh-100">
            <Outlet context={{ registrants, addRegistrant }} />
          </main>

          {/* Footer ด้านล่าง */}
          <Footer
            year="2026"
            fullName="Nontanun Hinmalai"
            studentId="680610685"
          />
        </div>
      </div>
    </div>
  );
}
