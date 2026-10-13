import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from 'lucide-react';

export default function TiptapEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-50"><Undo className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-50"><Redo className="w-4 h-4" /></button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-lg ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><Strikethrough className="w-4 h-4" /></button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><ListOrdered className="w-4 h-4" /></button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        
        <button type="button" onClick={setLink} className={`p-2 rounded-lg ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}><LinkIcon className="w-4 h-4" /></button>
        <button type="button" onClick={addImage} className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"><ImageIcon className="w-4 h-4" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto cursor-text">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
