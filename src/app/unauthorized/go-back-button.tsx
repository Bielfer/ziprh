"use client";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const GoBackButton: FC = () => {
  const router = useRouter();

  return (
    <button
      className="text-base font-medium text-primary-600 hover:text-primary-500"
      type="button"
      onClick={() => router.back()}
    >
      Voltar para página anterior
      <span aria-hidden="true"> &rarr;</span>
    </button>
  );
};

export default GoBackButton;
