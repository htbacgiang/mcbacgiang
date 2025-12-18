import { FC, useEffect, useState, useRef } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TipTapImage from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "../editor/ToolBar";
import EditLink from "../editor/Link/EditLink";
import EditImage from "../editor/Image/EditImage";
import GalleryModal, { ImageSelectionResult } from "../editor/GalleryModal";
import axios from "axios";

interface Props {
  content: string; // Initial content value
  onChange: (content: string) => void; // Callback to update content in parent
}

const Editor: FC<Props> = ({ content, onChange }): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const isInternalUpdateRef = useRef(false);
  const previousContentRef = useRef<string>("");

  const fetchImages = async () => {
    const { data } = await axios("/api/image");
    setImages(data.images);
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);
    const formData = new FormData();

    // Hỗ trợ cả 2 kiểu: chỉ File hoặc object { file, altText }
    if (typeof imageData === "object" && "file" in imageData && "altText" in imageData) {
      formData.append("image", imageData.file);
      formData.append("altText", imageData.altText);
    } else {
      formData.append("image", imageData as File);
      formData.append("altText", "");
    }

    const { data } = await axios.post("/api/image", formData);
    setUploading(false);
    setImages([data, ...images]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: "",
        },
      }),
      Placeholder.configure({
        placeholder: "Viết mô tả sản phẩm chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
        allowBase64: true,
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            "data-show-caption": {
              default: "true",
              parseHTML: (element) => element.getAttribute("data-show-caption"),
              renderHTML: (attributes) => {
                if (!attributes["data-show-caption"]) {
                  return {};
                }
                return {
                  "data-show-caption": attributes["data-show-caption"],
                };
              },
            },
          };
        },
      }),
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          "blog prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full",
      },
    },
    content: content, // Set initial content
    onUpdate: ({ editor }) => {
      // Đánh dấu đây là cập nhật nội bộ (user đang nhập) để tránh vòng lặp đồng bộ
      isInternalUpdateRef.current = true;
      const newContent = editor.getHTML();
      previousContentRef.current = newContent;
      onChange(newContent); // Update parent on content change
      // Reset flag sau 1 tick
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run();
  };

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();

      // Bỏ qua nếu đây là cập nhật nội bộ (user đang gõ)
      if (isInternalUpdateRef.current) {
        return;
      }

      // Chỉ đồng bộ nếu content từ ngoài khác editor và khác lần sync trước
      if (currentContent !== content && content !== previousContentRef.current) {
        if (editor.isFocused) {
          // Người dùng đang nhập, không đè nội dung
          return;
        }

        const { from, to } = editor.state.selection;

        editor.commands.setContent(content, false);
        previousContentRef.current = content;

        setTimeout(() => {
          if (editor && !editor.isDestroyed) {
            const docSize = editor.state.doc.content.size;
            const safeFrom = Math.min(from, docSize);
            const safeTo = Math.min(to, docSize);
            editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
          }
        }, 0);
      } else if (currentContent === content) {
        previousContentRef.current = content;
      }
    }
  }, [content, editor]);

  return (
    <>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition">
        {/* Toolbar cố định giống Q8Design */}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
          <ToolBar
            editor={editor}
            onOpenImageClick={() => setShowGallery(true)}
          />
        </div>

        {/* Khu vực nội dung cuộn được */}
        <div className="overflow-y-auto max-h-[700px] p-4">
          {editor ? (
            <>
              <EditLink editor={editor} />
              <EditImage editor={editor} />
            </>
          ) : null}
          <EditorContent
            editor={editor}
            className="min-h-[300px] prose max-w-full mx-auto focus:outline-none"
          />
        </div>
      </div>

      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
        uploading={uploading}
        images={images}
      />
    </>
  );
};

export default Editor;