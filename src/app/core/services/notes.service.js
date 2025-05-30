export const notesService = {
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
      console.error("Error:", err);
      return [null, true];
    }
  }
};
