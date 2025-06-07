'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notesService } from '@/app/core/services/notes.service';

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [emoji, setEmoji] = useState('');
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

  useEffect(() => {
    const fetchData = async () => {
      const [note, isError] = await notesService.getNoteById(id);
      if (!isError && note) {
        editor?.commands.setContent(note.text);
        setEmoji(note.emoji);
        setBase64Images(note.images || []);
        setFileNames(note.images?.length ? `อัปโหลดแล้ว ${note.images.length} รูป` : "สามารถเพิ่มไฟล์: jpg, png, jpeg");
      }
    };
    if (editor) fetchData();
  }, [editor, id]);

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
      const base64 = await Promise.all(base64Promises);
      setFiles(prev => [...prev, ...validFiles]);
      setBase64Images(prev => [...prev, ...base64]);
      const total = base64Images.length + base64.length;
      setFileNames(total ? `อัปโหลดแล้ว ${total} รูป` : "สามารถเพิ่มไฟล์: jpg, png, jpeg");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }
  };

  const handleRemoveImage = (index) => {
    const updated = base64Images.filter((_, i) => i !== index);
    setBase64Images(updated);
    setFileNames(updated.length ? `อัปโหลดแล้ว ${updated.length} รูป` : "สามารถเพิ่มไฟล์: jpg, png, jpeg");
  };

  const onSubmit = async () => {
    const content = editor?.getHTML();
    if (!content || content === '<p></p>') {
      toast.error("กรุณากรอกข้อความ");
      return;
    }

    const updatedNote = {
      text: content,
      emoji: emoji || '',
      images: base64Images,
    };

    const [_, isError] = await notesService.updateNote(id, updatedNote);
    if (isError) {
      toast.error("แก้ไขไม่สำเร็จ");
    } else {
      toast.success("บันทึกการแก้ไขสำเร็จ");
      setTimeout(() => router.push(`/diary/view/${id}`), 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-4 text-black">✏️ แก้ไขบันทึก</h1>

      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-2 mb-3 bg-white p-3 rounded-xl shadow border border-gray-300">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded-full text-sm font-bold border ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded-full text-sm italic border ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>I</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-3 py-1 rounded-full text-sm underline border ${editor.isActive('underline') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>U</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-3 py-1 rounded-full text-sm border ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>•</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-3 py-1 rounded-full text-sm border ${editor.isActive('orderedList') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>1.</button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">ซ้าย</button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">กลาง</button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 border">ขวา</button>
          <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} title="เลือกสี" className="w-10 h-10 p-1 rounded-full border" />
        </div>
      )}

      {/* Editor */}
      <div className="bg-white min-h-[200px] border border-gray-300 rounded-xl shadow-sm p-4 text-black">
        <EditorContent editor={editor} />
      </div>

      {/* Upload */}
      <div className="mt-4 bg-gray-200 p-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer">
        <label htmlFor="file-upload" className="cursor-pointer truncate w-full text-black">📎 {fileNames}</label>
        <input id="file-upload" type="file" multiple accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleFileChange} />
      </div>

      {/* แสดงรูปที่อัปโหลด */}
      {base64Images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {base64Images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`uploaded-${index}`} className="w-full h-32 object-cover rounded-lg border" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs hover:bg-opacity-80"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji */}
      <div className="m-4 flex items-center gap-2">
        <span className="text-sm text-black">วันนี้คุณรู้สึกอย่างไร?</span>
        {["😊", "😐", "😢"].map((e, i) => (
          <button key={i} className={`text-xl p-2 ${emoji === e ? "bg-gray-300 rounded" : ""}`} onClick={() => setEmoji(e)}>{e}</button>
        ))}
      </div>

      {/* Submit */}
      <button onClick={onSubmit} className="mt-6 w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800">
        บันทึกการแก้ไข
      </button>

      {/* Cancel */}
      <button onClick={() => router.push(`/diary/view/${id}`)} className="mt-2 w-full bg-gray-200 text-black p-3 rounded-lg font-semibold hover:bg-gray-300">
        ย้อนกลับ
      </button>
    </div>
  );
}
