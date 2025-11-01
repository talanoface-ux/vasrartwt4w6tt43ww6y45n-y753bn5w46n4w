import React, { useState, useEffect } from 'react';
import { Character } from '../types';

interface CharacterEditorModalProps {
  character: Character | null;
  onSave: (character: Character) => void;
  onClose: () => void;
}

const CharacterEditorModal: React.FC<CharacterEditorModalProps> = ({ character, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Character, 'id'>>({
    name: '',
    age: 18,
    imageUrl: '',
    bio: '',
    systemPrompt: '',
  });

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        age: character.age,
        imageUrl: character.imageUrl,
        bio: character.bio,
        systemPrompt: character.systemPrompt,
      });
    }
  }, [character]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharacter: Character = {
      id: character?.id || `char_${Date.now()}`,
      ...formData,
    };
    onSave(newCharacter);
  };

  // FIX: Replaced non-standard <style jsx> with a constant containing Tailwind CSS classes to fix the type error.
  const inputStyle = "mt-1 w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500";

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {character ? 'ویرایش شخصیت' : 'ساخت شخصیت جدید'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">نام</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-300">سن</label>
                <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required className={inputStyle} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">آدرس عکس (URL)</label>
                <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className={inputStyle} placeholder="https://example.com/image.png" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-slate-300">بیوگرافی کوتاه</label>
                <textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} required rows={2} className={inputStyle} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-300">دستورالعمل سیستمی (شخصیت)</label>
                <textarea name="systemPrompt" id="systemPrompt" value={formData.systemPrompt} onChange={handleChange} required rows={5} className={inputStyle} placeholder="شخصیت، لحن و دستورالعمل‌های هوش مصنوعی را اینجا تعریف کنید..." />
                <p className="text-xs text-slate-500 mt-1">این متن اصلی‌ترین بخش تعریف هویت و رفتار شخصیت است.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-700/50 px-6 py-3 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-200 hover:bg-slate-600">
              انصراف
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-rose-600 text-white font-semibold hover:bg-rose-700">
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterEditorModal;
