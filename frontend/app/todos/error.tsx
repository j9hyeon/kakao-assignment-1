"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TodosError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#ede9f6" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg text-center">
        <h2 className="text-xl font-bold mb-2" style={{ color: "#5b35c5" }}>
          오류가 발생했습니다
        </h2>
        <p className="text-sm text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="text-white px-6 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#5b35c5" }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
