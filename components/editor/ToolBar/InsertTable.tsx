import { FC, useState } from "react";
import { Editor } from "@tiptap/react";
import { BsTable } from "react-icons/bs";
import Button from "./Button";

interface Props {
  editor: Editor | null;
}

const InsertTable: FC<Props> = ({ editor }): JSX.Element => {
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [caption, setCaption] = useState("");

  const handleInsertTable = (closeAfterInsert: boolean = true) => {
    if (!editor) return;

    // Nếu có tên bảng, chèn caption trước bảng
    if (caption.trim()) {
      const captionHtml = `<p class="table-caption"><strong>Bảng:</strong> ${caption.trim()}</p>`;
      editor.chain().focus().insertContent(captionHtml).run();
    }

    // Chèn bảng
    editor
      .chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: true,
      })
      .run();

    // Đóng form sau khi chèn
    if (closeAfterInsert) {
      resetForm();
    }
  };

  const resetForm = () => {
    setVisible(false);
    setRows(3);
    setCols(3);
    setCaption("");
  };

  const hideForm = () => setVisible(false);
  const showForm = () => setVisible(true);

  if (!editor) return <></>;

  return (
    <div
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
      className="relative"
    >
      <Button
        active={editor.isActive("table")}
        onClick={visible ? hideForm : showForm}
      >
        <BsTable />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên bảng <span className="text-gray-400 text-xs">(tùy chọn)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Nhập tên bảng..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleInsertTable();
                }
              }}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số hàng
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số cột
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInsertTable(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Chèn bảng
              </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md text-sm font-medium transition-colors"
            >
              Hủy
            </button>
          </div>

          {/* Quick insert buttons */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Chèn nhanh:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRows(2);
                  setCols(2);
                  handleInsertTable();
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                2x2
              </button>
              <button
                type="button"
                onClick={() => {
                  setRows(3);
                  setCols(3);
                  handleInsertTable();
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                3x3
              </button>
              <button
                type="button"
                onClick={() => {
                  setRows(4);
                  setCols(4);
                  handleInsertTable();
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                4x4
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertTable;

