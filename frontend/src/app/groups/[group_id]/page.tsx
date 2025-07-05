"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
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
      <h1 className="page-title">Sheets for group</h1>
      <section className="card-grid">
        <button
          onClick={() => { router.push(`/groups/${group_id}/sheets/add`); }}
          className="create-button card"
        >
          <p>Create Sheet</p>
          <Image src="/mdi_add-bold.svg" alt="plus icon" width={30} height={30} />
        </button>
        {sheets.map((item, index) => (
          <Card key={index} item={item} type="sheets" />
        ))}
      </section>
    </main>
  );
}
export default GroupSheets;