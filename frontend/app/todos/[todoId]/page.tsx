import { notFound } from "next/navigation";
import { getTodo } from "@/app/actions";
import EditTodoForm from "./components/EditTodoForm";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(todoId);
  if (!todo) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#ede9f6" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold italic text-center mb-8" style={{ color: "#5b35c5" }}>
          Todo 수정
        </h1>
        <EditTodoForm todo={todo} />
      </div>
    </div>
  );
}
