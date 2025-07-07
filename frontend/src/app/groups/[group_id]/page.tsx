"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";
import Card from "@/app/components/Card";
import SearchBar from "@/app/components/SearchBar";
import axiosInstance from "@/app/axiosInstance";

const GroupSheets = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    if (group_id) {
      axiosInstance.get(`/groups/${group_id}`)
        .then(res => setSheets(res.data.sheets))
        .catch(err => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title mb-0">Sheets for groups</h1>
        <SearchBar type="group" />
      </div>
      <section className="card-grid">
        <button
          onClick={() => { router.push(`/groups/${group_id}/sheets/add`); }}
          className="create-button card"
        >
          <p>Create Sheet</p>
          <FiFilePlus className="create-icon hover-animation" />
        </button>
        {sheets.map((item, index) => (
          <Card key={index} item={item} type="sheets" />
        ))}
      </section>
    </main>
  );
}
export default GroupSheets;