'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import {
  useEditor,
  EditorContent
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import 'react-toastify/dist/ReactToastify.css';
import { notesService } from "../../core/services/notes.service";
import { useSession } from 'next-auth/react'; 

export default function NewNote() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [emoji, setEmoji] = useState(null);
  const [files, setFiles] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [fileNames, setFileNames] = useState("สามารถเพิ่มไฟล์: jpg, png, jpeg");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  const getText = () => editor?.getHTML() || '';

  const onSubmit = async () => {
    const content = getText();

    if (!session?.user?.id) {
      toast.error("ไม่พบ session ผู้ใช้");
      return;
    }

    if (!content || content === '<p></p>') {
      toast.error("กรุณากรอกข้อความ");
      return;
    }

    const param = {
      text: content,
      emoji: emoji || '',
      images: base64Images,
      userId: session.user.id,
    };

    const [res, isError] = await notesService.createNote(param);

    if (isError) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } else {
      toast.success("บันทึกสำเร็จ");
      router.push('/diary/list');
    }
  };

  const handleFileChange = async (event) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast.error("ไม่สามารถเพิ่มไฟล์ประเภทอื่นได้");
      return;
    }

    const base64Promises = validFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    });

    try {
      const base64Images = await Promise.all(base64Promises);
      setFiles(validFiles);
      setBase64Images(base64Images);
      setFileNames(validFiles.map((f) => f.name).join(', '));
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }
  };

  if (status === 'loading') {
    return <div className="text-center mt-10">กำลังโหลด...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-4 text-black">เขียนบันทึกใหม่</h1>

      {editor && (
        <div className="flex flex-wrap gap-2 mb-3 bg-white p-3 rounded-xl shadow border border-gray-300">
          <button onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded-full text-sm font-bold border ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
            B
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded-full text-sm italic border ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
            I
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded-full text-sm underline border ${editor.isActive('underline') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
            U
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded-full text-sm border ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
            •
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded-full text-sm border ${editor.isActive('orderedList') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
            1.
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">Left</button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">Center</button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">Right</button>
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="เลือกสี"
            className="w-10 h-10 p-1 rounded-full border"
          />
        </div>
      )}

      <div className="bg-white min-h-[200px] border border-gray-300 rounded-xl shadow-sm p-4 text-black">
        <EditorContent editor={editor} />
      </div>

      <div className="mt-4 bg-gray-200 p-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer">
        <label htmlFor="file-upload" className="cursor-pointer truncate w-full text-black">
          📎 {fileNames}
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="m-4 flex items-center gap-2">
        <span className="text-sm text-black">วันนี้คุณรู้สึกอย่างไร?</span>
        {["😊", "😐", "😢"].map((e, i) => (
          <button
            key={i}
            className={`text-xl p-2 ${emoji === e ? "bg-gray-300 rounded" : ""}`}
            onClick={() => setEmoji(e)}
          >
            {e}
          </button>
        ))}
      </div>

      <button
        onClick={onSubmit}
        className="mt-6 w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800"
      >
        บันทึก
      </button>
    </div>
  );
}
