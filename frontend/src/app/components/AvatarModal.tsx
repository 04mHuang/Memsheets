"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import axiosInstance from "@/app/axiosInstance";
import { CustomModalProps } from "@/app/types/index";
import ModalBase from "@/app/components/ModalBase";

// interface AvatarModalProps extends CustomModalProps {
  
// }

const AvatarModal = ({ isOpen, onClose }: CustomModalProps) => {
  const [avatars, setAvatars] = useState([]);
  useEffect(() => {
    axiosInstance.get("/sheets/avatars")
    .then(res => 
      setAvatars(res.data.avatars)
    )
    .catch(err =>
      console.error(err)
    )
  }, []);
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Choose an Avatar">
      <section className="mt-5 grid grid-cols-3 gap-5">
        {avatars.map((avatar) => (
          <Image key={avatar} src={avatar} alt={avatar} width={400} height={400} />
        ))}
      </section>
    </ModalBase>
  );
}

export default AvatarModal;