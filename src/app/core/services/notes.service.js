export const notesService = {
  // ✅ สร้างบันทึกใหม่
  async createNote(data) {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) return [null, true];

      const json = await res.json();
      return [json, false];
    } catch (err) {
      console.error('❌ createNote error:', err);
      return [null, true];
    }
  },

  // ✅ ดึงบันทึกทั้งหมดของผู้ใช้ (ส่ง userId เป็น parameter)
  async getNotes(userId) {
    try {
      const res = await fetch(`/api/notes?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) return [null, true];

      const json = await res.json();
      return [json.notes || [], false];
    } catch (err) {
      console.error('❌ getNotes error:', err);
      return [null, true];
    }
  },

  // ✅ ดึงบันทึกเดียวตาม id
  async getNoteById(id) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) return [null, true];

      const json = await res.json();
      return [json.note, false];
    } catch (err) {
      console.error('❌ getNoteById error:', err);
      return [null, true];
    }
  },

  // ✅ ลบบันทึกตาม id
  async deleteNote(id) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      return [json, !res.ok];
    } catch (err) {
      console.error('❌ deleteNote error:', err);
      return [null, true];
    }
  },

  // ✅ แก้ไขบันทึกตาม id
  async updateNote(id, data) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      return [json.note, !res.ok];
    } catch (err) {
      console.error('❌ updateNote error:', err);
      return [null, true];
    }
  },
};
