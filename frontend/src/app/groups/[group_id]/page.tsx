"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";

import EditButtons from "@/app/components/EditButtons";
import Card from "@/app/components/Card";
import DeletionModal from "@/app/components/DeletionModal";
import axiosInstance from "@/app/axiosInstance";
import { GSInterface } from "@/app/types";

const GroupSheets = () => {
  const router = useRouter();
  const params = useParams<{ group_id: string; }>();
  const { group_id } = params;
  const [modalOpen, setModalOpen] = useState(false);
  const [sheets, setSheets] = useState<GSInterface[]>([]);
  // Copy of sheets data to be displayed if a user searches with only whitespace
  const [originalSheets, setOriginalSheets] = useState<GSInterface[]>([]);
  const [pageTitle, setPageTitle] = useState("Sheets");

  useEffect(() => {
    if (!group_id) {
      return;
    }
    (async () => {
      try {
        const response = await axiosInstance.get(`/groups/${group_id}`);
        const result = response.data;
        setPageTitle(result.name);
        setSheets(result.sheets);
        setOriginalSheets(result.sheets);
      }
      catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // deleteSheets is basically a boolean
  const handleDelete = async (deleteSheets: number) => {
    try {
      await axiosInstance.delete(`/groups/delete/${group_id}/${deleteSheets}`)
    }
    catch (error) {
      console.error(error);
    }
    router.back();
  }

  return (
    <main className="page-container">
      <DeletionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} subject={`${pageTitle} Group`} handleDelete={handleDelete} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title mb-0">{pageTitle}</h1>
        <div className="flex gap-2 items-center">
          {/* Prevent editing and deletion of the group Miscellaneous */}
          {group_id !== "1" &&
            <EditButtons
              editMode={false}
              submit={() => router.push(`/groups/${group_id}/edit`)}
              exit={() => setModalOpen(true)}
            />
          }
        </div>
      </div>
      <section className="card-grid">
        <button
          onClick={() => { router.push(`/groups/${group_id}/sheets/add`); }}
          className="create-button card hover-animation"
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