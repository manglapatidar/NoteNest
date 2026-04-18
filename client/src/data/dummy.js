export const DUMMY_NOTES = [
  { _id: '1', title: 'Complete Calculus Integration Notes', subject: 'Mathematics', content: 'Covers all integration techniques including substitution, parts, and partial fractions...', fileUrl: null, avgRating: 4.9, saves: 234, status: 'approved', userId: { name: 'Riya Sharma' }, createdAt: '2025-03-20' },
  { _id: '2', title: 'Data Structures: Trees & Graphs', subject: 'Computer Science', content: 'Binary trees, AVL trees, BFS and DFS traversal with real examples and complexity...', fileUrl: 'file.pdf', avgRating: 4.2, saves: 89, status: 'approved', userId: { name: 'Arjun Kumar' }, createdAt: '2025-03-18' },
  { _id: '3', title: 'Organic Chemistry Reactions Cheatsheet', subject: 'Science', content: 'All named reactions with mechanisms for board exams — SN1, SN2, elimination...', fileUrl: 'file.pdf', avgRating: 4.8, saves: 412, status: 'approved', userId: { name: 'Priya Mehta' }, createdAt: '2025-03-15' },
  { _id: '4', title: 'World War II Timeline & Key Events', subject: 'History', content: 'Chronological events from 1939 to 1945 with causes, battles, and political analysis...', fileUrl: null, avgRating: 4.1, saves: 67, status: 'approved', userId: { name: 'Sahil Tiwari' }, createdAt: '2025-03-10' },
  { _id: '5', title: 'English Grammar: Tenses Complete Guide', subject: 'English', content: 'All 12 tenses explained with examples, timelines, and common mistakes to avoid...', fileUrl: null, avgRating: 4.6, saves: 156, status: 'approved', userId: { name: 'Neha Joshi' }, createdAt: '2025-03-08' },
  { _id: '6', title: 'Newton Laws & Mechanics Problems', subject: 'Physics', content: 'Laws of motion, friction, circular motion with 50 solved numerical problems...', fileUrl: 'file.pdf', avgRating: 4.7, saves: 198, status: 'approved', userId: { name: 'Vikram Singh' }, createdAt: '2025-03-05' },
  { _id: '7', title: 'Indian Geography: Rivers & Mountains', subject: 'Geography', content: 'Complete notes on major rivers, mountain ranges, climate zones and maps...', fileUrl: null, avgRating: 3.9, saves: 44, status: 'pending', userId: { name: 'Ananya Das' }, createdAt: '2025-04-01' },
  { _id: '8', title: 'Quantum Physics Basics', subject: 'Science', content: 'Wave-particle duality, Heisenberg uncertainty principle, Schrodinger equation...', fileUrl: 'file.pdf', avgRating: 4.5, saves: 103, status: 'pending', userId: { name: 'Rohan Gupta' }, createdAt: '2025-04-01' },
];

export const DUMMY_SUBJECTS = ['Mathematics', 'Computer Science', 'Science', 'History', 'English', 'Physics', 'Geography'];

export const DUMMY_COMMENTS = [
  { _id: 'c1', userId: { name: 'Arjun Kumar' }, text: 'Best integration notes I have found! Very clear explanations.', createdAt: '2025-03-22' },
  { _id: 'c2', userId: { name: 'Priya Mehta' }, text: 'Saved me before my exam. Thank you so much!', createdAt: '2025-03-21' },
  { _id: 'c3', userId: { name: 'Sahil Tiwari' }, text: 'Can you add more examples for integration by parts?', createdAt: '2025-03-20' },
];

export const DUMMY_STATS = [
  { _id: 'Math', count: 120, avgRating: 4.8 },
  { _id: 'CS', count: 90, avgRating: 4.5 },
  { _id: 'Sci', count: 95, avgRating: 4.2 },
  { _id: 'His', count: 40, avgRating: 3.9 },
  { _id: 'Eng', count: 30, avgRating: 4.1 },
];

export const DUMMY_USER = { _id: 'u1', name: 'Aisha Khan', email: 'aisha@example.com', role: 'user', createdAt: '2025-01-15' };
export const DUMMY_ADMIN = { _id: 'a1', name: 'Admin User', email: 'admin@notenest.com', role: 'admin' };
