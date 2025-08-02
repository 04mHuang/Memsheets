"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import axiosInstance from "@/app/axiosInstance";
import { CustomModalProps } from "@/app/types/index";
import ModalBase from "@/app/components/ModalBase";

interface AvatarModalProps extends CustomModalProps {
  avatar: string;
  setAvatar: (avatar: string) => void;
}

const AvatarModal = ({ isOpen, onClose, avatar, setAvatar }: AvatarModalProps) => {
  const [avatars, setAvatars] = useState([]);
  // Save user's avatar selection without setting avatar in SheetForm (parent component)
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  useEffect(() => {
    axiosInstance.get("/sheets/avatars")
      .then(res =>
        setAvatars(res.data.avatars)
      )
      .catch(err =>
        console.error(err)
      )
  }, []);

  const handleSave = () => {
    if (selectedAvatar !== avatar) {
      setAvatar(selectedAvatar);
    }
    onClose();
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Choose an Avatar">
      <section className="mt-5 grid grid-cols-3 gap-5">
        {avatars.map((avatar) => (
          <button key={avatar} onClick={() => setSelectedAvatar(avatar)}>
            <Image src={avatar} alt={avatar} width={400} height={400} />
          </button>
        ))}
      </section>
      <div className="mt-8 flex justify-between">
        <button
          onClick={onClose}
          className="border-light-foreground border-1 px-4 py-2 rounded-sm cursor-pointer hover:bg-foreground/[0.1] hover-animation"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-support border-1 border-dark-support px-4 py-2 rounded-sm cursor-pointer hover:brightness-120 hover-animation"
        >
          Save
        </button>
      </div>
    </ModalBase>
  );
}

export default AvatarModal;